<?php

namespace App\Containers\AppSection\Booking\Actions;

use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\Tasks\ChangeStatusBookingTask;
use App\Containers\AppSection\Booking\UI\API\Requests\ChangeStatusBookingRequest;
use App\Containers\AppSection\History\Tasks\CreateHistoryTask;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;

class ChangeStatusBookingAction extends ParentAction
{
    public function __construct(
        private readonly ChangeStatusBookingTask $changeStatusBookingTask,
        private readonly CreateHistoryTask $createHistoryTask,
    ) {
    }

    /**
     * @throws NotFoundException
     * @throws UpdateResourceFailedException|CreateResourceFailedException
     */
    public function run(ChangeStatusBookingRequest $request): Booking
    {

        $booking = $this->changeStatusBookingTask->run($request->id, $request->status);
        $this->createHistoryTask->run($booking, 'canceled');
        return $booking;
    }
}
