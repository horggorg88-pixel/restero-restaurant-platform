<?php

namespace App\Containers\AppSection\Booking\UI\API\Tests\Functional;

use App\Containers\AppSection\Booking\Data\Factories\BookingFactory;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\UI\API\Tests\ApiTestCase;
use Illuminate\Testing\Fluent\AssertableJson;

/**
 * @group booking
 * @group api
 */
class ListBookingsTest extends ApiTestCase
{
    protected string $endpoint = 'get@v1/bookings';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testListBookingsByAdmin(): void
    {
        $this->getTestingUserWithoutAccess(createUserAsAdmin: true);
        BookingFactory::new()->count(2)->create();

        $response = $this->makeCall();

        $response->assertStatus(200);
        $responseContent = $this->getResponseContentObject();

        $this->assertCount(2, $responseContent->data);
    }

    // TODO TEST
    // add some roles and permissions to this route's request
    // then add them to the $access array above
    // uncomment this test to test accesses
    // public function testListBookingsByNonAdmin(): void
    // {
    //     $this->getTestingUserWithoutAccess();
    //     BookingFactory::new()->count(2)->create();
    //
    //     $response = $this->makeCall();
    //
    //     $response->assertStatus(403);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //             $json->has('message')
    //                 ->where('message', 'This action is unauthorized.')
    //                 ->etc()
    //     );
    // }

    // TODO TEST
    // public function testSearchBookingsByFields(): void
    // {
    //     BookingFactory::new()->count(3)->create();
    //     // create a model with specific field values
    //     $booking = BookingFactory::new()->create([
    //         // 'name' => 'something',
    //     ]);
    //
    //     // search by the above values
    //     $response = $this->endpoint($this->endpoint . "?search=name:" . urlencode($booking->name))->makeCall();
    //
    //     $response->assertStatus(200);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //             $json->has('data')
    //                 // ->where('data.0.name', $booking->name)
    //                 ->etc()
    //     );
    // }

    public function testSearchBookingsByHashID(): void
    {
        $bookings = BookingFactory::new()->count(3)->create();
        $secondBooking = $bookings[1];

        $response = $this->endpoint($this->endpoint . '?search=id:' . $secondBooking->getHashedKey())->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                     ->where('data.0.id', $secondBooking->getHashedKey())
                    ->etc()
        );
    }
}
