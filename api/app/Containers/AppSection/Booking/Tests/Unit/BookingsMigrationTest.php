<?php

namespace App\Containers\AppSection\Booking\Tests\Unit;

use App\Containers\AppSection\Booking\Tests\UnitTestCase;
use Illuminate\Support\Facades\Schema;

/**
 * @group booking
 * @group unit
 */
class BookingsMigrationTest extends UnitTestCase
{
    public function test_bookings_table_has_expected_columns(): void
    {
        $columns = [
            'id',
            // add your migration columns
            'created_at',
            'updated_at',
        ];

        foreach ($columns as $column) {
            $this->assertTrue(Schema::hasColumn('bookings', $column));
        }
    }
}
