import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Settings, User as UserIcon, Link as LinkIcon, Save, LogOut, CheckCircle, MapPin, Building, ShieldCheck, Home } from 'lucide-react';

export default function Dashboard({ auth, userBusinesses = [] }) {
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
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans flex flex-col md:flex-row transition-colors selection:bg-blue-500/30">
            <Head title="Dashboard | CoachingInSikar" />

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shrink-0 md:min-h-screen flex flex-col shadow-sm relative z-20">
                <div className="h-20 flex items-center px-8 border-b border-slate-200 dark:border-zinc-800">
                    <Link href="/" className="flex items-center space-x-2 group shrink-0 decoration-transparent">
                        <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                            <img src="/uploads/logo.webp" alt="Coaching Sikar Logo" className="w-full h-full object-cover dark:invert-0 invert" />
                        </div>
                        <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tighter">Coaching Sikar</span>
                    </Link>
                </div>
                
                <div className="p-6 flex-1 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 px-2">Manage Account</div>
                    
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-blue-500/20 shadow-sm">
                        <UserIcon size={18} strokeWidth={2.5} /> Profile Settings
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all">
                        <Building size={18} /> My Listings
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all">
                        <LinkIcon size={18} /> Social Links
                    </a>
                    
                    <div className="pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800">
                        <div className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 px-2">Navigation</div>
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all">
                            <Home size={18} /> Back to Home
                        </Link>
                    </div>
                </div>
                
                <div className="p-6 border-t border-slate-200 dark:border-zinc-800 hidden md:block">
                    <Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl font-bold transition-all w-full text-left">
                        <LogOut size={18} /> Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
                    <h1 className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                    <div className="flex items-center gap-4">
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
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-6 md:p-10 max-w-7xl overflow-y-auto">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* Left Column: Form */}
                        <div className="xl:col-span-2 space-y-8">
                            
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <UserIcon size={24} />
                                    </div>
                                    <div>
                                        <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">Personal Information</h2>
                                        <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-0.5">Update your account details and public profile.</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={submit} className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Display Name</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="block w-full px-5 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800"
                                            />
                                            {errors.name && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Username</label>
                                            <input
                                                type="text"
                                                value={data.username}
                                                onChange={(e) => setData('username', e.target.value)}
                                                className="block w-full px-5 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800"
                                            />
                                            {errors.username && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.username}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="block w-full px-5 py-3.5 bg-slate-200 dark:bg-zinc-800 border border-transparent rounded-full text-sm font-medium text-slate-500 dark:text-zinc-500 cursor-not-allowed"
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
                                            className="block w-full px-5 py-4 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-3xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 resize-y"
                                            placeholder="Tell us a bit about yourself..."
                                        ></textarea>
                                        {errors.bio && <p className="text-rose-500 text-xs font-semibold mt-1.5">{errors.bio}</p>}
                                    </div>

                                    <div className="pt-6 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800">
                                        {recentlySuccessful ? (
                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                                                <CheckCircle size={16} /> Saved Successfully
                                            </span>
                                        ) : <span></span>}
                                        
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded-full font-extrabold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-amber-500/20"
                                        >
                                            <Save size={18} /> {processing ? 'Saving...' : 'Save Profile'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Listings */}
                        <div className="xl:col-span-1 space-y-8">
                            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                                    <h2 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                        <Building size={18} className="text-amber-500" />
                                        Your Listings
                                    </h2>
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800/50 shadow-sm">
                                        {userBusinesses?.length || 0}
                                    </span>
                                </div>
                                
                                <div className="p-0">
                                    {userBusinesses && userBusinesses.length > 0 ? (
                                        <ul className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                                            {userBusinesses.map((business) => (
                                                <li key={business.id} className="p-6 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-start gap-4">
                                                            {business.logo ? (
                                                                <img src={business.logo} alt={business.name} className="w-12 h-12 rounded-xl border border-slate-200 dark:border-zinc-700 object-cover shrink-0 shadow-sm" />
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm">
                                                                    {business.name.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-base font-bold text-slate-900 dark:text-white truncate">{business.name}</p>
                                                                <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 truncate flex items-center gap-1 mt-1">
                                                                    <MapPin size={12} /> {business.category_name || business.category}
                                                                </p>
                                                                
                                                                <div className="mt-2.5 flex items-center gap-2">
                                                                    {business.is_verified == 1 ? (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                                                            <ShieldCheck size={12} className="mr-1" /> Verified
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                                            Pending
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="pt-2">
                                                            <a 
                                                                href={`/reviews/${business.category || (business.category_name ? business.category_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : 'uncategorized')}/${business.slug}`}
                                                                className="w-full flex justify-center items-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 transition-all active:scale-[0.98] shadow-sm"
                                                            >
                                                                Edit & Manage
                                                            </a>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-10 flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                                <Building className="w-8 h-8 text-slate-400 dark:text-zinc-500" />
                                            </div>
                                            <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">No businesses yet</p>
                                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">You haven't listed any institutes.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
