import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import React, { useEffect, useRef, useState } from 'react';
import SeoMeta from '../../NextComponents/SeoMeta';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} {...props} />;
};

export default function Show({ post, recentPosts, meta }) {
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatIST = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata' }).replace(' ', 'T') + '+05:30';
    };

    const finalCanonicalUrl = post.canonicalUrl || `https://coachingsinsikar.com/blog/${post.slug}`;
    const displayAuthor = post.author?.toLowerCase() === 'prasant' ? 'Prashant' : post.author;

    return (
        <div className="bg-white min-h-screen">
            <SeoMeta meta={meta} />


            <GlobalNavbar />
            
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto w-full px-[15px] pb-8" style={{ paddingTop: '100px' }}>
                <main className="w-full lg:w-[70%]">
                    <article>
                    <header className="mb-8">
                        {post.category && (
                            <Link href={`${window.BASE_PATH}/category/${(post.category.toLowerCase() === 'eduction' ? 'education' : post.category).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3 block hover:underline">
                                {post.category.toLowerCase() === 'eduction' ? 'Education' : post.category}
                            </Link>
                        )}
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                        
                        {post.isSponsored && (
                            <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
                                Sponsored Content
                            </div>
                        )}

                        <div className="flex items-center gap-4 text-gray-600 mb-8">
                            {post.authorImage && (
                                <img loading="lazy" decoding="async" fetchPriority="low" src={post.authorImage.startsWith('http') || post.authorImage.startsWith('/') ? post.authorImage : '/' + post.authorImage} alt={displayAuthor} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                                <Link href={window.BASE_PATH + '/author/' + (displayAuthor ? displayAuthor.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')} className="font-semibold text-lg text-slate-800 hover:text-blue-600 hover:underline">
                                    {displayAuthor}
                                </Link>
                                {post.authorJobTitle && (
                                    <p className="text-sm font-medium text-slate-500">{post.authorJobTitle}</p>
                                )}
                                {post.authorAwards && post.authorAwards.length > 0 && (
                                    <p className="text-xs font-semibold text-amber-600 mt-0.5 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                                        {post.authorAwards[0]} {post.authorAwards.length > 1 ? `+${post.authorAwards.length - 1}` : ''}
                                    </p>
                                )}
                                <p className="text-xs text-slate-600 mt-1">{formatDate(post.date)}</p>
                            </div>
                        </div>

                        {post.factCheckedBy && (
                            <div className="flex items-center gap-2 mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle-2 text-emerald-600"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                                <span>Fact-checked by <strong>{post.factCheckedBy}</strong> {post.factCheckerRole ? `(${post.factCheckerRole})` : ''}</span>
                            </div>
                        )}

                        {post.coverImage && (
                            <div className="relative w-full max-w-[800px] mx-auto rounded-xl overflow-hidden mb-8 shadow-lg" style={{ aspectRatio: '1080/630' }}>
                                <Image src={post.coverImage} alt={post.title} fill style={{ objectFit: 'cover' }} priority={true} />
                            </div>
                        )}
                    </header>

                    {/* Social Share */}
                    <div className="flex flex-wrap items-center gap-3 mb-8 border-y border-slate-100 py-4">
                        <span className="font-semibold text-slate-700 mr-2">Share this article:</span>
                        
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(finalCanonicalUrl)}&text=${encodeURIComponent(meta?.title || post.title)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded-full text-sm font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                            Twitter
                        </a>

                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(finalCanonicalUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-full text-sm font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            Facebook
                        </a>

                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(finalCanonicalUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-full text-sm font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            LinkedIn
                        </a>
                        
                        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent((meta?.title || post.title) + ' ' + finalCanonicalUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-600 rounded-full text-sm font-medium transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                            WhatsApp
                        </a>
                    </div>

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

                    {/* Key Takeaways */}
                    {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 text-amber-900 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                Key Takeaways
                            </h3>
                            <ul className="space-y-3">
                                {post.keyTakeaways.map((takeaway, index) => (
                                    <li key={index} className="flex gap-3 text-amber-800">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                                        <span>{takeaway}</span>
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

                    {/* Sources */}
                    {post.sources && post.sources.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-slate-200">
                            <h4 className="text-lg font-bold text-slate-800 mb-4">Sources & References</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                {post.sources.map((source, idx) => (
                                    <li key={idx}>
                                        <span className="mr-2 text-slate-600">[{idx + 1}]</span>
                                        {source.url ? (
                                            <a href={source.url} target="_blank" rel="nofollow noreferrer" className="hover:text-blue-600 hover:underline">
                                                {source.title || source.url}
                                            </a>
                                        ) : (
                                            <span>{source.title}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Corrections */}
                    {post.corrections && post.corrections.length > 0 && (
                        <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                            <h4 className="text-md font-bold text-slate-700 mb-3">Corrections & Updates</h4>
                            <ul className="space-y-3 text-sm text-slate-600">
                                {post.corrections.map((corr, idx) => (
                                    <li key={idx} className="flex flex-col sm:flex-row gap-2">
                                        <span className="font-semibold text-slate-800 shrink-0">{formatDate(corr.date)}:</span>
                                        <span>{corr.note}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2">
                            {post.tags.map((tag, idx) => (
                                <Link key={idx} href={`${window.BASE_PATH}/category/${tag.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    )}
                    {/* About the Author */}
                    <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {post.authorImage && (
                                <img loading="lazy" decoding="async" fetchPriority="low" src={post.authorImage.startsWith('http') || post.authorImage.startsWith('/') ? post.authorImage : '/' + post.authorImage} alt={displayAuthor} className="w-24 h-24 rounded-full object-cover shrink-0 ring-4 ring-slate-50" />
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{displayAuthor}</h3>
                                {post.authorJobTitle && <p className="text-blue-600 font-medium text-sm mb-3">{post.authorJobTitle}</p>}
                                
                                {post.authorBio && (
                                    <p className="text-slate-600 leading-relaxed text-sm mb-4">
                                        {post.authorBio}
                                    </p>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 pt-4 border-t border-slate-100">
                                    {post.authorExperienceYears > 0 && (
                                        <div>
                                            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Experience</span>
                                            <span className="text-sm font-semibold text-slate-700">{post.authorExperienceYears}+ Years</span>
                                        </div>
                                    )}

                                    {post.authorAwards && post.authorAwards.length > 0 && (
                                        <div>
                                            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Awards</span>
                                            <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                                                {post.authorAwards[0]} {post.authorAwards.length > 1 ? `+${post.authorAwards.length - 1}` : ''}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {post.authorAlumniOf && post.authorAlumniOf.length > 0 && (
                                        <div>
                                            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Alumni</span>
                                            <span className="text-sm font-semibold text-slate-700">{post.authorAlumniOf[0].name}</span>
                                        </div>
                                    )}
                                </div>
                                
                                {post.authorSocials && (post.authorSocials.twitter || post.authorSocials.linkedin || post.authorSocials.website) && (
                                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                        {post.authorSocials.twitter && (
                                            <a href={post.authorSocials.twitter} target="_blank" rel="nofollow noreferrer" className="p-2 bg-slate-50 text-slate-500 hover:text-blue-500 rounded-full transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                                            </a>
                                        )}
                                        {post.authorSocials.linkedin && (
                                            <a href={post.authorSocials.linkedin} target="_blank" rel="nofollow noreferrer" className="p-2 bg-slate-50 text-slate-500 hover:text-blue-700 rounded-full transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                                            </a>
                                        )}
                                        {post.authorSocials.website && (
                                            <a href={post.authorSocials.website} target="_blank" rel="nofollow noreferrer" className="p-2 bg-slate-50 text-slate-500 hover:text-green-600 rounded-full transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Community Cross-Promotion CTA */}
                    <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm text-center">
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Join the Conversation!</h3>
                        <p className="text-slate-600 mb-6 text-lg">What are your thoughts on this topic? Discuss this article and more with our active community on coachingsinsikar.</p>
                        <Link href="/feed" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-md">
                            Go to Community
                        </Link>
                    </div>
                    </article>
                </main>

                {/* Right Sidebar */}
                <aside className="w-full lg:w-[30%]">
                    <div style={{ position: 'sticky', top: '120px' }}>
                        <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-blue-600 inline-block">Recent Articles</h3>
                        <div className="flex flex-col gap-4">
                            {recentPosts && recentPosts.map((rp) => (
                                <Link key={rp.id} href={`${window.BASE_PATH}/blog/${rp.slug}`} className="flex gap-4 group bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                                        <Image src={rp.coverImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={rp.title} fill style={{ objectFit: 'cover' }} className="transition-transform duration-300 group-hover:scale-105" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{rp.category}</span>
                                        <h4 className="font-bold text-sm leading-tight text-slate-800 group-hover:text-blue-600 mt-1 line-clamp-3">{rp.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            <BlogFooter />
        </div>
    );
}
