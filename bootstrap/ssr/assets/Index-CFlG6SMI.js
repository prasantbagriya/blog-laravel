import AdminLayout from "./AdminLayout-BIseTwOl.js";
import { Head, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, BarChart3, Calendar, Check, CheckCircle2, Copy, Globe, Info, RefreshCw, Search, Settings, XCircle, Zap } from "lucide-react";
//#region resources/js/Pages/Admin/Bing/Index.jsx
function BingWebmasterIndex({ settings: initialSettings = {}, recentLogs = [], defaultUrls = [], callbackSuccess = false, callbackError = null, initialTab = "performance" }) {
	const [activeTab, setActiveTab] = useState(initialTab || "performance");
	const [settings, setSettings] = useState(initialSettings || {});
	const [analytics, setAnalytics] = useState(null);
	const [loadingAnalytics, setLoadingAnalytics] = useState(false);
	const [analyticsError, setAnalyticsError] = useState(null);
	const [queryFilter, setQueryFilter] = useState("");
	const [dateRange, setDateRange] = useState(28);
	const [customStartDate, setCustomStartDate] = useState("");
	const [customEndDate, setCustomEndDate] = useState("");
	const [showCustomPicker, setShowCustomPicker] = useState(false);
	const [urlInput, setUrlInput] = useState(defaultUrls[0]?.url || "https://coachingsinsikar.com");
	const [batchMode, setBatchMode] = useState(false);
	const [batchUrlsInput, setBatchUrlsInput] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [submitMessage, setSubmitMessage] = useState(null);
	const [logs, setLogs] = useState(recentLogs || []);
	const [crawlStats, setCrawlStats] = useState(null);
	const [loadingCrawlStats, setLoadingCrawlStats] = useState(false);
	const [sitemaps, setSitemaps] = useState([]);
	const [loadingSitemaps, setLoadingSitemaps] = useState(false);
	const [newSitemapUrl, setNewSitemapUrl] = useState("https://coachingsinsikar.com/sitemap.xml");
	const [submittingSitemap, setSubmittingSitemap] = useState(false);
	const [sitemapMessage, setSitemapMessage] = useState(null);
	const [clientId, setClientId] = useState(settings.client_id || "");
	const [clientSecret, setClientSecret] = useState("");
	const [siteUrl, setSiteUrl] = useState(settings.site_url || "https://coachingsinsikar.com/");
	const [apiKey, setApiKey] = useState(settings.api_key || "");
	const [autoIndex, setAutoIndex] = useState(settings.auto_index_posts ?? true);
	const [savingSettings, setSavingSettings] = useState(false);
	const [settingsMessage, setSettingsMessage] = useState(null);
	const [copiedRedirect, setCopiedRedirect] = useState(false);
	const csrfHeaders = () => {
		const token = document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content");
		return token ? { "X-CSRF-TOKEN": token } : {};
	};
	const hasAuth = settings.is_connected || settings.has_api_key;
	const fetchAnalytics = async (days = dateRange, customStart = customStartDate, customEnd = customEndDate) => {
		if (!hasAuth) return;
		setLoadingAnalytics(true);
		setAnalyticsError(null);
		try {
			let url = "/api/admin/bing/analytics";
			if (days === "custom" && customStart && customEnd) url += `?start_date=${customStart}&end_date=${customEnd}`;
			else if (days) url += `?days=${days}`;
			const data = await (await fetch(url)).json();
			if (data.success) {
				setAnalytics(data);
				if (data.error) setAnalyticsError(data.error);
			} else {
				setAnalytics(data);
				setAnalyticsError(data.error || "Bing Webmaster API returned no data.");
			}
		} catch (err) {
			console.error(err);
			setAnalyticsError(err.message);
		} finally {
			setLoadingAnalytics(false);
		}
	};
	const fetchCrawlStats = async () => {
		if (!hasAuth) return;
		setLoadingCrawlStats(true);
		try {
			const data = await (await fetch("/api/admin/bing/crawl-stats")).json();
			if (data.success) setCrawlStats(data.stats || []);
		} catch (err) {
			console.error(err);
		} finally {
			setLoadingCrawlStats(false);
		}
	};
	const fetchSitemaps = async () => {
		if (!hasAuth) return;
		setLoadingSitemaps(true);
		try {
			const data = await (await fetch("/api/admin/bing/sitemaps")).json();
			if (data.success) setSitemaps(data.sitemaps || []);
		} catch (err) {
			console.error(err);
		} finally {
			setLoadingSitemaps(false);
		}
	};
	useEffect(() => {
		if (hasAuth) {
			if (activeTab === "performance") fetchAnalytics();
			if (activeTab === "crawl") fetchCrawlStats();
			if (activeTab === "sitemaps") fetchSitemaps();
		}
	}, [
		activeTab,
		settings.is_connected,
		settings.has_api_key
	]);
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
			const data = await (await fetch("/api/admin/bing/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				},
				body: JSON.stringify({ url: urlInput })
			})).json();
			if (data.success) {
				setSubmitMessage({
					type: "success",
					text: data.message
				});
				setLogs((prev) => [{
					id: Date.now(),
					url: urlInput,
					method: "oauth_api",
					status: "success",
					http_code: data.status_code || 200,
					response_message: data.message,
					created_at_human: "Just now"
				}, ...prev]);
				if (data.remaining_quota !== void 0) setSettings((s) => ({
					...s,
					daily_quota_remaining: data.remaining_quota
				}));
			} else setSubmitMessage({
				type: "error",
				text: data.error || data.message || "Submission failed."
			});
		} catch (err) {
			setSubmitMessage({
				type: "error",
				text: err.message
			});
		} finally {
			setSubmitting(false);
		}
	};
	const handleBatchSubmit = async () => {
		const list = batchUrlsInput.split("\n").map((u) => u.trim()).filter((u) => u.startsWith("http"));
		if (list.length === 0) {
			setSubmitMessage({
				type: "error",
				text: "Please enter at least one valid HTTP/HTTPS URL."
			});
			return;
		}
		setSubmitting(true);
		setSubmitMessage(null);
		try {
			const data = await (await fetch("/api/admin/bing/submit-batch", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				},
				body: JSON.stringify({ urls: list })
			})).json();
			if (data.success) {
				setSubmitMessage({
					type: "success",
					text: data.message
				});
				setBatchUrlsInput("");
			} else setSubmitMessage({
				type: "error",
				text: data.error || "Batch submission failed."
			});
		} catch (err) {
			setSubmitMessage({
				type: "error",
				text: err.message
			});
		} finally {
			setSubmitting(false);
		}
	};
	const handleSubmitSitemap = async (e) => {
		e?.preventDefault();
		if (!newSitemapUrl.trim()) return;
		setSubmittingSitemap(true);
		setSitemapMessage(null);
		try {
			const data = await (await fetch("/api/admin/bing/sitemaps/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				},
				body: JSON.stringify({ sitemap_url: newSitemapUrl })
			})).json();
			if (data.success) {
				setSitemapMessage({
					type: "success",
					text: data.message
				});
				fetchSitemaps();
			} else setSitemapMessage({
				type: "error",
				text: data.error || "Failed to submit sitemap."
			});
		} catch (err) {
			setSitemapMessage({
				type: "error",
				text: err.message
			});
		} finally {
			setSubmittingSitemap(false);
		}
	};
	const handleSaveSettings = async (e) => {
		e?.preventDefault();
		setSavingSettings(true);
		setSettingsMessage(null);
		try {
			const data = await (await fetch("/api/admin/bing/settings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				},
				body: JSON.stringify({
					client_id: clientId,
					client_secret: clientSecret || void 0,
					site_url: siteUrl,
					api_key: apiKey || void 0,
					auto_index_posts: autoIndex
				})
			})).json();
			if (data.success) setSettingsMessage({
				type: "success",
				text: data.message
			});
			else setSettingsMessage({
				type: "error",
				text: data.error || "Failed to save settings."
			});
		} catch (err) {
			setSettingsMessage({
				type: "error",
				text: err.message
			});
		} finally {
			setSavingSettings(false);
		}
	};
	const handleDisconnect = async () => {
		if (!confirm("Are you sure you want to disconnect Bing Webmaster Tools?")) return;
		try {
			if ((await fetch("/api/admin/bing/disconnect", {
				method: "POST",
				headers: { ...csrfHeaders() }
			})).ok) window.location.reload();
		} catch (err) {
			alert(err.message);
		}
	};
	const redirectUriText = "https://coachingsinsikar.com/auth/bing/callback";
	const handleCopyRedirect = () => {
		navigator.clipboard?.writeText(redirectUriText);
		setCopiedRedirect(true);
		setTimeout(() => setCopiedRedirect(false), 2e3);
	};
	const filteredQueries = useMemo(() => {
		if (!analytics?.queries) return [];
		if (!queryFilter) return analytics.queries;
		return analytics.queries.filter((q) => q.query.toLowerCase().includes(queryFilter.toLowerCase()));
	}, [analytics, queryFilter]);
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Bing Webmaster Tools & IndexNow Hub | Admin" }),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800",
					children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 rounded-xl bg-sky-600/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xl",
							children: /* @__PURE__ */ jsx(Globe, { className: "w-6 h-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
							children: "Bing Webmaster Tools & IndexNow Hub"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-slate-500 dark:text-zinc-400 mt-0.5",
							children: "Real-time rankings, instant indexing (up to 10,000 URLs/day), crawl health, and sitemaps for Bing, Yahoo, DuckDuckGo & Copilot."
						})] })]
					}) }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 flex-wrap",
						children: [
							hasAuth ? /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60",
								children: [
									/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
									"Connected: ",
									settings.site_url
								]
							}) : /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60",
								children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500" }), "Not Connected"]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold border border-slate-200 dark:border-zinc-700",
								children: [/* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ jsxs("span", { children: [settings.daily_quota_remaining?.toLocaleString() || "10,000", " Quota / Day"] })]
							}),
							hasAuth ? /* @__PURE__ */ jsxs("button", {
								onClick: () => {
									fetchAnalytics();
									fetchCrawlStats();
									fetchSitemaps();
								},
								disabled: loadingAnalytics,
								className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer",
								children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${loadingAnalytics ? "animate-spin" : ""}` }), /* @__PURE__ */ jsx("span", { children: "Sync Bing Data" })]
							}) : /* @__PURE__ */ jsxs("a", {
								href: "/auth/bing",
								className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-colors cursor-pointer no-underline",
								children: [/* @__PURE__ */ jsx("span", { children: "Connect with Bing" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
							})
						]
					})]
				}),
				callbackSuccess && /* @__PURE__ */ jsxs("div", {
					className: "mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Microsoft Bing Webmaster Tools connected successfully! Live data is now active." })]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => router.visit("/admin/bing"),
						className: "text-xs underline cursor-pointer shrink-0",
						children: "Dismiss"
					})]
				}),
				callbackError && /* @__PURE__ */ jsxs("div", {
					className: "mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm font-semibold flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" }), /* @__PURE__ */ jsxs("span", { children: ["Connection Error: ", callbackError] })]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => router.visit("/admin/bing"),
						className: "text-xs underline cursor-pointer shrink-0",
						children: "Dismiss"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-slate-200 dark:border-zinc-800",
					children: [
						{
							id: "performance",
							label: "Search Performance",
							icon: BarChart3
						},
						{
							id: "indexing",
							label: "Instant Indexing",
							icon: Zap
						},
						{
							id: "crawl",
							label: "Crawl & Health",
							icon: Activity
						},
						{
							id: "sitemaps",
							label: "Sitemaps",
							icon: Globe
						},
						{
							id: "settings",
							label: "Settings & OAuth",
							icon: Settings
						}
					].map((tab) => {
						const Icon = tab.icon;
						return /* @__PURE__ */ jsxs("button", {
							onClick: () => setActiveTab(tab.id),
							className: `flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "bg-sky-600 text-white shadow-md shadow-sky-600/20" : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"}`,
							children: [/* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: tab.label })]
						}, tab.id);
					})
				})
			]
		}),
		activeTab === "performance" && /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				!hasAuth && /* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-extrabold text-slate-900 dark:text-white text-base",
							children: "Connect Bing Webmaster Tools"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-600 dark:text-zinc-300",
							children: "Authenticate using your Microsoft OAuth credentials or enter an API key to load live Bing clicks, impressions, and query rankings."
						})]
					}), /* @__PURE__ */ jsx("a", {
						href: "/auth/bing",
						className: "px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition whitespace-nowrap self-start sm:self-auto cursor-pointer no-underline",
						children: "Connect with Bing ➔"
					})]
				}),
				analyticsError && /* @__PURE__ */ jsxs("div", {
					className: "p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3 shadow-sm",
					children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-bold text-sm",
								children: "Bing Webmaster API Notice"
							}),
							/* @__PURE__ */ jsx("div", { children: analyticsError }),
							/* @__PURE__ */ jsxs("div", {
								className: "text-[11px] text-amber-700 dark:text-amber-300",
								children: [
									"Tip: Verify that ",
									/* @__PURE__ */ jsx("strong", { children: settings.site_url || "https://coachingsinsikar.com/" }),
									" matches your verified site URL inside Bing Webmaster Tools, or verify your API key / OAuth status."
								]
							})
						]
					})]
				}),
				!analyticsError && hasAuth && analytics && analytics.total_clicks === 0 && analytics.total_impressions === 0 && /* @__PURE__ */ jsxs("div", {
					className: "p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-sky-900 dark:text-sky-200 text-xs flex items-start gap-3 shadow-sm",
					children: [/* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-bold text-sm",
								children: "Bing Search Telemetry In Progress"
							}),
							/* @__PURE__ */ jsxs("div", { children: [
								"Bing Webmaster Tools is connected, but Bing has not yet recorded organic search clicks or impressions for this site. Bing Search Console data typically takes ",
								/* @__PURE__ */ jsx("strong", { children: "24 to 48 hours" }),
								" to accumulate after sitemap submission and site indexing."
							] }),
							/* @__PURE__ */ jsx("div", {
								className: "text-[11px] text-sky-700 dark:text-sky-300",
								children: "Your submitted sitemaps and URLs are active. As soon as visitors search and view your pages on Bing, query rankings and impressions will show here automatically."
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold uppercase text-slate-500 dark:text-zinc-400",
								children: "Date Range:"
							}),
							[
								{
									label: "24H",
									days: 1
								},
								{
									label: "7D",
									days: 7
								},
								{
									label: "28D",
									days: 28
								},
								{
									label: "3M",
									days: 90
								}
							].map((r) => /* @__PURE__ */ jsx("button", {
								onClick: () => {
									setDateRange(r.days);
									setShowCustomPicker(false);
									fetchAnalytics(r.days);
								},
								className: `px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${dateRange === r.days ? "bg-sky-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"}`,
								children: r.label
							}, r.days)),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setShowCustomPicker(!showCustomPicker),
								className: `px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${dateRange === "custom" ? "bg-sky-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"}`,
								children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Custom" })]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-xs text-slate-500 font-medium",
						children: [analytics?.queries?.length || 0, " Queries Recorded"]
					})]
				}),
				showCustomPicker && /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-3 bg-sky-50/70 dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-sky-200 dark:border-zinc-700 animate-in fade-in duration-150",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300",
							children: [/* @__PURE__ */ jsx("span", { children: "Start Date:" }), /* @__PURE__ */ jsx("input", {
								type: "date",
								value: customStartDate,
								onChange: (e) => setCustomStartDate(e.target.value),
								className: "px-2.5 py-1 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium outline-none"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300",
							children: [/* @__PURE__ */ jsx("span", { children: "End Date:" }), /* @__PURE__ */ jsx("input", {
								type: "date",
								value: customEndDate,
								onChange: (e) => setCustomEndDate(e.target.value),
								className: "px-2.5 py-1 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium outline-none"
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => {
								if (!customStartDate || !customEndDate) {
									alert("Please select both start and end dates");
									return;
								}
								setDateRange("custom");
								fetchAnalytics("custom", customStartDate, customEndDate);
							},
							className: "px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer",
							children: "Apply Custom Range"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-400",
									children: "Bing Search Clicks"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl font-black text-sky-600 dark:text-sky-400",
									children: analytics?.total_clicks?.toLocaleString() || "0"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-500",
									children: "Users visiting from Bing search"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-400",
									children: "Total Impressions"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl font-black text-slate-900 dark:text-white",
									children: analytics?.total_impressions?.toLocaleString() || "0"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-500",
									children: "Search results appearances on Bing"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-400",
									children: "Average Click-Through (CTR)"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-3xl font-black text-emerald-600 dark:text-emerald-400",
									children: [analytics?.average_ctr || "0", "%"]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-500",
									children: "Clicks divided by impressions"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-400",
									children: "Daily Submission Quota"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl font-black text-purple-600 dark:text-purple-400",
									children: settings.daily_quota_remaining?.toLocaleString() || "10,000"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-500",
									children: "Fast-track URLs available today"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden space-y-4 p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-extrabold text-slate-900 dark:text-white",
							children: "Top Bing Search Queries"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
							children: "Actual search terms users entered into Bing to find your website."
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "relative group w-full sm:w-64",
							children: [/* @__PURE__ */ jsx("div", {
								className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
								children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" })
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "Filter queries...",
								value: queryFilter,
								onChange: (e) => setQueryFilter(e.target.value),
								className: "block w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
							})]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto max-h-[460px]",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full min-w-[550px] text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "sticky top-0 bg-slate-50 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "p-3",
										children: "Query"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "Clicks"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "Impressions"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "CTR"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "Avg Position"
									})
								] })
							}), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100 dark:divide-zinc-800",
								children: loadingAnalytics ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", {
									colSpan: 5,
									className: "p-8 text-center text-slate-500",
									children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-6 h-6 animate-spin mx-auto text-sky-500 mb-2" }), /* @__PURE__ */ jsx("p", {
										className: "text-xs font-semibold",
										children: "Loading search queries from Bing..."
									})]
								}) }) : filteredQueries.length > 0 ? filteredQueries.map((q, idx) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-3 font-bold text-slate-900 dark:text-white",
											children: q.query
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-right font-extrabold text-sky-600 dark:text-sky-400",
											children: q.clicks
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-right text-slate-600 dark:text-zinc-300",
											children: q.impressions
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "p-3 text-right font-semibold text-emerald-600 dark:text-emerald-400",
											children: [q.ctr, "%"]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-right text-slate-600 dark:text-zinc-300",
											children: q.avg_click_position || q.avg_impression_position || "-"
										})
									]
								}, idx)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", {
									colSpan: 5,
									className: "p-8 text-center text-slate-500 space-y-1",
									children: [
										/* @__PURE__ */ jsx(Globe, { className: "w-8 h-8 mx-auto text-slate-400 opacity-40 mb-2" }),
										/* @__PURE__ */ jsx("p", {
											className: "font-bold text-slate-700 dark:text-zinc-300",
											children: "No Query Data Available Yet"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[11px]",
											children: "Sync your account or submit URLs to accelerate Bing crawl activity."
										})
									]
								}) })
							})]
						})
					})]
				})
			]
		}),
		activeTab === "indexing" && /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2",
						children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-xl bg-sky-600/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold",
								children: /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-extrabold text-slate-900 dark:text-white",
								children: "Instant Bingbot & IndexNow URL Submission"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm text-slate-500 dark:text-zinc-400 mt-0.5",
								children: "Fast-track URLs directly into Microsoft Bing, Yahoo, DuckDuckGo and Copilot search within minutes."
							})] })]
						}) }), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2 shrink-0",
							children: /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setBatchMode(!batchMode),
								className: `px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${batchMode ? "bg-sky-600 text-white border-sky-600" : "border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100"}`,
								children: batchMode ? "Switch to Single URL" : "Batch Submission Mode"
							})
						})]
					}),
					!batchMode ? /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmitUrl,
						className: "flex flex-col sm:flex-row gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1 group",
							children: [/* @__PURE__ */ jsx("div", {
								className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
								children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" })
							}), /* @__PURE__ */ jsx("input", {
								type: "url",
								required: true,
								placeholder: "https://coachingsinsikar.com/blog/best-neet-coaching-sikar",
								value: urlInput,
								onChange: (e) => setUrlInput(e.target.value),
								className: "block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-sky-500"
							})]
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: submitting || !urlInput,
							className: "group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-sky-500/20 cursor-pointer shrink-0",
							children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Submitting to Bingbot..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "Push to Bingbot ⚡" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })] })
						})]
					}) : /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmitUrl,
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("textarea", {
							rows: 4,
							placeholder: `https://coachingsinsikar.com/blog/post-1\nhttps://coachingsinsikar.com/blog/post-2\nhttps://coachingsinsikar.com/blog/post-3`,
							value: batchUrlsInput,
							onChange: (e) => setBatchUrlsInput(e.target.value),
							className: "block w-full p-4 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: submitting || !batchUrlsInput.trim(),
							className: "px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-xl shadow-md shadow-sky-600/20 transition cursor-pointer disabled:opacity-50",
							children: submitting ? "Submitting Batch..." : "Submit Batch to Bingbot 🚀"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-slate-400 font-semibold shrink-0",
							children: "Quick URLs:"
						}), defaultUrls.map((item, idx) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setUrlInput(item.url),
							className: "px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-zinc-700 font-medium whitespace-nowrap transition cursor-pointer text-[11px]",
							children: item.label
						}, idx))]
					}),
					submitMessage && /* @__PURE__ */ jsxs("div", {
						className: `p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${submitMessage.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"}`,
						children: [submitMessage.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: submitMessage.text })]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6 space-y-4",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-base font-extrabold text-slate-900 dark:text-white",
					children: "Recent Bingbot Submission Logs"
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto max-h-[380px]",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[600px] text-left text-xs border-collapse",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "sticky top-0 bg-slate-50 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Submitted URL"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Method"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Response"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3 text-right",
									children: "Time"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100 dark:divide-zinc-800",
							children: logs.length > 0 ? logs.map((log) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "p-3 font-mono font-semibold text-slate-900 dark:text-white max-w-[280px] truncate",
										title: log.url,
										children: log.url
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3",
										children: /* @__PURE__ */ jsx("span", {
											className: "px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold uppercase text-[10px]",
											children: log.method
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3",
										children: log.status === "success" ? /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold",
											children: [
												/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }),
												" Success (",
												log.http_code || 200,
												")"
											]
										}) : /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold",
											children: [/* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5" }), " Failed"]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3 text-slate-500 max-w-[240px] truncate",
										title: log.response_message,
										children: log.response_message || "OK"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3 text-right text-slate-500 whitespace-nowrap",
										children: log.created_at_human || log.created_at
									})
								]
							}, log.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 5,
								className: "p-8 text-center text-slate-500",
								children: "No submissions recorded yet. Enter a URL above to test instant indexing."
							}) })
						})]
					})
				})]
			})]
		}),
		activeTab === "crawl" && /* @__PURE__ */ jsx("div", {
			className: "space-y-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-extrabold text-slate-900 dark:text-white",
						children: "Bingbot Crawl & Index Health (GetCrawlStats)"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 dark:text-zinc-400",
						children: "Historical crawl activity and HTTP status report directly from Microsoft's indexing infrastructure."
					}),
					loadingCrawlStats ? /* @__PURE__ */ jsxs("div", {
						className: "py-12 text-center text-slate-500",
						children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-6 h-6 animate-spin mx-auto text-sky-500 mb-2" }), /* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold",
							children: "Querying Bingbot crawl telemetry..."
						})]
					}) : crawlStats && crawlStats.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full min-w-[650px] text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "p-3",
										children: "Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "In Index"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "Crawl Errors"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "2xx Success"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "4xx Missing"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "5xx Server Err"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-3 text-right",
										children: "InLinks"
									})
								] })
							}), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100 dark:divide-zinc-800",
								children: crawlStats.map((item, idx) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-3 font-semibold text-slate-900 dark:text-white",
											children: item.Date ? new Date(item.Date).toLocaleDateString() : "N/A"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-right font-bold text-sky-600 dark:text-sky-400",
											children: item.PagesInIndex ?? "-"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-right font-bold text-rose-600 dark:text-rose-400",
											children: item.CrawlErrors ?? 0
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-right text-emerald-600 font-bold",
											children: item.Code2xx ?? "-"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-right text-amber-600",
											children: item.Code4xx ?? 0
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-right text-rose-600",
											children: item.Code5xx ?? 0
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-right text-slate-600 dark:text-zinc-300",
											children: item.InLinks ?? "-"
										})
									]
								}, idx))
							})]
						})
					}) : /* @__PURE__ */ jsxs("div", {
						className: "p-8 text-center text-slate-500 space-y-2",
						children: [
							/* @__PURE__ */ jsx(Activity, { className: "w-8 h-8 mx-auto text-slate-400 opacity-40 mb-2" }),
							/* @__PURE__ */ jsx("p", {
								className: "font-bold text-slate-700 dark:text-zinc-300",
								children: "Crawl Telemetry Syncing"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs max-w-md mx-auto",
								children: "Bing updates crawl telemetry on weekly cycles. Once Bingbot begins crawling your submitted sitemaps, data will appear here."
							})
						]
					})
				]
			})
		}),
		activeTab === "sitemaps" && /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-extrabold text-slate-900 dark:text-white",
						children: "Bing Sitemaps Management"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 dark:text-zinc-400",
						children: "Submit XML sitemaps directly to Bing to ensure all blog posts, categories, and coachings are indexed."
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmitSitemap,
						className: "flex flex-col sm:flex-row gap-3 pt-2",
						children: [/* @__PURE__ */ jsx("input", {
							type: "url",
							required: true,
							value: newSitemapUrl,
							onChange: (e) => setNewSitemapUrl(e.target.value),
							className: "flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: submittingSitemap || !newSitemapUrl,
							className: "px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-600/20 transition cursor-pointer disabled:opacity-50 shrink-0",
							children: submittingSitemap ? "Submitting..." : "Submit Sitemap to Bing"
						})]
					}),
					sitemapMessage && /* @__PURE__ */ jsxs("div", {
						className: `p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${sitemapMessage.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200" : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200"}`,
						children: [sitemapMessage.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: sitemapMessage.text })]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6 space-y-4",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-base font-extrabold text-slate-900 dark:text-white",
					children: "Registered Sitemaps on Bing"
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[500px] text-left text-xs border-collapse",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Sitemap URL"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3 text-right",
									children: "Last Crawled"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3 text-right",
									children: "Status"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100 dark:divide-zinc-800",
							children: sitemaps.length > 0 ? sitemaps.map((item, idx) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "p-3 font-mono font-semibold text-slate-900 dark:text-white",
										children: item.Url || item.url
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3 text-right text-slate-500",
										children: item.LastSubmitted || item.LastCrawled || "Recently"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-3 text-right font-bold text-emerald-600",
										children: "Active"
									})
								]
							}, idx)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 3,
								className: "p-8 text-center text-slate-500",
								children: "No sitemaps retrieved from Bing yet. Click above to submit `sitemap.xml`."
							}) })
						})]
					})
				})]
			})]
		}),
		activeTab === "settings" && /* @__PURE__ */ jsx("div", {
			className: "space-y-6 max-w-4xl",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "border-b border-slate-200 dark:border-zinc-800 pb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-extrabold text-slate-900 dark:text-white",
							children: "Microsoft Bing OAuth 2.0 Credentials"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
							children: "Manage your Bing Webmaster OAuth Client ID, Client Secret, and verified Site URL."
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 space-y-2",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "text-xs font-bold text-sky-900 dark:text-sky-200",
								children: "Required Bing Webmaster OAuth Redirect URI:"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("code", {
									className: "flex-1 p-2 bg-white dark:bg-zinc-900 border border-sky-300 dark:border-sky-800 rounded-lg text-xs font-mono text-sky-950 dark:text-sky-300 select-all",
									children: redirectUriText
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleCopyRedirect,
									className: "px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0",
									children: [copiedRedirect ? /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: copiedRedirect ? "Copied!" : "Copy URI" })]
								})]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-[11px] text-sky-700 dark:text-sky-300",
								children: [
									"Ensure this exact URI is pasted under ",
									/* @__PURE__ */ jsx("strong", { children: "Bing Webmaster Settings ➔ API Access ➔ OAuth Client" }),
									"."
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleSaveSettings,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5",
								children: "Bing OAuth Client ID"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: clientId,
								onChange: (e) => setClientId(e.target.value),
								className: "w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-transparent font-mono text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5",
								children: "Bing OAuth Client Secret"
							}), /* @__PURE__ */ jsx("input", {
								type: "password",
								placeholder: settings.has_client_secret ? "••••••••••••••••••••••••" : "Paste new Client Secret",
								value: clientSecret,
								onChange: (e) => setClientSecret(e.target.value),
								className: "w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-transparent font-mono text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5",
									children: "Bing Webmaster API Key (Alternative / Direct Access)"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "password",
									placeholder: settings.has_api_key ? "••••••••••••••••••••••••" : "Enter Bing API Key from Webmaster Portal",
									value: apiKey,
									onChange: (e) => setApiKey(e.target.value),
									className: "w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-transparent font-mono text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-slate-500 dark:text-zinc-400 mt-1",
									children: [
										"Direct API Key alternative to OAuth. Generate it at ",
										/* @__PURE__ */ jsx("a", {
											href: "https://www.bing.com/webmasters/settings/api",
											target: "_blank",
											rel: "noreferrer",
											className: "text-sky-600 dark:text-sky-400 font-bold underline",
											children: "Bing Webmaster Portal ➔ Settings ➔ API Access"
										}),
										"."
									]
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5",
									children: "Verified Site URL"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "url",
									value: siteUrl,
									onChange: (e) => setSiteUrl(e.target.value),
									className: "w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-transparent font-mono text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-slate-500 dark:text-zinc-400 mt-1",
									children: [
										"Must match the exact URL prefix registered in Bing Webmaster Tools (e.g. ",
										/* @__PURE__ */ jsx("code", { children: "https://coachingsinsikar.com/" }),
										")."
									]
								})
							] }),
							/* @__PURE__ */ jsx("div", {
								className: "pt-2",
								children: /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-3 cursor-pointer select-none",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: autoIndex,
										onChange: (e) => setAutoIndex(e.target.checked),
										className: "w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-slate-700 dark:text-zinc-300",
										children: "Automatically submit new blog posts and businesses to Bingbot upon publishing"
									})]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: savingSettings,
									className: "px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-600/20 transition cursor-pointer disabled:opacity-50",
									children: savingSettings ? "Saving..." : "Save Settings"
								}), settings.is_connected && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleDisconnect,
									className: "px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold text-xs transition cursor-pointer",
									children: "Disconnect Bing"
								})]
							}),
							settingsMessage && /* @__PURE__ */ jsxs("div", {
								className: `p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${settingsMessage.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200" : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200"}`,
								children: [settingsMessage.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: settingsMessage.text })]
							})
						]
					})
				]
			})
		})
	] });
}
//#endregion
export { BingWebmasterIndex as default };
