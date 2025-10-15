<?php

namespace App\Containers\AppSection\Booking\UI\API\Controllers;

use Apiato\Core\Exceptions\CoreInternalErrorException;
use Apiato\Core\Exceptions\InvalidTransformerException;
use App\Containers\AppSection\Booking\Actions\ListBookingsAction;
use App\Containers\AppSection\Booking\Tasks\AllBookingsTask;
use App\Containers\AppSection\Booking\Tasks\GuestsTask;
use App\Containers\AppSection\Booking\UI\API\Requests\AllBookingsRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\GuestsRequest;
use App\Containers\AppSection\Booking\UI\API\Requests\ListBookingsRequest;
use App\Containers\AppSection\Booking\UI\API\Transformers\BookingTransformer;
use App\Containers\AppSection\Booking\UI\API\Transformers\GuestTransformer;
use App\Ship\Parents\Controllers\ApiController;
use Prettus\Repository\Exceptions\RepositoryException;

class GuestsController extends ApiController
{
    public function __construct(
        private readonly GuestsTask $action
    ) {
    }

    /**
     * @throws InvalidTransformerException
     * @throws CoreInternalErrorException
     * @throws RepositoryException
     */
    public function __invoke(GuestsRequest $request): array
    {
        $bookings = $this->action->run($request);

        return $this->transform($bookings, GuestTransformer::class);
    }
}
