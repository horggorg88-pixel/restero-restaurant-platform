<?php

namespace App\Containers\AppSection\Restaurants\Models;

use App\Ship\Parents\Models\Model as ParentModel;

/**
 * @property mixed $name Название ресторана
 */
class Restaurant extends ParentModel
{
    /**
     * A resource key to be used in the serialized responses.
     */
    protected $resourceKey = 'Restaurant';

    protected $fillable = [
        'name',
        'address',
        'description',
        'phone',
        'email',
        'website',
        'photo',
        'restro_id',
        'owner_id',
        'is_active',
        'api_key',
        'start_time',
        'end_time'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];
}
