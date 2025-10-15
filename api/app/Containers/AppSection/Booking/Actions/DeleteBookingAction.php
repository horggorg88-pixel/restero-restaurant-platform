<?php

namespace App\Containers\AppSection\Booking\Actions;

use App\Containers\AppSection\Booking\Tasks\DeleteBookingTask;
use App\Containers\AppSection\Booking\UI\API\Requests\DeleteBookingRequest;
use App\Ship\Exceptions\DeleteResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Actions\Action as ParentAction;

class DeleteBookingAction extends ParentAction
{
    public function __construct(
        private readonly DeleteBookingTask $deleteBookingTask,
    ) {
    }

    /**
     * @throws DeleteResourceFailedException
     * @throws NotFoundException
     */
    public function run(DeleteBookingRequest $request): int
    {
        return $this->deleteBookingTask->run($request->id);
    }
}
