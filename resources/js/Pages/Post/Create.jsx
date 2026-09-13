import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { PencilLine, Image as ImageIcon, Link as LinkIcon, ListOrdered, CheckCircle2 } from 'lucide-react';

import TipTapEditor from '@/Components/TipTapEditor';
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
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans pb-20 transition-colors">
            <Head title={isEdit ? "Edit Post" : "Create a Post"} />
            
            <GlobalNavbar auth={auth} />

            <div className="w-full max-w-6xl mx-auto pt-8 px-4 flex gap-8">
                
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-zinc-800 pb-4 mb-6">
                        {isEdit ? "Edit post" : "Create a post"}
                    </h1>

                    <div className="mb-6 relative w-72">
                        <select 
                            value={data.community_id}
                            onChange={(e) => setData('community_id', e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-700 dark:text-zinc-200 outline-none appearance-none transition-colors cursor-pointer shadow-sm"
                        >
                            <option value="" disabled>Choose a community</option>
                            {communities.map((c) => (
                                <option key={c.id} value={c.id}>r/{c.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                        {errors.community_id && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.community_id}</p>}
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                        
                        {/* Post Type Tabs */}
                        <div className="flex border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                            <button 
                                type="button" 
                                onClick={() => setData('type', 'TEXT')}
                                className={`flex-1 py-4 flex items-center justify-center gap-2 text-[14px] font-bold border-b-2 transition-all border-0 outline-none focus:outline-none focus:ring-0 ${data.type === 'TEXT' ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border-transparent'}`}
                            >
                                <PencilLine size={18} /> Post
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setData('type', 'MEDIA')}
                                className={`flex-1 py-4 flex items-center justify-center gap-2 text-[14px] font-bold border-b-2 transition-all border-0 outline-none focus:outline-none focus:ring-0 ${data.type === 'MEDIA' ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border-transparent'}`}
                            >
                                <ImageIcon size={18} /> Images & Video
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setData('type', 'LINK')}
                                className={`flex-1 py-4 flex items-center justify-center gap-2 text-[14px] font-bold border-b-2 transition-all border-0 outline-none focus:outline-none focus:ring-0 ${data.type === 'LINK' ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border-transparent'}`}
                            >
                                <LinkIcon size={18} /> Link
                            </button>
                        </div>

                        {/* Editor Form */}
                        <div className="p-6">
                            <form onSubmit={submit}>
                                
                                <div className="mb-5 relative">
                                    <input 
                                        type="text" 
                                        placeholder="Title" 
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        maxLength={300}
                                        className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-[15px] font-medium text-slate-900 dark:text-white outline-none transition-colors placeholder-slate-400"
                                    />
                                    <div className="absolute right-4 top-3.5 text-xs text-slate-400 font-medium">
                                        {data.title.length}/300
                                    </div>
                                    {errors.title && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.title}</p>}
                                </div>

                                {data.type === 'TEXT' && (
                                    <div className="mb-5">
                                        <TipTapEditor 
                                            value={data.content}
                                            onChange={(html) => setData('content', html)}
                                        />
                                        {errors.content && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.content}</p>}
                                    </div>
                                )}

                                {data.type === 'MEDIA' && (
                                    <div className="mb-5">
                                        <div className="border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-colors">
                                            <input 
                                                type="file" 
                                                id="media_file"
                                                accept="image/*,video/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            {data.media_file ? (
                                                <div className="text-center">
                                                    <p className="font-bold text-slate-900 dark:text-white mb-2">{data.media_file.name}</p>
                                                    <label htmlFor="media_file" className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline text-sm">Change File</label>
                                                </div>
                                            ) : (
                                                <label htmlFor="media_file" className="px-6 py-2.5 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 font-bold rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors shadow-sm">
                                                    Upload Image or Video
                                                </label>
                                            )}
                                        </div>
                                        {errors.media_file && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.media_file}</p>}
                                    </div>
                                )}

                                {data.type === 'LINK' && (
                                    <div className="mb-5">
                                        <textarea 
                                            placeholder="Url" 
                                            value={data.link_url}
                                            onChange={(e) => setData('link_url', e.target.value)}
                                            rows="3"
                                            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-3 px-4 text-[15px] text-slate-900 dark:text-white outline-none transition-colors resize-y placeholder-slate-400"
                                        ></textarea>
                                        {errors.link_url && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.link_url}</p>}
                                    </div>
                                )}

                                <div className="flex justify-end border-t border-slate-100 dark:border-zinc-800 pt-5 mt-2">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                                    >
                                        {processing ? 'Saving...' : (isEdit ? 'Update Post' : 'Post')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block w-[320px]">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 mb-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-500">
                                <ListOrdered size={20} />
                            </div>
                            <h2 className="font-bold text-slate-900 dark:text-white text-base">Community Rules</h2>
                        </div>
                        <ul className="text-sm text-slate-600 dark:text-zinc-400 font-medium space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                            <li className="flex items-start gap-2 border-b border-slate-50 dark:border-zinc-800/50 pb-3">
                                <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Remember the human</span>
                            </li>
                            <li className="flex items-start gap-2 border-b border-slate-50 dark:border-zinc-800/50 pb-3">
                                <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Behave like you would in real life</span>
                            </li>
                            <li className="flex items-start gap-2 border-b border-slate-50 dark:border-zinc-800/50 pb-3">
                                <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Look for the original source of content</span>
                            </li>
                            <li className="flex items-start gap-2 border-b border-slate-50 dark:border-zinc-800/50 pb-3">
                                <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Search for duplicates before posting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>Read the community's rules</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
