<?php

namespace App\Containers\AppSection\Room\Tests\Unit;

use App\Containers\AppSection\Room\Data\Factories\RoomFactory;
use App\Containers\AppSection\Room\Events\RoomUpdatedEvent;
use App\Containers\AppSection\Room\Tasks\UpdateRoomTask;
use App\Containers\AppSection\Room\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;
use Illuminate\Support\Facades\Event;

/**
 * @group room
 * @group unit
 */
class UpdateRoomTaskTest extends UnitTestCase
{
    // TODO TEST
    public function testUpdateRoom(): void
    {
        Event::fake();
        $room = RoomFactory::new()->createOne();
        $data = [
            // add some fillable fields here
            // 'some_field' => 'new_field_data',
        ];

        $updatedRoom = app(UpdateRoomTask::class)->run($data, $room->id);

        $this->assertEquals($room->id, $updatedRoom->id);
        // assert if fields are updated
        // $this->assertEquals($data['some_field'], $updatedRoom->some_field);
        Event::assertDispatched(RoomUpdatedEvent::class);
    }

    public function testUpdateRoomWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(UpdateRoomTask::class)->run([], $noneExistingId);
    }
}
