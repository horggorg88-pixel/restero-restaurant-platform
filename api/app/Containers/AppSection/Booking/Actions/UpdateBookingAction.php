<?php

namespace App\Containers\AppSection\Booking\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Booking\Rules\CheckBookingTime;
use App\Containers\AppSection\Booking\Tasks\CreateBookingTask;
use App\Containers\AppSection\Booking\Tasks\FindBookingByIdTask;
use App\Containers\AppSection\Booking\Tasks\UpdateBookingTask;
use App\Containers\AppSection\Booking\UI\API\Requests\UpdateBookingRequest;
use App\Containers\AppSection\History\Tasks\CreateHistoryTask;
use App\Containers\AppSection\Table\Models\Table;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;
use Illuminate\Support\Facades\Auth;

class UpdateBookingAction extends ParentAction
{
    public function __construct(
        private readonly UpdateBookingTask $updateBookingTask,
        protected readonly CreateHistoryTask $createHistoryTask,
        protected FindBookingByIdTask $bookingByIdTask,
        protected BookingRepository $repository,
        protected CreateBookingTask $createBookingTask
    ) {
    }

    /**
     * @throws UpdateResourceFailedException
     * @throws IncorrectIdException
     * @throws NotFoundException|CreateResourceFailedException
     */
    public function run(UpdateBookingRequest $request): bool
    {
        $data = $request->sanitizeInput([
            'booking_date',
            'room_id',
            'booking_time',
            'count_people',
            'client_name',
            'client_phone',
            'comment',
            'booking_time_to'
        ]);

        $sumCountPeople = Table::query()->whereIn('id', $request->table_ids)->sum('count_people');

        if(count($request->table_ids) == 1 && $sumCountPeople < $request->count_people) {
            return false;
        }

        $booking = $this->bookingByIdTask->run($request->id);



       $compositeOrders = [];
        if(!is_null($booking->composite_tables)) {

            foreach($booking->composite_tables as $composite_table) {

                $compositeOrder = $this->repository->findWhere([
                    'room_id' => $request->room_id,
                    'table_id' => $composite_table,
                    'booking_date' => $booking->booking_date,
                    'booking_time' => $booking->booking_time,
                    'client_phone' => $booking->client_phone,
                ])->first();


                if($compositeOrder instanceof Booking) {
                    $compositeOrders[] = $compositeOrder->id;
                }
            }
        }

        sort($compositeOrders);

        if(count($compositeOrders) > 0) {
            $booking = $this->bookingByIdTask->run(current($compositeOrders));
        }

        foreach($request->table_ids as $tableId) {
            $request->validate([
                'booking_time' => new CheckBookingTime(
                    [
                        'room_id' => $request->room_id,
                        'table_id' => $tableId,
                        'booking_date' => $request->booking_date,
                        'count_booking_time' => $request->count_booking_time,
                        'id' => $booking->id,
                        'composite' => $compositeOrders
                    ])
            ]);
        }



        $insertTables = [];
        $data['table_id'] = $request->table_ids[0];

        if(count($request->table_ids) > 1) {
            $data['composite_tables'] = $request->table_ids;
        }

        $insertTables[] = $data['table_id'];

        $updatedBooking = $this->updateBookingTask->run($data, $booking->id);
        $this->createHistoryTask->run($updatedBooking, 'updated');


        if(is_array($booking->composite_tables)) {

            foreach($booking->composite_tables as $composite_table) {

                $compositeOrder = $this->repository->findWhere([
                    'room_id' => $request->room_id,
                    'table_id' => $composite_table,
                    'booking_date' => $booking->booking_date,
                    'booking_time' => $booking->booking_time,
                    'client_phone' => $booking->client_phone,
                ])->first();
                if($compositeOrder instanceof Booking && $compositeOrder->id != $booking->id) {
                    $this->repository->delete($compositeOrder->id);
                }

            }
        }

        foreach($request->table_ids as $table_id) {
            if($table_id == $booking->table_id || in_array($table_id, $insertTables)) continue;
            $data['table_id'] = $table_id;
            $data['user_id'] = Auth::id();
            $data['status'] = $updatedBooking->status;
            $order = $this->createBookingTask->run($data);
            $this->createHistoryTask->run($order, 'created');
            $insertTables[]  = $data['table_id'];
        }

        return true;
    }
}
