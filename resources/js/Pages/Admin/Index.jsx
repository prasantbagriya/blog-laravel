'use client';

import { useState, useEffect, useMemo } from 'react';
import { Link, Head } from '@inertiajs/react';
import DeleteButton from './DeleteButton';
import React, { Suspense } from 'react';

const AdminLayout = React.lazy(() => import('../../Layouts/AdminLayout'));

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        controller.abort('timeout');
      }
    }, 15000); // 15-second timeout

    fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/posts', { 
      cache: 'no-store',
      signal: controller.signal
    })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('[Admin] Invalid data received from /api/admin/posts:', data);
          setError('Invalid data format received from the server.');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        console.error('[Admin] Fetch error for /api/admin/posts:', err);
        setError(err.name === 'AbortError' ? 'Request timed out.' : err.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // ==========================================
  // 📈 DATA ANALYSIS & COMPUTED METRICS
  // ==========================================
  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter(p => p.published).length;
    const drafts = total - published;
    
    // Average SEO Score
    const totalSeo = posts.reduce((sum, p) => sum + (p.seoScore || 0), 0);
    const avgSeo = total > 0 ? Math.round(totalSeo / total) : 0;
    
    // Word Count metrics
    const wordCounts = posts.map(p => {
      const text = (p.content || '').replace(/<[^>]+>/g, '');
      return text.split(/\s+/).filter(Boolean).length;
    });
    const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
    const avgWords = total > 0 ? Math.round(totalWords / total) : 0;

    const pillarCount = posts.filter(p => p.isPillarPage).length;

    // E-E-A-T health calculation
    const hasFactChecker = posts.filter(p => p.factCheckedBy).length;
    const hasSources = posts.filter(p => p.sources && p.sources.length > 0).length;
    const hasSocials = posts.filter(p => p.authorSocials?.twitter || p.authorSocials?.linkedin || p.authorSocials?.website).length;
    
    // Weighted E-E-A-T index (0 - 100)
    const eeatScore = total > 0 
      ? Math.round(((hasFactChecker / total) * 0.4 + (hasSources / total) * 0.4 + (hasSocials / total) * 0.2) * 100)
      : 0;

    return {
      total,
      published,
      drafts,
      avgSeo,
      totalWords,
      avgWords,
      pillarCount,
      hasFactChecker,
      hasSources,
      hasSocials,
      eeatScore
    };
  }, [posts]);

  // Search Intent Analysis (Commercial, Informational, Navigational, Transactional)
  const intentAnalysis = useMemo(() => {
    const counts = { informational: 0, transactional: 0, commercial: 0, navigational: 0 };
    posts.forEach(p => {
      const intent = p.searchIntent || 'informational';
      if (counts[intent] !== undefined) counts[intent]++;
    });
    
    const total = posts.length || 1;
    return Object.entries(counts).map(([intent, count]) => ({
      name: intent.charAt(0).toUpperCase() + intent.slice(1),
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }, [posts]);

  // ==========================================
  // 🛡️ SEO & E-E-A-T COMPLIANCE AUDITOR LOGS
  // ==========================================
  const seoAlerts = useMemo(() => {
    const alerts = [];
    
    posts.forEach(p => {
      // 1. Critical: Missing Meta Description
      if (!p.metaDescription || p.metaDescription.trim() === '') {
        alerts.push({
          id: `meta-${p.id}`,
          postTitle: p.title || 'Untitled Post',
          postId: p.id,
          severity: 'critical',
          message: 'Missing Meta Description: Google will auto-generate one, drastically lowering CTR potential.',
          type: 'SEO'
        });
      }
      
      // 2. Critical: Sub-optimal SEO Score
      if (!p.seoScore || p.seoScore < 80) {
        alerts.push({
          id: `score-${p.id}`,
          postTitle: p.title || 'Untitled Post',
          postId: p.id,
          severity: 'critical',
          message: `Low SEO Score (${p.seoScore || 0}%): Under the recommended 80% baseline. High ranking is unlikely.`,
          type: 'SEO'
        });
      }

      // 3. Warning: No cited primary/secondary sources
      if (!p.sources || p.sources.length === 0) {
        alerts.push({
          id: `source-${p.id}`,
          postTitle: p.title || 'Untitled Post',
          postId: p.id,
          severity: 'warning',
          message: 'No External Sources: Lacks references or primary literature link. Harder to rank under E-E-A-T guidelines.',
          type: 'E-E-A-T'
        });
      }

      // 4. Warning: Unverified Fact Check
      if (!p.factCheckedBy || p.factCheckedBy.trim() === '') {
        alerts.push({
          id: `fact-${p.id}`,
          postTitle: p.title || 'Untitled Post',
          postId: p.id,
          severity: 'warning',
          message: 'No Fact-Checker Assigned: Incomplete reviewedBy schema. Missing credibility badge.',
          type: 'E-E-A-T'
        });
      }

      // 5. Info: Staleness or review cycle exceeded
      if (p.nextReviewDate) {
        const isStale = new Date(p.nextReviewDate) < new Date();
        if (isStale) {
          const formattedDate = new Date(p.nextReviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          alerts.push({
            id: `stale-${p.id}`,
            postTitle: p.title || 'Untitled Post',
            postId: p.id,
            severity: 'info',
            message: `Review Overdue: Content review date was scheduled for ${formattedDate}. Updates required.`,
            type: 'Staleness'
          });
        }
      }

      // 6. Warning: Missing Geographic/Language Targeting
      if (!p.targetRegion || !p.targetLanguage) {
        alerts.push({
          id: `geo-${p.id}`,
          postTitle: p.title || 'Untitled Post',
          postId: p.id,
          severity: 'warning',
          message: 'Missing Geographic/Language Targeting: Define targetRegion (e.g., IN) and targetLanguage (e.g., en-IN) to ensure Google GSC registers geographic relevance for AI Overviews.',
          type: 'SEO'
        });
      }
    });

    return alerts.sort((a, b) => {
      const priority = { critical: 0, warning: 1, info: 2 };
      return priority[a.severity] - priority[b.severity];
    });
  }, [posts]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ color: 'var(--muted-foreground)', fontWeight: 600 }}>Analyzing Editorial Database...</div>
        <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { to { transform: rotate(360deg); } }' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem', color: '#ef4444' }}>
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>Failed to Load Data</div>
        <div style={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          style={{ marginTop: '1rem', background: 'var(--primary)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 700 }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Head title="Admin Dashboard" />
      {/* Upper Brand Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a', margin: 0 }}>
          Editorial Control Center
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem', margin: 0 }}>
          Manage content publishing, audit SEO compliance parameters, and review active E-E-A-T metrics.
        </p>
      </div>

      {/* Tab Navigation Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '2rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch', whiteSpace: 'nowrap' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            background: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'dashboard' ? '#fff' : 'var(--muted-foreground)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'dashboard' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
          }}
        >
          📊 Insights & Analytics
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          style={{
            background: activeTab === 'posts' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'posts' ? '#fff' : 'var(--muted-foreground)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'posts' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
          }}
        >
          📌 Manage Posts
        </button>
        <button
          onClick={() => setActiveTab('auditor')}
          style={{
            background: activeTab === 'auditor' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'auditor' ? '#fff' : 'var(--muted-foreground)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            boxShadow: activeTab === 'auditor' ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'
          }}
        >
          🛡️ E-E-A-T & SEO Auditor
          {seoAlerts.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '999px',
              border: '2px solid #f8fafc'
            }}>
              {seoAlerts.length}
            </span>
          )}
        </button>
      </div>

      {/* ============================================================
          TAB 1: INSIGHTS & ANALYTICS
          ============================================================ */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Executive Metrics Overview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Total Content Base</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{stats.total}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', display: 'flex', gap: '8px' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>● {stats.published} Published</span>
                <span>•</span>
                <span style={{ fontWeight: 700 }}>● {stats.drafts} Drafts</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Avg SEO Optimization</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{stats.avgSeo}%</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                Targeting a minimum of <strong style={{ color: '#059669' }}>80%</strong> sitewide standard
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>E-E-A-T Credibility Index</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#7c3aed', lineHeight: 1 }}>{stats.eeatScore}%</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                Weighted trust index based on E-E-A-T factors
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Aggregated Word Count</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{stats.totalWords.toLocaleString()}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                Averaging <strong>{stats.avgWords}</strong> words per article
              </div>
            </div>
          </div>

          {/* Deep Data Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {/* Search Intent Distribution */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🎯 Search Intent Distribution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {intentAnalysis.map(intent => (
                  <div key={intent.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                      <span style={{ color: '#334155' }}>{intent.name}</span>
                      <span style={{ color: 'var(--primary)' }}>{intent.percentage}% <span style={{ fontWeight: 500, color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>({intent.count})</span></span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${intent.percentage}%`, 
                          height: '100%', 
                          background: 'linear-gradient(to right, var(--primary), #4f46e5)',
                          borderRadius: '4px',
                          transition: 'width 0.8s ease'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* E-E-A-T Trust Marker Metrics */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛡️ E-E-A-T Quality Signals
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Fact Checker Marker */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                    <span style={{ color: '#334155' }}>Verified Fact-Checking Rate</span>
                    <span style={{ color: '#059669' }}>
                      {stats.total > 0 ? Math.round((stats.hasFactChecker / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${stats.total > 0 ? (stats.hasFactChecker / stats.total) * 100 : 0}%`, 
                        height: '100%', 
                        background: '#059669',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    {stats.hasFactChecker} out of {stats.total} posts carry a checkedBy editorial signature.
                  </div>
                </div>

                {/* Authority Sources Marker */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                    <span style={{ color: '#334155' }}>Authoritative Source Citation Rate</span>
                    <span style={{ color: '#059669' }}>
                      {stats.total > 0 ? Math.round((stats.hasSources / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${stats.total > 0 ? (stats.hasSources / stats.total) * 100 : 0}%`, 
                        height: '100%', 
                        background: '#059669',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    {stats.hasSources} out of {stats.total} posts cite primary external research databases.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Optimization Advice Box */}
          <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(to right, var(--accent), #ffffff)', borderLeft: '4px solid var(--primary)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '2rem' }}>💡</div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>Strategic Recommendation</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.6, margin: 0 }}>
                Google's 2026 search quality rater guidelines highly prioritize content with verifiable E-E-A-T signals. To boost sitewide ranking authority, focus on increasing the <strong>Verified Fact-Checking Rate</strong> by assigning an editor signature, and linking at least three peer-reviewed or primary data source references to each article.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: MANAGE POSTS (TABLE LIST)
          ============================================================ */}
      {activeTab === 'posts' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, whiteSpace: 'nowrap' }}>Content Catalog ({posts.length} items)</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
              <a href={BASE + "/admin/export-seo"} style={{ background: '#10b981', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Export SEO CSV
              </a>
              <Link href={BASE + "/admin/posts/new"} style={{ background: 'var(--primary)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                + Create New Post
              </Link>
            </div>
          </div>

          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {posts.map((post) => {
                const words = (post.content || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
                return (
                  <div key={post.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Link href={BASE + `/admin/posts/edit/${post.id}`} style={{ fontWeight: 800, color: '#0f172a', textDecoration: 'none', fontSize: '15px' }}>
                        {post.title || 'Untitled Article'}
                      </Link>
                      {post.published ? (
                        <span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>Published</span>
                      ) : (
                        <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>Draft</span>
                      )}
                    </div>
                    
                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <span>📁 {post.category}</span>
                      <span>📅 {post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
                      <span>✍️ {words} words</span>
                      <span style={{ color: (post.seoScore || 0) >= 80 ? '#059669' : '#d97706', fontWeight: 700 }}>📈 {post.seoScore || 0}% SEO</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>{post.author}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '13px' }}>
                        <Link href={BASE + `/admin/posts/edit/${post.id}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Edit</Link>
                        <DeleteButton id={post.id} type="post" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={thStyle}>Title & Category</th>
                      <th style={thStyle}>Author Profile</th>
                      <th style={thStyle}>SEO Health</th>
                      <th style={thStyle}>EEAT Signals</th>
                      <th style={thStyle}>Publish Status</th>
                      <th style={thStyle}>Control Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => {
                      const words = (post.content || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
                      const hasEeat = post.factCheckedBy && post.sources && post.sources.length > 0;
                      return (
                        <tr key={post.id} className="admin-table-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={tdStyle}>
                            <Link href={BASE + `/admin/posts/edit/${post.id}`} style={{ fontWeight: 800, color: '#0f172a', textDecoration: 'none' }}>
                              {post.title || 'Untitled Article'}
                            </Link>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '0.25rem', display: 'flex', gap: '8px' }}>
                              <span>📁 {post.category}</span>
                              <span>•</span>
                              <span>📅 {post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
                              <span>•</span>
                              <span>✍️ {words} words</span>
                            </div>
                          </td>
                          <td style={tdStyle}>
                            <span style={{ fontWeight: 600, color: '#334155' }}>{post.author}</span>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>{post.authorJobTitle}</div>
                          </td>
                          <td style={tdStyle}>
                            <span style={{ 
                              fontWeight: 800, 
                              color: (post.seoScore || 0) >= 80 ? '#059669' : '#d97706' 
                            }}>
                              {post.seoScore || 0}%
                            </span>
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <span 
                                title={post.factCheckedBy ? `Fact Checked by ${post.factCheckedBy}` : 'Unverified Content'}
                                style={{ 
                                  opacity: post.factCheckedBy ? 1 : 0.25, 
                                  cursor: 'help',
                                  fontSize: '14px' 
                                }}
                              >
                                🛡️
                              </span>
                              <span 
                                title={post.sources && post.sources.length > 0 ? `${post.sources.length} authoritative references cited` : 'No references cited'}
                                style={{ 
                                  opacity: post.sources && post.sources.length > 0 ? 1 : 0.25, 
                                  cursor: 'help',
                                  fontSize: '14px' 
                                }}
                              >
                                📚
                              </span>
                              <span 
                                title={post.isPillarPage ? 'High-value pillar page' : 'Regular post'}
                                style={{ 
                                  opacity: post.isPillarPage ? 1 : 0.25, 
                                  cursor: 'help',
                                  fontSize: '14px' 
                                }}
                              >
                                ⭐
                              </span>
                            </div>
                          </td>
                          <td style={tdStyle}>
                            {post.published ? (
                              <span style={{ background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, display: 'inline-block' }}>Published</span>
                            ) : (
                              <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, display: 'inline-block' }}>Draft</span>
                            )}
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '13px' }}>
                              <Link href={BASE + `/admin/posts/edit/${post.id}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Edit</Link>
                              <DeleteButton id={post.id} type="post" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 3: E-E-A-T & SEO AUDITOR ALERTS LOG
          ============================================================ */}
      {activeTab === 'auditor' && (
        <div style={{ animation: 'fadeIn 0.3s ease-out', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>Active Editorial Audits Checklist</h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
              Scan dynamically detects compliance risks for Google 2026 indexing algorithms.
            </span>
          </div>

          {seoAlerts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '3rem' }}>🎉</span>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>100% Compliance Achieved!</h4>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', maxWidth: '400px', margin: 0, lineHeight: 1.6 }}>
                Excellent work! All published posts successfully carry authoritative backlinks, detailed fact-checker reviewedBy schemas, completed meta properties, and optimal search index metadata.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {seoAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderLeft: `5px solid ${
                      alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#f59e0b' : '#3b82f6'
                    }`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    background: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        background: alert.severity === 'critical' ? '#fee2e2' : alert.severity === 'warning' ? '#fef3c7' : '#dbeafe',
                        color: alert.severity === 'critical' ? '#dc2626' : alert.severity === 'warning' ? '#d97706' : '#2563eb',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {alert.severity}
                      </span>
                      <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>{alert.postTitle}</strong>
                    </div>
                    
                    <Link 
                      href={BASE + `/admin/posts/edit/${alert.postId}`}
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        textDecoration: 'none'
                      }}
                    >
                      Optimize Post →
                    </Link>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
                    {alert.message}
                  </p>

                  <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', gap: '10px' }}>
                    <span>Audit Type: <strong>{alert.type}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

AdminPage.layout = page => (
  <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Workspace...</div>}>
    <AdminLayout>{page}</AdminLayout>
  </Suspense>
);

const thStyle = { 
  padding: '16px 24px', 
  textAlign: 'left', 
  fontSize: '11px', 
  color: '#64748b', 
  textTransform: 'uppercase', 
  fontWeight: 800,
  letterSpacing: '0.05em' 
};

const tdStyle = { 
  padding: '16px 24px', 
  fontSize: '14px',
  color: '#475569'
};

