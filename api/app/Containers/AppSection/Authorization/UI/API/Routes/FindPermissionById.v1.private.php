<?php

use App\Containers\AppSection\Authorization\UI\API\Controllers\FindPermissionByIdController;
use Illuminate\Support\Facades\Route;

Route::get('permissions/{id}', FindPermissionByIdController::class)
    ->middleware(['auth:api']);
