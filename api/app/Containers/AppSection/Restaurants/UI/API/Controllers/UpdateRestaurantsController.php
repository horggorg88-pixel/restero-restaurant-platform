<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Controllers;

use Apiato\Core\Exceptions\IncorrectIdException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Restaurants\Actions\UpdateRestaurantsAction;
use App\Containers\AppSection\Restaurants\UI\API\Requests\UpdateRestaurantsRequest;
use App\Containers\AppSection\Restaurants\UI\API\Transformers\RestaurantsTransformer;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;

class UpdateRestaurantsController extends ApiController
{
    public function __construct(
        private readonly UpdateRestaurantsAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws UpdateResourceFailedException
     * @throws IncorrectIdException
     * @throws NotFoundException
     */
    public function __invoke(UpdateRestaurantsRequest $request): array
    {
        $restaurants = $this->action->run($request);

        return $this->transform($restaurants, RestaurantsTransformer::class);
    }
}
