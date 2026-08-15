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
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        Author::updateOrCreate(['id' => $data['id']], $data);
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
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
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
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        if (isset($data['date'])) {
            $data['date'] = \Carbon\Carbon::parse($data['date']);
        }
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
        $request->validate([
            'file' => 'required|file',
        ]);

        $file = $request->file('file');
        $filename = $file->getClientOriginalName();
        
        // Handle image processing with Intervention Image
        $extension = strtolower($file->getClientOriginalExtension());
        $isImage = in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']);

        if ($request->has('oldFilename')) {
            $filename = $request->input('oldFilename'); // Replace existing file
        } else {
            // Force .webp extension for images
            if ($isImage) {
                $filename = pathinfo($filename, PATHINFO_FILENAME) . '.webp';
            }
            if (File::exists(public_path('uploads/' . $filename))) {
                $filename = pathinfo($filename, PATHINFO_FILENAME) . '_' . time() . ($isImage ? '.webp' : '.' . $extension);
            }
        }

        if ($isImage) {
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($file->getRealPath());
            
            // Scale down if width exceeds 1200
            if ($image->width() > 1200) {
                $image->scaleDown(width: 1200);
            }
            
            $quality = 80;
            $encoded = $image->toWebp($quality);
            
            // Iteratively reduce quality if file is > 100KB
            while (strlen($encoded->toString()) > 102400 && $quality > 10) {
                $quality -= 10;
                $encoded = $image->toWebp($quality);
            }
            
            // Save as webp
            $encoded->save(public_path('uploads/' . $filename));
        } else {
            $file->move(public_path('uploads'), $filename);
        }
        
        $url = asset('uploads/' . $filename);
        return response()->json(['success' => true, 'url' => $url]);
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
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = \Illuminate\Support\Str::uuid()->toString();
        }
        
        \App\Models\Slider::updateOrCreate(['id' => $data['id']], $data);
        return response()->json(['success' => true]);
    }

    public function deleteSlider(Request $request)
    {
        if ($request->has('id')) {
            \App\Models\Slider::where('id', $request->input('id'))->delete();
        }
        return response()->json(['success' => true]);
    }
}
