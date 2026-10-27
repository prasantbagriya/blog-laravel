import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Key, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Layers, 
  Activity, 
  Sparkles, 
  Search,
  Check,
  AlertCircle
} from 'lucide-react';

export default function PageSpeedTab({
  pageSpeedData = {},
  defaultUrls = [],
  targetUrl = '',
  onInspectUrl = null,
  onPushIndex = null,
}) {
  const initialAudit = pageSpeedData.recentAudits?.[0] || null;
  const initialUrls = pageSpeedData.defaultUrls || defaultUrls || [];

  const [urlInput, setUrlInput] = useState(targetUrl || initialUrls[0]?.url || 'https://coachingsinsikar.com');
  const [strategy, setStrategy] = useState('mobile');
  const [forceRefresh, setForceRefresh] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(initialAudit);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(pageSpeedData.recentAudits || []);

  useEffect(() => {
    if (targetUrl && targetUrl !== urlInput) {
      setUrlInput(targetUrl);
    }
  }, [targetUrl]);
  
  // Filters & Accordions
  const [expandedOpportunity, setExpandedOpportunity] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const handleRunAudit = async (targetUrl = null, targetStrategy = null, force = null) => {
    const finalUrl = targetUrl || urlInput;
    const finalStrategy = targetStrategy || strategy;
    const finalForce = force !== null ? force : forceRefresh;

    if (!finalUrl) return;

    setAuditing(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/pagespeed/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          url: finalUrl,
          strategy: finalStrategy,
          forceRefresh: finalForce,
        }),
      });

      const data = await res.json();
      if (data.success && data.audit) {
        setAuditResult(data.audit);
        setHistory(prev => [data.audit, ...prev.filter(item => item.id !== data.audit.id)].slice(0, 30));
      } else {
        setError(data.error || 'Failed to complete PageSpeed audit.');
      }
    } catch (err) {
      setError(err.message || 'Network error executing PageSpeed audit.');
    } finally {
      setAuditing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', ring: 'stroke-emerald-500' };
    if (score >= 50) return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800', ring: 'stroke-amber-500' };
    return { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800', ring: 'stroke-rose-500' };
  };

  const getStatusBadge = (status) => {
    if (status === 'good') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          <CheckCircle2 className="w-3 h-3" /> Good
        </span>
      );
    }
    if (status === 'needs_improvement') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          <AlertTriangle className="w-3 h-3" /> Needs Work
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
        <XCircle className="w-3 h-3" /> Poor
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP AUDIT CONTROL PANEL (MATCHING URL INSPECTOR DESIGN) */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Live Google PageSpeed & Core Web Vitals Audit
                </h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Query Google PageSpeed Insights API in real-time to analyze Core Web Vitals (LCP, CLS, INP), Lighthouse scores, and speed diagnostics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Search Bar Matching URL Inspector Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleRunAudit(); }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="url"
              required
              placeholder="https://coachingsinsikar.com/blog/best-neet-coaching-sikar"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={auditing || !urlInput}
            className="group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
          >
            {auditing ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                <span>Simulating Lighthouse...</span>
              </>
            ) : (
              <>
                <span>Audit PageSpeed & CWV</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Toolbar below search: Device Toggle + Bypass Cache + Quick Import URLs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Device Toggle */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/80 shrink-0">
              <button
                type="button"
                onClick={() => setStrategy('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  strategy === 'mobile'
                    ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setStrategy('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  strategy === 'desktop'
                    ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            {/* Bypass Cache Checkbox */}
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Bypass Cache (Force Fresh)</span>
            </label>
          </div>

          {/* Quick Import / Select URLs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-slate-400 font-semibold shrink-0">Import URL:</span>
            {initialUrls.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setUrlInput(item.url); handleRunAudit(item.url); }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-zinc-700 font-medium whitespace-nowrap transition cursor-pointer text-[11px]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* 2. AUDIT RESULTS DISPLAY */}
      {auditResult && (
        <div className="space-y-6">
          {/* Metadata & Actions Bar (Matching URL Inspector Result Header) */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Audited Target URL</div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white break-all flex items-center gap-2">
                  <span>{auditResult.url}</span>
                  <a href={auditResult.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 font-bold uppercase text-[10px]">
                    {auditResult.strategy} Mode
                  </span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{auditResult.tested_at} ({auditResult.tested_at_human})</span>
                  {auditResult.is_cached && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold text-[10px]">
                      Cached Result
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {auditResult.scores?.performance >= 90 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Performance Pass ({auditResult.scores.performance}/100)</span>
                  </span>
                ) : auditResult.scores?.performance >= 50 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Needs Work ({auditResult.scores.performance}/100)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Poor Performance ({auditResult.scores?.performance ?? 0}/100)</span>
                  </span>
                )}

                {onInspectUrl && (
                  <button
                    type="button"
                    onClick={() => onInspectUrl(auditResult.url)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold cursor-pointer transition-colors"
                    title="Inspect Index Coverage in URL Inspector"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Inspect Index Status</span>
                  </button>
                )}

                {onPushIndex && (
                  <button
                    type="button"
                    onClick={() => onPushIndex(auditResult.url)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors"
                    title="Push for Instant Re-Index to Googlebot"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Push to Googlebot</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Scores Cards (0-100) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Performance', score: auditResult.scores.performance, desc: 'Speed & Core Web Vitals' },
              { label: 'Accessibility', score: auditResult.scores.accessibility, desc: 'Usability, Contrast & ARIA' },
              { label: 'Best Practices', score: auditResult.scores.best_practices, desc: 'Security, HTTPS & Standards' },
              { label: 'SEO', score: auditResult.scores.seo, desc: 'Crawlability & Meta Tags' },
            ].map((cat, i) => {
              const color = getScoreColor(cat.score);
              return (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border ${color.border} ${color.bg} shadow-sm flex flex-col items-center text-center relative overflow-hidden`}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl border-4 border-current mb-2 bg-white dark:bg-zinc-900 shadow-sm" style={{ color: cat.score >= 90 ? '#10b981' : cat.score >= 50 ? '#f59e0b' : '#ef4444' }}>
                    {cat.score}
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {cat.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    {cat.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 3. CORE WEB VITALS (CWV) CARDS */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Core Web Vitals & Page Loading Diagnostics
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Direct Google Search mobile ranking signals.
                </p>
              </div>

              {auditResult.crux?.overall_category && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  <span>CrUX Field Assessment:</span>
                  <span className={auditResult.crux.overall_category === 'FAST' ? 'text-emerald-600 font-extrabold' : 'text-amber-600 font-extrabold'}>
                    {auditResult.crux.overall_category}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'lcp', label: 'LCP (Largest Paint)', val: auditResult.core_web_vitals.lcp.display, status: auditResult.core_web_vitals.lcp.status, target: '< 2.5s' },
                { key: 'fcp', label: 'FCP (First Paint)', val: auditResult.core_web_vitals.fcp.display, status: auditResult.core_web_vitals.fcp.status, target: '< 1.8s' },
                { key: 'cls', label: 'CLS (Layout Shift)', val: auditResult.core_web_vitals.cls.display, status: auditResult.core_web_vitals.cls.status, target: '< 0.1' },
                { key: 'tbt', label: 'TBT (Total Blocking)', val: auditResult.core_web_vitals.tbt.display, status: auditResult.core_web_vitals.tbt.status, target: '< 200ms' },
                { key: 'speed_index', label: 'Speed Index', val: auditResult.core_web_vitals.speed_index.display, status: auditResult.core_web_vitals.speed_index.status, target: '< 3.4s' },
                { key: 'ttfb', label: 'TTFB (Server Time)', val: auditResult.core_web_vitals.ttfb.display, status: auditResult.core_web_vitals.ttfb.status, target: '< 800ms' },
              ].map((m) => (
                <div key={m.key} className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">{m.label}</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{m.val}</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                    {getStatusBadge(m.status)}
                    <span className="text-[10px] text-slate-400 font-mono">{m.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. OPPORTUNITIES & OPTIMIZATION RECOMMENDATIONS */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Actionable Opportunities (Potential Savings)
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  High-value code & asset improvements ranked by estimated loading time saved.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold text-xs">
                {auditResult.opportunities?.length || 0} Opportunities Found
              </span>
            </div>

            {auditResult.opportunities && auditResult.opportunities.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {auditResult.opportunities.map((opp, idx) => {
                  const isExpanded = expandedOpportunity === opp.id;
                  return (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                      <div
                        onClick={() => setExpandedOpportunity(isExpanded ? null : opp.id)}
                        className="flex items-center justify-between gap-4 cursor-pointer group"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                              {opp.title}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                              {opp.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {opp.savings_ms > 0 && (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold">
                              Save ~{opp.savings_ms} ms
                            </span>
                          )}
                          {opp.savings_kib > 0 && (
                            <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-mono font-semibold">
                              {opp.savings_kib} KiB
                            </span>
                          )}
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pl-9 text-xs text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-2">
                          <p>{opp.description}</p>
                          {opp.display_value && (
                            <p className="font-semibold text-blue-600 dark:text-blue-400">
                              Impact: {opp.display_value}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-700 dark:text-zinc-300">No Major Bottlenecks Detected!</p>
                <p>All checked Lighthouse performance thresholds are well within Google targets.</p>
              </div>
            )}
          </div>

          {/* 5. DIAGNOSTICS GRID */}
          {auditResult.diagnostics && auditResult.diagnostics.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
                <Layers className="w-4 h-4 text-indigo-500" />
                Technical Environment Diagnostics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {auditResult.diagnostics.map((d, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
                    <div className="font-bold text-slate-800 dark:text-zinc-200">{d.label}</div>
                    <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-extrabold mt-1">{d.display_value}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{d.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. RECENT AUDITS HISTORY */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Audit History & Trend Log
            </h3>
            <span className="text-xs text-slate-400">{history.length} Saved Audits</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Tested Page</th>
                  <th className="py-2.5 px-3">Device</th>
                  <th className="py-2.5 px-3 text-center">Perf</th>
                  <th className="py-2.5 px-3 text-center">SEO</th>
                  <th className="py-2.5 px-3 text-center">a11y</th>
                  <th className="py-2.5 px-3">LCP</th>
                  <th className="py-2.5 px-3">CLS</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {history.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">{item.tested_at}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {item.url}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-bold text-[10px] uppercase">
                        {item.strategy}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold" style={{ color: item.scores.performance >= 90 ? '#10b981' : item.scores.performance >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {item.scores.performance}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold" style={{ color: item.scores.seo >= 90 ? '#10b981' : item.scores.seo >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {item.scores.seo}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold" style={{ color: item.scores.accessibility >= 90 ? '#10b981' : item.scores.accessibility >= 50 ? '#f59e0b' : '#ef4444' }}>
                      {item.scores.accessibility}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{item.core_web_vitals?.lcp?.display || 'N/A'}</td>
                    <td className="py-2.5 px-3 font-mono">{item.core_web_vitals?.cls?.display || '0'}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => { setUrlInput(item.url); setStrategy(item.strategy); setAuditResult(item); }}
                        className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
