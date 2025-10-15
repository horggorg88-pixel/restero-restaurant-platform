<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration {
    public function up(): void
    {
        Schema::create('model_has_restaurants', function (Blueprint $table) {
            $table->id();
            $table->integer('restaurant_id');
            $table->string('model_type');
            $table->integer('model_id');
            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('model_has_restaurants');
    }
};
