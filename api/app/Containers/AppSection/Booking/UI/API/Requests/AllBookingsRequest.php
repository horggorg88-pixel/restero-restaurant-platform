<?php

namespace App\Containers\AppSection\Booking\UI\API\Requests;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Parents\Requests\Request as ParentRequest;
use Illuminate\Support\Facades\Auth;

class AllBookingsRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
    ];

    protected array $decode = [

    ];

    protected array $urlParameters = [

    ];

    public function rules(): array
    {
        return [
            'booking_date_from' => 'nullable|date_format:Y-m-d',
            'booking_date_to' => 'nullable|date_format:Y-m-d',
            'restaurant_id' => 'required|integer|exists:restaurants,id',
            'query' => 'nullable|string',
            'status' => 'nullable|integer',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if (!$this->restaurant_id && Auth::user()->restaurant instanceof Restaurant) {
            $this->merge([
                'restaurant_id' => Auth::user()->restaurant->id
            ]);
        }

    }

}
