<?php

namespace App\Containers\AppSection\Room\Tests\Unit;

use App\Containers\AppSection\Room\Data\Factories\RoomFactory;
use App\Containers\AppSection\Room\Events\RoomDeletedEvent;
use App\Containers\AppSection\Room\Tasks\DeleteRoomTask;
use App\Containers\AppSection\Room\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;
use Illuminate\Support\Facades\Event;

/**
 * @group room
 * @group unit
 */
class DeleteRoomTaskTest extends UnitTestCase
{
    public function testDeleteRoom(): void
    {
        Event::fake();
        $room = RoomFactory::new()->createOne();

        $result = app(DeleteRoomTask::class)->run($room->id);

        $this->assertEquals(1, $result);
        Event::assertDispatched(RoomDeletedEvent::class);
    }

    public function testDeleteRoomWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(DeleteRoomTask::class)->run($noneExistingId);
    }
}
