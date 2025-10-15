<?php

namespace App\Containers\AppSection\Booking\Tests\Unit;

use App\Containers\AppSection\Booking\Data\Factories\BookingFactory;
use App\Containers\AppSection\Booking\Events\BookingsListedEvent;
use App\Containers\AppSection\Booking\Tasks\ListBookingsTask;
use App\Containers\AppSection\Booking\Tests\UnitTestCase;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Event;

/**
 * @group booking
 * @group unit
 */
class ListBookingsTaskTest extends UnitTestCase
{
    public function testListBookings(): void
    {
        Event::fake();
        BookingFactory::new()->count(3)->create();

        $foundBookings = app(ListBookingsTask::class)->run();

        $this->assertCount(3, $foundBookings);
        $this->assertInstanceOf(LengthAwarePaginator::class, $foundBookings);
        Event::assertDispatched(BookingsListedEvent::class);
    }
}
