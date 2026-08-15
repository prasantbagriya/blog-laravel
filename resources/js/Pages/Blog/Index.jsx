import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import React from 'react';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} {...props} />;
};

export default function Index({ posts }) {
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "All Articles & Insights | Blog",
        "url": typeof window !== 'undefined' ? window.location.href : "https://coachingsinsikar.com/blog",
        "description": "Read the latest articles, insights, and news from our official blog.",
        "publisher": {
            "@type": "Organization",
            "name": "Nexus",
            "logo": {
                "@type": "ImageObject",
                "url": "https://coachingsinsikar.com/images/logo.png"
            }
        },
        "hasPart": posts.map(post => ({
            "@type": "Article",
            "headline": post.title,
            "url": `https://coachingsinsikar.com/blog/${post.slug}`,
            "author": {
                "@type": "Person",
                "name": post.author
            }
        }))
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white min-h-screen">
            <Head title="All Posts | Blog">
                <meta name="description" content="Read the latest articles, insights, and news from our official blog." />
                <script type="application/ld+json">
                    {JSON.stringify(collectionSchema)}
                </script>
            </Head>
            
            <GlobalNavbar />
            
            <main className="container mx-auto px-4 pb-8 max-w-6xl min-h-[60vh]" style={{ paddingTop: '160px' }}>
                <h1 className="text-4xl font-bold mb-12">All Articles & Insights</h1>
                
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
                                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                                    <span>{formatDate(post.date)}</span>
                                    <Link href={window.BASE_PATH + '/author/' + (post.author ? post.author.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')} className="font-semibold hover:text-blue-600 hover:underline">
                                        {post.author}
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <BlogFooter />
        </div>
    );
}
