<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

use App\Models\Post;
use App\Models\Author;
use App\Models\Category;
use App\Models\Story;

class AdminApiController extends Controller
{

    // --- Posts ---
    public function getPosts()
    {
        return response()->json(Post::orderBy('created_at', 'desc')->get());
    }

    public function deletePost(Request $request)
    {
        $id = $request->query('id');
        Post::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Authors ---
    public function getAuthors()
    {
        return response()->json(Author::orderBy('created_at', 'desc')->get());
    }

    public function storeAuthor(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'slug' => 'nullable|string',
            'bio' => 'nullable|string',
            'image' => 'nullable|string',
            'jobTitle' => 'nullable|string',
            'experienceYears' => 'nullable|numeric',
            'socials' => 'nullable|array'
        ]);
        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        if (isset($data['bio'])) {
            $data['bio'] = clean($data['bio']);
        }
        $author = Author::updateOrCreate(['id' => $data['id']], $data);

        // Sync author updates to Posts and Stories
        if ($author->name) {
            $updateData = [];
            if (isset($data['image'])) $updateData['authorImage'] = $data['image'];
            if (isset($data['bio'])) $updateData['authorBio'] = $data['bio'];
            if (isset($data['socials'])) $updateData['authorSocials'] = is_array($data['socials']) ? json_encode($data['socials']) : $data['socials'];

            if (!empty($updateData)) {
                $authorNames = [$author->name];
                if (strtolower($author->name) === 'prashant') {
                    $authorNames[] = 'Prasant';
                    $authorNames[] = 'prasant';
                }
                
                \App\Models\Post::whereIn('author', $authorNames)->update($updateData);
                \App\Models\Story::whereIn('author', $authorNames)->update($updateData);
            }
        }

