<?php

namespace App\Containers\AppSection\Restaurants\Actions;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\Tasks\FindRestaurantsByIdTask;
use App\Containers\AppSection\Restaurants\UI\API\Requests\FindRestaurantsByIdRequest;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Actions\Action as ParentAction;

class FindRestaurantsByIdAction extends ParentAction
{
    public function __construct(
        private readonly FindRestaurantsByIdTask $findRestaurantsByIdTask,
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function run(FindRestaurantsByIdRequest $request): Restaurant
    {
        return $this->findRestaurantsByIdTask->run($request->id);
    }
}
