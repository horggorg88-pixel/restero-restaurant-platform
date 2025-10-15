<?php

/**
 * @apiGroup           3 Бронирование
 * @apiName            Изменение брони
 *
 * @api                {PATCH} /v1/bookings/:id Изменение брони
 * @apiDescription     Изменение брони
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiParam           {String} id ID брони
 *
 * @apiBody            {String} booking_date Дата бронирования
 * @apiBody            {String} room_id ID комнаты
 * @apiBody            {Array} table_ids Массив ID столов
 * @apiBody            {String} count_people количество человек
 * @apiBody            {String} client_phone Телефон клиента
 * @apiBody            {String} client_name ФИО клиента
 * @apiBody            {String} comment Комментарий
 * @apiBody            {String} count_booking_time Время, на которое бронируют (чч:мм))
 * @apiBody            {String} booking_time Время начала бронирования
 *
 * @apiUse            BookingSuccessSingleResponse
 */

use App\Containers\AppSection\Booking\UI\API\Controllers\UpdateBookingController;
use Illuminate\Support\Facades\Route;

Route::patch('bookings/{id}', UpdateBookingController::class)
    ->middleware(['auth:api']);

