<?php

namespace App\Containers\AppSection\Table\UI\API\Tests\Functional;

use App\Containers\AppSection\Table\Data\Factories\TableFactory;
use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\Table\UI\API\Tests\ApiTestCase;
use Illuminate\Testing\Fluent\AssertableJson;

/**
 * @group table
 * @group api
 */
class FindTableByIdTest extends ApiTestCase
{
    protected string $endpoint = 'get@v1/tables/{id}';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testFindTable(): void
    {
        $table = TableFactory::new()->createOne();

        $response = $this->injectId($table->id)->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                    ->where('data.id', $this->encode($table->id))
                    ->etc()
        );
    }

    public function testFindNonExistingTable(): void
    {
        $invalidId = 7777;

        $response = $this->injectId($invalidId)->makeCall([]);

        $response->assertStatus(404);
    }

    public function testFindFilteredTableResponse(): void
    {
        $table = TableFactory::new()->createOne();

        $response = $this->injectId($table->id)->endpoint($this->endpoint . '?filter=id')->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                    ->where('data.id', $table->getHashedKey())
                    ->missing('data.object')
        );
    }

    // TODO TEST
    // if your model have relationships which can be included into the response then
    // uncomment this test
    // modify it to your needs
    // test the relation
    // public function testFindTableWithRelation(): void
    // {
    //     $table = TableFactory::new()->createOne();
    //     $relation = 'roles';
    //
    //     $response = $this->injectId($table->id)->endpoint($this->endpoint . "?include=$relation")->makeCall();
    //
    //     $response->assertStatus(200);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //           $json->has('data')
    //               ->where('data.id', $table->getHashedKey())
    //               ->count("data.$relation.data", 1)
    //               ->where("data.$relation.data.0.name", 'something')
    //               ->etc()
    //     );
    // }
}
