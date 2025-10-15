<?php

namespace App\Containers\AppSection\Authentication\Actions;

use Apiato\Core\Exceptions\IncorrectIdException;
use App\Containers\AppSection\Authentication\Notifications\Welcome;
use App\Containers\AppSection\Authentication\Tasks\SendVerificationEmailTask;
use App\Containers\AppSection\Authentication\UI\API\Requests\RegisterUserRequest;
use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\Tasks\AppendRestaurantToModelTask;
use App\Containers\AppSection\User\Models\User;
use App\Containers\AppSection\User\Tasks\CreateUserTask;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;
use Illuminate\Support\Facades\Auth;

class RegisterUserAction extends ParentAction
{
    public function __construct(
        private readonly CreateUserTask $createUserTask,
        private readonly SendVerificationEmailTask $sendVerificationEmailTask,
        protected readonly AppendRestaurantToModelTask $appendRestaurantToModelTask
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     * @throws IncorrectIdException
     */
    public function run(RegisterUserRequest $request): User
    {
        $sanitizedData = $request->sanitizeInput([
            'email',
            'password',
            'name',
            'gender',
            'username',
        ]);

        $user = $this->createUserTask->run($sanitizedData);

        if($user instanceof User && Auth::user()->restaurant instanceof Restaurant) {
            $this->appendRestaurantToModelTask->run(Auth::user()->restaurant->id, $user->id, User::class);
        }


        $user->notify(new Welcome());
        $this->sendVerificationEmailTask->run($user, $request->verification_url);

        return $user;
    }
}
