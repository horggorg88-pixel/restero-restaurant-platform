<?php

namespace App\Containers\AppSection\History\Events;

use App\Containers\AppSection\History\Models\History;
use App\Ship\Parents\Events\Event as ParentEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;

class HistoriesListedEvent extends ParentEvent
{
    public function __construct(
        public readonly mixed $history,
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
