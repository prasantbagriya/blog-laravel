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
                <div className="prose max-w-none text-gray-700 space-y-4 pb-12">
                    <p>Last Updated: September 2026</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">1. Our Commitment to Accuracy</h2>
                    <p>CoachingsInSikar.com is committed to providing accurate, reliable, and up-to-date information about coaching institutes in Sikar, Rajasthan, including their courses, fees, faculty, results, facilities, and contact details. We understand that students and parents rely on this information to make important academic decisions, and we take this responsibility seriously.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">2. Sources of Information</h2>
                    <p>Information published on this website is compiled from the following sources:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Official websites, brochures, and prospectuses of coaching institutes</li>
                        <li>Direct communication with institute representatives (phone, email, or in-person visits)</li>
                        <li>Publicly available exam results (JEE, NEET, and other competitive exam boards)</li>
                        <li>Verified social media pages and official YouTube channels of institutes</li>
                        <li>Google Business listings and publicly visible reviews</li>
                        <li>Site visits and physical verification of infrastructure, where applicable</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">3. Verification Process</h2>
                    <p>Before any information is published or updated on our platform, we follow this verification process:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Cross-referencing:</strong> Fee structures, addresses, and course details are cross-checked against at least two independent sources (e.g., the institute's own website and direct confirmation via phone/email).</li>
                        <li><strong>Results verification:</strong> Topper names, All India Ranks (AIR), and selection numbers are verified against official exam board results or institute-issued result sheets, wherever publicly accessible. We do not fabricate or estimate rank data.</li>
                        <li><strong>Contact information:</strong> Phone numbers, addresses, and website links are tested/validated periodically to ensure they are active and correct.</li>
                        <li><strong>Ratings and reviews:</strong> Star ratings sourced from third-party platforms (e.g., Google) are attributed to their original source and are not altered or inflated by our editorial team.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">4. Timeliness of Data</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Fee structures, course details, and facility information are reviewed and updated at least once per academic session, or sooner if an institute notifies us of a change.</li>
                        <li>Result and topper data is updated after each major exam result declaration (JEE, NEET, etc.).</li>
                        <li>Any information that cannot be verified within a reasonable timeframe is either removed or clearly marked as &quot;unverified&quot; or &quot;pending confirmation.&quot;</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">5. Corrections Policy</h2>
                    <p>We recognize that errors can occur despite our best efforts. If you are a student, parent, or an institute representative and believe any information on our website is inaccurate, outdated, or misleading:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You may report it via our Contact Us page or the official email/phone number listed on our Contact page.</li>
                        <li>Please include the specific page URL, the incorrect information, and (where possible) supporting evidence for the correction.</li>
                        <li>We aim to review and respond to correction requests within 3–5 business days.</li>
                        <li>Verified corrections are updated promptly, and where relevant, we note the date of the correction.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">6. Institute-Submitted Information</h2>
                    <p>Where information is submitted directly by a coaching institute (e.g., through a listing request or callback form), we clearly disclose this and independently verify key claims (such as results, fees, and facilities) before publishing, rather than publishing promotional claims as-is.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">7. Disclaimers</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Selection ratios, ranks, and results are presented as reported/verified at the time of publishing and are subject to change as institutes release updated data.</li>
                        <li>CoachingsInSikar.com does not guarantee admission outcomes, fee stability, or institute performance in future academic sessions.</li>
                        <li>Sponsored listings or partnerships (if any) are clearly labeled as such and do not influence the accuracy of factual information presented.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">8. Editorial Independence</h2>
                    <p>Our fact-checking and content teams operate independently of any advertising or partnership arrangements. No institute can pay to have inaccurate or unverifiable claims published on our platform.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact for Fact-Checking Queries</h2>
                    <p>For any concerns regarding the accuracy of content on this website, please reach out via the contact details listed on our Contact Us page.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
