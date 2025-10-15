<?php

namespace App\Containers\AppSection\Booking\Tasks;

use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Events\BookingFoundByIdEvent;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Tasks\Task as ParentTask;

class FindBookingByIdTask extends ParentTask
{
    public function __construct(
        protected readonly BookingRepository $repository,
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function run($id): Booking
    {
        try {
            $booking = $this->repository->find($id);
            BookingFoundByIdEvent::dispatch($booking);

            return $booking;
        } catch (\Exception) {
            throw new NotFoundException();
        }
    }
}
