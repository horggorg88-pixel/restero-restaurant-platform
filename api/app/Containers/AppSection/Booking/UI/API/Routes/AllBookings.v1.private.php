<?php

/**
 * @apiGroup           3 Бронирование
 * @apiName            Список всех бронирований
 *
 * @api                {GET} /v1/bookings/all Список всех броней
 * @apiDescription     Список всех бронирований
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiBody            {String} booking_date_from Дата бронирования от
 * @apiBody            {String} booking_date_to Дата бронирования до
 * @apiBody            {String} query Строка поиска
 * @apiBody            {Integer} restaurant_id ID ресторана (если не передан, подставится ресторан авторизованного юзера)
 * @apiBody            {Integer} status Статус брони (0 - актуальный, 1 - отмененная, 2 - исполненная, 3 - Исполняются сейчас)
 *
 * @apiUse            BookingSuccessMultipleResponse
 */

use App\Containers\AppSection\Booking\UI\API\Controllers\AllBookingsController;
use Illuminate\Support\Facades\Route;

Route::get('bookings/all', AllBookingsController::class)
    ->middleware(['auth:api']);

