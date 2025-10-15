<?php

/**
 * @apiGroup           2 Столики
 * @apiName            Удаление столика
 *
 * @api                {DELETE} /v1/tables/:id Удаление столика
 * @apiDescription     Удаление столика
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID столика

 */

use App\Containers\AppSection\Table\UI\API\Controllers\DeleteTableController;
use Illuminate\Support\Facades\Route;

Route::delete('tables/{id}', DeleteTableController::class)
    ->middleware(['auth:api']);

