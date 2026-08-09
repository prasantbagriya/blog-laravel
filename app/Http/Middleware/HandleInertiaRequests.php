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
        $joined_communities = [];
        $notifications = [];
        $unread_notifications_count = 0;

        if ($request->user()) {
            try {
                $joined_communities = $request->user()->communities()->select('communities.id', 'name', 'display_name', 'icon_image')->get();
                $notifications = $request->user()->notifications()->take(15)->get();
                $unread_notifications_count = $request->user()->unreadNotifications()->count();
            } catch (\Exception $e) {
                // Ignore DB errors during migrations
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'joined_communities' => $joined_communities,
                'notifications' => $notifications,
                'unread_notifications_count' => $unread_notifications_count,
            ],
        ];
    }
}
