<?php

/**
 * @apiGroup           1 Помещения
 * @apiName            Удаление
 *
 * @api                {DELETE} /v1/rooms/:id Удаление
 * @apiDescription     Удаление
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id room id
 *
 */

use App\Containers\AppSection\Room\UI\API\Controllers\DeleteRoomController;
use Illuminate\Support\Facades\Route;

Route::delete('rooms/{id}', DeleteRoomController::class)
    ->middleware(['auth:api']);

