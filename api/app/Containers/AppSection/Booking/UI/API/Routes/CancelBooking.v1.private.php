<?php

/**
 * @apiGroup           3 Бронирование
 * @apiName            Отмена брони
 *
 * @api                {PUT} bookings/cancel/:id Отмена брони
 * @apiDescription     Отмена брони
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID брони
 *
 * @apiUse            BookingSuccessSingleResponse
 */

use App\Containers\AppSection\Booking\UI\API\Controllers\CancelBookingController;
use Illuminate\Support\Facades\Route;

Route::put('bookings/cancel/{id}', CancelBookingController::class)
    ->middleware(['auth:api']);

