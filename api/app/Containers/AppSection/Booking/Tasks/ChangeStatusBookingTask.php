<?php

namespace App\Containers\AppSection\Booking\Tasks;

use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ChangeStatusBookingTask extends ParentTask
{
    public function __construct(
        protected readonly BookingRepository $repository,
    ) {
    }

    /**
     * @throws NotFoundException
     * @throws UpdateResourceFailedException
     */
    public function run($id, $status): Booking
    {
        try {

            $order = $this->repository->find($id);

            if(is_array($order->composite_tables)) {

                foreach($order->composite_tables as $composite_table) {

                    $compositeOrder = $this->repository->findWhere([
                        'room_id' => $order->room_id,
                        'table_id' => $composite_table,
                        'booking_date' => $order->booking_date,
                        'booking_time' => $order->booking_time,
                        'client_phone' => $order->client_phone,
                    ])->first();

                    if($compositeOrder instanceof Booking) {
                        $this->repository->update(['status' => $status], $compositeOrder->id);
                    }

                }
            }


            return $this->repository->update([
                'status' => $status
            ], $id);
        } catch (ModelNotFoundException) {
            throw new NotFoundException();
        } catch (\Exception $exception) {
            throw new UpdateResourceFailedException();
        }
    }
}
