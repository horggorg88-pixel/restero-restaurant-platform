<?php

namespace App\Containers\AppSection\Room\Actions;

use App\Containers\AppSection\Room\Tasks\DeleteRoomTask;
use App\Containers\AppSection\Room\UI\API\Requests\DeleteRoomRequest;
use App\Ship\Exceptions\DeleteResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Actions\Action as ParentAction;

class DeleteRoomAction extends ParentAction
{
    public function __construct(
        private readonly DeleteRoomTask $deleteRoomTask,
    ) {
    }

    /**
     * @throws DeleteResourceFailedException
     * @throws NotFoundException
     */
    public function run(DeleteRoomRequest $request): int
    {
        return $this->deleteRoomTask->run($request->id);
    }
}
