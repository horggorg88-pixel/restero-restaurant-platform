<?php

namespace App\Containers\AppSection\Booking\Tasks;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Booking\Data\Enums\BookingStatuses;
use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Events\BookingsListedEvent;
use App\Containers\AppSection\Booking\UI\API\Requests\AllBookingsRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\GuestsRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\ListBookingsRequest;
use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Exceptions\RepositoryException;

class GuestsTask extends ParentTask
{
    public function __construct(
        protected readonly BookingRepository $repository,
        protected readonly RoomRepository    $roomRepository,
    )
    {
    }

    /**
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function run(GuestsRequest $request): mixed
    {
        $roomIds = [];
        if($request->has('restaurant_id')) {
            $roomIds = $this->roomRepository->scopeQuery(function ($query) use ($request) {
                return $query->whereHas('restaurant', function ($restaurantQuery) use ($request) {
                    return $restaurantQuery->where('restaurants.id', $request->restaurant_id);
                });
            })->all()->pluck('id')->toArray();
        }
        else {
            $roomIds = $this->roomRepository->all()->pluck('id')->toArray();
        }



        if($request->has('orderBy') && $request->orderBy == 'count_booking') {
            unset($request->orderBy);
        }


        return $this->repository
            ->scopeQuery(function ($query) use ($roomIds, $request) {
                $query = $query
                    ->from('bookings as b')
                    ->select('b.*', DB::raw('(SELECT COUNT(b2.id) as count_booking FROM bookings as b2 WHERE b2.room_id IN ('.implode(',', $roomIds).')  AND b2.client_phone = b.client_phone)'));

                if(count($roomIds) > 0) {
                    $query = $query->whereIn('room_id', $roomIds);
                }
                if($request->booking_date_from && $request->booking_date_to) {
                    $query = $query->where('b.booking_date', '>=',$request->booking_date_from);
                    $query = $query->where('b.booking_date', '<=',$request->booking_date_to);
                }
                if($request->has('query')) {
                    $query = $query->where(function($searchQuery) use ($request) {
                        return $searchQuery->where('b.client_phone', 'LIKE', '%' . $request->get('query') . '%')
                            ->orWhere('b.client_name', 'ILIKE', '%' . $request->get('query') . '%');
                    });
                }
                return $query->groupBy('b.id');
            })
            ->addRequestCriteria()->paginate();
    }
}
