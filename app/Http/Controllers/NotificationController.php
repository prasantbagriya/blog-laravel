<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markRead(Request $request, $id = null)
    {
        $user = $request->user();
        $notificationId = $id ?: $request->input('id');
        
        if ($notificationId) {
            $notification = $user->notifications()->find($notificationId);
            if ($notification) {
                $notification->markAsRead();
            }
        } else {
            $user->unreadNotifications->markAsRead();
        }
        
        return back();
    }
}
