<?php

namespace App\Containers\AppSection\Room\Actions;

use App\Containers\AppSection\Room\Tasks\CheckFreeTablesTask;
use App\Containers\AppSection\Room\UI\API\Requests\CheckFreeTablesRequest;
use App\Ship\Parents\Actions\Action as ParentAction;

class CheckFreeTablesAction extends ParentAction
{
    public function __construct(
        private readonly CheckFreeTablesTask $getFreeTablesTask,
    ) {
    }


    public function run(CheckFreeTablesRequest $request): mixed
    {
        return $this->getFreeTablesTask->run($request);
    }
}
