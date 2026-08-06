import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import React from 'react';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} {...props} />;
};

export default function Show({ post }) {
    if (!post) return <div>Post not found</div>;

    return (
        <div className="bg-white min-h-screen">
            <Head title={`${post.title || 'Blog'} | Blog`}>
                <meta name="description" content={post.excerpt || ""} />
            </Head>

            <GlobalNavbar />
            
            <main className="container mx-auto px-4 pb-8 max-w-4xl min-h-[60vh]" style={{ paddingTop: '160px' }}>
                <article>
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                        
                        <div className="flex items-center gap-4 text-gray-600 mb-8">
                            {post.authorImage && (
                                <img src={post.authorImage} alt={post.author} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                                <Link href={window.BASE_PATH + '/author/' + (post.author ? post.author.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')} className="font-semibold hover:text-blue-600 hover:underline">
                                    {post.author}
                                </Link>
                                <p className="text-sm">{post.date}</p>
                            </div>
                        </div>

                        {post.coverImage && (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
                                <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} />
                            </div>
                        )}
                    </header>

                    {/* Blog Content */}
                    <div 
                        className="prose prose-lg max-w-none prose-blue"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </main>

            <BlogFooter />
        </div>
    );
}
