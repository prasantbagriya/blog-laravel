import React, { useState, Suspense } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { PencilLine, Image as ImageIcon, Link as LinkIcon, ListOrdered, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

const TipTapEditor = React.lazy(() => import('@/Components/TipTapEditor'));
import GlobalNavbar from '@/NextComponents/GlobalNavbar';

export default function CreatePost({ auth, communities, default_community_id, editPost }) {
    const { data, setData, post, put, processing, errors } = useForm({
        community_id: editPost?.community_id || default_community_id || '',
        title: editPost?.title || '',
        content: editPost?.content || '',
        type: editPost?.type || 'TEXT',
        media_file: null,
        link_url: editPost?.link_url || '',
    });

    const isEdit = !!editPost;

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('post.update', editPost.id));
        } else {
            post(route('post.store'));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setData('media_file', e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans pb-20 transition-colors relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-400/10 dark:bg-amber-600/10 blur-[120px]"></div>
            </div>

            <Head title={isEdit ? "Edit Post" : "Create a Post"} />
            
            <GlobalNavbar auth={auth} />

            <div className="w-full max-w-6xl mx-auto pt-32 px-4 flex flex-col lg:flex-row gap-8">
                
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Sparkles size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {isEdit ? "Edit your post" : "Create a new post"}
                            </h1>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mt-1">Share your thoughts, questions, or resources with the community.</p>
                        </div>
                    </div>

                    <div className="mb-6 relative w-full sm:w-80 z-20">
                        <div className="relative">
                            <select 
                                value={data.community_id}
                                onChange={(e) => setData('community_id', e.target.value)}
                                className="w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/40 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-zinc-500 focus:border-blue-500 rounded-2xl py-3.5 pl-4 pr-10 text-base font-bold text-slate-700 dark:text-zinc-200 outline-none appearance-none transition-all shadow-sm cursor-pointer"
                            >
                                <option value="" disabled>Choose a community</option>
                                {communities.map((c) => (
                                    <option key={c.id} value={c.id}>r/{c.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                <ChevronDown size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                        {errors.community_id && <p className="text-rose-500 text-xs mt-2 font-bold pl-2">{errors.community_id}</p>}
                    </div>

                    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-zinc-800/60 shadow-xl overflow-hidden">
                        
                        {/* Post Type Tabs - Floating Pills */}
                        <div className="p-2 sm:p-3 border-b border-slate-100 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/40">
                            <div className="flex p-1 bg-slate-100/50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 max-w-md mx-auto sm:mx-0">
                                <button 
                                    type="button" 
                                    onClick={() => setData('type', 'TEXT')}
                                    className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all border-0 outline-none focus:outline-none focus:ring-0 ${data.type === 'TEXT' ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                                >
                                    <PencilLine size={18} /> <span className="hidden sm:inline">Post</span>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setData('type', 'MEDIA')}
                                    className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all border-0 outline-none focus:outline-none focus:ring-0 ${data.type === 'MEDIA' ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                                >
                                    <ImageIcon size={18} /> <span className="hidden sm:inline">Media</span>
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setData('type', 'LINK')}
                                    className={`flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all border-0 outline-none focus:outline-none focus:ring-0 ${data.type === 'LINK' ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                                >
                                    <LinkIcon size={18} /> <span className="hidden sm:inline">Link</span>
                                </button>
                            </div>
                        </div>

                        {/* Editor Form */}
                        <div className="p-4 sm:p-8">
                            <form onSubmit={submit}>
                                
                                <div className="mb-6 relative group">
                                    <input 
                                        type="text" 
                                        placeholder="An interesting title..." 
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        maxLength={300}
                                        className="w-full bg-transparent border-none focus:border-transparent focus:ring-0 py-2 px-0 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white outline-none transition-colors placeholder-slate-300 dark:placeholder-zinc-600"
                                    />
                                    <div className="absolute right-0 bottom-2 text-xs font-bold text-slate-300 dark:text-zinc-600 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        {data.title.length}/300
                                    </div>
                                </div>
                                {errors.title && <p className="text-rose-500 text-sm font-bold mb-4">{errors.title}</p>}

                                {data.type === 'TEXT' && (
                                    <div className="mb-6">
                                        <div className="bg-white/50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-inner overflow-hidden">
                                            <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-zinc-800 rounded-md m-4" />}>
                                                <TipTapEditor 
                                                    value={data.content}
                                                    onChange={(html) => setData('content', html)}
                                                />
                                            </Suspense>
                                        </div>
                                        {errors.content && <p className="text-rose-500 text-sm font-bold mt-2">{errors.content}</p>}
                                    </div>
                                )}

                                {data.type === 'MEDIA' && (
                                    <div className="mb-6">
                                        <div className="border-2 border-dashed border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-colors">
                                            <input 
                                                type="file" 
                                                id="media_file"
                                                accept="image/*,video/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            {data.media_file ? (
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <CheckCircle2 size={32} />
                                                    </div>
                                                    <p className="font-bold text-lg text-slate-900 dark:text-white mb-2">{data.media_file.name}</p>
                                                    <label htmlFor="media_file" className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline text-sm">Change File</label>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-zinc-700">
                                                        <ImageIcon size={32} className="text-blue-500" strokeWidth={1.5} />
                                                    </div>
                                                    <p className="text-slate-500 dark:text-zinc-400 font-medium mb-4">Drag and drop or click to upload media</p>
                                                    <label htmlFor="media_file" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-block">
                                                        Upload File
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        {errors.media_file && <p className="text-rose-500 text-sm font-bold mt-2">{errors.media_file}</p>}
                                    </div>
                                )}

                                {data.type === 'LINK' && (
                                    <div className="mb-6">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <LinkIcon className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <textarea 
                                                placeholder="https://..." 
                                                value={data.link_url}
                                                onChange={(e) => setData('link_url', e.target.value)}
                                                onBlur={(e) => {
                                                    let val = e.target.value.trim();
                                                    if (val && !/^https?:\/\//i.test(val)) {
                                                        setData('link_url', 'https://' + val);
                                                    }
                                                }}
                                                rows="3"
                                                className="w-full bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl py-4 pl-12 pr-4 text-base font-medium text-slate-900 dark:text-white outline-none transition-all resize-none placeholder-slate-400 shadow-inner"
                                            ></textarea>
                                        </div>
                                        {errors.link_url && <p className="text-rose-500 text-sm font-bold mt-2">{errors.link_url}</p>}
                                    </div>
                                )}

                                <div className="flex justify-end border-t border-slate-100 dark:border-zinc-800/60 pt-6 mt-4">
                                    <Link href="/feed" className="px-8 py-3.5 font-bold text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors mr-2">
                                        Cancel
                                    </Link>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-10 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-full transition-all shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md text-base border-none outline-none focus:outline-none ring-0 focus:ring-0"
                                    >
                                        {processing ? 'Posting...' : (isEdit ? 'Update Post' : 'Publish Post')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar Rules */}
                <div className="hidden lg:block w-[340px]">
                    <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-zinc-800/60 p-6 shadow-xl sticky top-28">
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800/60">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-800/50">
                                <ListOrdered size={24} strokeWidth={2} />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">Community Rules</h2>
                                <p className="text-xs font-medium text-slate-500">Please read before posting</p>
                            </div>
                        </div>
                        <ul className="text-sm text-slate-700 dark:text-zinc-300 font-semibold space-y-4">
                            <li className="flex items-start gap-3 group">
                                <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    1
                                </div>
                                <span className="pt-0.5 leading-snug">Remember the human and be respectful.</span>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    2
                                </div>
                                <span className="pt-0.5 leading-snug">Behave like you would in real life.</span>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                    3
                                </div>
                                <span className="pt-0.5 leading-snug">Look for the original source of content.</span>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="w-6 h-6 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    4
                                </div>
                                <span className="pt-0.5 leading-snug">Search for duplicates before posting.</span>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                    5
                                </div>
                                <span className="pt-0.5 leading-snug">Read the specific community's rules.</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
