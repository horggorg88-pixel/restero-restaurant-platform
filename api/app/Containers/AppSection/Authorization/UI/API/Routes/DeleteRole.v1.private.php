<?php

use App\Containers\AppSection\Authorization\UI\API\Controllers\DeleteRoleController;
use Illuminate\Support\Facades\Route;

Route::delete('roles/{id}', DeleteRoleController::class)
    ->middleware(['auth:api']);
