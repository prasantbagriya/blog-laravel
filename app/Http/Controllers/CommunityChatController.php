<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\CommunityMessage;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class CommunityChatController extends Controller
{
    public function index(Community $community)
    {
        $messages = CommunityMessage::with('user:id,username,name')
            ->where('community_id', $community->id)
            ->latest()
            ->take(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json($messages);
    }

    public function store(Request $request, Community $community)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $message = CommunityMessage::create([
            'community_id' => $community->id,
            'user_id' => auth()->id(),
            'message' => $request->message
        ]);

        // Load the user relation so it's included in the broadcast
        $message->load('user:id,username,name');

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }
}
