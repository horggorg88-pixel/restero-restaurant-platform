<?php

namespace App\Containers\AppSection\Table\Tests\Unit;

use App\Containers\AppSection\Table\Events\TableCreatedEvent;
use App\Containers\AppSection\Table\Tasks\CreateTableTask;
use App\Containers\AppSection\Table\Tests\UnitTestCase;
use App\Ship\Exceptions\CreateResourceFailedException;
use Illuminate\Support\Facades\Event;

/**
 * @group table
 * @group unit
 */
class CreateTableTaskTest extends UnitTestCase
{
    public function testCreateTable(): void
    {
        Event::fake();
        $data = [];

        $table = app(CreateTableTask::class)->run($data);

        $this->assertModelExists($table);
        Event::assertDispatched(TableCreatedEvent::class);
    }

    // TODO TEST
    // public function testCreateTableWithInvalidData(): void
    // {
    //     $this->expectException(CreateResourceFailedException::class);
    //
    //     $data = [
    //         // put some invalid data here
    //         // 'invalid' => 'data',
    //     ];
    //
    //     app(CreateTableTask::class)->run($data);
    // }
}
