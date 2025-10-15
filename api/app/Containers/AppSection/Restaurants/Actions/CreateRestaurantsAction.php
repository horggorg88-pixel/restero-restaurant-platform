<?php

namespace App\Containers\AppSection\Restaurants\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\Tasks\CreateRestaurantsTask;
use App\Containers\AppSection\Restaurants\UI\API\Requests\CreateRestaurantsRequest;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;

class CreateRestaurantsAction extends ParentAction
{
    public function __construct(
        private readonly CreateRestaurantsTask $createRestaurantsTask,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws IncorrectIdException
     */
    public function run(CreateRestaurantsRequest $request): Restaurant
    {
        $data = $request->sanitizeInput([
            'name',
        ]);


        return $this->createRestaurantsTask->run($data);
    }
}
