<?php

namespace App\Containers\AppSection\Restaurants\Tests\Unit;

use App\Containers\AppSection\Restaurants\Data\Factories\RestaurantsFactory;
use App\Containers\AppSection\Restaurants\Tasks\DeleteRestaurantsTask;
use App\Containers\AppSection\Restaurants\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;

/**
 * @group restaurants
 * @group unit
 */
class DeleteRestaurantsTaskTest extends UnitTestCase
{
    public function testDeleteRestaurants(): void
    {
        $restaurants = RestaurantsFactory::new()->createOne();

        $result = app(DeleteRestaurantsTask::class)->run($restaurants->id);

        $this->assertEquals(1, $result);
    }

    public function testDeleteRestaurantsWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(DeleteRestaurantsTask::class)->run($noneExistingId);
    }
}
