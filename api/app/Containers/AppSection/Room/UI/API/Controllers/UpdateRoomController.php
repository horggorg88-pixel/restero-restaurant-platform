<?php

namespace App\Containers\AppSection\Room\UI\API\Controllers;

use Apiato\Core\Exceptions\IncorrectIdException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Room\Actions\UpdateRoomAction;
use App\Containers\AppSection\Room\UI\API\Requests\UpdateRoomRequest;
use App\Containers\AppSection\Room\UI\API\Transformers\RoomTransformer;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;

class UpdateRoomController extends ApiController
{
    public function __construct(
        private readonly UpdateRoomAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws UpdateResourceFailedException
     * @throws IncorrectIdException
     * @throws NotFoundException
     */
    public function __invoke(UpdateRoomRequest $request): array
    {
        $room = $this->action->run($request);

        return $this->transform($room, RoomTransformer::class);
    }
}
