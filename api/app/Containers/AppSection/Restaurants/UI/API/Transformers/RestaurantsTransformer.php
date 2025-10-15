<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Transformers;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Parents\Transformers\Transformer as ParentTransformer;

class RestaurantsTransformer extends ParentTransformer
{
    protected array $defaultIncludes = [

    ];

    protected array $availableIncludes = [

    ];

    public function transform($restaurants): array
    {
        if($restaurants instanceof Restaurant) {
            return [
                'object' => $restaurants->getResourceKey(),
                'id' => $restaurants->getHashedKey(),
                'name' => $restaurants->name,
                'start_time' => $restaurants->start_time,
                'end_time' => $restaurants->end_time,
            ];
        }
        return [];
    }
}
