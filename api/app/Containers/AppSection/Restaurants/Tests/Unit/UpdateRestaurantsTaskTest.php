<?php

namespace App\Containers\AppSection\Restaurants\Tests\Unit;

use App\Containers\AppSection\Restaurants\Data\Factories\RestaurantsFactory;
use App\Containers\AppSection\Restaurants\Tasks\UpdateRestaurantsTask;
use App\Containers\AppSection\Restaurants\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;

/**
 * @group restaurants
 * @group unit
 */
class UpdateRestaurantsTaskTest extends UnitTestCase
{
    // TODO TEST
    public function testUpdateRestaurants(): void
    {
        $restaurants = RestaurantsFactory::new()->create([
            // 'some_field' => 'new_field_value',
        ]);
        $data = [
            // 'some_field' => 'new_field_value',
        ];

        $updatedRestaurants = app(UpdateRestaurantsTask::class)->run($data, $restaurants->id);

        $this->assertEquals($restaurants->id, $updatedRestaurants->id);
        // assert if fields are updated
        // $this->assertEquals($data['some_field'], $updatedRestaurants->some_field);
    }

    public function testUpdateRestaurantsWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(UpdateRestaurantsTask::class)->run([], $noneExistingId);
    }
}
