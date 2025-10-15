<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Controllers;

use Apiato\Core\Exceptions\IncorrectIdException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Restaurants\Actions\CreateRestaurantsAction;
use App\Containers\AppSection\Restaurants\UI\API\Requests\CreateRestaurantsRequest;
use App\Containers\AppSection\Restaurants\UI\API\Transformers\RestaurantsTransformer;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class CreateRestaurantsController extends ApiController
{
    public function __construct(
        private readonly CreateRestaurantsAction $action,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws InvalidTransformerException
     * @throws IncorrectIdException
     */
    public function __invoke(CreateRestaurantsRequest $request): JsonResponse
    {
        $restaurants = $this->action->run($request);

        return $this->created($this->transform($restaurants, RestaurantsTransformer::class));
    }
}
