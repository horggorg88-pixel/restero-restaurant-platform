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
class FindRestaurantsByIdTest extends ApiTestCase
{
    protected string $endpoint = 'get@v1/restaurants/{id}';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testFindRestaurants(): void
    {
        $restaurants = RestaurantsFactory::new()->createOne();

        $response = $this->injectId($restaurants->id)->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                    ->where('data.id', $this->encode($restaurants->id))
                    ->etc()
        );
    }

    public function testFindNonExistingRestaurants(): void
    {
        $invalidId = 7777;

        $response = $this->injectId($invalidId)->makeCall([]);

        $response->assertStatus(404);
    }

    public function testFindFilteredRestaurantsResponse(): void
    {
        $restaurants = RestaurantsFactory::new()->createOne();

        $response = $this->injectId($restaurants->id)->endpoint($this->endpoint . '?filter=id')->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                    ->where('data.id', $restaurants->getHashedKey())
                    ->missing('data.object')
        );
    }

    // TODO TEST
    // if your model have relationships which can be included into the response then
    // uncomment this test
    // modify it to your needs
    // test the relation
    // public function testFindRestaurantsWithRelation(): void
    // {
    //     $restaurants = RestaurantsFactory::new()->createOne();
    //     $relation = 'roles';
    //
    //     $response = $this->injectId($restaurants->id)->endpoint($this->endpoint . "?include=$relation")->makeCall();
    //
    //     $response->assertStatus(200);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //           $json->has('data')
    //               ->where('data.id', $restaurants->getHashedKey())
    //               ->count("data.$relation.data", 1)
    //               ->where("data.$relation.data.0.name", 'something')
    //               ->etc()
    //     );
    // }
}
