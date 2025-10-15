<?php

namespace App\Containers\AppSection\Booking\Tests\Unit;

use App\Containers\AppSection\Booking\Events\BookingCreatedEvent;
use App\Containers\AppSection\Booking\Tasks\CreateBookingTask;
use App\Containers\AppSection\Booking\Tests\UnitTestCase;
use App\Ship\Exceptions\CreateResourceFailedException;
use Illuminate\Support\Facades\Event;

/**
 * @group booking
 * @group unit
 */
class CreateBookingTaskTest extends UnitTestCase
{
    public function testCreateBooking(): void
    {
        Event::fake();
        $data = [];

        $booking = app(CreateBookingTask::class)->run($data);

        $this->assertModelExists($booking);
        Event::assertDispatched(BookingCreatedEvent::class);
    }

    // TODO TEST
    // public function testCreateBookingWithInvalidData(): void
    // {
    //     $this->expectException(CreateResourceFailedException::class);
    //
    //     $data = [
    //         // put some invalid data here
    //         // 'invalid' => 'data',
    //     ];
    //
    //     app(CreateBookingTask::class)->run($data);
    // }
}
