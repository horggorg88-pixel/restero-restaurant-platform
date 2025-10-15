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
        Schema::table('bookings', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('status');
        });
        //$user = \App\Containers\AppSection\User\Models\User::query()->first();
        //\Illuminate\Support\Facades\DB::table('bookings')->where('id', '>', 0)->update(['user_id' => $user->id]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });
    }
};
