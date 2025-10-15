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
        Schema::table('restaurants', function (Blueprint $table) {
            // Поля для интеграции с Restro
            $table->string('address')->nullable()->after('name');
            $table->text('description')->nullable()->after('address');
            $table->string('phone', 20)->nullable()->after('description');
            $table->string('email')->nullable()->after('phone');
            $table->string('website')->nullable()->after('email');
            $table->string('photo')->nullable()->after('website');
            $table->string('restro_id', 100)->nullable()->after('photo');
            $table->string('owner_id', 100)->nullable()->after('restro_id');
            $table->boolean('is_active')->default(true)->after('owner_id');
            $table->string('api_key')->nullable()->after('is_active');
            
            // Индексы для быстрого поиска
            $table->index('restro_id');
            $table->index('owner_id');
            $table->index('is_active');
            $table->index('api_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropIndex(['restro_id']);
            $table->dropIndex(['owner_id']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['api_key']);
            
            $table->dropColumn([
                'address',
                'description',
                'phone',
                'email',
                'website',
                'photo',
                'restro_id',
                'owner_id',
                'is_active',
                'api_key'
            ]);
        });
    }
};
