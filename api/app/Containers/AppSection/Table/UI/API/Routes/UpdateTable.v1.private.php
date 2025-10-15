<?php

/**
 * @apiGroup           2 Столики
 * @apiName            Обновление столика
 *
 * @api                {PATCH} /v1/tables/:id Обновление столика
 * @apiDescription     Обновление столика
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID столика
 *
 * @apiBody           {Integer} number Номер столика
 * @apiBody           {Integer} count_people Количество человек
 * @apiBody           {Integer} room_id ID комнаты (помещения)
 * @apiBody           {String} comment Комментарий
 *
 * @apiUse             TableSuccessSingleResponse
 */

use App\Containers\AppSection\Table\UI\API\Controllers\UpdateTableController;
use Illuminate\Support\Facades\Route;

Route::patch('tables/{id}', UpdateTableController::class)
    ->middleware(['auth:api']);

