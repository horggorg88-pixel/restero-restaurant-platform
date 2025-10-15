<?php

/**
 * @apiGroup           2 Столики
 * @apiName            Добавление столика
 *
 * @api                {POST} /v1/tables Добавление столика
 * @apiDescription     Добавление столика в БД
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiBody           {Integer} number Номер столика
 * @apiBody           {Integer} count_people Количество человек
 * @apiBody           {Integer} room_id ID комнаты (помещения)
 * @apiBody           {String} comment Комментарий
 *
 * @apiUse             TableSuccessSingleResponse
 */

use App\Containers\AppSection\Table\UI\API\Controllers\CreateTableController;
use Illuminate\Support\Facades\Route;

Route::post('tables', CreateTableController::class)
    ->middleware(['auth:api']);

