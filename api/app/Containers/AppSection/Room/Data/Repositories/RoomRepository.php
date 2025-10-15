<?php

namespace App\Containers\AppSection\Room\Data\Repositories;

use App\Ship\Parents\Repositories\Repository as ParentRepository;

class RoomRepository extends ParentRepository
{
    protected $fieldSearchable = [
        'id' => '=',
        // ...
    ];
}
