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
  BarChart3,
  LogIn
} from 'lucide-react';
import { UserRole, Category } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenWriteReview: () => void;
  onSelectCategory: (categorySlug: string) => void;
  onNavigateHome: () => void;
  categories: Category[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeView: 'home' | 'directory' | 'profile' | 'dashboard' | 'moderation' | 'admin';
  onNavigateView: (view: 'home' | 'directory' | 'dashboard' | 'moderation' | 'admin') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenWriteReview,
  onSelectCategory,
  onNavigateHome,
  categories,
  isDarkMode,
  onToggleDarkMode,
  activeView,
  onNavigateView,
  onOpenAuth
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const currentRole = user?.role || 'visitor';

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'visitor': return { label: 'Visitor', bg: 'bg-[#F5F5F2] text-[#1A1A1A] dark:bg-[#1A1A19] dark:text-[#F5F5F2]', icon: UserCheck };
      case 'reviewer': return { label: 'Verified Reviewer', bg: 'bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF]', icon: ShieldCheck };
      case 'business_owner': return { label: 'Business Owner', bg: 'bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]', icon: Building2 };
      case 'moderator': return { label: 'AI Moderator', bg: 'bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300', icon: ShieldAlert };
      case 'super_admin': return { label: 'Super Admin', bg: 'bg-purple-50 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300', icon: Crown };
      default: return { label: 'Visitor', bg: 'bg-[#F5F5F2] text-[#1A1A1A]', icon: UserCheck };
    }
  };

  const currentRoleInfo = getRoleBadge(currentRole);
  const RoleIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E1] dark:border-[#2A2A28] bg-[#FDFCFB]/95 dark:bg-[#0F0F0E]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={onNavigateHome} 
            className="flex items-center gap-3 text-left focus:outline-none group"
            id="nav-brand-logo"
          >
            <div className="w-9 h-9 rounded-md bg-[#0052FF] flex items-center justify-center text-white shadow-sm group-hover:bg-[#0040D0] transition-colors">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-editorial-serif italic font-bold text-xl tracking-tight text-[#1A1A1A] dark:text-white">TrustPulse</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#0052FF] text-white uppercase tracking-wider">AI</span>
              </div>
              <p className="text-[10px] text-[#555555] dark:text-[#A0A09C] font-mono -mt-0.5 hidden sm:block">Editorial Reputation Intelligence</p>
            </div>
          </button>

          {/* Categories Dropdown */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] hover:text-[#0052FF] dark:hover:text-[#80B0FF] px-3 py-2 rounded-md hover:bg-[#F5F5F2] dark:hover:bg-[#161615] transition"
              id="nav-categories-btn"
            >
              <Grid className="w-3.5 h-3.5 text-[#0052FF]" />
              <span>Categories</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showCategoryMenu && (
              <div 
                className="absolute top-full left-0 mt-2 w-72 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowCategoryMenu(false)}
              >
                <div className="px-3 py-2 border-b border-[#E5E5E1] dark:border-[#2A2A28] text-[10px] font-mono font-bold uppercase tracking-widest text-[#555555] dark:text-[#A0A09C]">
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
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[#F5F5F2] dark:hover:bg-[#2A2A28] text-xs font-medium text-[#1A1A1A] dark:text-[#F5F5F2] flex items-center justify-between group transition"
                    >
                      <span className="group-hover:text-[#0052FF] dark:group-hover:text-[#80B0FF] transition-colors">{cat.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F5F5F2] dark:bg-[#2A2A28] text-[#555555] dark:text-[#A0A09C] group-hover:bg-[#E6EEFF] group-hover:text-[#0052FF] transition">
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
            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-[#555555] dark:text-[#A0A09C] bg-[#F5F5F2] dark:bg-[#161615] hover:bg-[#EAEAEA] dark:hover:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] rounded-md transition group text-left"
            id="nav-ai-search-bar"
          >
            <Search className="w-4 h-4 text-[#0052FF] group-hover:scale-110 transition-transform" />
            <span className="flex-1 truncate">Search index, ask AI agent... e.g. "Top CRM for startups"</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-white dark:bg-[#2A2A28] border border-[#E5E5E1] dark:border-[#3A3A38] px-1.5 py-0.5 rounded text-[#1A1A1A] dark:text-[#F5F5F2] font-mono shadow-2xs">
              <Sparkles className="w-2.5 h-2.5 text-[#0052FF]" /> AI
            </kbd>
          </button>
        </div>

        {/* Right Section Actions & Role Switcher */}
        <div className="flex items-center gap-2.5">

          {/* Quick Mobile Search */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden p-2 text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615] rounded-md"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Write Review Button */}
          <button
            onClick={onOpenWriteReview}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#0052FF] hover:bg-[#0040D0] text-white shadow-sm active:scale-95 transition-all"
            id="nav-write-review-btn"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Write Review</span>
          </button>

          {/* Views Navigation Shortcuts based on role */}
          {currentRole === 'business_owner' && (
            <button
              onClick={() => onNavigateView('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition ${
                activeView === 'dashboard'
                  ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-white dark:border-white dark:text-[#1A1A1A]'
                  : 'border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#0052FF]" />
              <span className="hidden sm:inline">Business Suite</span>
            </button>
          )}

          {currentRole === 'moderator' && (
            <button
              onClick={() => onNavigateView('moderation')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition ${
                activeView === 'moderation'
                  ? 'bg-amber-900 border-amber-900 text-white'
                  : 'border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">AI Queue</span>
            </button>
          )}

          {currentRole === 'super_admin' && (
            <button
              onClick={() => onNavigateView('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition ${
                activeView === 'admin'
                  ? 'bg-purple-900 border-purple-900 text-white'
                  : 'border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615]'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>
          )}

          {/* Auth UI */}
          {!user ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md border border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615] transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log In / Sign Up</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-full text-xs font-medium border border-[#E5E5E1] dark:border-[#2A2A28] transition ${currentRoleInfo.bg}`}
              >
                <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full bg-white" />
                <span className="hidden md:inline font-semibold pr-2">{user.name}</span>
                <ChevronDown className="w-3 h-3 opacity-60 mr-1" />
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] shadow-lg p-2 z-50"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-[#E5E5E1] dark:border-[#2A2A28] text-[10px] font-mono font-bold uppercase tracking-widest text-[#555555] dark:text-[#A0A09C] truncate">
                    {user.email}
                  </div>
                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); onNavigateHome(); }}
                      className="w-full text-left px-3 py-2 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615] rounded-md transition"
            title="Toggle theme"
            id="nav-theme-toggle-btn"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#1A1A1A]" />}
          </button>

        </div>

      </div>
    </header>
  );
};
