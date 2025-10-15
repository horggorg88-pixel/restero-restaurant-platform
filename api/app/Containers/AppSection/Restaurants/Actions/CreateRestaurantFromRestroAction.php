<?php

namespace App\Containers\AppSection\Restaurants\Actions;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Containers\AppSection\Restaurants\Tasks\CreateRestaurantsTask;
use App\Containers\AppSection\Restaurants\UI\API\Requests\CreateRestaurantFromRestroRequest;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Actions\Action as ParentAction;
use Illuminate\Support\Str;

class CreateRestaurantFromRestroAction extends ParentAction
{
    public function __construct(
        private readonly CreateRestaurantsTask $createRestaurantsTask,
    ) {
    }

    /**
     * Создание ресторана из Restro с полной интеграцией
     * 
     * @throws CreateResourceFailedException
     */
    public function run(CreateRestaurantFromRestroRequest $request): array
    {
        $data = $request->sanitizeInput([
            'name',
            'address',
            'description',
            'phone',
            'email',
            'website',
            'photo',
            'restro_id',
            'owner_id'
        ]);

        // Создаем ресторан в системе бронирований
        $restaurantData = [
            'name' => $data['name'],
            'address' => $data['address'],
            'description' => $data['description'] ?? null,
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'website' => $data['website'] ?? null,
            'photo' => $data['photo'] ?? null,
            'restro_id' => $data['restro_id'] ?? null,
            'owner_id' => $data['owner_id'] ?? null,
            'is_active' => true,
            'api_key' => $this->generateApiKey(),
            'created_at' => now(),
            'updated_at' => now()
        ];

        $restaurant = $this->createRestaurantsTask->run($restaurantData);

        // Создаем залы и столы по умолчанию
        $this->createDefaultHallsAndTables($restaurant);

        // Возвращаем данные для Restro
        return [
            'success' => true,
            'message' => 'Ресторан успешно создан в системе бронирований',
            'data' => [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'address' => $restaurant->address,
                'description' => $restaurant->description,
                'phone' => $restaurant->phone,
                'email' => $restaurant->email,
                'website' => $restaurant->website,
                'photo' => $restaurant->photo,
                'is_active' => $restaurant->is_active,
                'created_at' => $restaurant->created_at,
                'updated_at' => $restaurant->updated_at
            ],
            'api_key' => $restaurant->api_key,
            'stats' => [
                'totalBookings' => 0,
                'todayBookings' => 0,
                'activeBookings' => 0,
                'cancelledBookings' => 0,
                'revenue' => 0,
                'averageBookingDuration' => 120,
                'popularTimeSlots' => ['19:00', '20:00', '21:00'],
                'lastUpdated' => now()->toISOString()
            ]
        ];
    }

    /**
     * Генерация API ключа для ресторана
     */
    private function generateApiKey(): string
    {
        return 'booking_api_' . Str::random(32) . '_' . time();
    }

    /**
     * Создание залов и столов по умолчанию
     */
    private function createDefaultHallsAndTables(Restaurant $restaurant): void
    {
        // Создаем основной зал
        $mainHall = $restaurant->halls()->create([
            'name' => 'Основной зал',
            'capacity' => 50,
            'description' => 'Главный зал ресторана',
            'is_active' => true
        ]);

        // Создаем столы в основном зале
        $tables = [
            ['number' => '1', 'capacity' => 2, 'position_x' => 10, 'position_y' => 10],
            ['number' => '2', 'capacity' => 4, 'position_x' => 20, 'position_y' => 10],
            ['number' => '3', 'capacity' => 6, 'position_x' => 30, 'position_y' => 10],
            ['number' => '4', 'capacity' => 2, 'position_x' => 10, 'position_y' => 20],
            ['number' => '5', 'capacity' => 4, 'position_x' => 20, 'position_y' => 20],
            ['number' => '6', 'capacity' => 8, 'position_x' => 30, 'position_y' => 20],
        ];

        foreach ($tables as $tableData) {
            $mainHall->tables()->create([
                'number' => $tableData['number'],
                'capacity' => $tableData['capacity'],
                'position_x' => $tableData['position_x'],
                'position_y' => $tableData['position_y'],
                'is_active' => true
            ]);
        }

        // Создаем VIP зал (если ресторан большой)
        if (strlen($restaurant->name) > 10) {
            $vipHall = $restaurant->halls()->create([
                'name' => 'VIP зал',
                'capacity' => 20,
                'description' => 'VIP зал для особых случаев',
                'is_active' => true
            ]);

            // Создаем столы в VIP зале
            $vipTables = [
                ['number' => 'V1', 'capacity' => 4, 'position_x' => 50, 'position_y' => 10],
                ['number' => 'V2', 'capacity' => 6, 'position_x' => 60, 'position_y' => 10],
                ['number' => 'V3', 'capacity' => 8, 'position_x' => 70, 'position_y' => 10],
            ];

            foreach ($vipTables as $tableData) {
                $vipHall->tables()->create([
                    'number' => $tableData['number'],
                    'capacity' => $tableData['capacity'],
                    'position_x' => $tableData['position_x'],
                    'position_y' => $tableData['position_y'],
                    'is_active' => true
                ]);
            }
        }
    }
}
