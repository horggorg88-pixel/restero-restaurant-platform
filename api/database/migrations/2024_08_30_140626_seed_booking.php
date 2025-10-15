<?php

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
        $tables = \App\Containers\AppSection\Table\Models\Table::query()->get();
        $rooms = \App\Containers\AppSection\Room\Models\Room::query()->where('id', '>', 30)->delete();

        $faker = \Illuminate\Support\Facades\App::make(Faker\Generator::class);
        $date = $faker->date();
        $dates = [
            '2024-08-30',
            '2024-08-31',
            '2024-09-01',
            '2024-09-02',
        ];
        foreach($dates as $date) {
            foreach($tables as $table) {
                \App\Containers\AppSection\Booking\Models\Booking::query()->create([
                    'booking_date' => $date,
                    'room_id' => $table->room_id,
                    'table_id' => $table->id,
                    'booking_time' => '10:00',
                    'count_people' => rand(1, $table->count_people),
                    'client_name' => $faker->name,
                    'client_phone' => $faker->phoneNumber,
                    'comment' => '',
                    'booking_time_to' => '17:00'
                ]);
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
