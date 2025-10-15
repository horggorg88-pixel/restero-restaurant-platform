<?php

namespace App\Containers\AppSection\Room\Tests\Unit;

use App\Containers\AppSection\Room\Events\RoomCreatedEvent;
use App\Containers\AppSection\Room\Tasks\CreateRoomTask;
use App\Containers\AppSection\Room\Tests\UnitTestCase;
use App\Ship\Exceptions\CreateResourceFailedException;
use Illuminate\Support\Facades\Event;

/**
 * @group room
 * @group unit
 */
class CreateRoomTaskTest extends UnitTestCase
{
    public function testCreateRoom(): void
    {
        Event::fake();
        $data = [];

        $room = app(CreateRoomTask::class)->run($data);

        $this->assertModelExists($room);
        Event::assertDispatched(RoomCreatedEvent::class);
    }

    // TODO TEST
    // public function testCreateRoomWithInvalidData(): void
    // {
    //     $this->expectException(CreateResourceFailedException::class);
    //
    //     $data = [
    //         // put some invalid data here
    //         // 'invalid' => 'data',
    //     ];
    //
    //     app(CreateRoomTask::class)->run($data);
    // }
}
