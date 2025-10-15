<?php

namespace App\Containers\AppSection\Room\Tests\Unit;

use App\Containers\AppSection\Room\Data\Factories\RoomFactory;
use App\Containers\AppSection\Room\Events\RoomsListedEvent;
use App\Containers\AppSection\Room\Tasks\ListRoomsTask;
use App\Containers\AppSection\Room\Tests\UnitTestCase;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Event;

/**
 * @group room
 * @group unit
 */
class ListRoomsTaskTest extends UnitTestCase
{
    public function testListRooms(): void
    {
        Event::fake();
        RoomFactory::new()->count(3)->create();

        $foundRooms = app(ListRoomsTask::class)->run();

        $this->assertCount(3, $foundRooms);
        $this->assertInstanceOf(LengthAwarePaginator::class, $foundRooms);
        Event::assertDispatched(RoomsListedEvent::class);
    }
}
