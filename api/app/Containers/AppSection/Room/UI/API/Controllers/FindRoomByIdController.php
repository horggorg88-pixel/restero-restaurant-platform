<?php

namespace App\Containers\AppSection\Room\UI\API\Controllers;

use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Room\Actions\FindRoomByIdAction;
use App\Containers\AppSection\Room\UI\API\Requests\FindRoomByIdRequest;
use App\Containers\AppSection\Room\UI\API\Transformers\RoomTransformer;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Controllers\ApiController;

class FindRoomByIdController extends ApiController
{
    public function __construct(
        private readonly FindRoomByIdAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException|NotFoundException
     */
    public function __invoke(FindRoomByIdRequest $request): array
    {
        $room = $this->action->run($request);

        return $this->transform($room, RoomTransformer::class);
    }
}
