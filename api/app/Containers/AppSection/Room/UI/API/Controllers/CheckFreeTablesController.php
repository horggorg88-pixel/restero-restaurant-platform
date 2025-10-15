<?php

namespace App\Containers\AppSection\Room\UI\API\Controllers;

use App\Containers\AppSection\Room\Actions\CheckFreeTablesAction;
use App\Containers\AppSection\Room\UI\API\Requests\CheckFreeTablesRequest;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class CheckFreeTablesController extends ApiController
{
    public function __construct(
        private readonly CheckFreeTablesAction $action
    ) {
    }

    /**
     */
    public function __invoke(CheckFreeTablesRequest $request): JsonResponse
    {

        $check = $this->action->run($request);

        return $this->json(['success' => $check]);
    }
}
