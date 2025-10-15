<?php

namespace App\Containers\AppSection\Room\Tasks;

use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use App\Containers\AppSection\Room\Events\RoomFoundByIdEvent;
use App\Containers\AppSection\Room\Models\Room;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Tasks\Task as ParentTask;

class FindRoomByIdTask extends ParentTask
{
    public function __construct(
        protected readonly RoomRepository $repository,
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function run($id): Room
    {
        try {
            $room = $this->repository->find($id);
            RoomFoundByIdEvent::dispatch($room);

            return $room;
        } catch (\Exception) {
            throw new NotFoundException();
        }
    }
}
