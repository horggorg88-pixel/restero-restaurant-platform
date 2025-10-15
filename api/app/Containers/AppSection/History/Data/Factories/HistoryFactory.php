<?php

namespace App\Containers\AppSection\History\Data\Factories;

use App\Containers\AppSection\History\Models\History;
use App\Ship\Parents\Factories\Factory as ParentFactory;

/**
 * @template TModel of HistoryFactory
 *
 * @extends ParentFactory<TModel>
 */
class HistoryFactory extends ParentFactory
{
    /** @var class-string<TModel> */
    protected $model = History::class;

    public function definition(): array
    {
        return [
            //
        ];
    }
}
