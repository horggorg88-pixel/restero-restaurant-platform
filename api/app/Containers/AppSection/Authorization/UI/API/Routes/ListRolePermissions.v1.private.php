<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\ListRolePermissionsController;
use Illuminate\Support\Facades\Route;

Route::get('roles/{id}/permissions', ListRolePermissionsController::class)
    ->middleware(['auth:api']);
