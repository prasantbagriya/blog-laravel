import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Home, Compass, Plus, Flame, Sparkles, TrendingUp, Sparkle, Search } from 'lucide-react';
import GlobalNavbar from '@/NextComponents/GlobalNavbar';
import ReportModal from '@/Components/ReportModal';
import PostCard from '@/Components/PostCard';

export default function Feed({ auth, posts, currentSort = 'new', currentFilter = 'home' }) {
    const [reportModalData, setReportModalData] = useState({ isOpen: false, id: null, type: null });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
                    // Prevent duplicates
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

    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://coachingsinsikar.com/';
    
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "coachingsinsikar - The Front Page of the Internet",
        "description": "Welcome to coachingsinsikar. Join communities, share posts, and discuss your favorite topics on the front page of the internet.",
        "url": currentUrl,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": allPosts.map((post, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://coachingsinsikar.com/r/${post.community}/comments/${post.id}/${post.slug || ''}`
            }))
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans transition-colors selection:bg-blue-500/30">
            <Head title="coachingsinsikar - The Front Page of the Internet">
                <meta name="description" content="Welcome to coachingsinsikar. Join communities, share posts, and discuss your favorite topics on the front page of the internet." />
                <meta property="og:title" content="coachingsinsikar - The Front Page of the Internet" />
                <meta property="og:description" content="Welcome to coachingsinsikar. Join communities, share posts, and discuss your favorite topics on the front page of the internet." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="coachingsinsikar - The Front Page of the Internet" />
                <meta name="twitter:description" content="Welcome to coachingsinsikar. Join communities, share posts, and discuss your favorite topics on the front page of the internet." />
                <link rel="canonical" href={currentUrl} />
                {nextPageUrl && <link rel="next" href={nextPageUrl} />}
                <script type="application/ld+json">
                    {JSON.stringify(collectionSchema)}
                </script>
            </Head>
            
            <GlobalNavbar auth={auth} />

            <div className="max-w-[1400px] w-full mx-auto pt-32 px-4 sm:px-6 flex gap-8">
                
                {/* Mobile Sidebar Overlay */}
                {isMobileSidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)}></div>
                )}

                {/* Left Sidebar */}
                <div className={`fixed inset-y-0 left-0 transform ${isMobileSidebarOpen ? 'translate-x-0 z-[60] shadow-2xl opacity-100 visible' : '-translate-x-full z-0 shadow-none opacity-0 invisible lg:opacity-100 lg:visible'} lg:relative lg:translate-x-0 lg:z-10 lg:block flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-64 lg:w-20' : 'w-64'} bg-white dark:bg-zinc-950 lg:bg-transparent lg:shadow-none pt-0 h-[100dvh] lg:h-auto flex flex-col`}>
                    <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-100 dark:border-zinc-800">
                        <span className="font-bold text-slate-800 dark:text-white">Menu</span>
                        <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto lg:overflow-visible p-4 lg:p-0 lg:sticky lg:top-28 space-y-1">
                        {/* Toggle Button for Desktop */}
                        <button 
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 mb-4 transition-colors shadow-sm ml-auto"
                        >
                            <svg className={`w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>

                        <Link href="/feed?filter=home" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${currentFilter === 'home' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-zinc-800 font-bold' : 'text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-zinc-800'}`}>
                            <Home size={20} strokeWidth={currentFilter === 'home' ? 2.5 : 2} className={currentFilter === 'home' ? 'text-blue-600 flex-shrink-0' : 'text-slate-400 dark:text-zinc-500 flex-shrink-0'} /> 
                            <span className={isSidebarCollapsed ? 'lg:hidden' : ''}>Home</span>
                        </Link>
                        <Link href="/feed?filter=popular" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${currentFilter === 'popular' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-zinc-800 font-bold' : 'text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-zinc-800'}`}>
                            <Compass size={20} strokeWidth={currentFilter === 'popular' ? 2.5 : 2} className={currentFilter === 'popular' ? 'text-amber-500 flex-shrink-0' : 'text-slate-400 dark:text-zinc-500 flex-shrink-0'} /> 
                            <span className={isSidebarCollapsed ? 'lg:hidden' : ''}>Popular</span>
                        </Link>
                        
                        {auth?.joined_communities && auth.joined_communities.length > 0 && (
                            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800">
                                <p className={`text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-4 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Your Communities</p>
                                {auth.joined_communities.map(community => (
                                    <Link key={community.id} href={`/community/${community.name}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white font-medium transition-all border border-transparent hover:border-slate-200 dark:hover:border-zinc-800">
                                        {community.icon_image ? (
                                            <img loading="lazy" decoding="async" fetchPriority="low" src={community.icon_image} className="w-7 h-7 rounded-lg object-cover shadow-sm border border-slate-100 dark:border-zinc-700 flex-shrink-0" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs shadow-sm border border-blue-200 dark:border-blue-800/50 flex-shrink-0">
                                                {community.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className={`truncate font-semibold text-sm ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>r/{community.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Feed Content */}
                <div className="flex-1 max-w-3xl pb-24">
                    
                    {/* Search Communities & Posts */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const q = e.target.search.value;
                        if(q.trim()) {
                            router.visit(`/search?q=${encodeURIComponent(q)}&tab=posts`);
                        }
                    }} className="mb-6 flex items-center gap-3">
                        {/* Mobile Sidebar Toggle Inline with Search */}
                        <button 
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="lg:hidden flex items-center justify-center w-[52px] h-[52px] shrink-0 bg-white dark:bg-zinc-900 rounded-full border border-slate-200 dark:border-zinc-800 shadow-sm text-slate-700 dark:text-zinc-300 hover:text-blue-600 hover:border-blue-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </button>

                        <div className="relative flex-1 flex items-center gap-2 rounded-full bg-white dark:bg-zinc-900 p-2 shadow-sm border border-slate-200 dark:border-zinc-800 z-20 group transition-all duration-200 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:shadow-md hover:border-slate-300 dark:hover:border-zinc-600">
                            <Search className="w-5 h-5 text-slate-400 dark:text-zinc-500 ml-3 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                name="search" 
                                className="flex-1 border-0 outline-none focus:ring-0 text-slate-900 dark:text-white text-sm md:text-base py-2.5 bg-transparent placeholder-slate-400 dark:placeholder-zinc-500" 
                                placeholder="Search communities and posts..." 
                                autoComplete="off"
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none ring-0 focus:ring-0 text-sm md:text-base">
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Create Post Input */}
                    <Link href="/submit" className="bg-slate-50 dark:bg-zinc-900 border-0 rounded-3xl p-3 flex gap-4 items-center cursor-text mb-6 shadow-inner hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group">
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
                        {allPosts.map((post, index) => (
                            <PostCard key={post.id} post={post} auth={auth} openReportModal={openReportModal} priorityLoad={index === 0} />
                        ))}
                    </div>
                    
                    {nextPageUrl && (
                        <div ref={loadMoreRef} className="py-12 flex justify-center items-center">
                            {loadingMore ? (
                                <div className="w-10 h-10 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin shadow-sm"></div>
                            ) : (
                                <div className="text-[14px] text-slate-500 dark:text-zinc-400 font-bold bg-white dark:bg-zinc-900 px-6 py-2 rounded-full border border-slate-200 dark:border-zinc-800 shadow-sm">Scroll for more posts</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="hidden xl:block w-[320px] flex-shrink-0">
                    <div className="sticky top-28 space-y-6">
                        {/* Premium "Home" Card */}
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                            <div className="h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            </div>
                            <div className="p-6 relative">
                                <div className="w-16 h-16 -mt-14 mb-4 bg-white dark:bg-zinc-900 rounded-2xl p-1 shadow-lg flex items-center justify-center relative z-10 mx-auto">
                                    <div className="w-full h-full bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
                                        <Sparkles className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <h2 className="font-extrabold text-slate-900 dark:text-white text-xl text-center mb-2">Welcome Home</h2>
                                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6 leading-relaxed text-center font-medium">
                                    Your personalized feed. Explore communities, share knowledge, and stay updated on the latest discussions.
                                </p>
                                <div className="space-y-3 pt-2">
                                    <Link href="/submit" className="flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all active:scale-[0.98] shadow-md w-full">
                                        Create Post
                                    </Link>
                                    <Link href="/communities/create" className="flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-sm w-full">
                                        Create Community
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Additional Minimal Sidebar Card (Optional) */}
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-widest mb-4">Trending Now</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-start gap-3 cursor-pointer group">
                                        <div className="font-bold text-slate-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors">0{i}</div>
                                        <div>
                                            <div className="font-bold text-sm text-slate-700 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight">Trending Discussion Topic #{i}</div>
                                            <div className="text-xs font-medium text-slate-500 dark:text-zinc-500 mt-1">4.5k Posts</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <ReportModal 
                isOpen={reportModalData.isOpen} 
                onClose={() => setReportModalData({ isOpen: false, id: null, type: null })}
                reportableId={reportModalData.id}
                reportableType={reportModalData.type}
            />
        </div>
    );
}
