<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        $roles = [];

        $managerRole = [
            'name' => 'manager',
            'guard_name' => 'web',
            'display_name' => 'Manager Role',
            'description' => 'Manager',
        ];

        $role = \App\Containers\AppSection\Authorization\Models\Role::query()->create($managerRole);
        if($role instanceof \App\Containers\AppSection\Authorization\Models\Role) {
            $roles[] = $role->id;
        }

        $managerRole = [
            'name' => 'manager',
            'guard_name' => 'api',
            'display_name' => 'Manager Role',
            'description' => 'Manager',
        ];

        $role = \App\Containers\AppSection\Authorization\Models\Role::query()->create($managerRole);
        if($role instanceof \App\Containers\AppSection\Authorization\Models\Role) {
            $roles[] = $role->id;
        }


        $userData = [
            'email' => 'manager@manager.com',
            'password' => 'manager',
            'name' => 'Менеджер',
            'username' => 'manager'
        ];

        $user = \App\Containers\AppSection\User\Models\User::query()->create($userData);
        $user->assignRole('manager');


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
