<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$request = \Illuminate\Http\Request::create('/api/businesses', 'POST', [
    'name' => 'Test Business',
    'website' => 'example.com',
    'category_name' => 'Coaching & Institutes',
    'description' => 'Test Description',
    'claimed_by_owner' => 'true',
    'user_id' => 'user-1'
]);

$controller = new \App\Http\Controllers\Api\BusinessController();
try {
    $response = $controller->store($request);
    echo "Response status: " . $response->getStatusCode() . "\n";
    echo $response->getContent() . "\n";
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "Validation error:\n";
    print_r($e->errors());
} catch (\Exception $e) {
    echo "Error:\n";
    echo $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
