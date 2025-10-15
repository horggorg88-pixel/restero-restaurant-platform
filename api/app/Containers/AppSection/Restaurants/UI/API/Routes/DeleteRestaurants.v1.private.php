<?php
/**
 * @apiGroup           4 Рестораны
 * @apiName            Удаление ресторана
 *
 * @api                {DELETE} /v1/restaurants/:id Удаление ресторана
 * @apiDescription     Удаление ресторана
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID ресторана
 *
 */


use App\Containers\AppSection\Restaurants\UI\API\Controllers\DeleteRestaurantsController;
use Illuminate\Support\Facades\Route;

Route::delete('restaurants/{id}', DeleteRestaurantsController::class)
    ->middleware(['auth:api']);

