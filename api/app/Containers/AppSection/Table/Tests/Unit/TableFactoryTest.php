<?php

namespace App\Containers\AppSection\Table\Tests\Unit;

use App\Containers\AppSection\Table\Data\Factories\TableFactory;
use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\Table\Tests\UnitTestCase;

/**
 * @group table
 * @group unit
 */
class TableFactoryTest extends UnitTestCase
{
    public function testCreateTable(): void
    {
        $table = TableFactory::new()->make();

        $this->assertInstanceOf(Table::class, $table);
    }
}
