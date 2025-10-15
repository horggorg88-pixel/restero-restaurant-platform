<?php

namespace App\Containers\AppSection\Restaurants\Tasks;

use App\Containers\AppSection\Restaurants\Data\Repositories\ModelHasRestaurantRepository;
use Prettus\Validator\Exceptions\ValidatorException;

class AppendRestaurantToModelTask
{

    public function __construct(
        protected readonly ModelHasRestaurantRepository $repository
    )
    {
    }

    /**
     * @throws ValidatorException
     */
    public function run($restaurantId, $modelId, $modelType): void {
        $this->repository->updateOrCreate([
            'restaurant_id' => $restaurantId,
            'model_id' => $modelId,
            'model_type' => $modelType,
        ]);
    }

}