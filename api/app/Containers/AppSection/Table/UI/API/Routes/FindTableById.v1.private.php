<?php

/**
 * @apiGroup           2 Столики
 * @apiName            Столик по ID
 *
 * @api                {GET} /v1/tables/:id Столик по ID
 * @apiDescription     Возвращает столик по ID
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => '']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID столика
 *
 * @apiUse             TableSuccessSingleResponse
 */

use App\Containers\AppSection\Table\UI\API\Controllers\FindTableByIdController;
use Illuminate\Support\Facades\Route;

Route::get('tables/{id}', FindTableByIdController::class)
    ->middleware(['auth:api']);

