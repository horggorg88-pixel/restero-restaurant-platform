<?php

namespace App\Containers\AppSection\Table\UI\API\Requests;

use App\Ship\Parents\Requests\Request as ParentRequest;
use Illuminate\Validation\Rule;

class CreateTableRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
    ];

    protected array $decode = [
        'room_id'
    ];

    protected array $urlParameters = [

    ];

    public function rules(): array
    {
        return [
            'number' => [
                'required',
                Rule::unique('tables', 'number')->where('room_id', $this->room_id),
            ],
            'count_people' => 'required|integer',
            'room_id' => 'required|integer',
            'comment' => 'string|nullable',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }


}
