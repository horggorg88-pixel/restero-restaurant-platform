<?php

namespace App\Containers\AppSection\Room\UI\API\Requests;

use App\Ship\Parents\Requests\Request as ParentRequest;

class FindRoomByIdRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    protected array $decode = [
        'id',
    ];

    protected array $urlParameters = [
        'id',
    ];

    public function rules(): array
    {
        return [
            // 'id' => 'required',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
