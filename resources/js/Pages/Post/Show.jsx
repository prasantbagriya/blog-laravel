import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share, Bookmark, MoreHorizontal, Flag, Link as LinkIcon, Trash } from 'lucide-react';

const PostDropdown = ({ post, auth }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div 
                onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
                className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#F6F7F8] rounded-sm transition-colors cursor-pointer text-[#878A8C]"
            >
                <MoreHorizontal size={20} />
            </div>
            
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={(e) => { e.preventDefault(); setIsOpen(false); }}></div>
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-[#EDEFF1] rounded-md shadow-lg z-20 py-1 overflow-hidden">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(window.location.href);
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
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Recursive Comment Component
const CommentThread = ({ comment, postId, auth, userCommentVotes }) => {
    const userVote = userCommentVotes?.[comment.id] || 0;
    const [showReplyForm, setShowReplyForm] = useState(false);
    
    const { data, setData, post, processing, reset } = useForm({
        content: '',
        parent_id: comment.id,
    });

    const submitReply = (e) => {
        e.preventDefault();
        post(route('post.comment.store', postId), {
            onSuccess: () => {
                setShowReplyForm(false);
                reset();
            }
        });
    };

    return (
        <div className="mt-4">
            <div className="flex gap-2">
                <div className="flex flex-col items-center">
                    <img src={`https://ui-avatars.com/api/?name=${comment.author?.username}&background=random`} className="w-8 h-8 rounded-full" />
                    <div className="w-[2px] h-full bg-[#EDEFF1] mt-2 group-hover:bg-[#878A8C] transition-colors cursor-pointer"></div>
                </div>
                
                <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[12px] text-[#1C1C1C]">u/{comment.author?.username || 'deleted'}</span>
                        <span className="text-[#787C7E] text-[12px]">{dayjs(comment.created_at).fromNow()}</span>
                    </div>
                    
                    <div className="text-[14px] text-[#1C1C1C] mb-2 leading-relaxed">
                        {comment.content}
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'comment', votable_id: comment.id, value: 1 }, { preserveScroll: true }); }}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-sm transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${userVote === 1 ? 'text-[#FF4500] bg-orange-50' : 'hover:bg-[#F6F7F8] text-[#878A8C] hover:text-[#FF4500]'}`}
                        >
                            <ArrowBigUp size={20} className={userVote === 1 ? 'fill-current' : ''} />
                        </button>
                        <span className={`text-[12px] font-bold ${userVote === 1 ? 'text-[#FF4500]' : userVote === -1 ? 'text-[#7193FF]' : 'text-[#1C1C1C]'}`}>{comment.score}</span>
                        <button 
                            onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'comment', votable_id: comment.id, value: -1 }, { preserveScroll: true }); }}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-sm transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${userVote === -1 ? 'text-[#7193FF] bg-blue-50' : 'hover:bg-[#F6F7F8] text-[#878A8C] hover:text-[#7193FF]'}`}
                        >
                            <ArrowBigDown size={20} className={userVote === -1 ? 'fill-current' : ''} />
                        </button>
                        
                        <button 
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#F6F7F8] rounded-sm transition-colors border-0 outline-none focus:outline-none focus:ring-0 text-[#878A8C]"
                        >
                            <MessageSquare size={16} />
                            <span className="text-[12px] font-bold">Reply</span>
                        </button>
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && auth?.user && (
                        <div className="mt-2 mb-4 pr-4">
                            <form onSubmit={submitReply}>
                                <textarea
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    placeholder="What are your thoughts?"
                                    className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-2 px-3 text-[14px] outline-none transition-colors min-h-[100px]"
                                ></textarea>
                                <div className="flex justify-end gap-2 mt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowReplyForm(false)}
                                        className="px-4 py-1.5 font-bold text-[14px] bg-[#F6F7F8] hover:bg-[#E2E7E9] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing || !data.content}
                                        className="px-4 py-1.5 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0"
                                    >
                                        Reply
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="pl-4">
                            {comment.replies.map(reply => (
                                <CommentThread key={reply.id} comment={reply} postId={postId} auth={auth} userCommentVotes={userCommentVotes} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default function ShowPost({ auth, community, post, comments, userCommentVotes }) {
    const { data, setData, post: submitForm, processing, reset } = useForm({
        content: '',
        parent_id: null,
    });

    const plainTextContent = post.excerpt || (post.content ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : `Read this post by u/${post.author.username} in r/${community.name}.`);
    const pageTitle = `${post.title} - r/${community.name} - coachinginsikar`;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://coachingsinsikar.com/r/${community.name}/comments/${post.id}/${post.slug || ''}`;

    const submitComment = (e) => {
        e.preventDefault();
        submitForm(route('post.comment.store', post.id), {
            onSuccess: () => reset()
        });
    };

    return (
        <div className="min-h-screen bg-[#DAE0E6] text-[#1C1C1C] font-sans pb-20">
            <Head title={pageTitle}>
                <meta name="description" content={plainTextContent} />
                <link rel="canonical" href={currentUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={plainTextContent} />
                <meta property="og:type" content="article" />
                {post.media_urls?.[0] && <meta property="og:image" content={post.media_urls[0]} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={plainTextContent} />
                {post.media_urls?.[0] && <meta name="twitter:image" content={post.media_urls[0]} />}
            </Head>
            
            <header className="fixed top-0 z-50 w-full bg-white border-b border-[#EDEFF1]">
                <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href="/feed" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight hidden sm:block">
                            coachinginsikar
                        </span>
                    </Link>
                </div>
            </header>

            <div className="w-full mx-auto px-4 sm:px-6 flex gap-6 mt-6">
                
                {/* Main Content Column */}
                <div className="flex-1 bg-white rounded-md border border-[#EDEFF1]">
                    
                    {/* Post Content */}
                    <div className="flex pr-2 pt-2">
                        {/* Vote Column */}
                        <div className="w-10 bg-white rounded-l-md flex flex-col items-center pt-2 gap-1 flex-shrink-0">
                            <button 
                                onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'post', votable_id: post.id, value: 1 }, { preserveScroll: true }); }}
                                className={`p-1 rounded transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === 1 ? 'text-[#FF4500] bg-orange-50' : 'text-[#878A8C] hover:text-[#FF4500] hover:bg-[#EDEFF1]'}`}
                            >
                                <ArrowBigUp size={24} className={post.user_vote === 1 ? 'fill-current text-[#FF4500]' : 'text-[#878A8C] hover:text-[#FF4500]'} />
                            </button>
                            <span className={`text-[12px] font-bold ${post.user_vote === 1 ? 'text-[#FF4500]' : post.user_vote === -1 ? 'text-[#7193FF]' : 'text-[#1C1C1C]'}`}>{post.score}</span>
                            <button 
                                onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'post', votable_id: post.id, value: -1 }, { preserveScroll: true }); }}
                                className={`p-1 rounded transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === -1 ? 'text-[#7193FF] bg-blue-50' : 'text-[#878A8C] hover:text-[#7193FF] hover:bg-[#EDEFF1]'}`}
                            >
                                <ArrowBigDown size={24} className={post.user_vote === -1 ? 'fill-current text-[#7193FF]' : 'text-[#878A8C] hover:text-[#7193FF]'} />
                            </button>
                        </div>
                        
                        <div className="flex-1 pt-2 px-2 pb-2">
                            <div className="flex items-center gap-1 text-[12px] mb-2">
                                {community.icon_image && (
                                    <img src={community.icon_image} className="w-5 h-5 rounded-full mr-1" />
                                )}
                                <Link href={`/community/${community.name}`} className="font-bold text-[#1C1C1C] hover:underline">
                                    {community.display_name}
                                </Link>
                                <span className="text-[#787C7E] mx-1">•</span>
                                <span className="text-[#787C7E]">Posted by u/{post.author.username}</span>
                                <span className="text-[#787C7E] ml-1">{post.created_at}</span>
                            </div>
                            
                            <h1 className="text-[20px] font-medium text-[#1C1C1C] mb-4 leading-snug">
                                {post.title}
                            </h1>
                            
                            {post.type === 'TEXT' && post.content && (
                                <div 
                                    className="text-[14px] text-[#1C1C1C] mb-6 leading-relaxed whitespace-pre-wrap prose prose-sm sm:prose-base max-w-none prose-a:text-[#0079D3] prose-a:no-underline hover:prose-a:underline prose-img:rounded-md prose-img:my-4 prose-p:my-2"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            )}

                            {post.type === 'LINK' && post.link_url && (
                                <a 
                                    href={post.link_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block mb-6 p-4 border border-[#EDEFF1] rounded-md hover:border-[#0079D3] transition-colors bg-[#F8F9FA] group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0079D3]">
                                            <LinkIcon size={20} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="text-[14px] font-bold text-[#1C1C1C] truncate group-hover:text-[#0079D3]">{post.link_url}</div>
                                            <div className="text-[12px] text-[#878A8C] truncate">Click to open link</div>
                                        </div>
                                    </div>
                                </a>
                            )}

                            {(post.type === 'IMAGE' || post.type === 'VIDEO') && post.media_urls && post.media_urls.length > 0 && (
                                <div className="mb-6 rounded-md overflow-hidden bg-black flex items-center justify-center max-h-[600px]">
                                    {post.type === 'VIDEO' ? (
                                        <video 
                                            src={post.media_urls[0]} 
                                            controls 
                                            className="max-w-full max-h-[600px]"
                                        />
                                    ) : (
                                        <img 
                                            src={post.media_urls[0]} 
                                            alt="Post media" 
                                            className="max-w-full max-h-[600px] object-contain"
                                        />
                                    )}
                                </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#F6F7F8] rounded-sm transition-colors cursor-pointer text-[#878A8C]">
                                    <MessageSquare size={20} />
                                    <span className="text-[12px] font-bold">{post.comments_count} Comments</span>
                                </div>
                                <div 
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Link copied to clipboard!');
                                    }}
                                    className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#F6F7F8] rounded-sm transition-colors cursor-pointer text-[#878A8C]"
                                >
                                    <Share size={20} />
                                    <span className="text-[12px] font-bold">Share</span>
                                </div>
                                <div 
                                    onClick={() => router.post(`/posts/${post.id}/save`, {}, { preserveScroll: true })}
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-sm transition-colors cursor-pointer ${post.is_saved ? 'text-[#0079D3] hover:bg-blue-50' : 'text-[#878A8C] hover:bg-[#F6F7F8]'}`}
                                >
                                    <Bookmark size={20} className={post.is_saved ? "fill-current" : ""} />
                                    <span className="text-[12px] font-bold">{post.is_saved ? 'Saved' : 'Save'}</span>
                                </div>
                                <PostDropdown post={post} auth={auth} />
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="px-10 pb-10">
                        {auth?.user ? (
                            <div className="mb-6 mt-4">
                                <div className="text-[12px] mb-1">
                                    Comment as <span className="text-[#0079D3]">{auth.user.username || auth.user.name}</span>
                                </div>
                                <form onSubmit={submitComment}>
                                    <textarea
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        placeholder="What are your thoughts?"
                                        className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-2 px-3 text-[14px] outline-none transition-colors min-h-[140px]"
                                    ></textarea>
                                    <div className="flex justify-end mt-2 bg-[#F6F7F8] border border-t-0 border-[#EDEFF1] rounded-b-md p-2 -mt-1">
                                        <button 
                                            type="submit" 
                                            disabled={processing || !data.content}
                                            className="px-6 py-1.5 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0"
                                        >
                                            Comment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between border border-[#EDEFF1] rounded-md p-4 mb-6">
                                <h2 className="text-[#1C1C1C] font-medium">Log in or sign up to leave a comment</h2>
                                <div className="flex gap-2">
                                    <Link href="/login" className="px-6 py-1.5 font-bold text-[14px] text-[#0079D3] rounded-full hover:bg-[#F6F7F8]">Log In</Link>
                                    <Link href="/register" className="px-6 py-1.5 font-bold text-[14px] text-white bg-[#0079D3] rounded-full hover:bg-[#005EAC]">Sign Up</Link>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-[#EDEFF1] pt-6 border-b-0">
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <CommentThread key={comment.id} comment={comment} postId={post.id} auth={auth} userCommentVotes={userCommentVotes} />
                                ))
                            ) : (
                                <div className="text-center py-10 text-[#878A8C]">
                                    No comments yet. Be the first to share what you think!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="hidden lg:block w-[312px]">
                    <div className="bg-white rounded-md border border-[#EDEFF1] p-3 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <h2 className="font-bold text-[16px]">About Community</h2>
                        </div>
                        {community.description && (
                            <p className="text-[14px] text-[#1C1C1C] mb-4">{community.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-[14px] font-medium border-t border-[#EDEFF1] pt-3 mb-4">
                            <div>
                                <div className="text-[16px] font-bold">1</div>
                                <div className="text-[#787C7E] text-[12px]">Members</div>
                            </div>
                            <div>
                                <div className="text-[16px] font-bold flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    1
                                </div>
                                <div className="text-[#787C7E] text-[12px]">Online</div>
                            </div>
                        </div>
                        <hr className="mb-4 border-[#EDEFF1]" />
                        <Link href="/submit" className="flex items-center justify-center w-full py-1.5 bg-[#0079D3] hover:bg-[#005EAC] text-white font-bold rounded-full text-[14px] transition-colors border-0 outline-none focus:outline-none focus:ring-0 mb-2">
                            Create Post
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
