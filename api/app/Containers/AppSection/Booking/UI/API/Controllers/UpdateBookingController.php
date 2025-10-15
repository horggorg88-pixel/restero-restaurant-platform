<?php

namespace App\Containers\AppSection\Booking\UI\API\Controllers;

use Apiato\Core\Exceptions\IncorrectIdException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Booking\Actions\UpdateBookingAction;
use App\Containers\AppSection\Booking\UI\API\Requests\UpdateBookingRequest;
use App\Containers\AppSection\Booking\UI\API\Transformers\BookingTransformer;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class UpdateBookingController extends ApiController
{
    public function __construct(
        private readonly UpdateBookingAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws UpdateResourceFailedException
     * @throws IncorrectIdException
     * @throws NotFoundException
     */
    public function __invoke(UpdateBookingRequest $request): JsonResponse
    {
        $booking = $this->action->run($request);

        return $this->json([
            'success' => $booking,
        ]);
    }
}
