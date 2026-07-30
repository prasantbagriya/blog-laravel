'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/stories', label: 'Web Stories' },
  { href: '/youtubevideodownload', label: 'YT Downloader' },
  { href: '/playbook/', label: 'Playbook' },
  { href: '/about', label: 'About' },
  { href: '/search', label: '🔍 Search' },
  { href: '/contact', label: 'Contact' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on route change (ESC too)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div ref={menuRef} style={{ display: 'flex', alignItems: 'center' }}>
      {/* Hamburger Button */}
      <button
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px',
          width: '44px',
          height: '44px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          cursor: 'pointer',
          padding: '8px',
          transition: 'background 0.2s',
        }}
      >
        {/* Animated hamburger bars */}
        <span style={{
          display: 'block', width: '20px', height: '2px',
          background: 'var(--foreground)', borderRadius: '2px',
          transition: 'transform 0.25s, opacity 0.25s',
          transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
        }} />
        <span style={{
          display: 'block', width: '20px', height: '2px',
          background: 'var(--foreground)', borderRadius: '2px',
          transition: 'opacity 0.25s',
          opacity: open ? 0 : 1,
        }} />
        <span style={{
          display: 'block', width: '20px', height: '2px',
          background: 'var(--foreground)', borderRadius: '2px',
          transition: 'transform 0.25s, opacity 0.25s',
          transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
        }} />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-label="Navigation menu"
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            height: 'calc(100vh - var(--header-height))',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(12px)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1.5rem',
            animation: 'fadeIn 0.2s ease',
            overflowY: 'auto',
          }}
        >
          <nav aria-label="Mobile Navigation">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'block',
                      padding: '1rem 0',
                      fontSize: '1.375rem',
                      fontWeight: 700,
                      color: 'var(--foreground)',
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--border)',
                      transition: 'color 0.15s',
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
