import AdminLayout from "./AdminLayout-CeDz327F.js";
import PageSpeedTab from "./PageSpeedTab-Dg-LRdER.js";
import { Head, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, BarChart3, Calendar, Check, CheckCircle2, Clock, Copy, ExternalLink, Gauge, Globe, Key, Link as Link$1, Lock, RefreshCw, Search, Settings, ShieldCheck, Smartphone, Sparkles, Terminal, Trash2, TrendingUp, Zap } from "lucide-react";
//#region resources/js/Pages/Admin/SearchConsole/Index.jsx
function SearchConsoleIndex({ settings: initialSettings, localSitemaps = [], initialSitemaps = [], cachedQueries = [], recentLogs = [], callbackSuccess = false, callbackError = null, pageSpeedData = {}, initialTab = "performance" }) {
	const [activeTab, setActiveTab] = useState(initialTab || "performance");
	const [settings, setSettings] = useState(initialSettings || {});
	const [loadingAnalytics, setLoadingAnalytics] = useState(false);
	const [analyticsData, setAnalyticsData] = useState(null);
	const [dateRange, setDateRange] = useState(28);
	const [searchType, setSearchType] = useState("web");
	const [customStartDate, setCustomStartDate] = useState("");
	const [customEndDate, setCustomEndDate] = useState("");
	const [showCustomPicker, setShowCustomPicker] = useState(false);
	const [inspectUrlInput, setInspectUrlInput] = useState("");
	const [inspecting, setInspecting] = useState(false);
	const [inspectionResult, setInspectionResult] = useState(null);
	const [inspectError, setInspectError] = useState(null);
	const [pageSpeedTargetUrl, setPageSpeedTargetUrl] = useState("");
	const [indexUrlInput, setIndexUrlInput] = useState("");
	const [indexAction, setIndexAction] = useState("URL_UPDATED");
	const [indexing, setIndexing] = useState(false);
	const [indexLogs, setIndexLogs] = useState(recentLogs || []);
	const [indexMessage, setIndexMessage] = useState(null);
	const [testingIndexing, setTestingIndexing] = useState(false);
	const [testIndexingResult, setTestIndexingResult] = useState(null);
	const [copiedEmail, setCopiedEmail] = useState(false);
	const [loadingIndexLogs, setLoadingIndexLogs] = useState(false);
	const [sitemaps, setSitemaps] = useState(initialSitemaps || []);
	const [loadingSitemaps, setLoadingSitemaps] = useState(false);
	const [submittingSitemap, setSubmittingSitemap] = useState(false);
	const [deletingSitemapPath, setDeletingSitemapPath] = useState(null);
	const [sitemapMessage, setSitemapMessage] = useState(null);
	const [newSitemapPath, setNewSitemapPath] = useState("");
	const [opportunities, setOpportunities] = useState(null);
	const [loadingOpportunities, setLoadingOpportunities] = useState(false);
	const [clientId, setClientId] = useState(settings.client_id || "");
	const [clientSecret, setClientSecret] = useState("");
	const [redirectUri, setRedirectUri] = useState(settings.redirect_uri || "");
	const [propertyId, setPropertyId] = useState(settings.property_id || "https://coachingsinsikar.com/");
	const [manualCode, setManualCode] = useState("");
	const [savingSettings, setSavingSettings] = useState(false);
	const [settingsSuccess, setSettingsSuccess] = useState(null);
	const [settingsError, setSettingsError] = useState(null);
	const [autoIndexPosts, setAutoIndexPosts] = useState(settings.auto_index_posts ?? true);
	const [autoIndexBusinesses, setAutoIndexBusinesses] = useState(settings.auto_index_businesses ?? true);
	const [queryFilter, setQueryFilter] = useState("");
	const [pageFilter, setPageFilter] = useState("");
	const csrfHeaders = () => {
		const token = document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content");
		return token ? { "X-CSRF-TOKEN": token } : {};
	};
	const fetchAnalytics = async (days = dateRange, type = searchType, customStart = customStartDate, customEnd = customEndDate) => {
		if (!settings.is_connected) return;
		setLoadingAnalytics(true);
		try {
			let url = `/api/admin/gsc/analytics?type=${type}`;
			if (days === "custom" && customStart && customEnd) url += `&start_date=${customStart}&end_date=${customEnd}`;
			else url += `&days=${days}`;
			const data = await (await fetch(url)).json();
			if (data.success) setAnalyticsData(data);
		} catch (err) {
			console.error("Failed to load GSC Analytics:", err);
		} finally {
			setLoadingAnalytics(false);
		}
	};
	const fetchSitemaps = async () => {
		if (!settings.is_connected) return;
		setLoadingSitemaps(true);
		try {
			const data = await (await fetch("/api/admin/gsc/sitemaps")).json();
			if (data.success) setSitemaps(data.sitemaps || []);
		} catch (err) {
			console.error(err);
		} finally {
			setLoadingSitemaps(false);
		}
	};
	const fetchOpportunities = async () => {
		setLoadingOpportunities(true);
		try {
			const data = await (await fetch("/api/admin/gsc/opportunities")).json();
			if (data.success) setOpportunities(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoadingOpportunities(false);
		}
	};
	const formatSitemapDate = (dateStr) => {
		if (!dateStr) return "Pending / Never";
		try {
			const d = new Date(dateStr);
			if (isNaN(d.getTime())) return dateStr;
			return d.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric"
			});
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
		if (activeTab === "sitemaps" && settings.is_connected) fetchSitemaps();
	}, [activeTab]);
	const handleInspectUrl = async (e) => {
		e?.preventDefault();
		if (!inspectUrlInput) return;
		setInspecting(true);
		setInspectError(null);
		setInspectionResult(null);
		try {
			const data = await (await fetch("/api/admin/gsc/inspect", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				},
				body: JSON.stringify({ url: inspectUrlInput })
			})).json();
			if (data.success) setInspectionResult(data.inspection?.inspectionResult || null);
			else setInspectError(data.error || "Inspection failed.");
		} catch (err) {
			setInspectError(err.message);
		} finally {
			setInspecting(false);
		}
	};
	const handleCopyEmail = (email) => {
		if (!email) return;
		navigator.clipboard?.writeText(email);
		setCopiedEmail(true);
		setTimeout(() => setCopiedEmail(false), 2e3);
	};
	const handleTestIndexing = async () => {
		setTestingIndexing(true);
		setTestIndexingResult(null);
		try {
			const data = await (await fetch("/api/admin/gsc/test-indexing", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				}
			})).json();
			setTestIndexingResult(data);
		} catch (err) {
			setTestIndexingResult({
				success: false,
				error: err.message
			});
		} finally {
			setTestingIndexing(false);
		}
	};
	const fetchIndexingLogs = async () => {
		setLoadingIndexLogs(true);
		try {
			const logsData = await (await fetch("/api/admin/gsc/indexing-logs")).json();
			if (logsData.success) setIndexLogs(logsData.logs);
		} catch (err) {
			console.error(err);
		} finally {
			setLoadingIndexLogs(false);
		}
	};
	const handlePublishIndex = async (e) => {
		e?.preventDefault();
		if (!indexUrlInput) return;
		setIndexing(true);
		setIndexMessage(null);
		const urls = indexUrlInput.split("\n").map((u) => u.trim()).filter(Boolean);
		try {
			const data = await (await fetch("/api/admin/gsc/index-url", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				},
				body: JSON.stringify({
					urls,
					action: indexAction
				})
			})).json();
			if (data.success) {
				const failedItems = (data.results || []).filter((r) => !r.success || r.status === "failed" || r.http_code === 403);
				if (failedItems.length > 0) {
					const firstMsg = failedItems[0].message || "Some URLs failed ownership verification.";
					setIndexMessage({
						type: "error",
						text: `${failedItems.length} of ${urls.length} URL(s) failed. Google response: ${firstMsg}`
					});
				} else {
					setIndexMessage({
						type: "success",
						text: `Successfully submitted ${urls.length} URL(s) to Googlebot!`
					});
					setIndexUrlInput("");
				}
				fetchIndexingLogs();
			} else setIndexMessage({
				type: "error",
				text: data.error || "Failed to publish URLs."
			});
		} catch (err) {
			setIndexMessage({
				type: "error",
				text: err.message
			});
		} finally {
			setIndexing(false);
		}
	};
	const handleSubmitSitemap = async (path) => {
		const targetPath = path || newSitemapPath;
		if (!targetPath) return;
		setSubmittingSitemap(true);
		setSitemapMessage(null);
		try {
			const data = await (await fetch("/api/admin/gsc/sitemaps/submit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				},
				body: JSON.stringify({ feedpath: targetPath })
			})).json();
			if (data.success) {
				setSitemapMessage({
					type: "success",
					text: data.message || `Sitemap ${targetPath} submitted successfully!`
				});
				if (!path) setNewSitemapPath("");
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
	const handleDeleteSitemap = async (feedpath) => {
		if (!confirm(`Are you sure you want to remove "${feedpath}" from Google Search Console?`)) return;
		setDeletingSitemapPath(feedpath);
		setSitemapMessage(null);
		try {
			const data = await (await fetch("/api/admin/gsc/sitemaps/delete", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				},
				body: JSON.stringify({ feedpath })
			})).json();
			if (data.success) {
				setSitemaps((prev) => prev.filter((s) => s.path !== feedpath));
				setSitemapMessage({
					type: "success",
					text: data.message || `Sitemap ${feedpath} removed from Search Console.`
				});
			} else setSitemapMessage({
				type: "error",
				text: data.error || "Failed to delete sitemap."
			});
		} catch (err) {
			setSitemapMessage({
				type: "error",
				text: err.message
			});
		} finally {
			setDeletingSitemapPath(null);
		}
	};
	const handleSaveSettings = async (e) => {
		e?.preventDefault();
		setSavingSettings(true);
		setSettingsSuccess(null);
		setSettingsError(null);
		const formData = new FormData();
		if (clientId) formData.append("client_id", clientId);
		if (clientSecret) formData.append("client_secret", clientSecret);
		if (redirectUri) formData.append("redirect_uri", redirectUri);
		if (propertyId) formData.append("property_id", propertyId);
		formData.append("auto_index_posts", autoIndexPosts ? "1" : "0");
		formData.append("auto_index_businesses", autoIndexBusinesses ? "1" : "0");
		const fileInput = document.getElementById("gsc_credentials_file");
		if (fileInput?.files?.[0]) formData.append("credentials_file", fileInput.files[0]);
		try {
			const data = await (await fetch("/api/admin/gsc/settings", {
				method: "POST",
				headers: { ...csrfHeaders() },
				body: formData
			})).json();
			if (data.success) {
				setSettings(data.settings);
				setSettingsSuccess("Settings successfully updated!");
			} else setSettingsError(data.error || "Failed to save settings.");
		} catch (err) {
			setSettingsError(err.message);
		} finally {
			setSavingSettings(false);
		}
	};
	const handleConnectWithCode = async (e) => {
		e.preventDefault();
		if (!manualCode) return;
		setSavingSettings(true);
		try {
			const data = await (await fetch("/api/admin/gsc/connect-code", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...csrfHeaders()
				},
				body: JSON.stringify({
					code: manualCode,
					redirect_uri: redirectUri
				})
			})).json();
			if (data.success) {
				alert("Connected successfully to Google Search Console!");
				window.location.reload();
			} else alert("Error: " + data.error);
		} catch (err) {
			alert(err.message);
		} finally {
			setSavingSettings(false);
		}
	};
	const handleDisconnect = async () => {
		if (!confirm("Are you sure you want to disconnect Google Search Console?")) return;
		try {
			if ((await fetch("/api/admin/gsc/disconnect", {
				method: "POST",
				headers: { ...csrfHeaders() }
			})).ok) window.location.reload();
		} catch (err) {
			alert(err.message);
		}
	};
	const filteredQueries = useMemo(() => {
		const list = analyticsData?.query_rows || cachedQueries || [];
		if (!queryFilter) return list;
		return list.filter((q) => (q.keys?.[0] || q.query || "").toLowerCase().includes(queryFilter.toLowerCase()));
	}, [
		analyticsData,
		cachedQueries,
		queryFilter
	]);
	const filteredPages = useMemo(() => {
		const list = analyticsData?.page_rows || [];
		if (!pageFilter) return list;
		return list.filter((p) => (p.keys?.[0] || p.page || "").toLowerCase().includes(pageFilter.toLowerCase()));
	}, [analyticsData, pageFilter]);
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Google Search Console Hub | Admin" }),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800",
					children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl",
							children: /* @__PURE__ */ jsxs("svg", {
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [/* @__PURE__ */ jsx("circle", {
									cx: "11",
									cy: "11",
									r: "8"
								}), /* @__PURE__ */ jsx("line", {
									x1: "21",
									y1: "21",
									x2: "16.65",
									y2: "16.65"
								})]
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
							children: "Google Search Console Hub"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-slate-500 dark:text-zinc-400 mt-0.5",
							children: "Live search analytics, keyword rankings, URL inspection, and instant indexing."
						})] })]
					}) }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 flex-wrap",
						children: [settings.is_connected ? /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60",
							children: [
								/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
								"Connected: ",
								settings.property_id
							]
						}) : /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500" }), "Not Connected"]
						}), settings.is_connected ? /* @__PURE__ */ jsxs("button", {
							onClick: () => fetchAnalytics(),
							disabled: loadingAnalytics,
							className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer",
							children: [/* @__PURE__ */ jsx("svg", {
								className: `w-3.5 h-3.5 ${loadingAnalytics ? "animate-spin" : ""}`,
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								children: /* @__PURE__ */ jsx("path", { d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" })
							}), "Sync GSC"]
						}) : /* @__PURE__ */ jsx("a", {
							href: "/admin/gsc/auth",
							className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer no-underline",
							children: "Connect with Google"
						})]
					})]
				}),
				callbackSuccess && /* @__PURE__ */ jsxs("div", {
					className: "mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Google Search Console connected successfully! Live data is now active." })]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => router.visit("/admin/google-search"),
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
						onClick: () => router.visit("/admin/google-search"),
						className: "text-xs underline cursor-pointer shrink-0",
						children: "Dismiss"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-slate-200 dark:border-zinc-800",
					children: [
						{
							id: "performance",
							label: "Performance",
							icon: BarChart3,
							desc: "Clicks & Rankings"
						},
						{
							id: "inspector",
							label: "URL Inspector",
							icon: Search,
							desc: "Live Index Diagnostics"
						},
						{
							id: "indexing",
							label: "Instant Indexing",
							icon: Zap,
							desc: "Push to Googlebot"
						},
						{
							id: "pagespeed",
							label: "PageSpeed & CWV",
							icon: Gauge,
							desc: "Core Web Vitals & Audits"
						},
						{
							id: "sitemaps",
							label: "Sitemaps",
							icon: Globe,
							desc: "Crawl & Submission"
						},
						{
							id: "opportunities",
							label: "Opportunities",
							icon: Sparkles,
							desc: "High Impact Keywords"
						},
						{
							id: "settings",
							label: "Settings",
							icon: Settings,
							desc: "API & Auth Setup"
						}
					].map((tab) => {
						const Icon = tab.icon;
						return /* @__PURE__ */ jsxs("button", {
							onClick: () => setActiveTab(tab.id),
							className: `flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700"}`,
							children: [/* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: tab.label })]
						}, tab.id);
					})
				})
			]
		}),
		activeTab === "performance" && /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
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
								},
								{
									label: "6M",
									days: 180
								}
							].map((r) => /* @__PURE__ */ jsx("button", {
								onClick: () => {
									setDateRange(r.days);
									setShowCustomPicker(false);
									fetchAnalytics(r.days, searchType);
								},
								className: `px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${dateRange === r.days ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"}`,
								children: r.label
							}, r.days)),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setShowCustomPicker(!showCustomPicker),
								className: `px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${dateRange === "custom" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"}`,
								children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Custom" })]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-bold uppercase text-slate-500 dark:text-zinc-400",
							children: "Search Type:"
						}), [
							"web",
							"image",
							"video",
							"news"
						].map((t) => /* @__PURE__ */ jsx("button", {
							onClick: () => {
								setSearchType(t);
								fetchAnalytics(dateRange, t);
							},
							className: `px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer transition ${searchType === t ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"}`,
							children: t
						}, t))]
					})]
				}),
				showCustomPicker && /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-3 bg-blue-50/70 dark:bg-zinc-800/80 p-3.5 rounded-2xl border border-blue-200 dark:border-zinc-700 animate-in fade-in duration-150",
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
								fetchAnalytics("custom", searchType, customStartDate, customEndDate);
							},
							className: "px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm cursor-pointer",
							children: "Apply Custom Range"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1",
									children: "Total Clicks"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400",
									children: (analyticsData?.totals?.clicks ?? 0).toLocaleString()
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-slate-500 mt-2 font-medium",
									children: "Organic visitors from Google Search"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1",
									children: "Total Impressions"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400",
									children: (analyticsData?.totals?.impressions ?? 0).toLocaleString()
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-slate-500 mt-2 font-medium",
									children: "Times your links appeared in search"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1",
									children: "Average CTR"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400",
									children: [analyticsData?.totals?.ctr ?? 0, "%"]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-slate-500 mt-2 font-medium",
									children: "Click-through rate of search results"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1",
									children: "Average Position"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400",
									children: analyticsData?.totals?.position ?? 0
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-slate-500 mt-2 font-medium",
									children: "Average ranking on Google SERP"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Top Search Keywords" }), /* @__PURE__ */ jsx("span", {
									className: "text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400",
									children: filteredQueries.length
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative group w-44 sm:w-56",
								children: [/* @__PURE__ */ jsx("div", {
									className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
									children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" })
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "Search keywords...",
									value: queryFilter,
									onChange: (e) => setQueryFilter(e.target.value),
									className: "block w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
								})]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "overflow-x-auto max-h-[420px]",
							children: /* @__PURE__ */ jsxs("table", {
								className: "w-full min-w-[520px] text-left text-xs border-collapse",
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
											children: "Position"
										})
									] })
								}), /* @__PURE__ */ jsx("tbody", {
									className: "divide-y divide-slate-100 dark:divide-zinc-800",
									children: filteredQueries.map((row, idx) => {
										const qName = row.keys?.[0] || row.query || "Unknown";
										return /* @__PURE__ */ jsxs("tr", {
											className: "hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition",
											children: [
												/* @__PURE__ */ jsx("td", {
													className: "p-3 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate",
													title: qName,
													children: qName
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3 text-right font-bold text-blue-600 dark:text-blue-400",
													children: row.clicks?.toLocaleString()
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3 text-right text-slate-600 dark:text-zinc-300",
													children: row.impressions?.toLocaleString()
												}),
												/* @__PURE__ */ jsxs("td", {
													className: "p-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold",
													children: [((row.ctr || 0) * 100).toFixed(1), "%"]
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3 text-right font-bold text-slate-700 dark:text-zinc-300",
													children: (row.position || 0).toFixed(1)
												})
											]
										}, idx);
									})
								})]
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Top Landing Pages" }), /* @__PURE__ */ jsx("span", {
									className: "text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400",
									children: filteredPages.length
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative group w-44 sm:w-56",
								children: [/* @__PURE__ */ jsx("div", {
									className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
									children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" })
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "Search pages...",
									value: pageFilter,
									onChange: (e) => setPageFilter(e.target.value),
									className: "block w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
								})]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "overflow-x-auto max-h-[420px]",
							children: /* @__PURE__ */ jsxs("table", {
								className: "w-full min-w-[520px] text-left text-xs border-collapse",
								children: [/* @__PURE__ */ jsx("thead", {
									className: "sticky top-0 bg-slate-50 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700",
									children: /* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("th", {
											className: "p-3",
											children: "Page URL"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3 text-right",
											children: "Clicks"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3 text-right",
											children: "Impr."
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3 text-right",
											children: "Action"
										})
									] })
								}), /* @__PURE__ */ jsx("tbody", {
									className: "divide-y divide-slate-100 dark:divide-zinc-800",
									children: filteredPages.map((row, idx) => {
										const pUrl = row.keys?.[0] || row.page || "";
										return /* @__PURE__ */ jsxs("tr", {
											className: "hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition",
											children: [
												/* @__PURE__ */ jsx("td", {
													className: "p-3 font-semibold text-slate-900 dark:text-white max-w-[220px] truncate",
													title: pUrl,
													children: /* @__PURE__ */ jsx("a", {
														href: pUrl,
														target: "_blank",
														rel: "noopener noreferrer",
														className: "hover:underline text-blue-600 dark:text-blue-400",
														children: pUrl.replace(/^https?:\/\/[^\/]+/, "") || "/"
													})
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3 text-right font-bold text-blue-600 dark:text-blue-400",
													children: row.clicks?.toLocaleString()
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3 text-right text-slate-600 dark:text-zinc-300",
													children: row.impressions?.toLocaleString()
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3 text-right",
													children: /* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-end gap-1.5",
														children: [/* @__PURE__ */ jsx("button", {
															onClick: () => {
																setInspectUrlInput(pUrl);
																setActiveTab("inspector");
															},
															className: "px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-zinc-300 hover:text-blue-600 text-[11px] font-bold cursor-pointer",
															title: "Inspect Googlebot Index Coverage",
															children: "Inspect"
														}), /* @__PURE__ */ jsxs("button", {
															onClick: () => {
																setPageSpeedTargetUrl(pUrl);
																setActiveTab("pagespeed");
															},
															className: "px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 text-[11px] font-bold cursor-pointer flex items-center gap-1",
															title: "Audit Core Web Vitals & PageSpeed",
															children: [/* @__PURE__ */ jsx(Gauge, { className: "w-3 h-3 text-amber-500" }), /* @__PURE__ */ jsx("span", { children: "Speed" })]
														})]
													})
												})
											]
										}, idx);
									})
								})]
							})
						})]
					})]
				})
			]
		}),
		activeTab === "inspector" && /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-extrabold text-slate-900 dark:text-white mb-2",
						children: "Live Googlebot URL Inspection"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-slate-500 dark:text-zinc-400 mb-6",
						children: "Query Google Search Console's URL Inspection API in real-time to check index coverage, crawl date, mobile friendliness, and Schema markup."
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleInspectUrl,
						className: "flex flex-col sm:flex-row gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1 group",
							children: [/* @__PURE__ */ jsx("div", {
								className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
								children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" })
							}), /* @__PURE__ */ jsx("input", {
								type: "url",
								required: true,
								placeholder: "https://coachingsinsikar.com/blog/best-neet-coaching-sikar",
								value: inspectUrlInput,
								onChange: (e) => setInspectUrlInput(e.target.value),
								className: "block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
							})]
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: inspecting,
							className: "group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer shrink-0",
							children: inspecting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("svg", {
								className: "w-4 h-4 animate-spin",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								children: /* @__PURE__ */ jsx("path", { d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" })
							}), /* @__PURE__ */ jsx("span", { children: "Inspecting..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "Inspect Live URL" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })] })
						})]
					}),
					inspectError && /* @__PURE__ */ jsxs("div", {
						className: "mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: inspectError })]
					})
				]
			}), inspectionResult && /* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-1",
							children: "Inspected Target"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-base font-extrabold text-slate-900 dark:text-white break-all",
							children: inspectionResult.inspectionUrl
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								inspectionResult.indexStatusResult?.verdict === "PASS" ? /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "Indexed (Pass)" })]
								}) : /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300",
									children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-3.5 h-3.5 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ jsx("span", { children: inspectionResult.indexStatusResult?.verdict || "Not Indexed" })]
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: () => {
										setIndexUrlInput(inspectionResult.inspectionUrl);
										setActiveTab("indexing");
									},
									className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors",
									children: [/* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Push for Instant Re-Index" })]
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: () => {
										setPageSpeedTargetUrl(inspectionResult.inspectionUrl);
										setActiveTab("pagespeed");
									},
									className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold cursor-pointer transition-colors border border-slate-200 dark:border-zinc-700",
									title: "Audit PageSpeed & Core Web Vitals for this URL",
									children: [/* @__PURE__ */ jsx(Gauge, { className: "w-3.5 h-3.5 text-blue-500" }), /* @__PURE__ */ jsx("span", { children: "Audit PageSpeed & CWV" })]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-2 border border-slate-200 dark:border-zinc-700",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-bold text-slate-500 uppercase",
										children: "Coverage State"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "font-extrabold text-slate-900 dark:text-white text-sm",
										children: inspectionResult.indexStatusResult?.coverageState || "Unknown"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-xs text-slate-500",
										children: ["Robots: ", inspectionResult.indexStatusResult?.robotsTxtState || "Allowed"]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-2 border border-slate-200 dark:border-zinc-700",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-bold text-slate-500 uppercase",
										children: "Googlebot Crawl"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "font-extrabold text-slate-900 dark:text-white text-sm",
										children: inspectionResult.indexStatusResult?.crawledAs || "Googlebot Smartphone"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-xs text-slate-500",
										children: ["Last Crawl: ", inspectionResult.indexStatusResult?.lastCrawlTime ? new Date(inspectionResult.indexStatusResult.lastCrawlTime).toLocaleString() : "N/A"]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-2 border border-slate-200 dark:border-zinc-700",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-bold text-slate-500 uppercase",
										children: "Mobile Usability"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "font-extrabold text-slate-900 dark:text-white text-sm",
										children: inspectionResult.mobileUsabilityResult?.verdict === "PASS" ? /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400",
											children: [/* @__PURE__ */ jsx(Smartphone, { className: "w-4 h-4 text-emerald-500" }), /* @__PURE__ */ jsx("span", { children: "Mobile Friendly (Pass)" })]
										}) : /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400",
											children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ jsx("span", { children: "Needs Attention" })]
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-xs text-slate-500",
										children: ["Page Fetch: ", inspectionResult.indexStatusResult?.pageFetchState || "Successful"]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
						className: "text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3",
						children: "Detected Schema Rich Snippets"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-2",
						children: inspectionResult.richResultsResult?.detectedItems?.length > 0 ? inspectionResult.richResultsResult.detectedItems.map((schema, i) => /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-blue-600 dark:text-blue-400" }), /* @__PURE__ */ jsx("span", { children: schema.name })]
						}, i)) : /* @__PURE__ */ jsx("span", {
							className: "text-xs text-slate-500",
							children: "Standard Article / Breadcrumb markup active"
						})
					})] })
				]
			})]
		}),
		activeTab === "indexing" && /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-extrabold text-slate-900 dark:text-white",
								children: "Google Instant Indexing API (Fast-Track Push)"
							}), /* @__PURE__ */ jsx("span", {
								className: `px-2.5 py-0.5 rounded-full text-[11px] font-bold ${settings.auth_mode === "service_account" ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"}`,
								children: settings.auth_mode === "service_account" ? "Service Account" : "OAuth 2.0"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-slate-500 dark:text-zinc-400 mt-1",
							children: "Instruct Googlebot to immediately crawl new or modified URLs within minutes using Google's official Indexing API v3."
						})] }), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleTestIndexing,
							disabled: testingIndexing,
							className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold transition shadow-sm cursor-pointer shrink-0",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${testingIndexing ? "animate-spin text-blue-600" : ""}` }), /* @__PURE__ */ jsx("span", { children: testingIndexing ? "Testing Google Connection..." : "Test Indexing Connection" })]
						})]
					}),
					testIndexingResult && /* @__PURE__ */ jsx("div", {
						className: `p-4 rounded-xl text-xs font-medium border ${testIndexingResult.success ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"}`,
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-2.5",
							children: [testIndexingResult.success ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1 flex-1",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "font-bold text-sm",
										children: testIndexingResult.success ? "Google Indexing API Active & Ready" : testIndexingResult.error || "Indexing API Test Failed"
									}),
									testIndexingResult.solution && /* @__PURE__ */ jsx("p", {
										className: "text-xs",
										children: testIndexingResult.solution
									}),
									testIndexingResult.link && /* @__PURE__ */ jsx("div", {
										className: "mt-2",
										children: /* @__PURE__ */ jsxs("a", {
											href: testIndexingResult.link,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs no-underline shadow-sm",
											children: [/* @__PURE__ */ jsx("span", { children: "Open Required Google Page" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5" })]
										})
									}),
									testIndexingResult.raw && /* @__PURE__ */ jsxs("p", {
										className: "font-mono text-[11px] opacity-80 pt-1",
										children: ["Google API response: ", testIndexingResult.raw]
									})
								]
							})]
						})
					}),
					settings.auth_mode === "service_account" && settings.service_account_email && /* @__PURE__ */ jsxs("div", {
						className: "p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" }),
									/* @__PURE__ */ jsx("span", {
										className: "font-bold",
										children: "Service Account Email:"
									}),
									/* @__PURE__ */ jsx("code", {
										className: "px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-700 font-mono text-[11px] select-all",
										children: settings.service_account_email
									})
								]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleCopyEmail(settings.service_account_email),
								className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-200/70 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold text-[11px] transition cursor-pointer self-start sm:self-auto",
								children: [copiedEmail ? /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-emerald-600" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: copiedEmail ? "Copied!" : "Copy Email" })]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90 pt-1 space-y-1",
							children: [/* @__PURE__ */ jsxs("p", { children: [
								/* @__PURE__ */ jsx("strong", { children: "Why you see \"403 failed\":" }),
								" Google Indexing API strictly requires that this Service Account email is added as an ",
								/* @__PURE__ */ jsx("strong", { children: "Owner" }),
								" in Google Search Console. Full or Restricted user permissions are not enough and will cause a 403 error."
							] }), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-3 pt-1",
								children: [/* @__PURE__ */ jsxs("a", {
									href: `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(settings.property_id || "https://coachingsinsikar.com/")}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-1 font-bold underline hover:text-amber-950 dark:hover:text-amber-100",
									children: [/* @__PURE__ */ jsx("span", { children: "1. Add as Owner in Search Console (Settings > Users)" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
								}), /* @__PURE__ */ jsxs("a", {
									href: "https://console.cloud.google.com/apis/library/indexing.googleapis.com",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-1 font-bold underline hover:text-amber-950 dark:hover:text-amber-100",
									children: [/* @__PURE__ */ jsx("span", { children: "2. Enable Web Search Indexing API in Cloud Console" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handlePublishIndex,
						className: "space-y-4 pt-2",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1",
								children: "Target URLs (one per line for bulk push):"
							}),
							/* @__PURE__ */ jsx("textarea", {
								rows: 4,
								required: true,
								placeholder: "https://coachingsinsikar.com/blog/best-neet-coachings-in-sikar\nhttps://coachingsinsikar.com/business/matrix-academy",
								value: indexUrlInput,
								onChange: (e) => setIndexUrlInput(e.target.value),
								className: "w-full p-4 rounded-2xl border border-transparent outline-none bg-slate-100 dark:bg-zinc-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 font-mono text-xs"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-slate-500 mt-1 block",
								children: "URLs will automatically be canonicalized to https://coachingsinsikar.com/... to prevent protocol mismatches."
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold text-slate-600 dark:text-zinc-400",
									children: "Action Type:"
								}), /* @__PURE__ */ jsxs("select", {
									value: indexAction,
									onChange: (e) => setIndexAction(e.target.value),
									className: "text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-bold outline-none cursor-pointer",
									children: [/* @__PURE__ */ jsx("option", {
										value: "URL_UPDATED",
										children: "URL_UPDATED (Publish / Update)"
									}), /* @__PURE__ */ jsx("option", {
										value: "URL_DELETED",
										children: "URL_DELETED (Remove from Google)"
									})]
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: indexing,
								className: "group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer",
								children: indexing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("svg", {
									className: "w-4 h-4 animate-spin",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									children: /* @__PURE__ */ jsx("path", { d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" })
								}), /* @__PURE__ */ jsx("span", { children: "Pinging Google..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsx(Zap, { className: "w-4 h-4" }),
									/* @__PURE__ */ jsx("span", { children: "Push to Google Index Now" }),
									/* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })
								] })
							})]
						})]
					}),
					indexMessage && /* @__PURE__ */ jsx("div", {
						className: `mt-4 p-4 rounded-xl text-xs font-semibold ${indexMessage.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"}`,
						children: indexMessage.text
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "font-extrabold text-slate-900 dark:text-white text-base",
						children: "Indexing Submission Audit Logs"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-slate-500 font-medium",
						children: "Standard Google quota: 200 URLs/day"
					})] }), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: fetchIndexingLogs,
						disabled: loadingIndexLogs,
						className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold transition cursor-pointer",
						children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${loadingIndexLogs ? "animate-spin text-blue-500" : ""}` }), /* @__PURE__ */ jsx("span", { children: loadingIndexLogs ? "Refreshing..." : "Refresh Logs" })]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full min-w-[650px] text-left text-xs border-collapse",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase font-bold",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Timestamp"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Submitted URL & Diagnosis"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Action"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "p-3",
									children: "Triggered By"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100 dark:divide-zinc-800",
							children: indexLogs.length > 0 ? indexLogs.map((log) => {
								const is403 = Number(log.http_code) === 403;
								const isSuccess = log.status === "success";
								return /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50 dark:hover:bg-zinc-800/40",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap align-top",
											children: new Date(log.created_at).toLocaleString()
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "p-3 align-top max-w-[420px]",
											children: [/* @__PURE__ */ jsx("div", {
												className: "font-semibold text-slate-900 dark:text-white font-mono text-xs truncate",
												title: log.url,
												children: log.url
											}), log.response_message && /* @__PURE__ */ jsxs("div", {
												className: `mt-1.5 p-2 rounded-lg text-[11px] leading-relaxed ${isSuccess ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60" : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"}`,
												children: [/* @__PURE__ */ jsx("div", {
													className: "font-medium",
													children: log.response_message
												}), is403 && /* @__PURE__ */ jsxs("div", {
													className: "mt-1.5 flex flex-wrap gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-800/40",
													children: [/* @__PURE__ */ jsxs("a", {
														href: `https://search.google.com/search-console/users?resource_id=${encodeURIComponent(settings.property_id || "https://coachingsinsikar.com/")}`,
														target: "_blank",
														rel: "noopener noreferrer",
														className: "inline-flex items-center gap-1 font-bold underline text-rose-700 dark:text-rose-300 hover:text-rose-900",
														children: [/* @__PURE__ */ jsx("span", { children: "Fix: Add as Owner in Search Console" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
													}), /* @__PURE__ */ jsxs("a", {
														href: "https://console.cloud.google.com/apis/library/indexing.googleapis.com",
														target: "_blank",
														rel: "noopener noreferrer",
														className: "inline-flex items-center gap-1 font-bold underline text-rose-700 dark:text-rose-300 hover:text-rose-900",
														children: [/* @__PURE__ */ jsx("span", { children: "Enable Indexing API" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
													})]
												})]
											})]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px] whitespace-nowrap align-top",
											children: log.action
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 whitespace-nowrap align-top",
											children: /* @__PURE__ */ jsxs("span", {
												className: `px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 ${isSuccess ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"}`,
												children: [isSuccess ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3" }), /* @__PURE__ */ jsxs("span", { children: [
													log.http_code,
													" ",
													log.status
												] })]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-3 text-slate-500 capitalize whitespace-nowrap align-top",
											children: log.triggered_by.replace(/_/g, " ")
										})
									]
								}, log.id);
							}) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 5,
								className: "p-6 text-center text-slate-500",
								children: "No indexing submissions recorded yet."
							}) })
						})]
					})
				})]
			})]
		}),
		activeTab === "pagespeed" && /* @__PURE__ */ jsx(PageSpeedTab, {
			pageSpeedData,
			defaultUrls: pageSpeedData.defaultUrls || [],
			targetUrl: pageSpeedTargetUrl,
			onInspectUrl: (url) => {
				setInspectUrlInput(url);
				setActiveTab("inspector");
			},
			onPushIndex: (url) => {
				setIndexUrlInput(url);
				setActiveTab("indexing");
			}
		}),
		activeTab === "sitemaps" && /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-extrabold text-slate-900 dark:text-white mb-2",
							children: "Google Sitemaps Management"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-slate-500 dark:text-zinc-400 mb-6",
							children: "View registered sitemaps, verify Googlebot download status, and submit newly generated sitemap indices directly to Google Search Console."
						}),
						sitemapMessage && /* @__PURE__ */ jsxs("div", {
							className: `mb-5 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${sitemapMessage.type === "success" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800"}`,
							children: [sitemapMessage.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500 shrink-0" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-red-500 shrink-0" }), /* @__PURE__ */ jsx("span", { children: sitemapMessage.text })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative flex-1 group",
								children: [/* @__PURE__ */ jsx("div", {
									className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
									children: /* @__PURE__ */ jsx(Globe, { className: "h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" })
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "https://coachingsinsikar.com/sitemap.xml",
									value: newSitemapPath,
									onChange: (e) => setNewSitemapPath(e.target.value),
									className: "block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
								})]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: () => handleSubmitSitemap(),
								disabled: submittingSitemap || !newSitemapPath,
								className: "group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer shrink-0",
								children: [/* @__PURE__ */ jsx("span", { children: submittingSitemap ? "Submitting..." : "Submit Sitemap" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-4 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "font-extrabold text-slate-900 dark:text-white text-base",
								children: "Submitted Sitemaps in Google"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold",
								children: sitemaps.length
							})]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: fetchSitemaps,
							disabled: loadingSitemaps || !settings.is_connected,
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold transition disabled:opacity-50 cursor-pointer self-start sm:self-auto",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: `w-3.5 h-3.5 ${loadingSitemaps ? "animate-spin text-blue-500" : ""}` }), /* @__PURE__ */ jsx("span", { children: loadingSitemaps ? "Refreshing..." : "Refresh Sitemaps" })]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: loadingSitemaps && sitemaps.length === 0 ? /* @__PURE__ */ jsxs("div", {
							className: "p-12 text-center text-slate-500 dark:text-zinc-400",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" }), /* @__PURE__ */ jsx("p", {
								className: "text-xs font-medium",
								children: "Fetching registered sitemaps from Google Search Console..."
							})]
						}) : sitemaps.length === 0 ? /* @__PURE__ */ jsxs("div", {
							className: "p-12 text-center text-slate-500 dark:text-zinc-400",
							children: [
								/* @__PURE__ */ jsx(Globe, { className: "w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" }),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1",
									children: "No Sitemaps Found on Google Search Console"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs max-w-md mx-auto",
									children: "Submit your sitemap indices above or ping the local sitemaps below to notify Googlebot."
								})
							]
						}) : /* @__PURE__ */ jsx("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ jsxs("table", {
								className: "w-full min-w-[700px] text-left text-xs border-collapse",
								children: [/* @__PURE__ */ jsx("thead", {
									className: "bg-slate-50 dark:bg-zinc-800/80 backdrop-blur-sm text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700",
									children: /* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("th", {
											className: "p-3.5",
											children: "Sitemap URL"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3.5",
											children: "Type"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3.5",
											children: "Submitted"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3.5",
											children: "Last Downloaded"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3.5",
											children: "Discovered URLs"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3.5",
											children: "Status"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "p-3.5 text-right",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ jsx("tbody", {
									className: "divide-y divide-slate-100 dark:divide-zinc-800",
									children: sitemaps.map((item, idx) => {
										const isPending = item.isPending;
										const hasErrors = Number(item.errors || 0) > 0;
										const hasWarnings = Number(item.warnings || 0) > 0;
										const isDeleting = deletingSitemapPath === item.path;
										return /* @__PURE__ */ jsxs("tr", {
											className: "hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition",
											children: [
												/* @__PURE__ */ jsx("td", {
													className: "p-3.5 font-bold text-slate-900 dark:text-white max-w-[280px]",
													children: /* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-1.5 truncate",
														title: item.path,
														children: [/* @__PURE__ */ jsx("a", {
															href: item.path,
															target: "_blank",
															rel: "noopener noreferrer",
															className: "text-blue-600 dark:text-blue-400 hover:underline truncate",
															children: item.path
														}), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 text-slate-400 shrink-0" })]
													})
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3.5",
													children: /* @__PURE__ */ jsx("span", {
														className: "px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold text-[11px]",
														children: item.isSitemapsIndex ? "Sitemap Index" : item.type || "Sitemap"
													})
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3.5 text-slate-600 dark:text-zinc-300 whitespace-nowrap",
													children: formatSitemapDate(item.lastSubmitted)
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3.5 text-slate-600 dark:text-zinc-300 whitespace-nowrap",
													children: formatSitemapDate(item.lastDownloaded)
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3.5",
													children: item.contents && item.contents.length > 0 ? /* @__PURE__ */ jsx("div", {
														className: "flex flex-wrap gap-1.5",
														children: item.contents.map((c, cIdx) => /* @__PURE__ */ jsxs("span", {
															className: "px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200 dark:border-blue-900",
															children: [
																c.type,
																": ",
																c.submitted
															]
														}, cIdx))
													}) : /* @__PURE__ */ jsx("span", {
														className: "text-slate-400 italic",
														children: "None"
													})
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3.5",
													children: isPending ? /* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-bold",
														children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Pending" })]
													}) : hasErrors ? /* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800 text-[11px] font-bold",
														children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3" }), /* @__PURE__ */ jsxs("span", { children: [item.errors, " Error(s)"] })]
													}) : hasWarnings ? /* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[11px] font-bold",
														children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Warnings" })]
													}) : /* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold",
														children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Success" })]
													})
												}),
												/* @__PURE__ */ jsx("td", {
													className: "p-3.5 text-right",
													children: /* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-end gap-2",
														children: [/* @__PURE__ */ jsx("button", {
															onClick: () => handleSubmitSitemap(item.path),
															title: "Ping / Re-submit to Google",
															className: "p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-zinc-400 hover:text-blue-600 transition cursor-pointer",
															children: /* @__PURE__ */ jsx(RefreshCw, { className: "w-3.5 h-3.5" })
														}), /* @__PURE__ */ jsx("button", {
															onClick: () => handleDeleteSitemap(item.path),
															disabled: isDeleting,
															title: "Delete sitemap from Search Console",
															className: "p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-zinc-400 hover:text-red-600 transition disabled:opacity-50 cursor-pointer",
															children: /* @__PURE__ */ jsx(Trash2, { className: `w-3.5 h-3.5 ${isDeleting ? "animate-pulse text-red-500" : ""}` })
														})]
													})
												})
											]
										}, idx);
									})
								})]
							})
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-sm",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "font-extrabold text-slate-900 dark:text-white text-base",
							children: "Site Generated Sitemaps"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
							children: "Pre-configured XML sitemaps generated on coachingsinsikar.com"
						})] }), /* @__PURE__ */ jsxs("span", {
							className: "text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold",
							children: [localSitemaps.length, " available"]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "divide-y divide-slate-100 dark:divide-zinc-800",
						children: localSitemaps.map((sm, i) => /* @__PURE__ */ jsxs("div", {
							className: "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("div", {
									className: "font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2",
									children: /* @__PURE__ */ jsx("span", { children: sm.type })
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-1.5 mt-0.5",
									children: /* @__PURE__ */ jsxs("a", {
										href: sm.path,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium",
										children: [/* @__PURE__ */ jsx("span", { children: sm.path }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500 dark:text-zinc-400 mt-1",
									children: sm.description
								})
							] }), /* @__PURE__ */ jsxs("button", {
								onClick: () => handleSubmitSitemap(sm.path),
								disabled: submittingSitemap,
								className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-zinc-300 text-xs font-bold cursor-pointer shrink-0 transition-all shadow-sm",
								children: [/* @__PURE__ */ jsx("span", { children: "Ping Google" }), /* @__PURE__ */ jsx(RefreshCw, { className: "w-3 h-3" })]
							})]
						}, i))
					})]
				})
			]
		}),
		activeTab === "opportunities" && /* @__PURE__ */ jsx("div", {
			className: "space-y-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold mb-2",
							children: [/* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ jsx("span", { children: "High Impact Quick Wins" })]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-extrabold text-slate-900 dark:text-white",
							children: "Striking Distance Keywords (Pos 8–20)"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 dark:text-zinc-400",
							children: "Keywords hovering on the bottom of Page 1 or top of Page 2. Small on-page tweaks will push these into the Top 3."
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto max-h-[360px]",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full min-w-[340px] text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "bg-slate-50 dark:bg-zinc-800 text-slate-600 uppercase font-bold sticky top-0",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "p-2.5",
										children: "Keyword"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-2.5 text-right",
										children: "Position"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-2.5 text-right",
										children: "Impr."
									})
								] })
							}), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100 dark:divide-zinc-800",
								children: opportunities?.striking_distance?.length > 0 ? opportunities.striking_distance.map((item, idx) => /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("td", {
										className: "p-2.5 font-bold text-slate-900 dark:text-white",
										children: item.query
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-2.5 text-right font-bold text-amber-600",
										children: Number(item.position).toFixed(1)
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-2.5 text-right text-slate-600 dark:text-zinc-300",
										children: item.impressions
									})
								] }, idx)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: 3,
									className: "p-4 text-center text-slate-500",
									children: "Sync search data to compute opportunities."
								}) })
							})]
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold mb-2",
							children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5 text-blue-500" }), /* @__PURE__ */ jsx("span", { children: "CTR Optimizers" })]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-extrabold text-slate-900 dark:text-white",
							children: "High Impression, Low CTR (<2%)"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 dark:text-zinc-400",
							children: "Queries with heavy search volume where searchers are clicking competitors. Rewrite title & meta description to boost traffic."
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto max-h-[360px]",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full min-w-[340px] text-left text-xs border-collapse",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "bg-slate-50 dark:bg-zinc-800 text-slate-600 uppercase font-bold sticky top-0",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "p-2.5",
										children: "Keyword"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-2.5 text-right",
										children: "CTR"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-2.5 text-right",
										children: "Impr."
									})
								] })
							}), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-100 dark:divide-zinc-800",
								children: opportunities?.low_ctr?.length > 0 ? opportunities.low_ctr.map((item, idx) => /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("td", {
										className: "p-2.5 font-bold text-slate-900 dark:text-white",
										children: item.query
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "p-2.5 text-right font-bold text-rose-600",
										children: [(item.ctr * 100).toFixed(1), "%"]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "p-2.5 text-right text-slate-600 dark:text-zinc-300",
										children: item.impressions
									})
								] }, idx)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: 3,
									className: "p-4 text-center text-slate-500",
									children: "Sync search data to compute opportunities."
								}) })
							})]
						})
					})]
				})]
			})
		}),
		activeTab === "settings" && /* @__PURE__ */ jsxs("div", {
			className: "space-y-6 max-w-4xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-extrabold text-slate-900 dark:text-white",
							children: "API Credentials & Property Configuration"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
							children: "Connect via OAuth 2.0 Client credentials or upload a Google Cloud Service Account JSON file."
						})] }), settings.is_connected && /* @__PURE__ */ jsx("button", {
							onClick: handleDisconnect,
							className: "px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 text-xs font-bold hover:bg-rose-100 transition cursor-pointer",
							children: "Disconnect Account"
						})]
					}),
					settingsSuccess && /* @__PURE__ */ jsx("div", {
						className: "p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold",
						children: settingsSuccess
					}),
					settingsError && /* @__PURE__ */ jsx("div", {
						className: "p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold",
						children: settingsError
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleSaveSettings,
						className: "space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5",
									children: "Search Console Property Identifier:"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative group",
									children: [/* @__PURE__ */ jsx("div", {
										className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
										children: /* @__PURE__ */ jsx(Globe, { className: "h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" })
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										required: true,
										placeholder: "https://coachingsinsikar.com/ or sc-domain:coachingsinsikar.com",
										value: propertyId,
										onChange: (e) => setPropertyId(e.target.value),
										className: "block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
									})]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-slate-500 mt-1 block",
									children: "Must match the exact verified site in your Google Search Console (e.g., https://coachingsinsikar.com/)."
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold uppercase text-slate-700 dark:text-zinc-300 mb-2",
										children: "Upload Credentials JSON (OAuth or Service Account):"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "file",
										id: "gsc_credentials_file",
										accept: ".json",
										className: "text-xs text-slate-600 dark:text-zinc-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-slate-500 mt-2 block",
										children: "Uploading client_secret_*.json will automatically extract Client ID, Client Secret, and Redirect URIs."
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5",
								children: "OAuth Client ID:"
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative group",
								children: [/* @__PURE__ */ jsx("div", {
									className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
									children: /* @__PURE__ */ jsx(Key, { className: "h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" })
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "123456789000-xxxx.apps.googleusercontent.com",
									value: clientId,
									onChange: (e) => setClientId(e.target.value),
									className: "block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
								})]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5",
								children: "OAuth Client Secret:"
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative group",
								children: [/* @__PURE__ */ jsx("div", {
									className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
									children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" })
								}), /* @__PURE__ */ jsx("input", {
									type: "password",
									placeholder: settings.has_client_secret ? "•••••••••••••••••••• (Encrypted in DB)" : "Enter OAuth client secret",
									value: clientSecret,
									onChange: (e) => setClientSecret(e.target.value),
									className: "block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
								})]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold uppercase text-slate-600 dark:text-zinc-400 mb-1.5",
									children: "Authorized Redirect URI:"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative group",
									children: [/* @__PURE__ */ jsx("div", {
										className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
										children: /* @__PURE__ */ jsx(Link$1, { className: "h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" })
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: redirectUri,
										onChange: (e) => setRedirectUri(e.target.value),
										className: "block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2 text-[11px] text-slate-500",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-bold",
										children: "Add this URI to Google Cloud Console (OAuth Authorized redirect URIs):"
									}), /* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-2 mt-1",
										children: settings.suggested_redirect_uris?.map((uri, idx) => /* @__PURE__ */ jsx("code", {
											className: "bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono text-[10px]",
											children: uri
										}, idx))
									})]
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-3",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300",
										children: "Automation & Lifecycle Hooks"
									}),
									/* @__PURE__ */ jsxs("label", {
										className: "flex items-center gap-3 cursor-pointer",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: autoIndexPosts,
											onChange: (e) => setAutoIndexPosts(e.target.checked),
											className: "w-4 h-4 text-blue-600 rounded"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold text-slate-700 dark:text-zinc-300",
											children: "Automatically ping Google Indexing API when publishing or updating a blog post"
										})]
									}),
									/* @__PURE__ */ jsxs("label", {
										className: "flex items-center gap-3 cursor-pointer",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: autoIndexBusinesses,
											onChange: (e) => setAutoIndexBusinesses(e.target.checked),
											className: "w-4 h-4 text-blue-600 rounded"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold text-slate-700 dark:text-zinc-300",
											children: "Automatically ping Google Indexing API when adding or updating a verified business profile"
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 flex flex-wrap items-center justify-between gap-3",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "submit",
									disabled: savingSettings,
									className: "group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md shadow-blue-500/20 cursor-pointer",
									children: [/* @__PURE__ */ jsx("span", { children: savingSettings ? "Saving..." : "Save Settings" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" })]
								}), /* @__PURE__ */ jsxs("a", {
									href: "/admin/gsc/auth",
									className: "group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer no-underline",
									children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Authorize Google Account" })]
								})]
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
				children: [
					/* @__PURE__ */ jsx("h4", {
						className: "font-extrabold text-slate-900 dark:text-white text-sm",
						children: "Alternative: Connect via Authorization Code"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs text-slate-500",
						children: [
							"If your redirect URI points to another domain or localhost, copy the ",
							/* @__PURE__ */ jsx("code", {
								className: "bg-slate-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-blue-600 font-mono",
								children: "code=4/..."
							}),
							" parameter from the Google redirect URL and paste it here directly:"
						]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleConnectWithCode,
						className: "flex flex-col sm:flex-row gap-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1 group",
							children: [/* @__PURE__ */ jsx("div", {
								className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
								children: /* @__PURE__ */ jsx(Terminal, { className: "h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" })
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "4/0ASVkm...",
								value: manualCode,
								onChange: (e) => setManualCode(e.target.value),
								className: "block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-xl text-xs font-mono font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
							})]
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: savingSettings || !manualCode,
							className: "group relative flex justify-center items-center gap-2 py-3 px-6 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-black focus:outline-none focus:ring-4 focus:ring-slate-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md cursor-pointer shrink-0",
							children: [/* @__PURE__ */ jsx("span", { children: "Exchange Code & Connect" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" })]
						})]
					})
				]
			})]
		})
	] });
}
//#endregion
export { SearchConsoleIndex as default };
