<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Controllers;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Restaurants\Actions\ListRestaurantsAction;
use App\Containers\AppSection\Restaurants\UI\API\Requests\ListRestaurantsRequest;
use App\Containers\AppSection\Restaurants\UI\API\Transformers\RestaurantsTransformer;
use App\Ship\Parents\Controllers\ApiController;
use Prettus\Repository\Exceptions\RepositoryException;

class ListRestaurantsController extends ApiController
{
    public function __construct(
        private readonly ListRestaurantsAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function __invoke(ListRestaurantsRequest $request): array
    {
        $restaurants = $this->action->run($request);

        return $this->transform($restaurants, RestaurantsTransformer::class);
    }
}
