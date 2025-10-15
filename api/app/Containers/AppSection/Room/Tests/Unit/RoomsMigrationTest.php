<?php

namespace App\Containers\AppSection\Room\Tests\Unit;

use App\Containers\AppSection\Room\Tests\UnitTestCase;
use Illuminate\Support\Facades\Schema;

/**
 * @group room
 * @group unit
 */
class RoomsMigrationTest extends UnitTestCase
{
    public function test_rooms_table_has_expected_columns(): void
    {
        $columns = [
            'id',
            // add your migration columns
            'created_at',
            'updated_at',
        ];

        foreach ($columns as $column) {
            $this->assertTrue(Schema::hasColumn('rooms', $column));
        }
    }
}
