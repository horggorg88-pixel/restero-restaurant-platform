<?php

namespace App\Containers\AppSection\Restaurants\Tasks;

use App\Containers\AppSection\Restaurants\Data\Repositories\RestaurantRepository;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UpdateRestaurantsTask extends ParentTask
{
    public function __construct(
        protected readonly RestaurantRepository $repository,
    ) {
    }

    /**
     * @throws NotFoundException
     * @throws UpdateResourceFailedException
     */
    public function run(array $data, $id): Restaurant
    {
        try {
            return $this->repository->update($data, $id);
        } catch (ModelNotFoundException) {
            throw new NotFoundException();
        } catch (\Exception) {
            throw new UpdateResourceFailedException();
        }
    }
}
