<?php

namespace App\Containers\AppSection\Booking\Actions;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Booking\Tasks\AllBookingsTask;
use App\Containers\AppSection\Booking\Tasks\GuestsTask;
use App\Containers\AppSection\Booking\Tasks\ListBookingsTask;
use App\Containers\AppSection\Booking\UI\API\Requests\AllBookingsRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\GuestsRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\ListBookingsRequest;
use App\Ship\Parents\Actions\Action as ParentAction;
use Prettus\Repository\Exceptions\RepositoryException;

class GuestsAction extends ParentAction
{
    public function __construct(
        private readonly GuestsTask $listBookingsTask,
    ) {
    }

    /**
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function run(GuestsRequest $request): mixed
    {
        return $this->listBookingsTask->run($request);
    }
}
