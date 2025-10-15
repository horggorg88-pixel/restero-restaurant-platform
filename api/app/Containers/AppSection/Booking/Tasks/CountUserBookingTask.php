<?php

namespace App\Containers\AppSection\Booking\Tasks;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Booking\Data\Enums\BookingStatuses;
use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Events\BookingsListedEvent;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\UI\API\Requests\AllBookingsRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\GuestsRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\ListBookingsRequest;
use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Carbon\Carbon;
use Prettus\Repository\Exceptions\RepositoryException;

class CountUserBookingTask extends ParentTask
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
    public function run(Booking $booking): mixed
    {
        $roomIds = $this->roomRepository->scopeQuery(function ($query) use ($booking) {
            return $query->whereHas('restaurant', function ($restaurantQuery) use ($booking) {
                return $restaurantQuery->where('restaurants.id', $booking->room->restaurant->id);
            });
        })->all()->pluck('id')->toArray();

        return $this->repository
            ->scopeQuery(function ($query) use ($roomIds, $booking) {
                return $query->whereIn('room_id', $roomIds)->where(function($searchQuery) use ($booking) {
                    return $searchQuery->where('client_phone', $booking->client_phone);
                });
            })
            ->count();
    }
}
