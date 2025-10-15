<?php

namespace App\Containers\AppSection\Booking\Tests\Unit;

use App\Containers\AppSection\Booking\Data\Factories\BookingFactory;
use App\Containers\AppSection\Booking\Events\BookingFoundByIdEvent;
use App\Containers\AppSection\Booking\Tasks\FindBookingByIdTask;
use App\Containers\AppSection\Booking\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;
use Illuminate\Support\Facades\Event;

/**
 * @group booking
 * @group unit
 */
class FindBookingByIdTaskTest extends UnitTestCase
{
    public function testFindBookingById(): void
    {
        Event::fake();
        $booking = BookingFactory::new()->createOne();

        $foundBooking = app(FindBookingByIdTask::class)->run($booking->id);

        $this->assertEquals($booking->id, $foundBooking->id);
        Event::assertDispatched(BookingFoundByIdEvent::class);
    }

    public function testFindBookingWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(FindBookingByIdTask::class)->run($noneExistingId);
    }
}
