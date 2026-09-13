import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Sparkles, 
  UserCheck, 
  Building2, 
  ShieldAlert, 
  Crown, 
  Plus, 
  ChevronDown, 
  Sun, 
  Moon,
  Grid,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { UserRole, Category } from '../types';

interface NavbarProps {
  authUser?: any;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenWriteReview: () => void;
  onOpenListBusiness: () => void;
  onSelectCategory: (categorySlug: string) => void;
  onNavigateHome: () => void;
  categories: Category[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeView: 'home' | 'directory' | 'profile' | 'dashboard' | 'moderation' | 'admin';
  onNavigateView: (view: 'home' | 'directory' | 'dashboard' | 'moderation' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  authUser,
  currentRole,
  onRoleChange,
  onOpenSearch,
  onOpenWriteReview,
  onOpenListBusiness,
  onSelectCategory,
  onNavigateHome,
  categories,
  isDarkMode,
  onToggleDarkMode,
  activeView,
  onNavigateView
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'visitor': return { label: 'Visitor', bg: 'bg-zinc-100 text-zinc-900 dark:bg-[#1A1A19] dark:text-zinc-100', icon: UserCheck };
      case 'reviewer': return { label: 'Verified Reviewer', bg: 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400', icon: ShieldCheck };
      case 'business_owner': return { label: 'Business Owner', bg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg rounded-lg transition-all border border-transparent', icon: Building2 };
      case 'moderator': return { label: 'AI Moderator', bg: 'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300', icon: ShieldAlert };
      case 'super_admin': return { label: 'Super Admin', bg: 'bg-purple-50 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300', icon: Crown };
      default: return { label: 'Visitor', bg: 'bg-zinc-100 text-zinc-900', icon: UserCheck };
    }
  };

  const currentRoleInfo = getRoleBadge(currentRole);
  const RoleIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6 lg:gap-8">
          <a 
            href="/" 
            className="flex items-center gap-3 text-left focus:outline-none group"
            id="nav-brand-logo"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-lg">C</span>
            </div>
            <div className="flex items-center">
              <span className="hidden sm:inline-block font-bold text-[22px] tracking-tight ml-1 text-zinc-900 dark:text-white">
                  coachinginsikar
              </span>
            </div>
          </a>

          {/* Main Website Links Removed as requested */}

          {/* Categories Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              id="nav-categories-btn"
            >
              <Grid className="w-3.5 h-3.5 text-blue-600" />
              <span>Categories</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showCategoryMenu && (
              <div 
                className="absolute top-full left-0 mt-2 w-72 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowCategoryMenu(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Directory Index
                </div>
                <div className="py-1 max-h-80 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        setShowCategoryMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 flex items-center justify-between group transition"
                    >
                      <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                        {cat.businessCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global AI Search Trigger Bar */}
        <div className="flex-1 max-w-md hidden lg:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md transition group text-left"
            id="nav-ai-search-bar"
          >
            <Search className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="flex-1 truncate">Search index, ask AI agent... e.g. "Top CRM for startups"</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-900 dark:text-zinc-100 font-mono shadow-2xs">
              <Sparkles className="w-2.5 h-2.5 text-blue-600" /> AI
            </kbd>
          </button>
        </div>

        {/* Right Section Actions & Role Switcher */}
        <div className="flex items-center gap-2.5">

          {/* Quick Mobile Search */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden text-zinc-900 dark:text-zinc-100 hover:text-blue-600 transition"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* List Business Button */}
          <button
            onClick={() => {
              if (authUser) {
                onOpenListBusiness();
              } else {
                window.location.href = '/login?redirect=/reviews';
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-all shadow-sm active:scale-95 transition-all flex whitespace-nowrap shrink-0"
            id="nav-list-business-btn"
          >
            <Building2 className="w-3.5 h-3.5 stroke-[2]" />
            <span className="hidden sm:inline">List Business</span>
          </button>

          {/* Write Review Button */}
          <button
            onClick={() => {
              if (authUser) {
                onOpenWriteReview();
              } else {
                window.location.href = '/login?redirect=/reviews';
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 active:scale-95 transition-all whitespace-nowrap shrink-0"
            id="nav-write-review-btn"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Write Review</span>
          </button>

          {/* Views Navigation Shortcuts based on role */}
          {authUser?.role === 'business_owner' && (
            <button
              onClick={() => onNavigateView('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition whitespace-nowrap shrink-0 ${
                activeView === 'dashboard'
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Business Suite</span>
            </button>
          )}

          {currentRole === 'moderator' && (
            <button
              onClick={() => onNavigateView('moderation')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition whitespace-nowrap shrink-0 ${
                activeView === 'moderation'
                  ? 'bg-amber-900 border-amber-900 text-white'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">AI Queue</span>
            </button>
          )}

          {currentRole === 'super_admin' && (
            <a
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition whitespace-nowrap shrink-0 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900`}
            >
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Admin Panel</span>
            </a>
          )}

          {/* Auth Section */}
          <div className="relative shrink-0">
            {authUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 whitespace-nowrap">
                <a href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {authUser.avatar ? (
                      <img src={authUser.avatar} alt={authUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCheck className="w-4 h-4 m-1 text-gray-500" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-tight dark:text-white">{authUser.name}</span>
                    <span className="text-[9px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{authUser.role}</span>
                  </div>
                </a>
                <a href="/logout" className="ml-1 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded whitespace-nowrap">Logout</a>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a href="/login?redirect=/reviews" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-md transition-colors whitespace-nowrap shrink-0">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Login</span>
                </a>
                <a href="/register?redirect=/reviews" className="px-3 py-1.5 text-xs font-semibold text-white dark:text-white hover:text-white dark:hover:text-white bg-zinc-900 dark:bg-zinc-900 hover:bg-black dark:hover:bg-black rounded-md transition-colors whitespace-nowrap shrink-0">Register</a>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="text-zinc-900 dark:text-zinc-100 hover:text-blue-600 transition"
            title="Toggle theme"
            id="nav-theme-toggle-btn"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-900" />}
          </button>

        </div>

      </div>
    </header>
  );
};
