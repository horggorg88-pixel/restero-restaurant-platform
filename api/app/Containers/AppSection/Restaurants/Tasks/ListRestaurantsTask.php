<?php

namespace App\Containers\AppSection\Restaurants\Tasks;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Restaurants\Data\Repositories\RestaurantRepository;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Prettus\Repository\Exceptions\RepositoryException;

class ListRestaurantsTask extends ParentTask
{
    public function __construct(
        protected readonly RestaurantRepository $repository,
    ) {
    }

    /**
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function run(): mixed
    {
        return $this->repository->addRequestCriteria()->all();
    }
}
