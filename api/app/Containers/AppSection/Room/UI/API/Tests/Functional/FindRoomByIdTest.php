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
class FindRoomByIdTest extends ApiTestCase
{
    protected string $endpoint = 'get@v1/rooms/{id}';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testFindRoom(): void
    {
        $room = RoomFactory::new()->createOne();

        $response = $this->injectId($room->id)->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                    ->where('data.id', $this->encode($room->id))
                    ->etc()
        );
    }

    public function testFindNonExistingRoom(): void
    {
        $invalidId = 7777;

        $response = $this->injectId($invalidId)->makeCall([]);

        $response->assertStatus(404);
    }

    public function testFindFilteredRoomResponse(): void
    {
        $room = RoomFactory::new()->createOne();

        $response = $this->injectId($room->id)->endpoint($this->endpoint . '?filter=id')->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                    ->where('data.id', $room->getHashedKey())
                    ->missing('data.object')
        );
    }

    // TODO TEST
    // if your model have relationships which can be included into the response then
    // uncomment this test
    // modify it to your needs
    // test the relation
    // public function testFindRoomWithRelation(): void
    // {
    //     $room = RoomFactory::new()->createOne();
    //     $relation = 'roles';
    //
    //     $response = $this->injectId($room->id)->endpoint($this->endpoint . "?include=$relation")->makeCall();
    //
    //     $response->assertStatus(200);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //           $json->has('data')
    //               ->where('data.id', $room->getHashedKey())
    //               ->count("data.$relation.data", 1)
    //               ->where("data.$relation.data.0.name", 'something')
    //               ->etc()
    //     );
    // }
}
