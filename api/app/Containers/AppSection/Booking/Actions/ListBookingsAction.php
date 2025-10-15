<?php

namespace App\Containers\AppSection\Booking\Actions;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use App\Containers\AppSection\Booking\Tasks\ListBookingsTask;
use App\Containers\AppSection\Booking\UI\API\Requests\ListBookingsRequest;
use App\Ship\Parents\Actions\Action as ParentAction;
use Prettus\Repository\Exceptions\RepositoryException;

class ListBookingsAction extends ParentAction
{
    public function __construct(
        private readonly ListBookingsTask $listBookingsTask,
    ) {
    }

    /**
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function run(ListBookingsRequest $request): mixed
    {
        return $this->listBookingsTask->run($request);
    }
}
