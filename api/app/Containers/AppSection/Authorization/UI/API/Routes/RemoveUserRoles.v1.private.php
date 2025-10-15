<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\RemoveUserRolesController;
use Illuminate\Support\Facades\Route;

Route::post('roles/revoke', RemoveUserRolesController::class)
    ->middleware(['auth:api']);
