<?php

namespace App\Containers\AppSection\Room\Actions;

use App\Containers\AppSection\Room\Models\Room;
use App\Containers\AppSection\Room\Tasks\FindRoomByIdTask;
use App\Containers\AppSection\Room\UI\API\Requests\FindRoomByIdRequest;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Actions\Action as ParentAction;

class FindRoomByIdAction extends ParentAction
{
    public function __construct(
        private readonly FindRoomByIdTask $findRoomByIdTask,
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function run(FindRoomByIdRequest $request): Room
    {
        return $this->findRoomByIdTask->run($request->id);
    }
}
