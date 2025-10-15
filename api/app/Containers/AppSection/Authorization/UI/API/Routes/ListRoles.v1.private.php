<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\ListRolesController;
use Illuminate\Support\Facades\Route;

Route::get('roles', ListRolesController::class)
    ->middleware(['auth:api']);
