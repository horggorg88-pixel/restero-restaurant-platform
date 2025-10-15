<?php

namespace App\Containers\AppSection\Table\UI\API\Controllers;

use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Table\Actions\FindTableByIdAction;
use App\Containers\AppSection\Table\UI\API\Requests\FindTableByIdRequest;
use App\Containers\AppSection\Table\UI\API\Transformers\TableTransformer;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Controllers\ApiController;

class FindTableByIdController extends ApiController
{
    public function __construct(
        private readonly FindTableByIdAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException|NotFoundException
     */
    public function __invoke(FindTableByIdRequest $request): array
    {
        $table = $this->action->run($request);

        return $this->transform($table, TableTransformer::class);
    }
}
