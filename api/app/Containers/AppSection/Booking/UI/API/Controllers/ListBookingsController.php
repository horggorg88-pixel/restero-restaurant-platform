<?php

namespace App\Containers\AppSection\Booking\UI\API\Controllers;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Booking\Actions\ListBookingsAction;
use App\Containers\AppSection\Booking\UI\API\Requests\ListBookingsRequest;
use App\Containers\AppSection\Booking\UI\API\Transformers\BookingTransformer;
use App\Ship\Parents\Controllers\ApiController;
use Prettus\Repository\Exceptions\RepositoryException;

class ListBookingsController extends ApiController
{
    public function __construct(
        private readonly ListBookingsAction $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function __invoke(ListBookingsRequest $request): array
    {
        $bookings = $this->action->run($request);

        return $this->transform($bookings, BookingTransformer::class);
    }
}
