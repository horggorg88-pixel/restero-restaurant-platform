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
class ListTablesTest extends ApiTestCase
{
    protected string $endpoint = 'get@v1/tables';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testListTablesByAdmin(): void
    {
        $this->getTestingUserWithoutAccess(createUserAsAdmin: true);
        TableFactory::new()->count(2)->create();

        $response = $this->makeCall();

        $response->assertStatus(200);
        $responseContent = $this->getResponseContentObject();

        $this->assertCount(2, $responseContent->data);
    }

    // TODO TEST
    // add some roles and permissions to this route's request
    // then add them to the $access array above
    // uncomment this test to test accesses
    // public function testListTablesByNonAdmin(): void
    // {
    //     $this->getTestingUserWithoutAccess();
    //     TableFactory::new()->count(2)->create();
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
    // public function testSearchTablesByFields(): void
    // {
    //     TableFactory::new()->count(3)->create();
    //     // create a model with specific field values
    //     $table = TableFactory::new()->create([
    //         // 'name' => 'something',
    //     ]);
    //
    //     // search by the above values
    //     $response = $this->endpoint($this->endpoint . "?search=name:" . urlencode($table->name))->makeCall();
    //
    //     $response->assertStatus(200);
    //     $response->assertJson(
    //         fn (AssertableJson $json) =>
    //             $json->has('data')
    //                 // ->where('data.0.name', $table->name)
    //                 ->etc()
    //     );
    // }

    public function testSearchTablesByHashID(): void
    {
        $tables = TableFactory::new()->count(3)->create();
        $secondTable = $tables[1];

        $response = $this->endpoint($this->endpoint . '?search=id:' . $secondTable->getHashedKey())->makeCall();

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
                $json->has('data')
                     ->where('data.0.id', $secondTable->getHashedKey())
                    ->etc()
        );
    }
}
