<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ResponsiveImageController extends Controller
{
    /**
     * Generate a cacheable WebP derivative for images that are displayed much
     * smaller than their original upload. Source files never leave /uploads.
     */
    public function show(int $width, string $path): BinaryFileResponse
    {
        abort_unless(in_array($width, [64, 192, 384, 672], true), 404);

        $relativePath = ltrim(str_replace('\\', '/', $path), '/');
        abort_if(Str::contains($relativePath, '..'), 404);
        abort_unless(
            Str::startsWith($relativePath, 'businesses/logos/') || in_array($relativePath, ['background.webp', 'logo.webp'], true),
            404,
        );

        $uploadsDirectory = realpath(public_path('uploads'));
        abort_unless($uploadsDirectory, 404);

        $sourcePath = realpath($uploadsDirectory . DIRECTORY_SEPARATOR . $relativePath);
        $uploadsPrefix = rtrim($uploadsDirectory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

        abort_unless($sourcePath && Str::startsWith($sourcePath, $uploadsPrefix), 404);
        abort_unless(Str::startsWith((string) File::mimeType($sourcePath), 'image/'), 404);

        // The source modification time selects a new on-disk derivative whenever an
        // upload is replaced, without retaining an outdated generated file.
        $version = sha1($relativePath . '|' . File::lastModified($sourcePath));
        $variantDirectory = $uploadsDirectory . DIRECTORY_SEPARATOR . 'variants' . DIRECTORY_SEPARATOR . $width;
        $variantPath = $variantDirectory . DIRECTORY_SEPARATOR . $version . '.webp';

        if (! File::exists($variantPath)) {
            File::ensureDirectoryExists($variantDirectory);

            $image = (new ImageManager(new Driver()))->decodePath($sourcePath);
            $image->scaleDown(width: $width);
            File::put($variantPath, (string) $image->encodeUsingFileExtension('webp', 78));
        }

        return response()->file($variantPath, [
            'Content-Type' => 'image/webp',
            'Cache-Control' => 'public, max-age=604800',
        ]);
    }
}
