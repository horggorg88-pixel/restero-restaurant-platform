<?php

namespace App\Containers\AppSection\Booking\Tasks;

use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Events\BookingCreatedEvent;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Tasks\Task as ParentTask;

class CreateBookingTask extends ParentTask
{
    public function __construct(
        protected readonly BookingRepository $repository,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     */
    public function run(array $data): Booking
    {
        try {
            $booking = $this->repository->create($data);
            BookingCreatedEvent::dispatch($booking);

            return $booking;
        } catch (\Exception) {
            throw new CreateResourceFailedException();
        }
    }
}
