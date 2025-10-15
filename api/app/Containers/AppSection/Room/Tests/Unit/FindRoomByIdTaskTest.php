<?php

namespace App\Containers\AppSection\Room\Tests\Unit;

use App\Containers\AppSection\Room\Data\Factories\RoomFactory;
use App\Containers\AppSection\Room\Events\RoomFoundByIdEvent;
use App\Containers\AppSection\Room\Tasks\FindRoomByIdTask;
use App\Containers\AppSection\Room\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;
use Illuminate\Support\Facades\Event;

/**
 * @group room
 * @group unit
 */
class FindRoomByIdTaskTest extends UnitTestCase
{
    public function testFindRoomById(): void
    {
        Event::fake();
        $room = RoomFactory::new()->createOne();

        $foundRoom = app(FindRoomByIdTask::class)->run($room->id);

        $this->assertEquals($room->id, $foundRoom->id);
        Event::assertDispatched(RoomFoundByIdEvent::class);
    }

    public function testFindRoomWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(FindRoomByIdTask::class)->run($noneExistingId);
    }
}
