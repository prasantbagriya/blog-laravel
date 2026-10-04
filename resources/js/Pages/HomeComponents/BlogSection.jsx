import React from 'react';
import { Link, Image } from './utils';
import AnimatedBorderCard from '../../Components/AnimatedBorderCard';

const BlogSection = ({ morePosts, basePath, formatDate }) => {
    const posts = (morePosts || []).slice(0, 4);
    if(posts.length === 0) return null;
    
    return (
        <section className="py-10 md:py-14 bg-slate-50 dark:bg-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <div>
                        <p className="text-blue-700 dark:text-blue-400 text-sm font-bold tracking-wider mb-1">Editor's Picks</p>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore the Blog</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg">Read the latest articles, guides, and updates.</p>
                    </div>
                    <Link href={`${basePath}/blog`} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm">
                        View All Blog
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((post, index) => {
                        const borderColors = ['#3b82f6', '#e11d48', '#10b981', '#f59e0b'];
                        return (
                        <AnimatedBorderCard 
                            key={post.id}
                            containerClassName="hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                            className="flex-grow flex flex-col"
                            gradientColor={borderColors[index % borderColors.length]}
                        >
                            <Link href={`${basePath}${post.url_path || '/blog/'+post.slug}`} className="relative aspect-[16/9] w-full block overflow-hidden shrink-0">
                                <Image src={post.coverImage || '/uploads/read.webp'} alt={post.title} fill width="672" height="378" style={{objectFit: 'cover'}} className="group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            
                            <div className="p-4 md:p-5 flex-grow flex flex-col bg-white dark:bg-zinc-900">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <Link href={`${basePath}${post.url_path || '/blog/'+post.slug}`} className="focus:outline-none">{post.title}</Link>
                                </h3>
                                
                                {post.excerpt && (
                                    <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-1 mb-3">
                                        {post.excerpt}
                                    </p>
                                )}
                                
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/30">{post.category || 'Article'}</span>
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-1 text-sm text-slate-600 dark:text-zinc-400">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-slate-500 dark:text-zinc-400">Posted:</span>
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{formatDate(post.date)}</span>
                                    </div>
                                    <Link href={`${basePath}${post.url_path || '/blog/'+post.slug}`} className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold py-2.5 rounded-full transition-all text-sm w-full text-center flex justify-center items-center active:scale-[0.98]">
                                        Read Article
                                    </Link>
                                </div>
                            </div>
                        </AnimatedBorderCard>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
