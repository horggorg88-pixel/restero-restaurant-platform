<?php

namespace App\Containers\AppSection\Table\Events;

use App\Containers\AppSection\Table\Models\Table;
use App\Ship\Parents\Events\Event as ParentEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;

class TableUpdatedEvent extends ParentEvent
{
    public function __construct(
        public readonly Table $table,
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
