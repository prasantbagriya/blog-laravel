<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PostController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Posts/New');
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        if (isset($data['date'])) {
            $data['date'] = Carbon::parse($data['date']);
        }
        
        Post::updateOrCreate(['id' => $data['id']], $data);

        return response()->json(['success' => true]);
    }

    public function edit($id)
    {
        $post = Post::find($id);

        if (!$post) {
            abort(404, 'Post not found');
        }

        return Inertia::render('Admin/Posts/Edit', [
            'post' => $post
        ]);
    }
}
