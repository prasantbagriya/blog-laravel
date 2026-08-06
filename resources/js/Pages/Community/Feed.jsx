import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share, Bookmark, MoreHorizontal, TrendingUp, Home, Compass, Plus, Search, Flag, Link as LinkIcon, Trash } from 'lucide-react';

const PostDropdown = ({ post, auth }) => {
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
                                alert('Post reported.');
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

export default function Feed({ auth, posts }) {
    return (
        <div className="min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20">
            <Head title="Home" />
            
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-[#EDEFF1]">
                <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight hidden sm:block">
                            Nexus
                        </span>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="hidden sm:block flex-1 max-w-2xl mx-8 relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search size={20} className="text-[#878A8C]" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search Nexus" 
                            className="w-full bg-[#F6F7F8] hover:bg-white hover:border-[#0079D3] border border-transparent rounded-full py-2.5 pl-12 pr-4 text-[14px] font-medium text-[#1C1C1C] placeholder-[#878A8C] focus:outline-none focus:bg-white focus:border-[#0079D3] focus:ring-0 transition-all shadow-none" 
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link href="/dashboard" className="flex items-center gap-2 hover:bg-[#F6F7F8] px-2 py-1.5 rounded-full transition-colors">
                                <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                                    {auth.user.profile_picture ? (
                                        <img src={auth.user.profile_picture} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-[#0079D3] to-[#4F46E5]"></div>
                                    )}
                                </div>
                                <span className="font-bold text-[14px] hidden sm:block">{auth.user.name}</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] transition-colors">
                                    Log In
                                </Link>
                                <Link href="/register" className="px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="w-full mx-auto pt-6 px-4 flex gap-6">
                
                {/* Left Sidebar */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-20 space-y-2">
                        <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#F6F7F8] text-[#1C1C1C] font-bold">
                            <Home size={22} strokeWidth={2.5} /> Home
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#1C1C1C] hover:bg-[#F6F7F8] font-medium transition-colors">
                            <Compass size={22} className="text-[#878A8C]" /> Popular
                        </a>
                        <div className="pt-4 mt-4 border-t border-[#EDEFF1]">
                            <p className="text-[10px] font-bold text-[#878A8C] uppercase tracking-wider mb-2 px-4">Recent Communities</p>
                            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#1C1C1C] hover:bg-[#F6F7F8] font-medium transition-colors">
                                <div className="w-6 h-6 rounded-full bg-green-500"></div>
                                r/laravel
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#1C1C1C] hover:bg-[#F6F7F8] font-medium transition-colors">
                                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                                r/reactjs
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Feed Content */}
                <div className="flex-1 space-y-4">
                    
                    {/* Create Post Input */}
                    <Link href="/submit" className="bg-white rounded-md p-2 flex gap-2 items-center cursor-text mb-4">
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

                    {/* Posts List */}
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white border border-[#EDEFF1] hover:border-[#878A8C] rounded-md flex cursor-pointer transition-colors">
                            
                            {/* Vote Column (Classic Reddit Style) */}
                            <div className="w-10 bg-[#F8F9FA] rounded-l-md flex flex-col items-center py-2 gap-1 flex-shrink-0">
                                <button 
                                    onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'post', votable_id: post.id, value: 1 }, { preserveScroll: true }); }}
                                    className={`p-1 rounded transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === 1 ? 'text-[#FF4500] bg-orange-50' : 'text-[#878A8C] hover:text-[#FF4500] hover:bg-[#EAEAEA]'}`}
                                >
                                    <ArrowBigUp size={22} strokeWidth={1.5} className={post.user_vote === 1 ? 'fill-current' : ''} />
                                </button>
                                <span className={`text-[12px] font-bold ${post.user_vote === 1 ? 'text-[#FF4500]' : post.user_vote === -1 ? 'text-[#7193FF]' : 'text-[#1C1C1C]'}`}>{post.score}</span>
                                <button 
                                    onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'post', votable_id: post.id, value: -1 }, { preserveScroll: true }); }}
                                    className={`p-1 rounded transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === -1 ? 'text-[#7193FF] bg-blue-50' : 'text-[#878A8C] hover:text-[#7193FF] hover:bg-[#EAEAEA]'}`}
                                >
                                    <ArrowBigDown size={22} strokeWidth={1.5} className={post.user_vote === -1 ? 'fill-current' : ''} />
                                </button>
                            </div>
                            
                            {/* Post Content */}
                            <div className="p-2 pt-2.5 flex-1 min-w-0">
                                <div className="flex items-center text-[12px] text-[#787C7E] mb-2 gap-1.5 flex-wrap">
                                    <Link href={`/community/${post.community}`} className="font-bold text-[#1C1C1C] hover:underline">
                                        r/{post.community}
                                    </Link>
                                    <span className="text-[10px]">•</span>
                                    <span>Posted by <span className="hover:underline">u/{post.author.username}</span></span>
                                    <span>{post.created_at}</span>
                                </div>
                                <Link href={`/r/${post.community}/comments/${post.id}/${post.slug}`} className="font-bold text-[18px] text-[#1C1C1C] hover:underline leading-snug">
                                    {post.title}
                                </Link>
                                {post.type === 'TEXT' && post.content && (
                                    <div className="relative overflow-hidden max-h-40 mb-3 pr-4">
                                        <div 
                                            className="text-[14px] text-[#1C1C1C] leading-relaxed prose prose-sm max-w-none prose-a:text-[#0079D3] prose-a:no-underline hover:prose-a:underline prose-img:rounded-md prose-img:my-2 prose-p:my-1"
                                            dangerouslySetInnerHTML={{ __html: post.content }}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                                    </div>
                                )}
                                
                                {post.type === 'LINK' && post.link_url && (
                                    <a 
                                        href={post.link_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block mb-3 p-3 border border-[#EDEFF1] rounded-md hover:border-[#0079D3] transition-colors bg-[#F8F9FA] group mr-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0079D3]">
                                                <LinkIcon size={16} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-[14px] font-bold text-[#1C1C1C] truncate group-hover:text-[#0079D3]">{post.link_url}</div>
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {(post.type === 'IMAGE' || post.type === 'VIDEO') && post.media_urls && post.media_urls.length > 0 && (
                                    <div className="mb-3 rounded-md overflow-hidden bg-black flex items-center justify-center max-h-96 mr-4">
                                        {post.type === 'VIDEO' ? (
                                            <video 
                                                src={post.media_urls[0]} 
                                                controls 
                                                className="max-w-full max-h-96"
                                            />
                                        ) : (
                                            <img 
                                                src={post.media_urls[0]} 
                                                alt="Post media" 
                                                className="max-w-full max-h-96 object-contain"
                                            />
                                        )}
                                    </div>
                                )}
                                
                                {/* Action Buttons (Pill shape, subtle gray bg) */}
                                <div className="flex gap-1 -ml-1 mt-1">
                                    <Link href={`/r/${post.community}/comments/${post.id}/${post.slug}`} className="flex items-center gap-1.5 hover:bg-[#E2E7E9] px-2 py-1.5 rounded-full transition-colors font-bold text-[12px] text-[#878A8C]">
                                        <MessageSquare size={20} />
                                        <span className="text-[12px] font-bold">{post.comments_count} Comments</span>
                                    </Link>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigator.clipboard.writeText(`${window.location.origin}/r/${post.community}/comments/${post.id}`);
                                            alert('Link copied to clipboard!');
                                        }}
                                        className="flex items-center gap-1.5 hover:bg-[#E2E7E9] px-2 py-1.5 rounded-full transition-colors font-bold text-[12px] text-[#878A8C] border-0 outline-none focus:outline-none focus:ring-0"
                                    >
                                        <Share size={18} strokeWidth={2} />
                                        Share
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.post(`/posts/${post.id}/save`, {}, { preserveScroll: true });
                                        }}
                                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-colors font-bold text-[12px] border-0 outline-none focus:outline-none focus:ring-0 ${post.is_saved ? 'text-[#0079D3] bg-blue-50 hover:bg-blue-100' : 'text-[#878A8C] hover:bg-[#E2E7E9]'}`}
                                    >
                                        <Bookmark size={18} strokeWidth={2} className={post.is_saved ? "fill-current" : ""} />
                                        {post.is_saved ? 'Saved' : 'Save'}
                                    </button>
                                    <PostDropdown post={post} auth={auth} />
                                </div>
                            </div>
                        </div>
                    ))}
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
                                <Link href="/submit" className="flex items-center justify-center w-full py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-full text-[14px] transition-colors border-0 outline-none focus:outline-none focus:ring-0">
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
        </div>
    );
}
