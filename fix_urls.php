<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tables = [
    ['table' => 'posts', 'columns' => ['content', 'coverImage', 'authorImage', 'media_urls']],
    ['table' => 'authors', 'columns' => ['image', 'bio']],
    ['table' => 'categories', 'columns' => ['image', 'description']],
];

$badUrl = 'http://localhost';
$goodUrl = 'https://coachingsinsikar.com';
$count = 0;

foreach ($tables as $t) {
    $records = \Illuminate\Support\Facades\DB::table($t['table'])->get();
    foreach ($records as $record) {
        $update = [];
        foreach ($t['columns'] as $col) {
            if (!empty($record->{$col}) && str_contains($record->{$col}, $badUrl)) {
                $update[$col] = str_replace($badUrl, $goodUrl, $record->{$col});
            }
        }
        if (!empty($update)) {
            \Illuminate\Support\Facades\DB::table($t['table'])->where('id', $record->id)->update($update);
            $count++;
        }
    }
}

echo "Fixed $count records.";
