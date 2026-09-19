import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function Terms() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head>
                <title>CoachingsinSikar Terms & Conditions</title>
                <meta name="description" content="Read the terms and conditions for using CoachingsinSikar. Learn about acceptable use, content rights, disclaimers, and other rules for this education guide." />
                <meta name="keywords" content="CoachingsinSikar terms, website terms and conditions, terms of use, user responsibilities, website usage rules, content terms, disclaimer, user agreement, CoachingsinSikar terms and conditions, terms of use CoachingsinSikar, website terms Sikar" />
                <meta property="og:title" content="CoachingsinSikar Terms & Conditions" />
                <meta property="og:description" content="These terms explain how you can use CoachingsinSikar, what content rights we hold, and important disclaimers for students, parents, and other visitors." />
                <meta name="twitter:title" content="Website Terms & Conditions | CoachingsinSikar" />
                <meta name="twitter:description" content="Before using CoachingsinSikar, read our terms and conditions. They cover acceptable use, content ownership, disclaimers, and other key rules for this education guide." />
            </Head>
            <GlobalNavbar />
            <main className="w-full px-[25px] pb-8 flex-grow" style={{ paddingTop: '100px' }}>
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose max-w-none text-gray-700 space-y-6">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">1. Agreement to Terms</h2>
                    <p>By accessing our website, you agree to be bound by these Terms of Service and to use the site in accordance with these Terms of Service, our Privacy Policy and any additional terms and conditions that may apply to specific sections of the site.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">2. Intellectual Property Rights</h2>
                    <p>Unless otherwise stated, we or our licensors own the intellectual property rights in the website and material on the website. Subject to the license below, all these intellectual property rights are reserved.</p>
                    <p>You may view, download for caching purposes only, and print pages from the website for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">3. Restrictions</h2>
                    <p>You must not:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Republish material from this website (including republication on another website);</li>
                        <li>Sell, rent or sub-license material from the website;</li>
                        <li>Reproduce, duplicate, copy or otherwise exploit material on our website for a commercial purpose;</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitations of Liability</h2>
                    <p>We will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special or consequential loss; or for any business losses, loss of revenue, income, profits or anticipated savings.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
