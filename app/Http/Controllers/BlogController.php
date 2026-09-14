<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;

class BlogController extends Controller
{
    public function index()
    {
        $allPosts = \Illuminate\Support\Facades\Cache::remember('blog_all_posts', 3600, function () {
            return Post::where('published', true)->whereNull('community_id')->orderBy('date', 'desc')->get()->toArray();
        });

        // Dynamically replace .png/.jpg to .webp for any images from /uploads/ in the posts list
        // array_walk_recursive($allPosts, function(&$item) {
        //     if (is_string($item) && str_contains($item, 'uploads/')) {
        //         $item = preg_replace('/(uploads\/[^"\'\s>]+)\.(png|jpg|jpeg|bmp)/i', '$1.webp', $item);
        //     }
        // });

        return Inertia::render('Blog/Index', [
            'posts' => $allPosts,
            'meta' => [
                'title' => 'Blog | Coachinginsikar',
                'description' => 'Read the latest education news, exam updates, and coaching strategies from Sikar on the Coachinginsikar blog.',
                'url' => url('/blog'),
                'type' => 'website',
                'og_image' => url('/uploads/social-cover.webp'),
                'schemas' => [
                    [
                        "@context" => "https://schema.org",
                        "@type" => "CollectionPage",
                        "headline" => "All Posts | Coachinginsikar Blog",
                        "description" => "Read the latest education news, coaching updates, and exam results from Sikar.",
                        "url" => url('/blog')
                    ],
                    [
                        "@context" => "https://schema.org",
                        "@type" => "BreadcrumbList",
                        "itemListElement" => [
                            ["@type" => "ListItem", "position" => 1, "name" => "Home", "item" => url('/')],
                            ["@type" => "ListItem", "position" => 2, "name" => "Blog", "item" => url('/blog')]
                        ]
                    ],
                    [
                        "@context" => "https://schema.org",
                        "@type" => "WebSite",
                        "name" => "Coachinginsikar",
                        "url" => url('/'),
                        "potentialAction" => [
                            "@type" => "SearchAction",
                            "target" => [
                                "@type" => "EntryPoint",
                                "urlTemplate" => url('/search?q={search_term_string}')
                            ],
                            "query-input" => "required name=search_term_string"
                        ]
                    ]
                ]
            ]
        ]);
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->first();

        if (!$post) {
            abort(404);
        }

        // Dynamically serve optimized .webp images instead of .png/.jpg from uploads across all fields
        $postArray = $post->toArray();
        // array_walk_recursive($postArray, function(&$item, $key) {
        //     if (is_string($item) && str_contains($item, 'uploads/')) {
        //         $item = preg_replace('/(uploads\/[^"\'\s>]+)\.(png|jpg|jpeg|bmp)/i', '$1.webp', $item);
        //     }
        // });
        $post->forceFill($postArray);

        $plainTextExcerpt = $post->excerpt ? strip_tags($post->excerpt) : \Illuminate\Support\Str::limit(strip_tags($post->content), 160);
        
        $seoTitle = !empty($post->seoTitle) ? $post->seoTitle : $post->title . ' | Coachinginsikar';
        $seoDescription = !empty($post->metaDescription) ? $post->metaDescription : $plainTextExcerpt;

        // Schemas Generation (Server-Side for Pure Static HTML)
        $currentUrl = url()->current();
        $finalCanonicalUrl = !empty($post->canonicalUrl) ? $post->canonicalUrl : $currentUrl;
        
        $schemas = [];
        
        // 1. Breadcrumb Schema
        $breadcrumbItems = [
            ["@type" => "ListItem", "position" => 1, "name" => "Home", "item" => url('/')],
            ["@type" => "ListItem", "position" => 2, "name" => "Blog", "item" => url('/blog')]
        ];
        
        $position = 3;
        $categoryName = $post->category;

        if (!empty($categoryName)) {
            $catSlug = strtolower(str_replace(' ', '-', $categoryName));
            $breadcrumbItems[] = ["@type" => "ListItem", "position" => $position, "name" => $categoryName, "item" => url("/category/{$catSlug}")];
            $position++;
        }
        $breadcrumbItems[] = ["@type" => "ListItem", "position" => $position, "name" => $post->title, "item" => $finalCanonicalUrl];

        $schemas[] = [
            "@context" => "https://schema.org",
            "@type" => "BreadcrumbList",
            "itemListElement" => $breadcrumbItems
        ];
        // 2. Organization Schema
        $schemas[] = [
            "@context" => "https://schema.org",
            "@type" => "Organization",
            "name" => "Coachinginsikar",
            "url" => url('/'),
            "logo" => url('/uploads/logo.webp'),
            "foundingDate" => "2023",
            "contactPoint" => [
                "@type" => "ContactPoint",
                "contactType" => "customer support",
                "email" => "support@Coachinginsikar.com"
            ],
            "sameAs" => [
                "https://www.facebook.com/coachinginsikar",
                "https://x.com/coachinginsikar",
                "https://www.instagram.com/coachinginsikar",
                "https://www.youtube.com/@coachinginsikar",
                "https://www.linkedin.com/company/coachinginsikar",
                "https://www.pinterest.com/coachinginsikar",
                "https://www.tumblr.com/coachinginsikar"
            ]
        ];
        
        // 2b. WebSite Schema
        $schemas[] = [
            "@context" => "https://schema.org",
            "@type" => "WebSite",
            "name" => "Coachinginsikar",
            "url" => url('/'),
            "potentialAction" => [
                "@type" => "SearchAction",
                "target" => [
                    "@type" => "EntryPoint",
                    "urlTemplate" => url('/search?q={search_term_string}')
                ],
                "query-input" => "required name=search_term_string"
            ]
        ];

        // 3. BlogPosting Schema
        $authorName = $post->author ?? 'Coachinginsikar';
        if (strtolower($authorName) === 'prasant') {
            $authorName = 'Prashant';
        }
        $authorData = [
            "@type" => "Person",
            "name" => $authorName
        ];
        if (!empty($post->authorJobTitle)) {
            $authorData['jobTitle'] = $post->authorJobTitle;
        }
        if (!empty($post->authorBio)) {
            $authorData['description'] = $post->authorBio;
        }
        if (!empty($post->authorSocials) && is_array($post->authorSocials)) {
            $socials = array_values(array_filter($post->authorSocials));
            if (!empty($socials)) {
                $authorData['sameAs'] = $socials;
                // Use the first social link as the author's primary URL if applicable
                $authorData['url'] = $socials[0];
            }
        }
        if (!empty($post->authorImage)) {
            $authorData['image'] = $post->authorImage;
        }
        if (!empty($post->authorAwards) && is_array($post->authorAwards)) {
            $authorData['award'] = $post->authorAwards;
        }
        if (!empty($post->authorAlumniOf) && is_array($post->authorAlumniOf)) {
            $authorData['alumniOf'] = array_map(function($org) {
                return ["@type" => "Organization", "name" => $org['name'] ?? '', "sameAs" => $org['sameAs'] ?? ''];
            }, $post->authorAlumniOf);
        }
        if (!empty($post->authorKnowsAbout) && is_array($post->authorKnowsAbout)) {
            $authorData['knowsAbout'] = array_map(function($topic) {
                return ["@type" => "Thing", "name" => $topic['name'] ?? '', "sameAs" => $topic['sameAs'] ?? ''];
            }, $post->authorKnowsAbout);
        }

        $schemas[] = [
            "@context" => "https://schema.org",
            "@type" => "Person",
            "name" => $authorName,
            "url" => $authorData['url'] ?? null,
            "jobTitle" => $authorData['jobTitle'] ?? null,
            "description" => $authorData['description'] ?? null,
            "sameAs" => $authorData['sameAs'] ?? null,
            "image" => $authorData['image'] ?? null
        ];

        // 4. Article Schema Generation
        $wordCount = str_word_count(strip_tags($post->content));
        
        $articleSchema = [
            "@context" => "https://schema.org",
            "@type" => "Article",
            "inLanguage" => app()->getLocale() ?? "en",
            "isAccessibleForFree" => true,
            "wordCount" => $wordCount,
            "articleSection" => $post->category ?? 'Education',
            "keywords" => $post->keywords ?? (!empty($post->tags) ? implode(", ", $post->tags) : ''),
            "mainEntityOfPage" => [
                "@type" => "WebPage",
                "@id" => $finalCanonicalUrl
            ],
            "headline" => $seoTitle,
            "description" => $seoDescription,
            "image" => [
                "@type" => "ImageObject",
                "url" => !empty($post->coverImage) ? (str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage)) : url('/images/default-blog.jpg'),
                "width" => 1200,
                "height" => 630
            ],
            "author" => $authorData,
            "publisher" => [
                "@type" => "Organization",
                "name" => "Coachinginsikar",
                "logo" => [
                    "@type" => "ImageObject",
                    "url" => url('/uploads/logo.webp')
                ]
            ],
            "datePublished" => \Carbon\Carbon::parse($post->date)->setTimezone('Asia/Kolkata')->toIso8601String(),
            "dateModified" => \Carbon\Carbon::parse($post->updated_at ?? $post->date)->setTimezone('Asia/Kolkata')->toIso8601String(),
        ];

