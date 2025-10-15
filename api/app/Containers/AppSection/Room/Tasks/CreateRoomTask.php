<?php

namespace App\Containers\AppSection\Room\Tasks;

use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use App\Containers\AppSection\Room\Events\RoomCreatedEvent;
use App\Containers\AppSection\Room\Models\Room;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Illuminate\Support\Facades\Auth;

class CreateRoomTask extends ParentTask
{
    public function __construct(
        protected readonly RoomRepository $repository,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     */
    public function run(array $data): Room
    {
        try {

            $room = $this->repository->create($data);
            RoomCreatedEvent::dispatch($room);
            return $room;
        } catch (\Exception) {
            throw new CreateResourceFailedException();
        }
    }
}
