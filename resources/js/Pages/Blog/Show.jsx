import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import React, { useEffect, useRef, useState } from 'react';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} {...props} />;
};

export default function Show({ post }) {
    const contentRef = useRef(null);
    const [toc, setToc] = useState([]);

    useEffect(() => {
        if (!contentRef.current) return;

        // Lazy load images for Web Vitals optimization
        const images = contentRef.current.querySelectorAll('img');
        images.forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });

        // Generate Table of Contents
        const headings = contentRef.current.querySelectorAll('h2');
        const tocItems = [];
        headings.forEach((heading, index) => {
            const id = `toc-heading-${index}`;
            heading.id = id;
            tocItems.push({ id, text: heading.innerText });
        });
        setToc(tocItems);
    }, [post]);

    if (!post) return <div>Post not found</div>;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://coachingsinsikar.com/blog/${post.slug}`;
    const plainTextExcerpt = post.excerpt ? post.excerpt.replace(/<[^>]*>?/gm, '').substring(0, 160) : `Read this article by ${post.author} on Nexus.`;
    
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
        },
        "headline": post.title,
        "description": plainTextExcerpt,
        "image": post.coverImage || "https://coachingsinsikar.com/images/default-blog.jpg",
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Nexus",
            "logo": {
                "@type": "ImageObject",
                "url": "https://coachingsinsikar.com/images/logo.png"
            }
        },
        "datePublished": post.date,
        "dateModified": post.updated_at || post.date
    };

    return (
        <div className="bg-white min-h-screen">
            <Head title={`${post.title || 'Blog'} | Blog`}>
                <meta name="description" content={plainTextExcerpt} />
                <link rel="canonical" href={currentUrl} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={plainTextExcerpt} />
                <meta property="og:image" content={post.coverImage || "https://coachingsinsikar.com/images/default-blog.jpg"} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={plainTextExcerpt} />
                <meta name="twitter:image" content={post.coverImage || "https://coachingsinsikar.com/images/default-blog.jpg"} />
                <script type="application/ld+json">
                    {JSON.stringify(blogSchema)}
                </script>
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

                    {/* Table of Contents */}
                    {toc.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 max-w-md">
                            <h3 className="text-xl font-bold mb-4 text-slate-800">Table of Contents</h3>
                            <ul className="space-y-2 text-blue-600">
                                {toc.map((item) => (
                                    <li key={item.id} className="font-medium text-sm">
                                        <a href={`#${item.id}`} className="hover:underline">{item.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Blog Content */}
                    <div 
                        ref={contentRef}
                        className="prose prose-lg max-w-none prose-blue"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    {/* Community Cross-Promotion CTA */}
                    <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm text-center">
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Join the Conversation!</h3>
                        <p className="text-slate-600 mb-6 text-lg">What are your thoughts on this topic? Discuss this article and more with our active community on Nexus.</p>
                        <Link href="/feed" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-md">
                            Go to Community
                        </Link>
                    </div>
                </article>
            </main>

            <BlogFooter />
        </div>
    );
}
