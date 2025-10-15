<?php


use App\Containers\AppSection\Authentication\UI\API\Controllers\ResetPasswordController;
use Illuminate\Support\Facades\Route;

Route::post('password/reset', ResetPasswordController::class);
