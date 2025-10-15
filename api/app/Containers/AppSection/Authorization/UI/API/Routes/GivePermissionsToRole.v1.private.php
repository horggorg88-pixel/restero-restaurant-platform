<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\GivePermissionsToRoleController;
use Illuminate\Support\Facades\Route;

Route::post('permissions/attach', GivePermissionsToRoleController::class)
    ->middleware(['auth:api']);
