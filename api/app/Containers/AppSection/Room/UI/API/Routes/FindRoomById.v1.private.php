<?php

/**
 * @apiGroup           1 Помещения
 * @apiName            Информация по ID
 *
 * @api                {GET} /v1/rooms/:id Информация по ID
 * @apiDescription     Информация по ID
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id room id
 *
 * @apiUse            RoomSuccessSingleResponse
 */

use App\Containers\AppSection\Room\UI\API\Controllers\FindRoomByIdController;
use Illuminate\Support\Facades\Route;

Route::get('rooms/{id}', FindRoomByIdController::class)
    ->middleware(['auth:api']);

