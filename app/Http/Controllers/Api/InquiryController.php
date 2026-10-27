<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\InstituteInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    /**
     * Store a new student / institute inquiry (public API).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name'  => 'required|string|max:150',
            'phone'         => 'required|string|max:30',
            'business_id'   => 'nullable|string|max:64',
            'business_name' => 'nullable|string|max:255',
            'course'        => 'nullable|string|max:200',
            'message'       => 'nullable|string|max:2000',
            'source'        => 'nullable|string|max:50',
        ]);

        $businessName = $validated['business_name'] ?? null;
        if (!empty($validated['business_id']) && empty($businessName)) {
            $business = Business::find($validated['business_id']);
            if ($business) {
                $businessName = $business->name;
            }
        }

        $inquiry = InstituteInquiry::create([
            'business_id'   => $validated['business_id'] ?? null,
            'business_name' => $businessName,
            'student_name'  => trim($validated['student_name']),
            'phone'         => trim($validated['phone']),
            'course'        => $validated['course'] ?? null,
            'message'       => $validated['message'] ?? null,
            'status'        => 'new',
            'source'        => $validated['source'] ?? 'profile_direct',
            'ip_address'    => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Inquiry registered successfully',
            'inquiry_id' => $inquiry->id,
        ], 201);
    }

    /**
     * List all inquiries for Admin (API).
     */
    public function index(Request $request): JsonResponse
    {
        try {
            if (!\Illuminate\Support\Facades\Schema::hasTable('institute_inquiries')) {
                return response()->json([
                    'success'   => true,
                    'inquiries' => ['data' => []],
                    'stats'     => ['total' => 0, 'new' => 0, 'contacted' => 0, 'admitted' => 0, 'closed' => 0],
                ]);
            }

            $query = InstituteInquiry::with(['business:id,name,phone,slug,logo'])->latest();

            if ($request->filled('search')) {
                $search = trim($request->input('search'));
                $query->where(function ($q) use ($search) {
                    $q->where('student_name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('course', 'like', "%{$search}%")
                      ->orWhere('business_name', 'like', "%{$search}%")
                      ->orWhere('message', 'like', "%{$search}%");
                });
            }

            if ($request->filled('status') && $request->input('status') !== 'all') {
                $query->where('status', $request->input('status'));
            }

            if ($request->filled('business_id')) {
                $query->where('business_id', $request->input('business_id'));
            }

            $inquiries = $query->paginate($request->input('per_page', 50));

            // Aggregate statistics
            $stats = [
                'total'     => InstituteInquiry::count(),
                'new'       => InstituteInquiry::where('status', 'new')->count(),
                'contacted' => InstituteInquiry::where('status', 'contacted')->count(),
                'admitted'  => InstituteInquiry::where('status', 'admitted')->count(),
                'closed'    => InstituteInquiry::where('status', 'closed')->count(),
            ];

            return response()->json([
                'success'   => true,
                'inquiries' => $inquiries,
                'stats'     => $stats,
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Inquiries index error: ' . $e->getMessage());
            return response()->json([
                'success'   => true,
                'inquiries' => ['data' => []],
                'stats'     => ['total' => 0, 'new' => 0, 'contacted' => 0, 'admitted' => 0, 'closed' => 0],
            ]);
        }
    }

    /**
     * Update inquiry status.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:new,contacted,admitted,closed',
        ]);

        $inquiry = InstituteInquiry::findOrFail($id);
        $inquiry->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'inquiry' => $inquiry,
        ]);
    }

    /**
     * Delete an inquiry.
     */
    public function destroy(int $id): JsonResponse
    {
        $inquiry = InstituteInquiry::findOrFail($id);
        $inquiry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inquiry deleted successfully',
        ]);
    }

    /**
     * Render Admin view for Leads / Inquiries.
     */
    public function renderAdmin(): Response
    {
        return Inertia::render('Admin/Inquiries/Index');
    }
}
