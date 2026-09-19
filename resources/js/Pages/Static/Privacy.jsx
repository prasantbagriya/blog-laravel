import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function Privacy() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head>
                <title>CoachingsinSikar Privacy Policy | Data & User Information</title>
                <meta name="description" content="CoachingsinSikar Privacy Policy explains how information is collected, used, protected, and handled when you use our website." />
                <meta name="keywords" content="CoachingsinSikar privacy policy, privacy policy CoachingsinSikar, cookie policy education blog Sikar, personal information privacy CoachingsinSikar, user data handling coaching site" />
                <meta property="og:title" content="CoachingsinSikar Privacy Policy | Data & User Information" />
                <meta property="og:description" content="Understand how CoachingsinSikar handles your personal data, cookies, and site information. This privacy policy explains your rights and how we protect your privacy." />
                <meta name="twitter:title" content="CoachingsinSikar | Data & Privacy Policy" />
                <meta name="twitter:description" content="Your privacy matters on CoachingsinSikar. Read our privacy policy to see how we collect, use, and safeguard your personal information on this education guide." />
            </Head>
            <GlobalNavbar />
            <main className="w-full px-[25px] pb-8 flex-grow" style={{ paddingTop: '100px' }}>
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose max-w-none text-gray-700 space-y-6">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
                    <p>Welcome to our Privacy Policy. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">2. The Data We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                        <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal obligation.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies</h2>
                    <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
