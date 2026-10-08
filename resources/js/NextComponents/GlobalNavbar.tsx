// @ts-nocheck
import React, { useState, useEffect } from "react"
import { Menu, X, Sun, Moon } from "lucide-react"
import { usePage, Link } from '@inertiajs/react'

export default function Navbar({ global_nav: passedNav }: { global_nav?: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState([])
  const [lastScrollY, setLastScrollY] = useState(0)
  
  const { props, url } = usePage()
  const currentPath = typeof window !== 'undefined' ? (url || window.location.pathname) : '';
  const user = props?.auth?.user;
  let global_nav = passedNav || props?.global_nav || [];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
      
      let lastScrollYValue = window.scrollY || 0;
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 60 && currentScrollY > lastScrollYValue) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollYValue = currentScrollY;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }

  const getHref = (page) => {
    const basePath = typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '';
    
    if (page === 'landing') return basePath + "/";
    if (page.startsWith('/') || page.startsWith('http')) return page.startsWith('http') ? page : basePath + page;
    
    if (page === 'blog') return basePath + '/blog';
    if (page === 'feed') return basePath + '/feed';
    if (page === 'category') return basePath + '/category';
    
    return basePath + `/${page}`;
  }


  const allLinks = global_nav && global_nav.length > 0 
    ? global_nav.filter(n => n.is_active).map(n => ({ id: n.id, parent_id: n.parent_id, label: n.name, page: n.url || '/' }))
    : [
        { id: 1, parent_id: null, label: 'Blog', page: 'blog' },
        { id: 2, parent_id: null, label: 'Community', page: 'feed' },
        { id: 3, parent_id: null, label: 'Explore Institutes', page: 'business' },
        { id: 4, parent_id: null, label: 'Category', page: 'category' },
        { id: 5, parent_id: null, label: 'About Us', page: 'about' },
        { id: 6, parent_id: null, label: 'Contact Us', page: 'contact' },
      ];

  const topLevelLinks = allLinks.filter(link => !link.parent_id);
  const getChildren = (parentId) => allLinks.filter(link => link.parent_id === parentId);

  return (
    <>
    {/* Spacer to prevent content from going under the fixed navbar on inner pages */}
    <div className="h-[54px] w-full shrink-0 block"></div>
    <header className={`fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-[#111111] border-b border-slate-200 dark:border-zinc-800 pointer-events-auto transition-transform duration-300 font-sans ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-[54px]">
          {/* Logo Section */}
          <a href={getHref('landing')} className="flex items-center gap-2 group decoration-transparent">
            <img loading="lazy" decoding="async" src={(typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + "/uploads/logo.webp"} alt="Coaching Sikar Logo" className="w-8 h-8 object-contain" width="32" height="32" />
            <span className="text-[20px] font-bold text-[#1c1c1c] dark:text-white leading-none">
              Coachings <span className="text-[#e11d48]">Sikar</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 ml-10 h-full">
            {topLevelLinks.map((link) => {
              const linkPath = getHref(link.page || link.url);
              const isActive = currentPath === linkPath || ((link.page || link.url) !== 'landing' && (link.page || link.url) !== '/' && currentPath.includes(link.page || link.url));
              const children = getChildren(link.id);
              const hasChildren = children.length > 0;
              
              if (hasChildren) {
                return (
                  <div key={link.id || link.label || link.name} className="relative group h-full flex items-center">
                    <a href={linkPath} className={`flex items-center gap-1 text-[15px] font-medium transition-colors decoration-transparent ${isActive ? 'text-[#ff642d] dark:text-[#ff8a5c]' : 'text-[#424242] dark:text-gray-300 hover:text-[#ff642d] dark:hover:text-[#ff8a5c]'}`}>
                      {link.label || link.name}
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:rotate-180 transition-transform duration-200"><path d="m6 9 6 6 6-6"/></svg>
                    </a>
                    {isActive && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff642d] rounded-t-md"></div>}
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-[54px] left-0 min-w-[200px] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 flex flex-col py-2">
                      {children.map(child => {
                        const grandChildren = getChildren(child.id);
                        const hasGrandChildren = grandChildren.length > 0;
                        if (hasGrandChildren) {
                          return (
                            <div key={child.id || child.label || child.name} className="relative group/sub w-full">
                              <a href={getHref(child.page || child.url)} className="w-full text-left px-4 py-2 text-[14px] text-[#424242] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent flex items-center justify-between">
                                <span>{child.label || child.name}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-rotate-90 opacity-70"><path d="m6 9 6 6 6-6"/></svg>
                              </a>
                              {/* Sub Dropdown Menu */}
                              <div className="absolute top-0 left-full min-w-[200px] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 transform translate-x-2 group-hover/sub:translate-x-0 z-50 flex flex-col py-2 -mt-2">
                                {grandChildren.map(gc => (
                                  <a key={gc.id || gc.label || gc.name} href={getHref(gc.page || gc.url)} className="px-4 py-2 text-[14px] text-[#424242] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent whitespace-nowrap block w-full">
                                    {gc.label || gc.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return (
                          <a key={child.id || child.label || child.name} href={getHref(child.page || child.url)} className="px-4 py-2 text-[14px] text-[#424242] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent whitespace-nowrap block w-full">
                            {child.label || child.name}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              
              return (
                <a
                  key={link.id || link.label || link.name}
                  href={linkPath}
                  className={`relative flex items-center text-[15px] font-medium transition-colors decoration-transparent h-full ${
                    isActive 
                      ? 'text-[#ff642d] dark:text-[#ff8a5c]' 
                      : 'text-[#424242] dark:text-gray-300 hover:text-[#ff642d] dark:hover:text-[#ff8a5c]'
                  }`}
                >
                  {link.label || link.name}
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff642d] rounded-t-md"></div>}
                </a>
              );
            })}
          </div>

          <div className="hidden lg:flex flex-1"></div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3 mr-2">
              <a href="/search" className="text-[#424242] hover:text-[#ff642d] dark:text-gray-300 dark:hover:text-[#ff8a5c] transition-colors" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </a>
              <button 
                onClick={toggleDarkMode}
                className="text-[#424242] hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
            
            {user ? (
              <a href="/dashboard" className="btn-amber px-6 py-2.5 font-medium text-zinc-950 rounded hover:bg-[#e85522] transition-colors decoration-transparent text-[15px]">
                Dashboard
              </a>
            ) : (
              <>
                <a href="/login" className="text-[15px] font-medium text-[#1c1c1c] dark:text-white hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent px-3">Log In</a>
                
                <a href="/register" className="btn-amber px-6 py-2.5 font-medium text-zinc-950 rounded hover:bg-[#e85522] transition-colors decoration-transparent text-[15px]">
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="text-[#424242] hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a href="/search" className="text-[#424242] dark:text-gray-300" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </a>
            <button aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#1c1c1c] dark:text-white">
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111111] py-4 animate-slide-down absolute left-0 right-0 top-[54px] shadow-lg max-h-[calc(100vh-54px)] overflow-y-auto">
            <div className="flex flex-col">
              {topLevelLinks.map(link => {
                const linkPath = getHref(link.page || link.url);
                const isActive = currentPath === linkPath || ((link.page || link.url) !== 'landing' && (link.page || link.url) !== '/' && currentPath.includes(link.page || link.url));
                const children = getChildren(link.id);
                const hasChildren = children.length > 0;
                
                const isExpanded = expandedMenus.includes(link.id || link.label || link.name);
                
                return (
                  <React.Fragment key={link.id || link.label || link.name}>
                    <div className="flex items-center justify-between border-l-4 border-transparent group">
                      <a 
                        href={linkPath} 
                        className={`flex-1 px-6 py-3.5 text-[16px] font-medium decoration-transparent ${
                          isActive 
                            ? 'bg-orange-50 dark:bg-zinc-900 text-[#ff642d]' 
                            : 'text-[#1c1c1c] dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-zinc-900'
                        }`}
                      >
                        {link.label || link.name}
                      </a>
                      {hasChildren && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setExpandedMenus(prev => prev.includes(link.id || link.label || link.name) ? prev.filter(item => item !== (link.id || link.label || link.name)) : [...prev, link.id || link.label || link.name]);
                          }}
                          className={`p-3.5 flex items-center justify-center ${isActive ? 'bg-orange-50 dark:bg-zinc-900 text-[#ff642d]' : 'text-[#1c1c1c] dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-zinc-900'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                      )}
                    </div>
                    {hasChildren && isExpanded && (
                      <div className="bg-slate-50/50 dark:bg-[#151515]/50 border-b border-slate-100 dark:border-zinc-800/50">
                        {children.map(child => {
                          const grandChildren = getChildren(child.id);
                          const hasGrandChildren = grandChildren.length > 0;
                          const isChildExpanded = expandedMenus.includes(child.id || child.label || child.name);
                          
                          return (
                            <React.Fragment key={child.id || child.label || child.name}>
                              <div className="flex items-center justify-between border-l-4 border-transparent">
                                <a 
                                  href={getHref(child.page || child.url)}
                                  className="flex-1 px-10 py-3 text-[15px] font-medium text-[#707070] dark:text-gray-400 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent"
                                >
                                  {child.label || child.name}
                                </a>
                                {hasGrandChildren && (
                                  <button 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setExpandedMenus(prev => prev.includes(child.id || child.label) ? prev.filter(item => item !== (child.id || child.label)) : [...prev, child.id || child.label]);
                                    }}
                                    className="p-3 pr-6 text-[#707070] dark:text-gray-400 hover:text-[#ff642d] dark:hover:text-[#ff8a5c]"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isChildExpanded ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                                  </button>
                                )}
                              </div>
                              {hasGrandChildren && isChildExpanded && (
                                <div className="bg-slate-100/50 dark:bg-[#202020]/50 py-1">
                                  {grandChildren.map(gc => (
                                    <a 
                                      key={gc.id || gc.label}
                                      href={getHref(gc.page)}
                                      className="px-14 py-2.5 text-[14px] font-medium text-[#888] dark:text-gray-500 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent border-l-4 border-transparent block"
                                    >
                                      - {gc.label}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            <div className="px-4 py-4 flex flex-col gap-3 border-t border-slate-200 dark:border-zinc-800">
              {user ? (
                <a href="/dashboard" className="btn-amber flex items-center justify-center font-medium text-zinc-950 hover:bg-[#e85522] py-2.5 rounded decoration-transparent transition-colors">Dashboard</a>
              ) : (
                <>
                  <a href="/login" className="flex items-center justify-center font-medium text-[#1c1c1c] dark:text-white border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 py-2.5 rounded decoration-transparent transition-colors">Log In</a>
                  <a href="/register" className="btn-amber flex items-center justify-center font-medium text-zinc-950 hover:bg-[#e85522] py-2.5 rounded decoration-transparent transition-colors">Sign Up</a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  )
}

