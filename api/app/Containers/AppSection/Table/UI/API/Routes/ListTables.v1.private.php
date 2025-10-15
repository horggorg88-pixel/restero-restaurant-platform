<?php

/**
 * @apiGroup           2 Столики
 * @apiName            Список столиков
 *
 * @api                {GET} /v1/tables Список доступных столиков
 * @apiDescription     Возвращает список всех столиков ресторана
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiBody           {String} room_id ID помещения (если не указан, прилетят столы по всем помещениям ресторана))
 *
 *
 * @apiUse             TableSuccessSingleResponse
 */

use App\Containers\AppSection\Table\UI\API\Controllers\ListTablesController;
use Illuminate\Support\Facades\Route;

Route::get('tables', ListTablesController::class)
    ->middleware(['auth:api']);

