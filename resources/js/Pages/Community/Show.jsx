import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share, Bookmark, MoreHorizontal, TrendingUp, Flame, Sparkles, Link as LinkIcon, Flag, Trash, PenSquare, Shield, Plus } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import ReportModal from '@/Components/ReportModal';
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
        <div className="min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20">
            <Head title={community.display_name} />
            
            <Navbar auth={auth} />

            {/* Community Banner */}
            <div 
                className="h-32 sm:h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${community.banner_image || 'https://www.redditstatic.com/desktop2x/img/id-cards/home-banner@2x.png'})` }}
            >
            </div>

            {/* Community Header Content */}
            <div className="bg-white border-b border-[#EDEFF1]">
                <div className="w-full mx-auto px-4">
                    <div className="flex items-start pb-4">
                        <img 
                            src={community.icon_image || 'https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png'} 
                            alt={community.name} 
                            className="w-[72px] h-[72px] rounded-full border-4 border-white bg-white -mt-4 object-cover z-10"
                        />
                        <div className="ml-4 mt-3 flex-1 flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-[28px] font-bold text-[#1C1C1C] leading-none mb-1">
                                    {community.display_name}
                                </h1>
                                <p className="text-[14px] font-bold text-[#787C7E]">
                                    r/{community.name}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-1">
                                {(community.is_owner || community.is_moderator) && (
                                    <Link href={`/community/${community.name}/edit`} className="px-4 py-1.5 font-bold rounded-full transition-colors text-[14px] border border-[#1C1C1C] bg-white text-[#1C1C1C] hover:bg-[#F6F7F8] flex items-center gap-1">
                                        Mod Tools
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
                                    className={`px-8 py-1.5 font-bold rounded-full transition-colors text-[14px] border border-[#4F46E5] ${community.is_member ? 'bg-white text-[#4F46E5] hover:bg-[#F6F7F8]' : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white'}`}
                                >
                                    {community.is_member ? 'Joined' : 'Join'}
                                </button>
                                <button className="px-3 py-1.5 bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] rounded-full transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full mx-auto pt-6 px-4 flex gap-6">
                
                {/* Main Feed */}
                <div className="flex-1 space-y-4">
                    
                    {/* Create Post Input */}
                    <Link href={`/submit?community_id=${community.id}`} className="bg-white rounded-md p-2 flex gap-2 items-center cursor-text mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex-shrink-0 ml-2 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">N</span>
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

                {/* Sidebar */}
                <div className="hidden lg:block w-[312px] flex-shrink-0 space-y-4">
                    <div className="bg-white border border-[#EDEFF1] rounded-md p-3">
                        <div className="bg-[#0079D3] rounded-t-md p-3 -m-3 mb-3 text-white font-bold text-[14px]">
                            About Community
                        </div>
                        <p className="text-[14px] text-[#1C1C1C] mb-4 mt-2">{community.description}</p>
                        
                        <div className="flex gap-4 border-t border-b border-[#EDEFF1] py-3 mb-4">
                            <div className="flex-1 text-left">
                                <div className="font-bold text-[16px] text-[#1C1C1C] leading-none">{community.members_count.toLocaleString()}</div>
                                <div className="text-[12px] text-[#787C7E] font-medium mt-1">Members</div>
                            </div>
                            <div className="flex-1 text-left border-l border-[#EDEFF1] pl-4">
                                <div className="font-bold text-[16px] text-[#1C1C1C] flex items-center gap-1 leading-none">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    {community.online_count.toLocaleString()}
                                </div>
                                <div className="text-[12px] text-[#787C7E] font-medium mt-1">Online</div>
                            </div>
                        </div>
                        
                        {(community.is_owner || community.is_moderator) && (
                            <Link href={`/community/${community.name}/modqueue`} className="flex items-center justify-center w-full py-1.5 bg-white border border-[#0079D3] text-[#0079D3] hover:bg-[#F6F7F8] font-bold rounded-full text-[14px] transition-colors mb-2">
                                Mod Queue
                            </Link>
                        )}
                        <Link href={`/submit?community_id=${community.id}`} className="flex items-center justify-center w-full py-1.5 bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] font-bold rounded-full text-[14px] transition-colors mb-2 border-0 outline-none focus:outline-none focus:ring-0">
                            Create Post
                        </Link>
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
