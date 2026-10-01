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

        $files = \Illuminate\Support\Facades\Storage::disk('uploads')->allFiles('');
        $media = [];
        
        $usedMedia = [];
        if (class_exists(\App\Models\Business::class)) {
            foreach (\App\Models\Business::select('id', 'name', 'logo', 'cover_image')->get() as $biz) {
                if ($biz->logo) $usedMedia[$biz->logo][] = ['type' => 'Business', 'title' => $biz->name, 'editUrl' => '/admin/businesses'];
                if ($biz->cover_image) $usedMedia[$biz->cover_image][] = ['type' => 'Business Cover', 'title' => $biz->name, 'editUrl' => '/admin/businesses'];
            }
        }
        if (class_exists(\App\Models\Post::class)) {
            foreach (\App\Models\Post::select('id', 'title', 'media_urls', 'coverImage')->get() as $post) {
                if ($post->coverImage) $usedMedia[$post->coverImage][] = ['type' => 'Post Cover', 'title' => $post->title, 'editUrl' => '/admin'];
                $urls = is_string($post->media_urls) ? json_decode($post->media_urls, true) : $post->media_urls;
                if (is_array($urls)) {
                    foreach ($urls as $u) $usedMedia[$u][] = ['type' => 'Post', 'title' => $post->title, 'editUrl' => '/admin'];
                }
            }
        }
        if (class_exists(\App\Models\Story::class)) {
            foreach (\App\Models\Story::select('id', 'title', 'posterImage')->get() as $story) {
                if ($story->posterImage) $usedMedia[$story->posterImage][] = ['type' => 'Story', 'title' => $story->title, 'editUrl' => '/admin/stories'];
            }
        }
        if (class_exists(\App\Models\User::class)) {
            foreach (\App\Models\User::select('id', 'name', 'profile_picture', 'banner_image')->get() as $u) {
                if ($u->profile_picture) $usedMedia[$u->profile_picture][] = ['type' => 'Author Profile', 'title' => $u->name, 'editUrl' => '/profile'];
                if ($u->banner_image) $usedMedia[$u->banner_image][] = ['type' => 'Author Banner', 'title' => $u->name, 'editUrl' => '/profile'];
            }
        }

        foreach ($files as $relativePath) {
            if (str_starts_with($relativePath, 'variants/')) continue;
            
            $fullPath = public_path('uploads/' . $relativePath);
            if (!file_exists($fullPath)) continue;
            
            $url = asset('uploads/' . $relativePath) . '?v=' . filemtime($fullPath);
            
            $usage = [];
            foreach ($usedMedia as $usedUrl => $uses) {
                if (str_contains((string)$usedUrl, $relativePath)) {
                    $usage = array_merge($usage, $uses);
                }
            }

            $media[] = [
                'name' => $relativePath,
                'url' => $url,
                'createdAt' => date('Y-m-d H:i:s', filemtime($fullPath)),
                'sizeBytes' => filesize($fullPath),
                'usedIn' => $usage
            ];
        }

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
        $filename = $request->query('filename');
        if ($filename) {
            // Prevent directory traversal
            if (str_contains($filename, '..')) {
                return response()->json(['error' => 'Invalid path'], 400);
            }
            $path = public_path('uploads/' . ltrim($filename, '/'));
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
