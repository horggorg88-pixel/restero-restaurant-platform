<?php

namespace App\Containers\AppSection\Room\Actions;

use App\Containers\AppSection\Room\Tasks\GetFreeTablesTask;
use App\Containers\AppSection\Room\UI\API\Requests\GetFreeTablesRequest;
use App\Ship\Parents\Actions\Action as ParentAction;

class GetFreeTablesAction extends ParentAction
{
    public function __construct(
        private readonly GetFreeTablesTask $getFreeTablesTask,
    ) {
    }


    public function run(GetFreeTablesRequest $request): mixed
    {
        return $this->getFreeTablesTask->run($request);
    }
}
