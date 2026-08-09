import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { Search, Bell, Check } from 'lucide-react';
import moment from 'moment';

export default function Navbar({ auth, searchQuery = '' }) {
    const [query, setQuery] = useState(searchQuery);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get('/search', { q: query });
        }
    };

    const markAsRead = (id = null) => {
        router.post('/notifications/mark-read', { id }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                if (!id) setIsNotifOpen(false);
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-[#EDEFF1]">
            <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight hidden sm:block">
                            Nexus
                        </span>
                    </Link>
                </div>
                
                {/* Search Bar */}
                <div className="hidden sm:block flex-1 max-w-2xl mx-8 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={20} className="text-[#878A8C]" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search Nexus" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full bg-[#F6F7F8] hover:bg-white hover:border-[#0079D3] border border-transparent rounded-full py-2.5 pl-12 pr-4 text-[14px] font-medium text-[#1C1C1C] placeholder-[#878A8C] focus:outline-none focus:bg-white focus:border-[#0079D3] focus:ring-0 transition-all shadow-none" 
                    />
                </div>

                <div className="flex items-center gap-4">
                    {auth?.user ? (
                        <>
                            {/* Notifications Dropdown */}
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="p-2 hover:bg-[#F6F7F8] rounded-full relative transition-colors"
                                >
                                    <Bell size={24} className="text-[#1C1C1C]" />
                                    {auth.unread_notifications_count > 0 && (
                                        <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></div>
                                    )}
                                </button>

                                {isNotifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#EDEFF1] overflow-hidden z-50">
                                        <div className="p-4 border-b border-[#EDEFF1] flex items-center justify-between">
                                            <h3 className="font-bold text-[#1C1C1C]">Notifications</h3>
                                            {auth.unread_notifications_count > 0 && (
                                                <button onClick={() => markAsRead()} className="text-[12px] font-medium text-[#0079D3] hover:underline flex items-center gap-1">
                                                    <Check size={14} /> Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {auth.notifications?.length === 0 ? (
                                                <div className="p-8 text-center text-[#878A8C] text-[14px]">
                                                    You have no notifications.
                                                </div>
                                            ) : (
                                                auth.notifications?.map(notif => (
                                                    <div 
                                                        key={notif.id} 
                                                        onClick={() => {
                                                            if (!notif.read_at) markAsRead(notif.id);
                                                            router.visit(notif.data.url);
                                                        }}
                                                        className={`p-4 border-b border-[#EDEFF1] flex gap-3 cursor-pointer hover:bg-[#F6F7F8] transition-colors ${!notif.read_at ? 'bg-[#F0F8FF]' : ''}`}
                                                    >
                                                        <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-gray-200">
                                                            {notif.data.profile_picture ? (
                                                                <img src={notif.data.profile_picture} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-tr from-[#0079D3] to-[#4F46E5]"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[14px] text-[#1C1C1C] leading-snug">
                                                                {notif.data.message}
                                                            </p>
                                                            <p className="text-[12px] text-[#878A8C] mt-1">
                                                                {moment(notif.created_at).fromNow()}
                                                            </p>
                                                        </div>
                                                        {!notif.read_at && (
                                                            <div className="w-2 h-2 rounded-full bg-[#0079D3] mt-2"></div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/dashboard" className="flex items-center gap-2 hover:bg-[#F6F7F8] px-2 py-1.5 rounded-full transition-colors">
                                <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                                    {auth.user.profile_picture ? (
                                        <img src={auth.user.profile_picture} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-[#0079D3] to-[#4F46E5]"></div>
                                    )}
                                </div>
                                <span className="font-bold text-[14px] hidden sm:block">{auth.user.name}</span>
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] transition-colors">
                                Log In
                            </Link>
                            <Link href="/register" className="px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
