<?php

namespace App\Containers\AppSection\Booking\UI\API\Requests\Traits;

use Carbon\Carbon;
use Carbon\Exceptions\InvalidFormatException;

trait PrepareBookingData
{
    protected function prepareForValidation()
    {
        try {
            $booking_time_to = Carbon::make($this->count_booking_time);
        }
        catch (InvalidFormatException $e) {
            $booking_time_to = Carbon::make($this->count_booking_time.":00");
        }

        $bookingTimeToFromRequest = Carbon::make($this->booking_time)
            ->addHours($booking_time_to->hour)
            ->addMinutes($booking_time_to->minute);

        $this->merge([
            'booking_time_to' => $bookingTimeToFromRequest->format('H:i'),
            'count_booking_time' => $bookingTimeToFromRequest->format('H:i')
        ]);

        if(isset($this->table_ids) && is_array($this->table_ids)) {
            $this->table_ids = $this->decodeArray($this->table_ids);
        }



    }
}