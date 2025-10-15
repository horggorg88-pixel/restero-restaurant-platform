<?php

namespace App\Containers\AppSection\History\Models;

use App\Containers\AppSection\User\Models\User;
use App\Ship\Parents\Models\Model as ParentModel;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class History extends ParentModel
{
    /**
     * A resource key to be used in the serialized responses.
     */
    protected $resourceKey = 'History';

    protected $fillable = [
        'model_type',
        'model_id',
        'before_changes',
        'after_changes',
        'changes',
        'change_type',
        'user_id',
    ];

    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

}
