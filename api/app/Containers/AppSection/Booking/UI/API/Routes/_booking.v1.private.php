<?php

/**
 * @apiDefine BookingSuccessSingleResponse
 *
 * @apiSuccess {Object[]}   data
 * @apiSuccess {String}     data.object
 * @apiSuccess {String}     data.id ID бронирования
 * @apiSuccess {String}     data.booking_date Дата бронирования
 * @apiSuccess {String}     data.room_id ID комнаты
 * @apiSuccess {String}     data.table_id ID стола
 * @apiSuccess {String}     data.booking_time_from Время начала бронирования
 * @apiSuccess {String}     data.booking_time_to Время окончания бронирования
 * @apiSuccess {String}     data.count_people Количество человек
 * @apiSuccess {String}     data.client_name ФИО клиента
 * @apiSuccess {String}     data.client_phone Телефон клиента
 * @apiSuccess {String}     data.comment Комментарий
 * @apiSuccess {String}     data.created_at Дата бронирования
 * @apiSuccess {String}     data.status Статус: 0 - актуальное, 1 - отменено
 * @apiSuccess {Object[]}   data.histories История изменения брони
 *
 * @apiQuery {String}  [include]
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/h2 200 OK
 * {
 * "data": {
 * {
 * "object": "Booking",
 * "id": "vm",
 * "booking_date": "2023-02-01",
 * "room_id": "jR",
 * "table_id": "jR",
 * "booking_time_from": "10:00:00",
 * "booking_time_to": "19:00:00",
 * "count_people": 10,
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "9613984866",
 * "comment": null,
 * "created_at": "2024-08-16 13:07:37",
 * "status": 0,
 * "histories": {
 * "data": [
 * {
 * "created_at": "2024-08-16 13:07:37",
 * "change_type": "created",
 * "user": {
 * "data": {
 * "object": "User",
 * "id": "jR",
 * "name": "Super Admin",
 * "email": "admin@admin.com",
 * "email_verified_at": "2024-08-15T09:22:41.000000Z",
 * "restaurant": {
 * "data": {
 * "object": "Restaurant",
 * "id": "jR",
 * "name": "По умолчанию",
 * "start_time": "10:00:00",
 * "end_time": "19:00:00"
 * }
 * }
 * }
 * }
 * },
 * {
 * "created_at": "2024-08-16 13:08:34",
 * "change_type": "updated",
 * "user": {
 * "data": {
 * "object": "User",
 * "id": "jR",
 * "name": "Super Admin",
 * "email": "admin@admin.com",
 * "email_verified_at": "2024-08-15T09:22:41.000000Z",
 * "restaurant": {
 * "data": {
 * "object": "Restaurant",
 * "id": "jR",
 * "name": "По умолчанию",
 * "start_time": "10:00:00",
 * "end_time": "19:00:00"
 * }
 * }
 * }
 * }
 * }
 * ]
 * }
 * }
 * }
 */

/**
 * @apiDefine BookingSuccessMultipleResponse
 *
 * @apiSuccess {Object[]}   data
 * @apiSuccess {String}     data.object
 * @apiSuccess {String}     data.id ID бронирования
 * @apiSuccess {String}     data.booking_date Дата бронирования
 * @apiSuccess {String}     data.room_id ID комнаты
 * @apiSuccess {String}     data.table_id ID стола
 * @apiSuccess {String}     data.booking_time_from Время начала бронирования
 * @apiSuccess {String}     data.booking_time_to Время окончания бронирования
 * @apiSuccess {String}     data.count_people Количество человек
 * @apiSuccess {String}     data.client_name ФИО клиента
 * @apiSuccess {String}     data.client_phone Телефон клиента
 * @apiSuccess {String}     data.comment Комментарий
 * @apiSuccess {String}     data.created_at Дата бронирования
 * @apiSuccess {String}     data.status Статус: 0 - актуальное, 1 - отменено
 * @apiSuccess {Object[]}     data.histories История изменения брони
 *
 * @apiQuery {String} [include]
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/h2 200 OK
 * {
 * "data": [
 * {
 * "object": "Booking",
 * "id": "vm",
 * "booking_date": "2023-02-01",
 * "room_id": "jR",
 * "table_id": "jR",
 * "booking_time_from": "10:00:00",
 * "booking_time_to": "19:00:00",
 * "count_people": 10,
 * "client_name": "Тестов Тест тестович",
 * "client_phone": "9613984866",
 * "comment": null,
 * "created_at": "2024-08-16 13:07:37",
 * "status": 0,
 * "histories": {
 * "data": [
 * {
 * "created_at": "2024-08-16 13:07:37",
 * "change_type": "created",
 * "user": {
 * "data": {
 * "object": "User",
 * "id": "jR",
 * "name": "Super Admin",
 * "email": "admin@admin.com",
 * "email_verified_at": "2024-08-15T09:22:41.000000Z",
 * "restaurant": {
 * "data": {
 * "object": "Restaurant",
 * "id": "jR",
 * "name": "По умолчанию",
 * "start_time": "10:00:00",
 * "end_time": "19:00:00"
 * }
 * }
 * }
 * }
 * },
 * {
 * "created_at": "2024-08-16 13:08:34",
 * "change_type": "updated",
 * "user": {
 * "data": {
 * "object": "User",
 * "id": "jR",
 * "name": "Super Admin",
 * "email": "admin@admin.com",
 * "email_verified_at": "2024-08-15T09:22:41.000000Z",
 * "restaurant": {
 * "data": {
 * "object": "Restaurant",
 * "id": "jR",
 * "name": "По умолчанию",
 * "start_time": "10:00:00",
 * "end_time": "19:00:00"
 * }
 * }
 * }
 * }
 * }
 * ]
 * }
 * }
 * ],
 * "meta": {
 * "include": [],
 * "custom": []
 * }
 * }
 */
