<?php

/**
 * @apiGroup           3 Бронирование
 * @apiName            Смена статуса брони
 *
 * @api                {PUT} bookings/status/:id Смена статуса брони
 * @apiDescription     Смена статуса брони
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID брони
 *
 * @apiBody            {Integer} status Статус брони
 *
 * @apiUse            BookingSuccessSingleResponse
 */

use App\Containers\AppSection\Booking\UI\API\Controllers\CancelBookingController;
use App\Containers\AppSection\Booking\UI\API\Controllers\ChangeStatusBookingController;
use Illuminate\Support\Facades\Route;

Route::put('bookings/status/{id}', ChangeStatusBookingController::class)
    ->middleware(['auth:api']);

