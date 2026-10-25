<?php

namespace Database\Factories;

use App\Models\Community;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Community>
 */
class CommunityFactory extends Factory
{
    protected $model = Community::class;

    public function definition(): array
    {
        $name = fake()->unique()->slug();
        return [
            'name' => $name,
            'display_name' => 'r/' . $name,
            'description' => fake()->sentence(),
            'owner_id' => User::factory(),
        ];
    }
}
