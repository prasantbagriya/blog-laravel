<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('community.{communityId}', function ($user, $communityId) {
    if ($user) {
        return ['id' => $user->id, 'username' => $user->username, 'name' => $user->name];
    }
});

Broadcast::channel('post.{postId}', function ($user, $postId) {
    if ($user) {
        return ['id' => $user->id, 'username' => $user->username, 'name' => $user->name];
    }
});
