import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const { url: pathname } = usePage();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ Handle responsive window sizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false); // Close mobile menu when scaling up to desktop
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const BASE = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
  const menuItems = [
    { label: 'Dashboard', href: BASE + '/admin', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg> },
    { label: 'All Posts', href: BASE + '/admin', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg> },
    { label: 'Users', href: BASE + '/admin/users', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { label: 'Authors', href: BASE + '/admin/authors', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Categories', href: BASE + '/admin/categories', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
    { label: 'Pages', href: BASE + '/admin/pages', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg> },
    { label: 'Add New', href: BASE + '/admin/posts/new', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
    { label: 'Web Stories', href: BASE + '/admin/stories', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
    { label: 'Community Posts', href: BASE + '/admin/community-posts', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { label: 'Communities', href: BASE + '/admin/communities', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
    { label: 'Businesses', href: BASE + '/admin/businesses', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg> },
    { label: 'Media Library', href: BASE + '/admin/media', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
    { label: 'SEO Audit', href: BASE + '/admin/seo-audit', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { label: 'Home Slider', href: BASE + '/admin/slider', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg> },
    { label: 'Contact Messages', href: BASE + '/admin/contact-messages', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { label: 'Newsletters', href: BASE + '/admin/newsletters', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
    { label: 'Settings', href: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  return (
    <>
      <style>{`
        .admin-sidebar-link {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .admin-sidebar-link:hover {
          background-color: #f1f5f9;
          transform: translateX(4px);
        }
        .admin-sidebar-link.active:hover {
          background-color: #eff6ff;
          transform: translateX(4px);
        }
      `}</style>
      <style>{`
        /* Global Mobile Responsiveness for Admin Panel */
        @media (max-width: 768px) {
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          
          /* Prevent main container overflow */
          body {
            overflow-x: hidden !important;
            width: 100% !important;
          }
          main {
            padding: 12px !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }

          /* Keep tables from breaking by letting them use their natural min-width */
          div > table {
            /* no min-width override, let inline minWidth handle it */
          }
          
          .overflow-x-auto, 
          div[style*="overflowX"], 
          div[style*="overflow-x"] {
            width: 100% !important;
            max-width: calc(100vw - 24px) !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
          }

          /* Ensure buttons remain legible without breaking words into single letters */
          button, a[style*="padding"] {
            white-space: nowrap !important;
            flex-shrink: 0;
          }
          
          /* Fix header and row layouts */
          .flex-row-mobile-column {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          /* Reduce font size for headers */
          h1 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
      <div style={{ 
        display: 'flex', 
        background: '#f8fafc', 
      color: '#0f172a', 
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      position: 'relative',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* ✅ Mobile Overlay / Backdrop */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 190,
            animation: 'fadeIn 0.2s ease'
          }}
        />
      )}

      {/* ✅ Modern Responsive SaaS Sidebar */}
      <aside style={{ 
        width: isCollapsed && !isMobile ? '80px' : '260px', 
        background: '#ffffff', 
        borderRight: '1px solid #e2e8f0', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'fixed', 
        top: 0, 
        bottom: 0, 
        left: 0,
        zIndex: 200,
        transform: isMobile 
          ? (isSidebarOpen ? 'translateX(0)' : 'translateX(-260px)') 
          : 'translateX(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ height: '72px', padding: isCollapsed && !isMobile ? '0' : '0 24px', display: 'flex', alignItems: 'center', justifyContent: isCollapsed && !isMobile ? 'center' : 'space-between', borderBottom: '1px solid #f1f5f9', transition: 'padding 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>
              C
            </div>
            {!(isCollapsed && !isMobile) && <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>Blog Admin</span>}
          </div>
          {isMobile && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>
          )}
        </div>
        
        <nav style={{ padding: isCollapsed && !isMobile ? '24px 8px' : '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
          {!(isCollapsed && !isMobile) && <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>Content</div>}
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                  gap: '12px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#2563eb' : '#475569',
                  textDecoration: 'none',
                  background: isActive ? '#eff6ff' : 'transparent',
                  borderRadius: '8px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', opacity: isActive ? 1 : 0.7 }} title={isCollapsed ? item.label : undefined}>{item.icon}</span>
                {!(isCollapsed && !isMobile) && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Sign Out Button */}
        <div style={{ padding: isCollapsed && !isMobile ? '12px 8px' : '12px 16px', borderTop: '1px solid #f1f5f9' }}>
          <Link
            href={route('logout')}
            method="post"
            as="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#dc2626',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#fecaca'; }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.85 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            {!(isCollapsed && !isMobile) && <span style={{ whiteSpace: 'nowrap' }}>Sign Out</span>}
          </Link>
        </div>

        <div style={{ padding: isCollapsed && !isMobile ? '24px 0' : '24px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#475569', flexShrink: 0 }}>
            A
          </div>
          {!(isCollapsed && !isMobile) && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>Admin User</div>
              <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>editorial@blog.com</div>
            </div>
          )}
        </div>
      </aside>

      {/* ✅ Responsive Main Content Area */}
      <div style={{ 
        flex: 1, 
        marginLeft: isMobile ? 0 : (isCollapsed ? '80px' : '260px'), 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        width: isMobile ? '100%' : `calc(100% - ${isCollapsed ? '80px' : '260px'})`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Modern Header */}
        <header style={{ 
          height: '72px', 
          minHeight: '72px', 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: isMobile ? '0 16px' : '0 32px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 100 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* ✅ Hamburger Toggle Menu on Mobile */}
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar menu"
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#334155'
                }}
              >
                ☰
              </button>
            )}
            
            {/* ✅ Desktop Collapse Toggle */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle sidebar"
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: '#334155',
                  marginRight: '8px'
                }}
              >
                {isCollapsed ? '⇥' : '⇤'}
              </button>
            )}
            
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '120px' : 'none' }}>
              {(pathname || '').includes('/new') ? 'Create' : (pathname || '').includes('/stories') ? 'Web Stories' : 'Dashboard'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: isMobile ? '8px' : '16px', alignItems: 'center' }}>
            {!isMobile && (
              <>
                <a href={(typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + "/"} target="_blank" style={{ fontSize: '13px', fontWeight: 600, color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ↗ View Live Site
                </a>
                <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>
              </>
            )}
            <Link href={BASE + "/admin/posts/new"} style={{ background: '#2563eb', color: '#fff', padding: isMobile ? '6px 12px' : '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)', whiteSpace: 'nowrap' }}>
              + New Post
            </Link>
          </div>
        </header>

        {/* ✅ Dashboard Content Container with Proper Spacing/Padding */}
        <main style={{ padding: isMobile ? '0.5rem' : '1.5rem', width: '100%', flex: 1, overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
    </>
  );
}

