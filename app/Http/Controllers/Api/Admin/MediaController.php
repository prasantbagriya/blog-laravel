<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class MediaController extends Controller
{
    public function getMedia()
    {
        $uploadPath = public_path('uploads');
        if (!File::exists($uploadPath)) {
            return response()->json([]);
        }

        $files = File::files($uploadPath);
        $media = [];

        foreach ($files as $file) {
            $url = asset('uploads/' . $file->getFilename()) . '?v=' . $file->getMTime();
            $media[] = [
                'name' => $file->getFilename(),
                'url' => $url,
                'createdAt' => date('Y-m-d H:i:s', $file->getMTime()),
                'size' => $file->getSize(),
            ];
        }

        // Sort media by newest first
        usort($media, function($a, $b) {
            return strtotime($b['createdAt']) - strtotime($a['createdAt']);
        });

        return response()->json($media);
    }

    public function storeMedia(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:jpeg,png,jpg,webp,gif,bmp|max:20480',
            ]);

            $file = $request->file('file');
            if (!$file) {
                return response()->json(['success' => false, 'message' => 'Upload failed: No file found.'], 422);
            }

            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->decodePath($file->getRealPath());

            $filename = \Illuminate\Support\Str::uuid()->toString() . '.webp';

            if ($request->has('oldFilename')) {
                $oldFile = basename($request->input('oldFilename'));
                if (!empty($oldFile)) {
                    $filename = $oldFile;
                }
            }

            if ($image->width() > 1200) {
                $image->scaleDown(width: 1200);
            }
            
            $quality = 80;
            $encoded = $image->encodeUsingFileExtension('webp', $quality);
            
            while (strlen((string) $encoded) > 102400 && $quality > 10) {
                $quality -= 10;
                $encoded = $image->encodeUsingFileExtension('webp', $quality);
            }
            
            $uploadDir = public_path('uploads');
            if (!\Illuminate\Support\Facades\File::exists($uploadDir)) {
                \Illuminate\Support\Facades\File::makeDirectory($uploadDir, 0755, true);
            }

            $encoded->save($uploadDir . '/' . $filename);

            $url = asset('uploads/' . $filename);
            return response()->json(['success' => true, 'url' => $url]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation error: ' . collect($e->errors())->flatten()->implode(', ')], 422);
        } catch (\Throwable $e) {
            try {
                \Illuminate\Support\Facades\Log::error('Image processing failed: ' . $e->getMessage());
            } catch (\Throwable $logError) {}
            return response()->json(['success' => false, 'message' => 'Upload failed: ' . $e->getMessage()], 422);
        }
    }

    public function deleteMedia(Request $request)
    {
        $filename = basename($request->query('filename'));
        if ($filename) {
            $path = public_path('uploads/' . $filename);
            if (File::exists($path)) {
                File::delete($path);
            }
        }
        return response()->json(['success' => true]);
    }

    public function uploadMedia(Request $request)
    {
        return $this->storeMedia($request);
    }

    public function uploadCategoryImage(Request $request)
    {
        try {
            $request->validate(['file' => 'required|file|mimes:jpeg,png,jpg,webp,gif,bmp|max:20480']);
            $file = $request->file('file');
            if (!$file) {
                return response()->json(['success' => false, 'message' => 'Upload failed.'], 422);
            }

            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->decodePath($file->getRealPath());

            $filename = \Illuminate\Support\Str::uuid()->toString() . '.webp';
            if ($image->width() > 1200) {
                $image->scaleDown(width: 1200);
            }
            $encoded = $image->encodeUsingFileExtension('webp', 80);
            
            $uploadDir = public_path('uploads/categories');
            if (!\Illuminate\Support\Facades\File::exists($uploadDir)) {
                \Illuminate\Support\Facades\File::makeDirectory($uploadDir, 0755, true);
            }

            $encoded->save($uploadDir . '/' . $filename);
            return response()->json(['success' => true, 'url' => asset('uploads/categories/' . $filename)]);
            
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}
