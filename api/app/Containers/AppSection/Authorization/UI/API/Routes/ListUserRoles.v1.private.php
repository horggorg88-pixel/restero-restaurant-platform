<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\ListUserRolesController;
use Illuminate\Support\Facades\Route;

Route::get('users/{id}/roles', ListUserRolesController::class)
    ->middleware(['auth:api']);
