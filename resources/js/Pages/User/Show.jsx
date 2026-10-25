import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Flame, Sparkles, TrendingUp, Calendar, Star, MessageSquare } from 'lucide-react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import SeoMeta from '../../NextComponents/SeoMeta';
const ReportModal = React.lazy(() => import('@/Components/ReportModal'));
import PostCard from '@/Components/PostCard';
import AnimatedBorderCard from '@/Components/AnimatedBorderCard';

const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} {...props} />;
};

export default function Show({ auth, profileUser, posts, currentSort = 'new', meta }) {
    const [allPosts, setAllPosts] = useState(posts.data);
    const [nextPageUrl, setNextPageUrl] = useState(posts.next_page_url);
    const [loadingMore, setLoadingMore] = useState(false);
    const [reportPostId, setReportPostId] = useState(null);
    
    useEffect(() => {
        setAllPosts(posts.data);
        setNextPageUrl(posts.next_page_url);
    }, [posts]);

    const loadMoreRef = useRef(null);

    const loadMorePosts = useCallback(() => {
        if (!nextPageUrl || loadingMore) return;
        
        setLoadingMore(true);
        router.get(nextPageUrl, {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['posts'],
            onSuccess: (page) => {
                const newPosts = page.props.posts;
                setAllPosts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNewPosts = newPosts.data.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNewPosts];
                });
                setNextPageUrl(newPosts.next_page_url);
                setLoadingMore(false);
            },
            onError: () => setLoadingMore(false)
        });
    }, [nextPageUrl, loadingMore]);

    useEffect(() => {
        if (!loadMoreRef.current) return;
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && nextPageUrl && !loadingMore) {
                loadMorePosts();
            }
        }, { threshold: 0.1 });
        
        observer.observe(loadMoreRef.current);
        
        return () => observer.disconnect();
    }, [loadMorePosts, nextPageUrl, loadingMore]);

    const profileSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "dateCreated": profileUser.created_at,
        "mainEntity": {
            "@type": "Person",
            "name": profileUser.username,
            "identifier": profileUser.username,
            "interactionStatistic": [{
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/WriteAction",
                "userInteractionCount": profileUser.post_karma + profileUser.comment_karma
            }],
            "agentInteractionStatistic": {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/WriteAction",
                "userInteractionCount": posts.total || 0
            }
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-[#09090b] min-h-screen flex flex-col font-sans transition-colors duration-300">
            {meta ? <SeoMeta meta={meta} /> : (
                <Head title={`${profileUser.name || profileUser.username} (@${profileUser.username})`}>
                    <script type="application/ld+json">
                        {JSON.stringify(profileSchema)}
                    </script>
                </Head>
            )}
            
            <GlobalNavbar />

            <Suspense fallback={null}>
                {!!reportPostId && (
                    <ReportModal 
                        isOpen={!!reportPostId} 
                        onClose={() => setReportPostId(null)} 
                        postId={reportPostId} 
                    />
                )}
            </Suspense>

            <main className="container mx-auto px-4 py-8 max-w-[1000px] mt-6 md:mt-8 flex-grow">
                {/* Modern Profile Header */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-800 mb-8">
                    {/* Banner */}
                    <div 
                        className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 relative"
                    >
                        {profileUser.banner_image && (
                            <img 
                                src={profileUser.banner_image} 
                                alt={`${profileUser.username} banner`} 
                                className="w-full h-full object-cover absolute inset-0 mix-blend-overlay opacity-80" 
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                    </div>
                    
                    {/* Profile Info */}
                    <div className="px-6 md:px-10 pb-8 relative">
                        {/* Avatar */}
                        <div className="relative -mt-16 md:-mt-20 mb-4 inline-block">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 overflow-hidden shadow-lg relative z-10">
                                <Image src={profileUser.profile_picture || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png'} alt={profileUser.name || profileUser.username} fill style={{ objectFit: 'cover' }} />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
                                    {profileUser.name || profileUser.username}
                                </h1>
                                <h2 className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                                    u/{profileUser.username}
                                </h2>
                                
                                {profileUser.bio && (
                                    <p className="text-slate-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                                        {profileUser.bio}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700">
                                        <Calendar size={16} className="text-amber-500" />
                                        <span>Joined {profileUser.created_at}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700">
                                        <Star size={16} className="text-blue-500 fill-blue-500/20" />
                                        <span>{(profileUser.post_karma || 0) + (profileUser.comment_karma || 0)} Karma</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 shrink-0">
                                <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-full text-[15px] transition-transform hover:scale-105 shadow-md flex items-center justify-center min-w-[120px]">
                                    Follow
                                </button>
                                <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold rounded-full text-[15px] transition-colors border border-slate-200 dark:border-zinc-700 flex items-center justify-center min-w-[120px]">
                                    <MessageSquare size={16} className="mr-2" /> Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Posts Column */}
                    <div className="flex-1 space-y-6">
                        {/* Sort Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900 p-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800">
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white px-2 hidden sm:block">Activity</h3>
                            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
                                <button 
                                    onClick={() => router.get(window.location.pathname, { sort: 'hot' }, { preserveScroll: true, preserveState: true })}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-[14px] transition-all shadow-sm whitespace-nowrap ${currentSort === 'hot' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                                >
                                    <Flame size={16} className={currentSort === 'hot' ? 'text-white' : 'text-amber-500'} />
                                    Hot
                                </button>
                                <button 
                                    onClick={() => router.get(window.location.pathname, { sort: 'new' }, { preserveScroll: true, preserveState: true })}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-[14px] transition-all shadow-sm whitespace-nowrap ${currentSort === 'new' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                                >
                                    <Sparkles size={16} className={currentSort === 'new' ? 'text-white' : 'text-amber-500'} />
                                    New
                                </button>
                                <button 
                                    onClick={() => router.get(window.location.pathname, { sort: 'top' }, { preserveScroll: true, preserveState: true })}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-[14px] transition-all shadow-sm whitespace-nowrap ${currentSort === 'top' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                                >
                                    <TrendingUp size={16} className={currentSort === 'top' ? 'text-white' : 'text-amber-500'} />
                                    Top
                                </button>
                            </div>
                        </div>

                        {/* Posts List */}
                        {allPosts.length === 0 ? (
                            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400 shadow-sm mt-4">
                                <div className="w-24 h-24 mb-6 opacity-50 bg-[url('https://www.redditstatic.com/desktop2x/img/snoo_thoughtful.png')] bg-contain bg-no-repeat bg-center mix-blend-luminosity"></div>
                                <p className="font-extrabold text-xl text-slate-700 dark:text-zinc-300">hmm... u/{profileUser.username} hasn't posted anything</p>
                                <p className="text-sm mt-2">When they do, their posts will show up here.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {allPosts.map((post, index) => (
                                    <PostCard key={post.id} post={post} auth={auth} openReportModal={setReportPostId} priorityLoad={index === 0} />
                                ))}
                            </div>
                        )}
                        
                        {nextPageUrl && (
                            <div ref={loadMoreRef} className="py-10 flex justify-center items-center">
                                {loadingMore ? (
                                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <div className="px-6 py-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full text-[14px] text-slate-600 dark:text-zinc-400 font-bold border border-slate-200 dark:border-zinc-700">Scroll for more</div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* We can add a right sidebar here in the future if needed, 
                        but for now a wide 1-column layout for posts looks cleaner and more modern */}
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
