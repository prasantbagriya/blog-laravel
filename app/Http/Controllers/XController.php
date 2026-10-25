<?php

namespace App\Http\Controllers;

use App\Services\X\XAuthService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XController extends Controller
{
    protected XAuthService $authService;

    public function __construct(XAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Redirect to X (Twitter) OAuth authorization page.
     */
    public function redirectToX()
    {
        try {
            $url = $this->authService->getAuthorizationUrl();
            return redirect()->away($url);
        } catch (\Throwable $e) {
            Log::error('X redirect error: ' . $e->getMessage());
            return redirect('/admin/x')->with('error', 'Failed to initialize X login: ' . $e->getMessage());
        }
    }

    /**
     * Handle X OAuth 2.0 PKCE Callback.
     */
    public function handleCallback(Request $request)
    {
        $code = $request->input('code');
        $state = $request->input('state');
        $error = $request->input('error');

        if ($error) {
            Log::warning('X OAuth error: ' . $error);
            return redirect('/admin/x')->with('error', 'X authorization was declined or cancelled: ' . $error);
        }

        if (!$code) {
            return redirect('/admin/x')->with('error', 'Authorization code missing from X callback.');
        }

        try {
            $account = $this->authService->handleCallback($code, (string) $state);
            return redirect('/admin/x')->with('success', "Connected to X as @{$account->username}!");
        } catch (\Throwable $e) {
            Log::error('X OAuth callback handling failed: ' . $e->getMessage());
            return redirect('/admin/x')->with('error', 'Failed to complete X connection: ' . $e->getMessage());
        }
    }
}
