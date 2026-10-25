<?php

namespace App\Http\Controllers;

use App\Services\Instagram\InstagramAuthService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InstagramController extends Controller
{
    protected InstagramAuthService $authService;

    public function __construct(InstagramAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Redirect to Meta/Instagram OAuth dialog.
     */
    public function redirectToInstagram()
    {
        try {
            $url = $this->authService->getAuthorizationUrl();
            return redirect()->away($url);
        } catch (\Throwable $e) {
            Log::error('Instagram redirect error: ' . $e->getMessage());
            return redirect('/admin/instagram')->with('error', 'Failed to initialize Instagram login: ' . $e->getMessage());
        }
    }

    /**
     * Handle Meta/Instagram OAuth Callback.
     */
    public function handleCallback(Request $request)
    {
        $code = $request->input('code');
        $error = $request->input('error');
        $errorReason = $request->input('error_reason');
        $errorDescription = $request->input('error_description');

        if ($error || $errorReason) {
            Log::warning('Instagram OAuth error: ' . ($errorDescription ?: $error));
            return redirect('/admin/instagram')->with('error', 'Instagram authorization cancelled or declined: ' . ($errorDescription ?: $error));
        }

        if (!$code) {
            return redirect('/admin/instagram')->with('error', 'Authorization code missing from Instagram callback.');
        }

        try {
            $account = $this->authService->handleCallback($code, (string) $request->input('state'));
            return redirect('/admin/instagram')->with('success', "Successfully connected Instagram account @{$account->username}!");
        } catch (\Throwable $e) {
            Log::error('Instagram OAuth callback error: ' . $e->getMessage());
            return redirect('/admin/instagram')->with('error', 'Failed to complete Instagram connection: ' . $e->getMessage());
        }
    }
}
