<?php

use App\Containers\AppSection\Authorization\UI\API\Controllers\RevokeRolePermissionsController;
use Illuminate\Support\Facades\Route;

Route::post('permissions/detach', RevokeRolePermissionsController::class)
    ->middleware(['auth:api']);
