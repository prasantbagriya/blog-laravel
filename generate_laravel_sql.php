<?php
/**
 * WordPress to Laravel SQL Generator — FIXED VERSION
 * 
 * Fixes:
 * 1. MySQL: INSERT INTO ... SELECT ... FROM DUAL WHERE NOT EXISTS
 * 2. Added all missing columns: authorImage, authorSocials, author, faqs
 * 3. Proper SQL escaping for single quotes inside content
 * 4. tags/faqs correctly formatted as JSON
 * 5. All nullable fields properly handled
 */

$WP_SQL_FILE = 'C:\Users\1\Downloads\coachtim_wp900.sql';
$OUTPUT_FILE = 'C:\Users\1\Downloads\laravel_import.sql';
$WP_PREFIX   = 'wpz0_';

echo "WordPress → Laravel SQL Generator (FIXED)\n";
echo str_repeat("=", 50) . "\n\n";

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

function parseInserts(string $sql, string $tableName): array
{
    $results = [];
    $pattern = '/INSERT INTO `' . preg_quote($tableName, '/') . '` \(([^)]+)\) VALUES\s*(.*?);(?:\s*\n|$)/si';

    if (!preg_match_all($pattern, $sql, $matches, PREG_SET_ORDER)) {
        return [];
    }

    foreach ($matches as $match) {
        $columns = array_map(fn($c) => trim($c, '` '), explode(',', $match[1]));
        $rows    = parseValueRows($match[2]);
        foreach ($rows as $row) {
            if (count($row) === count($columns)) {
                $results[] = array_combine($columns, $row);
            }
        }
    }
    return $results;
}

function parseValueRows(string $valuesBlock): array
{
    $rows = [];
    $i    = 0;
    $len  = strlen($valuesBlock);

    while ($i < $len) {
        while ($i < $len && in_array($valuesBlock[$i], [' ', "\n", "\r", "\t", ','])) $i++;
        if ($i >= $len || $valuesBlock[$i] !== '(') break;
        $i++;
        $row          = [];
        $currentValue = '';
        $inString     = false;
        $stringChar   = '';
        $escaped      = false;

        while ($i < $len) {
            $char = $valuesBlock[$i];
            if ($escaped)              { $currentValue .= $char; $escaped = false; $i++; continue; }
            if ($char === '\\' && $inString) { $currentValue .= $char; $escaped = true; $i++; continue; }
            if (!$inString && ($char === "'" || $char === '"')) { $inString = true; $stringChar = $char; $i++; continue; }
            if ($inString && $char === $stringChar)             { $inString = false; $i++; continue; }
            if (!$inString && $char === ',') { $row[] = unescapeVal($currentValue); $currentValue = ''; $i++; continue; }
            if (!$inString && $char === ')') { $row[] = unescapeVal($currentValue); $rows[] = $row; $i++; break; }
            $currentValue .= $char;
            $i++;
        }
    }
    return $rows;
}

function unescapeVal(string $value): ?string
{
    $value = trim($value);
    if ($value === 'NULL') return null;
    $value = str_replace(["\\n", "\\r", "\\t", "\\'", '\\"', '\\\\'], ["\n", "\r", "\t", "'", '"', "\\"], $value);
    return $value;
}

/**
 * Properly escape a value for MySQL INSERT
 * Returns NULL (no quotes) or 'escaped_value' (with quotes)
 */
function sq(?string $value): string
{
    if ($value === null) return 'NULL';
    // Escape for MySQL: backslash, single quote, null byte
    $value = str_replace(['\\', "'", "\0", "\n", "\r"], ['\\\\', "\\'", '\\0', '\\n', '\\r'], $value);
    return "'" . $value . "'";
}

