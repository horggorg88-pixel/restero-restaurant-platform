<?php

namespace App\Containers\AppSection\Booking\UI\API\Controllers;

use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Booking\Actions\ChangeStatusBookingAction;
use App\Containers\AppSection\Booking\UI\API\Requests\ChangeStatusBookingRequest;
use App\Containers\AppSection\Booking\UI\API\Transformers\BookingTransformer;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Controllers\ApiController;

class ChangeStatusBookingController extends ApiController
{
    public function __construct(
        private readonly ChangeStatusBookingAction $action
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws InvalidTransformerException
     * @throws NotFoundException
     * @throws UpdateResourceFailedException

     */
    public function __invoke(ChangeStatusBookingRequest $request): array
    {
        $booking = $this->action->run($request);
        return $this->transform($booking, BookingTransformer::class);
    }
}
