import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { PencilLine, Image as ImageIcon, Link as LinkIcon, ListOrdered } from 'lucide-react';

import TipTapEditor from '@/Components/TipTapEditor';

export default function CreatePost({ communities, default_community_id, editPost }) {
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
        <div className="min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20">
            <Head title={isEdit ? "Edit Post" : "Create a Post"} />
            
            <header className="sticky top-0 z-50 bg-white border-b border-[#EDEFF1]">
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

            <div className="w-full mx-auto pt-8 px-4 flex gap-6">
                
                <div className="flex-1">
                    <h1 className="text-[18px] font-bold text-[#1C1C1C] border-b border-[#EDEFF1] pb-3 mb-5">
                        {isEdit ? "Edit post" : "Create a post"}
                    </h1>

                    <div className="mb-5 relative w-72">
                        <select 
                            value={data.community_id}
                            onChange={(e) => setData('community_id', e.target.value)}
                            className="w-full bg-white border border-black hover:border-[#1C1C1C] focus:border-[#1C1C1C] rounded-md py-2 px-3 text-[14px] font-medium outline-none appearance-none transition-colors cursor-pointer"
                        >
                            <option value="" disabled>Choose a community</option>
                            {communities.map((c) => (
                                <option key={c.id} value={c.id}>r/{c.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#878A8C]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                        {errors.community_id && <p className="text-red-500 text-xs mt-1">{errors.community_id}</p>}
                    </div>

                    <div className="bg-white rounded-md border border-[#EDEFF1] overflow-hidden">
                        
                        {/* Post Type Tabs */}
                        <div className="flex border-b border-[#EDEFF1]">
                            <button 
                                type="button" 
                                onClick={() => setData('type', 'TEXT')}
                                className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-[14px] font-bold border-b-2 transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${data.type === 'TEXT' ? 'border-[#0079D3] text-[#0079D3]' : 'text-[#878A8C] hover:bg-[#F6F7F8] border-transparent'}`}
                            >
                                <PencilLine size={18} /> Post
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setData('type', 'MEDIA')}
                                className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-[14px] font-bold border-b-2 transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${data.type === 'MEDIA' ? 'border-[#0079D3] text-[#0079D3]' : 'text-[#878A8C] hover:bg-[#F6F7F8] border-transparent'}`}
                            >
                                <ImageIcon size={18} /> Images & Video
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setData('type', 'LINK')}
                                className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-[14px] font-bold border-b-2 transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${data.type === 'LINK' ? 'border-[#0079D3] text-[#0079D3]' : 'text-[#878A8C] hover:bg-[#F6F7F8] border-transparent'}`}
                            >
                                <LinkIcon size={18} /> Link
                            </button>
                        </div>

                        {/* Editor Form */}
                        <div className="p-4">
                            <form onSubmit={submit}>
                                
                                <div className="mb-3 relative">
                                    <input 
                                        type="text" 
                                        placeholder="Title" 
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        maxLength={300}
                                        className="w-full bg-white border border-black focus:ring-1 focus:ring-black rounded-md py-2 px-3 text-[14px] font-medium outline-none transition-colors"
                                    />
                                    <div className="absolute right-3 top-2.5 text-[12px] text-[#878A8C] font-medium">
                                        {data.title.length}/300
                                    </div>
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                {data.type === 'TEXT' && (
                                    <div className="mb-4">
                                        <TipTapEditor 
                                            value={data.content}
                                            onChange={(html) => setData('content', html)}
                                        />
                                        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                                    </div>
                                )}

                                {data.type === 'MEDIA' && (
                                    <div className="mb-4">
                                        <div className="border-2 border-dashed border-[#EDEFF1] rounded-md p-10 flex flex-col items-center justify-center gap-4">
                                            <input 
                                                type="file" 
                                                id="media_file"
                                                accept="image/*,video/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            {data.media_file ? (
                                                <div className="text-center">
                                                    <p className="font-bold text-[#1C1C1C] mb-2">{data.media_file.name}</p>
                                                    <label htmlFor="media_file" className="text-[#0079D3] font-bold cursor-pointer hover:underline text-[14px]">Change File</label>
                                                </div>
                                            ) : (
                                                <label htmlFor="media_file" className="px-6 py-2 border border-[#0079D3] text-[#0079D3] font-bold rounded-full hover:bg-blue-50 cursor-pointer transition-colors">
                                                    Upload Image or Video
                                                </label>
                                            )}
                                        </div>
                                        {errors.media_file && <p className="text-red-500 text-xs mt-1">{errors.media_file}</p>}
                                    </div>
                                )}

                                {data.type === 'LINK' && (
                                    <div className="mb-4">
                                        <textarea 
                                            placeholder="Url" 
                                            value={data.link_url}
                                            onChange={(e) => setData('link_url', e.target.value)}
                                            rows="3"
                                            className="w-full bg-white border border-black focus:ring-1 focus:ring-black rounded-md py-2 px-3 text-[14px] outline-none transition-colors resize-y"
                                        ></textarea>
                                        {errors.link_url && <p className="text-red-500 text-xs mt-1">{errors.link_url}</p>}
                                    </div>
                                )}

                                <div className="flex justify-end border-t border-[#EDEFF1] pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-6 py-2 bg-[#0079D3] hover:bg-[#005a9e] text-white font-bold rounded-full transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : (isEdit ? 'Update Post' : 'Post')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block w-[312px]">
                    <div className="bg-white rounded-md border border-[#EDEFF1] p-3 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <img src="https://www.redditstatic.com/desktop2x/img/snoo-home@2x.png" className="w-10 h-10 object-contain" />
                            <h2 className="font-medium text-[16px]">Posting to coachinginsikar</h2>
                        </div>
                        <ol className="text-[14px] text-[#1C1C1C] font-medium space-y-2 border-t border-[#EDEFF1] pt-3">
                            <li className="border-b border-[#EDEFF1] pb-2">1. Remember the human</li>
                            <li className="border-b border-[#EDEFF1] pb-2">2. Behave like you would in real life</li>
                            <li className="border-b border-[#EDEFF1] pb-2">3. Look for the original source of content</li>
                            <li className="border-b border-[#EDEFF1] pb-2">4. Search for duplicates before posting</li>
                            <li>5. Read the community's rules</li>
                        </ol>
                    </div>
                </div>

            </div>
        </div>
    );
}
