<?php

namespace App\Containers\AppSection\Table\Actions;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Table\Tasks\ListTablesTask;
use App\Containers\AppSection\Table\UI\API\Requests\ListTablesRequest;
use App\Ship\Parents\Actions\Action as ParentAction;
use Prettus\Repository\Exceptions\RepositoryException;

class ListTablesAction extends ParentAction
{
    public function __construct(
        private readonly ListTablesTask $listTablesTask,
    ) {
    }

    /**
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function run(ListTablesRequest $request): mixed
    {
        return $this->listTablesTask->run($request);
    }
}
