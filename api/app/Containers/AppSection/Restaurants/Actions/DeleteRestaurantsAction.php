<?php

namespace App\Containers\AppSection\Restaurants\Actions;

use App\Containers\AppSection\Restaurants\Tasks\DeleteRestaurantsTask;
use App\Containers\AppSection\Restaurants\UI\API\Requests\DeleteRestaurantsRequest;
use App\Ship\Exceptions\DeleteResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Actions\Action as ParentAction;

class DeleteRestaurantsAction extends ParentAction
{
    public function __construct(
        private readonly DeleteRestaurantsTask $deleteRestaurantsTask,
    ) {
    }

    /**
     * @throws DeleteResourceFailedException
     * @throws NotFoundException
     */
    public function run(DeleteRestaurantsRequest $request): int
    {
        return $this->deleteRestaurantsTask->run($request->id);
    }
}
