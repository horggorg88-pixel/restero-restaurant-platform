<?php

namespace App\Containers\AppSection\Table\Models;

use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Room\Models\Room;
use App\Ship\Parents\Models\Model as ParentModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Table extends ParentModel
{
    /**
     * A resource key to be used in the serialized responses.
     */
    protected $resourceKey = 'Table';

    protected $fillable = [
        'number',
        'count_people',
        'room_id',
        'comment'
    ];



    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
