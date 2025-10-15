<?php

namespace App\Containers\AppSection\Booking\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\Tasks\CancelBookingTask;
use App\Containers\AppSection\Booking\Tasks\CreateBookingTask;
use App\Containers\AppSection\Booking\Tasks\RestoreBookingTask;
use App\Containers\AppSection\Booking\UI\API\Requests\CancelBookingRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\CreateBookingRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\RestoreBookingRequest;
use App\Containers\AppSection\History\Tasks\CreateHistoryTask;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;

class RestoreBookingAction extends ParentAction
{
    public function __construct(
        private readonly RestoreBookingTask $restoreBookingTask,
        private readonly CreateHistoryTask $createHistoryTask,
    ) {
    }

    /**
     * @throws NotFoundException
     * @throws UpdateResourceFailedException|CreateResourceFailedException
     */
    public function run(RestoreBookingRequest $request): Booking
    {

        $booking = $this->restoreBookingTask->run($request->id);
        $this->createHistoryTask->run($booking, 'restored');
        return $booking;
    }
}
