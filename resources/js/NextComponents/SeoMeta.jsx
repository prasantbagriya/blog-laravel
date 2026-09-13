import React from 'react';
import { Head } from '@inertiajs/react';

export default function SeoMeta({ meta }) {
    if (!meta) return null;

    const finalTitle = meta.title || 'Coachingsinsikar | Education News, Exams & Coaching Updates';
    const finalDescription = meta.description || 'Coachings in Sikar brings you the latest education news, exam results, Olympiads, coaching updates, and school information from Sikar and beyond. Our goal is to provide students and parents with simple, useful, and reliable education updates in one place. Stay informed with clear and relevant content to make better academic decisions.';
    const finalOgTitle = meta.og_title || finalTitle;
    const finalOgDesc = meta.og_description || finalDescription;
    const finalRobots = meta.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    const finalUrl = meta.url || (typeof window !== 'undefined' ? window.location.href : '');
    const finalType = meta.type || 'website';
    const finalOgImage = meta.og_image || '';
    const finalTwitterCard = meta.twitter_card || (finalOgImage ? 'summary_large_image' : 'summary');
    const finalTwitterTitle = meta.twitter_title || finalTitle;
    const finalTwitterDesc = meta.twitter_description || finalDescription;

    return (
        <Head>
            <title>{finalTitle}</title>
            <meta head-key="description" name="description" content={finalDescription} />
            <meta head-key="robots" name="robots" content={finalRobots} />
            
            {meta.is_ai_assisted && <meta head-key="generator" name="generator" content="AI-Assisted" />}
            
            <link head-key="canonical" rel="canonical" href={finalUrl} />
            
            <meta head-key="og:title" property="og:title" content={finalOgTitle} />
            <meta head-key="og:description" property="og:description" content={finalOgDesc} />
            <meta head-key="og:url" property="og:url" content={finalUrl} />
            <meta head-key="og:type" property="og:type" content={finalType} />
            
            {finalOgImage && <meta head-key="og:image" property="og:image" content={finalOgImage} />}
            {finalOgImage && <meta head-key="og:image:width" property="og:image:width" content="1200" />}
            {finalOgImage && <meta head-key="og:image:height" property="og:image:height" content="630" />}
            {finalOgImage && <meta head-key="twitter:image" name="twitter:image" content={finalOgImage} />}
            
            <meta head-key="twitter:card" name="twitter:card" content={finalTwitterCard} />
            <meta head-key="twitter:site" name="twitter:site" content="@coachingsinsikar" />
            <meta head-key="twitter:creator" name="twitter:creator" content="@coachingsinsikar" />
            <meta head-key="twitter:title" name="twitter:title" content={finalTwitterTitle} />
            <meta head-key="twitter:description" name="twitter:description" content={finalTwitterDesc} />
            
            {meta.keywords && <meta head-key="keywords" name="keywords" content={meta.keywords} />}
            
            {meta.schemas && Array.isArray(meta.schemas) && meta.schemas.map((schema, index) => (
                <script head-key={`schema-${index}`} type="application/ld+json" key={index} dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            ))}
        </Head>
    );
}
