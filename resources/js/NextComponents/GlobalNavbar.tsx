// @ts-nocheck
"use client"
import React, { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getHref = (page) => {
    const basePath = typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '';
    
    if (page === 'blog') return basePath + '/blog';
    if (page === 'feed') return basePath + '/feed';
    if (page === 'category') return basePath + '/category';
    
    return page === 'landing' ? basePath + "/" : basePath + `/${page}`;
  }

  const handleNavClick = (e, page) => {
    const targetPage = typeof e === 'string' ? e : page;
    const event = typeof e === 'object' ? e : null;
    
    if (event) event.preventDefault();
    window.location.href = getHref(targetPage);
  }

  const navLinks = [
    { label: 'Explore Institutes', page: 'reviews' },
    { label: 'Blog', page: 'blog' },
    { label: 'Community', page: 'feed' },
    { label: 'Category', page: 'category' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
  ]

  return (
    <>
    <style>{`
      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      @keyframes slideDown {
        from { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
        to { opacity: 1; max-height: 500px; padding-top: 1.5rem; padding-bottom: 1.5rem; }
      }
      .animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
      .animate-pulse-glow { animation: pulseGlow 4s infinite ease-in-out; }
      .animate-slide-down { animation: slideDown 0.3s ease-out forwards; overflow: hidden; }
      .btn-amber, a.btn-amber, button.btn-amber {
        background: var(--amber, #f59e0b) !important;
        color: #000000ff !important;
        border-color: var(--amber, #f59e0b) !important;
        border-radius: 999px !important;
        font-weight: 700 !important;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `}</style>
    <header className="fixed top-6 left-0 right-0 z-50 w-full px-4 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto pointer-events-auto">
        <nav
          className="relative bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in-down"
        >
          {/* Animated border glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none border border-blue-500/20 animate-pulse-glow"
          />

          <div className="px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <a href={getHref('landing')} onClick={(e) => handleNavClick(e, 'landing')} className="flex items-center space-x-2 group shrink-0 decoration-transparent">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                  <img loading="lazy" decoding="async" fetchPriority="low" src={(typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + "/uploads/logo.webp"} alt="Coaching Sikar Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-bold text-white tracking-tighter">Coaching Sikar</span>
              </a>

              {/* Desktop Nav */}
              <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
                {navLinks.map(link => (
                  <a
                    key={link.page}
                    href={getHref(link.page)}
                    onClick={(e) => handleNavClick(e, link.page)}
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer decoration-transparent"
                  >
                    {link.label}
                  </a>
                ))}


              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-4">
                <a href="/login" className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors decoration-transparent border border-white/10">Log In</a>
                <a href="/register" className="btn-amber px-5 py-2 transition-transform hover:scale-105 text-sm">Register</a>
              </div>

              {/* Mobile Controls */}
              <div className="md:hidden flex items-center gap-3">
                <a href="/register" className="btn-amber px-4 py-1.5 text-sm transition-transform hover:scale-105">Register</a>
                <button aria-label="Toggle menu" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 p-2 bg-transparent border-none cursor-pointer">
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-md overflow-hidden animate-slide-down px-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {navLinks.map(link => (
                  <a key={link.page} href={getHref(link.page)} onClick={(e) => handleNavClick(e, link.page)} className="text-left text-gray-400 hover:text-white font-bold text-sm py-2 block decoration-transparent">{link.label}</a>
                ))}
              </div>
              <div className="mt-2 mb-4 pt-4 border-t border-white/10 flex justify-center">
                <a href="/login" className="text-center text-white bg-white/10 hover:bg-white/20 font-bold text-sm py-2.5 rounded-full block decoration-transparent w-full transition-colors border border-white/10">Log In</a>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
    </>
  )
}
