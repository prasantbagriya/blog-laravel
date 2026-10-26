import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
  Globe, 
  Search, 
  Zap, 
  BarChart3, 
  Activity, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink, 
  ArrowRight, 
  Copy, 
  Check, 
  Layers, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Smartphone,
  TrendingUp,
  Key,
  XCircle
} from 'lucide-react';

export default function BingWebmasterIndex({
  settings: initialSettings = {},
  recentLogs = [],
  defaultUrls = [],
  callbackSuccess = false,
  callbackError = null,
  initialTab = 'performance',
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'performance');
  const [settings, setSettings] = useState(initialSettings || {});

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [queryFilter, setQueryFilter] = useState('');

  // Indexing State
  const [urlInput, setUrlInput] = useState(defaultUrls[0]?.url || 'https://coachingsinsikar.com');
  const [batchMode, setBatchMode] = useState(false);
  const [batchUrlsInput, setBatchUrlsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [logs, setLogs] = useState(recentLogs || []);

  // Crawl Stats State
  const [crawlStats, setCrawlStats] = useState(null);
  const [loadingCrawlStats, setLoadingCrawlStats] = useState(false);

  // Sitemaps State
  const [sitemaps, setSitemaps] = useState([]);
  const [loadingSitemaps, setLoadingSitemaps] = useState(false);
  const [newSitemapUrl, setNewSitemapUrl] = useState('https://coachingsinsikar.com/sitemap.xml');
  const [submittingSitemap, setSubmittingSitemap] = useState(false);
  const [sitemapMessage, setSitemapMessage] = useState(null);

  // Settings State
  const [clientId, setClientId] = useState(settings.client_id || '');
  const [clientSecret, setClientSecret] = useState('');
  const [siteUrl, setSiteUrl] = useState(settings.site_url || 'https://coachingsinsikar.com/');
  const [autoIndex, setAutoIndex] = useState(settings.auto_index_posts ?? true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState(null);
  const [copiedRedirect, setCopiedRedirect] = useState(false);

  const csrfHeaders = () => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return token ? { 'X-CSRF-TOKEN': token } : {};
  };

  // Fetch Analytics
  const fetchAnalytics = async () => {
    if (!settings.is_connected) return;
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/admin/bing/analytics');
      const data = await res.json();
      if (data.success) {
        setAnalytics(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Fetch Crawl Stats
  const fetchCrawlStats = async () => {
    if (!settings.is_connected) return;
    setLoadingCrawlStats(true);
    try {
      const res = await fetch('/api/admin/bing/crawl-stats');
      const data = await res.json();
      if (data.success) {
        setCrawlStats(data.stats || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCrawlStats(false);
    }
  };

  // Fetch Sitemaps
  const fetchSitemaps = async () => {
    if (!settings.is_connected) return;
    setLoadingSitemaps(true);
    try {
      const res = await fetch('/api/admin/bing/sitemaps');
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

  useEffect(() => {
    if (settings.is_connected) {
      if (activeTab === 'performance') fetchAnalytics();
      if (activeTab === 'crawl') fetchCrawlStats();
      if (activeTab === 'sitemaps') fetchSitemaps();
    }
  }, [activeTab, settings.is_connected]);

  // Handle URL Submission
  const handleSubmitUrl = async (e) => {
    e?.preventDefault();
    if (batchMode) {
      handleBatchSubmit();
      return;
    }

    if (!urlInput.trim()) return;
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch('/api/admin/bing/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitMessage({ type: 'success', text: data.message });
        setLogs(prev => [{
          id: Date.now(),
          url: urlInput,
          method: 'oauth_api',
          status: 'success',
          http_code: data.status_code || 200,
          response_message: data.message,
          created_at_human: 'Just now'
        }, ...prev]);
        if (data.remaining_quota !== undefined) {
          setSettings(s => ({ ...s, daily_quota_remaining: data.remaining_quota }));
        }
      } else {
        setSubmitMessage({ type: 'error', text: data.error || data.message || 'Submission failed.' });
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Batch Submit
  const handleBatchSubmit = async () => {
    const list = batchUrlsInput
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.startsWith('http'));

    if (list.length === 0) {
      setSubmitMessage({ type: 'error', text: 'Please enter at least one valid HTTP/HTTPS URL.' });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch('/api/admin/bing/submit-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ urls: list }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitMessage({ type: 'success', text: data.message });
        setBatchUrlsInput('');
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Batch submission failed.' });
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Submit Sitemap
  const handleSubmitSitemap = async (e) => {
    e?.preventDefault();
    if (!newSitemapUrl.trim()) return;

    setSubmittingSitemap(true);
    setSitemapMessage(null);

    try {
      const res = await fetch('/api/admin/bing/sitemaps/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ sitemap_url: newSitemapUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setSitemapMessage({ type: 'success', text: data.message });
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

  // Save Settings
  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    setSavingSettings(true);
    setSettingsMessage(null);

    try {
      const res = await fetch('/api/admin/bing/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret || undefined,
          site_url: siteUrl,
          auto_index_posts: autoIndex,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsMessage({ type: 'success', text: data.message });
      } else {
        setSettingsMessage({ type: 'error', text: data.error || 'Failed to save settings.' });
      }
    } catch (err) {
      setSettingsMessage({ type: 'error', text: err.message });
    } finally {
      setSavingSettings(false);
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Bing Webmaster Tools?')) return;
    try {
      const res = await fetch('/api/admin/bing/disconnect', {
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

  const redirectUriText = 'https://coachingsinsikar.com/auth/bing/callback';
  const handleCopyRedirect = () => {
    navigator.clipboard?.writeText(redirectUriText);
    setCopiedRedirect(true);
    setTimeout(() => setCopiedRedirect(false), 2000);
  };

  const filteredQueries = useMemo(() => {
    if (!analytics?.queries) return [];
    if (!queryFilter) return analytics.queries;
    return analytics.queries.filter(q => q.query.toLowerCase().includes(queryFilter.toLowerCase()));
  }, [analytics, queryFilter]);

  return (
    <AdminLayout>
      <Head title="Bing Webmaster Tools & IndexNow Hub | Admin" />

      {/* Top Banner & Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xl">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Bing Webmaster Tools & IndexNow Hub
                </h1>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Real-time rankings, instant indexing (up to 10,000 URLs/day), crawl health, and sitemaps for Bing, Yahoo, DuckDuckGo & Copilot.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {settings.is_connected ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected: {settings.site_url}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Not Connected
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold border border-slate-200 dark:border-zinc-700">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{settings.daily_quota_remaining?.toLocaleString() || '10,000'} Quota / Day</span>
            </span>

            {settings.is_connected ? (
              <button
                onClick={fetchAnalytics}
                disabled={loadingAnalytics}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                <span>Sync Bing Data</span>
              </button>
            ) : (
              <a
                href="/auth/bing"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-colors cursor-pointer no-underline"
              >
                <span>Connect with Bing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Callback Alerts */}
        {callbackSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Microsoft Bing Webmaster Tools connected successfully! Live data is now active.</span>
            </div>
            <button onClick={() => router.visit('/admin/bing')} className="text-xs underline cursor-pointer shrink-0">Dismiss</button>
          </div>
        )}
        {callbackError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Connection Error: {callbackError}</span>
            </div>
            <button onClick={() => router.visit('/admin/bing')} className="text-xs underline cursor-pointer shrink-0">Dismiss</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-slate-200 dark:border-zinc-800">
          {[
            { id: 'performance', label: 'Search Performance', icon: BarChart3 },
            { id: 'indexing', label: 'Instant Indexing', icon: Zap },
            { id: 'crawl', label: 'Crawl & Health', icon: Activity },
            { id: 'sitemaps', label: 'Sitemaps', icon: Globe },
            { id: 'settings', label: 'Settings & OAuth', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
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
      {/* TAB 1: SEARCH PERFORMANCE */}
      {/* ========================================================= */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {!settings.is_connected && (
            <div className="p-6 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Connect Bing Webmaster Tools</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300">
                  Authenticate using your Microsoft OAuth credentials to load live Bing clicks, impressions, and query rankings.
                </p>
              </div>
              <a
                href="/auth/bing"
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition whitespace-nowrap self-start sm:self-auto cursor-pointer no-underline"
              >
                Connect with Bing ➔
              </a>
            </div>
          )}

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Bing Search Clicks</div>
              <div className="text-3xl font-black text-sky-600 dark:text-sky-400">
                {analytics?.total_clicks?.toLocaleString() || '0'}
              </div>
              <p className="text-[11px] text-slate-500">Users visiting from Bing search</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Impressions</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {analytics?.total_impressions?.toLocaleString() || '0'}
              </div>
              <p className="text-[11px] text-slate-500">Search results appearances on Bing</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Click-Through (CTR)</div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {analytics?.average_ctr || '0'}%
              </div>
              <p className="text-[11px] text-slate-500">Clicks divided by impressions</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Submission Quota</div>
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                {settings.daily_quota_remaining?.toLocaleString() || '10,000'}
              </div>
              <p className="text-[11px] text-slate-500">Fast-track URLs available today</p>
            </div>
          </div>

          {/* Queries Ranking Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Top Bing Search Queries</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Actual search terms users entered into Bing to find your website.
                </p>
              </div>

              <div className="relative group w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Filter queries..."
                  value={queryFilter}
                  onChange={(e) => setQueryFilter(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[460px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700">
                  <tr>
                    <th className="p-3">Query</th>
                    <th className="p-3 text-right">Clicks</th>
                    <th className="p-3 text-right">Impressions</th>
                    <th className="p-3 text-right">CTR</th>
                    <th className="p-3 text-right">Avg Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {loadingAnalytics ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-500 mb-2" />
                        <p className="text-xs font-semibold">Loading search queries from Bing...</p>
                      </td>
                    </tr>
                  ) : filteredQueries.length > 0 ? (
                    filteredQueries.map((q, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{q.query}</td>
                        <td className="p-3 text-right font-extrabold text-sky-600 dark:text-sky-400">{q.clicks}</td>
                        <td className="p-3 text-right text-slate-600 dark:text-zinc-300">{q.impressions}</td>
                        <td className="p-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">{q.ctr}%</td>
                        <td className="p-3 text-right text-slate-600 dark:text-zinc-300">{q.avg_click_position || q.avg_impression_position || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 space-y-1">
                        <Globe className="w-8 h-8 mx-auto text-slate-400 opacity-40 mb-2" />
                        <p className="font-bold text-slate-700 dark:text-zinc-300">No Query Data Available Yet</p>
                        <p className="text-[11px]">Sync your account or submit URLs to accelerate Bing crawl activity.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: INSTANT INDEXING (URL INSPECTOR DESIGN) */}
      {/* ========================================================= */}
      {activeTab === 'indexing' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-600/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      Instant Bingbot & IndexNow URL Submission
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                      Fast-track URLs directly into Microsoft Bing, Yahoo, DuckDuckGo and Copilot search within minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setBatchMode(!batchMode)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    batchMode 
                      ? 'bg-sky-600 text-white border-sky-600' 
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100'
                  }`}
                >
                  {batchMode ? 'Switch to Single URL' : 'Batch Submission Mode'}
                </button>
              </div>
            </div>

            {/* Submission Form matching URL Inspector */}
            {!batchMode ? (
              <form onSubmit={handleSubmitUrl} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="https://coachingsinsikar.com/blog/best-neet-coaching-sikar"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-sky-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !urlInput}
                  className="group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-sky-500/20 cursor-pointer shrink-0"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting to Bingbot...</span>
                    </>
                  ) : (
                    <>
                      <span>Push to Bingbot ⚡</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitUrl} className="space-y-3">
                <textarea
                  rows={4}
                  placeholder={`https://coachingsinsikar.com/blog/post-1\nhttps://coachingsinsikar.com/blog/post-2\nhttps://coachingsinsikar.com/blog/post-3`}
                  value={batchUrlsInput}
                  onChange={(e) => setBatchUrlsInput(e.target.value)}
                  className="block w-full p-4 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
                />
                <button
                  type="submit"
                  disabled={submitting || !batchUrlsInput.trim()}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-xl shadow-md shadow-sky-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting Batch...' : 'Submit Batch to Bingbot 🚀'}
                </button>
              </form>
            )}

            {/* Quick URL Select Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs">
              <span className="text-slate-400 font-semibold shrink-0">Quick URLs:</span>
              {defaultUrls.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrlInput(item.url)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-zinc-700 font-medium whitespace-nowrap transition cursor-pointer text-[11px]"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {submitMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                submitMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}>
                {submitMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{submitMessage.text}</span>
              </div>
            )}
          </div>

          {/* Submission History Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Bingbot Submission Logs</h3>
            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700">
                  <tr>
                    <th className="p-3">Submitted URL</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Response</th>
                    <th className="p-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
                        <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white max-w-[280px] truncate" title={log.url}>
                          {log.url}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold uppercase text-[10px]">
                            {log.method}
                          </span>
                        </td>
                        <td className="p-3">
                          {log.status === 'success' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Success ({log.http_code || 200})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                              <XCircle className="w-3.5 h-3.5" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 max-w-[240px] truncate" title={log.response_message}>
                          {log.response_message || 'OK'}
                        </td>
                        <td className="p-3 text-right text-slate-500 whitespace-nowrap">
                          {log.created_at_human || log.created_at}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No submissions recorded yet. Enter a URL above to test instant indexing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CRAWL & HEALTH DIAGNOSTICS */}
      {/* ========================================================= */}
      {activeTab === 'crawl' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Bingbot Crawl & Index Health (GetCrawlStats)</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Historical crawl activity and HTTP status report directly from Microsoft's indexing infrastructure.
            </p>

            {loadingCrawlStats ? (
              <div className="py-12 text-center text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-500 mb-2" />
                <p className="text-xs font-semibold">Querying Bingbot crawl telemetry...</p>
              </div>
            ) : crawlStats && crawlStats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">In Index</th>
                      <th className="p-3 text-right">Crawl Errors</th>
                      <th className="p-3 text-right">2xx Success</th>
                      <th className="p-3 text-right">4xx Missing</th>
                      <th className="p-3 text-right">5xx Server Err</th>
                      <th className="p-3 text-right">InLinks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {crawlStats.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">
                          {item.Date ? new Date(item.Date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3 text-right font-bold text-sky-600 dark:text-sky-400">{item.PagesInIndex ?? '-'}</td>
                        <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">{item.CrawlErrors ?? 0}</td>
                        <td className="p-3 text-right text-emerald-600 font-bold">{item.Code2xx ?? '-'}</td>
                        <td className="p-3 text-right text-amber-600">{item.Code4xx ?? 0}</td>
                        <td className="p-3 text-right text-rose-600">{item.Code5xx ?? 0}</td>
                        <td className="p-3 text-right text-slate-600 dark:text-zinc-300">{item.InLinks ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Activity className="w-8 h-8 mx-auto text-slate-400 opacity-40 mb-2" />
                <p className="font-bold text-slate-700 dark:text-zinc-300">Crawl Telemetry Syncing</p>
                <p className="text-xs max-w-md mx-auto">
                  Bing updates crawl telemetry on weekly cycles. Once Bingbot begins crawling your submitted sitemaps, data will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SITEMAPS */}
      {/* ========================================================= */}
      {activeTab === 'sitemaps' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Bing Sitemaps Management</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Submit XML sitemaps directly to Bing to ensure all blog posts, categories, and coachings are indexed.
            </p>

            <form onSubmit={handleSubmitSitemap} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="url"
                required
                value={newSitemapUrl}
                onChange={(e) => setNewSitemapUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
              <button
                type="submit"
                disabled={submittingSitemap || !newSitemapUrl}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-600/20 transition cursor-pointer disabled:opacity-50 shrink-0"
              >
                {submittingSitemap ? 'Submitting...' : 'Submit Sitemap to Bing'}
              </button>
            </form>

            {sitemapMessage && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                sitemapMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200'
              }`}>
                {sitemapMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{sitemapMessage.text}</span>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Registered Sitemaps on Bing</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700">
                  <tr>
                    <th className="p-3">Sitemap URL</th>
                    <th className="p-3 text-right">Last Crawled</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {sitemaps.length > 0 ? (
                    sitemaps.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
                        <td className="p-3 font-mono font-semibold text-slate-900 dark:text-white">{item.Url || item.url}</td>
                        <td className="p-3 text-right text-slate-500">{item.LastSubmitted || item.LastCrawled || 'Recently'}</td>
                        <td className="p-3 text-right font-bold text-emerald-600">Active</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">
                        No sitemaps retrieved from Bing yet. Click above to submit `sitemap.xml`.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: SETTINGS & OAUTH */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5">
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Microsoft Bing OAuth 2.0 Credentials</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Manage your Bing Webmaster OAuth Client ID, Client Secret, and verified Site URL.
              </p>
            </div>

            {/* Redirect URI Info Card */}
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 space-y-2">
              <div className="text-xs font-bold text-sky-900 dark:text-sky-200">
                Required Bing Webmaster OAuth Redirect URI:
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white dark:bg-zinc-900 border border-sky-300 dark:border-sky-800 rounded-lg text-xs font-mono text-sky-950 dark:text-sky-300 select-all">
                  {redirectUriText}
                </code>
                <button
                  type="button"
                  onClick={handleCopyRedirect}
                  className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedRedirect ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRedirect ? 'Copied!' : 'Copy URI'}</span>
                </button>
              </div>
              <p className="text-[11px] text-sky-700 dark:text-sky-300">
                Ensure this exact URI is pasted under <strong>Bing Webmaster Settings ➔ API Access ➔ OAuth Client</strong>.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5">
                  Bing OAuth Client ID
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-transparent font-mono text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5">
                  Bing OAuth Client Secret
                </label>
                <input
                  type="password"
                  placeholder={settings.has_client_secret ? '••••••••••••••••••••••••' : 'Paste new Client Secret'}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-transparent font-mono text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5">
                  Verified Site URL
                </label>
                <input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-transparent font-mono text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoIndex}
                    onChange={(e) => setAutoIndex(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Automatically submit new blog posts and businesses to Bingbot upon publishing
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </button>

                {settings.is_connected && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold text-xs transition cursor-pointer"
                  >
                    Disconnect Bing
                  </button>
                )}
              </div>

              {settingsMessage && (
                <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  settingsMessage.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200'
                }`}>
                  {settingsMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{settingsMessage.text}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
