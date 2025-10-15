<?php
/**
 * @apiGroup           4 Рестораны
 * @apiName            Обновление ресторана
 *
 * @api                {PATCH} /v1/restaurants/:id Обновление ресторана
 * @apiDescription     Endpoint description here...
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID ресторана
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

use App\Containers\AppSection\Restaurants\UI\API\Controllers\UpdateRestaurantsController;
use Illuminate\Support\Facades\Route;

Route::patch('restaurants/{id}', UpdateRestaurantsController::class)
    ->middleware(['auth:api']);

