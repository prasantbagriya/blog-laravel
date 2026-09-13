import React from 'react';
import { Link } from '@inertiajs/react';
import SeoMeta from '../../NextComponents/SeoMeta';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} {...props} />;
};

export default function CategoryShow({ categoryName, posts, meta }) {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <SeoMeta meta={meta} />
            <GlobalNavbar />
            <main className="container mx-auto px-4 py-8 max-w-6xl mt-16 flex-grow">
                <header className="mb-12 border-b pb-8">
                    <h1 className="text-4xl font-bold mb-4">Category: {categoryName}</h1>
                    <p className="text-gray-600">Showing {posts.length} articles in this category.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article key={post.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                            <Link href={window.BASE_PATH + `/blog/${post.slug}`} className="relative h-48 block">
                                <Image src={post.coverImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={post.title} fill style={{ objectFit: 'cover' }} />
                            </Link>
                            <div className="p-6 flex flex-col flex-grow">
                                <span className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-2">{post.category}</span>
                                <h2 className="text-xl font-bold mb-3">
                                    <Link href={window.BASE_PATH + `/blog/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
