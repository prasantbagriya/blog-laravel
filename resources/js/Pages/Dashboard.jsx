import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Settings, User as UserIcon, Link as LinkIcon, Save, LogOut, CheckCircle, MapPin, Building, ShieldCheck } from 'lucide-react';

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
        <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans flex flex-col md:flex-row">
            <Head title="Dashboard" />

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 shrink-0 md:min-h-screen">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link href="/feed" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                            C
                        </div>
                        <span className="font-bold text-lg text-gray-900">CoachingInSikar</span>
                    </Link>
                </div>
                
                <div className="p-4 space-y-1">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Menu</div>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">
                        <UserIcon size={18} /> Profile Settings
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
                        <Building size={18} /> My Listings
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
                        <LinkIcon size={18} /> Social Links
                    </a>
                </div>
                
                <div className="p-4 mt-auto border-t border-gray-200 hidden md:block">
                    <Link href={route('logout')} method="post" as="button" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md font-medium transition-colors w-full text-left">
                        <LogOut size={18} /> Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                    <h1 className="font-semibold text-xl text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">{user.name}</span>
                            <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center">
                                {user.profile_picture ? (
                                    <img src={user.profile_picture} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <span className="text-gray-500 font-bold">{user.name ? user.name.charAt(0) : 'U'}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-6 md:p-8 max-w-5xl overflow-y-auto">
                    
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column: Form */}
                        <div className="xl:col-span-2 space-y-8">
                            
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                                    <h2 className="font-semibold text-lg text-gray-900">Personal Information</h2>
                                    <p className="text-sm text-gray-500">Update your account details and public profile.</p>
                                </div>
                                
                                <form onSubmit={submit} className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                            <input
                                                type="text"
                                                value={data.username}
                                                onChange={(e) => setData('username', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                                            />
                                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 cursor-not-allowed"
                                            disabled
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                        <textarea
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            rows="4"
                                            className="w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white resize-y"
                                        ></textarea>
                                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                                    </div>

                                    <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                                        {recentlySuccessful ? (
                                            <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle size={16} /> Saved</span>
                                        ) : <span></span>}
                                        
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex justify-center items-center py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                                        >
                                            <Save size={16} className="mr-2" /> Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Listings */}
                        <div className="xl:col-span-1 space-y-8">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="font-semibold text-lg text-gray-900">Your Listings</h2>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{userBusinesses?.length || 0}</span>
                                </div>
                                
                                <div className="p-0">
                                    {userBusinesses && userBusinesses.length > 0 ? (
                                        <ul className="divide-y divide-gray-200">
                                            {userBusinesses.map((business) => (
                                                <li key={business.id} className="p-5 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start gap-3">
                                                        {business.logo ? (
                                                            <img src={business.logo} alt={business.name} className="w-10 h-10 rounded border border-gray-200 object-cover shrink-0" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded bg-blue-50 border border-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">
                                                                {business.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{business.name}</p>
                                                            <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                                                <MapPin size={12} /> {business.category_name || business.category}
                                                            </p>
                                                            
                                                            <div className="mt-2 flex items-center gap-2">
                                                                {business.is_verified == 1 ? (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                                                                        <ShieldCheck size={10} className="mr-1" /> Verified
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800">
                                                                        Pending
                                                                    </span>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="mt-4">
                                                                <a 
                                                                    href={`/reviews/${business.category || (business.category_name ? business.category_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : 'uncategorized')}/${business.slug}`}
                                                                    className="w-full inline-flex justify-center items-center px-4 py-2 border-2 border-gray-800 shadow-sm text-xs font-bold uppercase tracking-wider rounded-full text-gray-800 bg-transparent hover:bg-gray-800 hover:text-white transition-all focus:outline-none focus:ring-4 focus:ring-gray-200"
                                                                >
                                                                    Edit & Manage
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            No businesses listed yet.
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
