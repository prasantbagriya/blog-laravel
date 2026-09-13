import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import React from 'react';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} {...props} />;
};

export default function StoryIndex({ stories }) {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="Web Stories | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 py-8 max-w-6xl mt-16 flex-grow">
                <h1 className="text-4xl font-bold mb-12">Visual Web Stories</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {stories.map((story) => (
                        <Link key={story.id} href={window.BASE_PATH + `/stories/${story.slug}`} className="block relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg group">
                            <Image src={story.posterImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={story.title} fill style={{ objectFit: 'cover' }} className="transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                <h3 className="text-white font-bold text-lg leading-tight">{story.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
