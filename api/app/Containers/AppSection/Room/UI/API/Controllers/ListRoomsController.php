<?php

namespace App\Containers\AppSection\Room\UI\API\Controllers;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Room\Actions\ListRoomsAction;
use App\Containers\AppSection\Room\UI\API\Requests\ListRoomsRequest;
use App\Containers\AppSection\Room\UI\API\Transformers\RoomTransformer;
use App\Ship\Parents\Controllers\ApiController;
use Prettus\Repository\Exceptions\RepositoryException;

class ListRoomsController extends ApiController
{
    public function __construct(
        private readonly ListRoomsAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function __invoke(ListRoomsRequest $request): array
    {
        $rooms = $this->action->run($request);

        return $this->transform($rooms, RoomTransformer::class);
    }
}
