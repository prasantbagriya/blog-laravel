import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} {...props} />;
};

export default function AuthorIndex({ authors }) {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="Our Authors | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 py-8 max-w-6xl mt-16 flex-grow">
                <header className="mb-12 border-b pb-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Our Authors</h1>
                    <p className="text-gray-600">The minds behind the insights.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {authors.map((author) => (
                        <Link key={author.slug} href={window.BASE_PATH + `/author/${author.slug}`} className="block text-center group">
                            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                                <Image src={author.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'} alt={author.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{author.name}</h3>
                            <p className="text-sm text-gray-500">{author.jobTitle}</p>
                        </Link>
                    ))}
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
