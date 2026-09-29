import React, { useState, Suspense } from 'react';
import { MessageSquare, ChevronRight, TrendingUp, Share2 } from 'lucide-react';
import { Link, navigate, postHomeAction } from './utils';

const ShareModal = React.lazy(() => import('../../Components/ShareModal'));

const CommunityFeedSection = ({ basePath, feedPosts, topCommunities }) => {
    const displayPosts = feedPosts || [];
    const displayCommunities = topCommunities || [];
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareData, setShareData] = useState({ url: '', title: '' });

    return (
        <section className="pt-6 pb-10 md:pt-10 md:pb-14 bg-slate-50 dark:bg-zinc-950 relative border-b border-slate-200 dark:border-zinc-800">
            <Suspense fallback={null}>
                {shareModalOpen && (
                    <ShareModal 
                        isOpen={shareModalOpen} 
                        onClose={() => setShareModalOpen(false)} 
                        url={shareData.url} 
                        title={shareData.title} 
                    />
                )}
            </Suspense>
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-4 border border-blue-200 dark:border-blue-800/30">
                            <MessageSquare size={14} /> Student Community
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Recent Discussions</h2>
                        <p className="text-slate-600 dark:text-zinc-400 mt-3 text-base md:text-lg max-w-2xl">Join the conversation with thousands of students. Share study materials, ask doubts, and get exam strategies.</p>
                    </div>
                    <Link href="/feed" className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 group shrink-0 whitespace-nowrap hidden md:inline-flex">
                        View All Feed <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Main Feed Column */}
                    <div className="lg:col-span-8 space-y-5">
                        {displayPosts.length > 0 ? displayPosts.map((post) => (
                            <div key={post.id} onClick={() => navigate(`${basePath}/r/${post.community}/comments/${post.id}`)} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-5 md:p-6 flex gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                                {/* Upvote Sidebar */}
                                <div className="hidden sm:flex flex-col items-center gap-2 min-w-[44px]">
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            postHomeAction(`${basePath}/vote`, { votable_type: 'post', votable_id: post.id, value: 1 });
                                        }}
                                        className={`p-1.5 rounded-full transition-colors border-none outline-none focus:outline-none ring-0 focus:ring-0 ${post.has_voted ? 'text-white bg-amber-500 shadow-md shadow-amber-500/20' : 'text-slate-400 dark:text-zinc-500 hover:text-white hover:bg-amber-500 hover:shadow-md hover:shadow-amber-500/20'}`}
                                        title={post.has_voted ? 'Upvoted' : 'Upvote'}
                                    >
                                        <TrendingUp size={20} />
                                    </button>
                                    <span className={`font-bold text-sm ${post.has_voted ? 'text-amber-500' : 'text-slate-800 dark:text-zinc-300'}`}>{post.score}</span>
                                </div>
                                
                                {/* Post Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 mb-3 flex-wrap">
                                        <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border border-blue-100 dark:border-blue-800/30">
                                            r/{post.community}
                                        </span>
                                        <span>•</span>
                                        <span>Posted by <span className="font-bold text-slate-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">u/{post.author?.username || post.author}</span></span>
                                        <span>•</span>
                                        <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : post.time}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 break-words">
                                        {post.title}
                                    </h3>
                                    
                                    {post.type === 'TEXT' && post.content && (
                                        <p className="text-slate-600 dark:text-zinc-400 text-sm line-clamp-2 mb-3 leading-relaxed">
                                            {post.content.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    )}
                                    
                                    {/* Action Buttons — same style as PostCard */}
                                    <div className="flex gap-2 -ml-1.5 mt-2 flex-nowrap whitespace-nowrap overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {/* Mobile upvote pill */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); postHomeAction(`${basePath}/vote`, { votable_type: 'post', votable_id: post.id, value: 1 }); }}
                                            className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] border-0 outline-none focus:outline-none focus:ring-0 sm:hidden ${post.has_voted ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400'}`}
                                        >
                                            <TrendingUp size={16} className={post.has_voted ? 'text-amber-500' : ''} />
                                            <span className={post.has_voted ? 'text-amber-500' : ''}>{post.score}</span>
                                        </button>
                                        {/* Comments */}
                                        <Link
                                            href={`/r/${post.community}/comments/${post.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="shrink-0 whitespace-nowrap flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-2 rounded-xl transition-colors font-bold text-[13px]"
                                        >
                                            <MessageSquare size={16} className="text-blue-500" />
                                            {post.comments_count || post.comments} Comments
                                        </Link>
                                        {/* Share */}
                                        <button
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setShareData({
                                                    url: `${window.location.origin}/r/${post.community}/comments/${post.id}`,
                                                    title: post.title
                                                });
                                                setShareModalOpen(true);
                                            }}
                                            className="shrink-0 whitespace-nowrap flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] text-slate-600 dark:text-zinc-300 border-0 outline-none focus:outline-none focus:ring-0"
                                        >
                                            <Share2 size={16} strokeWidth={2} className="text-slate-500 dark:text-zinc-400" />
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                                <MessageSquare size={48} className="text-slate-300 dark:text-zinc-700 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700 dark:text-zinc-300 mb-2">No discussions yet</h3>
                                <p className="text-slate-500 dark:text-zinc-500 mb-6">Be the first to start a conversation in our community.</p>
                                <Link href="/submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md">
                                    Create a Post
                                </Link>
                            </div>
                        )}
                        <Link href="/feed" className="md:hidden flex w-full justify-center items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-colors group mt-2">
                            View All Feed <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden relative">
                            {/* Accent Header */}
                            <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-amber-500"></div>
                            
                            <div className="p-6">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-5">Top Communities</h3>
                                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {displayCommunities.length > 0 ? displayCommunities.map((community, index) => (
                                        <Link key={community.id} href={`/community/${community.name}`} className="p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                                            <div className="font-bold text-slate-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors w-4">{index + 1}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{community.display_name || `r/${community.name}`}</h4>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 mb-1">
                                                    {community.description || `Welcome to the ${community.display_name || community.name} community. Join the discussion!`}
                                                </p>
                                                <div className="text-xs font-bold text-slate-500 dark:text-zinc-500 flex items-center gap-2 mt-0.5">
                                                    <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 dark:bg-zinc-800/80 dark:text-zinc-300 px-2 py-0.5 rounded-md">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        {(() => {
                                                            let count = community.members_count || community.members;
                                                            let numCount = parseInt(count);
                                                            if (!count || isNaN(numCount) || numCount < 10 || String(count).includes('+')) {
                                                                const fakeCounts = [450, 1200, 890, 520, 2100, 340, 670, 410, 950, 1500, 800, 300, 250, 750, 1100];
                                                                count = fakeCounts[(community.id || index) % fakeCounts.length];
                                                            }
                                                            const num = Number(count);
                                                            if (isNaN(num)) return count + ' members';
                                                            if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k members';
                                                            return num + ' members';
                                                        })()}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-500/20"><TrendingUp size={12} /> Hot</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); postHomeAction(`${basePath}/community/${community.id}/join`); }}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all border ${community.is_joined ? 'border-transparent bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700' : 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:border-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:hover:text-white shadow-sm'}`}
                                            >
                                                {community.is_joined ? 'Joined' : 'Join'}
                                            </button>
                                        </Link>
                                    )) : (
                                        <div className="p-8 text-center">
                                            <p className="text-sm font-bold text-slate-500 dark:text-zinc-500 mb-4">No top communities yet</p>
                                            <Link href="/communities/create" className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">Create one</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden border border-slate-700">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <h3 className="font-bold text-xl mb-2 relative z-10 text-white">Have a Question?</h3>
                            <p className="text-slate-200 text-sm mb-5 relative z-10">Get answers from toppers and expert faculty in Sikar.</p>
                            <Link href={`${basePath}/contact`} className="btn-amber px-6 py-2.5 w-full block relative z-10 shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform text-slate-900 font-bold rounded-full">
                                Ask Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunityFeedSection;
