<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'title' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'type' => 'TEXT',
            'content' => fake()->paragraph(),
            'author_id' => User::factory(),
            'community_id' => Community::factory(),
            'published' => true,
            'score' => 1,
        ];
    }
}
