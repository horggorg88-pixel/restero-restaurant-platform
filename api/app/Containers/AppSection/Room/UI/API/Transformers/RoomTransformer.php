<?php

namespace App\Containers\AppSection\Room\UI\API\Transformers;

use App\Containers\AppSection\Restaurants\UI\API\Transformers\RestaurantsTransformer;
use App\Containers\AppSection\Room\Models\Room;
use App\Containers\AppSection\Table\UI\API\Transformers\TableMinTransformer;
use App\Containers\AppSection\Table\UI\API\Transformers\TableTransformer;
use App\Containers\AppSection\User\Models\User;
use App\Ship\Parents\Transformers\Transformer as ParentTransformer;

class RoomTransformer extends ParentTransformer
{
    protected array $defaultIncludes = [
        'restaurant',
        'tables'
    ];

    protected array $availableIncludes = [

    ];

    public function transform(Room $room): array
    {
        return [
            'object' => $room->getResourceKey(),
            'id' => $room->getHashedKey(),
            'name' => $room->name,
            'comment' => $room->comment
        ];


    }

    public function includeRestaurant(Room $room) {
        return $this->item($room->restaurant, new RestaurantsTransformer());
    }

    public function includeTables(Room $room) {
        return $this->collection($room->tables, new TableMinTransformer());
    }
}
