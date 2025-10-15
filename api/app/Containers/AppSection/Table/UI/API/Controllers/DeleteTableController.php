<?php

namespace App\Containers\AppSection\Table\UI\API\Controllers;


use App\Containers\AppSection\Table\Actions\DeleteTableAction;
use App\Containers\AppSection\Table\Models\Table;
use App\Containers\AppSection\Table\Tasks\FindTableByIdTask;
use App\Containers\AppSection\Table\UI\API\Requests\DeleteTableRequest;
use App\Ship\Exceptions\DeleteResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Controllers\ApiController;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;


class DeleteTableController extends ApiController
{
    public function __construct(
        private readonly DeleteTableAction $action,
        private readonly FindTableByIdTask $findTableByIdTask
    ) {
    }

    /**
     * @throws DeleteResourceFailedException
     * @throws NotFoundException
     */
    public function __invoke(DeleteTableRequest $request): JsonResponse
    {
        $table = $this->findTableByIdTask->run($request->id);
        if($table  instanceof Table) {
            $bookings = $table->bookings()->where('status', 0)->where('booking_date', '>=', Carbon::now()->format('Y-m-d'))->count();
            if($bookings > 0) {
                return response()->json([
                    'success' => false,
                    'errors' => "Есть брони, привязанные к данному столу"
                ], 400);
            }
        }



        $this->action->run($request);

        return $this->noContent();
    }
}
