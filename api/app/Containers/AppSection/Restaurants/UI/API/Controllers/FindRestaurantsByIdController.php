<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Controllers;

use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Restaurants\Actions\FindRestaurantsByIdAction;
use App\Containers\AppSection\Restaurants\UI\API\Requests\FindRestaurantsByIdRequest;
use App\Containers\AppSection\Restaurants\UI\API\Transformers\RestaurantsTransformer;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Controllers\ApiController;

class FindRestaurantsByIdController extends ApiController
{
    public function __construct(
        private readonly FindRestaurantsByIdAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException|NotFoundException
     */
    public function __invoke(FindRestaurantsByIdRequest $request): array
    {
        $restaurants = $this->action->run($request);

        return $this->transform($restaurants, RestaurantsTransformer::class);
    }
}
