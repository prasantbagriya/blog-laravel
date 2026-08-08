// @ts-nocheck
"use client"

import React, { useState } from "react"
import { usePage } from "@inertiajs/react"
import { Zap } from "lucide-react"
import { Instagram, Twitter, Linkedin, Youtube, Facebook } from "./BrandIcons"

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
    <footer className="relative bg-black border-t border-white/5 pt-16 pb-10 overflow-hidden mt-12 w-full">
      <div className="absolute top-0 left-1/4 w-1/2 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          <div className="md:col-span-2 lg:col-span-2 space-y-8">
            <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => handleNavClick('landing')}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                <img src={(typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + "/logo.png"} alt="Coaching Sikar Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">Coaching Sikar</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Revolutionizing customer engagement with smart AI-driven WhatsApp automation. Join 10,000+ businesses scaling faster with Coaching Sikar.
            </p>

            <div className="flex gap-4">
              {[
                { Icon: Twitter, url: 'https://x.com/prasantbagriya' },
                { Icon: Facebook, url: 'https://www.facebook.com/blog/' },
                { Icon: Instagram, url: 'https://www.instagram.com/prasantbagriya/' },
                { Icon: Linkedin, url: 'https://www.linkedin.com/company/blog/' },
                { Icon: Youtube, url: 'https://www.youtube.com/@BlogOffical' }
              ].map(({ Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit our ${url.split('.')[1] || 'social'} page`} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group">
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => {
            return (
              <div key={section.title} className="md:col-span-1 lg:col-span-1">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{section.title}</h4>
                <ul className="space-y-4 m-0 p-0" style={{ listStyle: 'none' }}>
                  {section.links.map((link) => {
                    return (
                      <li key={link.label} className="m-0 p-0" style={{ display: 'flex' }}>
                        <button
                          onClick={() => handleNavClick(link.page)}
                          className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all text-left bg-transparent border-none p-0 cursor-pointer"
                        >
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
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Stay Updated</h4>
            <div className="space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed m-0">
                Get the latest AI tips and product updates delivered to your inbox.
              </p>
              <form
                className="relative group m-0"
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
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="absolute right-2 top-2 bottom-2 bg-white text-black px-4 rounded-lg font-bold text-[10px] uppercase hover:bg-gray-100 transition-colors border-none cursor-pointer" type="submit">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500 font-medium m-0">
            © {new Date().getFullYear()} Blog Name. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Service Status: Operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
