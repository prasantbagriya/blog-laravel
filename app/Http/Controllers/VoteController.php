<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoteController extends Controller
{
    public function vote(Request $request)
    {
        $validated = $request->validate([
            'votable_type' => 'required|in:post,comment',
            'votable_id' => 'required|string',
            'value' => 'required|in:1,-1',
        ]);

        $user = $request->user();
        $type = $validated['votable_type'];
        $id = $validated['votable_id'];
        $value = (int) $validated['value'];

        $model = $type === 'post' ? Post::findOrFail($id) : Comment::findOrFail($id);
        $modelType = $type === 'post' ? Post::class : Comment::class;

        DB::transaction(function () use ($user, $model, $modelType, $id, $value, $type) {
            $existingVote = DB::table('votes')
                ->where('user_id', $user->id)
                ->where('votable_type', $modelType)
                ->where('votable_id', $id)
                ->first();

            if ($existingVote) {
                if ($existingVote->value === $value) {
                    // Removing the vote
                    DB::table('votes')->where('id', $existingVote->id)->delete();
                    $model->decrement('score', $value);
                } else {
                    // Changing the vote
                    DB::table('votes')->where('id', $existingVote->id)->update(['value' => $value]);
                    // If it was -1 and is now 1, difference is +2
                    $diff = $value - $existingVote->value;
                    $model->increment('score', $diff);
                }
            } else {
                // New vote
                DB::table('votes')->insert([
                    'user_id' => $user->id,
                    'votable_type' => $modelType,
                    'votable_id' => $id,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $model->increment('score', $value);

                if ($value === 1 && $model->author_id !== $user->id) {
                    $post = $type === 'post' ? $model : $model->post;
                    if ($model->author) {
                        $model->author->notify(new \App\Notifications\PostUpvoted($user, $post));
                    }
                }
            }
        });

        return back();
    }
}
