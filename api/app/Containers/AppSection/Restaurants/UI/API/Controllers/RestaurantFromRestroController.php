<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Controllers;

use App\Containers\AppSection\Restaurants\Actions\CreateRestaurantFromRestroAction;
use App\Containers\AppSection\Restaurants\UI\API\Requests\CreateRestaurantFromRestroRequest;
use App\Ship\Parents\Controllers\ApiController;
use Illuminate\Http\JsonResponse;

class RestaurantFromRestroController extends ApiController
{
    /**
     * Создание ресторана из Restro
     */
    public function createRestaurant(CreateRestaurantFromRestroRequest $request, CreateRestaurantFromRestroAction $action): JsonResponse
    {
        try {
            $result = $action->run($request);
            
            return $this->json($result, 201);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Ошибка создания ресторана',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Получение статистики ресторана
     */
    public function getStats(int $id): JsonResponse
    {
        try {
            // Здесь должна быть логика получения статистики
            // Пока возвращаем mock данные
            $stats = [
                'totalBookings' => rand(0, 100),
                'todayBookings' => rand(0, 20),
                'activeBookings' => rand(0, 50),
                'cancelledBookings' => rand(0, 10),
                'revenue' => rand(0, 100000),
                'averageBookingDuration' => 120,
                'popularTimeSlots' => ['19:00', '20:00', '21:00'],
                'lastUpdated' => now()->toISOString()
            ];

            return $this->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Ошибка получения статистики',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Синхронизация доступов сотрудников
     */
    public function syncAccesses(int $id): JsonResponse
    {
        try {
            // Здесь должна быть логика синхронизации доступов
            // Пока возвращаем успешный ответ
            return $this->json([
                'success' => true,
                'message' => 'Доступы успешно синхронизированы',
                'data' => [
                    'restaurantId' => $id,
                    'accesses' => []
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Ошибка синхронизации доступов',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Health check для API
     */
    public function health(): JsonResponse
    {
        return $this->json([
            'status' => 'ok',
            'message' => 'Booking API is running',
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0'
        ]);
    }
}
