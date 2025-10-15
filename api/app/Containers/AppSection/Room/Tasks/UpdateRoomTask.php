<?php

namespace App\Containers\AppSection\Room\Tasks;

use App\Containers\AppSection\Room\Data\Repositories\RoomRepository;
use App\Containers\AppSection\Room\Events\RoomUpdatedEvent;
use App\Containers\AppSection\Room\Models\Room;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UpdateRoomTask extends ParentTask
{
    public function __construct(
        protected readonly RoomRepository $repository,
    ) {
    }

    /**
     * @throws NotFoundException
     * @throws UpdateResourceFailedException
     */
    public function run(array $data, $id): Room
    {
        try {
            $room = $this->repository->update($data, $id);
            RoomUpdatedEvent::dispatch($room);

            return $room;
        } catch (ModelNotFoundException) {
            throw new NotFoundException();
        } catch (\Exception) {
            throw new UpdateResourceFailedException();
        }
    }
}
