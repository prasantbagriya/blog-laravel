<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstituteInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'business_name',
        'student_name',
        'phone',
        'course',
        'message',
        'status',
        'source',
        'ip_address',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
