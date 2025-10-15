<?php

namespace App\Containers\AppSection\Booking\UI\API\Transformers;

use App\Containers\AppSection\Booking\Data\Enums\BookingStatuses;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\History\UI\API\Transfromers\HistoryTransformer;
use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\Table\UI\API\Transformers\TableTransformer;
use App\Ship\Parents\Transformers\Transformer as ParentTransformer;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;

class BookingTransformer extends ParentTransformer
{
    protected array $defaultIncludes = [
        'histories'
    ];

    protected array $availableIncludes = [

    ];

    public function transform(Booking $booking): array
    {

        $tables = [];

        if(is_array($booking->composite_tables)) {
            foreach($booking->composite_tables as $table) {
                $tableInfo = Table::find($table);
                if($tableInfo instanceof Table) {
                    $tables[] = App::make(TableTransformer::class)->transform($tableInfo);
                }

            }
        }


        $response = [
            'object' => $booking->getResourceKey(),
            'id' => $booking->getHashedKey(),
            'id_original' => $booking->id,
            'booking_date' => $booking->booking_date,
            'room_id' => !is_null($booking->room) ? $booking->room->getHashedKey() : null,
            'table_id' => !is_null($booking->table) ? $booking->table->getHashedKey() : null,
            'table_number' => !is_null($booking->table) ? $booking->table->number : null,
            'room_name' => !is_null($booking->room) ? $booking->room->name : null,
            'booking_time_from' => $booking->booking_time,
            'booking_time_to' => $booking->booking_time_to,
            'count_people' => $booking->count_people,
            'client_name' => $booking->client_name,
            'client_phone' => $booking->client_phone,
            'comment' => $booking->comment,
            'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
            'status' => $booking->status,
            'administrator' => [
                'id' => !is_null($booking->user) ? $booking->user->getHashedKey() : null,
                'name' => !is_null($booking->user) ? $booking->user->name : $this->null()
            ],
            'composite_tables' =>  $tables
        ];

        return $response;
    }

    public function includeHistories(Booking $booking)
    {
        return $this->collection($booking->historyChanges, new HistoryTransformer());
    }
}
