<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Tests\Functional;

use App\Containers\AppSection\Restaurants\Data\Factories\RestaurantsFactory;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\UI\API\Tests\ApiTestCase;
use Illuminate\Testing\Fluent\AssertableJson;

/**
 * @group restaurants
 * @group api
 */
class ListRestaurantsTest extends ApiTestCase
{
    protected string $endpoint = 'get@v1/restaurants';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testListRestaurantsByAdmin(): void
    {
        $this->getTestingUserWithoutAccess(createUserAsAdmin: true);
        RestaurantsFactory::new()->count(2)->create();

        $response = $this->makeCall();

        $response->assertStatus(200);
        $responseContent = $this->getResponseContentObject();

        $this->assertCount(2, $responseContent->data);
    }

    // TODO TEST
    // add some roles and permissions to this route's request
    // then add them to the $access array above
    // uncomment this test to test accesses
    // public function testListRestaurantsByNonAdmin(): void
    // {
    //     $this->getTestingUserWithoutAccess();
    //     RestaurantsFactory::new()->count(2)->create();
    //
    //     $response = $this->makeCall();
    //
    //     $response->assertStatus(403);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //             $json->has('message')
    //                 ->where('message', 'This action is unauthorized.')
    //                 ->etc()
    //     );
    // }

    // TODO TEST
    // public function testSearchRestaurantsByFields(): void
    // {
    //     RestaurantsFactory::new()->count(3)->create();
    //     // create a model with specific field values
    //     $restaurants = RestaurantsFactory::new()->create([
    //         // 'name' => 'something',
    //     ]);
    //
    //     // search by the above values
    //     $response = $this->endpoint($this->endpoint . "?search=name:" . urlencode($restaurants->name))->makeCall();
    //
    //     $response->assertStatus(200);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //             $json->has('data')
    //                 // ->where('data.0.name', $restaurants->name)
    //                 ->etc()
    //     );
    // }

    public function testSearchRestaurantsByHashID(): void
    {
        $restaurants = RestaurantsFactory::new()->count(3)->create();
        $secondRestaurants = $restaurants[1];

        $response = $this->endpoint($this->endpoint . '?search=id:' . $secondRestaurants->getHashedKey())->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                     ->where('data.0.id', $secondRestaurants->getHashedKey())
                    ->etc()
        );
    }
}
