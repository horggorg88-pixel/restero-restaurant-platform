<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Controllers;

use App\Containers\AppSection\Restaurants\Actions\DeleteRestaurantsAction;
use App\Containers\AppSection\Restaurants\UI\API\Requests\DeleteRestaurantsRequest;
use App\Ship\Exceptions\DeleteResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class DeleteRestaurantsController extends ApiController
{
    public function __construct(
        private readonly DeleteRestaurantsAction $action,
    ) {
    }

    /**
     * @throws DeleteResourceFailedException
     * @throws NotFoundException
     */
    public function __invoke(DeleteRestaurantsRequest $request): JsonResponse
    {
        $this->action->run($request);

        return $this->noContent();
    }
}
