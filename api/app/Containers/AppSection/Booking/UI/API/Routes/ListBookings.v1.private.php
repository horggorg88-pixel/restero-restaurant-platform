<?php

/**
 * @apiGroup           3 Бронирование
 * @apiName            Список бронирований
 *
 * @api                {GET} /v1/bookings Список бронирований
 * @apiDescription     Список бронирований
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiBody            {String} booking_date Дата бронирования
 * @apiBody            {String} client_phone Номер телефона клиента
 * @apiBody            {String} room_id ID комнаты (если не передан - отдаст брони по всем комнатам ресторана)
 * @apiBody            {String} table_id ID стола (если не передан - отдаст брони по всем столам ресторана)
 *
 * @apiUse            BookingSuccessMultipleResponse
 */

use App\Containers\AppSection\Booking\UI\API\Controllers\ListBookingsController;
use Illuminate\Support\Facades\Route;

Route::get('bookings', ListBookingsController::class)
    ->middleware(['auth:api']);

