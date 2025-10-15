<?php

namespace App\Containers\AppSection\Table\UI\API\Controllers;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Table\Actions\ListTablesAction;
use App\Containers\AppSection\Table\UI\API\Requests\ListTablesRequest;
use App\Containers\AppSection\Table\UI\API\Transformers\TableTransformer;
use App\Ship\Parents\Controllers\ApiController;
use Prettus\Repository\Exceptions\RepositoryException;

class ListTablesController extends ApiController
{
    public function __construct(
        private readonly ListTablesAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function __invoke(ListTablesRequest $request): array
    {
        $tables = $this->action->run($request);

        return $this->transform($tables, TableTransformer::class);
    }
}
