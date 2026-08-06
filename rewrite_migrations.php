<?php

$dir = __DIR__ . '/database/migrations';
$files = scandir($dir);

foreach ($files as $file) {
    if ($file === '.' || $file === '..') continue;
    $path = $dir . '/' . $file;
    $content = file_get_contents($path);

    if (strpos($file, 'create_communities_table') !== false) {
        $schema = "
            \$table->id();
            \$table->string('name')->unique();
            \$table->string('display_name')->nullable();
            \$table->text('description')->nullable();
            \$table->string('banner_image')->nullable();
            \$table->string('icon_image')->nullable();
            \$table->json('rules')->nullable();
            \$table->boolean('is_nsfw')->default(false);
            \$table->boolean('is_private')->default(false);
            \$table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            \$table->timestamps();";
        $content = preg_replace('/\$table->id\(\);\s*\$table->timestamps\(\);/', $schema, $content);
        file_put_contents($path, $content);
    }
    
    if (strpos($file, 'create_community_members_table') !== false) {
        $schema = "
            \$table->id();
            \$table->foreignId('user_id')->constrained()->onDelete('cascade');
            \$table->foreignId('community_id')->constrained()->onDelete('cascade');
            \$table->timestamp('joined_at')->useCurrent();
            \$table->unique(['user_id', 'community_id']);";
        $content = preg_replace('/\$table->id\(\);\s*\$table->timestamps\(\);/', $schema, $content);
        file_put_contents($path, $content);
    }

    if (strpos($file, 'create_posts_table') !== false) {
        // Need to find the create_posts_table since it might already have content
        // The existing one might have 'title', 'content', etc. Let's overwrite its inner closure
        // Actually, blog-laravel might have its own posts table. Let's just drop the table and recreate it in the schema, 
        // or just add the missing columns.
    }
}
echo "Migrations rewritten.\n";
