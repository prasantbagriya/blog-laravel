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
        "name": "Nexus - The Front Page of the Internet",
        "description": "Welcome to Nexus. Join communities, share posts, and discuss your favorite topics on the front page of the internet.",
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
        <div className="min-h-screen bg-[#DAE0E6] text-[#1C1C1C] font-sans pb-20">
            <Head title="Nexus - The Front Page of the Internet">
                <meta name="description" content="Welcome to Nexus. Join communities, share posts, and discuss your favorite topics on the front page of the internet." />
                <meta property="og:title" content="Nexus - The Front Page of the Internet" />
                <meta property="og:description" content="Welcome to Nexus. Join communities, share posts, and discuss your favorite topics on the front page of the internet." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Nexus - The Front Page of the Internet" />
                <meta name="twitter:description" content="Welcome to Nexus. Join communities, share posts, and discuss your favorite topics on the front page of the internet." />
                <link rel="canonical" href={currentUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(collectionSchema)}
                </script>
            </Head>
            
            <Navbar auth={auth} />

            <div className="w-full mx-auto pt-6 px-4 flex gap-6">
                
                {/* Left Sidebar */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-20 space-y-2">
                        <Link href="/feed?filter=home" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#1C1C1C] font-medium transition-colors ${currentFilter === 'home' ? 'bg-[#F6F7F8] font-bold' : 'hover:bg-[#F6F7F8]'}`}>
                            <Home size={22} strokeWidth={currentFilter === 'home' ? 2.5 : 2} className={currentFilter === 'home' ? '' : 'text-[#878A8C]'} /> Home
                        </Link>
                        <Link href="/feed?filter=popular" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#1C1C1C] font-medium transition-colors ${currentFilter === 'popular' ? 'bg-[#F6F7F8] font-bold' : 'hover:bg-[#F6F7F8]'}`}>
                            <Compass size={22} strokeWidth={currentFilter === 'popular' ? 2.5 : 2} className={currentFilter === 'popular' ? '' : 'text-[#878A8C]'} /> Popular
                        </Link>
                        {auth?.joined_communities && auth.joined_communities.length > 0 && (
                            <div className="pt-4 mt-4 border-t border-[#EDEFF1]">
                                <p className="text-[10px] font-bold text-[#878A8C] uppercase tracking-wider mb-2 px-4">Your Communities</p>
                                {auth.joined_communities.map(community => (
                                    <Link key={community.id} href={`/community/${community.name}`} className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#1C1C1C] hover:bg-[#F6F7F8] font-medium transition-colors">
                                        {community.icon_image ? (
                                            <img src={community.icon_image} className="w-6 h-6 rounded-full object-cover" />
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
                    <Link href="/submit" className="bg-white border border-[#EDEFF1] rounded-md p-2 flex gap-2 items-center cursor-text mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#FF4500] flex-shrink-0 ml-2 flex items-center justify-center">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <div 
                            className="flex-1 bg-[#F6F7F8] hover:bg-[#E2E7E9] rounded-full py-2.5 px-5 text-[14px] text-[#878A8C] transition-colors flex items-center font-medium"
                        >
                            Create Post
                        </div>
                        <button className="p-2 text-[#878A8C] hover:bg-[#F6F7F8] rounded-full transition-colors mr-1">
                            <Plus size={24} />
                        </button>
                    </Link>

                    {/* Sort Bar (Classic Style) */}
                    <div className="bg-white border border-[#EDEFF1] rounded-md p-2 flex gap-1 items-center mb-4">
                        <button 
                            onClick={() => router.get(window.location.pathname, { sort: 'hot' }, { preserveScroll: true, preserveState: true })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[14px] transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${currentSort === 'hot' ? 'bg-[#F6F7F8] text-[#0079D3]' : 'text-[#878A8C] hover:bg-[#F6F7F8]'}`}
                        >
                            <Flame size={18} />
                            Hot
                        </button>
                        <button 
                            onClick={() => router.get(window.location.pathname, { sort: 'new' }, { preserveScroll: true, preserveState: true })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[14px] transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${currentSort === 'new' ? 'bg-[#F6F7F8] text-[#0079D3]' : 'text-[#878A8C] hover:bg-[#F6F7F8]'}`}
                        >
                            <Sparkles size={18} />
                            New
                        </button>
                        <button 
                            onClick={() => router.get(window.location.pathname, { sort: 'top' }, { preserveScroll: true, preserveState: true })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[14px] transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${currentSort === 'top' ? 'bg-[#F6F7F8] text-[#0079D3]' : 'text-[#878A8C] hover:bg-[#F6F7F8]'}`}
                        >
                            <TrendingUp size={18} />
                            Top
                        </button>
                    </div>

                    {/* Posts List */}
                    {allPosts.map((post) => (
                        <PostCard key={post.id} post={post} auth={auth} openReportModal={openReportModal} />
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
                    <div className="bg-white border border-[#EDEFF1] rounded-md overflow-hidden">
                        <div className="bg-[url('https://www.redditstatic.com/desktop2x/img/id-cards/home-banner@2x.png')] bg-cover h-10"></div>
                        <div className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 -mt-6 bg-[url('https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png')] bg-contain bg-no-repeat bg-bottom"></div>
                                <h2 className="font-medium text-[#1C1C1C] text-[16px]">Home</h2>
                            </div>
                            <p className="text-[14px] text-[#1C1C1C] mb-4 leading-snug">Your personal Nexus frontpage. Come here to check in with your favorite communities.</p>
                            <div className="space-y-3 pt-4 border-t border-[#EDEFF1]">
                                <Link href="/submit" className="button button-brand button-medium px-sm px-[calc(var(--rem12)-var(--button-border-width,0px))] hover:no-underline inline-flex items-center justify-center w-full py-1 min-h-[32px] bg-[#0079D3] hover:bg-[#005a9e] text-white font-bold rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0">
                                    Create Post
                                </Link>
                                <Link href="/communities/create" className="flex items-center justify-center w-full py-1.5 bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] font-bold rounded-full text-[14px] transition-colors border-0 outline-none focus:outline-none focus:ring-0">
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
