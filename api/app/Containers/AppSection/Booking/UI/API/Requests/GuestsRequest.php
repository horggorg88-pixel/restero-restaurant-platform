<?php

namespace App\Containers\AppSection\Booking\UI\API\Requests;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Parents\Requests\Request as ParentRequest;
use Illuminate\Support\Facades\Auth;

class GuestsRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
    ];

    protected array $decode = [
        'restaurant_id'
    ];

    protected array $urlParameters = [

    ];

    public function rules(): array
    {
        return [
            'booking_date_from' => 'nullable|date_format:Y-m-d',
            'booking_date_to' => 'nullable|date_format:Y-m-d',
            'restaurant_id' => 'nullable|integer|exists:restaurants,id',
            'search' => 'nullable|string'
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {

    }

}
