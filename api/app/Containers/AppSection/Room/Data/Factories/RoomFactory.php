<?php

namespace App\Containers\AppSection\Room\Data\Factories;

use App\Containers\AppSection\Room\Models\Room;
use App\Ship\Parents\Factories\Factory as ParentFactory;

/**
 * @template TModel of RoomFactory
 *
 * @extends ParentFactory<TModel>
 */
class RoomFactory extends ParentFactory
{
    /** @var class-string<TModel> */
    protected $model = Room::class;

    public function definition(): array
    {
        return [
            //
        ];
    }
}
