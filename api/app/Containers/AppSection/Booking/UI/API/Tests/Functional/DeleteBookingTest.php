<?php

namespace App\Containers\AppSection\Booking\UI\API\Tests\Functional;

use App\Containers\AppSection\Booking\Data\Factories\BookingFactory;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\UI\API\Tests\ApiTestCase;

/**
 * @group booking
 * @group api
 */
class DeleteBookingTest extends ApiTestCase
{
    protected string $endpoint = 'delete@v1/bookings/{id}';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testDeleteExistingBooking(): void
    {
        $booking = BookingFactory::new()->createOne();

        $response = $this->injectId($booking->id)->makeCall();

        $response->assertStatus(204);
    }

    public function testDeleteNonExistingBooking(): void
    {
        $invalidId = 7777;

        $response = $this->injectId($invalidId)->makeCall([]);

        $response->assertStatus(404);
    }

    // TODO TEST
    // add some roles and permissions to this route's request
    // then add them to the $access array above
    // uncomment this test to test accesses
    // public function testGivenHaveNoAccess_CannotDeleteBooking(): void
    // {
    //     $this->getTestingUserWithoutAccess();
    //     $booking = BookingFactory::new()->createOne();
    //
    //     $response = $this->injectId($booking->id)->makeCall();
    //
    //     $response->assertStatus(403);
    // }
}
