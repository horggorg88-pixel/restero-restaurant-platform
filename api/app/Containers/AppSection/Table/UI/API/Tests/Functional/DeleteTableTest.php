<?php

namespace App\Containers\AppSection\Table\UI\API\Tests\Functional;

use App\Containers\AppSection\Table\Data\Factories\TableFactory;
use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\Table\UI\API\Tests\ApiTestCase;

/**
 * @group table
 * @group api
 */
class DeleteTableTest extends ApiTestCase
{
    protected string $endpoint = 'delete@v1/tables/{id}';

    protected array $access = [
        'permissions' => '',
        'roles' => '',
    ];

    public function testDeleteExistingTable(): void
    {
        $table = TableFactory::new()->createOne();

        $response = $this->injectId($table->id)->makeCall();

        $response->assertStatus(204);
    }

    public function testDeleteNonExistingTable(): void
    {
        $invalidId = 7777;

        $response = $this->injectId($invalidId)->makeCall([]);

        $response->assertStatus(404);
    }

    // TODO TEST
    // add some roles and permissions to this route's request
    // then add them to the $access array above
    // uncomment this test to test accesses
    // public function testGivenHaveNoAccess_CannotDeleteTable(): void
    // {
    //     $this->getTestingUserWithoutAccess();
    //     $table = TableFactory::new()->createOne();
    //
    //     $response = $this->injectId($table->id)->makeCall();
    //
    //     $response->assertStatus(403);
    // }
}
