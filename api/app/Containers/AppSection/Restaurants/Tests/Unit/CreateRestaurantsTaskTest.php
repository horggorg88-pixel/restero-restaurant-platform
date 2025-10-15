<?php

namespace App\Containers\AppSection\Restaurants\Tests\Unit;

use App\Containers\AppSection\Restaurants\Tasks\CreateRestaurantsTask;
use App\Containers\AppSection\Restaurants\Tests\UnitTestCase;

use App\Ship\Exceptions\CreateResourceFailedException;

/**
 * @group restaurants
 * @group unit
 */
class CreateRestaurantsTaskTest extends UnitTestCase
{
    public function testCreateRestaurants(): void
    {
        $data = [];

        $restaurants = app(CreateRestaurantsTask::class)->run($data);

        $this->assertModelExists($restaurants);
    }

    // TODO TEST
    // public function testCreateRestaurantsWithInvalidData(): void
    // {
    //     $this->expectException(CreateResourceFailedException::class);
    //
    //     $data = [
    //         // put some invalid data here
    //         // 'invalid' => 'data',
    //     ];
    //
    //     app(CreateRestaurantsTask::class)->run($data);
    // }
}
