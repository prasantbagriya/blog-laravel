import React, { useState, Suspense } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share, Bookmark, MoreHorizontal, Flag, Link as LinkIcon, Trash, Home, Compass } from 'lucide-react';
import GlobalNavbar from '@/NextComponents/GlobalNavbar';
const ShareModal = React.lazy(() => import('@/Components/ShareModal'));
const ReportModal = React.lazy(() => import('@/Components/ReportModal'));
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const PostDropdown = ({ post, auth, openReportModal }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div 
                onClick={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-zinc-400"
            >
                <MoreHorizontal size={20} />
            </div>
            
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={(e) => { e.preventDefault(); setIsOpen(false); }}></div>
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[14px] font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2"
                        >
                            <LinkIcon size={16} /> Copy Link
                        </button>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                openReportModal(post.id, 'post');
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[14px] font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2"
                        >
                            <Flag size={16} /> Report
                        </button>
                        
                        {auth?.user?.username === post.author.username && (
                            <>
                                <Link 
                                    href={`/submit?edit=${post.id}`}
                                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[14px] font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2 border-t border-slate-100 dark:border-zinc-800"
                                >
                                    <span className="w-4 h-4 flex items-center justify-center border border-current rounded-sm text-xs">E</span> Edit Post
                                </Link>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if(confirm('Are you sure you want to delete this post?')) {
                                            router.delete(`/posts/${post.id}`);
                                        }
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-[14px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2"
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
        <div className="mt-5">
            <div className="flex gap-3">
                <div className="flex flex-col items-center group">
                    <img src={`https://ui-avatars.com/api/?name=${comment.author?.username}&background=random`} width="32" height="32" className="w-8 h-8 rounded-full shadow-sm" />
                    <div className="w-0.5 h-full bg-slate-200 dark:bg-zinc-800 mt-2 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors cursor-pointer rounded-full"></div>
                </div>
                
                <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-[13px] text-slate-900 dark:text-white">u/{comment.author?.username || 'deleted'}</span>
                        <span className="text-slate-500 dark:text-zinc-500 text-[12px]">{dayjs(comment.created_at).fromNow()}</span>
                    </div>
                    
                    <div className="text-[14px] text-slate-800 dark:text-zinc-300 mb-3 leading-relaxed">
                        {comment.content}
                    </div>
                    
                    <div className="flex items-center gap-1.5 -ml-2">
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 rounded-full px-1 py-0.5">
                            <button 
                                onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'comment', votable_id: comment.id, value: 1 }, { preserveScroll: true }); }}
                                className={`flex items-center justify-center w-7 h-7 rounded-full transition-all border-0 outline-none focus:outline-none focus:ring-0 ${userVote === 1 ? 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-rose-500'}`}
                            >
                                <ArrowBigUp size={18} className={userVote === 1 ? 'fill-current' : ''} />
                            </button>
                            <span className={`text-[12px] font-extrabold px-1 ${userVote === 1 ? 'text-rose-600' : userVote === -1 ? 'text-blue-600' : 'text-slate-700 dark:text-zinc-300'}`}>{comment.score}</span>
                            <button 
                                onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'comment', votable_id: comment.id, value: -1 }, { preserveScroll: true }); }}
                                className={`flex items-center justify-center w-7 h-7 rounded-full transition-all border-0 outline-none focus:outline-none focus:ring-0 ${userVote === -1 ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-blue-500'}`}
                            >
                                <ArrowBigDown size={18} className={userVote === -1 ? 'fill-current' : ''} />
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:bg-zinc-800 rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0 text-slate-500 dark:text-zinc-400"
                        >
                            <MessageSquare size={16} />
                            <span className="text-[12px] font-bold">Reply</span>
                        </button>
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && auth?.user && (
                        <div className="mt-3 mb-4 pr-4">
                            <form onSubmit={submitReply}>
                                <textarea
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    placeholder="What are your thoughts?"
                                    className="w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-[14px] text-slate-900 dark:text-white outline-none transition-colors min-h-[100px] hover:border-blue-400"
                                ></textarea>
                                <div className="flex justify-end gap-2 mt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowReplyForm(false)}
                                        className="px-5 py-2 font-bold text-[14px] bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing || !data.content}
                                        className="px-5 py-2 font-bold text-[14px] bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 border-0 outline-none focus:outline-none focus:ring-0 shadow-md shadow-rose-600/20"
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
    
    const [showShareModal, setShowShareModal] = useState(false);
    const [reportModalData, setReportModalData] = useState({ isOpen: false, id: null, type: null });
    
    // Sidebar State
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const openReportModal = (id, type) => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }
        setReportModalData({ isOpen: true, id, type });
    };

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
        <div className="min-h-screen overflow-x-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans transition-colors selection:bg-blue-500/30">
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
            
            <GlobalNavbar auth={auth} />
            
            <Suspense fallback={null}>
                {showShareModal && (
                    <ShareModal 
                        isOpen={showShareModal} 
                        onClose={() => setShowShareModal(false)} 
                        url={currentUrl} 
                        title={post.title} 
                    />
                )}
            </Suspense>

            <div className="max-w-[1400px] w-full mx-auto pt-24 md:pt-32 px-4 sm:px-6 flex gap-6">
                
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

                        <Link href="/feed?filter=home" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-zinc-800`}>
                            <Home size={20} strokeWidth={2} className="text-slate-400 dark:text-zinc-500 flex-shrink-0" /> 
                            <span className={isSidebarCollapsed ? 'lg:hidden' : ''}>Home</span>
                        </Link>
                        <Link href="/feed?filter=popular" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-zinc-800`}>
                            <Compass size={20} strokeWidth={2} className="text-slate-400 dark:text-zinc-500 flex-shrink-0" /> 
                            <span className={isSidebarCollapsed ? 'lg:hidden' : ''}>Popular</span>
                        </Link>
                        
                        {auth?.joined_communities && auth.joined_communities.length > 0 && (
                            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800">
                                <p className={`text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-4 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>Your Communities</p>
                                {auth.joined_communities.map(c => (
                                    <Link key={c.id} href={`/community/${c.name}`} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all border border-transparent ${community.id === c.id ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-zinc-800 font-bold' : 'text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white hover:border-slate-200 dark:hover:border-zinc-800'}`}>
                                        {c.icon_image ? (
                                            <img loading="lazy" decoding="async" fetchPriority="low" src={c.icon_image} width="28" height="28" className="w-7 h-7 rounded-lg object-cover shadow-sm border border-slate-100 dark:border-zinc-700 flex-shrink-0" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs shadow-sm border border-blue-200 dark:border-blue-800/50 flex-shrink-0">
                                                {c.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className={`truncate text-sm ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>r/{c.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Column */}
                <div className="flex-1 max-w-3xl pb-24 min-w-0">
                    
                    {/* Mobile Menu Toggle button */}
                    <div className="flex items-center gap-3 lg:hidden mb-4">
                        <button 
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="flex items-center justify-center w-10 h-10 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full shadow-sm text-slate-700 dark:text-zinc-300 hover:text-blue-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </button>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors">
                        
                        {/* Post Content */}
                        <div className="flex pr-4 sm:pr-6 pt-6">
                            {/* Vote Column */}
                            <div className="w-12 sm:w-16 bg-white dark:bg-zinc-900 rounded-tl-3xl flex flex-col items-center pt-2 gap-1.5 flex-shrink-0">
                                <button 
                                    onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'post', votable_id: post.id, value: 1 }, { preserveScroll: true }); }}
                                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all border-0 outline-none focus:outline-none focus:ring-0 ${post.user_vote === 1 ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                                >
                                    <ArrowBigUp size={24} className={post.user_vote === 1 ? 'fill-current' : ''} />
                                </button>
                                <span className={`text-[13px] font-black ${post.user_vote === 1 ? 'text-rose-600' : post.user_vote === -1 ? 'text-blue-600' : 'text-slate-700 dark:text-zinc-300'}`}>{post.score}</span>
                                <button 
                                    onClick={(e) => { e.preventDefault(); router.post('/vote', { votable_type: 'post', votable_id: post.id, value: -1 }, { preserveScroll: true }); }}
                                    className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all border-0 outline-none focus:outline-none focus:ring-0 ${post.user_vote === -1 ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                                >
                                    <ArrowBigDown size={24} className={post.user_vote === -1 ? 'fill-current' : ''} />
                                </button>
                            </div>
                            
                            <div className="flex-1 pt-1 pb-4 min-w-0">
                                <div className="flex items-center flex-wrap gap-2 text-[12px] sm:text-[13px] mb-3">
                                    {community.icon_image ? (
                                        <img src={community.icon_image} width="24" height="24" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-sm" />
                                    ) : (
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-sm flex items-center justify-center text-[10px] text-white font-bold">{community.display_name.charAt(0)}</div>
                                    )}
                                    <Link href={`/community/${community.name}`} className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        r/{community.display_name}
                                    </Link>
                                    <span className="text-slate-400 dark:text-zinc-500 hidden sm:inline">•</span>
                                    <span className="text-slate-500 dark:text-zinc-400 w-full sm:w-auto">Posted by <span className="font-medium text-slate-700 dark:text-zinc-300">u/{post.author.username}</span></span>
                                    <span className="text-slate-400 dark:text-zinc-500">{dayjs(post.created_at).fromNow()}</span>
                                </div>
                                
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
                                    {post.title}
                                </h1>
                                
                                {post.type === 'TEXT' && post.content && (
                                    <div 
                                        className="text-[14px] sm:text-[15px] text-slate-800 dark:text-zinc-300 mb-6 leading-relaxed whitespace-pre-wrap prose prose-slate dark:prose-invert max-w-none break-words overflow-x-auto prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-sm prose-img:my-6"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                )}

                                {post.type === 'LINK' && post.link_url && (
                                    <a 
                                        href={post.link_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block mb-6 p-4 border border-slate-200 dark:border-zinc-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-slate-50 dark:bg-zinc-800/50 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0">
                                                <LinkIcon size={20} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.link_url}</div>
                                                <div className="text-[12px] sm:text-[13px] text-slate-500 dark:text-zinc-400 mt-0.5">Click to open link</div>
                                            </div>
                                        </div>
                                    </a>
                                )}

                                {(post.type === 'IMAGE' || post.type === 'VIDEO') && post.media_urls && post.media_urls.length > 0 && (
                                    <div className="mb-6 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 flex items-center justify-center max-h-[600px] border border-slate-200 dark:border-zinc-800">
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
                                
                                <div className="flex items-center flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
                                    <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-zinc-400">
                                        <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                                        <span className="text-[12px] sm:text-[13px] font-bold">{post.comments_count} Comments</span>
                                    </div>
                                    <div 
                                        onClick={() => setShowShareModal(true)}
                                        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-zinc-400"
                                    >
                                        <Share size={18} className="sm:w-5 sm:h-5" />
                                        <span className="text-[12px] sm:text-[13px] font-bold">Share</span>
                                    </div>
                                    <div 
                                        onClick={() => router.post(`/posts/${post.id}/save`, {}, { preserveScroll: true })}
                                        className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors cursor-pointer ${post.is_saved ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
                                    >
                                        <Bookmark size={18} className={`sm:w-5 sm:h-5 ${post.is_saved ? "fill-current" : ""}`} />
                                        <span className="text-[12px] sm:text-[13px] font-bold">{post.is_saved ? 'Saved' : 'Save'}</span>
                                    </div>
                                    <PostDropdown post={post} auth={auth} openReportModal={openReportModal} />
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="px-4 sm:px-10 pb-10 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800">
                            {auth?.user ? (
                                <div className="mb-8 pt-8">
                                    <div className="text-[13px] mb-2 font-medium text-slate-700 dark:text-zinc-300">
                                        Comment as <span className="text-blue-600 dark:text-blue-400">{auth.user.username || auth.user.name}</span>
                                    </div>
                                    <form onSubmit={submitComment}>
                                        <textarea
                                            value={data.content}
                                            onChange={e => setData('content', e.target.value)}
                                            placeholder="What are your thoughts?"
                                            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 px-5 text-[15px] text-slate-900 dark:text-white outline-none transition-all min-h-[140px] hover:border-blue-400"
                                        ></textarea>
                                        <div className="flex justify-end mt-3">
                                            <button 
                                                type="submit" 
                                                disabled={processing || !data.content}
                                                className="px-8 py-2.5 font-bold text-[14px] bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 border-0 outline-none focus:outline-none focus:ring-0 shadow-lg shadow-rose-600/20"
                                            >
                                                Comment
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center justify-between border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl p-6 mt-8 mb-8 shadow-sm gap-4">
                                    <h2 className="text-slate-900 dark:text-white font-bold text-lg text-center sm:text-left">Log in or sign up to leave a comment</h2>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <Link href="/login" className="flex-1 sm:flex-none text-center px-6 py-2 font-bold text-[14px] text-slate-700 dark:text-white bg-slate-100 dark:bg-zinc-800 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">Log In</Link>
                                        <Link href="/register" className="flex-1 sm:flex-none text-center px-6 py-2 font-bold text-[14px] text-white bg-rose-600 rounded-full hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20">Sign Up</Link>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider">Discussions</h3>
                                {comments.length > 0 ? (
                                    comments.map(comment => (
                                        <CommentThread key={comment.id} comment={comment} postId={post.id} auth={auth} userCommentVotes={userCommentVotes} />
                                    ))
                                ) : (
                                    <div className="text-center py-16">
                                        <MessageSquare size={48} className="mx-auto text-slate-300 dark:text-zinc-700 mb-4" />
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Comments Yet</h3>
                                        <p className="text-slate-500 dark:text-zinc-400">Be the first to share what you think!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="hidden lg:block w-[320px] flex-shrink-0">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5 sticky top-28">
                        <div className="flex items-center gap-3 mb-4">
                            {community.icon_image ? (
                                <img src={community.icon_image} width="40" height="40" className="w-10 h-10 rounded-full shadow-sm" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">r/</span>
                                </div>
                            )}
                            <div>
                                <h2 className="font-bold text-[16px] text-slate-900 dark:text-white leading-tight">r/{community.display_name}</h2>
                                <span className="text-xs text-slate-500 dark:text-zinc-400">Community</span>
                            </div>
                        </div>
                        
                        {community.description && (
                            <p className="text-[14px] text-slate-700 dark:text-zinc-300 mb-6 leading-relaxed">{community.description}</p>
                        )}
                        
                        <div className="flex items-center gap-6 text-[14px] font-medium border-t border-slate-200 dark:border-zinc-800 pt-4 mb-6">
                            <div>
                                <div className="text-lg font-black text-slate-900 dark:text-white">1</div>
                                <div className="text-slate-500 dark:text-zinc-400 text-[12px] uppercase tracking-wider font-bold">Members</div>
                            </div>
                            <div>
                                <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                                    1
                                </div>
                                <div className="text-slate-500 dark:text-zinc-400 text-[12px] uppercase tracking-wider font-bold">Online</div>
                            </div>
                        </div>
                        
                        <Link href="/submit" className="flex items-center justify-center w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-full text-[15px] transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-rose-600/20 border-0 outline-none focus:outline-none focus:ring-0">
                            Create Post
                        </Link>
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
