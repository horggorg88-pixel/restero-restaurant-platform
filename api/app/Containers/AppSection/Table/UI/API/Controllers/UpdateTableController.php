<?php

namespace App\Containers\AppSection\Table\UI\API\Controllers;

use Apiato\Core\Exceptions\IncorrectIdException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Table\Actions\UpdateTableAction;
use App\Containers\AppSection\Table\UI\API\Requests\UpdateTableRequest;
use App\Containers\AppSection\Table\UI\API\Transformers\TableTransformer;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;

class UpdateTableController extends ApiController
{
    public function __construct(
        private readonly UpdateTableAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws UpdateResourceFailedException
     * @throws IncorrectIdException
     * @throws NotFoundException
     */
    public function __invoke(UpdateTableRequest $request): array
    {
        $table = $this->action->run($request);

        return $this->transform($table, TableTransformer::class);
    }
}
