<?php

/**
 * @apiDefine RoomSuccessSingleResponse
 *
 * @apiSuccess {Object[]}   data
 * @apiSuccess {String}     data.object
 * @apiSuccess {String}     data.id ID комнаты
 * @apiSuccess {String}     data.name Название комнаты
 * @apiSuccess {String}     data.comment Комментарий к комнате
 * @apiSuccess {Object[]}     data.restaurants.data Информация о ресторане
 * @apiSuccess {String}     data.restaurants.data.object
 * @apiSuccess {String}     data.restaurants.data.id ID ресторана
 * @apiSuccess {String}     data.restaurants.data.name Название ресторана
 * @apiSuccess {String}     data.restaurants.data.start_time Открытие ресторана
 * @apiSuccess {String}     data.restaurants.data.end_time Закрытие ресторана
 * @apiSuccess {Object[]}     data.tables.data Список столиков в комнате
 * @apiSuccess {String}     data.tables.data.id ID столика
 * @apiSuccess {String}     data.tables.data.number Номер столика
 * @apiSuccess {String}     data.tables.data.count_people Количество человек
 * @apiSuccess {String}     data.tables.data.room_id ID комнаты
 * @apiSuccess {String}     data.tables.data.comment Комментарий к столику
 *
 * @apiQuery {String}  [include]
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/h2 200 OK
 * {
 * "data": {
 * "object": "Room",
 * "id": "k5",
 * "name": "Тестовая комната",
 * "comment": "2023-04-07T11:51:26.000000Z",
 * "restaurants": {
 *   "data":
 *      {
 *          "object": "Restaurant",
 *          "id": "k5",
 *          "name": "Тестовый ресторант24",
 *          "start_time": "10:00:00",
 *          "end_time": "19:00:00"
 *      },
 *
 * },
* "tables": {
 * "data": [
 *      {
 *          "object": "Table",
 *          "id": "k5",
 *          "number": 1,
 *          "count_people": 12,
 *          "room_id": 1,
 *          "comment": "31231234"
 * },
 * ]
 * },
 * },
 * "meta": {
 * "include": [
 * "roles",
 * "permissions",
 * ],
 * "custom": []
 * }
 * }
 */

/**
 * @apiDefine RoomSuccessMultipleResponse
 *
 * @apiSuccess {Object[]}   data
 * @apiSuccess {String}     data.object
 * @apiSuccess {String}     data.id ID комнаты
 * @apiSuccess {String}     data.name Название комнаты
 * @apiSuccess {String}     data.comment Комментарий к комнате
 * @apiSuccess {Object[]}     data.restaurants.data Информация о ресторане
 * @apiSuccess {String}     data.restaurants.data.object
 * @apiSuccess {String}     data.restaurants.data.id ID ресторана
 * @apiSuccess {String}     data.restaurants.data.name Название ресторана
 * @apiSuccess {String}     data.restaurants.data.start_time Открытие ресторана
 * @apiSuccess {String}     data.restaurants.data.end_time Закрытие ресторана
 * @apiSuccess {Object[]}     data.tables.data Список столиков в комнате
 * @apiSuccess {String}     data.tables.data.id ID столика
 * @apiSuccess {String}     data.tables.data.number Номер столика
 * @apiSuccess {String}     data.tables.data.count_people Количество человек
 * @apiSuccess {String}     data.tables.data.room_id ID комнаты
 * @apiSuccess {String}     data.tables.data.comment Комментарий к столику
 *
 * @apiQuery {String} [include]
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/h2 200 OK
 * {
 * "data": [
 * {
 * "object": "Room",
 * "id": "jR",
 * "name": "Зал",
 * "comment": null,
 * "restaurant": {
 * "data": {
 * "object": "Restaurant",
 * "id": "jR",
 * "name": "По умолчанию",
 * "start_time": "10:00:00",
 * "end_time": "19:00:00"
 * }
 * },
 * "tables": {
 * "data": [
 * {
 * "object": "Table",
 * "id": "jR",
 * "number": 1,
 * "count_people": 12,
 * "room_id": 1,
 * "comment": null
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
