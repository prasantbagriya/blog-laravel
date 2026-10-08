import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function EditorialPolicy() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head>
                <title>CoachingsinSikar | Content Creation & Editorial Policy</title>
                <meta name="description" content="Learn how CoachingsinSikar creates and maintains content, including editorial standards, research, sourcing, updates, transparency, and corrections." />
                <meta name="keywords" content="Content creation policy, editorial quality, research and sources, editorial policy CoachingsinSikar, content standards education blog Sikar, coaching guides Sikar content review, fact-checking process coachingsinsikar.com, CoachingsinSikar content policy, Sikar coaching editorial principles, editorial transparency, reliable education content, content publishing policy, research and sourcing policy" />
                <meta property="og:title" content="CoachingsinSikar | Content Creation & Editorial Policy" />
                <meta property="og:description" content="Our editorial policy explains how CoachingsinSikar researches, writes, and updates articles on coachings, schools, and education in Sikar, with a focus on accuracy and honesty." />
                <meta name="twitter:title" content="Content & Editorial Policy of CoachingsinSikar" />
                <meta name="twitter:description" content="Read how CoachingsinSikar maintains editorial quality. This page covers our standards, fact‑checking, update process, accuracy policy for coaching reviews, transparency in coaching coverage, and commitment to honest, local education information." />
            </Head>
            <GlobalNavbar />
            <main className="w-full px-[25px] pt-4 md:pt-6 pb-8 flex-grow">
                <h1 className="text-4xl font-bold mb-8">Editorial Policy</h1>
                <div className="prose max-w-none text-gray-700 space-y-4 pb-12">
                    <p>Last Updated: September 2026</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">1. Purpose</h2>
                    <p>This Editorial Policy outlines the principles, standards, and processes that guide the content published on CoachingsInSikar.com. Our goal is to help students and parents in Sikar make informed decisions about coaching institutes through content that is accurate, balanced, and useful — free from undue commercial influence.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">2. Scope</h2>
                    <p>This policy applies to all content published on the website, including:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Institute listing pages and profiles</li>
                        <li>Comparison and &quot;Top 5 / Best of&quot; blog articles</li>
                        <li>Fee, results, and toppers information</li>
                        <li>Reviews and ratings displays</li>
                        <li>Sponsored or partner content (where applicable)</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">3. Editorial Principles</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Accuracy first:</strong> All factual claims (fees, results, addresses, facilities) must be verified per our Fact-Checking Policy before publication.</li>
                        <li><strong>Fairness and balance:</strong> Comparison articles (e.g., &quot;Top 5 JEE Coachings in Sikar&quot;) are based on transparent, stated criteria — such as verified results, Google ratings, and years of establishment — applied consistently across all institutes covered, not on payment or preference.</li>
                        <li><strong>Clarity of criteria:</strong> Whenever institutes are ranked or compared, the ranking methodology is either stated in the article or available on request.</li>
                        <li><strong>No plagiarism:</strong> Content is original or properly attributed; we do not copy institute marketing material verbatim and present it as independent editorial content.</li>
                        <li><strong>Currency:</strong> Content referencing exam years, fees, or results is dated, and outdated articles are updated or clearly marked with the applicable year/session.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">4. Editorial Independence</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Editorial decisions — what to publish, how institutes are ranked or described, and what corrections are made — are made independently of the advertising, partnerships, or lead-generation (&quot;Get a Callback&quot;) functions of the website.</li>
                        <li>Institutes cannot pay for a higher ranking, a better review, or removal of accurate but unfavorable information.</li>
                        <li>Any institute that has a commercial relationship with CoachingsInSikar.com (e.g., listing fees, referral partnerships) will have this disclosed where relevant, in line with our Sponsored Content Disclosure below.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">5. Sponsored Content &amp; Advertising Disclosure</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Any paid placement, sponsored listing, or affiliate/referral arrangement is clearly labeled (e.g., &quot;Sponsored,&quot; &quot;Partner Listing,&quot; or similar) so readers can distinguish it from independent editorial content.</li>
                        <li>Sponsorship may affect visibility or featured placement of a listing, but it does not affect the accuracy of the factual information presented about that institute.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">6. Author &amp; Review Standards</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Articles and listings are drafted and/or reviewed by our content team before publishing.</li>
                        <li>Content involving specific claims (rank data, fee figures, selection ratios) is checked against the sourcing standards in our Fact-Checking Policy prior to going live.</li>
                        <li>Significant edits to previously published rankings or comparisons (e.g., reordering a &quot;Top 5&quot; list) are made only when supported by updated, verifiable data — not on request from an institute alone.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">7. Corrections and Updates</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Readers, students, parents, and institutes can request a correction via our Contact Us page.</li>
                        <li>Confirmed factual errors are corrected promptly; where an article has been substantively updated (e.g., new toppers list, revised fees), we note the update date.</li>
                        <li>Minor errors (typos, formatting) are corrected without special notation; material factual corrections are noted transparently.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">8. User-Generated Content (Reviews/Ratings)</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Where third-party ratings (e.g., Google reviews) are displayed, they are attributed to their original source and not edited or fabricated by our team.</li>
                        <li>We do not remove genuine negative reviews or ratings at an institute's request unless they violate applicable law (e.g., defamation, harassment) or our own community guidelines.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">9. Conflicts of Interest</h2>
                    <p>Any staff member or contributor with a personal or financial interest in a specific coaching institute must disclose this to the editorial team and recuse themselves from writing about or ranking that institute.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">10. Contact</h2>
                    <p>Questions about this Editorial Policy, or requests for corrections, can be sent through the contact details listed on our Contact Us page.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
