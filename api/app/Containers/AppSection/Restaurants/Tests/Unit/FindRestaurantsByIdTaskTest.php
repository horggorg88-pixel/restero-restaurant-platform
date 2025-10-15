<?php

namespace App\Containers\AppSection\Restaurants\Tests\Unit;

use App\Containers\AppSection\Restaurants\Data\Factories\RestaurantsFactory;
use App\Containers\AppSection\Restaurants\Tasks\FindRestaurantsByIdTask;
use App\Containers\AppSection\Restaurants\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;

/**
 * @group restaurants
 * @group unit
 */
class FindRestaurantsByIdTaskTest extends UnitTestCase
{
    public function testFindRestaurantsById(): void
    {
        $restaurants = RestaurantsFactory::new()->createOne();

        $foundRestaurants = app(FindRestaurantsByIdTask::class)->run($restaurants->id);

        $this->assertEquals($restaurants->id, $foundRestaurants->id);
    }

    public function testFindRestaurantsWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(FindRestaurantsByIdTask::class)->run($noneExistingId);
    }
}
