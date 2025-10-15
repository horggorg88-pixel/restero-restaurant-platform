<?php

namespace App\Containers\AppSection\Room\UI\API\Requests;


use App\Ship\Parents\Requests\Request as ParentRequest;


class CheckFreeTablesRequest extends ParentRequest
{
    protected array $access = [
        'permissions' => '',
        'roles' => 'admin',
    ];

    protected array $decode = [
        'room_id',
        'booking_id'
    ];

    protected array $urlParameters = [
        // 'id',
    ];
//41
//4R6
    public function rules(): array
    {
        return [
            'booking_date' => 'required|date_format:Y-m-d',
            'room_id' => 'required|integer|exists:rooms,id',
            'count_people' => ['required','integer'],
            'booking_id' => ['nullable','integer'],
            'count_booking_time' => 'required|date_format:H:i',
            'booking_time' => ['required', 'date_format:H:i'],
            'table_ids' => ['required','array'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation() {
        if(isset($this->table_ids) && count($this->table_ids) > 0) {
            $this->table_ids = $this->decodeArray($this->table_ids);
        }
    }
}
