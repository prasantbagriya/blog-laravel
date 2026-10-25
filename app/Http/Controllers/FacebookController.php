<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\Facebook\FacebookAuthService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FacebookController extends Controller
{
    protected FacebookAuthService $authService;

    public function __construct(FacebookAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Redirect to Meta OAuth Dialog.
     */
    public function redirectToFacebook(Request $request)
    {
        if (!$this->authService->isConfigured()) {
            return redirect()->route('login')->with('error', 'Facebook Login is not configured yet. Please configure Facebook App ID and App Secret.');
        }

        try {
            $url = $this->authService->getAuthorizationUrl();
            return redirect()->away($url);
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Handle Meta OAuth callback.
     */
    public function handleCallback(Request $request)
    {
        if ($request->has('error')) {
            $reason = $request->input('error_description') ?: $request->input('error_reason') ?: 'Facebook authentication was cancelled.';
            if (Auth::check()) {
                return redirect()->route('admin.facebook.index')->with('error', "Facebook Connect failed: {$reason}");
            }
            return redirect()->route('login')->with('error', "Facebook Login failed: {$reason}");
        }

        $code = $request->input('code');
        if (empty($code)) {
            return redirect()->route('login')->with('error', 'Authorization code missing from Meta callback.');
        }

        try {
            $redirect = config('services.facebook.redirect_uri') ?: $request->url();
            $account = $this->authService->handleCallback($code, $redirect, Auth::user());

            // If user was already logged in (e.g. Admin linking their Facebook Pages)
            if (Auth::check()) {
                return redirect()->route('admin.facebook.index')->with('success', "Facebook Account '{$account->name}' connected successfully! All managed pages synced.");
            }

            // Guest User: Login or Register
            $email = $account->email;
            $user = null;

            if ($email) {
                $user = User::where('email', $email)->first();
            }

            if (!$user) {
                // Find by linked facebook account
                $user = $account->user;
            }

            if (!$user) {
                // Register new user
                $user = User::create([
                    'name' => $account->name,
                    'username' => 'fb_' . Str::lower(Str::random(8)),
                    'email' => $email ?: ('fb_' . $account->fb_user_id . '@coachingsinsikar.com'),
                    'password' => Hash::make(Str::random(32)),
                    'profile_picture' => $account->avatar,
                    'email_verified_at' => now(),
                    'role' => 'user',
                ]);
            }

            $account->update(['user_id' => $user->id]);
            Auth::login($user, true);

            if ($user->is_admin || in_array($user->role, ['admin', 'super_admin'], true)) {
                return redirect()->route('admin.facebook.index')->with('success', 'Logged in and Facebook Pages connected!');
            }

            return redirect()->intended(route('dashboard'));
        } catch (Exception $e) {
            if (Auth::check()) {
                return redirect()->route('admin.facebook.index')->with('error', $e->getMessage());
            }
            return redirect()->route('login')->with('error', $e->getMessage());
        }
    }
}
