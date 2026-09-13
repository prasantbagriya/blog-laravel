import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Compass, User as UserIcon } from 'lucide-react';

export default function SearchIndex({ auth, posts, communities, users, query }) {
    const [activeTab, setActiveTab] = useState('posts');

    return (
        <div className="min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20">
            <Head title={`Search Results for "${query}" - coachingsinsikar`}>
            </Head>
            
            <Navbar auth={auth} searchQuery={query} />

            <div className="max-w-[1000px] mx-auto mt-6 px-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Search results for "{query}"</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-[#EDEFF1]">
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`px-4 py-3 font-bold text-[14px] ${activeTab === 'posts' ? 'border-b-2 border-[#1C1C1C] text-[#1C1C1C]' : 'text-[#878A8C] hover:text-[#1C1C1C]'}`}
                    >
                        Posts
                    </button>
                    <button 
                        onClick={() => setActiveTab('communities')}
                        className={`px-4 py-3 font-bold text-[14px] ${activeTab === 'communities' ? 'border-b-2 border-[#1C1C1C] text-[#1C1C1C]' : 'text-[#878A8C] hover:text-[#1C1C1C]'}`}
                    >
                        Communities
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-3 font-bold text-[14px] ${activeTab === 'users' ? 'border-b-2 border-[#1C1C1C] text-[#1C1C1C]' : 'text-[#878A8C] hover:text-[#1C1C1C]'}`}
                    >
                        People
                    </button>
                </div>

                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                        {activeTab === 'posts' && (
                            <div>
                                {posts.length === 0 ? (
                                    <div className="bg-white p-8 rounded-lg text-center border border-[#EDEFF1]">
                                        <p className="text-[16px] font-medium">No posts found</p>
                                        <p className="text-[14px] text-[#878A8C] mt-2">Try checking your spelling or using less specific keywords.</p>
                                    </div>
                                ) : (
                                    posts.map(post => (
                                        <div key={post.id} className="bg-white border border-[#EDEFF1] hover:border-[#878A8C] rounded-md flex cursor-pointer transition-colors mb-3" onClick={() => router.visit(`/r/${post.community.name}/comments/${post.id}`)}>
                                            <div className="w-10 bg-[#F8F9FA] rounded-l-md flex flex-col items-center py-2 gap-1 flex-shrink-0">
                                                <ArrowBigUp size={24} className="text-[#878A8C]" />
                                                <span className="text-[12px] font-bold text-[#1C1C1C]">{post.score}</span>
                                                <ArrowBigDown size={24} className="text-[#878A8C]" />
                                            </div>
                                            <div className="p-2 flex-1">
                                                <div className="flex items-center gap-1 text-[12px] mb-2">
                                                    <Link href={`/r/${post.community.name}`} className="font-bold hover:underline" onClick={e => e.stopPropagation()}>r/{post.community.name}</Link>
                                                    <span className="text-[#878A8C]">•</span>
                                                    <span className="text-[#878A8C]">Posted by</span>
                                                    <Link href={`/u/${post.author.username}`} className="text-[#878A8C] hover:underline" onClick={e => e.stopPropagation()}>u/{post.author.username}</Link>
                                                </div>
                                                <h3 className="text-[16px] font-medium text-[#1C1C1C] mb-2">{post.title}</h3>
                                                <div className="flex items-center gap-1 text-[#878A8C] text-[12px] font-bold">
                                                    <MessageSquare size={16} />
                                                    <span>Comments</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'communities' && (
                            <div className="bg-white rounded-lg border border-[#EDEFF1] overflow-hidden">
                                {communities.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-[16px] font-medium">No communities found</p>
                                    </div>
                                ) : (
                                    communities.map(community => (
                                        <Link key={community.id} href={`/r/${community.name}`} className="flex items-center gap-4 p-4 border-b border-[#EDEFF1] hover:bg-[#F6F7F8] transition-colors last:border-0">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {community.icon_image ? (
                                                    <img loading="lazy" decoding="async" fetchPriority="low" src={community.icon_image} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Compass size={24} className="text-[#0079D3]" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[16px]">r/{community.name}</h3>
                                                <p className="text-[12px] text-[#878A8C] mt-1">{community.description}</p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="bg-white rounded-lg border border-[#EDEFF1] overflow-hidden">
                                {users.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <p className="text-[16px] font-medium">No users found</p>
                                    </div>
                                ) : (
                                    users.map(user => (
                                        <Link key={user.id} href={`/u/${user.username}`} className="flex items-center gap-4 p-4 border-b border-[#EDEFF1] hover:bg-[#F6F7F8] transition-colors last:border-0">
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {user.profile_picture ? (
                                                    <img loading="lazy" decoding="async" fetchPriority="low" src={user.profile_picture} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon size={24} className="text-[#878A8C]" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[16px]">u/{user.username}</h3>
                                                <p className="text-[12px] text-[#878A8C] mt-1">{user.name}</p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
