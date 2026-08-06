<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MigrateImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Download external WordPress images to local storage and update URLs in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting image migration from WordPress URLs to local storage...');
        
        // Ensure the directory exists in storage/app/public
        if (!Storage::disk('public')->exists('wp-images')) {
            Storage::disk('public')->makeDirectory('wp-images');
        }

        $posts = DB::table('posts')->get();
        $totalPosts = $posts->count();
        $this->info("Found {$totalPosts} posts to process.");

        $bar = $this->output->createProgressBar($totalPosts);
        $bar->start();

        $downloadedCount = 0;

        foreach ($posts as $post) {
            $updated = false;
            $coverImage = $post->coverImage;
            $content = $post->content;

            // 1. Process Cover Image
            if ($coverImage && str_starts_with($coverImage, 'http')) {
                $newPath = $this->downloadAndSaveImage($coverImage);
                if ($newPath) {
                    $coverImage = $newPath;
                    $updated = true;
                    $downloadedCount++;
                }
            }

            // 2. Process Images in Content
            if ($content) {
                // Find all image tags
                preg_match_all('/<img[^>]+src="([^">]+)"/i', $content, $matches);
                if (!empty($matches[1])) {
                    foreach ($matches[1] as $oldUrl) {
                        if (str_starts_with($oldUrl, 'http')) {
                            $newPath = $this->downloadAndSaveImage($oldUrl);
                            if ($newPath) {
                                $content = str_replace($oldUrl, $newPath, $content);
                                $updated = true;
                                $downloadedCount++;
                            }
                        }
                    }
                }
            }

            // 3. Update Post if changed
            if ($updated) {
                DB::table('posts')->where('id', $post->id)->update([
                    'coverImage' => $coverImage,
                    'content' => $content,
                    'updated_at' => now(),
                ]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Migration complete! Successfully downloaded and updated {$downloadedCount} images.");
    }

    /**
     * Download the image and save it to the public disk.
     */
    private function downloadAndSaveImage($url)
    {
        try {
            // Clean URL (remove query parameters if any)
            $cleanUrl = strtok($url, '?');
            $extension = pathinfo($cleanUrl, PATHINFO_EXTENSION) ?: 'jpg';
            
            // Create a unique filename
            $filename = Str::random(40) . '.' . $extension;
            
            // Download content
            $response = Http::timeout(30)->get($url);
            
            if ($response->successful()) {
                $path = 'wp-images/' . $filename;
                Storage::disk('public')->put($path, $response->body());
                return '/storage/' . $path;
            }
        } catch (\Exception $e) {
            $this->error(" Failed to download: {$url}");
        }

        return null; // Return null if failed so we keep the old URL
    }
}
