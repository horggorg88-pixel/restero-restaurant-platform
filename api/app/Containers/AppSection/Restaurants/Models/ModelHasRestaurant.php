<?php

namespace App\Containers\AppSection\Restaurants\Models;

use App\Ship\Parents\Models\Model as ParentModel;

class ModelHasRestaurant extends ParentModel
{
    /**
     * A resource key to be used in the serialized responses.
     */
    protected $resourceKey = 'ModelHasRestaurant';

    protected $fillable = [
        'restaurant_id',
        'model_id',
        'model_type'
    ];

}
