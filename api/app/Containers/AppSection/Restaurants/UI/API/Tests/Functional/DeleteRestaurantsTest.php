<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Tests\Functional;

use App\Containers\AppSection\Restaurants\Data\Factories\RestaurantsFactory;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\UI\API\Tests\ApiTestCase;

/**
 * @group restaurants
 * @group api
 */
class DeleteRestaurantsTest extends ApiTestCase
{
    protected string $endpoint = 'delete@v1/restaurants/{id}';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testDeleteExistingRestaurants(): void
    {
        $restaurants = RestaurantsFactory::new()->createOne();

        $response = $this->injectId($restaurants->id)->makeCall();

        $response->assertStatus(204);
    }

    public function testDeleteNonExistingRestaurants(): void
    {
        $invalidId = 7777;

        $response = $this->injectId($invalidId)->makeCall([]);

        $response->assertStatus(404);
    }

    // TODO TEST
    // add some roles and permissions to this route's request
    // then add them to the $access array above
    // uncomment this test to test accesses
    // public function testGivenHaveNoAccess_CannotDeleteRestaurants(): void
    // {
    //     $this->getTestingUserWithoutAccess();
    //     $restaurants = RestaurantsFactory::new()->createOne();
    //
    //     $response = $this->injectId($restaurants->id)->makeCall();
    //
    //     $response->assertStatus(403);
    // }
}
