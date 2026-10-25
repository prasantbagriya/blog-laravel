<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $joined_communities = [];
        $notifications = [];
        $unread_notifications_count = 0;

        // The landing page has its own public navigation and does not render account
        // notifications or the user's community list. Do not query or serialize that
        // private account context there.
        if ($user && ! $request->routeIs('home')) {
            try {
                $joined_communities = $user->communities()->select('communities.id', 'name', 'display_name', 'icon_image')->get();
                $notifications = $user->notifications()->take(15)->get();
                $unread_notifications_count = $user->unreadNotifications()->count();
            } catch (\Exception $e) {
                // Ignore DB errors during migrations
            }
        }

        $global_nav = [];
        try {
            $global_nav = \Illuminate\Support\Facades\Cache::remember('global_nav_active', 86400, function () {
                if (\Illuminate\Support\Facades\Schema::hasTable('navigations')) {
                    return \App\Models\Navigation::where('is_active', true)
                        ->orWhere('show_in_footer', true)
                        ->orderBy('order', 'asc')
                        ->get()
                        ->toArray();
                }
                return [];
            });
        } catch (\Exception $e) {}

        return [
            ...parent::share($request),
            'auth' => [
                // Send profile fields required for navigation, settings, and forms
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'bio' => $user->bio,
                    'flair' => $user->flair,
                    'role' => $user->role,
                    'is_admin' => (bool) ($user->role === 'super_admin' || $user->role === 'admin' || $user->getAttribute('is_admin')),
                    'profile_picture' => $user->profile_picture,
                    'banner_image' => $user->banner_image,
                ] : null,
                'joined_communities' => $joined_communities,
                'notifications' => $notifications,
                'unread_notifications_count' => $unread_notifications_count,
            ],
            'global_nav' => $global_nav,
        ];
    }
}
