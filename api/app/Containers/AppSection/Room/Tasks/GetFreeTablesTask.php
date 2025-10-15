<?php

namespace App\Containers\AppSection\Room\Tasks;


use App\Containers\AppSection\Booking\Data\Enums\BookingStatuses;
use App\Containers\AppSection\Room\UI\API\Requests\GetFreeTablesRequest;

use App\Containers\AppSection\Table\Data\Repositories\TableRepository;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Carbon\Carbon;


class GetFreeTablesTask extends ParentTask
{
    public function __construct(
        protected readonly TableRepository $repository,
    ) {
    }

    /**
     */
    public function run(GetFreeTablesRequest $request): mixed
    {

        $request->booking_time = $request->booking_date . ' ' . $request->booking_time;
        $request->count_booking_time = $request->booking_date . ' ' . $request->count_booking_time;

        $bookingTime = Carbon::createFromFormat('Y-m-d H:i', $request->booking_time);
        $count_booking_time = Carbon::createFromFormat('Y-m-d H:i', $request->count_booking_time);
        $bookingTimeTo = Carbon::createFromFormat('Y-m-d H:i', $request->booking_time)
            ->addHours($count_booking_time->hour)
            ->addMinutes($count_booking_time->minute);




        $tables = $this->repository->scopeQuery(function($query) use ($request, $bookingTime, $bookingTimeTo) {
            return $query
                ->where('room_id', $request->room_id);
        })->orderBy('number')->all();
        foreach($tables as $key => $table) {
            $bookings = $table->bookings->whereIn('status', [BookingStatuses::Actual->value, BookingStatuses::InProcess->value]);
            if($bookings->count() > 0) {
                foreach($bookings as $booking) {
                    $bookingFrom = Carbon::make($booking->booking_date.' '.$booking->booking_time);
                    $bookingTo = Carbon::make($booking->booking_date.' '.$booking->booking_time_to);
                    if($bookingTo->lessThan($bookingFrom)) {
                        $bookingTo = $bookingTo->addDay();
                    }


                    if($bookingTime->between($bookingFrom, $bookingTo) or $bookingTimeTo->between($bookingFrom, $bookingTo)) {
                        if($request->booking_id && is_numeric($request->booking_id)) {
                            $composite = $booking->composite_tables;
                            if($booking->id != $request->booking_id) {
                                if(is_array($composite) && count($composite) > 0 && in_array($table->id, $composite)) {
                                    continue;
                                }
                                $tables->forget($key);
                            }
                        }
                        else {
                            $tables->forget($key);
                        }
                    }
                }
            }
        }
        return $tables;
    }
}
