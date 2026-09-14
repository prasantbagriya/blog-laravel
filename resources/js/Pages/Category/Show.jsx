import React from 'react';
import { Link } from '@inertiajs/react';
import SeoMeta from '../../NextComponents/SeoMeta';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import { Tag, ArrowRight, Calendar, BookOpen, ChevronRight } from 'lucide-react';
import { PageHero, PillBadge, AmberPillButton } from '../../NextComponents/UI';

const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} {...props} />;
};

export default function CategoryShow({ categoryName, posts, meta }) {
    const basePath = typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '';

    return (
        <div className="bg-white dark:bg-[#09090b] min-h-screen flex flex-col font-sans">
            <SeoMeta meta={meta} />
            <GlobalNavbar />

            {/* Hero Header */}
            {/* Hero Header */}
            <PageHero
                badge="Category"
                badgeIcon={Tag}
                title={categoryName}
                description={
                    <><span className="font-bold text-slate-700 dark:text-zinc-200">{posts.length}</span> articles in this category</>
                }
            >
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500 font-medium mt-6">
                    <Link href={basePath + '/'} className="hover:text-amber-500 transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href={basePath + '/category'} className="hover:text-amber-500 transition-colors">Categories</Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-slate-600 dark:text-zinc-300">{categoryName}</span>
                </nav>
            </PageHero>

            {/* Posts Grid */}
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800/60">
                <div className="max-w-7xl mx-auto">
                    {posts.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-7 h-7 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No articles yet</h3>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">Check back soon — we're constantly adding new content.</p>
                            <AmberPillButton as={Link} href={basePath + '/'}>
                                Back to Home
                            </AmberPillButton>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                >
                                    {/* Cover Image */}
                                    <Link href={basePath + `/blog/${post.slug}`} className="relative h-48 block overflow-hidden">
                                        <Image
                                            src={post.coverImage || '/uploads/read.webp'}
                                            alt={post.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>

                                    {/* Content */}
                                    <div className="p-5 flex-grow flex flex-col">
                                        {/* Category Badge */}
                                        <div className="mb-3">
                                            <PillBadge icon={Tag} color="amber">
                                                {post.category || categoryName}
                                            </PillBadge>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            <Link href={basePath + `/blog/${post.slug}`}>{post.title}</Link>
                                        </h2>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4 flex-grow">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Footer */}
                                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                                            </div>
                                            <Link
                                                href={basePath + `/blog/${post.slug}`}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:gap-2 transition-all"
                                            >
                                                Read <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <BlogFooter />
        </div>
    );
}
