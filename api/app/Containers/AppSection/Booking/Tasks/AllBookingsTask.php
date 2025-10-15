<?php

namespace App\Containers\AppSection\Booking\Tasks;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Booking\Data\Enums\BookingStatuses;
use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Events\BookingsListedEvent;
use App\Containers\AppSection\Booking\UI\API\Requests\AllBookingsRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\ListBookingsRequest;
use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Exceptions\RepositoryException;

class AllBookingsTask extends ParentTask
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
    public function run(AllBookingsRequest $request): mixed
    {
        $roomIds = $this->roomRepository->scopeQuery(function ($query) use ($request) {
            return $query->whereHas('restaurant', function ($restaurantQuery) use ($request) {
                return $restaurantQuery->where('restaurants.id', $request->restaurant_id);
            });
        })->all()->pluck('id')->toArray();

        return $this->repository
            ->scopeQuery(function ($query) use ($roomIds, $request) {
                $query = $query
                    ->whereIn('room_id', $roomIds);
                if($request->has('status')) {
                    $query = $query->where('status', $request->status);
                }
                if($request->booking_date_from && $request->booking_date_to) {
                    $query = $query->where('booking_date', '>=',$request->booking_date_from);
                    $query = $query->where('booking_date', '<=',$request->booking_date_to);
                }
                elseif($request->booking_date_from && !$request->booking_date_to) {
                    $query = $query->where('booking_date', '>=', $request->booking_date_from);
                }

                if($request->has('query')) {
                    $query = $query->where(function($searchQuery) use ($request) {
                        return $searchQuery->where('client_phone', 'ilike', '%' . $request->get('query') . '%')->orWhere('client_name', 'ILIKE', '%' . $request->get('query') . '%');
                    });
                }

                return $query;
            })
            ->addRequestCriteria()->orderBy("booking_date")->orderBy('booking_time')->paginate();
    }
}
