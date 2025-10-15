<?php

namespace App\Containers\AppSection\Booking\Tests\Unit;

use App\Containers\AppSection\Booking\Data\Factories\BookingFactory;
use App\Containers\AppSection\Booking\Events\BookingDeletedEvent;
use App\Containers\AppSection\Booking\Tasks\DeleteBookingTask;
use App\Containers\AppSection\Booking\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;
use Illuminate\Support\Facades\Event;

/**
 * @group booking
 * @group unit
 */
class DeleteBookingTaskTest extends UnitTestCase
{
    public function testDeleteBooking(): void
    {
        Event::fake();
        $booking = BookingFactory::new()->createOne();

        $result = app(DeleteBookingTask::class)->run($booking->id);

        $this->assertEquals(1, $result);
        Event::assertDispatched(BookingDeletedEvent::class);
    }

    public function testDeleteBookingWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(DeleteBookingTask::class)->run($noneExistingId);
    }
}
