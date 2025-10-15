<?php

namespace App\Containers\AppSection\History\UI\API\Transfromers;

use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\History\Models\History;
use App\Containers\AppSection\User\UI\API\Transformers\UserTransformer;
use App\Ship\Parents\Transformers\Transformer as ParentTransformer;

class HistoryTransformer extends ParentTransformer
{
    protected array $defaultIncludes = [
        'user'
    ];

    protected array $availableIncludes = [

    ];

    public function transform(History $history): array
    {

        return [
            'created_at' => $history->created_at->format('Y-m-d H:i:s'),
            'change_type' => $history->change_type
        ];

    }

    public function includeUser(History $history)
    {
        return $this->item($history->user, new UserTransformer());
    }
}
