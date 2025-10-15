<?php

namespace App\Containers\AppSection\Booking\UI\API\Requests;

use App\Containers\AppSection\Booking\Data\Enums\BookingStatuses;
use App\Ship\Parents\Requests\Request as ParentRequest;
use Illuminate\Validation\Rule;

class ChangeStatusBookingRequest extends ParentRequest
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
             'status' => ['required', Rule::in(BookingStatuses::toArray())],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
