<?php

namespace App\Containers\AppSection\Booking\UI\API\Controllers;

use App\Containers\AppSection\Booking\Actions\DeleteBookingAction;
use App\Containers\AppSection\Booking\UI\API\Requests\DeleteBookingRequest;
use App\Ship\Exceptions\DeleteResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class DeleteBookingController extends ApiController
{
    public function __construct(
        private readonly DeleteBookingAction $action,
    ) {
    }

    /**
     * @throws DeleteResourceFailedException
     * @throws NotFoundException
     */
    public function __invoke(DeleteBookingRequest $request): JsonResponse
    {
        $this->action->run($request);

        return $this->noContent();
    }
}
