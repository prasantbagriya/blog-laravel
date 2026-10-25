<?php

namespace App\Http\Controllers;

use App\Services\Pinterest\PinterestAuthService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PinterestController extends Controller
{
    protected PinterestAuthService $authService;

    public function __construct(PinterestAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Redirect to Pinterest OAuth authorization page.
     */
    public function redirectToPinterest()
    {
        try {
            $url = $this->authService->getAuthorizationUrl();
            return redirect()->away($url);
        } catch (\Throwable $e) {
            Log::error('Pinterest redirect error: ' . $e->getMessage());
            return redirect('/admin/pinterest')->with('error', 'Failed to initialize Pinterest login: ' . $e->getMessage());
        }
    }

    /**
     * Handle Pinterest OAuth 2.0 Callback.
     */
    public function handleCallback(Request $request)
    {
        $code = $request->input('code');
        $state = $request->input('state');
        $error = $request->input('error');

        if ($error) {
            Log::warning('Pinterest OAuth error: ' . $error);
            return redirect('/admin/pinterest')->with('error', 'Pinterest authorization was declined or cancelled: ' . $error);
        }

        if (!$code) {
            return redirect('/admin/pinterest')->with('error', 'Authorization code missing from Pinterest callback.');
        }

        try {
            $account = $this->authService->handleCallback($code, (string) $state);
            return redirect('/admin/pinterest')->with('success', "Connected to Pinterest as @{$account->username}!");
        } catch (\Throwable $e) {
            Log::error('Pinterest OAuth callback handling failed: ' . $e->getMessage());
            return redirect('/admin/pinterest')->with('error', 'Failed to complete Pinterest connection: ' . $e->getMessage());
        }
    }
}
