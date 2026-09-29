<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Category;
use App\Models\Community;
use App\Models\Author;
use App\Models\Story;

class SitemapController extends Controller
{
    public function index()
    {
        return response()->view('sitemap.index')->header('Content-Type', 'text/xml');
    }

    public function pages()
    {
        return response()->view('sitemap.pages')->header('Content-Type', 'text/xml');
    }

    public function blogPosts()
    {
        $posts = Post::where('published', true)->where('isNoIndex', false)->whereNull('community_id')->orderBy('updated_at', 'desc')->get();
        return response()->view('sitemap.posts', ['posts' => $posts])->header('Content-Type', 'text/xml');
    }

    public function communityPosts()
    {
        $posts = Post::where('published', true)->where('isNoIndex', false)->whereNotNull('community_id')->with('community')->orderBy('updated_at', 'desc')->get();
        return response()->view('sitemap.community_posts', ['posts' => $posts])->header('Content-Type', 'text/xml');
    }

    public function categories()
    {
        $categories = Category::orderBy('updated_at', 'desc')->get();
        return response()->view('sitemap.categories', ['categories' => $categories])->header('Content-Type', 'text/xml');
    }

    public function communities()
    {
        $communities = Community::orderBy('updated_at', 'desc')->get();
        return response()->view('sitemap.communities', ['communities' => $communities])->header('Content-Type', 'text/xml');
    }

    public function authors()
    {
        $authors = Author::orderBy('updated_at', 'desc')->get();
        return response()->view('sitemap.authors', ['authors' => $authors])->header('Content-Type', 'text/xml');
    }

    public function stories()
    {
        $stories = Story::where('published', true)->orderBy('updated_at', 'desc')->get();
        return response()->view('sitemap.stories', ['stories' => $stories])->header('Content-Type', 'text/xml');
    }
}
