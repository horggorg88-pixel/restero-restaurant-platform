<?php

namespace App\Containers\AppSection\Room\UI\API\Controllers;

use App\Containers\AppSection\Booking\Models\Booking;
use App\Containers\AppSection\Room\Actions\DeleteRoomAction;
use App\Containers\AppSection\Room\Models\Room;
use App\Containers\AppSection\Room\Tasks\FindRoomByIdTask;
use App\Containers\AppSection\Room\UI\API\Requests\DeleteRoomRequest;
use App\Ship\Exceptions\DeleteResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Controllers\ApiController;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DeleteRoomController extends ApiController
{
    public function __construct(
        private readonly DeleteRoomAction $action,
        private readonly FindRoomByIdTask $findRoomById
    ) {
    }

    /**
     * @throws DeleteResourceFailedException
     * @throws NotFoundException
     */
    public function __invoke(DeleteRoomRequest $request): JsonResponse
    {
        $room = $this->findRoomById->run($request->id);

        if($room instanceof Room) {

            $bookings = Booking::query()->where('room_id', $room->id)->where('status', 0)->where('booking_date', '>=', Carbon::now()->format('Y-m-d'))->count();



            if($bookings > 0) {
                return response()->json([
                    'success' => false,
                    'errors' => "Есть брони, привязанные к данному помещению"
                ], 400);
            }
        }

        $this->action->run($request);

        return $this->noContent();
    }
}
