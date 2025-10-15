<?php

namespace App\Containers\AppSection\Booking\UI\API\Controllers;

use Apiato\Core\Exceptions\IncorrectIdException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Booking\Actions\CancelBookingAction;
use App\Containers\AppSection\Booking\Actions\CreateBookingAction;
use App\Containers\AppSection\Booking\Actions\RestoreBookingAction;
use App\Containers\AppSection\Booking\UI\API\Requests\CancelBookingRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\CreateBookingRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\RestoreBookingRequest;
use App\Containers\AppSection\Booking\UI\API\Transformers\BookingTransformer;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class RestoreBookingController extends ApiController
{
    public function __construct(
        private readonly RestoreBookingAction $action
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws InvalidTransformerException
     * @throws NotFoundException
     * @throws UpdateResourceFailedException

     */
    public function __invoke(RestoreBookingRequest $request): array
    {
        $booking = $this->action->run($request);
        return $this->transform($booking, BookingTransformer::class);
    }
}
