<?php

namespace App\Containers\AppSection\Table\Data\Factories;

use App\Containers\AppSection\Table\Models\Table;
use App\Ship\Parents\Factories\Factory as ParentFactory;

/**
 * @template TModel of TableFactory
 *
 * @extends ParentFactory<TModel>
 */
class TableFactory extends ParentFactory
{
    /** @var class-string<TModel> */
    protected $model = Table::class;

    public function definition(): array
    {
        return [
            //
        ];
    }
}
