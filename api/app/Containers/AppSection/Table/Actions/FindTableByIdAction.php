<?php

namespace App\Containers\AppSection\Table\Actions;

use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\Table\Tasks\FindTableByIdTask;
use App\Containers\AppSection\Table\UI\API\Requests\FindTableByIdRequest;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Actions\Action as ParentAction;

class FindTableByIdAction extends ParentAction
{
    public function __construct(
        private readonly FindTableByIdTask $findTableByIdTask,
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function run(FindTableByIdRequest $request): Table
    {
        return $this->findTableByIdTask->run($request->id);
    }
}
