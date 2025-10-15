<?php


use App\Containers\AppSection\Authorization\UI\API\Controllers\GivePermissionsToUserController;
use Illuminate\Support\Facades\Route;

Route::patch('users/{id}/permissions', GivePermissionsToUserController::class)
    ->middleware(['auth:api']);
