<?php

namespace App\Containers\AppSection\Restaurants\Tests\Unit;

use App\Containers\AppSection\Restaurants\Data\Factories\RestaurantsFactory;
use App\Containers\AppSection\Restaurants\Tasks\ListRestaurantsTask;
use App\Containers\AppSection\Restaurants\Tests\UnitTestCase;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * @group restaurants
 * @group unit
 */
class ListRestaurantsTaskTest extends UnitTestCase
{
    public function testListRestaurants(): void
    {
        RestaurantsFactory::new()->count(3)->create();

        $foundRestaurants = app(ListRestaurantsTask::class)->run();

        $this->assertCount(3, $foundRestaurants);
        $this->assertInstanceOf(LengthAwarePaginator::class, $foundRestaurants);
    }
}
