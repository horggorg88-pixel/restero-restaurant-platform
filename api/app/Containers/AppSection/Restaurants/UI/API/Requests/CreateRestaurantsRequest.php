<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Requests;

use App\Ship\Parents\Requests\Request as ParentRequest;

class CreateRestaurantsRequest extends ParentRequest
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
            'name' => 'required|string|max:191|unique:restaurants,name',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
