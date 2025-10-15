<?php

namespace App\Containers\AppSection\Restaurants\Tasks;

use App\Containers\AppSection\Restaurants\Data\Repositories\RestaurantRepository;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Tasks\Task as ParentTask;

class FindRestaurantsByIdTask extends ParentTask
{
    public function __construct(
        protected readonly RestaurantRepository $repository,
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function run($id): Restaurant
    {
        try {
            return $this->repository->find($id);
        } catch (\Exception) {
            throw new NotFoundException();
        }
    }
}
