<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Requests;

use App\Ship\Parents\Requests\Request as ParentRequest;

class ListRestaurantsRequest extends ParentRequest
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

        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
