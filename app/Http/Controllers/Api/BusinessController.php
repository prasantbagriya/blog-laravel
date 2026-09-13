<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Business;

class BusinessController extends Controller
{
    public function getCategories()
    {
        $categories = [
            [
                'id' => 'cat-1',
                'name' => 'SaaS & Cloud Platforms',
                'slug' => 'saas',
                'iconName' => 'Cloud',
                'description' => 'Software-as-a-service, productivity tools, enterprise CRM, and cloud infrastructures.',
                'businessCount' => 1420,
                'subcategories' => ['CRM', 'Project Management', 'Analytics', 'DevOps', 'Security']
            ],
            [
                'id' => 'cat-2',
                'name' => 'AI Tools & Models',
                'slug' => 'ai-tools',
                'iconName' => 'Sparkles',
                'description' => 'Generative AI, code assistants, LLM wrappers, speech synthesis, and image generators.',
                'businessCount' => 980,
                'subcategories' => ['Text Generation', 'Image AI', 'Voice Synthetic', 'Code Assistants', 'AI Agents']
            ],
            [
                'id' => 'cat-3',
                'name' => 'E-commerce & Retail',
                'slug' => 'ecommerce',
                'iconName' => 'ShoppingBag',
                'description' => 'Online stores, direct-to-consumer brands, fashion hubs, and marketplace merchants.',
                'businessCount' => 3410,
                'subcategories' => ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Subscription Boxes']
            ],
            [
                'id' => 'cat-4',
                'name' => 'Hospitals & Healthcare',
                'slug' => 'hospitals',
                'iconName' => 'Hospital',
                'description' => 'Medical centers, telehealth platforms, dental clinics, and specialized surgery hubs.',
                'businessCount' => 840,
                'subcategories' => ['Telehealth', 'Dental Clinics', 'Diagnostics', 'Speciality Care', 'Wellness']
            ],
            [
                'id' => 'cat-5',
                'name' => 'Web Hosting & Servers',
                'slug' => 'hosting',
                'iconName' => 'Server',
                'description' => 'VPS providers, managed WordPress hosting, domain registrars, and CDN services.',
                'businessCount' => 530,
                'subcategories' => ['Cloud VPS', 'Managed WordPress', 'Dedicated Servers', 'Domain Registrars']
            ],
            [
                'id' => 'cat-6',
                'name' => 'Coaching & Institutes',
                'slug' => 'coaching',
                'iconName' => 'GraduationCap',
                'description' => 'EdTech platforms, coding bootcamps, executive coaching, and competitive exam hubs.',
                'businessCount' => 1150,
                'subcategories' => ['Coding Bootcamps', 'Test Prep', 'Executive Coaching', 'Skill Academies']
            ],
            [
                'id' => 'cat-7',
                'name' => 'Hotels & Hospitality',
                'slug' => 'hotels',
                'iconName' => 'Building',
                'description' => 'Boutique hotels, luxury resorts, vacation rentals, and business travel stays.',
                'businessCount' => 2190,
                'subcategories' => ['Luxury Resorts', 'Boutique Hotels', 'Serviced Apartments', 'Budget Stays']
            ],
            [
                'id' => 'cat-8',
                'name' => 'Fintech & Banking',
                'slug' => 'finance',
                'iconName' => 'CreditCard',
                'description' => 'Digital banks, payment gateways, personal finance apps, and investment platforms.',
                'businessCount' => 1670,
                'subcategories' => ['Payment Gateways', 'Neobanks', 'Investment Apps', 'Lending Services']
            ]
        ];
        
        return response()->json($categories);
    }

    public function index(Request $request)
    {
        $query = Business::query();

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category_name', 'like', "%{$search}%")
                  ->orWhereJsonContains('tags', $search);
            });
        }

        if ($request->filled('minRating')) {
            $query->where('rating', '>=', $request->minRating);
        }

        if ($request->filled('minTrustScore')) {
            $query->where('trust_score', '>=', $request->minTrustScore);
        }

        if ($request->filled('verifiedOnly') && $request->verifiedOnly === 'true') {
            $query->where('is_verified', true);
        }

        $sort = $request->get('sort');
        if ($sort === 'trust_score') {
            $query->orderByDesc('trust_score');
        } elseif ($sort === 'rating') {
            $query->orderByDesc('rating');
        } elseif ($sort === 'reviews') {
            $query->orderByDesc('review_count');
        } else {
            $query->orderByDesc('trust_score');
        }

        return response()->json($query->get());
    }

    public function show($slugOrId)
    {
        $business = Business::where('slug', $slugOrId)->orWhere('id', $slugOrId)->first();
        if (!$business) {
            return response()->json(['error' => 'Business not found'], 404);
        }
        return response()->json($business);
    }

    public function store(Request $request)
    {
        $website = $request->input('website');
        if ($website && !preg_match("~^(?:f|ht)tps?://~i", $website)) {
            $request->merge(['website' => 'https://' . ltrim($website, '/')]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'required|string|max:255',
            'category_name' => 'required|string',
            'description' => 'required|string',
            'slug' => 'nullable|string|max:255|unique:businesses,slug',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'claimed_by_owner' => 'boolean',
        ]);

        $slug = $request->filled('slug') 
            ? \Illuminate\Support\Str::slug($validated['slug']) 
            : \Illuminate\Support\Str::slug($validated['name']) . '-' . rand(1000, 9999);

        // Ensure unique if provided custom slug clashes after Str::slug
        if (Business::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . rand(100, 999);
        }

        $business = Business::create([
            'id' => 'b-' . time(),
            'user_id' => $request->input('user_id') ?? auth()->id() ?? null,
            'name' => $validated['name'],
            'slug' => $slug,
            'website' => $validated['website'],
            'category' => \Illuminate\Support\Str::slug($validated['category_name']),
            'category_name' => $validated['category_name'],
            'description' => $validated['description'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'claimed_by_owner' => $validated['claimed_by_owner'] ?? false,
            'logo' => 'https://ui-avatars.com/api/?name=' . urlencode($validated['name']) . '&background=random',
            'cover_image' => 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070',
            'rating' => 0,
            'review_count' => 0,
            'is_verified' => false,
            'tags' => ['new', strtolower($validated['category_name'])],
        ]);

        return response()->json($business, 201);
    }

    public function update(Request $request, $id)
    {
        $business = Business::findOrFail($id);
        
        // Authorization check: User must be owner or super admin
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        if ($business->user_id !== $user->id && !$user->isSuperAdmin()) {
            return response()->json(['message' => 'Forbidden - You do not have permission to edit this business'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'required|string|max:255',
            'category_name' => 'required|string',
            'description' => 'required|string',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        $business->update([
            'name' => $validated['name'],
            'website' => $validated['website'],
            'category' => \Illuminate\Support\Str::slug($validated['category_name']),
            'category_name' => $validated['category_name'],
            'description' => $validated['description'],
            'phone' => $validated['phone'] ?? $business->phone,
            'email' => $validated['email'] ?? $business->email,
            'address' => $validated['address'] ?? $business->address,
        ]);

        return response()->json($business);
    }
}
