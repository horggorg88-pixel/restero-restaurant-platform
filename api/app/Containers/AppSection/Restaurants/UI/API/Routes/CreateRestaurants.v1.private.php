<?php

/**
 * @apiGroup           4 Рестораны
 * @apiName            Добавление ресторана
 *
 * @api                {POST} /v1/restaurants Добавление ресторана
 * @apiDescription     Добавление ресторана
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiBody           {String} [name] Название Ресторана
 *
 * @apiSuccessExample  {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "data": {
 * "object": "Restaurant",
 * "id": "jR",
 * "name": "По умолчанию",
 * "start_time": "10:00:00",
 * "end_time": "19:00:00"
 * },
 * "meta": {
 * "include": [],
 * "custom": []
 * }
 * }
 */

use App\Containers\AppSection\Restaurants\UI\API\Controllers\CreateRestaurantsController;
use Illuminate\Support\Facades\Route;

Route::post('restaurants', CreateRestaurantsController::class)
    ->middleware(['auth:api']);

