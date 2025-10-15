<?php

/**
 * @apiGroup           1 Помещения
 * @apiName            Обновление
 *
 * @api                {PATCH} /v1/rooms/:id Обновление
 * @apiDescription     Обновление
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => '']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID комнаты
 *
 * @apiBody           {String} [name] Название комнаты
 * @apiBody           {String} [comment] Комментарий к комнате
 *
 * @apiUse            RoomSuccessSingleResponse
 */

use App\Containers\AppSection\Room\UI\API\Controllers\UpdateRoomController;
use Illuminate\Support\Facades\Route;

Route::patch('rooms/{id}', UpdateRoomController::class)
    ->middleware(['auth:api']);

