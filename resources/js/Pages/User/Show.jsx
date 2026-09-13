import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import ReportModal from '@/Components/ReportModal';
import PostCard from '@/Components/PostCard';
import AnimatedBorderCard from '@/Components/AnimatedBorderCard';

export default function Show({ auth, profileUser, posts, currentSort = 'new' }) {
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

    const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://coachingsinsikar.com/user/${profileUser.username}`;

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
        <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white font-sans pb-20">
            <Head title={profileUser.username}>
                <script type="application/ld+json">
                    {JSON.stringify(profileSchema)}
                </script>
            </Head>
            
            <Navbar auth={auth} />

            <ReportModal 
                isOpen={!!reportPostId} 
                onClose={() => setReportPostId(null)} 
                postId={reportPostId} 
            />

            <div className="w-full mx-auto pt-6 px-4 flex flex-col lg:flex-row gap-6 max-w-[1200px]">
                
                {/* Main Feed */}
                <div className="flex-1 space-y-4">
                    
                    {/* User Profile Tab Header & Sort Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 px-2 border-b border-slate-200 dark:border-zinc-800 justify-between sm:items-center">
                        <div className="flex gap-6">
                            <button className="text-slate-900 dark:text-white font-bold pb-2 border-b-2 border-amber-500 px-1 text-[14px]">POSTS</button>
                        </div>
                        <div className="flex gap-2 pb-2">
                            {/* Sort Bar */}
                            <div className="flex gap-2 items-center mb-0 sm:mb-4">
                                <button 
                                    onClick={() => router.get(window.location.pathname, { sort: 'hot' }, { preserveScroll: true, preserveState: true })}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === 'hot' ? 'bg-slate-900 dark:bg-zinc-800 border-slate-900 dark:border-zinc-700 text-white' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700'}`}
                                >
                                    <Flame size={16} className={currentSort === 'hot' ? 'text-amber-500' : ''} />
                                    Hot
                                </button>
                                <button 
                                    onClick={() => router.get(window.location.pathname, { sort: 'new' }, { preserveScroll: true, preserveState: true })}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === 'new' ? 'bg-slate-900 dark:bg-zinc-800 border-slate-900 dark:border-zinc-700 text-white' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700'}`}
                                >
                                    <Sparkles size={16} className={currentSort === 'new' ? 'text-amber-500' : ''} />
                                    New
                                </button>
                                <button 
                                    onClick={() => router.get(window.location.pathname, { sort: 'top' }, { preserveScroll: true, preserveState: true })}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === 'top' ? 'bg-slate-900 dark:bg-zinc-800 border-slate-900 dark:border-zinc-700 text-white' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700'}`}
                                >
                                    <TrendingUp size={16} className={currentSort === 'top' ? 'text-amber-500' : ''} />
                                    Top
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Posts List */}
                    {allPosts.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400 shadow-sm">
                            <div className="w-20 h-20 mb-4 opacity-50 bg-[url('https://www.redditstatic.com/desktop2x/img/snoo_thoughtful.png')] bg-contain bg-no-repeat bg-center"></div>
                            <p className="font-medium text-[16px]">hmm... u/{profileUser.username} hasn't posted anything</p>
                        </div>
                    ) : (
                        allPosts.map((post, index) => (
                            <PostCard key={post.id} post={post} auth={auth} openReportModal={setReportPostId} priorityLoad={index === 0} />
                        ))
                    )}
                    
                    {nextPageUrl && (
                        <div ref={loadMoreRef} className="py-8 flex justify-center items-center">
                            {loadingMore ? (
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <div className="text-[14px] text-slate-500 dark:text-zinc-400 font-medium">Scroll for more posts</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Sidebar - User Profile Card */}
                <div className="w-full lg:w-[312px] flex-shrink-0 space-y-4">
                    <AnimatedBorderCard className="relative group">
                        <div 
                            className="h-28 bg-gradient-to-r from-blue-600 to-amber-500 bg-cover bg-center"
                            style={profileUser.banner_image ? { backgroundImage: `url(${profileUser.banner_image})` } : {}}
                        ></div>
                        <div className="p-5 pt-0">
                            <img loading="lazy" decoding="async" fetchPriority="low" 
                                src={profileUser.profile_picture || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png'} 
                                className="w-[84px] h-[84px] rounded-2xl border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 -mt-10 mb-3 relative z-10 object-cover shadow-md"
                            />
                            <h2 className="font-extrabold text-[22px] text-slate-900 dark:text-white leading-none mb-1 group-hover:text-amber-500 transition-colors">{profileUser.name || profileUser.username}</h2>
                            <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-medium mb-4">u/{profileUser.username}</p>
                            
                            {profileUser.bio && (
                                <p className="text-[14px] text-slate-700 dark:text-zinc-300 mb-4 leading-relaxed">{profileUser.bio}</p>
                            )}
                            
                            <div className="flex flex-col gap-1 mb-5 pt-4 border-t border-slate-100 dark:border-zinc-800/60">
                                <span className="text-[14px] font-bold text-slate-900 dark:text-white">Cake day</span>
                                <span className="text-[13px] text-slate-500 dark:text-zinc-400 flex items-center gap-2 font-medium">
                                    🎂 {profileUser.created_at}
                                </span>
                            </div>
                            
                            <div className="space-y-2 mt-4">
                                <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-full text-[14px] transition-transform hover:scale-105 shadow-md">
                                    Follow
                                </button>
                                <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold rounded-full text-[14px] transition-colors border border-slate-200 dark:border-zinc-700">
                                    Chat
                                </button>
                            </div>
                        </div>
                    </AnimatedBorderCard>
                </div>

            </div>
        </div>
    );
}
