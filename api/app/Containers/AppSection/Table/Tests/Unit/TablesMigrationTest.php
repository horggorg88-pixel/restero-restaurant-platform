<?php

namespace App\Containers\AppSection\Table\Tests\Unit;

use App\Containers\AppSection\Table\Tests\UnitTestCase;
use Illuminate\Support\Facades\Schema;

/**
 * @group table
 * @group unit
 */
class TablesMigrationTest extends UnitTestCase
{
    public function test_tables_table_has_expected_columns(): void
    {
        $columns = [
            'id',
            // add your migration columns
            'created_at',
            'updated_at',
        ];

        foreach ($columns as $column) {
            $this->assertTrue(Schema::hasColumn('tables', $column));
        }
    }
}
