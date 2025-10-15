<?php

namespace App\Containers\AppSection\Booking\UI\API\Requests;

use App\Containers\AppSection\Booking\Rules\CheckBookingTime;
use App\Containers\AppSection\Booking\Rules\CheckCountPlace;
use App\Containers\AppSection\Booking\UI\API\Requests\Traits\PrepareBookingData;
use App\Ship\Parents\Requests\Request as ParentRequest;


class CreateBookingRequest extends ParentRequest
{

    use PrepareBookingData;

    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
    ];

    protected array $decode = [
        'room_id'
    ];

    protected array $urlParameters = [

    ];

    public function rules(): array
    {
        return [
            'booking_date' => 'required|date_format:Y-m-d',
            'room_id' => 'required|integer|exists:rooms,id',
            //'table_id' => 'required|integer|exists:tables,id',
            'count_people' => ['required','integer', new CheckCountPlace($this->table_ids)],
            'table_ids' => ['required','array'],
            'client_name' => 'required|string',
            'client_phone' => 'required|string|starts_with:7,8,+',
            'comment' => 'nullable|string',
            'count_booking_time' => 'required|date_format:H:i',
//            'booking_time' => ['required', 'date_format:H:i', new CheckBookingTime(
//                [
//                    'room_id' => $this->room_id,
//                    'table_id' => $this->table_id,
//                    'booking_date' => $this->booking_date,
//                    'count_booking_time' => $this->count_booking_time,
//                ]),
//            ],
            'booking_time' => 'required|date_format:H:i'
        ];
    }



    public function authorize(): bool
    {
        return true;
    }
}
