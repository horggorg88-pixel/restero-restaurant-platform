<?php

namespace App\Containers\AppSection\Booking\Actions;

use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\Tasks\FindBookingByIdTask;
use App\Containers\AppSection\Booking\UI\API\Requests\FindBookingByIdRequest;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Actions\Action as ParentAction;

class FindBookingByIdAction extends ParentAction
{
    public function __construct(
        private readonly FindBookingByIdTask $findBookingByIdTask,
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function run(FindBookingByIdRequest $request): Booking
    {
        return $this->findBookingByIdTask->run($request->id);
    }
}
