<?php

namespace App\Containers\AppSection\Table\Actions;

use App\Containers\AppSection\Table\Tasks\DeleteTableTask;
use App\Containers\AppSection\Table\UI\API\Requests\DeleteTableRequest;
use App\Ship\Exceptions\DeleteResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Actions\Action as ParentAction;

class DeleteTableAction extends ParentAction
{
    public function __construct(
        private readonly DeleteTableTask $deleteTableTask,
    ) {
    }

    /**
     * @throws DeleteResourceFailedException
     * @throws NotFoundException
     */
    public function run(DeleteTableRequest $request): int
    {
        return $this->deleteTableTask->run($request->id);
    }
}
