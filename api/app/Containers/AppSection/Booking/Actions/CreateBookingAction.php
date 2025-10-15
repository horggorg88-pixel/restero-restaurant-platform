<?php

namespace App\Containers\AppSection\Booking\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\Rules\CheckBookingTime;
use App\Containers\AppSection\Booking\Rules\CheckCountPlace;
use App\Containers\AppSection\Booking\Tasks\CreateBookingTask;
use App\Containers\AppSection\Booking\UI\API\Requests\CreateBookingRequest;
use App\Containers\AppSection\History\Tasks\CreateHistoryTask;
use App\Containers\AppSection\Table\Models\Table;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;
use Illuminate\Support\Facades\Auth;

class CreateBookingAction extends ParentAction
{
    public function __construct(
        private readonly CreateBookingTask $createBookingTask,
        private readonly CreateHistoryTask $createHistoryTask,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws IncorrectIdException
     */
    public function run(CreateBookingRequest $request): bool
    {
        $data = $request->sanitizeInput([
            'booking_date',
            'room_id',
            'booking_time',
            'count_people',
            'client_name',
            'client_phone',
            'comment',
            'booking_time_to',
            'user_id' => Auth::user()->id,
        ]);

        $sumCountPeople = Table::query()->whereIn('id', $request->table_ids)->sum('count_people');

        if(count($request->table_ids) == 1 && $sumCountPeople < $request->count_people) {
            return false;
        }

        foreach($request->table_ids as $tableId) {
            $request->validate([
               'booking_time' => new CheckBookingTime(
                   [
                       'room_id' => $request->room_id,
                       'table_id' => $tableId,
                       'booking_date' => $request->booking_date,
                       'count_booking_time' => $request->count_booking_time,
                   ])
            ]);
        }


        foreach($request->table_ids as $table_id) {
            $data['table_id'] = $table_id;

            if(count($request->table_ids) > 1) {
                $data['composite_tables'] = $request->table_ids;
            }

            $booking = $this->createBookingTask->run($data);
            $this->createHistoryTask->run($booking, 'created');
        }


        return true;
    }
}
