<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Auto-push pending & bottom unindexed pages to Googlebot daily (50/day within 200 quota)
Schedule::command('gsc:index-pending --limit=50 --order=bottom-first')->dailyAt('02:00');