        return response()->json(['success' => true]);
    }

    public function deleteAuthor(Request $request)
    {
        $id = $request->query('id');
        Author::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Categories ---
    public function getCategories()
    {
        return response()->json(Category::orderBy('created_at', 'desc')->get());
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'slug' => 'nullable|string',
            'description' => 'nullable|string',
            'color' => 'nullable|string',
            'icon' => 'nullable|string'
        ]);
        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        if (isset($data['description'])) {
            $data['description'] = clean($data['description']);
        }
        Category::updateOrCreate(['id' => $data['id']], $data);
        return response()->json(['success' => true]);
    }

    public function deleteCategory(Request $request)
    {
        $id = $request->query('id');
        Category::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Stories ---
    public function getStories()
    {
        return response()->json(Story::orderBy('created_at', 'desc')->get());
    }

    public function storeStory(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string',
            'slug' => 'nullable|string',
            'description' => 'nullable|string',
            'posterImage' => 'nullable|string',
            'squarePoster' => 'nullable|string',
            'landscapePoster' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'author' => 'nullable|string',
            'authorBio' => 'nullable|string',
            'authorImage' => 'nullable|string',
            'authorSocials' => 'nullable|array',
            'date' => 'nullable|string',
            'slides' => 'nullable|array',
            'articleLink' => 'nullable|string',
            'published' => 'nullable|boolean',
            'isSponsored' => 'nullable|boolean',
            'isNoIndex' => 'nullable|boolean',
            'seoTitle' => 'nullable|string',
            'ogTitle' => 'nullable|string',
            'ogDescription' => 'nullable|string',
            'ogImage' => 'nullable|string',
        ]);

        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        if (isset($data['date'])) {
            $data['date'] = \Carbon\Carbon::parse($data['date']);
        }
        if (isset($data['description'])) {
            $data['description'] = clean($data['description']);
        }
        
        $pages = $data['slides'] ?? [];
        $data['pages'] = $pages;
        unset($data['slides']);
        
        $data['seo_meta'] = [
            'seo_title' => $data['seoTitle'] ?? null,
            'og_title' => $data['ogTitle'] ?? null,
            'og_description' => $data['ogDescription'] ?? null,
            'og_image' => $data['ogImage'] ?? null,
        ];
        unset($data['seoTitle'], $data['ogTitle'], $data['ogDescription'], $data['ogImage']);

        Story::updateOrCreate(['id' => $data['id']], $data);
        return response()->json(['success' => true]);
    }

    public function deleteStory(Request $request)
    {
        $id = $request->query('id');
        Story::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Media ---
    public function getMedia()
    {
        $uploadPath = public_path('uploads');
        if (!File::exists($uploadPath)) {
            return response()->json([]);
        }

        $files = File::files($uploadPath);
        $media = [];
        
        foreach ($files as $file) {
            $url = asset('uploads/' . $file->getFilename());
            $media[] = [
                'id' => $file->getFilename(),
                'name' => $file->getFilename(),
                'url' => $url,
                'sizeBytes' => $file->getSize(),
                'createdAt' => date('c', $file->getMTime()),
                'usedIn' => []
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
            // 1. Strict Validation
            $request->validate([
                'file' => 'required|file|mimes:jpeg,png,jpg,webp,gif,bmp|max:20480',
            ]);

            $file = $request->file('file');
            if (!$file) {
                return response()->json(['success' => false, 'message' => 'Upload failed: No file found.'], 422);
            }

            // 2. Decode/verify actual image
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->decodePath($file->getRealPath());

            // 3. Generate UUID filename
            $filename = \Illuminate\Support\Str::uuid()->toString() . '.webp';

            if ($request->has('oldFilename')) {
                // Prevent path traversal
                $oldFile = basename($request->input('oldFilename'));
                if (!empty($oldFile)) {
                    $filename = $oldFile;
                }
            }

            // 4. Image Processing
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

            // 5. Save output exclusively
            $encoded->save($uploadDir . '/' . $filename);

            $url = asset('uploads/' . $filename);
            return response()->json(['success' => true, 'url' => $url]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation error: ' . collect($e->errors())->flatten()->implode(', ')], 422);
        } catch (\Throwable $e) {
            // 6. Handle failure securely
            try {
                \Illuminate\Support\Facades\Log::error('Image processing failed: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
            } catch (\Throwable $logError) {
                // Ignore log errors
            }
            return response()->json(['success' => false, 'message' => 'Upload failed: ' . $e->getMessage()], 422);
        }
    }

    public function deleteMedia(Request $request)
    {
        $filename = $request->query('filename');
        if ($filename) {
            $path = public_path('uploads/' . $filename);
            if (File::exists($path)) {
                File::delete($path);
            }
        }
        return response()->json(['success' => true]);
    }

    // Alias used by /api/admin/upload route
    public function uploadMedia(Request $request)
    {
        return $this->storeMedia($request);
    }

    // --- Sliders ---
    public function getSliders()
    {
        return response()->json(\App\Models\Slider::orderBy('order', 'asc')->get());
    }

    public function storeSlider(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string',
            'subtitle' => 'nullable|string',
            'image_url' => 'required|string',
            'link_url' => 'nullable|string',
            'order' => 'integer'
        ]);
        if (empty($data['id'])) {
            $data['id'] = \Illuminate\Support\Str::uuid()->toString();
        }
        
        \App\Models\Slider::updateOrCreate(['id' => $data['id']], $data);
        \Illuminate\Support\Facades\Cache::forget('homepage_data');
        return response()->json(['success' => true]);
    }

    public function deleteSlider(Request $request)
    {
        if ($request->has('id')) {
            \App\Models\Slider::where('id', $request->input('id'))->delete();
            \Illuminate\Support\Facades\Cache::forget('homepage_data');
        }
        return response()->json(['success' => true]);
    }

    // --- Businesses ---
    public function getBusinesses()
    {
        return response()->json(\App\Models\Business::orderBy('created_at', 'desc')->get());
    }

    public function deleteBusiness(Request $request)
    {
        if ($request->has('id')) {
            \App\Models\Business::where('id', $request->input('id'))->delete();
        }
        return response()->json(['success' => true]);
    }
}
