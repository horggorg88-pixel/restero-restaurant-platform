<?php

namespace App\Containers\AppSection\Booking\UI\API\Requests;

use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\Rules\CheckBookingTime;
use App\Ship\Parents\Requests\Request as ParentRequest;
use Carbon\Carbon;
use Carbon\Exceptions\InvalidFormatException;

class RestoreBookingRequest extends ParentRequest
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
             'booking_time' => ['required', new CheckBookingTime(
                 [
                     'room_id' => $this->room_id,
                     'table_id' => $this->table_id,
                     'booking_date' => $this->booking_date,
                     'count_booking_time' => $this->count_booking_time,
                     'id' => $this->id
                 ]),
             ],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $bookingRepository = app(BookingRepository::class);
        $booking = $bookingRepository->find($this->id);
        if ($booking instanceof Booking) {
            $this->merge([
                'booking_time' => $booking->booking_time,
                'room_id' => $booking->room_id,
                'table_id' => $booking->table_id,
                'booking_date' => $booking->booking_date,
                'count_booking_time' => $booking->booking_time_to,
                'booking_time_to' => $booking->booking_time_to,
                'id' => $this->id
            ]);
        }
    }
}
