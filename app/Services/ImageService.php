<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageService
{
    protected ImageManager $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Standardized Image Optimization Algorithm.
     * Converts to WebP, auto-scales down to maxWidth, applies quality compression,
     * stores in public/uploads disk, and pre-generates key responsive variants.
     */
    public function optimizeAndStore(
        UploadedFile|string $file,
        ?string $subDirectory = null,
        ?string $customFilename = null,
        int $maxWidth = 1200,
        int $quality = 82
    ): array {
        // Read image via Intervention Image v3
        if ($file instanceof UploadedFile) {
            $image = $this->manager->decodePath($file->getRealPath());
        } elseif (is_string($file) && str_starts_with($file, 'data:image')) {
            // Base64 data URI
            $data = substr($file, strpos($file, ',') + 1);
            $decoded = base64_decode($data);
            if ($decoded === false) {
                throw new \InvalidArgumentException('Invalid base64 image data');
            }
            $image = $this->manager->decodeBinary($decoded);
        } elseif (is_string($file) && file_exists($file)) {
            $image = $this->manager->decodePath($file);
        } else {
            throw new \InvalidArgumentException('Unsupported file input for ImageService');
        }

        $origWidth = $image->width();

        // 1. Scale down if wider than maxWidth (preserving aspect ratio)
        if ($origWidth > $maxWidth) {
            $image->scaleDown(width: $maxWidth);
        }

        // 2. Generate clean UUID webp filename
        $filename = $customFilename ?: (Str::uuid()->toString() . '.webp');
        if (!str_ends_with($filename, '.webp')) {
            $filename = pathinfo($filename, PATHINFO_FILENAME) . '.webp';
        }

        $relativePath = $subDirectory ? (rtrim($subDirectory, '/') . '/' . $filename) : $filename;

        // 3. Encode to WebP
        $encoded = $image->encodeUsingFileExtension('webp', $quality);

        // 4. Store in uploads disk
        Storage::disk('uploads')->put($relativePath, (string) $encoded);

        // 5. Pre-generate common responsive variants (384, 640) for instant CWV
        $this->generateResponsiveVariants($relativePath, [384, 640]);

        $relativeUrl = '/uploads/' . $relativePath;
        $appUrl = rtrim(config('app.url', 'http://localhost'), '/');
        $fullUrl = $appUrl . $relativeUrl;

        return [
            'success' => true,
            'filename' => $filename,
            'relative_path' => $relativePath,
            'url' => $relativeUrl,
            'full_url' => $fullUrl,
            'width' => $image->width(),
            'height' => $image->height(),
            'size' => strlen((string) $encoded),
        ];
    }

    /**
     * Generate responsive WebP variants in public/uploads/variants/{width}/
     */
    public function generateResponsiveVariants(string $relativePath, array $widths = [384, 640]): void
    {
        try {
            $uploadsDir = public_path('uploads');
            $sourcePath = $uploadsDir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativePath);

            if (!File::exists($sourcePath)) {
                return;
            }

            $version = sha1($relativePath . '|' . File::lastModified($sourcePath));

            foreach ($widths as $width) {
                $variantDir = $uploadsDir . DIRECTORY_SEPARATOR . 'variants' . DIRECTORY_SEPARATOR . $width;
                $variantPath = $variantDir . DIRECTORY_SEPARATOR . $version . '.webp';

                if (!File::exists($variantPath)) {
                    File::ensureDirectoryExists($variantDir);
                    $varImg = $this->manager->decodePath($sourcePath);
                    $varImg->scaleDown(width: $width);
                    File::put($variantPath, (string) $varImg->encodeUsingFileExtension('webp', 78));
                }
            }
        } catch (\Throwable $e) {
            Log::warning('ImageService variant generation skipped: ' . $e->getMessage());
        }
    }

    /**
     * Process all <img> tags inside HTML content:
     * - Converts base64 data URIs into real .webp upload files
     */
    public function processContentImages(string $html): string
    {
        if (empty($html) || !str_contains($html, '<img')) {
            return $html;
        }

        // Process base64 embedded images
        return preg_replace_callback('/<img[^>]+src=["\'](data:image\/[^;]+;base64,[^"\']+)["\'][^>]*>/i', function ($match) {
            $fullTag = $match[0];
            $base64Data = $match[1];

            try {
                $result = $this->optimizeAndStore($base64Data, null, null, 1200, 82);
                if (!empty($result['url'])) {
                    return str_replace($base64Data, $result['url'], $fullTag);
                }
            } catch (\Throwable $e) {
                Log::error('Failed to convert base64 image in content: ' . $e->getMessage());
            }

            return $fullTag;
        }, $html);
    }

    /**
     * Extract all image URLs from an HTML string
     */
    public function extractImageUrls(string $html): array
    {
        if (empty($html) || !str_contains($html, '<img')) {
            return [];
        }

        preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches);
        return array_unique($matches[1] ?? []);
    }
}
