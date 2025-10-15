<?php

namespace App\Containers\AppSection\Restaurants\Actions;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Restaurants\Tasks\ListRestaurantsTask;
use App\Containers\AppSection\Restaurants\UI\API\Requests\ListRestaurantsRequest;
use App\Ship\Parents\Actions\Action as ParentAction;
use Prettus\Repository\Exceptions\RepositoryException;

class ListRestaurantsAction extends ParentAction
{
    public function __construct(
        private readonly ListRestaurantsTask $listRestaurantsTask,
    ) {
    }

    /**
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function run(ListRestaurantsRequest $request): mixed
    {
        return $this->listRestaurantsTask->run();
    }
}
