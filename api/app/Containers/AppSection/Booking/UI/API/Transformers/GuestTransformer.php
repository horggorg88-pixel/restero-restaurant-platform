<?php

namespace App\Containers\AppSection\Booking\UI\API\Transformers;

use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\Tasks\CountUserBookingTask;
use App\Containers\AppSection\History\UI\API\Transfromers\HistoryTransformer;
use App\Containers\AppSection\Restaurants\UI\API\Transformers\RestaurantsTransformer;
use App\Containers\AppSection\User\Models\User;
use App\Ship\Parents\Transformers\Transformer as ParentTransformer;
use Illuminate\Support\Facades\App;

class GuestTransformer extends ParentTransformer
{
    protected array $defaultIncludes = [
        'restaurant'
    ];

    protected array $availableIncludes = [

    ];

    public function transform(Booking $booking): array
    {
        return [
            'object' => $booking->getResourceKey(),
            'id' => $booking->getHashedKey(),
            'booking_date' => $booking->booking_date,
            'client_name' => $booking->client_name,
            'client_phone' => $booking->client_phone,
            'count_booking' => $booking->count_booking,
        ];
    }


    public function includeRestaurant(Booking $booking) {
        return $this->item($booking->room->restaurant, new RestaurantsTransformer());
    }

}
