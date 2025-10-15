<?php

/**
 * @apiGroup           3 Бронирование
 * @apiName            Восстановление брони
 *
 * @api                {PUT} bookings/restore/:id Восстановление брони
 * @apiDescription     Восстановление брони
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
use App\Containers\AppSection\Booking\UI\API\Controllers\RestoreBookingController;
use Illuminate\Support\Facades\Route;

Route::put('bookings/restore/{id}', RestoreBookingController::class)
    ->middleware(['auth:api']);

