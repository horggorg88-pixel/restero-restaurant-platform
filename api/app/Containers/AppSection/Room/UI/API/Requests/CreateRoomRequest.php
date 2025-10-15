<?php

namespace App\Containers\AppSection\Room\UI\API\Requests;

use App\Ship\Parents\Requests\Request as ParentRequest;

class CreateRoomRequest extends ParentRequest
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
            'name' => 'required|string',
            'comment' => 'nullable|string',
            'restaurant_id' => 'nullable|integer|exists:restaurants,id',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
