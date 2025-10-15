<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\SyncUserRolesController;
use Illuminate\Support\Facades\Route;

Route::post('roles/sync', SyncUserRolesController::class)
    ->middleware(['auth:api']);