        if (!empty($post->semanticMentions) && is_array($post->semanticMentions)) {
            $articleSchema['mentions'] = array_map(function($mention) {
                return ["@type" => "Thing", "name" => $mention['name'] ?? '', "sameAs" => $mention['sameAs'] ?? ''];
            }, $post->semanticMentions);
        }

        $citations = [];
        if (!empty($post->references) && is_array($post->references)) {
            foreach ($post->references as $ref) {
                $citations[] = is_string($ref) ? $ref : ($ref['url'] ?? $ref['text'] ?? '');
            }
        }
        if (!empty($post->sources) && is_array($post->sources)) {
            foreach ($post->sources as $src) {
                $citations[] = is_string($src) ? $src : ($src['url'] ?? $src['name'] ?? '');
            }
        }
        $citations = array_filter($citations);
        if (!empty($citations)) {
            $articleSchema['citation'] = array_values($citations);
        }

        // 3a. Add Advanced NewsArticle Fields (Key Takeaways, Corrections, Expiry)
        if (!empty($post->keyTakeaways) && is_array($post->keyTakeaways)) {
            $takeaways = array_filter(array_map(function($item) {
                return is_array($item) ? ($item['text'] ?? $item['name'] ?? json_encode($item)) : (is_string($item) ? $item : json_encode($item));
            }, $post->keyTakeaways));
            $articleSchema["abstract"] = implode(" ", $takeaways);
        }
        if (!empty($post->corrections) && is_array($post->corrections)) {
            $correctionsList = array_filter(array_map(function($item) {
                return is_array($item) ? ($item['text'] ?? $item['name'] ?? json_encode($item)) : (is_string($item) ? $item : json_encode($item));
            }, $post->corrections));
            $articleSchema["correction"] = implode(" ", $correctionsList);
        }
        if (!empty($post->nextReviewDate)) {
            $articleSchema["expires"] = \Carbon\Carbon::parse($post->nextReviewDate)->toIso8601String();
        }

