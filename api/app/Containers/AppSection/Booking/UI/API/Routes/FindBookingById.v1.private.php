<?php

/**
 * @apiGroup           3 Бронирование
 * @apiName            Информация о брони по ID
 *
 * @api                {GET} /v1/bookings/:id Информация о брони по ID
 * @apiDescription     Endpoint description here...
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => '']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID брони
 *
 *
 * @apiUse            BookingSuccessSingleResponse
 */

use App\Containers\AppSection\Booking\UI\API\Controllers\FindBookingByIdController;
use Illuminate\Support\Facades\Route;

Route::get('bookings/{id}', FindBookingByIdController::class)
    ->middleware(['auth:api']);

