<?php

namespace App\Containers\AppSection\Restaurants\Data\Repositories;

use App\Ship\Parents\Repositories\Repository as ParentRepository;

class ModelHasRestaurantRepository extends ParentRepository
{
    protected $fieldSearchable = [
        'id' => '=',
        // ...
    ];
}
