<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostCommented extends Notification
{
    use Queueable;

    protected $commenter;
    protected $post;
    protected $comment;

    /**
     * Create a new notification instance.
     */
    public function __construct($commenter, $post, $comment)
    {
        $this->commenter = $commenter;
        $this->post = $post;
        $this->comment = $comment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => "u/{$this->commenter->username} commented on your post",
            'url' => "/r/{$this->post->community->name}/comments/{$this->post->id}/" . \Illuminate\Support\Str::slug($this->post->title),
            'user_id' => $this->commenter->id,
            'username' => $this->commenter->username,
            'profile_picture' => $this->commenter->profile_picture,
        ];
    }
}
