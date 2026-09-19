import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function FactCheckingPolicy() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head>
                <title>CoachingsinSikar Fact-Checking Standards | Verification & Accuracy</title>
                <meta name="description" content="Understand the fact-checking standards used by CoachingsinSikar to review claims, verify sources, improve accuracy, and correct published information." />
                <meta name="keywords" content="CoachingsinSikar fact checking policy, how we verify coachingsinsikar.com, correction policy education blog Sikar, accuracy standards coaching guides, fact verification process coachingsinsikar.com, reliable education information Sikar, Fact checking policy CoachingsinSikar, how we verify facts Sikar" />
                <meta property="og:title" content="CoachingsinSikar Fact-Checking Standards | Verification & Accuracy" />
                <meta property="og:description" content="This page explains how CoachingsinSikar checks facts, handles corrections, and maintains accuracy in all articles about coaching, schools, and education in Sikar." />
                <meta name="twitter:title" content="Fact-Checking Standards of CoachingsinSikar" />
                <meta name="twitter:description" content="See how CoachingsinSikar verifies information. Our fact‑checking policy covers verification steps, corrections, and our commitment to accurate, trustworthy education content" />
            </Head>
            <GlobalNavbar />
            <main className="w-full px-[25px] pb-8 flex-grow" style={{ paddingTop: '100px' }}>
                <h1 className="text-4xl font-bold mb-8">Fact-Checking Policy</h1>
                <div className="prose max-w-none text-gray-700 space-y-6">
                    <p>We take the accuracy of our content very seriously. Our readers rely on us for correct information, and we are committed to maintaining the highest standards of journalistic integrity.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Our Process</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Primary Sources:</strong> We rely on primary sources whenever possible, including official documentation, direct interviews, academic papers, and verified data sets.</li>
                        <li><strong>Verification:</strong> Claims of fact are cross-referenced against multiple reliable sources before publication.</li>
                        <li><strong>Expert Review:</strong> Highly technical or specialized content is reviewed by subject matter experts prior to publication.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Corrections Policy</h2>
                    <p>Despite our best efforts, errors occasionally occur. When they do, we are committed to correcting them promptly and transparently.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>If you spot an error, please report it to us via our Contact page.</li>
                        <li>Substantive corrections will be noted at the bottom of the article, detailing what was changed and when.</li>
                        <li>Minor typographical errors or formatting issues are corrected without a formal correction notice.</li>
                    </ul>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
