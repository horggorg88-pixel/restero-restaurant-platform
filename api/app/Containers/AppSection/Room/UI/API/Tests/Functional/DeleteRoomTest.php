<?php

namespace App\Containers\AppSection\Room\UI\API\Tests\Functional;

use App\Containers\AppSection\Room\Data\Factories\RoomFactory;
use App\Containers\AppSection\Room\Models\Room;
use App\Containers\AppSection\Room\UI\API\Tests\ApiTestCase;

/**
 * @group room
 * @group api
 */
class DeleteRoomTest extends ApiTestCase
{
    protected string $endpoint = 'delete@v1/rooms/{id}';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testDeleteExistingRoom(): void
    {
        $room = RoomFactory::new()->createOne();

        $response = $this->injectId($room->id)->makeCall();

        $response->assertStatus(204);
    }

    public function testDeleteNonExistingRoom(): void
    {
        $invalidId = 7777;

        $response = $this->injectId($invalidId)->makeCall([]);

        $response->assertStatus(404);
    }

    // TODO TEST
    // add some roles and permissions to this route's request
    // then add them to the $access array above
    // uncomment this test to test accesses
    // public function testGivenHaveNoAccess_CannotDeleteRoom(): void
    // {
    //     $this->getTestingUserWithoutAccess();
    //     $room = RoomFactory::new()->createOne();
    //
    //     $response = $this->injectId($room->id)->makeCall();
    //
    //     $response->assertStatus(403);
    // }
}
