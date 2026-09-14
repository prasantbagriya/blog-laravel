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

export default function AuthorShow({ author, posts, meta }) {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <SeoMeta meta={meta} />
            <GlobalNavbar />
            <main className="container mx-auto px-4 py-8 max-w-6xl mt-16 flex-grow">
                <header className="mb-12 border-b pb-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                        <Image src={author.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'} alt={author.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{author.name}</h1>
                        <h2 className="text-xl text-blue-600 font-semibold mb-4">{author.jobTitle}</h2>
                        <div className="prose max-w-2xl text-gray-700" dangerouslySetInnerHTML={{ __html: author.bio }} />
                    </div>
                </header>

                <h3 className="text-2xl font-bold mb-6">Articles by {author.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article key={post.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                            <Link href={window.BASE_PATH + `/blog/${post.slug}`} className="relative h-48 block">
                                <Image src={post.coverImage || '/uploads/read.webp'} alt={post.title} fill style={{ objectFit: 'cover' }} />
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
