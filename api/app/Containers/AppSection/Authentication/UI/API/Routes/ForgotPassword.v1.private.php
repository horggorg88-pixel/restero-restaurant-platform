<?php


use App\Containers\AppSection\Authentication\UI\API\Controllers\ForgotPasswordController;
use Illuminate\Support\Facades\Route;

Route::post('password/forgot', ForgotPasswordController::class);
