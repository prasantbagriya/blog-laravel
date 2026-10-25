<?php

namespace App\Http\Controllers;

use App\Services\LinkedIn\LinkedInAuthService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LinkedInController extends Controller
{
    protected LinkedInAuthService $authService;

    public function __construct(LinkedInAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Redirect to LinkedIn OAuth authorization dialog.
     */
    public function redirectToLinkedIn()
    {
        try {
            $url = $this->authService->getAuthorizationUrl();
            return redirect()->away($url);
        } catch (\Throwable $e) {
            Log::error('LinkedIn redirect error: ' . $e->getMessage());
            return redirect('/admin/linkedin')->with('error', 'Failed to initialize LinkedIn login: ' . $e->getMessage());
        }
    }

    /**
     * Handle LinkedIn OAuth 2.0 Callback.
     */
    public function handleCallback(Request $request)
    {
        $code = $request->input('code');
        $state = $request->input('state');
        $error = $request->input('error');
        $errorDescription = $request->input('error_description');

        if ($error) {
            Log::warning('LinkedIn OAuth error: ' . ($errorDescription ?: $error));
            return redirect('/admin/linkedin')->with('error', 'LinkedIn authorization was declined: ' . ($errorDescription ?: $error));
        }

        if (!$code) {
            return redirect('/admin/linkedin')->with('error', 'Authorization code missing from LinkedIn callback.');
        }

        try {
            $account = $this->authService->handleCallback($code, (string) $state);
            return redirect('/admin/linkedin')->with('success', "Connected to LinkedIn as {$account->name}!");
        } catch (\Throwable $e) {
            Log::error('LinkedIn OAuth callback handling failed: ' . $e->getMessage());
            return redirect('/admin/linkedin')->with('error', 'Failed to complete LinkedIn connection: ' . $e->getMessage());
        }
    }
}
