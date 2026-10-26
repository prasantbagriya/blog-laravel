import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Search, Globe, Send, Key, Lock, Link as LinkIcon, Terminal, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, FileText, BarChart3, Zap, Settings, Sparkles, Smartphone, TrendingUp, Database, Target, Trash2, ExternalLink, Check, Clock, Copy, Info, Gauge } from 'lucide-react';
import PageSpeedTab from './PageSpeedTab';

export default function SearchConsoleIndex({
  settings: initialSettings,
  localSitemaps = [],
  initialSitemaps = [],
  cachedQueries = [],
  recentLogs = [],
  callbackSuccess = false,
  callbackError = null,
  pageSpeedData = {},
  initialTab = 'performance',
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'performance');
  const [settings, setSettings] = useState(initialSettings || {});
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dateRange, setDateRange] = useState(28);
  const [searchType, setSearchType] = useState('web');

  // URL Inspector State
  const [inspectUrlInput, setInspectUrlInput] = useState('');
  const [inspecting, setInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [inspectError, setInspectError] = useState(null);

  // Instant Indexing State
  const [indexUrlInput, setIndexUrlInput] = useState('');
  const [indexAction, setIndexAction] = useState('URL_UPDATED');
  const [indexing, setIndexing] = useState(false);
  const [indexLogs, setIndexLogs] = useState(recentLogs || []);
  const [indexMessage, setIndexMessage] = useState(null);
  const [testingIndexing, setTestingIndexing] = useState(false);
  const [testIndexingResult, setTestIndexingResult] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [loadingIndexLogs, setLoadingIndexLogs] = useState(false);

  // Sitemaps State
  const [sitemaps, setSitemaps] = useState(initialSitemaps || []);
  const [loadingSitemaps, setLoadingSitemaps] = useState(false);
  const [submittingSitemap, setSubmittingSitemap] = useState(false);
  const [deletingSitemapPath, setDeletingSitemapPath] = useState(null);
  const [sitemapMessage, setSitemapMessage] = useState(null);
  const [newSitemapPath, setNewSitemapPath] = useState('');

  // Opportunities State
  const [opportunities, setOpportunities] = useState(null);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);

  // Settings Form State
  const [clientId, setClientId] = useState(settings.client_id || '');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState(settings.redirect_uri || '');
  const [propertyId, setPropertyId] = useState(settings.property_id || 'https://coachingsinsikar.com/');
  const [manualCode, setManualCode] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(null);
  const [settingsError, setSettingsError] = useState(null);

  // Auto-Index Toggles
  const [autoIndexPosts, setAutoIndexPosts] = useState(settings.auto_index_posts ?? true);
  const [autoIndexBusinesses, setAutoIndexBusinesses] = useState(settings.auto_index_businesses ?? true);

  // Filter & Search states
  const [queryFilter, setQueryFilter] = useState('');
  const [pageFilter, setPageFilter] = useState('');

  const csrfHeaders = () => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return token ? { 'X-CSRF-TOKEN': token } : {};
  };

  // Fetch Live Analytics
  const fetchAnalytics = async (days = dateRange, type = searchType) => {
    if (!settings.is_connected) return;
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`/api/admin/gsc/analytics?days=${days}&type=${type}`);
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to load GSC Analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch Sitemaps
  const fetchSitemaps = async () => {
    if (!settings.is_connected) return;
    setLoadingSitemaps(true);
    try {
      const res = await fetch('/api/admin/gsc/sitemaps');
      const data = await res.json();
      if (data.success) {
        setSitemaps(data.sitemaps || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSitemaps(false);
    }
  };

  // Fetch Opportunities
  const fetchOpportunities = async () => {
    setLoadingOpportunities(true);
    try {
      const res = await fetch('/api/admin/gsc/opportunities');
      const data = await res.json();
      if (data.success) {
        setOpportunities(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOpportunities(false);
    }
  };

  // Date Formatter Helper
  const formatSitemapDate = (dateStr) => {
    if (!dateStr) return 'Pending / Never';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    if (settings.is_connected) {
      fetchAnalytics(dateRange, searchType);
      fetchSitemaps();
      fetchOpportunities();
    }
  }, [settings.is_connected]);

  useEffect(() => {
    if (activeTab === 'sitemaps' && settings.is_connected) {
      fetchSitemaps();
    }
  }, [activeTab]);

  // Handle URL Inspection
  const handleInspectUrl = async (e) => {
    e?.preventDefault();
    if (!inspectUrlInput) return;
    setInspecting(true);
    setInspectError(null);
    setInspectionResult(null);

    try {
      const res = await fetch('/api/admin/gsc/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ url: inspectUrlInput }),
      });
      const data = await res.json();
      if (data.success) {
        setInspectionResult(data.inspection?.inspectionResult || null);
      } else {
        setInspectError(data.error || 'Inspection failed.');
      }
    } catch (err) {
      setInspectError(err.message);
    } finally {
      setInspecting(false);
    }
  };

  // Copy helper
  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard?.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Test Indexing API connectivity & permissions
  const handleTestIndexing = async () => {
    setTestingIndexing(true);
    setTestIndexingResult(null);
    try {
      const res = await fetch('/api/admin/gsc/test-indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
      });
      const data = await res.json();
      setTestIndexingResult(data);
    } catch (err) {
      setTestIndexingResult({ success: false, error: err.message });
    } finally {
      setTestingIndexing(false);
    }
  };

  // Refresh Indexing Logs
  const fetchIndexingLogs = async () => {
    setLoadingIndexLogs(true);
    try {
      const logsRes = await fetch('/api/admin/gsc/indexing-logs');
      const logsData = await logsRes.json();
      if (logsData.success) {
        setIndexLogs(logsData.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIndexLogs(false);
    }
  };

  // Handle Instant Indexing
  const handlePublishIndex = async (e) => {
    e?.preventDefault();
    if (!indexUrlInput) return;
    setIndexing(true);
    setIndexMessage(null);

    const urls = indexUrlInput.split('\n').map(u => u.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/admin/gsc/index-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ urls, action: indexAction }),
      });
      const data = await res.json();
      if (data.success) {
        const results = data.results || [];
        const failedItems = results.filter(r => !r.success || r.status === 'failed' || r.http_code === 403);

        if (failedItems.length > 0) {
          const firstMsg = failedItems[0].message || 'Some URLs failed ownership verification.';
          setIndexMessage({
            type: 'error',
            text: `${failedItems.length} of ${urls.length} URL(s) failed. Google response: ${firstMsg}`,
          });
        } else {
          setIndexMessage({
            type: 'success',
            text: `Successfully submitted ${urls.length} URL(s) to Googlebot!`,
          });
          setIndexUrlInput('');
        }
        fetchIndexingLogs();
      } else {
        setIndexMessage({ type: 'error', text: data.error || 'Failed to publish URLs.' });
      }
    } catch (err) {
      setIndexMessage({ type: 'error', text: err.message });
    } finally {
      setIndexing(false);
    }
  };

  // Handle Submit Sitemap
  const handleSubmitSitemap = async (path) => {
    const targetPath = path || newSitemapPath;
    if (!targetPath) return;
    setSubmittingSitemap(true);
    setSitemapMessage(null);

    try {
      const res = await fetch('/api/admin/gsc/sitemaps/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ feedpath: targetPath }),
      });
      const data = await res.json();
      if (data.success) {
        setSitemapMessage({ type: 'success', text: data.message || `Sitemap ${targetPath} submitted successfully!` });
        if (!path) setNewSitemapPath('');
        fetchSitemaps();
      } else {
        setSitemapMessage({ type: 'error', text: data.error || 'Failed to submit sitemap.' });
      }
    } catch (err) {
      setSitemapMessage({ type: 'error', text: err.message });
    } finally {
      setSubmittingSitemap(false);
    }
  };

  // Handle Delete Sitemap from GSC
  const handleDeleteSitemap = async (feedpath) => {
    if (!confirm(`Are you sure you want to remove "${feedpath}" from Google Search Console?`)) {
      return;
    }
    setDeletingSitemapPath(feedpath);
    setSitemapMessage(null);
    try {
      const res = await fetch('/api/admin/gsc/sitemaps/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ feedpath }),
      });
      const data = await res.json();
      if (data.success) {
        setSitemaps((prev) => prev.filter((s) => s.path !== feedpath));
        setSitemapMessage({ type: 'success', text: data.message || `Sitemap ${feedpath} removed from Search Console.` });
      } else {
        setSitemapMessage({ type: 'error', text: data.error || 'Failed to delete sitemap.' });
      }
    } catch (err) {
      setSitemapMessage({ type: 'error', text: err.message });
    } finally {
      setDeletingSitemapPath(null);
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(null);
    setSettingsError(null);

    const formData = new FormData();
    if (clientId) formData.append('client_id', clientId);
    if (clientSecret) formData.append('client_secret', clientSecret);
    if (redirectUri) formData.append('redirect_uri', redirectUri);
    if (propertyId) formData.append('property_id', propertyId);
    formData.append('auto_index_posts', autoIndexPosts ? '1' : '0');
    formData.append('auto_index_businesses', autoIndexBusinesses ? '1' : '0');

    const fileInput = document.getElementById('gsc_credentials_file');
    if (fileInput?.files?.[0]) {
      formData.append('credentials_file', fileInput.files[0]);
    }

    try {
      const res = await fetch('/api/admin/gsc/settings', {
        method: 'POST',
        headers: { ...csrfHeaders() },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSettingsSuccess('Settings successfully updated!');
      } else {
        setSettingsError(data.error || 'Failed to save settings.');
      }
    } catch (err) {
      setSettingsError(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // Connect via pasted code
  const handleConnectWithCode = async (e) => {
    e.preventDefault();
    if (!manualCode) return;
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/gsc/connect-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ code: manualCode, redirect_uri: redirectUri }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Connected successfully to Google Search Console!');
        window.location.reload();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Search Console?')) return;
    try {
      const res = await fetch('/api/admin/gsc/disconnect', {
        method: 'POST',
        headers: { ...csrfHeaders() },
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered queries
  const filteredQueries = useMemo(() => {
    const list = analyticsData?.query_rows || cachedQueries || [];
    if (!queryFilter) return list;
    return list.filter(q => (q.keys?.[0] || q.query || '').toLowerCase().includes(queryFilter.toLowerCase()));
  }, [analyticsData, cachedQueries, queryFilter]);

  // Filtered pages
  const filteredPages = useMemo(() => {
    const list = analyticsData?.page_rows || [];
    if (!pageFilter) return list;
    return list.filter(p => (p.keys?.[0] || p.page || '').toLowerCase().includes(pageFilter.toLowerCase()));
  }, [analyticsData, pageFilter]);

  return (
    <AdminLayout>
      <Head title="Google Search Console Hub | Admin" />

      {/* Top Banner & Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Google Search Console Hub
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Live search analytics, keyword rankings, URL inspection, and instant indexing.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {settings.is_connected ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected: {settings.property_id}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Not Connected
              </span>
            )}

            {settings.is_connected ? (
              <button
                onClick={() => fetchAnalytics()}
                disabled={loadingAnalytics}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <svg className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                Sync GSC
              </button>
            ) : (
              <a
                href="/admin/gsc/auth"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer no-underline"
              >
                Connect with Google
              </a>
            )}
          </div>
        </div>

        {/* Callback Alert Messages */}
        {callbackSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Google Search Console connected successfully! Live data is now active.</span>
            </div>
            <button onClick={() => router.visit('/admin/google-search')} className="text-xs underline cursor-pointer shrink-0">Dismiss</button>
          </div>
        )}
        {callbackError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Connection Error: {callbackError}</span>
            </div>
            <button onClick={() => router.visit('/admin/google-search')} className="text-xs underline cursor-pointer shrink-0">Dismiss</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-slate-200 dark:border-zinc-800">
          {[
            { id: 'performance', label: 'Performance', icon: BarChart3, desc: 'Clicks & Rankings' },
            { id: 'inspector', label: 'URL Inspector', icon: Search, desc: 'Live Index Diagnostics' },
            { id: 'indexing', label: 'Instant Indexing', icon: Zap, desc: 'Push to Googlebot' },
            { id: 'pagespeed', label: 'PageSpeed & CWV', icon: Gauge, desc: 'Core Web Vitals & Audits' },
            { id: 'sitemaps', label: 'Sitemaps', icon: Globe, desc: 'Crawl & Submission' },
            { id: 'opportunities', label: 'Opportunities', icon: Sparkles, desc: 'High Impact Keywords' },
            { id: 'settings', label: 'Settings', icon: Settings, desc: 'API & Auth Setup' },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PERFORMANCE (SEARCH ANALYTICS) */}
      {/* ========================================================= */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-zinc-400">Date Range:</span>
              {[
                { label: '7D', days: 7 },
                { label: '28D', days: 28 },
                { label: '3M', days: 90 },
                { label: '6M', days: 180 },
              ].map(r => (
                <button
                  key={r.days}
                  onClick={() => { setDateRange(r.days); fetchAnalytics(r.days, searchType); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${dateRange === r.days ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-zinc-400">Search Type:</span>
              {['web', 'image', 'video', 'news'].map(t => (
                <button
                  key={t}
                  onClick={() => { setSearchType(t); fetchAnalytics(dateRange, t); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer transition ${searchType === t ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Total Clicks</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {(analyticsData?.totals?.clicks ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-medium">Organic visitors from Google Search</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Total Impressions</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400">
                {(analyticsData?.totals?.impressions ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-medium">Times your links appeared in search</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Average CTR</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {analyticsData?.totals?.ctr ?? 0}%
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-medium">Click-through rate of search results</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1">Average Position</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {analyticsData?.totals?.position ?? 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-2 font-medium">Average ranking on Google SERP</div>
            </div>
          </div>

          {/* Tables: Queries & Pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Search Queries */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <span>Top Search Keywords</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                    {filteredQueries.length}
                  </span>
                </h3>
                <div className="relative group w-44 sm:w-56">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search keywords..."
                    value={queryFilter}
                    onChange={(e) => setQueryFilter(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[420px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700">
                    <tr>
                      <th className="p-3">Query</th>
                      <th className="p-3 text-right">Clicks</th>
                      <th className="p-3 text-right">Impressions</th>
                      <th className="p-3 text-right">CTR</th>
                      <th className="p-3 text-right">Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {filteredQueries.map((row, idx) => {
                      const qName = row.keys?.[0] || row.query || 'Unknown';
                      return (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate" title={qName}>
                            {qName}
                          </td>
                          <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">{row.clicks?.toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-600 dark:text-zinc-300">{row.impressions?.toLocaleString()}</td>
                          <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">{((row.ctr || 0) * 100).toFixed(1)}%</td>
                          <td className="p-3 text-right font-bold text-slate-700 dark:text-zinc-300">{(row.position || 0).toFixed(1)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Landing Pages */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <span>Top Landing Pages</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                    {filteredPages.length}
                  </span>
                </h3>
                <div className="relative group w-44 sm:w-56">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search pages..."
                    value={pageFilter}
                    onChange={(e) => setPageFilter(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[420px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700">
                    <tr>
                      <th className="p-3">Page URL</th>
                      <th className="p-3 text-right">Clicks</th>
                      <th className="p-3 text-right">Impr.</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {filteredPages.map((row, idx) => {
                      const pUrl = row.keys?.[0] || row.page || '';
                      const displayPath = pUrl.replace(/^https?:\/\/[^\/]+/, '');
                      return (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-[220px] truncate" title={pUrl}>
                            <a href={pUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">
                              {displayPath || '/'}
                            </a>
                          </td>
                          <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">{row.clicks?.toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-600 dark:text-zinc-300">{row.impressions?.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => { setInspectUrlInput(pUrl); setActiveTab('inspector'); }}
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-zinc-300 hover:text-blue-600 text-[11px] font-bold cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: URL INSPECTOR */}
      {/* ========================================================= */}
      {activeTab === 'inspector' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">Live Googlebot URL Inspection</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Query Google Search Console's URL Inspection API in real-time to check index coverage, crawl date, mobile friendliness, and Schema markup.
            </p>

            <form onSubmit={handleInspectUrl} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://coachingsinsikar.com/blog/best-neet-coaching-sikar"
                  value={inspectUrlInput}
                  onChange={(e) => setInspectUrlInput(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={inspecting}
                className="group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
              >
                {inspecting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                    <span>Inspecting...</span>
                  </>
                ) : (
                  <>
                    <span>Inspect Live URL</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {inspectError && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{inspectError}</span>
              </div>
            )}
          </div>

          {/* Inspection Result Details Card */}
          {inspectionResult && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Inspected Target</div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white break-all">
                    {inspectionResult.inspectionUrl}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {inspectionResult.indexStatusResult?.verdict === 'PASS' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Indexed (Pass)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{inspectionResult.indexStatusResult?.verdict || 'Not Indexed'}</span>
                    </span>
                  )}

                  <button
                    onClick={() => { setIndexUrlInput(inspectionResult.inspectionUrl); setActiveTab('indexing'); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Push for Instant Re-Index</span>
                  </button>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-2 border border-slate-200 dark:border-zinc-700">
                  <div className="text-xs font-bold text-slate-500 uppercase">Coverage State</div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {inspectionResult.indexStatusResult?.coverageState || 'Unknown'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Robots: {inspectionResult.indexStatusResult?.robotsTxtState || 'Allowed'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-2 border border-slate-200 dark:border-zinc-700">
                  <div className="text-xs font-bold text-slate-500 uppercase">Googlebot Crawl</div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {inspectionResult.indexStatusResult?.crawledAs || 'Googlebot Smartphone'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Last Crawl: {inspectionResult.indexStatusResult?.lastCrawlTime ? new Date(inspectionResult.indexStatusResult.lastCrawlTime).toLocaleString() : 'N/A'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-2 border border-slate-200 dark:border-zinc-700">
                  <div className="text-xs font-bold text-slate-500 uppercase">Mobile Usability</div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {inspectionResult.mobileUsabilityResult?.verdict === 'PASS' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                        <span>Mobile Friendly (Pass)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Needs Attention</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    Page Fetch: {inspectionResult.indexStatusResult?.pageFetchState || 'Successful'}
                  </div>
                </div>
              </div>

              {/* Rich Results & Schemas */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Detected Schema Rich Snippets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {inspectionResult.richResultsResult?.detectedItems?.length > 0 ? (
                    inspectionResult.richResultsResult.detectedItems.map((schema, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{schema.name}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Standard Article / Breadcrumb markup active</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: INSTANT INDEXING */}
      {/* ========================================================= */}
      {activeTab === 'indexing' && (
        <div className="space-y-6">
          {/* Indexing API Status & Diagnostics Banner */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Google Instant Indexing API (Fast-Track Push)
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    settings.auth_mode === 'service_account' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300' 
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                  }`}>
                    {settings.auth_mode === 'service_account' ? 'Service Account' : 'OAuth 2.0'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
                  Instruct Googlebot to immediately crawl new or modified URLs within minutes using Google's official Indexing API v3.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTestIndexing}
                disabled={testingIndexing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold transition shadow-sm cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingIndexing ? 'animate-spin text-blue-600' : ''}`} />
                <span>{testingIndexing ? 'Testing Google Connection...' : 'Test Indexing Connection'}</span>
              </button>
            </div>

            {/* Test Connection Results Alert */}
            {testIndexingResult && (
              <div className={`p-4 rounded-xl text-xs font-medium border ${
                testIndexingResult.success 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}>
                <div className="flex items-start gap-2.5">
                  {testIndexingResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 flex-1">
                    <p className="font-bold text-sm">
                      {testIndexingResult.success ? 'Google Indexing API Active & Ready' : testIndexingResult.error || 'Indexing API Test Failed'}
                    </p>
                    {testIndexingResult.solution && (
                      <p className="text-xs">{testIndexingResult.solution}</p>
                    )}
                    {testIndexingResult.link && (
                      <div className="mt-2">
                        <a
                          href={testIndexingResult.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs no-underline shadow-sm"
                        >
                          <span>Open Required Google Page</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                    {testIndexingResult.raw && (
                      <p className="font-mono text-[11px] opacity-80 pt-1">
                        Google API response: {testIndexingResult.raw}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Service Account Ownership Guidance */}
            {settings.auth_mode === 'service_account' && settings.service_account_email && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="font-bold">Service Account Email:</span>
                    <code className="px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-700 font-mono text-[11px] select-all">
                      {settings.service_account_email}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(settings.service_account_email)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-200/70 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold text-[11px] transition cursor-pointer self-start sm:self-auto"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                  </button>
                </div>

                <div className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90 pt-1 space-y-1">
                  <p>
                    <strong>Why you see "403 failed":</strong> Google Indexing API strictly requires that this Service Account email is added as an <strong>Owner</strong> in Google Search Console. Full or Restricted user permissions are not enough and will cause a 403 error.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href={`https://search.google.com/search-console/users?resource_id=${encodeURIComponent(settings.property_id || 'https://coachingsinsikar.com/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold underline hover:text-amber-950 dark:hover:text-amber-100"
                    >
                      <span>1. Add as Owner in Search Console (Settings &gt; Users)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href="https://console.cloud.google.com/apis/library/indexing.googleapis.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold underline hover:text-amber-950 dark:hover:text-amber-100"
                    >
                      <span>2. Enable Web Search Indexing API in Cloud Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Submission Form */}
            <form onSubmit={handlePublishIndex} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1">
                  Target URLs (one per line for bulk push):
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="https://coachingsinsikar.com/blog/best-neet-coachings-in-sikar&#10;https://coachingsinsikar.com/business/matrix-academy"
                  value={indexUrlInput}
                  onChange={(e) => setIndexUrlInput(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-transparent outline-none bg-slate-100 dark:bg-zinc-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 font-mono text-xs"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  URLs will automatically be canonicalized to https://coachingsinsikar.com/... to prevent protocol mismatches.
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-600 dark:text-zinc-400">Action Type:</label>
                  <select
                    value={indexAction}
                    onChange={(e) => setIndexAction(e.target.value)}
                    className="text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-bold outline-none cursor-pointer"
                  >
                    <option value="URL_UPDATED">URL_UPDATED (Publish / Update)</option>
                    <option value="URL_DELETED">URL_DELETED (Remove from Google)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={indexing}
                  className="group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {indexing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                      <span>Pinging Google...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Push to Google Index Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {indexMessage && (
              <div className={`mt-4 p-4 rounded-xl text-xs font-semibold ${indexMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'}`}>
                {indexMessage.text}
              </div>
            )}
          </div>

          {/* Submission Audit Log */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Indexing Submission Audit Logs</h3>
                <span className="text-xs text-slate-500 font-medium">Standard Google quota: 200 URLs/day</span>
              </div>
              <button
                type="button"
                onClick={fetchIndexingLogs}
                disabled={loadingIndexLogs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingIndexLogs ? 'animate-spin text-blue-500' : ''}`} />
                <span>{loadingIndexLogs ? 'Refreshing...' : 'Refresh Logs'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase font-bold">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Submitted URL & Diagnosis</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Triggered By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {indexLogs.length > 0 ? (
                    indexLogs.map((log) => {
                      const is403 = Number(log.http_code) === 403;
                      const isSuccess = log.status === 'success';

                      return (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                          <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap align-top">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="p-3 align-top max-w-[420px]">
                            <div className="font-semibold text-slate-900 dark:text-white font-mono text-xs truncate" title={log.url}>
                              {log.url}
                            </div>
                            {log.response_message && (
                              <div className={`mt-1.5 p-2 rounded-lg text-[11px] leading-relaxed ${
                                isSuccess 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60' 
                                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                              }`}>
                                <div className="font-medium">{log.response_message}</div>
                                {is403 && (
                                  <div className="mt-1.5 flex flex-wrap gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-800/40">
                                    <a
                                      href={`https://search.google.com/search-console/users?resource_id=${encodeURIComponent(settings.property_id || 'https://coachingsinsikar.com/')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 font-bold underline text-rose-700 dark:text-rose-300 hover:text-rose-900"
                                    >
                                      <span>Fix: Add as Owner in Search Console</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <a
                                      href="https://console.cloud.google.com/apis/library/indexing.googleapis.com"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 font-bold underline text-rose-700 dark:text-rose-300 hover:text-rose-900"
                                    >
                                      <span>Enable Indexing API</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px] whitespace-nowrap align-top">
                            {log.action}
                          </td>
                          <td className="p-3 whitespace-nowrap align-top">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 ${
                              isSuccess 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}>
                              {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              <span>{log.http_code} {log.status}</span>
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 capitalize whitespace-nowrap align-top">
                            {log.triggered_by.replace(/_/g, ' ')}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">No indexing submissions recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: GOOGLE PAGESPEED INSIGHTS & CORE WEB VITALS */}
      {/* ========================================================= */}
      {activeTab === 'pagespeed' && (
        <PageSpeedTab
          pageSpeedData={pageSpeedData}
          defaultUrls={pageSpeedData.defaultUrls || []}
        />
      )}

      {/* ========================================================= */}
      {/* TAB 4: SITEMAPS */}
      {/* ========================================================= */}
      {activeTab === 'sitemaps' && (
        <div className="space-y-6">
          {/* Submit Sitemap Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">Google Sitemaps Management</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              View registered sitemaps, verify Googlebot download status, and submit newly generated sitemap indices directly to Google Search Console.
            </p>

            {sitemapMessage && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  sitemapMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}
              >
                {sitemapMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                )}
                <span>{sitemapMessage.text}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="https://coachingsinsikar.com/sitemap.xml"
                  value={newSitemapPath}
                  onChange={(e) => setNewSitemapPath(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                />
              </div>
              <button
                onClick={() => handleSubmitSitemap()}
                disabled={submittingSitemap || !newSitemapPath}
                className="group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
              >
                <span>{submittingSitemap ? 'Submitting...' : 'Submit Sitemap'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Real-time Google Submitted Sitemaps Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Submitted Sitemaps in Google</h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                  {sitemaps.length}
                </span>
              </div>
              <button
                onClick={fetchSitemaps}
                disabled={loadingSitemaps || !settings.is_connected}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold transition disabled:opacity-50 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSitemaps ? 'animate-spin text-blue-500' : ''}`} />
                <span>{loadingSitemaps ? 'Refreshing...' : 'Refresh Sitemaps'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              {loadingSitemaps && sitemaps.length === 0 ? (
                <div className="p-12 text-center text-slate-500 dark:text-zinc-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                  <p className="text-xs font-medium">Fetching registered sitemaps from Google Search Console...</p>
                </div>
              ) : sitemaps.length === 0 ? (
                <div className="p-12 text-center text-slate-500 dark:text-zinc-400">
                  <Globe className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1">No Sitemaps Found on Google Search Console</p>
                  <p className="text-xs max-w-md mx-auto">
                    Submit your sitemap indices above or ping the local sitemaps below to notify Googlebot.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700">
                    <tr>
                      <th className="p-3.5">Sitemap URL</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Submitted</th>
                      <th className="p-3.5">Last Downloaded</th>
                      <th className="p-3.5">Discovered URLs</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {sitemaps.map((item, idx) => {
                      const isPending = item.isPending;
                      const hasErrors = Number(item.errors || 0) > 0;
                      const hasWarnings = Number(item.warnings || 0) > 0;
                      const isDeleting = deletingSitemapPath === item.path;

                      return (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-[280px]">
                            <div className="flex items-center gap-1.5 truncate" title={item.path}>
                              <a
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                              >
                                {item.path}
                              </a>
                              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold text-[11px]">
                              {item.isSitemapsIndex ? 'Sitemap Index' : (item.type || 'Sitemap')}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-zinc-300 whitespace-nowrap">
                            {formatSitemapDate(item.lastSubmitted)}
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-zinc-300 whitespace-nowrap">
                            {formatSitemapDate(item.lastDownloaded)}
                          </td>
                          <td className="p-3.5">
                            {item.contents && item.contents.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {item.contents.map((c, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-900"
                                  >
                                    {c.type}: {c.submitted}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">None</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
                                <Clock className="w-3 h-3" />
                                <span>Pending</span>
                              </span>
                            ) : hasErrors ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800 text-[11px] font-bold">
                                <AlertTriangle className="w-3 h-3" />
                                <span>{item.errors} Error(s)</span>
                              </span>
                            ) : hasWarnings ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Warnings</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Success</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSubmitSitemap(item.path)}
                                title="Ping / Re-submit to Google"
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-zinc-400 hover:text-blue-600 transition cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSitemap(item.path)}
                                disabled={isDeleting}
                                title="Delete sitemap from Search Console"
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-zinc-400 hover:text-red-600 transition disabled:opacity-50 cursor-pointer"
                              >
                                <Trash2 className={`w-3.5 h-3.5 ${isDeleting ? 'animate-pulse text-red-500' : ''}`} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Local Sitemaps Quick Submit */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Site Generated Sitemaps</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Pre-configured XML sitemaps generated on coachingsinsikar.com
                </p>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold">
                {localSitemaps.length} available
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {localSitemaps.map((sm, i) => (
                <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>{sm.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <a
                        href={sm.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <span>{sm.path}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{sm.description}</p>
                  </div>

                  <button
                    onClick={() => handleSubmitSitemap(sm.path)}
                    disabled={submittingSitemap}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-zinc-300 text-xs font-bold cursor-pointer shrink-0 transition-all shadow-sm"
                  >
                    <span>Ping Google</span>
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: OPPORTUNITIES (AI KEYWORD DISCOVERY) */}
      {/* ========================================================= */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Striking Distance Keywords */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold mb-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>High Impact Quick Wins</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Striking Distance Keywords (Pos 8–20)</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Keywords hovering on the bottom of Page 1 or top of Page 2. Small on-page tweaks will push these into the Top 3.
                </p>
              </div>

              <div className="overflow-x-auto max-h-[360px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-600 uppercase font-bold sticky top-0">
                    <tr>
                      <th className="p-2.5">Keyword</th>
                      <th className="p-2.5 text-right">Position</th>
                      <th className="p-2.5 text-right">Impr.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {opportunities?.striking_distance?.length > 0 ? (
                      opportunities.striking_distance.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{item.query}</td>
                          <td className="p-2.5 text-right font-bold text-amber-600">{Number(item.position).toFixed(1)}</td>
                          <td className="p-2.5 text-right text-slate-600 dark:text-zinc-300">{item.impressions}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-slate-500">Sync search data to compute opportunities.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* High Impression, Low CTR */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                  <span>CTR Optimizers</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">High Impression, Low CTR (&lt;2%)</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Queries with heavy search volume where searchers are clicking competitors. Rewrite title & meta description to boost traffic.
                </p>
              </div>

              <div className="overflow-x-auto max-h-[360px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-600 uppercase font-bold sticky top-0">
                    <tr>
                      <th className="p-2.5">Keyword</th>
                      <th className="p-2.5 text-right">CTR</th>
                      <th className="p-2.5 text-right">Impr.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {opportunities?.low_ctr?.length > 0 ? (
                      opportunities.low_ctr.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{item.query}</td>
                          <td className="p-2.5 text-right font-bold text-rose-600">{(item.ctr * 100).toFixed(1)}%</td>
                          <td className="p-2.5 text-right text-slate-600 dark:text-zinc-300">{item.impressions}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-slate-500">Sync search data to compute opportunities.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: SETTINGS & CONNECTION */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">API Credentials & Property Configuration</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Connect via OAuth 2.0 Client credentials or upload a Google Cloud Service Account JSON file.
                </p>
              </div>

              {settings.is_connected && (
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
                >
                  Disconnect Account
                </button>
              )}
            </div>

            {settingsSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                {settingsSuccess}
              </div>
            )}
            {settingsError && (
              <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                {settingsError}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* Property Identifier */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5">
                  Search Console Property Identifier:
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="https://coachingsinsikar.com/ or sc-domain:coachingsinsikar.com"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Must match the exact verified site in your Google Search Console (e.g., https://coachingsinsikar.com/).
                </span>
              </div>

              {/* JSON File Upload */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 mb-2">
                  Upload Credentials JSON (OAuth or Service Account):
                </label>
                <input
                  type="file"
                  id="gsc_credentials_file"
                  accept=".json"
                  className="text-xs text-slate-600 dark:text-zinc-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 mt-2 block">
                  Uploading client_secret_*.json will automatically extract Client ID, Client Secret, and Redirect URIs.
                </span>
              </div>

              {/* Client ID */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5">
                  OAuth Client ID:
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="123456789000-xxxx.apps.googleusercontent.com"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                  />
                </div>
              </div>

              {/* Client Secret */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5">
                  OAuth Client Secret:
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    placeholder={settings.has_client_secret ? '•••••••••••••••••••• (Encrypted in DB)' : 'Enter OAuth client secret'}
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                  />
                </div>
              </div>

              {/* Redirect URI */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5">
                  Authorized Redirect URI:
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                  />
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  <span className="font-bold">Add this URI to Google Cloud Console (OAuth Authorized redirect URIs):</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {settings.suggested_redirect_uris?.map((uri, idx) => (
                      <code key={idx} className="bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                        {uri}
                      </code>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auto-Index Toggles */}
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Automation & Lifecycle Hooks
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoIndexPosts}
                    onChange={(e) => setAutoIndexPosts(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Automatically ping Google Indexing API when publishing or updating a blog post
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoIndexBusinesses}
                    onChange={(e) => setAutoIndexBusinesses(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Automatically ping Google Indexing API when adding or updating a verified business profile
                  </span>
                </label>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="/admin/gsc/auth"
                  className="group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer no-underline"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize Google Account</span>
                </a>
              </div>
            </form>
          </div>

          {/* Manual Code Input Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Alternative: Connect via Authorization Code
            </h4>
            <p className="text-xs text-slate-500">
              If your redirect URI points to another domain or localhost, copy the <code className="bg-slate-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-blue-600 font-mono">code=4/...</code> parameter from the Google redirect URL and paste it here directly:
            </p>

            <form onSubmit={handleConnectWithCode} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Terminal className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="4/0ASVkm..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={savingSettings || !manualCode}
                className="group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-black focus:outline-none focus:ring-4 focus:ring-slate-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md cursor-pointer shrink-0"
              >
                <span>Exchange Code & Connect</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
