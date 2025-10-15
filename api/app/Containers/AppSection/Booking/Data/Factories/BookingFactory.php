<?php

namespace App\Containers\AppSection\Booking\Data\Factories;

use App\Containers\AppSection\Booking\Models\Booking;
use App\Ship\Parents\Factories\Factory as ParentFactory;

/**
 * @template TModel of BookingFactory
 *
 * @extends ParentFactory<TModel>
 */
class BookingFactory extends ParentFactory
{
    /** @var class-string<TModel> */
    protected $model = Booking::class;

    public function definition(): array
    {
        return [
            //
        ];
    }
}
