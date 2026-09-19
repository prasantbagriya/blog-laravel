<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\Author;

class TaxonomyController extends Controller
{
    public function categoryIndex()
    {
        $categories = \App\Models\Category::all()->toArray();
        $title = "Categories | Coachinginsikar";
        $description = "Browse all Blog Categories and Institute Categories on CoachingsinSikar. Find articles and verified coaching institutes for JEE, NEET, CA, NDA, CLAT, and schools in Sikar by topic.";
        $keywords = "Coaching Sikar Categories, blog categories Sikar coaching, institute categories Sikar, verified coaching institutes Sikar, expert guidance coaching Sikar, topic-wise coaching guides Sikar";
        $og_title = "CoachingsinSikar Explore Categories";
        $og_description = "Discover insightful articles, verified coaching institutes, and expert guidance on JEE, NEET, CA, CLAT, and schools in Sikar, neatly organized into Blog Categories and Institute Categories.";
        $twitter_title = "Sikar Education Categories | Institutes, Blogs, & Guides";
        $twitter_description = "Access institute categories, blog topics, coaching guides, reviews, school information, and other education resources for Sikar.";
        
        $schemas = [[
            "@context" => "https://schema.org",
            "@type" => "CollectionPage",
            "name" => $title,
            "description" => $description,
            "url" => url('/category')
        ]];

        return Inertia::render('Category/Index', [
            'categories' => $categories,
            'meta' => [
                'title' => $title,
                'description' => $description,
                'keywords' => $keywords,
                'og_title' => $og_title,
                'og_description' => $og_description,
                'twitter_title' => $twitter_title,
                'twitter_description' => $twitter_description,
                'url' => url('/category'),
                'type' => 'website',
                'schemas' => $schemas
            ]
        ]);
    }

    public function categoryShow($slug)
    {
        // Simple matching for category (in the old code it was a string matching)
        $target = strtolower(str_replace('-', ' ', $slug));
        $categoryName = ucwords(str_replace('-', ' ', $slug));
        
        $posts = Post::where('published', true)
                     ->where('category', 'LIKE', '%' . $target . '%')
                     ->get()
                     ->toArray();

        $title = "{$categoryName} Archives | Coachinginsikar";
        $description = "Read all articles filed under {$categoryName}.";

        $schemas = [[
            "@context" => "https://schema.org",
            "@type" => "CollectionPage",
            "name" => $title,
            "description" => $description,
            "url" => url("/category/{$slug}")
        ]];

        return Inertia::render('Category/Show', [
            'categoryName' => $categoryName,
            'posts' => $posts,
            'meta' => [
                'title' => $title,
                'description' => $description,
                'url' => url("/category/{$slug}"),
                'type' => 'website',
                'schemas' => $schemas
            ]
        ]);
    }

    public function authorIndex()
    {
        $authors = Author::all()->toArray();
        $title = "Authors | Coachinginsikar";
        $description = "Meet the authors contributing to Coachinginsikar.";
        
        $schemas = [[
            "@context" => "https://schema.org",
            "@type" => "CollectionPage",
            "name" => $title,
            "description" => $description,
            "url" => url('/author')
        ]];

        return Inertia::render('Author/Index', [
            'authors' => $authors,
            'meta' => [
                'title' => $title,
                'description' => $description,
                'url' => url('/author'),
                'type' => 'website',
                'schemas' => $schemas
            ]
        ]);
    }

    public function authorShow($slug)
    {
        $author = Author::where('slug', $slug)->first();
        
        if (!$author) {
            abort(404);
        }

        $posts = Post::where('published', true)
                     ->where('author', $author->name)
                     ->get()
                     ->toArray();
                     
        $cleanBio = $author->bio ? substr(strip_tags($author->bio), 0, 160) : "Articles by {$author->name}";
        $title = "{$author->name} - Author at Coachinginsikar";
        $description = $cleanBio;

        $sameAsLinks = [];
        if (!empty($author->socials) && is_array($author->socials)) {
            if (!empty($author->socials['twitter'])) $sameAsLinks[] = $author->socials['twitter'];
            if (!empty($author->socials['linkedin'])) $sameAsLinks[] = $author->socials['linkedin'];
            if (!empty($author->socials['website'])) $sameAsLinks[] = $author->socials['website'];
        }

        $personSchema = [
            "@type" => "Person",
            "name" => $author->name,
            "url" => url("/author/{$slug}")
        ];

        if (!empty($author->jobTitle)) $personSchema["jobTitle"] = $author->jobTitle;
        if (!empty($author->image)) $personSchema["image"] = $author->image;
        if (!empty($cleanBio)) $personSchema["description"] = $cleanBio;
        if (!empty($sameAsLinks)) $personSchema["sameAs"] = $sameAsLinks;

        if (!empty($author->alumniOf) && is_array($author->alumniOf)) {
            $personSchema["alumniOf"] = array_map(function($alumni) {
                return [
                    "@type" => "EducationalOrganization",
                    "name" => $alumni['name'] ?? '',
                    "sameAs" => $alumni['sameAs'] ?? ''
                ];
            }, $author->alumniOf);
        }

        if (!empty($author->knowsAbout) && is_array($author->knowsAbout)) {
            $personSchema["knowsAbout"] = array_map(function($topic) {
                return [
                    "@type" => "Thing",
                    "name" => $topic['name'] ?? '',
                    "sameAs" => $topic['sameAs'] ?? ''
                ];
            }, $author->knowsAbout);
        }

        $schemas = [[
            "@context" => "https://schema.org",
            "@type" => "CollectionPage",
            "name" => $title,
            "description" => $description,
            "url" => url("/author/{$slug}")
        ], [
            "@context" => "https://schema.org",
            "@type" => "ProfilePage",
            "mainEntity" => $personSchema
        ]];

        return Inertia::render('Author/Show', [
            'author' => $author->toArray(),
            'posts' => $posts,
            'meta' => [
                'title' => $title,
                'description' => $description,
                'url' => url("/author/{$slug}"),
                'type' => 'profile',
                'schemas' => $schemas
            ]
        ]);
    }
}
