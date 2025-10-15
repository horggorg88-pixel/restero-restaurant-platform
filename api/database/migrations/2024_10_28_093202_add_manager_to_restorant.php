<?php

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\Tasks\AppendRestaurantToModelTask;
use App\Containers\AppSection\User\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $restuarant = Restaurant::query()->first();
        if($restuarant instanceof Restaurant) {

            $user = User::query()->where('email', 'manager@manager.com')->first();

            App::make(AppendRestaurantToModelTask::class)->run($restuarant->id, $user->id, User::class);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

    }
};
