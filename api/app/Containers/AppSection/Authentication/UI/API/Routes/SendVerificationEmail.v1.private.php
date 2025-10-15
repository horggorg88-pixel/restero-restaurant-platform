<?php


use App\Containers\AppSection\Authentication\UI\API\Controllers\SendVerificationEmailController;
use Illuminate\Support\Facades\Route;

Route::post('/email/verification-notification', SendVerificationEmailController::class)
    ->middleware(['auth:api']);
