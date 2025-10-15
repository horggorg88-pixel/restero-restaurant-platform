<?php

namespace App\Containers\AppSection\Room\UI\API\Tests\Functional;

use App\Containers\AppSection\Room\Data\Factories\RoomFactory;
use App\Containers\AppSection\Room\Models\Room;
use App\Containers\AppSection\Room\UI\API\Tests\ApiTestCase;
use Illuminate\Testing\Fluent\AssertableJson;

/**
 * @group room
 * @group api
 */
class ListRoomsTest extends ApiTestCase
{
    protected string $endpoint = 'get@v1/rooms';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testListRoomsByAdmin(): void
    {
        $this->getTestingUserWithoutAccess(createUserAsAdmin: true);
        RoomFactory::new()->count(2)->create();

        $response = $this->makeCall();

        $response->assertStatus(200);
        $responseContent = $this->getResponseContentObject();

        $this->assertCount(2, $responseContent->data);
    }

    // TODO TEST
    // add some roles and permissions to this route's request
    // then add them to the $access array above
    // uncomment this test to test accesses
    // public function testListRoomsByNonAdmin(): void
    // {
    //     $this->getTestingUserWithoutAccess();
    //     RoomFactory::new()->count(2)->create();
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
    // public function testSearchRoomsByFields(): void
    // {
    //     RoomFactory::new()->count(3)->create();
    //     // create a model with specific field values
    //     $room = RoomFactory::new()->create([
    //         // 'name' => 'something',
    //     ]);
    //
    //     // search by the above values
    //     $response = $this->endpoint($this->endpoint . "?search=name:" . urlencode($room->name))->makeCall();
    //
    //     $response->assertStatus(200);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //             $json->has('data')
    //                 // ->where('data.0.name', $room->name)
    //                 ->etc()
    //     );
    // }

    public function testSearchRoomsByHashID(): void
    {
        $rooms = RoomFactory::new()->count(3)->create();
        $secondRoom = $rooms[1];

        $response = $this->endpoint($this->endpoint . '?search=id:' . $secondRoom->getHashedKey())->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                     ->where('data.0.id', $secondRoom->getHashedKey())
                    ->etc()
        );
    }
}
