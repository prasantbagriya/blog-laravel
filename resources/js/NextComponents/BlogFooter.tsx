// @ts-nocheck
"use client"

import React, { useState } from "react"
import { usePage } from "@inertiajs/react"
import { Zap } from "lucide-react"
import { Instagram, Twitter, Linkedin, Youtube, Facebook, Pinterest, Tumblr } from "./BrandIcons"

export default function BlogFooter() {
  const { url: pathname } = usePage();
  const [email, setEmail] = useState("");

  // Don't render the public footer in the admin panel
  if (pathname?.startsWith('/blog/admin')) {
    return null;
  }

  const handleNavClick = (page: string) => {
    const basePath = typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '';
    if (page === 'blog') {
      window.location.href = basePath + '/blog';
      return;
    }
    if (page === 'portal') {
      window.location.href = basePath + '/portal/';
      return;
    }
    if (page === 'youtubevideodownload') {
      window.location.href = basePath + '/youtubevideodownload';
      return;
    }
    if (page === 'playbook') {
      window.location.href = basePath + '/playbook/';
      return;
    }
    const toolPages = [
      'prop-firm', 'sip-calculator', 'compound-interest',
      'whatsapp-link-generator', 'whatsapp-direct-message', 'whatsapp-form-generator'
    ];
    if (toolPages.includes(page)) {
      window.location.href = basePath + `/tool/${page}`;
      return;
    }
    window.location.href = basePath + `/${page === 'landing' ? '' : page}`;
  }

  const footerSections = [
    {
      title: "Navigation",
      links: [
        { label: "Home", page: "landing" },
        { label: "Blog", page: "blog" },
        { label: "About Us", page: "about" },
        { label: "Contact Us", page: "contact" }
      ]
    },
    {
      title: "Legal & Policies",
      links: [
        { label: "Privacy Policy", page: "privacy" },
        { label: "Terms & Conditions", page: "terms" },
        { label: "Editorial Policy", page: "editorial-policy" },
        { label: "Fact-Checking", page: "fact-checking-policy" }
      ]
    }
  ]

  return (
    <footer className="relative bg-slate-900 text-slate-300 pt-16 pb-10 overflow-hidden mt-12 w-full border-t border-slate-800">
      {/* Decorative gradient element */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto relative z-10 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          <div className="md:col-span-2 lg:col-span-2 space-y-8">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleNavClick('landing')}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden p-1">
                <img loading="lazy" decoding="async" fetchPriority="low" src={(typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + "/uploads/logo.webp"} alt="Coaching Sikar Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Coaching Sikar</span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your ultimate guide to finding the best coaching institutes. Explore, compare, and make the right choice for your future.
            </p>

            <div className="flex gap-3">
              {[
                { Icon: Facebook, url: 'https://www.facebook.com/coachinginsikar' },
                { Icon: Twitter, url: 'https://x.com/coachinginsikar' },
                { Icon: Instagram, url: 'https://www.instagram.com/coachinginsikar' },
                { Icon: Youtube, url: 'https://www.youtube.com/@coachinginsikar' },
                { Icon: Linkedin, url: 'https://www.linkedin.com/company/coachinginsikar' }
              ].map(({ Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit our ${url.split('.')[1] || 'social'} page`} className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-blue-500/20 hover:-translate-y-1">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => {
            return (
              <div key={section.title} className="md:col-span-1 lg:col-span-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                  {section.title}
                </h3>
                <ul className="space-y-4 m-0 p-0" style={{ listStyle: 'none' }}>
                  {section.links.map((link) => {
                    return (
                      <li key={link.label} className="m-0 p-0 flex">
                        <button
                          onClick={() => handleNavClick(link.page)}
                          className="text-sm text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 text-left bg-transparent border-none p-0 cursor-pointer flex items-center group outline-none focus:outline-none ring-0"
                        >
                          <span className="opacity-0 group-hover:opacity-100 text-blue-500 mr-2 transition-opacity">›</span>
                          {link.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}

          <div className="md:col-span-1 lg:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
               Stay Updated
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-400 leading-relaxed m-0">
                Get the latest educational updates and coaching news delivered to your inbox.
              </p>
              <form
                className="relative group m-0 mt-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email) return;
                  try {
                    const res = await fetch("/api/inquiries/collect", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email,
                        source: "footer_newsletter",
                        type: "newsletter"
                      })
                    });
                    if (res.ok) {
                      alert("Successfully joined our newsletter!");
                      setEmail("");
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-white px-3 py-2 placeholder:text-slate-500 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors border-none cursor-pointer shadow-md hover:shadow-blue-600/30 outline-none focus:outline-none ring-0 shrink-0" type="submit">
                    Join
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 font-medium m-0">
            © {new Date().getFullYear()} Coaching Sikar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              All Systems Normal
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
