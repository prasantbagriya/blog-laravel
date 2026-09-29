<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class OptimizeImagesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:optimize';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compress all existing images in public/uploads to WebP format';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        set_time_limit(0);
        ini_set('memory_limit', '1024M');
        
        $uploadPath = public_path('uploads');
        if (!File::exists($uploadPath)) {
            $this->error("Uploads directory not found.");
            return;
        }

        $files = File::files($uploadPath);
        $manager = new ImageManager(new Driver());
        $count = 0;
        $savedBytes = 0;

        foreach ($files as $file) {
            $extension = strtolower($file->getExtension());
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'bmp'])) {
                try {
                    $originalPath = $file->getPathname();
                    if (!$originalPath) continue;
                    
                    $oldSize = @filesize($originalPath) ?: 0;
                    $filenameWithoutExt = pathinfo($originalPath, PATHINFO_FILENAME);
                    $newPath = $uploadPath . '/' . $filenameWithoutExt . '.webp';

                    $this->info("Optimizing: " . $file->getFilename());
                    $image = $manager->decodePath($originalPath);
                    if ($image->width() > 1920) {
                        $image->scaleDown(width: 1920);
                    }
                    $encoded = $image->encodeUsingFileExtension('webp', 80);
                    file_put_contents($newPath, (string) $encoded);
                    
                    $newSize = filesize($newPath);
                    $savedBytes += ($oldSize - $newSize);
                    
                    // Update Database references
                    $oldUrl = asset('uploads/' . $file->getFilename());
                    $newUrl = asset('uploads/' . basename($newPath));

                    if ($oldUrl !== $newUrl) {
                        \App\Models\Post::where('coverImage', $oldUrl)->update(['coverImage' => $newUrl]);
                        \App\Models\Post::where('authorImage', $oldUrl)->update(['authorImage' => $newUrl]);
                        \App\Models\Story::where('posterImage', $oldUrl)->update(['posterImage' => $newUrl]);
                        \App\Models\Slider::where('image_url', $oldUrl)->update(['image_url' => $newUrl]);
                        \App\Models\Slider::where('mobile_image_url', $oldUrl)->update(['mobile_image_url' => $newUrl]);
                    }

                    // delete original file if successfully converted and it wasn't a webp already
                    if ($originalPath !== $newPath) {
                        File::delete($originalPath);
                    }
                    $count++;
                    $this->info(" -> Saved " . round(($oldSize - $newSize) / 1024, 2) . " KB");

                } catch (\Exception $e) {
                    $this->error("Failed to process " . $file->getFilename() . ": " . $e->getMessage());
                }
            }
        }

        $this->info("Optimization complete! Processed $count images.");
        $this->info("Total space saved: " . round($savedBytes / 1024 / 1024, 2) . " MB.");
    }
}
