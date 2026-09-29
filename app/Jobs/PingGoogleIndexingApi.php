<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PingGoogleIndexingApi implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $url;
    protected $type;

    /**
     * Create a new job instance.
     *
     * @param string $url The URL to index.
     * @param string $type The type of action (URL_UPDATED or URL_DELETED).
     */
    public function __construct($url, $type = 'URL_UPDATED')
    {
        $this->url = $url;
        $this->type = $type;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $keyPath = storage_path('google-service-account.json');

        if (!file_exists($keyPath)) {
            Log::warning('Google Indexing API bypassed: service-account.json not found.');
            return;
        }

        try {
            $client = new \Google_Client();
            $client->setAuthConfig($keyPath);
            $client->addScope('https://www.googleapis.com/auth/indexing');

            $httpClient = $client->authorize();
            
            $endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
            
            $content = json_encode([
                'url' => $this->url,
                'type' => $this->type,
            ]);

            $response = $httpClient->post($endpoint, [
                'body' => $content,
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]);

            Log::info("Google Indexing API ($this->type): {$this->url} - Status: " . $response->getStatusCode());
        } catch (\Exception $e) {
            Log::error("Google Indexing API Error: " . $e->getMessage());
        }
    }
}
