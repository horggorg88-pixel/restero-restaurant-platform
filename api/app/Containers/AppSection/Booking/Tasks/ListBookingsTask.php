<?php

namespace App\Containers\AppSection\Booking\Tasks;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Booking\Data\Enums\BookingStatuses;
use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Events\BookingsListedEvent;
use App\Containers\AppSection\Booking\UI\API\Requests\ListBookingsRequest;
use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Carbon\Carbon;
use Prettus\Repository\Exceptions\RepositoryException;

class ListBookingsTask extends ParentTask
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
    public function run(ListBookingsRequest $request): mixed
    {
        if($request->has('room_id')) {
            $roomIds[] = $request->room_id;
        }
        else {
            $roomIds = $this->roomRepository->scopeQuery(function ($query) use ($request) {
                return $query->whereHas('restaurant', function ($restaurantQuery) use ($request) {
                    return $restaurantQuery->where('restaurants.id', $request->restaurant_id);
                });
            })->all()->pluck('id')->toArray();
        }


        return $this->repository
            ->scopeQuery(function ($query) use ($roomIds, $request) {
                $query = $query->whereIn('room_id', $roomIds)->where('status', BookingStatuses::Actual->value);
                if($request->has('client_phone')) {
                    $query = $query->where('client_phone', 'LIKE', '%' . $request->client_phone . '%');
                }
                if($request->has('table_id')) {
                    $query = $query->where('table_id', $request->table_id);
                }
                return $query->where('booking_date', '=', $request->booking_date);
            })
            ->addRequestCriteria()->all();
    }
}
