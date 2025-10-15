<?php

namespace App\Containers\AppSection\Booking\Rules;

use App\Containers\AppSection\Booking\Data\Enums\BookingStatuses;
use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class CheckBookingTime implements ValidationRule
{

    public function __construct(
        private $data
    )
    {
    }

    /**
     * Run the validation rule.
     *
     * @param \Closure(string): PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

//        $isBlocked = $this->checkStartAndEndWorkingTime($value);
//        if($isBlocked) {
//            $fail("The time " . $value . " or ".$this->data['count_booking_time']." do not fall within the restaurant's operating range");
//        }

        $bookingRepository = app(BookingRepository::class);

        $bookingTimeToFromRequest = Carbon::make($this->data['count_booking_time']);



        $ifExistBooking = $bookingRepository->scopeQuery(function ($query) use ($value, $bookingTimeToFromRequest) {

            $scopeQuery = $query
                ->whereIn('status', [BookingStatuses::Actual->value, BookingStatuses::InProcess])
                ->where('room_id', $this->data['room_id'])
                ->where('table_id', $this->data['table_id'])
                ->where('booking_date', Carbon::make($this->data['booking_date']))
                ->where(function ($bookingTimeQuery) use ($value, $bookingTimeToFromRequest) {
                    return $bookingTimeQuery
                        ->whereBetween('booking_time', [
                            Carbon::make($value)->format('H:i:s'),
                            $bookingTimeToFromRequest->format('H:i:s')
                        ])
                        ->orWhereBetween('booking_time_to', [
                            Carbon::make($value)->format('H:i:s'),
                            $bookingTimeToFromRequest->format('H:i:s')
                        ]);
                });

            if (isset($this->data['id'])) {

                $iDs = [$this->data['id']];
                if(isset($this->data['composite']) && count($this->data['composite']) > 0) {
                    $iDs = array_merge($iDs, $this->data['composite']);
                }

                $scopeQuery->whereNotIn('id', $iDs);
            }
            return $scopeQuery;

        })->exists();


        if ($ifExistBooking) {
            $fail("The date " . $this->data['booking_date'] . " " . $value . " booked");
        }

    }


    protected function checkStartAndEndWorkingTime($value): bool
    {
        $roomRepository = app(RoomRepository::class);
        $room = $roomRepository->find($this->data['room_id']);
        $bookingDate = Carbon::make($value);
        $bookingTimeToFromRequest = Carbon::make($this->data['count_booking_time']);
        if ($room->restaurant instanceof Restaurant) {
            $restStartTimeWork = Carbon::make($room->restaurant->start_time);
            $restEndTimeWork = Carbon::make($room->restaurant->end_time);
            if($bookingDate->lessThan($restStartTimeWork)) {
                return true;
            }
            if($bookingTimeToFromRequest->greaterThan($restEndTimeWork)) {
                return true;
            }
            return false;
        }
        return true;
    }
}
