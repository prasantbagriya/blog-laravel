import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    User as UserIcon, Save, LogOut, CheckCircle, MapPin,
    Building, ShieldCheck, Home, Users, Menu, X, ChevronRight,
    Star, MessageSquare
} from 'lucide-react';

export default function Dashboard({ auth, userBusinesses = [], userCommunities = [] }) {
    const { user } = auth;
    const [sidebarOpen, setSidebarOpen] = useState(false);
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

    const businessUrl = (business) =>
        `/reviews/${business.category || (business.category_name ? business.category_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : 'uncategorized')}/${business.slug}`;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans transition-colors">
            <Head title="Dashboard | CoachingInSikar" />

            {/* ── MOBILE TOPBAR ── */}
            <header className="md:hidden sticky top-0 z-40 h-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 shadow-sm">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <img src="/uploads/logo.webp" alt="Logo" className="w-full h-full object-cover dark:invert-0 invert" />
                    </div>
                    <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">Dashboard</span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 py-1 px-2 rounded-full">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 overflow-hidden flex items-center justify-center">
                            {user.profile_picture ? (
                                <img src={user.profile_picture} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">{user.name ? user.name.charAt(0) : 'U'}</span>
                            )}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 max-w-[80px] truncate">{user.name}</span>
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                        <Menu size={20} />
                    </button>
                </div>
            </header>

            {/* ── MOBILE SIDEBAR OVERLAY ── */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-zinc-900 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
                        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-zinc-800">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
                                <div className="w-7 h-7 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                    <img src="/uploads/logo.webp" alt="Logo" className="w-full h-full object-cover dark:invert-0 invert" />
                                </div>
                                <span className="font-bold text-base text-slate-900 dark:text-white">Coaching Sikar</span>
                            </Link>
                            <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Account</div>
                            <a href="#profile" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl font-bold border border-blue-100 dark:border-blue-500/20">
                                <div className="flex items-center gap-3"><UserIcon size={17} strokeWidth={2.5} /> Profile Settings</div>
                                <ChevronRight size={14} />
                            </a>
                            <a href="#listings" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl font-medium">
                                <div className="flex items-center gap-3"><Building size={17} /> My Listings</div>
                                <ChevronRight size={14} className="text-slate-300 dark:text-zinc-600" />
                            </a>
                            <a href="#communities" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl font-medium">
                                <div className="flex items-center gap-3"><Users size={17} /> Communities</div>
                                <ChevronRight size={14} className="text-slate-300 dark:text-zinc-600" />
                            </a>

                            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-zinc-800">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Navigation</div>
                                <Link href="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl font-medium">
                                    <Home size={17} /> Back to Home
                                </Link>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                            <Link
                                href={route('logout')} method="post" as="button"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 border border-rose-100 dark:border-rose-500/20 transition-all"
                            >
                                <LogOut size={17} /> Sign Out
                            </Link>
                        </div>
                    </aside>
                </div>
            )}


            <div className="flex min-h-screen">
                {/* ── DESKTOP SIDEBAR ── */}
                <aside className="hidden md:flex w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shrink-0 min-h-screen flex-col shadow-sm sticky top-0 z-20">
                    <div className="h-20 flex items-center px-8 border-b border-slate-200 dark:border-zinc-800">
                        <Link href="/" className="flex items-center space-x-2 group shrink-0">
                            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                                <img src="/uploads/logo.webp" alt="Logo" className="w-full h-full object-cover dark:invert-0 invert" />
                            </div>
                            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tighter">Coaching Sikar</span>
                        </Link>
                    </div>

                    <div className="p-6 flex-1 space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 px-2">Manage Account</div>
                        <a href="#profile" className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-blue-500/20 shadow-sm">
                            <UserIcon size={18} strokeWidth={2.5} /> Profile Settings
                        </a>
                        <a href="#listings" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all">
                            <Building size={18} /> My Listings
                        </a>
                        <a href="#communities" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all">
                            <Users size={18} /> Communities
                        </a>

                        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800">
                            <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 px-2">Navigation</div>
                            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all">
                                <Home size={18} /> Back to Home
                            </Link>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                        <Link
                            href={route('logout')} method="post" as="button"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-100 dark:border-rose-500/20 transition-all active:scale-[0.98]"
                        >
                            <LogOut size={18} /> Sign Out
                        </Link>
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 flex flex-col min-w-0">

                    {/* Desktop Topbar */}
                    <header className="hidden md:flex h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 items-center justify-between px-8 shrink-0 sticky top-0 z-10">
                        <h1 className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-800 py-1.5 px-1.5 pr-4 rounded-full border border-slate-200 dark:border-zinc-700 shadow-sm">
                            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-white dark:border-zinc-700 overflow-hidden flex items-center justify-center shadow-sm">
                                {user.profile_picture ? (
                                    <img src={user.profile_picture} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">{user.name ? user.name.charAt(0) : 'U'}</span>
                                )}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-zinc-200">{user.name}</span>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 w-full">

                        {/* ── PROFILE CARD ── */}
                        <section id="profile" className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden scroll-mt-20">
                            <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                    <UserIcon size={22} />
                                </div>
                                <div>
                                    <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">Personal Information</h2>
                                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400 mt-0.5">Update your account details and public profile.</p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="block w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                        />
                                        {errors.name && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Username</label>
                                        <input
                                            type="text"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            className="block w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                        />
                                        {errors.username && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.username}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        className="block w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-200 dark:bg-zinc-800 border border-transparent rounded-full text-sm font-medium text-slate-500 dark:text-zinc-500 cursor-not-allowed"
                                        disabled
                                    />
                                    <p className="text-xs text-slate-400 font-medium mt-1.5">Email cannot be changed directly.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Bio</label>
                                    <textarea
                                        value={data.bio}
                                        onChange={(e) => setData('bio', e.target.value)}
                                        rows="4"
                                        className="block w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-3xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-y"
                                        placeholder="Tell us a bit about yourself..."
                                    />
                                    {errors.bio && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.bio}</p>}
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-zinc-800">
                                    {recentlySuccessful ? (
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                            <CheckCircle size={16} /> Saved Successfully
                                        </span>
                                    ) : <span />}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded-full font-extrabold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-amber-500/20"
                                    >
                                        <Save size={18} /> {processing ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* ── YOUR LISTINGS ── */}
                        <section id="listings" className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden scroll-mt-20">
                            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <Building size={18} className="text-amber-500 shrink-0" />
                                    <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white truncate">Your Listings</h2>
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/50 shrink-0">
                                        {userBusinesses?.length || 0}
                                    </span>
                                </div>
                                <Link
                                    href={route('businesses.create')}
                                    className="shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-full transition-all shadow-sm whitespace-nowrap active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                                    Add New
                                </Link>
                            </div>

                            {userBusinesses && userBusinesses.length > 0 ? (
                                <ul className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                                    {userBusinesses.map((business) => (
                                        <li key={business.id} className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                {business.logo ? (
                                                    <img src={business.logo} alt={business.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-slate-200 dark:border-zinc-700 object-cover shrink-0 shadow-sm" />
                                                ) : (
                                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-extrabold text-lg flex items-center justify-center shrink-0">
                                                        {business.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{business.name}</p>
                                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                                                        <MapPin size={10} className="shrink-0" />
                                                        <span className="truncate">{business.category_name || business.category}</span>
                                                    </p>
                                                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                                        {business.is_verified == 1 ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                                <ShieldCheck size={9} className="mr-0.5" /> Verified
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                                Pending
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 flex items-center gap-0.5">
                                                            <Star size={9} className="text-amber-400" /> {business.review_count ?? 0} reviews
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                <a
                                                    href={businessUrl(business)}
                                                    className="flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                                                >
                                                    <MessageSquare size={12} /> View Reviews
                                                </a>
                                                <Link
                                                    href={`/businesses/${business.slug || business.id}/edit`}
                                                    className="flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 transition-all active:scale-95 shadow-sm shadow-amber-500/20"
                                                >
                                                    Manage
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                        <Building className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 dark:text-zinc-500" />
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-bold text-base sm:text-lg mb-1">No businesses yet</p>
                                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-5">You haven't listed any institutes.</p>
                                    <Link href={route('businesses.create')} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-extrabold rounded-full transition-all shadow-md active:scale-95">
                                        Add Business Listing
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* ── COMMUNITIES ── */}
                        <section id="communities" className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden scroll-mt-20">
                            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between gap-2 flex-nowrap">
                                <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                                    <Users size={18} className="text-blue-500 shrink-0 hidden sm:block" />
                                    <h2 className="font-extrabold text-sm sm:text-lg text-slate-900 dark:text-white truncate whitespace-nowrap">Your Communities</h2>
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/50 shrink-0">
                                        {userCommunities?.length || 0}
                                    </span>
                                </div>
                                <Link
                                    href={route('community.create')}
                                    className="shrink-0 inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-400 text-white text-[11px] sm:text-xs font-extrabold rounded-full transition-all shadow-sm whitespace-nowrap active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                                    Create New
                                </Link>
                            </div>

                            {userCommunities && userCommunities.length > 0 ? (
                                <ul className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                                    {userCommunities.map((community) => (
                                        <li key={community.id} className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                {community.icon ? (
                                                    <img src={community.icon} alt={community.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-slate-200 dark:border-zinc-700 object-cover shrink-0 shadow-sm" />
                                                ) : (
                                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-extrabold text-base flex items-center justify-center shrink-0 uppercase">
                                                        {community.name.substring(0, 2)}
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">r/{community.name}</p>
                                                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                                                        {community.description || 'Community for discussing ' + community.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <Link
                                                    href={route('community.show', community.name)}
                                                    className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-blue-500 hover:bg-blue-400 transition-all active:scale-95 shadow-sm"
                                                >
                                                    View Community
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                        <Users className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 dark:text-zinc-500" />
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-bold text-base sm:text-lg mb-1">No communities yet</p>
                                    <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-5">You haven't created any communities.</p>
                                    <Link href={route('community.create')} className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-extrabold rounded-full transition-all shadow-md active:scale-95">
                                        Create Community
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* ── SIGN OUT (mobile only) ── */}
                        <section className="md:hidden pb-24">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-rose-100 dark:border-rose-500/20 shadow-sm overflow-hidden">
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                                            <LogOut size={20} className="text-rose-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">Sign Out</p>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400">You will be logged out of your account.</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 transition-all active:scale-[0.98]"
                                    >
                                        <LogOut size={16} /> Sign Out of Account
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </div>
                </main>
            </div>

            {/* ── MOBILE BOTTOM NAV ── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800">
                <div className="flex items-center justify-around px-2 py-2">
                    <a href="#profile" className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10">
                        <UserIcon size={20} strokeWidth={2.5} />
                        <span className="text-[10px] font-extrabold">Profile</span>
                    </a>
                    <a href="#listings" className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-slate-500 dark:text-zinc-400">
                        <Building size={20} />
                        <span className="text-[10px] font-bold">Listings</span>
                    </a>
                    <a href="#communities" className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-slate-500 dark:text-zinc-400">
                        <Users size={20} />
                        <span className="text-[10px] font-bold">Communities</span>
                    </a>
                    <Link href="/" className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-slate-500 dark:text-zinc-400">
                        <Home size={20} />
                        <span className="text-[10px] font-bold">Home</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
