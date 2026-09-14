import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Compass, User as UserIcon, Search, LayoutGrid, Users } from 'lucide-react';
import { PageHero } from '../../NextComponents/UI';
import AnimatedBorderCard from '../../Components/AnimatedBorderCard';

export default function SearchIndex({ auth, posts, blogs, businesses, communities, users, query }) {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialTab = urlParams ? urlParams.get('tab') : null;
    const [activeTab, setActiveTab] = useState(initialTab || 'businesses');
    const [searchQuery, setSearchQuery] = useState(query || '');
    const basePath = typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '';

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.visit(`${basePath}/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-[#09090b] min-h-screen flex flex-col font-sans">
            <Head title={`Search Results for "${query}"`} />
            
            <GlobalNavbar auth={auth} searchQuery={query} />

            {/* Header */}
            <PageHero
                badge="Search Results"
                badgeIcon={Search}
                title={<>Results for "<span className="text-amber-500">{query}</span>"</>}
                description="Find discussions, communities, institutes, and blogs."
                className="!pt-32 !pb-8"
            />

            <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
                    <AnimatedBorderCard containerClassName="rounded-full" className="rounded-full">
                        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-2 py-2 group">
                            <Search className="w-5 h-5 text-slate-500 dark:text-zinc-400 ml-3 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                name="q" 
                                className="flex-1 border-0 outline-none focus:ring-0 text-slate-900 dark:text-white text-sm py-2.5 bg-transparent placeholder-slate-500 dark:placeholder-zinc-400" 
                                placeholder="Search for coaching, courses, blog posts or communities..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none">
                                Search
                            </button>
                        </div>
                    </AnimatedBorderCard>
                </form>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {/* Institutes - Amber */}
                    <button 
                        onClick={() => setActiveTab('businesses')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                            activeTab === 'businesses' 
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25' 
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20'
                        }`}
                    >
                        <Compass size={15} /> Institutes
                    </button>
                    {/* Blogs - Purple */}
                    <button 
                        onClick={() => setActiveTab('blogs')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                            activeTab === 'blogs' 
                            ? 'bg-violet-500 text-white shadow-md shadow-violet-500/25' 
                            : 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20'
                        }`}
                    >
                        <MessageSquare size={15} /> Blogs
                    </button>
                    {/* Community Posts - Blue */}
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                            activeTab === 'posts' 
                            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25' 
                            : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20'
                        }`}
                    >
                        <MessageSquare size={15} /> Community Posts
                    </button>
                    {/* Communities - Emerald */}
                    <button 
                        onClick={() => setActiveTab('communities')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                            activeTab === 'communities' 
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25' 
                            : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                        }`}
                    >
                        <LayoutGrid size={15} /> Communities
                    </button>
                    {/* People - Pink */}
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                            activeTab === 'users' 
                            ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25' 
                            : 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-500/20'
                        }`}
                    >
                        <Users size={15} /> People
                    </button>
                </div>

                <div className="space-y-4">
                    {activeTab === 'businesses' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(!businesses || businesses.length === 0) ? (
                                <div className="col-span-full bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                        <Compass className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No institutes found</p>
                                </div>
                            ) : (
                                businesses.map(biz => (
                                    <Link key={biz.id} href={basePath + `/reviews/${biz.category || 'coaching-institutes'}/${biz.slug}`} className="group flex flex-col gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all">
                                        <div className="w-full h-32 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-[1.02] transition-transform">
                                            {biz.logo ? (
                                                <img loading="lazy" decoding="async" fetchPriority="low" src={biz.logo} className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <Compass size={40} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1">{biz.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{biz.description || biz.category || 'Coaching Institute'}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'blogs' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(!blogs || blogs.length === 0) ? (
                                <div className="col-span-full bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                        <MessageSquare className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No blog posts found</p>
                                </div>
                            ) : (
                                blogs.map(blog => (
                                    <Link key={blog.id} href={basePath + `/blog/${blog.slug}`} className="group flex flex-col sm:flex-row gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all">
                                        <div className="w-full sm:w-32 h-40 sm:h-auto rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-[1.02] transition-transform">
                                            {blog.coverImage || blog.cover_image ? (
                                                <img loading="lazy" decoding="async" fetchPriority="low" src={blog.coverImage || blog.cover_image} className="w-full h-full object-cover" />
                                            ) : (
                                                <MessageSquare size={32} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2">{blog.title}</h3>
                                            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                                                {blog.category || 'Article'}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'posts' && (
                        <div>
                            {(!posts || posts.length === 0) ? (
                                <div className="bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No posts found</p>
                                    <p className="text-slate-500 dark:text-zinc-400 text-sm">Try checking your spelling or using less specific keywords.</p>
                                </div>
                            ) : (
                                posts.map(post => (
                                    <div 
                                        key={post.id} 
                                        className="group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md rounded-2xl flex cursor-pointer transition-all duration-200 mb-4 overflow-hidden" 
                                        onClick={() => router.visit(basePath + `/r/${post.community.name}/comments/${post.id}`)}
                                    >
                                        <div className="w-12 bg-slate-50 dark:bg-zinc-950/50 flex flex-col items-center py-4 gap-1 border-r border-slate-100 dark:border-zinc-800/50">
                                            <ArrowBigUp size={24} className="text-slate-400 dark:text-zinc-500 group-hover:text-amber-500 transition-colors" />
                                            <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{post.score}</span>
                                            <ArrowBigDown size={24} className="text-slate-400 dark:text-zinc-500" />
                                        </div>
                                        <div className="p-4 sm:p-5 flex-1">
                                            <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                                                <Link href={basePath + `/r/${post.community?.name}`} className="font-bold text-slate-900 dark:text-white hover:text-amber-500 transition-colors" onClick={e => e.stopPropagation()}>r/{post.community?.name}</Link>
                                                <span className="text-slate-300 dark:text-zinc-600">•</span>
                                                <span className="text-slate-500 dark:text-zinc-400">Posted by</span>
                                                <Link href={basePath + `/u/${post.author?.username}`} className="text-slate-600 dark:text-zinc-300 hover:text-amber-500 transition-colors" onClick={e => e.stopPropagation()}>u/{post.author?.username}</Link>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 group-hover:text-amber-500 transition-colors leading-snug">{post.title}</h3>
                                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 text-xs font-bold bg-slate-100 dark:bg-zinc-800/50 w-fit px-3 py-1.5 rounded-full">
                                                <MessageSquare size={14} />
                                                <span>{post.comments_count || 'Comments'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'communities' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(!communities || communities.length === 0) ? (
                                <div className="col-span-full bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                        <Compass className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No communities found</p>
                                </div>
                            ) : (
                                communities.map(community => (
                                    <Link key={community.id} href={basePath + `/r/${community.name}`} className="group flex items-start gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all">
                                        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                                            {community.icon_image ? (
                                                <img loading="lazy" decoding="async" fetchPriority="low" src={community.icon_image} className="w-full h-full object-cover" />
                                            ) : (
                                                <Compass size={28} className="text-blue-500 dark:text-blue-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">r/{community.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{community.description || 'A community to discuss things related to ' + community.name}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {(!users || users.length === 0) ? (
                                <div className="col-span-full bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                        <UserIcon className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No users found</p>
                                </div>
                            ) : (
                                users.map(user => (
                                    <Link key={user.id} href={basePath + `/u/${user.username}`} className="group flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                                            {user.profile_picture ? (
                                                <img loading="lazy" decoding="async" fetchPriority="low" src={user.profile_picture} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon size={24} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">u/{user.username}</h3>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{user.name || 'Reddit User'}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>

            <BlogFooter />
        </div>
    );
}
