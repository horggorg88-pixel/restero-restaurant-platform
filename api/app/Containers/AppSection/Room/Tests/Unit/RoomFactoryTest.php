<?php

namespace App\Containers\AppSection\Room\Tests\Unit;

use App\Containers\AppSection\Room\Data\Factories\RoomFactory;
use App\Containers\AppSection\Room\Models\Room;
use App\Containers\AppSection\Room\Tests\UnitTestCase;

/**
 * @group room
 * @group unit
 */
class RoomFactoryTest extends UnitTestCase
{
    public function testCreateRoom(): void
    {
        $room = RoomFactory::new()->make();

        $this->assertInstanceOf(Room::class, $room);
    }
}
