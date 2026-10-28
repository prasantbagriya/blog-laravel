<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Admin\SearchConsoleController;
use App\Services\Google\GoogleIndexingService;

class GoogleIndexPendingPagesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gsc:index-pending 
                            {--limit=50 : Maximum number of pending URLs to push}
                            {--type=all : Filter content type (all, posts, businesses, stories, pages)}
                            {--order=bottom-first : Push order (bottom-first or newest-first)}
                            {--force : Force push bypassing 24h cooldown}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pushes pending and unindexed pages (starting from the bottom) to Google Instant Indexing API';

    /**
     * Execute the console command.
     */
    public function handle(SearchConsoleController $gscController, GoogleIndexingService $indexingService)
    {
        $limit = intval($this->option('limit') ?: 50);
        $type = $this->option('type') ?: 'all';
        $order = $this->option('order') ?: 'bottom_first';
        $force = $this->option('force');

        $this->info("Fetching site inventory for pending Google Indexing pushes...");
        $inventory = $gscController->fetchSitePagesInventory();

        $summary = $inventory['summary'];
        $this->table(
            ['Total Site Pages', 'Already Pushed', 'Pending (Niche Pade)', 'Failed', 'Today Quota Used', 'Remaining Quota'],
            [[
                $summary['total_pages'],
                $summary['pushed_count'],
                $summary['pending_count'],
                $summary['failed_count'],
                $summary['quota_used_today'],
                $summary['quota_remaining'] . ' / ' . $summary['quota_limit'],
            ]]
        );

        if ($summary['quota_remaining'] <= 0 && !$force) {
            $this->warn("Daily Google Indexing API quota (200 URLs/day) has already been reached for today.");
            return 0;
        }

        $allPages = $inventory['pages'];
        if ($type !== 'all') {
            $allPages = array_values(array_filter($allPages, fn($p) => $p['type'] === $type));
        }

        $pendingPages = array_values(array_filter($allPages, function($p) use ($force) {
            if ($force) {
                return true;
            }
            return in_array($p['status'], ['pending', 'failed', 'eligible'], true);
        }));

        if (empty($pendingPages)) {
            $this->info("All eligible pages have already been pushed to Googlebot! No pending pages left.");
            return 0;
        }

        if ($order === 'bottom_first') {
            $this->info("Order: Bottom-first (pushing oldest unindexed content first)");
        } else {
            $this->info("Order: Newest-first");
            $pendingPages = array_reverse($pendingPages);
        }

        $slice = array_slice($pendingPages, 0, min($limit, $summary['quota_remaining']));
        $urls = array_column($slice, 'url');

        $this->info("Submitting " . count($urls) . " URL(s) to Google Instant Indexing API...");
        $results = $indexingService->batchPublish($urls, 'URL_UPDATED', 'artisan_command', $force);

        $tableRows = [];
        $pushed = 0;
        $skipped = 0;
        $failed = 0;

        foreach ($results as $res) {
            $url = $res['url'] ?? 'N/A';
            $status = $res['status'] ?? 'unknown';
            $code = $res['http_code'] ?? '-';
            $msg = $res['message'] ?? '';

            if (!empty($res['skipped'])) {
                $skipped++;
            } elseif (!empty($res['success'])) {
                $pushed++;
            } else {
                $failed++;
            }

            $tableRows[] = [$url, $status, $code, substr($msg, 0, 60)];
        }

        $this->table(['URL', 'Status', 'HTTP Code', 'Response Message'], $tableRows);
        $this->info("Done! Pushed: {$pushed}, Skipped: {$skipped}, Failed: {$failed}.");

        $quota = $indexingService->getDailyQuotaStats();
        $this->info("Remaining Google Indexing Quota for today: {$quota['remaining']}/{$quota['limit']}");

        return 0;
    }
}
