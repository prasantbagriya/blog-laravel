import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Settings, Image as ImageIcon } from 'lucide-react';

export default function EditCommunity({ community }) {
    const { data, setData, post, processing, errors } = useForm({
        display_name: community.display_name || '',
        description: community.description || '',
        icon_image: community.icon_image || '',
        banner_image: community.banner_image || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('community.update', community.name));
    };

    return (
        <div className="min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20">
            <Head title={`Settings - ${community.display_name}`} />
            
            <header className="sticky top-0 z-50 bg-white border-b border-[#EDEFF1]">
                <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href={`/community/${community.name}`} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight hidden sm:block">
                            coachinginsikar
                        </span>
                    </Link>
                </div>
            </header>

            <div className="w-full mx-auto max-w-[800px] pt-10 px-4">
                <div className="flex items-center gap-3 mb-6 border-b border-[#EDEFF1] pb-4">
                    <Settings size={32} className="text-[#0079D3]" />
                    <h1 className="text-2xl font-bold">Community Settings</h1>
                </div>

                <div className="bg-white rounded-md border border-[#EDEFF1] p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div>
                            <label className="block font-bold text-[16px] text-[#1C1C1C] mb-1">Display Name</label>
                            <p className="text-[12px] text-[#787C7E] mb-2">This is what is shown in the community header (e.g. "Laravel PHP Framework").</p>
                            <input
                                type="text"
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors"
                            />
                            {errors.display_name && <p className="text-red-500 text-xs mt-1">{errors.display_name}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-[16px] text-[#1C1C1C] mb-1">Description</label>
                            <p className="text-[12px] text-[#787C7E] mb-2">This is how new members come to understand your community.</p>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows="4"
                                className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors resize-none"
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-[16px] text-[#1C1C1C] mb-1">Icon Image URL</label>
                            <p className="text-[12px] text-[#787C7E] mb-2">The profile picture of your community.</p>
                            <div className="flex gap-4 items-center">
                                {data.icon_image ? (
                                    <img src={data.icon_image} className="w-16 h-16 rounded-full object-cover border border-[#EDEFF1]" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-[#F6F7F8] flex items-center justify-center border border-[#EDEFF1] text-[#878A8C]">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={data.icon_image}
                                    onChange={(e) => setData('icon_image', e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 bg-white border border-[#EDEFF1] focus:border-[#1C1C1C] rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors"
                                />
                            </div>
                            {errors.icon_image && <p className="text-red-500 text-xs mt-1">{errors.icon_image}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-[16px] text-[#1C1C1C] mb-1">Banner Image URL</label>
                            <p className="text-[12px] text-[#787C7E] mb-2">The cover image of your community.</p>
                            <div className="space-y-3">
                                {data.banner_image ? (
                                    <img src={data.banner_image} className="w-full h-32 object-cover rounded-md border border-[#EDEFF1]" />
                                ) : (
                                    <div className="w-full h-32 bg-[#F6F7F8] rounded-md flex items-center justify-center border border-[#EDEFF1] text-[#878A8C]">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={data.banner_image}
                                    onChange={(e) => setData('banner_image', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-white border border-[#EDEFF1] focus:border-[#1C1C1C] rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors"
                                />
                            </div>
                            {errors.banner_image && <p className="text-red-500 text-xs mt-1">{errors.banner_image}</p>}
                        </div>

                        <div className="pt-4 border-t border-[#EDEFF1] flex justify-end gap-3">
                            <Link href={`/community/${community.name}`} className="px-5 py-2 font-bold text-[14px] text-[#0079D3] hover:bg-[#F6F7F8] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0"
                            >
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
