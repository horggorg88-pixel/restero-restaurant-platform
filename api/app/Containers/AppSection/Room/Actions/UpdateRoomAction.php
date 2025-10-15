<?php

namespace App\Containers\AppSection\Room\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Room\Models\Room;
use App\Containers\AppSection\Room\Tasks\UpdateRoomTask;
use App\Containers\AppSection\Room\UI\API\Requests\UpdateRoomRequest;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;

class UpdateRoomAction extends ParentAction
{
    public function __construct(
        private readonly UpdateRoomTask $updateRoomTask,
    ) {
    }

    /**
     * @throws UpdateResourceFailedException
     * @throws IncorrectIdException
     * @throws NotFoundException
     */
    public function run(UpdateRoomRequest $request): Room
    {
        $data = $request->sanitizeInput([
            'name',
            'comment'
        ]);

        return $this->updateRoomTask->run($data, $request->id);
    }
}
