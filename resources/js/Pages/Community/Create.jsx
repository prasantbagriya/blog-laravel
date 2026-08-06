import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Users, Info } from 'lucide-react';

export default function CreateCommunity() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        display_name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('community.store'));
    };

    return (
        <div className="min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20">
            <Head title="Create a Community" />
            
            <header className="sticky top-0 z-50 bg-white border-b border-[#EDEFF1]">
                <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href="/feed" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight hidden sm:block">
                            Nexus
                        </span>
                    </Link>
                </div>
            </header>

            <div className="w-full mx-auto pt-10 px-4">
                <div className="flex items-center gap-3 mb-6 border-b border-[#EDEFF1] pb-4">
                    <Users size={32} className="text-[#0079D3]" />
                    <h1 className="text-2xl font-bold">Create a Community</h1>
                </div>

                <div className="bg-white rounded-md border border-[#EDEFF1] p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div>
                            <label className="block font-bold text-[16px] text-[#1C1C1C] mb-1">Name</label>
                            <p className="text-[12px] text-[#787C7E] mb-2">Community names including capitalization cannot be changed.</p>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-[#787C7E] font-medium">r/</span>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    maxLength={21}
                                    className="w-full bg-white border border-[#EDEFF1] focus:border-[#1C1C1C] rounded-md py-2.5 pl-7 pr-3 text-[14px] outline-none transition-colors"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            <p className="text-[12px] text-[#787C7E] mt-1">{21 - data.name.length} Characters remaining</p>
                        </div>

                        <div>
                            <label className="block font-bold text-[16px] text-[#1C1C1C] mb-1">Display Name (Optional)</label>
                            <input
                                type="text"
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className="w-full bg-white border border-[#EDEFF1] focus:border-[#1C1C1C] rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors"
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
                                className="w-full bg-white border border-[#EDEFF1] focus:border-[#1C1C1C] rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors resize-none"
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="pt-4 border-t border-[#EDEFF1] flex justify-end gap-3">
                            <Link href="/feed" className="px-5 py-2 font-bold text-[14px] text-[#0079D3] hover:bg-[#F6F7F8] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0"
                            >
                                Create Community
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
