<?php

namespace App\Containers\AppSection\Booking\Tests\Unit;

use App\Containers\AppSection\Booking\Data\Factories\BookingFactory;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\Tests\UnitTestCase;

/**
 * @group booking
 * @group unit
 */
class BookingFactoryTest extends UnitTestCase
{
    public function testCreateBooking(): void
    {
        $booking = BookingFactory::new()->make();

        $this->assertInstanceOf(Booking::class, $booking);
    }
}