        $schemas[] = $articleSchema;

        // 5. FAQ Schema (if available)
        if (!empty($post->faqs) && is_array($post->faqs)) {
            $faqItems = [];
            foreach ($post->faqs as $faq) {
                if (isset($faq['question']) && isset($faq['answer'])) {
                    $faqItems[] = [
                        "@type" => "Question",
                        "name" => $faq['question'],
                        "acceptedAnswer" => [
                            "@type" => "Answer",
                            "text" => $faq['answer']
                        ]
                    ];
                }
            }
            if (count($faqItems) > 0) {
                $schemas[] = [
                    "@context" => "https://schema.org",
                    "@type" => "FAQPage",
                    "mainEntity" => $faqItems
                ];
            }
        }
        
        // 6. HowTo Schema (if available)
        $howToStepsData = $post->howToSteps ?? $post->howtosteps ?? $post->how_to_steps ?? null;
        \Log::info("RAW HOW TO DATA: ", ['data' => $howToStepsData]);
        if (is_string($howToStepsData)) {
            $howToStepsData = json_decode($howToStepsData, true);
        }
        // Fallback: If it's a string inside an array (double-encoded)
        if (is_array($howToStepsData) && count($howToStepsData) === 1 && is_string($howToStepsData[0])) {
            $howToStepsData = json_decode($howToStepsData[0], true);
        }

