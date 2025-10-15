<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\ListPermissionsController;
use Illuminate\Support\Facades\Route;

Route::get('permissions', ListPermissionsController::class)
    ->middleware(['auth:api']);
