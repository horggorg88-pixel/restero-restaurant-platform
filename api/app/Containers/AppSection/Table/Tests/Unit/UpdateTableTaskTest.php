<?php

namespace App\Containers\AppSection\Table\Tests\Unit;

use App\Containers\AppSection\Table\Data\Factories\TableFactory;
use App\Containers\AppSection\Table\Events\TableUpdatedEvent;
use App\Containers\AppSection\Table\Tasks\UpdateTableTask;
use App\Containers\AppSection\Table\Tests\UnitTestCase;
use App\Ship\Exceptions\NotFoundException;
use Illuminate\Support\Facades\Event;

/**
 * @group table
 * @group unit
 */
class UpdateTableTaskTest extends UnitTestCase
{
    // TODO TEST
    public function testUpdateTable(): void
    {
        Event::fake();
        $table = TableFactory::new()->createOne();
        $data = [
            // add some fillable fields here
            // 'some_field' => 'new_field_data',
        ];

        $updatedTable = app(UpdateTableTask::class)->run($data, $table->id);

        $this->assertEquals($table->id, $updatedTable->id);
        // assert if fields are updated
        // $this->assertEquals($data['some_field'], $updatedTable->some_field);
        Event::assertDispatched(TableUpdatedEvent::class);
    }

    public function testUpdateTableWithInvalidId(): void
    {
        $this->expectException(NotFoundException::class);

        $noneExistingId = 777777;

        app(UpdateTableTask::class)->run([], $noneExistingId);
    }
}
