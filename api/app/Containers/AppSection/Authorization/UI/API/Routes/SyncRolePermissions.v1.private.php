<?php

use App\Containers\AppSection\Authorization\UI\API\Controllers\SyncRolePermissionsController;
use Illuminate\Support\Facades\Route;

Route::post('permissions/sync', SyncRolePermissionsController::class)
    ->middleware(['auth:api']);
