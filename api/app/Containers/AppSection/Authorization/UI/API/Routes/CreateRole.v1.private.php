<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\CreateRoleController;
use Illuminate\Support\Facades\Route;

Route::post('roles', CreateRoleController::class)
    ->middleware(['auth:api']);
