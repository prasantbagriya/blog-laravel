import React from 'react';
import { Link } from '@inertiajs/react';
import SeoMeta from '../../NextComponents/SeoMeta';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import AnimatedBorderCard from '../../Components/AnimatedBorderCard';
import { User, BookOpen, ArrowRight, ChevronLeft } from 'lucide-react';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} {...props} />;
};

export default function AuthorShow({ author, posts, meta }) {
    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex flex-col transition-colors duration-300">
            <SeoMeta meta={meta} />
            <GlobalNavbar />
            
            <main className="flex-grow">
                {/* Author Profile Header */}
                <section className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 opacity-5 dark:opacity-10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="max-w-4xl mx-auto relative z-10">
                        <Link href={window.BASE_PATH + '/author'} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 mb-8 transition-colors">
                            <ChevronLeft className="w-4 h-4" /> Back to Authors
                        </Link>
                        
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 border-4 border-white dark:border-zinc-800">
                                <Image 
                                    src={author.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'} 
                                    alt={author.name} 
                                    fill 
                                    style={{ objectFit: 'cover' }} 
                                />
                            </div>
                            <div className="flex-grow">
                                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">{author.name}</h1>
                                <div className="inline-flex items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold tracking-wide uppercase mb-6">
                                    <User className="w-4 h-4" /> {author.jobTitle || 'Contributor'}
                                </div>
                                <div className="prose prose-lg dark:prose-invert prose-blue max-w-2xl text-slate-600 dark:text-zinc-400 leading-relaxed font-medium mx-auto md:mx-0" 
                                     dangerouslySetInnerHTML={{ __html: author.bio || 'Passionate about guiding students toward the right educational path.' }} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Author's Articles */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Articles by {author.name}</h2>
                    </div>
                    
                    {posts && posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <AnimatedBorderCard 
                                    key={post.id} 
                                    gradientColor="#3b82f6" 
                                    containerClassName="h-full" 
                                    className="h-full bg-white dark:bg-zinc-900 flex flex-col overflow-hidden group"
                                >
                                    <Link href={window.BASE_PATH + (post.url_path || `/blog/${post.slug}`)} className="relative h-56 block overflow-hidden">
                                        <Image 
                                            src={post.coverImage || '/uploads/read.webp'} 
                                            alt={post.title} 
                                            fill 
                                            style={{ objectFit: 'cover' }} 
                                            className="group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                                        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-400 tracking-wider uppercase mb-4 self-start">
                                            {post.category || 'Article'}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-bold mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <Link href={window.BASE_PATH + (post.url_path || `/blog/${post.slug}`)}>{post.title}</Link>
                                        </h3>
                                        <p className="text-slate-600 dark:text-zinc-400 mb-6 flex-grow font-medium leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <Link 
                                            href={window.BASE_PATH + (post.url_path || `/blog/${post.slug}`)} 
                                            className="inline-flex items-center font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-auto group/btn"
                                        >
                                            Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </AnimatedBorderCard>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800">
                            <BookOpen className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Articles Yet</h3>
                            <p className="text-slate-500 dark:text-zinc-400">{author.name} hasn't published any articles yet.</p>
                        </div>
                    )}
                </section>
            </main>
            
            <BlogFooter />
        </div>
    );
}
