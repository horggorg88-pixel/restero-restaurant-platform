<?php

namespace App\Containers\AppSection\Booking\Data\Enums;

/**
 *  Статусы бронирования
 */
enum BookingStatuses: int
{

    /**
     *  Запланированные
     */
    case Actual = 0;

    /**
     *  Отмененные
     */
    case Canceled = 1;
    /**
     *  Исполненные
     */
    case Closed = 2;
    /**
     *  Исполняются сейчас
     */
    case InProcess = 3;

    public static function toArray() {
        $enumsArr = self::cases();
        return array_column($enumsArr, 'value');
    }

}