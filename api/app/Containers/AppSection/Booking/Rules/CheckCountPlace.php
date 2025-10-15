<?php

namespace App\Containers\AppSection\Booking\Rules;

use App\Containers\AppSection\Table\Data\Repositories\TableRepository;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CheckCountPlace implements ValidationRule
{

    public function __construct(
        protected $table_ids
    )
    {
    }

    /**
     * Run the validation rule.
     *
     * @param \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        if(is_array($this->table_ids) && count($this->table_ids) == 1) {
            $tableRepository = app(TableRepository::class);
            $table = $tableRepository->find(current($this->table_ids));
            if($table->count_people < $value) {
                $fail("The number of people exceeds the available seats");
            }
        }


    }
}
