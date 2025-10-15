<?php

namespace App\Containers\AppSection\Room\Models;

use App\Containers\AppSection\Restaurants\Models\ModelHasRestaurant;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\User\Models\User;
use App\Ship\Parents\Models\Model as ParentModel;

class Room extends ParentModel
{
    /**
     * A resource key to be used in the serialized responses.
     */
    protected $resourceKey = 'Room';

    protected $fillable = [
        'name',
        'comment'
    ];


    public function restaurant()
    {
        return $this->hasOneThrough(Restaurant::class, ModelHasRestaurant::class,  'model_id', 'id','id','restaurant_id')
            ->where('model_type', Room::class);
    }

    public function tables() {
        return $this->hasMany(Table::class)->orderBy('number');
    }

}
