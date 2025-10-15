<?php

use App\Containers\AppSection\Room\UI\API\Controllers\GetFreeTablesController;
use Illuminate\Support\Facades\Route;

Route::get('get-free-tables', GetFreeTablesController::class)
    ->middleware(['auth:api']);

