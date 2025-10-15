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
class FindBookingByIdTest extends ApiTestCase
{
    protected string $endpoint = 'get@v1/bookings/{id}';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testFindBooking(): void
    {
        $booking = BookingFactory::new()->createOne();

        $response = $this->injectId($booking->id)->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                    ->where('data.id', $this->encode($booking->id))
                    ->etc()
        );
    }

    public function testFindNonExistingBooking(): void
    {
        $invalidId = 7777;

        $response = $this->injectId($invalidId)->makeCall([]);

        $response->assertStatus(404);
    }

    public function testFindFilteredBookingResponse(): void
    {
        $booking = BookingFactory::new()->createOne();

        $response = $this->injectId($booking->id)->endpoint($this->endpoint . '?filter=id')->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                    ->where('data.id', $booking->getHashedKey())
                    ->missing('data.object')
        );
    }

    // TODO TEST
    // if your model have relationships which can be included into the response then
    // uncomment this test
    // modify it to your needs
    // test the relation
    // public function testFindBookingWithRelation(): void
    // {
    //     $booking = BookingFactory::new()->createOne();
    //     $relation = 'roles';
    //
    //     $response = $this->injectId($booking->id)->endpoint($this->endpoint . "?include=$relation")->makeCall();
    //
    //     $response->assertStatus(200);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //           $json->has('data')
    //               ->where('data.id', $booking->getHashedKey())
    //               ->count("data.$relation.data", 1)
    //               ->where("data.$relation.data.0.name", 'something')
    //               ->etc()
    //     );
    // }
}
