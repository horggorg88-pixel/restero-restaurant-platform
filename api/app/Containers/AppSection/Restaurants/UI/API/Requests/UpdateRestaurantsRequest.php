<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Requests;

use App\Ship\Parents\Requests\Request as ParentRequest;

class UpdateRestaurantsRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
    ];

    protected array $decode = [
        'id'
    ];

    protected array $urlParameters = [
        'id'
    ];

    public function rules(): array
    {
        return [
            'name' => 'required',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
