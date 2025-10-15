<?php

namespace App\Containers\AppSection\Room\UI\API\Requests;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Parents\Requests\Request as ParentRequest;
use Illuminate\Support\Facades\Auth;

class ListRoomsRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
    ];

    protected array $decode = [
        // 'id',
    ];

    protected array $urlParameters = [
        // 'id',
    ];

    public function rules(): array
    {
        return [
            'restaurant_id' => 'required|integer|exists:restaurants,id',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation() {
        if(Auth::user()->restaurant instanceof Restaurant) {
            $this->merge([
                'restaurant_id' => Auth::user()->restaurant->id
            ]);
        }
    }
}
