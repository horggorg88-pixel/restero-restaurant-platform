<?php

/**
 * @apiGroup           1 Помещения
 * @apiName            Добавление помещения
 *
 * @api                {POST} /v1/rooms Добавление помещения
 * @apiDescription     Добавление помещения. Помещение автоматически привяжется к ресторану авторизованного пользователя
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiBody           {String} [name] Название комнаты
 * @apiBody           {String} [comment] Комментарий к комнате
 * @apiBody           {String} [restaurant_id] ID ресторана (Если не передан, подставится ID ресторана авторизованного пользователя)
 *
 * @apiUse            RoomSuccessSingleResponse
 */

use App\Containers\AppSection\Room\UI\API\Controllers\CreateRoomController;
use Illuminate\Support\Facades\Route;

Route::post('rooms', CreateRoomController::class)
    ->middleware(['auth:api']);

