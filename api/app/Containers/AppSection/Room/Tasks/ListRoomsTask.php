<?php

namespace App\Containers\AppSection\Room\Tasks;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use App\Containers\AppSection\Room\Events\RoomsListedEvent;
use App\Containers\AppSection\Room\UI\API\Requests\ListRoomsRequest;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Prettus\Repository\Exceptions\RepositoryException;

class ListRoomsTask extends ParentTask
{
    public function __construct(
        protected readonly RoomRepository $repository,
    ) {
    }

    /**
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function run(ListRoomsRequest $request): mixed
    {
        return $this->repository
            ->with([
                'restaurant',
                'tables',
                //'tables.bookings',
                //'tables.bookings.room',
                //'tables.bookings.table',
                //'tables.bookings.user',
            ])
            ->scopeQuery(function ($query) use ($request) {
                return $query->whereHas('restaurant', function ($restaurantQuery) use ($request) {
                    return $restaurantQuery->where('restaurants.id', $request->restaurant_id);
                });
            })->orderBy('name')->addRequestCriteria()->all();
    }
}
