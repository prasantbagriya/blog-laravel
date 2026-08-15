import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { MessageSquare, Share, Bookmark, MoreHorizontal, ArrowBigUp, ArrowBigDown, Flag, Link as LinkIcon, Trash } from 'lucide-react';

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
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-[#EDEFF1] rounded-md shadow-lg z-20 py-1 overflow-hidden font-medium">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(`${window.location.origin}/r/${post.community}/comments/${post.id}`);
                                alert('Link copied to clipboard!');
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] text-[#1C1C1C] flex items-center gap-2"
                        >
                            <LinkIcon size={16} /> Copy Link
                        </button>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                onReport(post.id, 'post');
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] text-[#1C1C1C] flex items-center gap-2"
                        >
                            <Flag size={16} /> Report
                        </button>
                        
                        {auth?.user?.username === post.author?.username && (
                            <>
                                <Link 
                                    href={`/submit?edit=${post.id}`}
                                    className="w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] text-[#1C1C1C] flex items-center gap-2 border-t border-[#EDEFF1]"
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
                                    className="w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] font-medium text-[#FF4500] flex items-center gap-2"
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

export default function PostCard({ post, auth, openReportModal }) {
    const handleVote = (value, e) => {
        e.preventDefault();
        router.post('/vote', { votable_type: 'post', votable_id: post.id, value }, { preserveScroll: true });
    };

    const handleSave = (e) => {
        e.preventDefault();
        router.post(`/posts/${post.id}/save`, {}, { preserveScroll: true });
    };

    return (
        <div className="bg-white border border-[#EDEFF1] hover:border-[#878A8C] rounded-md flex cursor-pointer transition-colors mb-4">
            {/* Vote Column */}
            <div className="w-10 bg-[#F8F9FA] rounded-l-md flex flex-col items-center py-2 gap-1 flex-shrink-0">
                <button 
                    onClick={(e) => handleVote(1, e)}
                    className={`p-1 rounded transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === 1 ? 'text-[#FF4500] bg-orange-50' : 'text-[#878A8C] hover:text-[#FF4500] hover:bg-[#EAEAEA]'}`}
                >
                    <ArrowBigUp size={22} strokeWidth={1.5} className={post.user_vote === 1 ? 'fill-current' : ''} />
                </button>
                <span className={`text-[12px] font-bold ${post.user_vote === 1 ? 'text-[#FF4500]' : post.user_vote === -1 ? 'text-[#7193FF]' : 'text-[#1C1C1C]'}`}>{post.score}</span>
                <button 
                    onClick={(e) => handleVote(-1, e)}
                    className={`p-1 rounded transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === -1 ? 'text-[#7193FF] bg-blue-50' : 'text-[#878A8C] hover:text-[#7193FF] hover:bg-[#EAEAEA]'}`}
                >
                    <ArrowBigDown size={22} strokeWidth={1.5} className={post.user_vote === -1 ? 'fill-current' : ''} />
                </button>
            </div>
            
            {/* Post Content */}
            <div className="p-2 pt-2.5 flex-1 min-w-0">
                {/* Post Meta */}
                <div className="flex items-center gap-1.5 text-[12px] text-[#787C7E] mb-2 font-medium flex-wrap">
                    <Link href={`/community/${post.community}`} className="font-bold text-[#1C1C1C] hover:underline">r/{post.community}</Link>
                    <span className="text-[#878A8C]">•</span>
                    <span className="flex items-center gap-1">
                        Posted by <Link href={`/u/${post.author?.username}`} className="hover:underline">u/{post.author?.username}</Link>
                        {post.author?.flair && <span className="px-1.5 py-0.5 bg-[#EDEFF1] text-[#1C1C1C] rounded-sm text-[10px] font-bold leading-none">{post.author.flair}</span>}
                    </span>
                    <span>{post.created_at}</span>
                </div>

                {/* Title */}
                <Link href={`/r/${post.community}/comments/${post.id}/${post.slug}`} className="block font-bold text-[18px] text-[#1C1C1C] hover:underline leading-snug mb-2 pr-4">
                    {post.flair && <span className="inline-block mr-2 px-2 py-0.5 bg-[#0079D3] text-white rounded-full text-[10px] font-bold align-middle">{post.flair}</span>}
                    {post.title}
                </Link>

                {post.type === 'TEXT' && post.content && (
                    <div className="relative overflow-hidden max-h-40 mb-3 pr-4">
                        <div 
                            className="text-[14px] text-[#1C1C1C] leading-relaxed prose prose-sm max-w-none prose-a:text-[#0079D3] prose-a:no-underline hover:prose-a:underline prose-img:rounded-md prose-img:my-2 prose-p:my-1"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
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
                                preload="metadata"
                                className="max-w-full max-h-96"
                            />
                        ) : (
                            <img 
                                src={post.media_urls[0]} 
                                alt="Post media" 
                                loading="lazy"
                                className="max-w-full max-h-96 object-contain"
                            />
                        )}
                    </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-1 -ml-1 mt-1">
                    <Link href={`/r/${post.community}/comments/${post.id}/${post.slug}`} className="flex items-center gap-1.5 hover:bg-[#E2E7E9] px-2 py-1.5 rounded-sm transition-colors font-bold text-[12px] text-[#878A8C]">
                        <MessageSquare size={20} />
                        <span className="text-[12px] font-bold">{post.comments_count} Comments</span>
                    </Link>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            navigator.clipboard.writeText(`${window.location.origin}/r/${post.community}/comments/${post.id}`);
                            alert('Link copied to clipboard!');
                        }}
                        className="flex items-center gap-1.5 hover:bg-[#E2E7E9] px-2 py-1.5 rounded-sm transition-colors font-bold text-[12px] text-[#878A8C] border-0 outline-none focus:outline-none focus:ring-0"
                    >
                        <Share size={18} strokeWidth={2} />
                        Share
                    </button>
                    <button 
                        onClick={handleSave}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-sm transition-colors font-bold text-[12px] border-0 outline-none focus:outline-none focus:ring-0 ${post.is_saved ? 'text-[#0079D3] bg-blue-50 hover:bg-blue-100' : 'text-[#878A8C] hover:bg-[#E2E7E9]'}`}
                    >
                        <Bookmark size={18} strokeWidth={2} className={post.is_saved ? "fill-current" : ""} />
                        {post.is_saved ? 'Saved' : 'Save'}
                    </button>
                    <PostDropdown post={post} auth={auth} onReport={openReportModal} />
                </div>
            </div>
        </div>
    );
}
