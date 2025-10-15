<?php

namespace App\Containers\AppSection\Table\UI\API\Controllers;

use Apiato\Core\Exceptions\IncorrectIdException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Table\Actions\CreateTableAction;
use App\Containers\AppSection\Table\UI\API\Requests\CreateTableRequest;
use App\Containers\AppSection\Table\UI\API\Transformers\TableTransformer;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class CreateTableController extends ApiController
{
    public function __construct(
        private readonly CreateTableAction $action,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws InvalidTransformerException
     * @throws IncorrectIdException
     */
    public function __invoke(CreateTableRequest $request): JsonResponse
    {
        $table = $this->action->run($request);

        return $this->created($this->transform($table, TableTransformer::class));
    }
}
