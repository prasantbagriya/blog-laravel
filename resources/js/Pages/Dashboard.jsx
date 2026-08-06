import React from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Camera, Save, Settings, User as UserIcon, Link as LinkIcon, ImageIcon, CheckCircle, LogOut } from 'lucide-react';

export default function Dashboard({ auth }) {
    const { user } = auth;
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        email: user.email || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
            <Head title="Profile Settings" />

            {/* Clean Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200/60 shadow-sm backdrop-blur-md bg-white/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/feed" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center shadow-md shadow-indigo-500/20">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-slate-900 hidden sm:block">
                            Nexus
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/50 hover:bg-slate-100 border border-slate-200 font-semibold text-sm text-slate-700 transition-all">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center">
                                {user.profile_picture ? (
                                    <img src={user.profile_picture} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-indigo-600 font-bold uppercase">{user.name ? user.name.charAt(0) : 'U'}</span>
                                )}
                            </div>
                            {user.name}
                        </Link>
                    </div>
                </div>
            </header>

            <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your profile, preferences, and account security.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Settings Sidebar */}
                    <div className="w-full md:w-64 space-y-1.5">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50/50 border border-indigo-100 font-bold text-indigo-700 transition-colors">
                            <UserIcon size={18} strokeWidth={2.5} />
                            Profile
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-white hover:shadow-sm border border-transparent font-medium transition-all">
                            <Settings size={18} />
                            Account
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-white hover:shadow-sm border border-transparent font-medium transition-all">
                            <LinkIcon size={18} />
                            Social Links
                        </a>
                    </div>

                    {/* Settings Form */}
                    <div className="flex-1 space-y-8">
                        
                        {/* Avatar & Banner Preview */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                            <div className="h-32 bg-gradient-to-tr from-indigo-500 to-purple-500 relative group flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center">
                                    <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" size={32} />
                                </div>
                            </div>
                            <div className="px-8 pb-8 relative">
                                <div className="w-28 h-28 rounded-full border-4 border-white bg-slate-100 shadow-md absolute -top-14 flex items-center justify-center group cursor-pointer overflow-hidden z-10 transition-transform hover:scale-105">
                                    {user.profile_picture ? (
                                        <img src={user.profile_picture} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl text-slate-300 font-black group-hover:hidden uppercase">{user.name ? user.name.charAt(0) : 'U'}</span>
                                    )}
                                    <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all">
                                        <Camera className="text-white drop-shadow-md" size={28} />
                                    </div>
                                </div>
                                <div className="pt-20">
                                    <h2 className="font-bold text-xl text-slate-900">Profile Appearance</h2>
                                    <p className="text-sm text-slate-500 mt-1">Customize how your profile looks to the rest of the Nexus network.</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info Form */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-8">
                                <h2 className="font-bold text-xl text-slate-900 mb-6">Personal Information</h2>
                                <form onSubmit={submit} className="space-y-6">
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                                placeholder="e.g. John Doe"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Username (u/name)</label>
                                            <input
                                                type="text"
                                                value={data.username}
                                                onChange={(e) => setData('username', e.target.value)}
                                                className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                                placeholder="e.g. johndoe123"
                                            />
                                            {errors.username && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.username}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">About (Bio)</label>
                                        <textarea
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            rows="4"
                                            className="w-full bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                                            placeholder="A brief description of yourself..."
                                        ></textarea>
                                        {errors.bio && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.bio}</p>}
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                                        {recentlySuccessful && (
                                            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                                                <CheckCircle size={16} /> Saved
                                            </p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-2.5 px-8 rounded-full text-[14px] shadow-sm shadow-indigo-500/30 transition-all disabled:opacity-50 hover:shadow-md hover:shadow-indigo-500/40"
                                        >
                                            <Save size={16} />
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        {/* Danger Zone */}
                        <div className="bg-white border border-red-200/60 rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-8">
                                <h2 className="font-bold text-xl text-slate-900 mb-2">Account Actions</h2>
                                <p className="text-sm text-slate-500 mb-6">Manage your session or permanently delete your account.</p>
                                <Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-[14px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors -ml-4">
                                    <LogOut size={18} />
                                    Log Out of Nexus
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
