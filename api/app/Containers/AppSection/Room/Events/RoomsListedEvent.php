<?php

namespace App\Containers\AppSection\Room\Events;

use App\Containers\AppSection\Room\Models\Room;
use App\Ship\Parents\Events\Event as ParentEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;

class RoomsListedEvent extends ParentEvent
{
    public function __construct(
        public readonly mixed $room,
    ) {
    }

    /**
     * @return Channel[]
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
