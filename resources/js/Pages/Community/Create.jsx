import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Users, Info } from 'lucide-react';
import GlobalNavbar from '@/NextComponents/GlobalNavbar';

export default function CreateCommunity({ auth }) {
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
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans transition-colors selection:bg-blue-500/30 pb-20">
            <Head title="Create a Community" />
            
            <GlobalNavbar auth={auth} />

            <div className="max-w-3xl mx-auto pt-32 px-4 sm:px-6">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-200 dark:border-zinc-800 pb-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-sm">
                        <Users size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Create a Community</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-1">Start a new place for discussion and sharing.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 shadow-sm">
                    <form onSubmit={submit} className="space-y-8">
                        
                        <div>
                            <label className="block font-extrabold text-lg text-slate-900 dark:text-white mb-1">Name</label>
                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-3">Community names including capitalization cannot be changed once created.</p>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400 dark:text-zinc-500 font-extrabold text-lg">r/</span>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    maxLength={21}
                                    className="w-full bg-slate-100 dark:bg-zinc-800/80 border-0 shadow-inner hover:bg-slate-200/60 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500/50 rounded-xl py-3.5 pl-10 pr-4 text-base font-bold text-slate-900 dark:text-white outline-none transition-all placeholder-slate-400"
                                    placeholder="e.g. jee-preparation"
                                />
                            </div>
                            {errors.name && <p className="text-rose-500 text-sm font-bold mt-2">{errors.name}</p>}
                            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 mt-2">{21 - data.name.length} Characters remaining</p>
                        </div>

                        <div>
                            <label className="block font-extrabold text-lg text-slate-900 dark:text-white mb-1">Display Name <span className="text-slate-400 font-medium text-sm">(Optional)</span></label>
                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-3">This is the title that shows up on the community banner.</p>
                            <input
                                type="text"
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className="w-full bg-slate-100 dark:bg-zinc-800/80 border-0 shadow-inner hover:bg-slate-200/60 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500/50 rounded-xl py-3.5 px-4 text-base font-bold text-slate-900 dark:text-white outline-none transition-all placeholder-slate-400"
                                placeholder="e.g. JEE Main & Advanced Discussion"
                            />
                            {errors.display_name && <p className="text-rose-500 text-sm font-bold mt-2">{errors.display_name}</p>}
                        </div>

                        <div>
                            <label className="block font-extrabold text-lg text-slate-900 dark:text-white mb-1">Description</label>
                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-3">This is how new members come to understand your community.</p>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows="4"
                                className="w-full bg-slate-100 dark:bg-zinc-800/80 border-0 shadow-inner hover:bg-slate-200/60 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500/50 rounded-xl py-3.5 px-4 text-base font-medium text-slate-900 dark:text-white outline-none transition-all resize-y placeholder-slate-400"
                                placeholder="Welcome to our community..."
                            ></textarea>
                            {errors.description && <p className="text-rose-500 text-sm font-bold mt-2">{errors.description}</p>}
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-4">
                            <Link href="/feed" className="px-6 py-3 font-bold text-sm text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-all border border-slate-200 dark:border-zinc-700 shadow-sm active:scale-[0.98]">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 active:scale-[0.98] shadow-md shadow-blue-600/20"
                            >
                                {processing ? 'Creating...' : 'Create Community'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
