<?php

namespace App\Containers\AppSection\Restaurants\Data\Factories;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Parents\Factories\Factory as ParentFactory;

/**
 * @template TModel of RestaurantsFactory
 *
 * @extends ParentFactory<TModel>
 */
class RestaurantsFactory extends ParentFactory
{
    /** @var class-string<TModel> */
    protected $model = Restaurant::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
        ];
    }
}
