<?php

namespace App\Containers\AppSection\Booking\UI\API\Controllers;

use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Booking\Actions\FindBookingByIdAction;
use App\Containers\AppSection\Booking\UI\API\Requests\FindBookingByIdRequest;
use App\Containers\AppSection\Booking\UI\API\Transformers\BookingTransformer;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Controllers\ApiController;

class FindBookingByIdController extends ApiController
{
    public function __construct(
        private readonly FindBookingByIdAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException|NotFoundException
     */
    public function __invoke(FindBookingByIdRequest $request): array
    {
        $booking = $this->action->run($request);

        return $this->transform($booking, BookingTransformer::class);
    }
}
