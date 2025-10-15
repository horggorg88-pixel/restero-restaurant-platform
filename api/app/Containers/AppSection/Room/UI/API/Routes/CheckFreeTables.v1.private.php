<?php
/**
 * @apiGroup           1 Помещения
 * @apiName            Проверка возможности забронировать на несколько столов
 *
 * @api                {POST} v1/check-tables Проверка возможности забронировать на несколько столов
 * @apiDescription     Проверка возможности забронировать на несколько столов
 *
 * @apiVersion         1.0.0
 * @apiPermission      Authenticated ['permissions' => '', 'roles' => 'admin']
 *
 * @apiHeader          {String} accept=application/json
 * @apiHeader          {String} authorization=Bearer
 *
 * @apiBody           {String} [room_id] ID комнаты
 * @apiBody           {String} [booking_date] Дата бронирования
 * @apiBody           {Integer} [count_people] Количество пользователей
 * @apiBody           {String} [count_booking_time] Количество времени
 * @apiBody           {String} [booking_time] Время начала брони
 * @apiBody           {Array} [table_ids] Массив ИД столов
 *
 */
use App\Containers\AppSection\Room\UI\API\Controllers\CheckFreeTablesController;
use Illuminate\Support\Facades\Route;

Route::post('check-tables', CheckFreeTablesController::class)
    ->middleware(['auth:api']);

