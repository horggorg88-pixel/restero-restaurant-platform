<?php

namespace App\Containers\AppSection\Room\UI\API\Controllers;

use Apiato\Core\Exceptions\IncorrectIdException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Room\Actions\CreateRoomAction;
use App\Containers\AppSection\Room\UI\API\Requests\CreateRoomRequest;
use App\Containers\AppSection\Room\UI\API\Transformers\RoomTransformer;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class CreateRoomController extends ApiController
{
    public function __construct(
        private readonly CreateRoomAction $action,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws InvalidTransformerException
     * @throws IncorrectIdException
     */
    public function __invoke(CreateRoomRequest $request): JsonResponse
    {
        $room = $this->action->run($request);

        return $this->created($this->transform($room, RoomTransformer::class));
    }
}
