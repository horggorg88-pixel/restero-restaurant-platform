<?php

namespace App\Containers\AppSection\Restaurants\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\Tasks\UpdateRestaurantsTask;
use App\Containers\AppSection\Restaurants\UI\API\Requests\UpdateRestaurantsRequest;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;

class UpdateRestaurantsAction extends ParentAction
{
    public function __construct(
        private readonly UpdateRestaurantsTask $updateRestaurantsTask,
    ) {
    }

    /**
     * @throws UpdateResourceFailedException
     * @throws IncorrectIdException
     * @throws NotFoundException
     */
    public function run(UpdateRestaurantsRequest $request): Restaurant
    {
        $data = $request->sanitizeInput([
            'name',
            'end_time',
            'start_time'
        ]);

        return $this->updateRestaurantsTask->run($data, $request->id);
    }
}
