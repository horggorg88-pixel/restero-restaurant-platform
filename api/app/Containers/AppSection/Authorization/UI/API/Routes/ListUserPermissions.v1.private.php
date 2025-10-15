<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\ListUserPermissionsController;
use Illuminate\Support\Facades\Route;

Route::get('users/{id}/permissions', ListUserPermissionsController::class)
    ->middleware(['auth:api']);
