<?php

namespace App\Containers\AppSection\Booking\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class UserPhone implements CastsAttributes
{
    public function get($model, $key, $value, $attributes)
    {
        if(empty($value)) return '';
        return '+'.preg_replace(["/[^\d]*?/", "/^8(\d{10})/"], ['', '7\1'], $value);
    }

    public function set($model, $key, $value, $attributes)
    {
        if(empty($value)) return null;
        return '+'.preg_replace(["/[^\d]*?/", "/^8(\d{10})/"], ['', '7\1'], $value);
    }
}