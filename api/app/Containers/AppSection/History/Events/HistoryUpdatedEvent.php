<?php

namespace App\Containers\AppSection\History\Events;

use App\Containers\AppSection\History\Models\History;
use App\Ship\Parents\Events\Event as ParentEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;

class HistoryUpdatedEvent extends ParentEvent
{
    public function __construct(
        public readonly History $history,
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
