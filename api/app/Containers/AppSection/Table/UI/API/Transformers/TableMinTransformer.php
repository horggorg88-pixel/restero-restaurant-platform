<?php

namespace App\Containers\AppSection\Table\UI\API\Transformers;

use App\Containers\AppSection\Booking\UI\API\Transformers\BookingTransformer;
use App\Containers\AppSection\Table\Models\Table;
use App\Ship\Parents\Transformers\Transformer as ParentTransformer;

class TableMinTransformer extends ParentTransformer
{



    protected array $defaultIncludes = [

    ];

    protected array $availableIncludes = [

    ];

    public function transform(Table $table): array
    {
        return [
            'object' => $table->getResourceKey(),
            'id' => $table->getHashedKey(),
            'number' => $table->number,
            'count_people' => $table->count_people,
            'room_id' => $table->room->getHashedKey(),
            'comment' => $table->comment,
        ];
    }

    public function includeBookings(Table $table) {
        return $this->collection($table->bookings, new BookingTransformer());
    }


}
