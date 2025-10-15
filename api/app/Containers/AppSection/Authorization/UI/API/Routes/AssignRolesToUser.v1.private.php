<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\AssignRolesToUserController;
use Illuminate\Support\Facades\Route;

Route::post('roles/assign', AssignRolesToUserController::class)
    ->middleware(['auth:api']);
