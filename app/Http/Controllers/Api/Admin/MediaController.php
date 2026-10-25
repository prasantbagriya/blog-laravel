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
        $imageService = app(\App\Services\ImageService::class);
        if (class_exists(\App\Models\Business::class)) {
            foreach (\App\Models\Business::select('id', 'name', 'logo', 'cover_image')->get() as $biz) {
                if ($biz->logo) $usedMedia[$biz->logo][] = ['type' => 'Business Logo', 'title' => $biz->name, 'author' => 'Business Scraper / Owner', 'editUrl' => '/admin/businesses'];
                if ($biz->cover_image) $usedMedia[$biz->cover_image][] = ['type' => 'Business Cover', 'title' => $biz->name, 'author' => 'Business Scraper / Owner', 'editUrl' => '/admin/businesses'];
            }
        }
        if (class_exists(\App\Models\Post::class)) {
            foreach (\App\Models\Post::select('id', 'title', 'content', 'media_urls', 'coverImage', 'author', 'url_format', 'slug', 'category')->get() as $post) {
                $authorName = is_array($post->author) ? ($post->author['name'] ?? 'Admin') : ($post->author ?: 'Admin');
                $postUrl = $post->url_path;
                if ($post->coverImage) $usedMedia[$post->coverImage][] = ['type' => 'Post Cover', 'title' => $post->title, 'author' => $authorName, 'publicUrl' => $postUrl, 'editUrl' => '/admin'];
                $urls = is_string($post->media_urls) ? json_decode($post->media_urls, true) : $post->media_urls;
                if (is_array($urls)) {
                    foreach ($urls as $u) $usedMedia[$u][] = ['type' => 'Post Media', 'title' => $post->title, 'author' => $authorName, 'publicUrl' => $postUrl, 'editUrl' => '/admin'];
                }
                if (!empty($post->content)) {
                    $contentImages = $imageService->extractImageUrls($post->content);
                    foreach ($contentImages as $cUrl) {
                        $usedMedia[$cUrl][] = ['type' => 'Post Content', 'title' => $post->title, 'author' => $authorName, 'publicUrl' => $postUrl, 'editUrl' => '/admin'];
                    }
                }
            }
        }
        if (class_exists(\App\Models\Category::class)) {
            foreach (\App\Models\Category::select('id', 'name', 'image', 'og_image', 'slug')->get() as $cat) {
                if ($cat->image) $usedMedia[$cat->image][] = ['type' => 'Category Image', 'title' => $cat->name, 'author' => 'Category Manager', 'publicUrl' => '/category/' . $cat->slug, 'editUrl' => '/admin/categories'];
                if ($cat->og_image) $usedMedia[$cat->og_image][] = ['type' => 'Category OG Image', 'title' => $cat->name, 'author' => 'Category Manager', 'publicUrl' => '/category/' . $cat->slug, 'editUrl' => '/admin/categories'];
            }
        }
        if (class_exists(\App\Models\Slider::class)) {
            foreach (\App\Models\Slider::select('id', 'title', 'image_url', 'mobile_image_url')->get() as $slide) {
                $slideTitle = $slide->title ?: ('Slide #' . $slide->id);
                if ($slide->image_url) $usedMedia[$slide->image_url][] = ['type' => 'Slider Desktop', 'title' => $slideTitle, 'author' => 'Slider Manager', 'editUrl' => '/admin/settings/slider'];
                if ($slide->mobile_image_url) $usedMedia[$slide->mobile_image_url][] = ['type' => 'Slider Mobile', 'title' => $slideTitle, 'author' => 'Slider Manager', 'editUrl' => '/admin/settings/slider'];
            }
        }
        if (class_exists(\App\Models\Story::class)) {
            foreach (\App\Models\Story::select('id', 'title', 'posterImage', 'author', 'slug')->get() as $story) {
                if ($story->posterImage) $usedMedia[$story->posterImage][] = ['type' => 'Web Story', 'title' => $story->title, 'author' => $story->author ?: 'Story Creator', 'publicUrl' => '/stories/' . $story->slug, 'editUrl' => '/admin/stories'];
            }
        }
        if (class_exists(\App\Models\User::class)) {
            foreach (\App\Models\User::select('id', 'name', 'profile_picture', 'banner_image')->get() as $u) {
                if ($u->profile_picture) $usedMedia[$u->profile_picture][] = ['type' => 'Author Profile', 'title' => $u->name, 'author' => $u->name, 'editUrl' => '/profile'];
                if ($u->banner_image) $usedMedia[$u->banner_image][] = ['type' => 'Author Banner', 'title' => $u->name, 'author' => $u->name, 'editUrl' => '/profile'];
            }
        }

        foreach ($files as $relativePath) {
            if (str_starts_with($relativePath, 'variants/')) continue;
            
            $fullPath = public_path('uploads/' . $relativePath);
            if (!file_exists($fullPath)) continue;
            
            $url = asset('uploads/' . $relativePath) . '?v=' . filemtime($fullPath);
            $sizeBytes = filesize($fullPath);
            $isCorrupted = ($sizeBytes === 0);
            
            $usage = [];
            foreach ($usedMedia as $usedUrl => $uses) {
                if (str_contains((string)$usedUrl, $relativePath)) {
                    $usage = array_merge($usage, $uses);
                }
            }

            // Determine creator
            $creator = null;
            if (!empty($usage)) {
                $authors = array_filter(array_unique(array_column($usage, 'author')));
                if (!empty($authors)) {
                    $creator = implode(', ', $authors);
                }
            }
            if (!$creator) {
                if (str_starts_with($relativePath, 'businesses/logos/')) {
                    $creator = 'AI Scraper (Institute Logo)';
                } elseif (str_starts_with($relativePath, 'businesses/covers/')) {
                    $creator = 'AI Scraper (Campus Banner)';
                } elseif (str_starts_with($relativePath, 'categories/')) {
                    $creator = 'Category Manager';
                } else {
                    $creator = 'Admin / Content Author';
                }
            }

            $sourceModule = 'Direct Upload';
            if (str_starts_with($relativePath, 'businesses/')) {
                $sourceModule = 'Business Directory';
            } elseif (str_starts_with($relativePath, 'categories/')) {
                $sourceModule = 'Categories';
            } elseif (!empty($usage)) {
                $sourceModule = $usage[0]['type'] ?? 'Content Catalog';
            }

            $media[] = [
                'name' => $relativePath,
                'url' => $url,
                'createdAt' => date('Y-m-d H:i:s', filemtime($fullPath)),
                'sizeBytes' => $sizeBytes,
                'creator' => $creator,
                'sourceModule' => $sourceModule,
                'isCorrupted' => $isCorrupted,
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

            $oldFilename = null;
            if ($request->has('oldFilename')) {
                $oldFile = basename($request->input('oldFilename'));
                if (!empty($oldFile)) {
                    $oldFilename = $oldFile;
                }
            }

            $imageService = app(\App\Services\ImageService::class);
            $result = $imageService->optimizeAndStore(
                file: $file,
                subDirectory: null,
                customFilename: $oldFilename,
                maxWidth: 1200,
                quality: 82
            );

            return response()->json([
                'success' => true,
                'url' => $result['url'],
                'full_url' => $result['full_url'],
                'filename' => $result['filename']
            ]);
            
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

            $imageService = app(\App\Services\ImageService::class);
            $result = $imageService->optimizeAndStore(
                file: $file,
                subDirectory: 'categories',
                maxWidth: 1200,
                quality: 82
            );

            return response()->json([
                'success' => true,
                'url' => $result['url'],
                'full_url' => $result['full_url']
            ]);
            
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function uploadSocialImage(Request $request)
    {
        try {
            $request->validate([
                'file' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif|max:20480',
                'image' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif|max:20480',
            ]);

            $file = $request->file('file') ?: $request->file('image');
            if (!$file) {
                return response()->json(['success' => false, 'message' => 'No image file uploaded.'], 422);
            }

            // Ensure destination directory public/uploads/social exists
            $socialPath = public_path('uploads/social');
            if (!File::exists($socialPath)) {
                File::makeDirectory($socialPath, 0755, true);
            }

            $imageService = app(\App\Services\ImageService::class);
            $result = $imageService->optimizeAndStore(
                file: $file,
                subDirectory: 'social',
                maxWidth: 1600,
                quality: 86
            );

            return response()->json([
                'success' => true,
                'url' => $result['url'],
                'full_url' => $result['full_url'],
                'filename' => $result['filename']
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Upload failed: ' . $e->getMessage()], 422);
        }
    }
}