        if (!empty($howToStepsData) && is_array($howToStepsData)) {
            $howToItems = [];
            foreach ($howToStepsData as $index => $step) {
                // Handle objects if they were casted to objects instead of associative arrays
                if (is_object($step)) {
                    $step = (array) $step;
                }
                
                if (!empty($step['name']) && !empty($step['text'])) {
                    $howToItems[] = [
                        "@type" => "HowToStep",
                        "position" => $index + 1,
                        "name" => $step['name'],
                        "itemListElement" => [
                            [
                                "@type" => "HowToDirection",
                                "position" => 1,
                                "text" => $step['text']
                            ]
                        ]
                    ];
                }
            }
            if (count($howToItems) > 0) {
                $schemas[] = [
                    "@context" => "https://schema.org",
                    "@type" => "HowTo",
                    "name" => !empty($post->seoTitle) ? $post->seoTitle : $post->title,
                    "description" => $seoDescription,
                    "image" => !empty($post->coverImage) ? (str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage)) : url('/images/default-blog.jpg'),
                    "step" => $howToItems
                ];
            }
        }
        
        // 7. LocalBusiness Schema (if available)
        $localBusinessData = $post->localBusiness ?? $post->localbusiness ?? $post->local_business ?? null;
        if (is_string($localBusinessData)) {
            $localBusinessData = json_decode($localBusinessData, true);
        }

        if (!empty($localBusinessData) && !empty($localBusinessData['name'])) {
            $lbSchema = [
                "@context" => "https://schema.org",
                "@type" => "LocalBusiness",
                "name" => $localBusinessData['name'],
                "image" => !empty($post->coverImage) ? (str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage)) : url('/uploads/logo.webp'),
                "@id" => url($finalCanonicalUrl),
                "url" => url($finalCanonicalUrl)
            ];
            if (!empty($localBusinessData['telephone'])) {
                $lbSchema['telephone'] = $localBusinessData['telephone'];
            }
            if (!empty($localBusinessData['priceRange'])) {
                $lbSchema['priceRange'] = $localBusinessData['priceRange'];
            }
            if (!empty($localBusinessData['streetAddress']) || !empty($localBusinessData['addressLocality'])) {
                $lbSchema['address'] = [
                    "@type" => "PostalAddress",
                    "streetAddress" => $localBusinessData['streetAddress'] ?? '',
                    "addressLocality" => $localBusinessData['addressLocality'] ?? '',
                    "addressRegion" => $localBusinessData['addressRegion'] ?? '',
                    "postalCode" => $localBusinessData['postalCode'] ?? '',
                    "addressCountry" => $localBusinessData['addressCountry'] ?? ''
                ];
            }
            if (!empty($localBusinessData['ratingValue']) && !empty($localBusinessData['reviewCount'])) {
                $lbSchema['aggregateRating'] = [
                    "@type" => "AggregateRating",
                    "ratingValue" => $localBusinessData['ratingValue'],
                    "reviewCount" => $localBusinessData['reviewCount']
                ];
            }
            $schemas[] = $lbSchema;
        }

        $keywords = is_array($post->keywords) ? implode(',', $post->keywords) : ($post->keywords ?? '');
        $focusKeyword = is_array($post->focusKeyword) ? implode(',', $post->focusKeyword) : ($post->focusKeyword ?? '');
        $lsiKeywords = is_array($post->lsiKeywords) ? implode(',', $post->lsiKeywords) : ($post->lsiKeywords ?? '');
        
        $rawKeywords = $keywords . ',' . $focusKeyword . ',' . $lsiKeywords;
        $keywordArray = array_map('trim', explode(',', $rawKeywords));
        $keywordArray = array_filter($keywordArray);
        $keywordArray = array_unique($keywordArray);
        $cleanKeywords = !empty($keywordArray) ? implode(', ', $keywordArray) : null;

        $recentPostsArray = Post::where('published', true)
            ->whereNull('community_id')
            ->where('id', '!=', $post->id)
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get()
            ->toArray();

        // array_walk_recursive($recentPostsArray, function(&$item, $key) {
        //     if (is_string($item) && str_contains($item, 'uploads/')) {
        //         $item = preg_replace('/(uploads\/[^"\'\s>]+)\.(png|jpg|jpeg|bmp)/i', '$1.webp', $item);
        //     }
        // });

        return Inertia::render('Blog/Show', [
            'post' => $post->toArray(),
            'recentPosts' => $recentPostsArray,
            'meta' => [
                'title' => $seoTitle,
                'description' => $seoDescription,
                'keywords' => $cleanKeywords,
                'og_title' => $post->ogTitle ?? $seoTitle,
                'og_description' => $post->ogDescription ?? $seoDescription,
                'is_ai_assisted' => $post->isAiAssisted ?? false,
                'og_image' => !empty($post->coverImage) ? (str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage)) : url('/images/default-blog.jpg'),
                'og_image_alt' => $post->coverImageAlt ?? $seoTitle,
                'preload_image' => !empty($post->coverImage) ? (str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage)) : null,
                'twitter_card' => $post->twitterCard ?? 'summary_large_image',
                'twitter_title' => $post->twitterTitle ?? $seoTitle,
                'twitter_description' => $post->twitterDescription ?? $seoDescription,
                'url' => $finalCanonicalUrl,
                'type' => 'article',
                'robots' => $post->isNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
                'schemas' => $schemas
            ]
        ])->withViewData([
            'html_content' => '<h1>' . $post->title . '</h1>' . $post->content,
        ]);
    }
}
