<?php

namespace App\Containers\AppSection\Booking\UI\API\Requests;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Parents\Requests\Request as ParentRequest;
use Illuminate\Support\Facades\Auth;

class ListBookingsRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
    ];

    protected array $decode = [
        'room_id',
        'table_id'
    ];

    protected array $urlParameters = [

    ];

    public function rules(): array
    {
        return [
            'booking_date' => 'required|date',
            'restaurant_id' => 'required|integer|exists:restaurants,id',
            'room_id' => 'nullable|integer',
            'table_id' => 'nullable|integer',
            'client_phone' => 'nullable|string',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation() {
        if(Auth::user()->restaurant instanceof Restaurant) {
            $this->merge([
                'restaurant_id' => Auth::user()->restaurant->id
            ]);
        }
    }
}
