<?php

namespace App\Containers\AppSection\Booking\Tasks;

use App\Containers\AppSection\Booking\Data\Enums\BookingStatuses;
use App\Containers\AppSection\Booking\Data\Repositories\BookingRepository;
use App\Containers\AppSection\Booking\Events\BookingDeletedEvent;
use App\Containers\AppSection\Booking\Models\Booking;
use App\Ship\Exceptions\DeleteResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class DeleteBookingTask extends ParentTask
{
    public function __construct(
        protected readonly BookingRepository $repository,
    ) {
    }

    /**
     * @throws DeleteResourceFailedException
     * @throws NotFoundException
     */
    public function run($id): int
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
                        $this->repository->delete($compositeOrder->id);
                    }

                }
            }

            $result = $this->repository->delete($id);
            BookingDeletedEvent::dispatch($result);

            return $result;
        } catch (ModelNotFoundException) {
            throw new NotFoundException();
        } catch (\Exception) {
            throw new DeleteResourceFailedException();
        }
    }
}
