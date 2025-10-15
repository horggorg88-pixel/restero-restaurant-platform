<?php

namespace App\Containers\AppSection\Table\Tests\Unit;

use App\Containers\AppSection\Table\Data\Factories\TableFactory;
use App\Containers\AppSection\Table\Events\TableFoundByIdEvent;
use App\Containers\AppSection\Table\Tasks\FindTableByIdTask;
use App\Containers\AppSection\Table\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;
use Illuminate\Support\Facades\Event;

/**
 * @group table
 * @group unit
 */
class FindTableByIdTaskTest extends UnitTestCase
{
    public function testFindTableById(): void
    {
        Event::fake();
        $table = TableFactory::new()->createOne();

        $foundTable = app(FindTableByIdTask::class)->run($table->id);

        $this->assertEquals($table->id, $foundTable->id);
        Event::assertDispatched(TableFoundByIdEvent::class);
    }

    public function testFindTableWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(FindTableByIdTask::class)->run($noneExistingId);
    }
}
