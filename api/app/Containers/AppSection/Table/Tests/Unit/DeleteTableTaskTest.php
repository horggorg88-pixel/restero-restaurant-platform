<?php

namespace App\Containers\AppSection\Table\Tests\Unit;

use App\Containers\AppSection\Table\Data\Factories\TableFactory;
use App\Containers\AppSection\Table\Events\TableDeletedEvent;
use App\Containers\AppSection\Table\Tasks\DeleteTableTask;
use App\Containers\AppSection\Table\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;
use Illuminate\Support\Facades\Event;

/**
 * @group table
 * @group unit
 */
class DeleteTableTaskTest extends UnitTestCase
{
    public function testDeleteTable(): void
    {
        Event::fake();
        $table = TableFactory::new()->createOne();

        $result = app(DeleteTableTask::class)->run($table->id);

        $this->assertEquals(1, $result);
        Event::assertDispatched(TableDeletedEvent::class);
    }

    public function testDeleteTableWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(DeleteTableTask::class)->run($noneExistingId);
    }
}
