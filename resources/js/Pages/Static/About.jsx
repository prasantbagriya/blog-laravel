import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function About() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="About Us | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 pb-8 max-w-4xl min-h-[60vh] flex-grow" style={{ paddingTop: '160px' }}>
                <h1 className="text-4xl font-bold mb-8">About Us</h1>
                <div className="prose max-w-none text-lg text-gray-700 space-y-6">
                    <p>Welcome to our platform, your number one source for all things digital marketing, tech insights, and automation strategies. We're dedicated to providing you the very best content, with an emphasis on actionable advice, industry trends, and technical excellence.</p>
                    <p>Founded by a team of passionate developers and marketers, we understand the challenges businesses face in the rapidly evolving digital landscape. Our mission is to bridge the gap between complex technology and practical business application.</p>
                    <p>Whether you're looking to scale your business with WhatsApp automation, master SEO, or stay ahead of the curve in web development, you'll find expert-verified strategies right here.</p>
                    <p>We hope you enjoy our insights as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.</p>
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
