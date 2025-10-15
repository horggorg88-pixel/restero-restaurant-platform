<?php

namespace App\Containers\AppSection\Restaurants\Tasks;

use App\Containers\AppSection\Restaurants\Data\Repositories\RestaurantRepository;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Tasks\Task as ParentTask;

class CreateRestaurantsTask extends ParentTask
{
    public function __construct(
        protected readonly RestaurantRepository $repository,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     */
    public function run(array $data): Restaurant
    {
        try {
            return $this->repository->create($data);
        } catch (\Exception) {
            throw new CreateResourceFailedException();
        }
    }
}
