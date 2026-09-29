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

        return [
            ...parent::share($request),
            'auth' => [
                // Send only the fields public, authenticated UI elements require.
                // Admin records and dashboard data are never shared with public pages.
                'user' => $user?->only(['id', 'name', 'username', 'profile_picture', 'role']),
                'joined_communities' => $joined_communities,
                'notifications' => $notifications,
                'unread_notifications_count' => $unread_notifications_count,
            ],
        ];
    }
}
