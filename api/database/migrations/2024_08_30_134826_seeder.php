<?php

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Room\Models\Room;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $taskRooms = \Illuminate\Support\Facades\App::make(\App\Containers\AppSection\Restaurants\Tasks\AppendRestaurantToModelTask::class);
        $restaurant = Restaurant::query()->first();
        if($restaurant instanceof Restaurant) {
            for ($i = 0; $i < 10; $i++ ) {
                $room = Room::query()->create([
                    'name' => 'Зал '.$i
                ]);
                if($room instanceof Room) {
                    $taskRooms->run($restaurant->id, $room->id, Room::class);
                    for($j = 0; $j < 10; $j ++) {
                        \App\Containers\AppSection\Table\Models\Table::query()->create([
                            'number' => rand(1, 10),
                            'count_people' => rand(1, 10),
                            'room_id' => $room->id,
                            'comment' => ''
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
