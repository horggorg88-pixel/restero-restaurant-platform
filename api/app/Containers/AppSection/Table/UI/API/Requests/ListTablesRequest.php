<?php

namespace App\Containers\AppSection\Table\UI\API\Requests;

use App\Containers\AppSection\Restaurants\Models\Restaurant;
use App\Ship\Parents\Requests\Request as ParentRequest;
use Illuminate\Support\Facades\Auth;

class ListTablesRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
    ];

    protected array $decode = [
         'room_id',
    ];

    protected array $urlParameters = [
        // 'id',
    ];

    public function rules(): array
    {
        return [
            'restaurant_id' => 'required|integer|exists:restaurants,id',
            'room_id' => 'required|integer',
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
