<?php

namespace App\Containers\AppSection\Table\Tasks;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use App\Containers\AppSection\Table\Data\Repositories\TableRepository;
use App\Containers\AppSection\Table\Events\TablesListedEvent;
use App\Containers\AppSection\Table\UI\API\Requests\ListTablesRequest;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Prettus\Repository\Exceptions\RepositoryException;

class ListTablesTask extends ParentTask
{
    public function __construct(
        protected readonly TableRepository $repository,
        protected readonly RoomRepository $roomRepository,
    ) {
    }

    /**
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function run(ListTablesRequest $request): mixed
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
            ->scopeQuery(function ($query) use ($roomIds) {
                return $query->whereIn('room_id', $roomIds);
            })
            ->orderBy('number')
            ->addRequestCriteria()->all();

    }
}
