<?php

namespace App\Containers\AppSection\Table\Data\Repositories;

use App\Ship\Parents\Repositories\Repository as ParentRepository;

class TableRepository extends ParentRepository
{
    protected $fieldSearchable = [
        'id' => '=',
        // ...
    ];
}
