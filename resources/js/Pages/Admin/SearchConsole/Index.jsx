import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Search, Globe, Send, Key, Lock, Link as LinkIcon, Terminal, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, FileText, BarChart3, Zap, Settings, Sparkles, Smartphone, TrendingUp, Database, Target, Trash2, ExternalLink, Check, Clock, Copy, Info, Gauge, Calendar, Layers, Filter, CheckSquare, ListFilter, ArrowDownUp, AlertCircle, Play } from 'lucide-react';
import PageSpeedTab from './PageSpeedTab';

export default function SearchConsoleIndex({
  settings: initialSettings,
  localSitemaps = [],
  initialSitemaps = [],
  cachedQueries = [],
  recentLogs = [],
  quotaStats: initialQuota = null,
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
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // URL Inspector State
  const [inspectUrlInput, setInspectUrlInput] = useState('');
  const [inspecting, setInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [inspectError, setInspectError] = useState(null);

  // PageSpeed Audit State
  const [pageSpeedTargetUrl, setPageSpeedTargetUrl] = useState('');

  // Instant Indexing State
  const [indexUrlInput, setIndexUrlInput] = useState('');
  const [indexAction, setIndexAction] = useState('URL_UPDATED');
  const [forceIndex, setForceIndex] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [indexLogs, setIndexLogs] = useState(recentLogs || []);
  const [indexMessage, setIndexMessage] = useState(null);
  const [testingIndexing, setTestingIndexing] = useState(false);
  const [testIndexingResult, setTestIndexingResult] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [loadingIndexLogs, setLoadingIndexLogs] = useState(false);
  const [quotaStats, setQuotaStats] = useState(initialQuota || { used: 0, limit: 200, remaining: 200 });

  // Site Content Inventory & Smart Batch Indexing State
  const [siteInventory, setSiteInventory] = useState(null);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [inventoryTab, setInventoryTab] = useState('pending'); // 'pending' (niche pade hue), 'all', 'pushed', 'failed'
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryTypeFilter, setInventoryTypeFilter] = useState('all');
  const [pushingPending, setPushingPending] = useState(false);
  const [pushPendingBatchSize, setPushPendingBatchSize] = useState(50);
  const [pushPendingOrder, setPushPendingOrder] = useState('bottom_first'); // 'bottom_first' or 'newest_first'
  const [pushPendingMessage, setPushPendingMessage] = useState(null);
  const [pushingSingleId, setPushingSingleId] = useState(null);

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

  // PageSpeed API Key State
  const [pageSpeedApiKey, setPageSpeedApiKey] = useState(pageSpeedData.apiKey || '');
  const [savingPageSpeedKey, setSavingPageSpeedKey] = useState(false);
  const [pageSpeedKeyMsg, setPageSpeedKeyMsg] = useState(null);

  const handleSavePageSpeedKey = async (e) => {
    e?.preventDefault();
    if (!pageSpeedApiKey.trim()) return;
    setSavingPageSpeedKey(true);
    setPageSpeedKeyMsg(null);
    try {
      const res = await fetch('/api/admin/pagespeed/api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...csrfHeaders(),
        },
        body: JSON.stringify({ api_key: pageSpeedApiKey.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPageSpeedKeyMsg({ type: 'success', text: data.message || 'PageSpeed API Key saved successfully!' });
        pageSpeedData.hasApiKey = true;
        pageSpeedData.apiKey = pageSpeedApiKey.trim();
      } else {
        setPageSpeedKeyMsg({ type: 'error', text: data.error || 'Failed to save PageSpeed API key.' });
      }
    } catch (err) {
      setPageSpeedKeyMsg({ type: 'error', text: err.message || 'Network error saving API key.' });
    } finally {
      setSavingPageSpeedKey(false);
    }
  };

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
  const fetchAnalytics = async (days = dateRange, type = searchType, customStart = customStartDate, customEnd = customEndDate) => {
    if (!settings.is_connected) return;
    setLoadingAnalytics(true);
    try {
      let url = `/api/admin/gsc/analytics?type=${type}`;
      if (days === 'custom' && customStart && customEnd) {
        url += `&start_date=${customStart}&end_date=${customEnd}`;
      } else {
        url += `&days=${days}`;
      }
      const res = await fetch(url);
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

  // Fetch Site Pages Inventory & Indexing Status
  const fetchSiteInventory = async () => {
    setLoadingInventory(true);
    try {
      const res = await fetch('/api/admin/gsc/pages-index-status');
      const data = await res.json();
      if (data.success) {
        setSiteInventory(data);
        if (data.summary) {
          setQuotaStats({
            used: data.summary.quota_used_today,
            limit: data.summary.quota_limit,
            remaining: data.summary.quota_remaining,
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch site inventory:', err);
    } finally {
      setLoadingInventory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'indexing' && !siteInventory) {
      fetchSiteInventory();
    }
  }, [activeTab]);

  // Handle Instant Indexing (Manual Form)
  const handlePublishIndex = async (e) => {
    e?.preventDefault();
    if (!indexUrlInput) return;
    setIndexing(true);
    setIndexMessage(null);

    const urls = Array.from(new Set(indexUrlInput.split('\n').map(u => u.trim()).filter(Boolean)));

    try {
      const res = await fetch('/api/admin/gsc/index-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ urls, action: indexAction, force: forceIndex }),
      });
      const data = await res.json();
      if (data.success) {
        const results = data.results || [];
        const skippedItems = results.filter(r => r.skipped);
        const failedItems = results.filter(r => !r.success || r.status === 'failed' || r.http_code === 403);
        const successItems = results.filter(r => r.success && !r.skipped);

        if (data.quota) {
          setQuotaStats(data.quota);
        }

        if (failedItems.length > 0) {
          const firstMsg = failedItems[0].message || 'Some URLs failed ownership verification.';
          setIndexMessage({
            type: 'error',
            text: `${failedItems.length} of ${urls.length} URL(s) failed. Google response: ${firstMsg}`,
          });
        } else if (skippedItems.length > 0 && successItems.length === 0) {
          setIndexMessage({
            type: 'info',
            text: `Skipped ${skippedItems.length} URL(s): Already successfully pushed in last 24h (Cooldown active).`,
          });
        } else {
          setIndexMessage({
            type: 'success',
            text: `Successfully submitted ${successItems.length} URL(s) to Googlebot! ${skippedItems.length > 0 ? `(${skippedItems.length} skipped - already pushed recently)` : ''}`,
          });
          setIndexUrlInput('');
        }
        fetchIndexingLogs();
        fetchSiteInventory();
      } else {
        setIndexMessage({ type: 'error', text: data.error || 'Failed to publish URLs.' });
      }
    } catch (err) {
      setIndexMessage({ type: 'error', text: err.message });
    } finally {
      setIndexing(false);
    }
  };

  // Push pending / unindexed URLs batch ("niche pade hue")
  const handlePushPendingBatch = async () => {
    setPushingPending(true);
    setPushPendingMessage(null);
    try {
      const res = await fetch('/api/admin/gsc/push-pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({
          limit: pushPendingBatchSize,
          order: pushPendingOrder,
          type: inventoryTypeFilter,
          force: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPushPendingMessage({
          type: data.failed > 0 ? 'warning' : 'success',
          text: data.message || `Processed ${data.processed} URLs: ${data.pushed} pushed to Googlebot!`,
        });
        if (data.quota) {
          setQuotaStats(data.quota);
        }
        fetchSiteInventory();
        fetchIndexingLogs();
      } else {
        setPushPendingMessage({ type: 'error', text: data.error || 'Failed to push pending batch.' });
      }
    } catch (err) {
      setPushPendingMessage({ type: 'error', text: err.message });
    } finally {
      setPushingPending(false);
    }
  };

  // Push single URL from the inventory table
  const handlePushSingleUrl = async (url, pageId, force = false) => {
    setPushingSingleId(pageId);
    try {
      const res = await fetch('/api/admin/gsc/index-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({ url, action: 'URL_UPDATED', force }),
      });
      const data = await res.json();
      if (data.success) {
        const itemResult = data.results?.[0];
        if (itemResult?.skipped) {
          setIndexMessage({ type: 'info', text: itemResult.message });
        } else if (itemResult?.success) {
          setIndexMessage({ type: 'success', text: `URL pushed successfully to Googlebot!` });
        } else {
          setIndexMessage({ type: 'error', text: itemResult?.message || 'Push failed.' });
        }
        if (data.quota) {
          setQuotaStats(data.quota);
        }
        fetchSiteInventory();
        fetchIndexingLogs();
      } else {
        setIndexMessage({ type: 'error', text: data.error || 'Failed to push URL.' });
      }
    } catch (err) {
      setIndexMessage({ type: 'error', text: err.message });
    } finally {
      setPushingSingleId(null);
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

  // Filtered Site Content Inventory (Instant Indexing Tab)
  const filteredInventoryPages = useMemo(() => {
    const list = siteInventory?.pages || [];
    return list.filter((item) => {
      // 1. Tab filter: pending (niche pade hue), eligible (>24h passed), pushed (active 24h cooldown), failed, all
      if (inventoryTab === 'pending' && item.status !== 'pending') return false;
      if (inventoryTab === 'eligible' && item.status !== 'eligible') return false;
      if (inventoryTab === 'pushed' && !item.cooldown_active) return false;
      if (inventoryTab === 'failed' && item.status !== 'failed') return false;

      // 2. Content Type filter
      if (inventoryTypeFilter !== 'all' && item.type !== inventoryTypeFilter) return false;

      // 3. Search query
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const urlMatch = (item.url || '').toLowerCase().includes(q);
        return titleMatch || urlMatch;
      }
      return true;
    });
  }, [siteInventory, inventoryTab, inventoryTypeFilter, inventorySearch]);

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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-zinc-400">Date Range:</span>
              {[
                { label: '24H', days: 1 },
                { label: '7D', days: 7 },
                { label: '28D', days: 28 },
                { label: '3M', days: 90 },
                { label: '6M', days: 180 },
              ].map(r => (
                <button
                  key={r.days}
                  onClick={() => {
                    setDateRange(r.days);
                    setShowCustomPicker(false);
                    fetchAnalytics(r.days, searchType);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${dateRange === r.days ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'}`}
                >
                  {r.label}
                </button>
              ))}

              {/* Custom Date Range Toggle */}
              <button
                onClick={() => setShowCustomPicker(!showCustomPicker)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${dateRange === 'custom' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Custom</span>
              </button>
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

          {/* Custom Date Picker Dropdown/Tray */}
          {showCustomPicker && (
            <div className="flex flex-wrap items-center gap-3 bg-blue-50/70 dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-blue-200 dark:border-zinc-700 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
                <span>Start Date:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium outline-none"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
                <span>End Date:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium outline-none"
                />
              </div>
              <button
                onClick={() => {
                  if (!customStartDate || !customEndDate) {
                    alert('Please select both start and end dates');
                    return;
                  }
                  setDateRange('custom');
                  fetchAnalytics('custom', searchType, customStartDate, customEndDate);
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer"
              >
                Apply Custom Range
              </button>
            </div>
          )}

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
                <table className="w-full min-w-[520px] text-left text-xs border-collapse">
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
                <table className="w-full min-w-[520px] text-left text-xs border-collapse">
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
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => { setInspectUrlInput(pUrl); setActiveTab('inspector'); }}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-zinc-300 hover:text-blue-600 text-[11px] font-bold cursor-pointer"
                                title="Inspect Googlebot Index Coverage"
                              >
                                Inspect
                              </button>
                              <button
                                onClick={() => { setPageSpeedTargetUrl(pUrl); setActiveTab('pagespeed'); }}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 text-[11px] font-bold cursor-pointer flex items-center gap-1"
                                title="Audit Core Web Vitals & PageSpeed"
                              >
                                <Gauge className="w-3 h-3 text-amber-500" />
                                <span>Speed</span>
                              </button>
                            </div>
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

                  <button
                    onClick={() => { setPageSpeedTargetUrl(inspectionResult.inspectionUrl); setActiveTab('pagespeed'); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold cursor-pointer transition-colors border border-slate-200 dark:border-zinc-700"
                    title="Audit PageSpeed & Core Web Vitals for this URL"
                  >
                    <Gauge className="w-3.5 h-3.5 text-blue-500" />
                    <span>Audit PageSpeed & CWV</span>
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
          </div>

          {/* Indexing Metrics & Daily Quota Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                <span>Google Daily Quota</span>
                <span className="font-mono text-blue-600 font-bold">{quotaStats.remaining} Left</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {quotaStats.used} <span className="text-xs font-normal text-slate-400">/ {quotaStats.limit}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((quotaStats.used / (quotaStats.limit || 200)) * 100))}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold mb-1">Total Site Pages</div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {siteInventory?.summary?.total_pages ?? '...'}
              </div>
              <span className="text-[11px] text-slate-400">Across Posts, Businesses, Stories</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Pushed to Googlebot</span>
              </div>
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {siteInventory?.summary?.pushed_count ?? 0}
              </div>
              <span className="text-[11px] text-emerald-600/80 font-medium">Verified Crawl Requested</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Pending / Unpushed</span>
              </div>
              <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                {siteInventory?.summary?.pending_count ?? 0}
              </div>
              <span className="text-[11px] text-amber-600/80 font-medium">Lying Unindexed / Waiting</span>
            </div>
          </div>

          {/* Smart Batch Push Pending URLs Engine ("Niche Pade Pages Ko Push Karo") */}
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-zinc-900 dark:to-zinc-900 p-6 rounded-2xl border border-blue-100 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Smart Batch Push (Queue Pending &amp; Bottom Content First)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  Pushes your unindexed or older pages lying at the bottom of the database directly to Googlebot.
                  Automatic 24h cooldown and duplicate prevention safeguard your 200 URLs/day quota from being wasted on repeat submissions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <select
                  value={pushPendingOrder}
                  onChange={(e) => setPushPendingOrder(e.target.value)}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold outline-none cursor-pointer"
                  title="Push Order"
                >
                  <option value="bottom_first">Bottom-First (Oldest unindexed first)</option>
                  <option value="newest_first">Newest-First</option>
                </select>

                <select
                  value={pushPendingBatchSize}
                  onChange={(e) => setPushPendingBatchSize(Number(e.target.value))}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold outline-none cursor-pointer"
                >
                  <option value={25}>Batch: 25 URLs</option>
                  <option value={50}>Batch: 50 URLs</option>
                  <option value={100}>Batch: 100 URLs</option>
                </select>

                <button
                  type="button"
                  onClick={handlePushPendingBatch}
                  disabled={pushingPending || (siteInventory?.summary?.pending_count === 0 && siteInventory?.summary?.failed_count === 0 && (siteInventory?.summary?.eligible_count ?? 0) === 0)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-extrabold shadow-md shadow-blue-600/20 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {pushingPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Pushing Batch to Googlebot...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Push Next {pushPendingBatchSize} Pending / Eligible URLs</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {pushPendingMessage && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 ${
                pushPendingMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : pushPendingMessage.type === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}>
                <div className="flex items-center gap-2">
                  {pushPendingMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />}
                  <span>{pushPendingMessage.text}</span>
                </div>
                <button onClick={() => setPushPendingMessage(null)} className="text-[11px] underline cursor-pointer shrink-0">Dismiss</button>
              </div>
            )}
          </div>

          {/* Site Content Indexing Inventory Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Site Content Indexing Inventory
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-mono">
                    {filteredInventoryPages.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchSiteInventory}
                    disabled={loadingInventory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingInventory ? 'animate-spin text-blue-500' : ''}`} />
                    <span>{loadingInventory ? 'Scanning...' : 'Refresh Inventory'}</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'pending', label: 'Pending / Unpushed', count: siteInventory?.summary?.pending_count ?? 0 },
                    { id: 'eligible', label: 'Eligible for Re-push (>24h)', count: siteInventory?.summary?.eligible_count ?? 0 },
                    { id: 'all', label: 'All Pages', count: siteInventory?.summary?.total_pages ?? 0 },
                    { id: 'pushed', label: '24h Cooldown Active', count: siteInventory?.summary?.pushed_count ?? 0 },
                    { id: 'failed', label: 'Failed', count: siteInventory?.summary?.failed_count ?? 0 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInventoryTab(tab.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        inventoryTab === tab.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${inventoryTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={inventoryTypeFilter}
                    onChange={(e) => setInventoryTypeFilter(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold outline-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="post">Blog Posts</option>
                    <option value="business">Businesses</option>
                    <option value="story">Web Stories</option>
                    <option value="page">Static Pages</option>
                  </select>

                  <div className="relative group w-48 sm:w-56">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search title or URL..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="block w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[460px]">
              <table className="w-full min-w-[650px] text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-800/90 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700 z-10">
                  <tr>
                    <th className="p-3">Page Title &amp; Type</th>
                    <th className="p-3">Canonical Live URL</th>
                    <th className="p-3">Indexing Status</th>
                    <th className="p-3 text-right">Instant Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {loadingInventory && !siteInventory ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-500 mb-2" />
                        <span>Scanning website content &amp; matching Google Indexing records...</span>
                      </td>
                    </tr>
                  ) : filteredInventoryPages.length > 0 ? (
                    filteredInventoryPages.slice(0, 100).map((item) => {
                      const isPushing = pushingSingleId === item.id;
                      const isPushed = item.status === 'pushed';
                      const isFailed = item.status === 'failed';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition">
                          <td className="p-3 align-top max-w-[280px]">
                            <div className="font-bold text-slate-900 dark:text-white truncate" title={item.title}>
                              {item.title}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                                {item.type_label}
                              </span>
                              {item.category && (
                                <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3 align-top max-w-[320px]">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 truncate max-w-full"
                              title={item.url}
                            >
                              <span className="truncate">{item.url.replace(/^https?:\/\/[^\/]+/, '') || '/'}</span>
                              <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                            </a>
                            {item.response_message && (
                              <div className="text-[10px] text-slate-400 truncate mt-0.5" title={item.response_message}>
                                {item.response_message}
                              </div>
                            )}
                          </td>

                          <td className="p-3 align-top whitespace-nowrap">
                            {item.cooldown_active ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>24h Cooldown Active</span>
                                </span>
                                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">
                                  ~{item.cooldown_remaining_hours}h left ({item.last_pushed_human})
                                </div>
                              </div>
                            ) : item.status === 'eligible' ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                                  <Zap className="w-3 h-3 text-indigo-600" />
                                  <span>Ready to Re-push (&gt;24h)</span>
                                </span>
                                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                  Last: {item.last_pushed_human}
                                </div>
                              </div>
                            ) : isFailed ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                                  <span>Failed ({item.http_code})</span>
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>Pending / Waiting</span>
                                </span>
                                <div className="text-[10px] text-amber-600/80 mt-0.5 font-medium">
                                  Never pushed
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="p-3 align-top text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setInspectUrlInput(item.url);
                                  setActiveTab('inspector');
                                }}
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-zinc-300 hover:text-blue-600 text-[11px] font-bold cursor-pointer"
                                title="Inspect Live Index in GSC"
                              >
                                Inspect
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePushSingleUrl(item.url, item.id, item.cooldown_active)}
                                disabled={isPushing}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1 transition cursor-pointer ${
                                  item.cooldown_active
                                    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 text-slate-500'
                                    : item.status === 'eligible'
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                                }`}
                                title={item.cooldown_active ? `Submitted recently (~${item.cooldown_remaining_hours}h cooldown left). Click to force bypass.` : 'Push URL to Googlebot'}
                              >
                                {isPushing ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Zap className="w-3 h-3" />
                                )}
                                <span>{isPushing ? 'Pinging...' : item.cooldown_active ? 'Force Push' : item.status === 'eligible' ? 'Re-push' : 'Push Now'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">
                        No pages match the current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredInventoryPages.length > 100 && (
              <div className="p-3 border-t border-slate-100 dark:border-zinc-800 text-center text-[11px] text-slate-500 font-medium">
                Showing top 100 of {filteredInventoryPages.length} matching pages. Use search to locate any specific URL.
              </div>
            )}
          </div>

          {/* Manual Bulk Submission Form */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Manual Custom URL Submission
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Paste specific URLs below to push directly. Duplicates will automatically be merged, and URLs submitted in the last 24h will be skipped unless force push is enabled.
            </p>

            <form onSubmit={handlePublishIndex} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1">
                  Target URLs (one per line):
                </label>
                <textarea
                  rows={3}
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
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-zinc-400">Action Type:</label>
                    <select
                      value={indexAction}
                      onChange={(e) => setIndexAction(e.target.value)}
                      className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-bold outline-none cursor-pointer"
                    >
                      <option value="URL_UPDATED">URL_UPDATED (Publish / Update)</option>
                      <option value="URL_DELETED">URL_DELETED (Remove from Google)</option>
                    </select>
                  </div>

                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={forceIndex}
                      onChange={(e) => setForceIndex(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 dark:border-zinc-700 focus:ring-blue-500"
                    />
                    <span>Force push (Bypass 24h cooldown)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={indexing}
                  className="group relative flex justify-center items-center gap-2 py-2.5 px-6 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {indexing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Pinging Googlebot...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Push URLs to Google Index</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {indexMessage && (
              <div className={`mt-4 p-4 rounded-xl text-xs font-semibold ${
                indexMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : indexMessage.type === 'info'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
              }`}>
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
              <table className="w-full min-w-[650px] text-left text-xs border-collapse">
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
          targetUrl={pageSpeedTargetUrl}
          onInspectUrl={(url) => {
            setInspectUrlInput(url);
            setActiveTab('inspector');
          }}
          onPushIndex={(url) => {
            setIndexUrlInput(url);
            setActiveTab('indexing');
          }}
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
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-xs border-collapse">
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
                </div>
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
                <table className="w-full min-w-[340px] text-left text-xs border-collapse">
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
                <table className="w-full min-w-[340px] text-left text-xs border-collapse">
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

          {/* Google PageSpeed Insights API Key Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      Google PageSpeed Insights API Key
                    </h3>
                    {pageSpeedData.hasApiKey ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        Configured
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                        Not Configured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Allows real-time Core Web Vitals (LCP, CLS, INP) & Lighthouse audits with a generous free limit of 25,000 requests/day.
                  </p>
                </div>
              </div>

              <a
                href="https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition cursor-pointer self-start sm:self-auto no-underline"
              >
                <span>Get Free API Key</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              </a>
            </div>

            <form onSubmit={handleSavePageSpeedKey} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5">
                  PageSpeed API Key:
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="AIzaSyB..."
                    value={pageSpeedApiKey}
                    onChange={(e) => setPageSpeedApiKey(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1.5 block">
                  Enter your Google Cloud PageSpeed API Key. Key will be saved securely to your environment.
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingPageSpeedKey || !pageSpeedApiKey.trim()}
                  className="group relative flex justify-center items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{savingPageSpeedKey ? 'Saving...' : 'Save PageSpeed Key'}</span>
                </button>

                {pageSpeedKeyMsg && (
                  <p className={`text-xs font-bold ${pageSpeedKeyMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {pageSpeedKeyMsg.text}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
