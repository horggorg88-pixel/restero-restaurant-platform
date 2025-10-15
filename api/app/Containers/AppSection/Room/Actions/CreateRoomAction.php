<?php

namespace App\Containers\AppSection\Room\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\Tasks\AppendRestaurantToModelTask;
use App\Containers\AppSection\Room\Models\Room;
use App\Containers\AppSection\Room\Tasks\CreateRoomTask;
use App\Containers\AppSection\Room\UI\API\Requests\CreateRoomRequest;
use App\Containers\AppSection\User\Models\User;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;
use Illuminate\Support\Facades\Auth;

class CreateRoomAction extends ParentAction
{
    public function __construct(
        private readonly CreateRoomTask $createRoomTask,
        protected readonly AppendRestaurantToModelTask $appendRestaurantToModelTask
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws IncorrectIdException
     */
    public function run(CreateRoomRequest $request): Room
    {
        $data = $request->sanitizeInput([
            'name',
            'comment'
        ]);

        $room = $this->createRoomTask->run($data);
        if($request->restaurant_id) {
            $this->appendRestaurantToModelTask->run($request->restaurant_id, $room->id, Room::class);
        }
        elseif(Auth::user()->restaurant instanceof Restaurant) {
            $this->appendRestaurantToModelTask->run(Auth::user()->restaurant->id, $room->id, Room::class);
        }
        return $room;
    }
}
