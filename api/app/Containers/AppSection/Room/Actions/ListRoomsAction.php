<?php

namespace App\Containers\AppSection\Room\Actions;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Room\Tasks\ListRoomsTask;
use App\Containers\AppSection\Room\UI\API\Requests\ListRoomsRequest;
use App\Ship\Parents\Actions\Action as ParentAction;
use Prettus\Repository\Exceptions\RepositoryException;

class ListRoomsAction extends ParentAction
{
    public function __construct(
        private readonly ListRoomsTask $listRoomsTask,
    ) {
    }

    /**
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function run(ListRoomsRequest $request): mixed
    {
        return $this->listRoomsTask->run($request);
    }
}
