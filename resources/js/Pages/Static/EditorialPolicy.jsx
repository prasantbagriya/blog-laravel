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
            <main className="w-full px-[25px] pb-8 flex-grow" style={{ paddingTop: '100px' }}>
                <h1 className="text-4xl font-bold mb-8">Editorial Policy</h1>
                <div className="prose max-w-none text-gray-700 space-y-6">
                    <p>Our editorial mission is to provide accurate, comprehensive, and unbiased information about technology, marketing, and business strategies.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Core Principles</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Accuracy:</strong> We strive to ensure that all information we publish is accurate and up-to-date. All articles undergo review by our editorial team.</li>
                        <li><strong>Independence:</strong> Our editorial content is not influenced by our advertisers. We maintain a strict separation between advertising and editorial content.</li>
                        <li><strong>Transparency:</strong> We are clear about any potential conflicts of interest. Sponsored content is always clearly labeled.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Content Updates</h2>
                    <p>The digital landscape changes rapidly. We regularly review and update our existing content to ensure it remains accurate and relevant. When significant updates are made, we note the date of the update at the top or bottom of the article.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">AI Usage Policy</h2>
                    <p>While we may use AI tools for research, outlining, or grammar checking, all final content is written, reviewed, and verified by human experts. We do not publish raw, unedited AI-generated articles.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