function generateUUID(): string
{
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function cleanContent(?string $content): string
{
    if (!$content) return '';
    // Remove Gutenberg block comments
    $content = preg_replace('/<!--\s*wp:[^>]*-->/s', '', $content);
    $content = preg_replace('/<!--\s*\/wp:[^>]*-->/s', '', $content);
    // Remove wp: class attributes from elements
    $content = preg_replace('/\s*class="wp-block-[^"]*"/', '', $content);
    $content = preg_replace('/\s*class="wp-element-[^"]*"/', '', $content);
    return trim($content);
}

function getPostMeta(array $postMeta, int $postId): array
{
    $meta = [];
    foreach ($postMeta as $m) {
        if ((int)$m['post_id'] === $postId) {
            $meta[$m['meta_key']] = $m['meta_value'];
        }
    }
    return $meta;
}

function getCoverImage(array $post, array $meta, array $allPosts): ?string
{
    // Method 1: _thumbnail_id
    if (!empty($meta['_thumbnail_id'])) {
        $thumbId = (int)$meta['_thumbnail_id'];
        foreach ($allPosts as $p) {
            if ((int)$p['ID'] === $thumbId && $p['post_type'] === 'attachment') {
                return $p['guid'] ?: null;
            }
        }
    }
    // Method 2: First image from content
    if (preg_match('/"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|gif|webp))"/i', $post['post_content'] ?? '', $m)) {
        return $m[1];
    }
    return null;
}

function getPostTags(int $postId, array $termRelationships, array $termTaxonomy, array $terms): array
{
    $tagTaxIds = [];
    foreach ($termTaxonomy as $tt) {
        if ($tt['taxonomy'] === 'post_tag') {
            $tagTaxIds[(int)$tt['term_taxonomy_id']] = (int)$tt['term_id'];
        }
    }
    $tags = [];
    foreach ($termRelationships as $rel) {
        if ((int)$rel['object_id'] === $postId && isset($tagTaxIds[(int)$rel['term_taxonomy_id']])) {
            $termId = $tagTaxIds[(int)$rel['term_taxonomy_id']];
            foreach ($terms as $t) {
                if ((int)$t['term_id'] === $termId) {
                    $tags[] = $t['name'];
                    break;
                }
            }
        }
    }
    return array_unique($tags);
}

function getPostCategory(int $postId, array $categoryMap, array $termRelationships, array $termTaxonomy): ?string
{
    $catTaxIds = [];
    foreach ($termTaxonomy as $tt) {
        if ($tt['taxonomy'] === 'category') {
            $catTaxIds[(int)$tt['term_taxonomy_id']] = (int)$tt['term_id'];
        }
    }
    foreach ($termRelationships as $rel) {
        if ((int)$rel['object_id'] === $postId && isset($catTaxIds[(int)$rel['term_taxonomy_id']])) {
            $termId = $catTaxIds[(int)$rel['term_taxonomy_id']];
            if (isset($categoryMap[$termId]) && $termId != 1) { // Skip Uncategorized
                return $categoryMap[$termId];
            }
        }
    }
    return null;
}

// ─────────────────────────────────────────────
// PARSE SQL FILE
// ─────────────────────────────────────────────
echo "1. SQL file parh raha hai...\n";
$sql = file_get_contents($WP_SQL_FILE);
echo "   Size: " . round(strlen($sql) / 1024 / 1024, 2) . " MB\n\n";

echo "2. Tables parse kar raha hai...\n";
$posts             = parseInserts($sql, $WP_PREFIX . 'posts');
$terms             = parseInserts($sql, $WP_PREFIX . 'terms');
$termTaxonomy      = parseInserts($sql, $WP_PREFIX . 'term_taxonomy');
$termRelationships = parseInserts($sql, $WP_PREFIX . 'term_relationships');
$postMeta          = parseInserts($sql, $WP_PREFIX . 'postmeta');
unset($sql);

echo "   wpz0_posts:              " . count($posts) . "\n";
echo "   wpz0_terms:              " . count($terms) . "\n";
echo "   wpz0_term_taxonomy:      " . count($termTaxonomy) . "\n";
echo "   wpz0_term_relationships: " . count($termRelationships) . "\n";
echo "   wpz0_postmeta:           " . count($postMeta) . "\n\n";

// Filter published blog posts only
$blogPosts = array_filter($posts, fn($p) => $p['post_type'] === 'post' && $p['post_status'] === 'publish');
echo "3. Published blog posts: " . count($blogPosts) . "\n\n";

// Build categories map
$wpCategories = [];
$categoryMap  = []; // term_id => slug

foreach ($termTaxonomy as $tt) {
    if ($tt['taxonomy'] === 'category' && (int)$tt['term_id'] !== 1) {
        foreach ($terms as $t) {
            if ((int)$t['term_id'] === (int)$tt['term_id']) {
                $wpCategories[] = [
                    'name'        => $t['name'],
                    'slug'        => $t['slug'],
                    'description' => $tt['description'] ?? '',
                ];
                $categoryMap[(int)$t['term_id']] = $t['slug'];
                break;
            }
        }
    }
}
echo "4. Categories: " . count($wpCategories) . "\n\n";

// ─────────────────────────────────────────────
// GENERATE SQL OUTPUT
// ─────────────────────────────────────────────
$now    = date('Y-m-d H:i:s');
$lines  = [];

$lines[] = "-- ============================================================";
$lines[] = "-- Laravel Import SQL — WordPress Migration";
$lines[] = "-- Generated: {$now}";
$lines[] = "-- Source: coachtim_wp900.sql";
$lines[] = "--";
$lines[] = "-- Tables: categories (" . count($wpCategories) . "), posts (" . count($blogPosts) . ")";
$lines[] = "-- ============================================================";
$lines[] = "";
$lines[] = "SET NAMES utf8mb4;";
$lines[] = "SET CHARACTER SET utf8mb4;";
$lines[] = "SET FOREIGN_KEY_CHECKS = 0;";
$lines[] = "";

// ─── CATEGORIES ───
$lines[] = "-- ============================================================";
$lines[] = "-- CATEGORIES";
$lines[] = "-- ============================================================";
$lines[] = "";

foreach ($wpCategories as $cat) {
    $uuid = sq(generateUUID());
    $name = sq($cat['name']);
    $slug = sq($cat['slug']);
    $desc = sq($cat['description'] ?: null);
    $ts   = sq($now);

    // Fix: MySQL needs FROM DUAL for SELECT without a table
    $lines[] = "INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`)";
    $lines[] = "SELECT {$uuid}, {$name}, {$slug}, {$desc}, {$ts}, {$ts} FROM DUAL";
    $lines[] = "WHERE NOT EXISTS (SELECT 1 FROM `categories` WHERE `slug` = {$slug});";
    $lines[] = "";
}

// ─── POSTS ───
$lines[] = "";
$lines[] = "-- ============================================================";
$lines[] = "-- POSTS";
$lines[] = "-- ============================================================";
$lines[] = "";

$importedCount = 0;
$skippedCount  = 0;

foreach ($blogPosts as $post) {
    $postId = (int)$post['ID'];

    // Slug
    $slug = trim($post['post_name'] ?? '');
    if (!$slug) {
        $slug = preg_replace('/[^a-z0-9]+/', '-', strtolower($post['post_title']));
        $slug = trim($slug, '-');
    }

    // Title — decode HTML entities
    $title = html_entity_decode($post['post_title'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8');

    // Content — remove Gutenberg block comments
    $content = cleanContent($post['post_content'] ?? '');

    // Excerpt
    $excerpt = trim($post['post_excerpt'] ?? '') ?: null;

    // Dates
    $postDate = ($post['post_date'] && $post['post_date'] !== '0000-00-00 00:00:00')
        ? $post['post_date'] : $now;
    $modDate  = ($post['post_modified'] && $post['post_modified'] !== '0000-00-00 00:00:00')
        ? $post['post_modified'] : $now;

    // Meta (Yoast SEO)
    $meta        = getPostMeta($postMeta, $postId);
    $seoTitle    = $meta['_yoast_wpseo_title']    ?? null;
    $metaDesc    = $meta['_yoast_wpseo_metadesc'] ?? $excerpt ?? null;
    $canonical   = $meta['_yoast_wpseo_canonical'] ?? null;
    $focusKw     = $meta['_yoast_wpseo_focuskw']  ?? null;

    // Category & Tags
    $category   = getPostCategory($postId, $categoryMap, $termRelationships, $termTaxonomy);
    $tags        = getPostTags($postId, $termRelationships, $termTaxonomy, $terms);
    $tagsJson    = json_encode(array_values($tags), JSON_UNESCAPED_UNICODE);

    // Cover image
    $coverImage  = getCoverImage($post, $meta, $posts);
    
    // Remove the cover image from the content so it doesn't duplicate
    if ($coverImage) {
        $filename = pathinfo($coverImage, PATHINFO_FILENAME);
        $filename = preg_replace('/-\d+x\d+$/', '', $filename);
        $filenameQ = preg_quote($filename, '/');

        // Remove <figure> wrapping the image
        $pattern = '/<figure[^>]*>.*?<img[^>]+src="[^"]*' . $filenameQ . '[^"]*"[^>]*>.*?<\/figure>/is';
        $content = preg_replace($pattern, '', $content);
        
        // Remove <img> tag if it is loose
        $pattern2 = '/<img[^>]+src="[^"]*' . $filenameQ . '[^"]*"[^>]*>/is';
        $content = preg_replace($pattern2, '', $content);
        
        $content = trim($content);
    }

    // ogTitle fallback
    $ogTitle = $seoTitle ?? $title;

    // SQL values
    $uuid = sq(generateUUID());

    $lines[] = "-- [{$postId}] {$title}";
    $lines[] = "INSERT INTO `posts` (";
    $lines[] = "  `id`, `slug`, `title`, `content`, `excerpt`, `metaDescription`,";
    $lines[] = "  `coverImage`, `authorImage`, `authorSocials`,";
    $lines[] = "  `seoTitle`, `ogTitle`, `ogDescription`, `canonicalUrl`, `keywords`,";
    $lines[] = "  `category`, `tags`, `faqs`, `published`, `date`, `author`,";
    $lines[] = "  `created_at`, `updated_at`";
    $lines[] = ") SELECT";
    $lines[] = "  {$uuid},";
    $lines[] = "  " . sq($slug) . ",";
    $lines[] = "  " . sq($title) . ",";
    $lines[] = "  " . sq($content) . ",";
    $lines[] = "  " . sq($excerpt) . ",";
    $lines[] = "  " . sq($metaDesc) . ",";
    $lines[] = "  " . sq($coverImage) . ",";
    $lines[] = "  NULL,";                                   // authorImage
    $lines[] = "  NULL,";                                   // authorSocials (JSON)
    $lines[] = "  " . sq($seoTitle) . ",";
    $lines[] = "  " . sq($ogTitle) . ",";
    $lines[] = "  " . sq($metaDesc) . ",";
    $lines[] = "  " . sq($canonical) . ",";
    $lines[] = "  " . sq($focusKw) . ",";
    $lines[] = "  " . sq($category) . ",";
    $lines[] = "  " . sq($tagsJson) . ",";
    $lines[] = "  NULL,";                                   // faqs (JSON)
    $lines[] = "  1,";                                     // published = true
    $lines[] = "  " . sq($postDate) . ",";
    $lines[] = "  NULL,";                                   // author
    $lines[] = "  " . sq($postDate) . ",";
    $lines[] = "  " . sq($modDate);
    $lines[] = "FROM DUAL";
    $lines[] = "WHERE NOT EXISTS (SELECT 1 FROM `posts` WHERE `slug` = " . sq($slug) . ");";
    $lines[] = "";

    $importedCount++;
}

$lines[] = "SET FOREIGN_KEY_CHECKS = 1;";
$lines[] = "";
$lines[] = "-- ============================================================";
$lines[] = "-- Mukammal! Posts: {$importedCount} | Categories: " . count($wpCategories);
$lines[] = "-- ============================================================";

// Write file
$output = implode("\n", $lines);
file_put_contents($OUTPUT_FILE, $output);

echo "5. SQL file generate ho gayi!\n";
echo "   Output: {$OUTPUT_FILE}\n";
echo "   Size:   " . round(filesize($OUTPUT_FILE) / 1024, 2) . " KB\n\n";

echo "✅ DONE!\n";
echo "   Posts:      {$importedCount}\n";
echo "   Categories: " . count($wpCategories) . "\n\n";
echo "Ab phpMyAdmin me is file ko import karo:\n";
echo "   {$OUTPUT_FILE}\n";
