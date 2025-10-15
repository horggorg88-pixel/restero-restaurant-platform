<?php

namespace App\Containers\AppSection\History\Data\Repositories;

use App\Ship\Parents\Repositories\Repository as ParentRepository;

class HistoryRepository extends ParentRepository
{
    protected $fieldSearchable = [
        'id' => '=',
        // ...
    ];
}
