<?php

namespace App\Containers\AppSection\Booking\Events;

use App\Containers\AppSection\Booking\Models\Booking;
use App\Ship\Parents\Events\Event as ParentEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;

class BookingsListedEvent extends ParentEvent
{
    public function __construct(
        public readonly mixed $booking,
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
