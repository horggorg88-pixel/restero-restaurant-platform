<?php

/**
 * @apiDefine TableSuccessSingleResponse
 *
 * @apiSuccess {Object[]}   data
 * @apiSuccess {String}     data.object
 * @apiSuccess {String}     data.id ID столика
 * @apiSuccess {String}     data.number Номер столика
 * @apiSuccess {String}     data.count_people Количество человек
 * @apiSuccess {String}     data.room_id ID комнаты
 * @apiSuccess {String}     data.comment Комментарий
 *
 * @apiQuery {String}  [include]
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/h2 200 OK
 * {
 * "data": {
 * "object": "Table",
 * "id": "l5",
 * "number": 1,
 * "count_people": 12,
 * "room_id": 1,
 * "comment": "31231234"
 * },
 * "meta": {
 * "include": [],
 * "custom": []
 * }
 * }
 */

/**
 * @apiDefine TableSuccessMultipleResponse
 *
 * @apiSuccess {Object[]}   data
 * @apiSuccess {String}     data.object
 * @apiSuccess {String}     data.id ID столика
 * @apiSuccess {String}     data.number Номер столика
 * @apiSuccess {String}     data.count_people Количество человек
 * @apiSuccess {String}     data.room_id ID комнаты
 * @apiSuccess {String}     data.comment Комментарий
 *
 * @apiQuery {String} [include]
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/h2 200 OK
 * {
 * "data": [
 * {
 * "object": "Table",
 * "id": "jR",
 * "number": 1,
 * "count_people": 12,
 * "room_id": 1,
 * "comment": null
 * }
 * ],
 * "meta": {
 * "include": [],
 * "custom": []
 * }
 * }
 */
