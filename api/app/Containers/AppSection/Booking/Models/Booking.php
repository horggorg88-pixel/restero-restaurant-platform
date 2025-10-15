<?php

namespace App\Containers\AppSection\Booking\Models;


use App\Containers\AppSection\Booking\Casts\UserPhone;
use App\Containers\AppSection\History\Models\History;
use App\Containers\AppSection\Room\Models\Room;
use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\User\Models\User;
use App\Ship\Parents\Models\Model as ParentModel;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Booking extends ParentModel
{
    /**
     * A resource key to be used in the serialized responses.
     */
    protected $resourceKey = 'Booking';

    protected $fillable = [
        'booking_date',
        'room_id',
        'table_id',
        'booking_time',
        'count_people',
        'client_name',
        'client_phone',
        'comment',
        'status',
        'booking_time_to',
        'user_id',
        'composite_tables'
    ];

    protected $casts = [
        'client_phone' => UserPhone::class,
        'composite_tables' => 'array'
    ];

    public function historyChanges(): MorphMany
    {
        return $this->morphMany(History::class, 'model');
    }

    public function room() {
        return $this->belongsTo(Room::class);
    }

    public function table() {
        return $this->belongsTo(Table::class);
    }
    public function user() {
        return $this->belongsTo(User::class);
    }

}
