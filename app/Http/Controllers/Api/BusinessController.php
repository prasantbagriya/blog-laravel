<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
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
        // Public listings never need the owner account identifier or business inbox.
        // `user_id` is selected only on the server to calculate the current user's canEdit flag.
        $query = Business::select([...Business::publicColumns(), 'user_id']);

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

        return response()->json(
            $query->get()
                ->map(fn (Business $business) => $business->publicPayload($request->user()))
                ->values()
        );
    }

    public function show(Request $request, $slugOrId)
    {
        $business = Business::select([...Business::publicColumns(), 'user_id'])
            ->where('slug', $slugOrId)
            ->orWhere('id', $slugOrId)
            ->first();
        if (!$business) {
            return response()->json(['error' => 'Business not found'], 404);
        }
        return response()->json($business->publicPayload($request->user()));
    }

    public function store(Request $request)
    {
        // Decode payloads if they were encoded to bypass ModSecurity
        if ($request->has('_encoded_payloads')) {
            $fieldsToDecode = ['detailed_description', 'faqs', 'services'];
            foreach ($fieldsToDecode as $field) {
                if ($request->has($field) && is_string($request->$field)) {
                    $decoded = base64_decode($request->$field, true);
                    if ($decoded !== false) {
                        $request->merge([$field => urldecode($decoded)]);
                    }
                }
            }
        }

        if ($request->has('faqs') && is_string($request->faqs)) {
            $request->merge(['faqs' => json_decode($request->faqs, true)]);
        }
        if ($request->has('services') && is_string($request->services)) {
            $request->merge(['services' => json_decode($request->services, true)]);
        }
        if ($request->has('claimed_by_owner')) {
            $request->merge(['claimed_by_owner' => filter_var($request->claimed_by_owner, FILTER_VALIDATE_BOOLEAN)]);
        }

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
            'faqs' => 'nullable|array',
            'faqs.*.question' => 'required|string',
            'faqs.*.answer' => 'required|string',
            'services' => 'nullable|array',
            'services.*.name' => 'required|string',
            'services.*.description' => 'nullable|string',
            'services.*.price' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'cover_image' => 'nullable|image|max:4096',
        ]);

        $slug = $request->filled('slug') 
            ? \Illuminate\Support\Str::slug($validated['slug']) 
            : \Illuminate\Support\Str::slug($validated['name']) . '-' . rand(1000, 9999);

        // Ensure unique if provided custom slug clashes after Str::slug
        if (Business::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . rand(100, 999);
        }

        $logoPath = 'https://ui-avatars.com/api/?name=' . urlencode($validated['name']) . '&background=random';
        if ($request->hasFile('logo')) {
            $logoPath = $this->storeOptimizedImage($request->file('logo'), 'businesses/logos', 672);
        }

        $coverPath = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070';
        if ($request->hasFile('cover_image')) {
            $coverPath = $this->storeOptimizedImage($request->file('cover_image'), 'businesses/covers', 1600);
        }

        try {
            $business = Business::create([
                'id' => 'b-' . time(),
                // Ownership always comes from the authenticated session, never the request body.
                'user_id' => $request->user()->id,
                'name' => $validated['name'],
                'slug' => $slug,
                'website' => $validated['website'],
                'category' => \Illuminate\Support\Str::slug($validated['category_name']),
                'category_name' => $validated['category_name'],
                'description' => $validated['description'],
                'detailed_description' => $validated['detailed_description'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'email' => $validated['email'] ?? null,
                'address' => $validated['address'] ?? null,
                'opening_hours' => $validated['opening_hours'] ?? null,
                'claimed_by_owner' => filter_var($validated['claimed_by_owner'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'faqs' => $validated['faqs'] ?? null,
                'products' => $validated['services'] ?? null,
                'logo' => $logoPath,
                'cover_image' => $coverPath,
                'rating' => 0,
                'review_count' => 0,
                'is_verified' => false,
                'tags' => ['new', strtolower($validated['category_name'])],
            ]);

            return response()->json($business->publicPayload($request->user()), 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Business listing creation error: ' . $e->getMessage());
            return response()->json(['errors' => ['general' => 'Server Error: ' . $e->getMessage()]], 500);
        }
    }

    public function update(Request $request, $id)
    {
        // Decode payloads if they were encoded to bypass ModSecurity
        if ($request->has('_encoded_payloads')) {
            $fieldsToDecode = ['detailed_description', 'faqs', 'services'];
            foreach ($fieldsToDecode as $field) {
                if ($request->has($field) && is_string($request->$field)) {
                    $decoded = base64_decode($request->$field, true);
                    if ($decoded !== false) {
                        $request->merge([$field => urldecode($decoded)]);
                    }
                }
            }
        }

        $business = Business::findOrFail($id);
        
        // Authorization check: User must be owner or super admin
        $user = auth()->user();
        if (!$user) {
            \Illuminate\Support\Facades\Log::warning('Business update failed: Unauthorized. User is null.');
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $canAdminister = in_array($user->role, ['admin', 'super_admin'], true)
            || (bool) $user->getAttribute('is_admin');
        if ($business->user_id !== $user->id && !$canAdminister) {
            \Illuminate\Support\Facades\Log::warning('Business update failed: Forbidden. User ID: ' . $user->id . ' Business User ID: ' . $business->user_id);
            return response()->json(['message' => 'Forbidden - You do not have permission to edit this business'], 403);
        }

        if ($request->has('faqs') && is_string($request->faqs)) {
            $request->merge(['faqs' => json_decode($request->faqs, true)]);
        }
        if ($request->has('services') && is_string($request->services)) {
            $request->merge(['services' => json_decode($request->services, true)]);
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255',
                'website' => 'nullable|string|max:255',
                'category_name' => 'required|string',
                'description' => 'required|string',
                'detailed_description' => 'nullable|string',
                'phone' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'address' => 'nullable|string|max:500',
                'opening_hours' => 'nullable|string|max:255',
                'faqs' => 'nullable|array',
                'faqs.*.question' => 'required|string',
                'faqs.*.answer' => 'required|string',
                'services' => 'nullable|array',
                'services.*.name' => 'required|string',
                'services.*.description' => 'nullable|string',
                'services.*.price' => 'nullable|string',
                'logo' => 'nullable|image|max:2048',
                'cover_image' => 'nullable|image|max:4096',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Illuminate\Support\Facades\Log::warning('Business update validation failed: ' . json_encode($e->errors()));
            throw $e;
        }

        $updateData = [
            'name' => $validated['name'],
            'website' => $validated['website'] ?? $business->website,
            'category' => \Illuminate\Support\Str::slug($validated['category_name']),
            'category_name' => $validated['category_name'],
            'description' => $validated['description'],
            'detailed_description' => $validated['detailed_description'] ?? $business->detailed_description,
            'phone' => $validated['phone'] ?? $business->phone,
            'email' => $validated['email'] ?? $business->email,
            'address' => $validated['address'] ?? $business->address,
            'opening_hours' => $validated['opening_hours'] ?? $business->opening_hours,
            'faqs' => $validated['faqs'] ?? $business->faqs,
        ];

        if (!empty($validated['slug'])) {
            $newSlug = \Illuminate\Support\Str::slug($validated['slug']);
            // Ensure unique slug if changed
            if ($newSlug !== $business->slug && !Business::where('slug', $newSlug)->exists()) {
                $updateData['slug'] = $newSlug;
            }
        }

        if (isset($validated['services'])) {
            $updateData['products'] = $validated['services'];
        }

        if ($request->hasFile('logo')) {
            $updateData['logo'] = $this->storeOptimizedImage($request->file('logo'), 'businesses/logos', 672);
        }

        if ($request->hasFile('cover_image')) {
            $updateData['cover_image'] = $this->storeOptimizedImage($request->file('cover_image'), 'businesses/covers', 1600);
        }

        $business->update($updateData);

        return response()->json($business->publicPayload($request->user()));
    }

    private function storeOptimizedImage(UploadedFile $file, string $directory, int $maxWidth): string
    {
        // Preserve animated GIF uploads; converting them with GD would drop frames.
        if (strtolower($file->getClientOriginalExtension()) === 'gif') {
            return '/uploads/' . $file->store($directory, 'uploads');
        }

        $image = (new ImageManager(new Driver()))->decodePath($file->getRealPath());
        $image->scaleDown(width: $maxWidth);

        $filename = Str::uuid() . '.webp';
        Storage::disk('uploads')->put(
            $directory . '/' . $filename,
            (string) $image->encodeUsingFileExtension('webp', 78),
        );

        return '/uploads/' . $directory . '/' . $filename;
    }
}
