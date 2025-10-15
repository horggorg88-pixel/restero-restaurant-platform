<?php


use App\Containers\AppSection\Authentication\UI\API\Controllers\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::post('email/verify/{id}/{hash}', VerifyEmailController::class)
    ->name('verification.verify')
    ->middleware('signed');
