<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use Illuminate\Support\Str;

class ExportBlogPostsSeoCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'export:seo';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export all blog posts SEO data to a CSV file for Google Sheets';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting export...');

        $posts = Post::all();
        $fileName = 'blog_posts_seo_export.csv';
        $filePath = base_path($fileName);
        
        $csvFile = fopen($filePath, 'w');
        
        // Headers requested by the user
        fputcsv($csvFile, [
            'Link',
            'Title',
            'Meta Tag (Keywords)',
            'Meta Description',
            'OG Title',
            'OG Description',
            'Twitter Tag (Card)',
            'Twitter Description',
            'Cover Image Link',
            'Author Name'
        ]);

        foreach ($posts as $post) {
            $link = env('APP_URL') . '/blog/' . $post->slug;
            $title = $post->title;
            
            $metaTags = $post->keywords ?? '';
            if (is_array($metaTags)) $metaTags = implode(',', $metaTags);
            
            $excerpt = $post->excerpt ? strip_tags($post->excerpt) : Str::limit(strip_tags($post->content), 150);
            $metaDescription = $post->metaDescription ?? $excerpt;
            
            $ogTitle = $post->seoTitle ?? $post->title;
            $ogDescription = $post->metaDescription ?? $metaDescription;
            
            $twitterTag = $post->twitterCard ?? 'summary_large_image';
            $twitterDescription = $post->twitterDescription ?? $ogDescription;
            
            $coverImage = '';
            if ($post->coverImage) {
                $coverImage = str_starts_with($post->coverImage, 'http') ? $post->coverImage : env('APP_URL') . '/' . ltrim($post->coverImage, '/');
            }
            
            $authorName = $post->author ?? 'Coachingsinsikar';
            
            // In case author_id relation is loaded instead of string
            if (!$post->author && $post->author_id) {
                $author = $post->author()->first();
                if ($author) {
                    $authorName = $author->name ?? $author->username ?? 'Coachingsinsikar';
                }
            }

            fputcsv($csvFile, [
                $link,
                $title,
                $metaTags,
                $metaDescription,
                $ogTitle,
                $ogDescription,
                $twitterTag,
                $twitterDescription,
                $coverImage,
                $authorName
            ]);
        }

        fclose($csvFile);

        $this->info("Export completed successfully! File saved at: " . $filePath);
        $this->info("You can now open this file in Google Sheets by going to File -> Import -> Upload.");
    }
}
