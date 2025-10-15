<?php

use App\Containers\AppSection\Authorization\UI\API\Controllers\RevokeUserPermissionsController;
use Illuminate\Support\Facades\Route;

Route::delete('users/{id}/permissions', RevokeUserPermissionsController::class)
    ->middleware(['auth:api']);
