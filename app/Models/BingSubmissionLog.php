<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

class BingSubmissionLog extends Model
{
    use HasFactory;

    protected $table = 'bing_submission_logs';

    protected $guarded = [];

    protected $casts = [
        'http_code' => 'integer',
        'submitted_by' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    /**
     * Auto-heal database schema if table is missing in live MySQL.
     */
    public static function ensureSchema(): void
    {
        try {
            if (!Schema::hasTable('bing_submission_logs')) {
                Artisan::call('migrate', ['--force' => true]);
            }
        } catch (\Throwable $e) {}
    }
}
