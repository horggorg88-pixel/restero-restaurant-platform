<?php

namespace App\Containers\AppSection\Booking\Tests\Unit;

use App\Containers\AppSection\Booking\Data\Factories\BookingFactory;
use App\Containers\AppSection\Booking\Events\BookingUpdatedEvent;
use App\Containers\AppSection\Booking\Tasks\UpdateBookingTask;
use App\Containers\AppSection\Booking\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;
use Illuminate\Support\Facades\Event;

/**
 * @group booking
 * @group unit
 */
class UpdateBookingTaskTest extends UnitTestCase
{
    // TODO TEST
    public function testUpdateBooking(): void
    {
        Event::fake();
        $booking = BookingFactory::new()->createOne();
        $data = [
            // add some fillable fields here
            // 'some_field' => 'new_field_data',
        ];

        $updatedBooking = app(UpdateBookingTask::class)->run($data, $booking->id);

        $this->assertEquals($booking->id, $updatedBooking->id);
        // assert if fields are updated
        // $this->assertEquals($data['some_field'], $updatedBooking->some_field);
        Event::assertDispatched(BookingUpdatedEvent::class);
    }

    public function testUpdateBookingWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(UpdateBookingTask::class)->run([], $noneExistingId);
    }
}
