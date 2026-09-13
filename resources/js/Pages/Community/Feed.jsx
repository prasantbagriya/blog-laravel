import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Home, Compass, Plus, Flame, Sparkles, TrendingUp, MoreHorizontal, Link as LinkIcon, Flag, Trash } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import ReportModal from '@/Components/ReportModal';
import PostCard from '@/Components/PostCard';

const PostDropdown = ({ post, auth, onReport }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button 
                onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
                className="hover:bg-[#E2E7E9] px-2 py-1.5 rounded-full transition-colors font-bold text-[12px] text-[#878A8C] border-0 outline-none focus:outline-none focus:ring-0"
            >
                <MoreHorizontal size={18} strokeWidth={2} />
            </button>
            
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={(e) => { e.preventDefault(); setIsOpen(false); }}></div>
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-[#EDEFF1] rounded-md shadow-lg z-20 py-1 overflow-hidden">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(`${window.location.origin}/r/${post.community}/comments/${post.id}`);
                                alert('Link copied to clipboard!');
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] font-medium text-[#1C1C1C] flex items-center gap-2"
                        >
                            <LinkIcon size={16} /> Copy Link
                        </button>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                onReport(post.id, 'post');
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] font-medium text-[#1C1C1C] flex items-center gap-2"
                        >
                            <Flag size={16} /> Report
                        </button>
                        
                        {auth?.user?.username === post.author.username && (
                            <>
                                <Link 
                                    href={`/submit?edit=${post.id}`}
                                    className="w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] font-medium text-[#1C1C1C] flex items-center gap-2 border-t border-[#EDEFF1]"
                                >
                                    <span className="w-4 h-4 flex items-center justify-center border border-current rounded-sm">E</span> Edit Post
                                </Link>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if(confirm('Are you sure you want to delete this post?')) {
                                            router.delete(`/posts/${post.id}`);
                                        }
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-[14px] font-medium text-red-600 flex items-center gap-2"
                                >
                                    <Trash size={16} /> Delete Post
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default function Feed({ auth, posts, currentSort = 'new', currentFilter = 'home' }) {
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
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans pb-20 transition-colors">
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
            
            <Navbar auth={auth} />

            <div className="w-full mx-auto pt-6 px-4 flex gap-6">
                
                {/* Left Sidebar */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-20 space-y-2">
                        <Link href="/feed?filter=home" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${currentFilter === 'home' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm font-bold' : 'text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm'}`}>
                            <Home size={22} strokeWidth={currentFilter === 'home' ? 2.5 : 2} className={currentFilter === 'home' ? 'text-blue-600' : 'text-slate-400 dark:text-zinc-500'} /> Home
                        </Link>
                        <Link href="/feed?filter=popular" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${currentFilter === 'popular' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm font-bold' : 'text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm'}`}>
                            <Compass size={22} strokeWidth={currentFilter === 'popular' ? 2.5 : 2} className={currentFilter === 'popular' ? 'text-amber-500' : 'text-slate-400 dark:text-zinc-500'} /> Popular
                        </Link>
                        {auth?.joined_communities && auth.joined_communities.length > 0 && (
                            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-zinc-800">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-4">Your Communities</p>
                                {auth.joined_communities.map(community => (
                                    <Link key={community.id} href={`/community/${community.name}`} className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white font-medium transition-all">
                                        {community.icon_image ? (
                                            <img loading="lazy" decoding="async" fetchPriority="low" src={community.icon_image} className="w-6 h-6 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-[#0079D3]"></div>
                                        )}
                                        <span className="truncate">r/{community.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Feed Content */}
                <div className="flex-1 space-y-4">
                    
                    {/* Create Post Input */}
                    <Link href="/submit" className="bg-white rounded-md p-2 flex gap-2 items-center cursor-text mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 ml-2 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}</span>
                        </div>
                        <div 
                            className="flex-1 bg-slate-100 hover:bg-slate-200 rounded-md py-2 px-4 text-[14px] text-slate-500 transition-colors flex items-center font-medium"
                        >
                            Create Post
                        </div>
                        <button className="text-slate-500 hover:text-slate-800 transition-colors mr-1">
                            <Plus size={24} />
                        </button>
                    </Link>

                    {/* Sort Bar (Linear/Minimalist Style) */}
                    <div className="flex gap-2 items-center mb-4">
                        <button 
                            onClick={() => router.get(window.location.pathname, { sort: 'hot' }, { preserveScroll: true, preserveState: true })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === 'hot' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'}`}
                        >
                            <Flame size={16} />
                            Hot
                        </button>
                        <button 
                            onClick={() => router.get(window.location.pathname, { sort: 'new' }, { preserveScroll: true, preserveState: true })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === 'new' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'}`}
                        >
                            <Sparkles size={16} />
                            New
                        </button>
                        <button 
                            onClick={() => router.get(window.location.pathname, { sort: 'top' }, { preserveScroll: true, preserveState: true })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === 'top' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'}`}
                        >
                            <TrendingUp size={16} />
                            Top
                        </button>
                    </div>

                    {/* Posts List */}
                    {allPosts.map((post, index) => (
                        <PostCard key={post.id} post={post} auth={auth} openReportModal={openReportModal} priorityLoad={index === 0} />
                    ))}
                    
                    {nextPageUrl && (
                        <div ref={loadMoreRef} className="py-8 flex justify-center items-center">
                            {loadingMore ? (
                                <div className="w-8 h-8 border-4 border-[#0079D3] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <div className="text-[14px] text-[#878A8C] font-medium">Scroll for more posts</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="hidden xl:block w-[312px] flex-shrink-0 space-y-4">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-12"></div>
                        <div className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 -mt-10 bg-white dark:bg-zinc-900 rounded-xl p-1.5 shadow-md flex items-center justify-center">
                                    <Home className="w-full h-full text-blue-600" />
                                </div>
                                <h2 className="font-extrabold text-slate-900 dark:text-white text-[16px]">Home</h2>
                            </div>
                            <p className="text-[14px] text-slate-600 dark:text-zinc-400 mb-5 leading-relaxed">Your personal feed. Come here to check in with your favorite communities and stay updated on the latest discussions.</p>
                            <div className="space-y-3 pt-5 border-t border-slate-100 dark:border-zinc-800">
                                <Link href="/submit" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm">
                                    Create Post
                                </Link>
                                <Link href="/communities/create" className="block w-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-center font-medium py-2 rounded-md transition-colors text-sm">
                                    Create Community
                                </Link>
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
