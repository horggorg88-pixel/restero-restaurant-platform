<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\FindRoleByIdController;
use Illuminate\Support\Facades\Route;

Route::get('roles/{id}', FindRoleByIdController::class)
    ->middleware(['auth:api']);
