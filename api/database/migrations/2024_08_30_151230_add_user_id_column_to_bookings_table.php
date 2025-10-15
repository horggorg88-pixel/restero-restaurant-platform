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

        //$user = \App\Containers\AppSection\User\Models\User::query()->first();
        //\Illuminate\Support\Facades\DB::table('bookings')->where('id', '>', 0)->update(['user_id' => $user->id]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

    }
};
