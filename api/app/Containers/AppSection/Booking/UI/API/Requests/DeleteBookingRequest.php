<?php

namespace App\Containers\AppSection\Booking\UI\API\Requests;

use App\Ship\Parents\Requests\Request as ParentRequest;

class DeleteBookingRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
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
