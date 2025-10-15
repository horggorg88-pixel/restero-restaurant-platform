<?php

/**
 * @apiGroup           3 Бронирование
 * @apiName            Удаление брони
 *
 * @api                {DELETE} /v1/bookings/:id Удаление брони
 * @apiDescription     Endpoint description here...
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID брони
 *

 */

use App\Containers\AppSection\Booking\UI\API\Controllers\DeleteBookingController;
use Illuminate\Support\Facades\Route;

Route::delete('bookings/{id}', DeleteBookingController::class)
    ->middleware(['auth:api']);

