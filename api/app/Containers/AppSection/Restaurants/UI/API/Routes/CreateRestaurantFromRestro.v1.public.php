<?php

use App\Containers\AppSection\Restaurants\UI\API\Controllers\RestaurantFromRestroController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'restaurants', 'as' => 'api_restaurants_'], function () {
    // Создание ресторана из Restro (публичный endpoint для интеграции)
    Route::post('/', [RestaurantFromRestroController::class, 'createRestaurant'])
        ->name('create_from_restro');

    // Получение статистики ресторана
    Route::get('{id}/stats', [RestaurantFromRestroController::class, 'getStats'])
        ->name('get_stats');

    // Синхронизация доступов сотрудников
    Route::post('{id}/accesses', [RestaurantFromRestroController::class, 'syncAccesses'])
        ->name('sync_accesses');
});

// Health check endpoint
Route::get('health', [RestaurantFromRestroController::class, 'health'])
    ->name('health');
