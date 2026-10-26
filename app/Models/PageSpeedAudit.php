<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

class PageSpeedAudit extends Model
{
    use HasFactory;

    protected $table = 'pagespeed_audits';

    protected $guarded = [];

    protected $casts = [
        'performance_score' => 'integer',
        'accessibility_score' => 'integer',
        'best_practices_score' => 'integer',
        'seo_score' => 'integer',
        'fcp_value' => 'float',
        'lcp_value' => 'float',
        'tbt_value' => 'float',
        'cls_value' => 'float',
        'speed_index_value' => 'float',
        'ttfb_value' => 'float',
        'field_metrics' => 'array',
        'opportunities' => 'array',
        'diagnostics' => 'array',
    ];

    /**
     * Auto-heal database schema if table is missing in live MySQL.
     */
    public static function ensureSchema(): void
    {
        try {
            if (!Schema::hasTable('pagespeed_audits')) {
                Artisan::call('migrate', ['--force' => true]);
            }
        } catch (\Throwable $e) {}
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tested_by');
    }
}
