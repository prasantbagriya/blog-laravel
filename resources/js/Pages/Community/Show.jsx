import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share, Bookmark, MoreHorizontal, TrendingUp, Flame, Sparkle, Link as LinkIcon, Flag, Trash, PenSquare, Shield, Plus, Users, CircleDot } from 'lucide-react';
import GlobalNavbar from '@/NextComponents/GlobalNavbar';
const ReportModal = React.lazy(() => import('@/Components/ReportModal'));
import PostCard from '@/Components/PostCard';

export default function Show({ auth, community, posts, currentSort = 'new' }) {
    const [reportModalData, setReportModalData] = useState({ isOpen: false, id: null, type: null });

    const openReportModal = (id, type) => {
        if (!auth?.user) {
            alert('Please log in to report.');
            return;
        }
        setReportModalData({ isOpen: true, id, type });
    };

    const [allPosts, setAllPosts] = useState(posts.data);
    const [nextPageUrl, setNextPageUrl] = useState(posts.next_page_url);
    const [loadingMore, setLoadingMore] = useState(false);
    
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

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans transition-colors selection:bg-blue-500/30">
            <Head title={community.display_name} />
            
            <GlobalNavbar auth={auth} />

            {/* Community Banner */}
            <div className="relative">
                <div 
                    className="h-40 sm:h-56 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${community.banner_image || 'https://www.transparenttextures.com/patterns/carbon-fibre.png'})` }}
                >
                    {!community.banner_image && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90"></div>}
                </div>
                
                {/* Community Header Content */}
                <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shadow-sm relative z-10">
                    <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6">
                        <div className="flex items-start pb-6">
                            <div className="relative -mt-8 sm:-mt-12 z-20">
                                {community.icon_image ? (
                                    <img 
                                        src={community.icon_image} 
                                        alt={community.name} 
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 object-cover shadow-md"
                                    />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white dark:border-zinc-900 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-extrabold text-4xl flex items-center justify-center shadow-md">
                                        {community.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="ml-5 sm:ml-6 mt-4 flex-1 flex flex-wrap items-start justify-between gap-6">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-1">
                                        {community.display_name}
                                    </h1>
                                    <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">
                                        r/{community.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {(community.is_owner || community.is_moderator) && (
                                        <Link href={`/community/${community.name}/edit`} className="px-5 py-2 font-bold rounded-xl transition-all text-sm border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 flex items-center gap-2 shadow-sm active:scale-[0.98]">
                                            <Shield size={16} className="text-amber-500" /> Mod Tools
                                        </Link>
                                    )}
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (!auth?.user) {
                                                router.visit('/login');
                                                return;
                                            }
                                            router.post(`/community/${community.id}/join`, {}, { preserveScroll: true });
                                        }}
                                        className={`px-8 py-2 font-bold rounded-xl transition-all text-sm shadow-sm active:scale-[0.98] ${community.is_member ? 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-700' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100'}`}
                                    >
                                        {community.is_member ? 'Joined' : 'Join Community'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] w-full mx-auto pt-8 px-4 sm:px-6 flex gap-8">
                
                {/* Main Feed Content */}
                <div className="flex-1 max-w-3xl pb-24 min-w-0">
                    
                    {/* Create Post Input */}
                    {(community.is_owner || community.is_member) ? (
                        <Link href={`/submit?community_id=${community.id}`} className="bg-slate-50 dark:bg-zinc-900 border-0 rounded-3xl p-3 flex gap-4 items-center cursor-text mb-6 shadow-inner hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-white dark:border-zinc-800 flex-shrink-0 flex items-center justify-center shadow-sm">
                                <span className="text-blue-600 dark:text-blue-400 font-extrabold text-lg">{auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}</span>
                            </div>
                            <div 
                                className="flex-1 bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 rounded-2xl py-3 px-5 text-sm text-slate-500 dark:text-zinc-400 transition-colors flex items-center font-medium shadow-sm"
                            >
                                Create Post...
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 text-slate-400 dark:text-zinc-400 flex items-center justify-center border border-slate-200 shadow-sm group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 transition-colors">
                                <Plus size={22} strokeWidth={2.5} />
                            </div>
                        </Link>
                    ) : (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Join to participate</h3>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400">You must join this community to post.</p>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!auth?.user) {
                                        router.visit('/login');
                                        return;
                                    }
                                    router.post(`/community/${community.id}/join`, {}, { preserveScroll: true });
                                }}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm whitespace-nowrap active:scale-[0.98]"
                            >
                                Join Community
                            </button>
                        </div>
                    )}

                    {/* Sort Bar */}
                    <div className="flex gap-2 items-center mb-6 pb-4 border-b border-slate-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide">
                        <button 
                            onClick={() => router.get(window.location.pathname, { sort: 'hot' }, { preserveScroll: true, preserveState: true })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${currentSort === 'hot' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700'}`}
                        >
                            <Flame size={18} strokeWidth={currentSort === 'hot' ? 2.5 : 2} className={currentSort === 'hot' ? '' : 'text-rose-500'} />
                            Hot
                        </button>
                        <button 
                            onClick={() => router.get(window.location.pathname, { sort: 'new' }, { preserveScroll: true, preserveState: true })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${currentSort === 'new' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700'}`}
                        >
                            <Sparkle size={18} strokeWidth={currentSort === 'new' ? 2.5 : 2} className={currentSort === 'new' ? '' : 'text-blue-500'} />
                            New
                        </button>
                        <button 
                            onClick={() => router.get(window.location.pathname, { sort: 'top' }, { preserveScroll: true, preserveState: true })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${currentSort === 'top' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700'}`}
                        >
                            <TrendingUp size={18} strokeWidth={currentSort === 'top' ? 2.5 : 2} className={currentSort === 'top' ? '' : 'text-emerald-500'} />
                            Top
                        </button>
                    </div>

                    {/* Posts List */}
                    <div className="space-y-6">
                        {allPosts.map((post) => (
                            <PostCard key={post.id} post={post} auth={auth} openReportModal={openReportModal} />
                        ))}
                    </div>
                    
                    {nextPageUrl && (
                        <div ref={loadMoreRef} className="py-12 flex justify-center items-center">
                            {loadingMore ? (
                                <div className="w-10 h-10 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin shadow-sm"></div>
                            ) : (
                                <div className="text-sm text-slate-500 dark:text-zinc-400 font-bold bg-white dark:bg-zinc-900 px-6 py-2 rounded-full border border-slate-200 dark:border-zinc-800 shadow-sm">Scroll for more posts</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block w-[320px] flex-shrink-0 space-y-6">
                    
                    {/* About Card */}
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                <Users size={16} strokeWidth={2.5} />
                            </div>
                            <h3 className="font-extrabold text-slate-900 dark:text-white tracking-wide">About Community</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed mb-6">
                                {community.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-zinc-800 py-4 mb-6">
                                <div>
                                    <div className="font-extrabold text-xl text-slate-900 dark:text-white leading-tight">{community.members_count.toLocaleString()}</div>
                                    <div className="text-xs font-bold text-slate-500 dark:text-zinc-500 mt-1 uppercase tracking-wider">Members</div>
                                </div>
                                <div className="pl-4 border-l border-slate-100 dark:border-zinc-800">
                                    <div className="font-extrabold text-xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2 leading-tight">
                                        <CircleDot size={12} className="fill-current animate-pulse" />
                                        {community.online_count.toLocaleString()}
                                    </div>
                                    <div className="text-xs font-bold text-slate-500 dark:text-zinc-500 mt-1 uppercase tracking-wider">Online</div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {(community.is_owner || community.is_member) ? (
                                    <Link href={`/submit?community_id=${community.id}`} className="flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all active:scale-[0.98] shadow-md w-full">
                                        Create Post
                                    </Link>
                                ) : (
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        if (!auth?.user) {
                                            router.visit('/login');
                                            return;
                                        }
                                        router.post(`/community/${community.id}/join`, {}, { preserveScroll: true });
                                    }} className="flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-md w-full">
                                        Join to Post
                                    </button>
                                )}
                                {(community.is_owner || community.is_moderator) && (
                                    <Link href={`/community/${community.name}/modqueue`} className="flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-sm w-full">
                                        Mod Queue
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Suspense fallback={null}>
                {reportModalData.isOpen && (
                    <ReportModal 
                        isOpen={reportModalData.isOpen} 
                        onClose={() => setReportModalData({ isOpen: false, id: null, type: null })}
                        reportableId={reportModalData.id}
                        reportableType={reportModalData.type}
                    />
                )}
            </Suspense>
        </div>
    );
}
