<?php

namespace App\Services\Social;

use App\Models\Post;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiSocialCaptionService
{
    /**
     * Generate an AI-crafted, platform-native caption based on blog post content.
     */
    public function generateForPlatform(Post $post, string $platform): ?array
    {
        // In testing environment, avoid live outbound API calls unless explicitly enabled in the test
        if (app()->environment('testing') && !config('services.gemini.enable_test_mock', false)) {
            return null;
        }

        $apiKey = config('services.gemini.api_key', env('GEMINI_API_KEY'));
        if (empty($apiKey)) {
            return null;
        }

        $platform = strtolower(trim($platform));
        if ($platform === 'twitter') {
            $platform = 'x';
        }

        $contentContext = $this->extractArticleContext($post);
        if (empty($contentContext)) {
            return null;
        }

        $prompt = $this->buildPromptForPlatform($post, $contentContext, $platform);
        if (empty($prompt)) {
            return null;
        }

        $candidateModels = array_unique(array_filter([
            config('services.gemini.model', env('GEMINI_MODEL', 'gemini-2.0-flash')),
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-2.0-flash-lite',
        ]));

        $payload = [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 1024,
            ]
        ];

        foreach ($candidateModels as $model) {
            try {
                $response = Http::withoutVerifying()
                    ->timeout(12)
                    ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", $payload);

                if ($response->successful()) {
                    $rawText = $response->json('candidates.0.content.parts.0.text');
                    if (!empty($rawText)) {
                        $parsed = $this->parseJsonResponse($rawText);
                        if (!empty($parsed)) {
                            return $parsed;
                        }
                    }
                } else {
                    Log::warning("Gemini AI caption error ({$model}): " . substr($response->body(), 0, 250));
                }
            } catch (\Throwable $e) {
                Log::warning("Gemini AI caption exception on model {$model}: " . $e->getMessage());
                continue;
            }
        }

        return null;
    }

    /**
     * Extract rich, factual article context from the blog post.
     */
    protected function extractArticleContext(Post $post): string
    {
        $parts = [];
        $parts[] = "TITLE: " . trim($post->title);

        if (!empty($post->category)) {
            $parts[] = "CATEGORY: " . trim($post->category);
        }

        if (!empty($post->excerpt)) {
            $parts[] = "EXCERPT: " . trim(strip_tags($post->excerpt));
        }

        // Clean body text from HTML, extracting up to 2500 characters of meaningful content
        if (!empty($post->content)) {
            $cleanContent = strip_tags($post->content);
            $cleanContent = preg_replace('/\s+/', ' ', $cleanContent);
            $cleanContent = trim($cleanContent);
            $parts[] = "ARTICLE CONTENT:\n" . Str::limit($cleanContent, 2200, '...');
        }

        // Add Key Takeaways if available
        if (!empty($post->keyTakeaways) && is_array($post->keyTakeaways)) {
            $takeaways = array_filter(array_map(function ($item) {
                return is_array($item) ? ($item['text'] ?? $item['name'] ?? null) : (is_string($item) ? $item : null);
            }, $post->keyTakeaways));
            if (!empty($takeaways)) {
                $parts[] = "KEY TAKEAWAYS:\n- " . implode("\n- ", array_slice($takeaways, 0, 5));
            }
        }

        return implode("\n\n", $parts);
    }

    /**
     * Build strict, platform-specific JSON prompt.
     */
    protected function buildPromptForPlatform(Post $post, string $context, string $platform): string
    {
        $systemIdentity = "You are a senior social media director and creative copywriter for 'CoachingsinSikar', the trusted coaching, school, and student education discovery platform in Sikar, Rajasthan.\n" .
            "Your task is to craft high-conversion, engaging social content by thoroughly understanding the article content provided below.\n" .
            "Do NOT just repeat the title or copy raw paragraphs. Extract the core value, key insights, specific names/facts from the article, and write original, platform-native copy.\n\n" .
            "--- ARTICLE CONTEXT ---\n{$context}\n-----------------------\n\n";

        switch ($platform) {
            case 'facebook':
                return $systemIdentity .
                    "Write an engaging Facebook post for our audience of students and parents.\n" .
                    "Requirements:\n" .
                    "1. Hook: Start with a catchy, attention-grabbing opening line with relevant emojis.\n" .
                    "2. Value: Provide 2-3 punchy bullet points summarizing key findings or tips from the blog.\n" .
                    "3. Engagement: Ask an insightful question to encourage comments.\n" .
                    "4. CTA: Add a clear call-to-action to read the full guide on the website.\n" .
                    "5. Hashtags: Include 4-6 relevant hashtags.\n" .
                    "Return ONLY valid JSON with this exact structure:\n" .
                    "{\n  \"caption\": \"Full ready-to-publish Facebook caption here\",\n  \"hashtags\": [\"#Sikar\", \"#NEET\"]\n}";

            case 'instagram':
                return $systemIdentity .
                    "Write an aesthetic, viral-worthy Instagram caption for students and youth in Sikar.\n" .
                    "Requirements:\n" .
                    "1. Opening Hook: First 1-2 lines must be extremely catchy with emojis.\n" .
                    "2. Body: 3-4 neat bullet points breaking down insider rankings, tips, or facts from the article.\n" .
                    "3. Engagement Prompt: Tell users to 'Save this post 📌' or drop their questions in comments.\n" .
                    "4. CTA: Tell them to tap the link in bio for the complete guide.\n" .
                    "5. Hashtags: 15-20 trending, niche-specific hashtags (e.g. #CoachingsInSikar, #SikarEducation, #NEET, #JEE, #PipraliRoad).\n" .
                    "Return ONLY valid JSON with this exact structure:\n" .
                    "{\n  \"caption\": \"Full ready-to-publish Instagram caption with spacing and emojis\",\n  \"hashtags\": [\"#CoachingsInSikar\", \"#SikarEducation\"]\n}";

            case 'pinterest':
                return $systemIdentity .
                    "Pinterest is a visual discovery and search engine. Users look for authoritative guides, comparative reviews, rankings, and actionable admission tips.\n" .
                    "Create an optimized Pinterest Pin strictly formatted for Pinterest SEO:\n" .
                    "1. Title: Keyword-rich, clickable, clear title in Title Case (STRICTLY under 95 characters, e.g. 'Top 5 NEET Coachings in Sikar [2026 Rankings & Fees]').\n" .
                    "2. Description: High-conversion, structured summary formatted as follows:\n" .
                    "   - Line 1: Compelling hook stating the key benefit/finding from the article.\n" .
                    "   - Line 2: 2 punchy bullet points (using •) highlighting specific institute names, key rankings, or facts from the text.\n" .
                    "   - Line 3: Pinterest CTA (e.g. '📌 Save this pin & tap the link to view complete fees, faculty comparison, and student reviews!').\n" .
                    "   (STRICTLY keep description text under 350 characters so it fits with hashtags).\n" .
                    "3. Hashtags: 4-6 high-traffic Pinterest search intent tags (e.g. #SikarCoaching, #NEETPreparation, #CoachingsInSikar).\n" .
                    "4. Alt Text: Descriptive accessibility text explaining the visual graphic (max 150 characters).\n" .
                    "Return ONLY valid JSON with this exact structure:\n" .
                    "{\n  \"title\": \"Pin Title Under 95 Chars\",\n  \"description\": \"Structured hook + bullet points + save CTA under 350 chars\",\n  \"hashtags\": [\"#SikarCoaching\", \"#NEETPreparation\"],\n  \"alt_text\": \"Visual description for screen readers and search\"\n}";

            case 'x':
                return $systemIdentity .
                    "Write a sharp, high-impact tweet for Twitter/X.\n" .
                    "CRITICAL REQUIREMENT: Twitter has a strict 280-character limit. Any URL consumes ~23 characters.\n" .
                    "Your tweet body text (hook + 1 key takeaway + 2-3 hashtags) MUST be strictly under 220 characters so the final tweet with link fits easily within 280 characters.\n" .
                    "Return ONLY valid JSON with this exact structure:\n" .
                    "{\n  \"tweet_text\": \"Short punchy tweet text with emoji and 2-3 hashtags\",\n  \"hashtags\": [\"#Sikar\", \"#NEET\"]\n}";

            case 'linkedin':
                return $systemIdentity .
                    "Write an authoritative, thought-leadership post for LinkedIn targeting educators, parents, and academic aspirants.\n" .
                    "Requirements:\n" .
                    "1. Professional headline hook with an educational emoji.\n" .
                    "2. Concise analytical overview of the trends or institute facts discussed in the blog.\n" .
                    "3. 3 structured bullet points with verified takeaways.\n" .
                    "4. Professional discussion question and CTA.\n" .
                    "5. 3-5 industry hashtags.\n" .
                    "Return ONLY valid JSON with this exact structure:\n" .
                    "{\n  \"commentary\": \"Full LinkedIn commentary text here\",\n  \"hashtags\": [\"#Education\", \"#CareerGuidance\"]\n}";

            default:
                return '';
        }
    }

    /**
     * Parse and clean JSON string from Gemini response.
     */
    protected function parseJsonResponse(string $rawText): ?array
    {
        $clean = trim($rawText);
        // Strip markdown code fences if wrapped in ```json ... ```
        if (preg_match('/```(?:json)?\s*([\s\S]*?)\s*```/i', $clean, $matches)) {
            $clean = trim($matches[1]);
        }

        $decoded = json_decode($clean, true);
        if (is_array($decoded)) {
            return $decoded;
        }

        return null;
    }
}
