<?php

namespace App\Containers\AppSection\Restaurants\Tests\Unit;

use App\Containers\AppSection\Restaurants\Tests\UnitTestCase;
use Illuminate\Support\Facades\Schema;

/**
 * @group restaurants
 * @group unit
 */
class RestaurantsMigrationTest extends UnitTestCase
{
    public function test_restaurants_table_has_expected_columns(): void
    {
        $columns = [
            'id',
            // add your migration columns
            'created_at',
            'updated_at',
        ];

        foreach ($columns as $column) {
            $this->assertTrue(Schema::hasColumn('restaurants', $column));
        }
    }
}
