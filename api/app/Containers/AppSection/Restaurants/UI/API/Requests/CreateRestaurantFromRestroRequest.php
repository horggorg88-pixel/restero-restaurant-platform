<?php

namespace App\Containers\AppSection\Restaurants\UI\API\Requests;

use App\Ship\Parents\Requests\Request as ParentRequest;

class CreateRestaurantFromRestroRequest extends ParentRequest
{
    /**
     * Определяем правила валидации для создания ресторана из Restro
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'description' => 'nullable|string|max:1000',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'photo' => 'nullable|string|max:500',
            'restro_id' => 'nullable|string|max:100',
            'owner_id' => 'nullable|string|max:100',
        ];
    }

    /**
     * Определяем сообщения об ошибках валидации
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Название ресторана обязательно',
            'name.string' => 'Название ресторана должно быть строкой',
            'name.max' => 'Название ресторана не должно превышать 255 символов',
            'address.required' => 'Адрес ресторана обязателен',
            'address.string' => 'Адрес ресторана должен быть строкой',
            'address.max' => 'Адрес ресторана не должен превышать 500 символов',
            'description.string' => 'Описание должно быть строкой',
            'description.max' => 'Описание не должно превышать 1000 символов',
            'phone.string' => 'Телефон должен быть строкой',
            'phone.max' => 'Телефон не должен превышать 20 символов',
            'email.email' => 'Email должен быть корректным адресом электронной почты',
            'email.max' => 'Email не должен превышать 255 символов',
            'website.url' => 'Веб-сайт должен быть корректным URL',
            'website.max' => 'Веб-сайт не должен превышать 255 символов',
            'photo.string' => 'Фото должно быть строкой',
            'photo.max' => 'Фото не должно превышать 500 символов',
            'restro_id.string' => 'ID Restro должен быть строкой',
            'restro_id.max' => 'ID Restro не должен превышать 100 символов',
            'owner_id.string' => 'ID владельца должен быть строкой',
            'owner_id.max' => 'ID владельца не должен превышать 100 символов',
        ];
    }

    /**
     * Определяем авторизацию
     */
    public function authorize(): bool
    {
        return true; // Пока разрешаем всем, в реальном проекте нужна авторизация по API ключу
    }
}
