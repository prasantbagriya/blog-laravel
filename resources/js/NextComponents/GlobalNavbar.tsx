// @ts-nocheck
"use client"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Zap, ChevronDown, Link as LinkIcon, MessageSquareText, FileText, Activity, TrendingUp, Terminal, Video, GraduationCap } from "lucide-react"

const getDevPath = (path) => {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    if (path.startsWith('/youtubevideodownload')) return `http://localhost:5173${path}`
    if (path.startsWith('/tool')) return `http://localhost:5175${path}`
    if (path.startsWith('/portal')) return `http://localhost:5176${path}`
  }
  return path
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [isCompanyOpen, setIsCompanyOpen] = useState(false)

  const getHref = (page) => {
    const basePath = typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '';
    
    if (page === 'blog') return basePath + '/blog';
    if (page === 'auth') return getDevPath(basePath + '/auth');
    if (page === 'portal' || page.startsWith('portal/')) {
      const path = page === 'portal' ? '/portal/' : `/${page}`;
      return getDevPath(basePath + path);
    }
    if (page === 'youtubevideodownload') return getDevPath(basePath + '/youtubevideodownload/');
    
    const toolPages = [
      'prop-firm', 'sip-calculator', 'compound-interest'
    ];
    if (toolPages.includes(page)) return getDevPath(basePath + `/tool/${page}`);
    
    return page === 'landing' ? basePath + "/" : basePath + `/${page}`;
  }

  const handleNavClick = (e, page) => {
    const targetPage = typeof e === 'string' ? e : page;
    const event = typeof e === 'object' ? e : null;
    
    if (event) event.preventDefault();
    window.location.href = getHref(targetPage);
  }

  const navLinks = [
    { label: 'Blog', page: 'blog' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact Us', page: 'contact' },
    { label: 'Privacy Policy', page: 'privacy' },
    { label: 'Terms & Conditions', page: 'terms' },
    { label: 'Editorial Policy', page: 'editorial-policy' },
    { label: 'Fact-Checking', page: 'fact-checking-policy' }
  ]

  const toolsList = [
    { label: 'Link Generator', page: 'whatsapp-link-generator', icon: LinkIcon, color: 'text-blue-400' },
    { label: 'Direct Message', page: 'whatsapp-direct-message', icon: MessageSquareText, color: 'text-blue-400' },
    { label: 'Form Generator', page: 'whatsapp-form-generator', icon: FileText, color: 'text-emerald-400' },
    { label: 'SIP Calculator', page: 'sip-calculator', icon: Activity, color: 'text-purple-400' },
    { label: 'Compound Growth', page: 'compound-interest', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Prop Firm Calc', page: 'prop-firm', icon: Terminal, color: 'text-indigo-400' },
    { label: 'YouTube Downloader', page: 'youtubevideodownload', icon: Video, color: 'text-red-400' },
    { label: 'Exam Portal', page: 'portal', icon: GraduationCap, color: 'text-indigo-400' },
    { label: 'Playbook', page: 'playbook', icon: FileText, color: 'text-amber-400' }
  ]

  const companyList = [
    { label: 'About Us', page: 'about' },
    { label: 'Careers', page: 'careers' },
    { label: 'Artists', page: 'artists' },
    { label: 'Privacy Policy', page: 'privacy' },
    { label: 'Terms of Service', page: 'terms' }
  ]

  return (
    <header className="fixed top-6 left-0 right-0 z-50 w-full px-4 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto pointer-events-auto">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none border border-blue-500/20"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <a href={getHref('landing')} onClick={(e) => handleNavClick(e, 'landing')} className="flex items-center space-x-2 group shrink-0 decoration-transparent">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                  <img src={(typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + "/logo.png"} alt="Coaching Sikar Logo" className="w-full h-full object-cover" />
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

              {/* Mobile Controls */}
              <div className="md:hidden flex items-center gap-2">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 p-2 bg-transparent border-none cursor-pointer">
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-md overflow-hidden p-6 space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  {navLinks.map(link => (
                    <a key={link.page} href={getHref(link.page)} onClick={(e) => handleNavClick(e, link.page)} className="text-left text-gray-400 hover:text-white font-bold text-sm py-2 block decoration-transparent">{link.label}</a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </header>
  )
}
