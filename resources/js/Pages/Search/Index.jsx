import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

export default function SearchIndex() {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="Search | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 py-8 max-w-4xl mt-16 flex-grow">
                <h1 className="text-4xl font-bold mb-8">Search</h1>
                <div className="mb-8">
                    <input type="text" placeholder="Search articles..." className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="text-gray-600">Search functionality will be implemented in the next iteration.</div>
            </main>
            <BlogFooter />
        </div>
    );
}
