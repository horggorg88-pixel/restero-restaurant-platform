<?php

namespace App\Containers\AppSection\Restaurants\Data\Repositories;

use App\Ship\Parents\Repositories\Repository as ParentRepository;

class RestaurantRepository extends ParentRepository
{
    protected $fieldSearchable = [
        'id' => '=',
        // ...
    ];
}
