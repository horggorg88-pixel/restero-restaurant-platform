<?php

/**
 * @apiGroup           4 Рестораны
 * @apiName            Список ресторанов
 *
 * @api                {GET} /v1/restaurants Список ресторанов
 * @apiDescription     Список ресторанов
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiSuccessExample  {json} Success-Response:
 * HTTP/1.1 200 OK
* {
 * "data": [
 * {
 * "object": "Restaurant",
 * "id": "jR",
 * "name": "По умолчанию",
 * "start_time": "10:00:00",
 * "end_time": "19:00:00"
 * }
 * ],
 * "meta": {
 * "include": [],
 * "custom": []
 * }
 * }
 */
use App\Containers\AppSection\Restaurants\UI\API\Controllers\ListRestaurantsController;
use Illuminate\Support\Facades\Route;

Route::get('restaurants', ListRestaurantsController::class)
    ->middleware(['auth:api']);

