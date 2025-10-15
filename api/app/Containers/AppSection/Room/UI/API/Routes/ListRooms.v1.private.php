<?php

/**
 * @apiGroup           1 Помещения
 * @apiName            Список комнат
 *
 * @api                {GET} /v1/rooms Список комнат
 * @apiDescription     Список комнат
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => '']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *

 * @apiUse            RoomSuccessMultipleResponse
 */

use App\Containers\AppSection\Room\UI\API\Controllers\ListRoomsController;
use Illuminate\Support\Facades\Route;

Route::get('rooms', ListRoomsController::class)
    ->middleware(['auth:api']);

