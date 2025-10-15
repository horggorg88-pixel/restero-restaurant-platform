<?php

namespace App\Containers\AppSection\Table\Tests\Unit;

use App\Containers\AppSection\Table\Data\Factories\TableFactory;
use App\Containers\AppSection\Table\Events\TablesListedEvent;
use App\Containers\AppSection\Table\Tasks\ListTablesTask;
use App\Containers\AppSection\Table\Tests\UnitTestCase;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Event;

/**
 * @group table
 * @group unit
 */
class ListTablesTaskTest extends UnitTestCase
{
    public function testListTables(): void
    {
        Event::fake();
        TableFactory::new()->count(3)->create();

        $foundTables = app(ListTablesTask::class)->run();

        $this->assertCount(3, $foundTables);
        $this->assertInstanceOf(LengthAwarePaginator::class, $foundTables);
        Event::assertDispatched(TablesListedEvent::class);
    }
}
