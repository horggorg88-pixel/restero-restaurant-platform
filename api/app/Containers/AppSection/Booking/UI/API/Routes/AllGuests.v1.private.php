<?php

/**
 * @apiGroup           3 Бронирование
 * @apiName            База данных
 *
 * @api                {GET} /v1/bookings/guests База данных
 * @apiDescription     База данных
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiBody            {String} booking_date_from Дата бронирования от
 * @apiBody            {String} booking_date_to Дата бронирования до
 * @apiBody            {String} query Поиск по ФИО и телефону
 * @apiBody            {Integer} restaurant_id ID ресторана (если не передан, подставится ресторан авторизованного юзера)
 *
 * @apiSuccessExample  {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "data": [
 * {
 * "object": "Booking",
 * "id": "k5",
 * "booking_date": "2023-03-01",
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "79613984866",
 * "count_booking": 8
 * },
 * {
 * "object": "Booking",
 * "id": "l5",
 * "booking_date": "2023-03-01",
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "79613984866",
 * "count_booking": 8
 * },
 * {
 * "object": "Booking",
 * "id": "mO",
 * "booking_date": "2023-03-01",
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "79613984866",
 * "count_booking": 8
 * },
 * {
 * "object": "Booking",
 * "id": "nR",
 * "booking_date": "2023-03-01",
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "79613984866",
 * "count_booking": 8
 * },
 * {
 * "object": "Booking",
 * "id": "oj",
 * "booking_date": "2023-03-01",
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "79613984866",
 * "count_booking": 8
 * },
 * {
 * "object": "Booking",
 * "id": "p2",
 * "booking_date": "2023-03-01",
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "79613984866",
 * "count_booking": 8
 * },
 * {
 * "object": "Booking",
 * "id": "q2",
 * "booking_date": "2023-01-03",
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "79613984866",
 * "count_booking": 8
 * },
 * {
 * "object": "Booking",
 * "id": "jR",
 * "booking_date": "2023-03-01",
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "79613984866",
 * "count_booking": 8
 * }
 * ],
 * "meta": {
 * "include": [],
 * "custom": [],
 * "pagination": {
 * "total": 8,
 * "count": 8,
 * "per_page": 15,
 * "current_page": 1,
 * "total_pages": 1,
 * "links": {}
 * }
 * }
 * }
 * /
 */

use App\Containers\AppSection\Booking\UI\API\Controllers\AllBookingsController;
use App\Containers\AppSection\Booking\UI\API\Controllers\GuestsController;
use Illuminate\Support\Facades\Route;

Route::get('bookings/guests', GuestsController::class)
    ->middleware(['auth:api']);

