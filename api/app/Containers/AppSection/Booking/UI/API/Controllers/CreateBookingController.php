<?php

namespace App\Containers\AppSection\Booking\UI\API\Controllers;

use Apiato\Core\Exceptions\IncorrectIdException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Booking\Actions\CreateBookingAction;
use App\Containers\AppSection\Booking\UI\API\Requests\CreateBookingRequest;
use App\Containers\AppSection\Booking\UI\API\Transformers\BookingTransformer;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class CreateBookingController extends ApiController
{
    public function __construct(
        private readonly CreateBookingAction $action,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws InvalidTransformerException
     * @throws IncorrectIdException
     */
    public function __invoke(CreateBookingRequest $request): JsonResponse
    {
        $booking = $this->action->run($request);

        return $this->json([
            'success' => $booking,
        ]);
    }
}
