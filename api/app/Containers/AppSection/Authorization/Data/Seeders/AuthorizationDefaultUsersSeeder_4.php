<?php

namespace App\Containers\AppSection\Authorization\Data\Seeders;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\Tasks\AppendRestaurantToModelTask;
use App\Containers\AppSection\User\Actions\CreateAdminAction;
use App\Containers\AppSection\User\Models\User;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Seeders\Seeder as ParentSeeder;
use Illuminate\Support\Facades\App;

class AuthorizationDefaultUsersSeeder_4 extends ParentSeeder
{
    /**
     * @throws CreateResourceFailedException
     * @throws \Throwable
     */
    public function run(CreateAdminAction $action): void
    {
        // Default Users (with their roles) ---------------------------------------------
        $userData = [
            'email' => 'admin@admin.com',
            'password' => config('appSection-authorization.admin_role'),
            'name' => 'Super Admin',
            'username' => 'admin'
        ];

        $user = $action->run($userData);
        $restuarant = Restaurant::query()->create([
            'name' => 'По умолчанию',
            'start_time' => '10:00:00',
            'end_time' => '19:00:00',
        ]);
        App::make(AppendRestaurantToModelTask::class)->run($restuarant->id, $user->id, User::class);
    }
}
