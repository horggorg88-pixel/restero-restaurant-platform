<?php

namespace App\Containers\AppSection\Room\UI\API\Controllers;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Room\Actions\GetFreeTablesAction;
use App\Containers\AppSection\Room\Actions\ListRoomsAction;
use App\Containers\AppSection\Room\UI\API\Requests\GetFreeTablesRequest;
use App\Containers\AppSection\Room\UI\API\Requests\ListRoomsRequest;
use App\Containers\AppSection\Room\UI\API\Transformers\RoomTransformer;
use App\Containers\AppSection\Table\UI\API\Transformers\TableMinTransformer;
use App\Containers\AppSection\Table\UI\API\Transformers\TableTransformer;
use App\Ship\Parents\Controllers\ApiController;
use Prettus\Repository\Exceptions\RepositoryException;

class GetFreeTablesController extends ApiController
{
    public function __construct(
        private readonly GetFreeTablesAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function __invoke(GetFreeTablesRequest $request): array
    {

        $rooms = $this->action->run($request);

        return $this->transform($rooms, TableMinTransformer::class);
    }
}
