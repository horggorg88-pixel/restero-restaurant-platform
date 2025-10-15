<?php

namespace App\Containers\AppSection\Restaurants\Tests\Unit;

use App\Containers\AppSection\Restaurants\Data\Factories\RestaurantsFactory;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\Tests\UnitTestCase;

/**
 * @group restaurants
 * @group unit
 */
class RestaurantsFactoryTest extends UnitTestCase
{
    public function testCreateRestaurants(): void
    {
        $restaurants = RestaurantsFactory::new()->make();

        $this->assertInstanceOf(Restaurant::class, $restaurants);
    }
}
