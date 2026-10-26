import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Activity, AlertCircle, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Clock, ExternalLink, Gauge, Key, Layers, Monitor, RefreshCw, Search, Smartphone, Sparkles, XCircle, Zap } from "lucide-react";
//#region resources/js/Pages/Admin/SearchConsole/PageSpeedTab.jsx
function PageSpeedTab({ pageSpeedData = {}, defaultUrls = [] }) {
	const initialAudit = pageSpeedData.recentAudits?.[0] || null;
	const initialUrls = pageSpeedData.defaultUrls || defaultUrls || [];
	const [urlInput, setUrlInput] = useState(initialUrls[0]?.url || "https://coachingsinsikar.com");
	const [strategy, setStrategy] = useState("mobile");
	const [forceRefresh, setForceRefresh] = useState(false);
	const [auditing, setAuditing] = useState(false);
	const [auditResult, setAuditResult] = useState(initialAudit);
	const [error, setError] = useState(null);
	const [history, setHistory] = useState(pageSpeedData.recentAudits || []);
	const [apiKeyInput, setApiKeyInput] = useState(pageSpeedData.apiKey || "");
	const [showKeyForm, setShowKeyForm] = useState(!pageSpeedData.hasApiKey);
	const [savingKey, setSavingKey] = useState(false);
	const [keyMessage, setKeyMessage] = useState(null);
	const [expandedOpportunity, setExpandedOpportunity] = useState(null);
	const [filterCategory, setFilterCategory] = useState("all");
	const handleRunAudit = async (targetUrl = null, targetStrategy = null, force = null) => {
		const finalUrl = targetUrl || urlInput;
		const finalStrategy = targetStrategy || strategy;
		const finalForce = force !== null ? force : forceRefresh;
		if (!finalUrl) return;
		setAuditing(true);
		setError(null);
		try {
			const data = await (await fetch("/api/admin/pagespeed/audit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || ""
				},
				body: JSON.stringify({
					url: finalUrl,
					strategy: finalStrategy,
					forceRefresh: finalForce
				})
			})).json();
			if (data.success && data.audit) {
				setAuditResult(data.audit);
				setHistory((prev) => [data.audit, ...prev.filter((item) => item.id !== data.audit.id)].slice(0, 30));
			} else setError(data.error || "Failed to complete PageSpeed audit.");
		} catch (err) {
			setError(err.message || "Network error executing PageSpeed audit.");
		} finally {
			setAuditing(false);
		}
	};
	const handleSaveApiKey = async (e) => {
		e.preventDefault();
		if (!apiKeyInput.trim()) return;
		setSavingKey(true);
		setKeyMessage(null);
		try {
			const data = await (await fetch("/api/admin/pagespeed/api-key", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || ""
				},
				body: JSON.stringify({ api_key: apiKeyInput })
			})).json();
			if (data.success) {
				setKeyMessage({
					type: "success",
					text: data.message
				});
				setShowKeyForm(false);
			} else setKeyMessage({
				type: "error",
				text: data.error || "Failed to save API key."
			});
		} catch (err) {
			setKeyMessage({
				type: "error",
				text: err.message
			});
		} finally {
			setSavingKey(false);
		}
	};
	const getScoreColor = (score) => {
		if (score >= 90) return {
			text: "text-emerald-600 dark:text-emerald-400",
			bg: "bg-emerald-50 dark:bg-emerald-950/40",
			border: "border-emerald-200 dark:border-emerald-800",
			ring: "stroke-emerald-500"
		};
		if (score >= 50) return {
			text: "text-amber-600 dark:text-amber-400",
			bg: "bg-amber-50 dark:bg-amber-950/40",
			border: "border-amber-200 dark:border-amber-800",
			ring: "stroke-amber-500"
		};
		return {
			text: "text-rose-600 dark:text-rose-400",
			bg: "bg-rose-50 dark:bg-rose-950/40",
			border: "border-rose-200 dark:border-rose-800",
			ring: "stroke-rose-500"
		};
	};
	const getStatusBadge = (status) => {
		if (status === "good") return /* @__PURE__ */ jsxs("span", {
			className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
			children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }), " Good"]
		});
		if (status === "needs_improvement") return /* @__PURE__ */ jsxs("span", {
			className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
			children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3" }), " Needs Work"]
		});
		return /* @__PURE__ */ jsxs("span", {
			className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
			children: [/* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3" }), " Poor"]
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
								children: /* @__PURE__ */ jsx(Gauge, { className: "w-5 h-5" })
							}), /* @__PURE__ */ jsx("h2", {
								className: "text-lg font-extrabold text-slate-900 dark:text-white",
								children: "Google PageSpeed Insights & Core Web Vitals"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 dark:text-zinc-400 mt-1",
							children: "Live Google Lighthouse 12 simulation with real-world Chrome User Experience Report (CrUX) metrics."
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ jsxs("button", {
								onClick: () => setShowKeyForm(!showKeyForm),
								className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition",
								children: [/* @__PURE__ */ jsx(Key, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ jsx("span", { children: pageSpeedData.hasApiKey ? "API Key Configured" : "Configure Free API Key" })]
							})
						})]
					}),
					showKeyForm && /* @__PURE__ */ jsxs("div", {
						className: "p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
									className: "text-xs text-amber-900 dark:text-amber-200 space-y-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold",
										children: "Google Cloud PageSpeed Insights API Key (25,000 Free Requests/Day)"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-amber-700 dark:text-amber-300",
										children: "Google PageSpeed Insights API is 100% free. Bina API key ke Google shared quota lagata hai jisse 429 Rate Limit aa sakti hai. Apne Google Cloud project se API key create karke niche save karein."
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleSaveApiKey,
								className: "flex flex-col sm:flex-row gap-2 pt-1",
								children: [
									/* @__PURE__ */ jsx("input", {
										type: "text",
										placeholder: "AIzaSyB...",
										value: apiKeyInput,
										onChange: (e) => setApiKeyInput(e.target.value),
										className: "flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: savingKey || !apiKeyInput.trim(),
										className: "px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition disabled:opacity-50 cursor-pointer",
										children: savingKey ? "Saving..." : "Save API Key"
									}),
									/* @__PURE__ */ jsxs("a", {
										href: "https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com",
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex items-center gap-1 px-3 py-2 text-xs text-amber-800 dark:text-amber-300 hover:underline font-semibold",
										children: [/* @__PURE__ */ jsx("span", { children: "Get Free Key" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
									})
								]
							}),
							keyMessage && /* @__PURE__ */ jsx("p", {
								className: `text-xs font-bold ${keyMessage.type === "success" ? "text-emerald-600" : "text-rose-600"}`,
								children: keyMessage.text
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 overflow-x-auto pb-1 text-xs",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-slate-400 font-semibold shrink-0",
							children: "Quick Inspect:"
						}), initialUrls.map((item, idx) => /* @__PURE__ */ jsx("button", {
							onClick: () => {
								setUrlInput(item.url);
								handleRunAudit(item.url);
							},
							className: "px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-zinc-700 font-medium whitespace-nowrap transition cursor-pointer",
							children: item.label
						}, idx))]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col lg:flex-row items-stretch lg:items-center gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400",
									children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsx("input", {
									type: "url",
									value: urlInput,
									onChange: (e) => setUrlInput(e.target.value),
									placeholder: "https://coachingsinsikar.com/blog/...",
									className: "w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/80 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition font-medium"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex rounded-xl p-1 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shrink-0",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setStrategy("mobile"),
									className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${strategy === "mobile" ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"}`,
									children: [/* @__PURE__ */ jsx(Smartphone, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Mobile" })]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setStrategy("desktop"),
									className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${strategy === "desktop" ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-zinc-400 hover:text-slate-900"}`,
									children: [/* @__PURE__ */ jsx(Monitor, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Desktop" })]
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-zinc-400 cursor-pointer select-none px-2 shrink-0",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: forceRefresh,
									onChange: (e) => setForceRefresh(e.target.checked),
									className: "rounded text-blue-600 focus:ring-blue-500"
								}), /* @__PURE__ */ jsx("span", { children: "Bypass Cache" })]
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => handleRunAudit(),
								disabled: auditing || !urlInput,
								className: "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/20 disabled:opacity-50 transition active:scale-[0.98] cursor-pointer shrink-0",
								children: auditing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Simulating Lighthouse..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 fill-white" }), /* @__PURE__ */ jsx("span", { children: "Run PageSpeed Audit" })] })
							})
						]
					}),
					error && /* @__PURE__ */ jsxs("div", {
						className: "p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 font-medium",
						children: ["⚠️ ", error]
					})
				]
			}),
			auditResult && /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400 px-1",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-900 dark:text-white",
									children: "Audited URL:"
								}),
								/* @__PURE__ */ jsxs("a", {
									href: auditResult.url,
									target: "_blank",
									rel: "noreferrer",
									className: "text-blue-600 hover:underline inline-flex items-center gap-1 font-mono",
									children: [auditResult.url, /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 font-bold uppercase text-[10px]",
									children: auditResult.strategy
								}),
								auditResult.is_cached && /* @__PURE__ */ jsx("span", {
									className: "px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-semibold text-[10px]",
									children: "Cached (Fast)"
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsxs("span", { children: [
								auditResult.tested_at,
								" (",
								auditResult.tested_at_human,
								")"
							] })]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
						children: [
							{
								label: "Performance",
								score: auditResult.scores.performance,
								desc: "Speed & Core Web Vitals"
							},
							{
								label: "Accessibility",
								score: auditResult.scores.accessibility,
								desc: "Usability, Contrast & ARIA"
							},
							{
								label: "Best Practices",
								score: auditResult.scores.best_practices,
								desc: "Security, HTTPS & Standards"
							},
							{
								label: "SEO",
								score: auditResult.scores.seo,
								desc: "Crawlability & Meta Tags"
							}
						].map((cat, i) => {
							const color = getScoreColor(cat.score);
							return /* @__PURE__ */ jsxs("div", {
								className: `p-5 rounded-2xl border ${color.border} ${color.bg} shadow-sm flex flex-col items-center text-center relative overflow-hidden`,
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl border-4 border-current mb-2 bg-white dark:bg-zinc-900 shadow-sm",
										style: { color: cat.score >= 90 ? "#10b981" : cat.score >= 50 ? "#f59e0b" : "#ef4444" },
										children: cat.score
									}),
									/* @__PURE__ */ jsx("h4", {
										className: "text-sm font-extrabold text-slate-900 dark:text-white",
										children: cat.label
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5",
										children: cat.desc
									})
								]
							}, i);
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Activity, { className: "w-4 h-4 text-blue-600" }), "Core Web Vitals & Page Loading Diagnostics"]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
								children: "Direct Google Search mobile ranking signals."
							})] }), auditResult.crux?.overall_category && /* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300",
								children: [/* @__PURE__ */ jsx("span", { children: "CrUX Field Assessment:" }), /* @__PURE__ */ jsx("span", {
									className: auditResult.crux.overall_category === "FAST" ? "text-emerald-600 font-extrabold" : "text-amber-600 font-extrabold",
									children: auditResult.crux.overall_category
								})]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
							children: [
								{
									key: "lcp",
									label: "LCP (Largest Paint)",
									val: auditResult.core_web_vitals.lcp.display,
									status: auditResult.core_web_vitals.lcp.status,
									target: "< 2.5s"
								},
								{
									key: "fcp",
									label: "FCP (First Paint)",
									val: auditResult.core_web_vitals.fcp.display,
									status: auditResult.core_web_vitals.fcp.status,
									target: "< 1.8s"
								},
								{
									key: "cls",
									label: "CLS (Layout Shift)",
									val: auditResult.core_web_vitals.cls.display,
									status: auditResult.core_web_vitals.cls.status,
									target: "< 0.1"
								},
								{
									key: "tbt",
									label: "TBT (Total Blocking)",
									val: auditResult.core_web_vitals.tbt.display,
									status: auditResult.core_web_vitals.tbt.status,
									target: "< 200ms"
								},
								{
									key: "speed_index",
									label: "Speed Index",
									val: auditResult.core_web_vitals.speed_index.display,
									status: auditResult.core_web_vitals.speed_index.status,
									target: "< 3.4s"
								},
								{
									key: "ttfb",
									label: "TTFB (Server Time)",
									val: auditResult.core_web_vitals.ttfb.display,
									status: auditResult.core_web_vitals.ttfb.status,
									target: "< 800ms"
								}
							].map((m) => /* @__PURE__ */ jsxs("div", {
								className: "p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 flex flex-col justify-between",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-[11px] font-bold text-slate-500 dark:text-zinc-400",
									children: m.label
								}), /* @__PURE__ */ jsx("div", {
									className: "text-lg font-black text-slate-900 dark:text-white mt-1",
									children: m.val
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between",
									children: [getStatusBadge(m.status), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400 font-mono",
										children: m.target
									})]
								})]
							}, m.key))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-amber-500" }), "Actionable Opportunities (Potential Savings)"]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
								children: "High-value code & asset improvements ranked by estimated loading time saved."
							})] }), /* @__PURE__ */ jsxs("span", {
								className: "px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold text-xs",
								children: [auditResult.opportunities?.length || 0, " Opportunities Found"]
							})]
						}), auditResult.opportunities && auditResult.opportunities.length > 0 ? /* @__PURE__ */ jsx("div", {
							className: "divide-y divide-slate-100 dark:divide-zinc-800",
							children: auditResult.opportunities.map((opp, idx) => {
								const isExpanded = expandedOpportunity === opp.id;
								return /* @__PURE__ */ jsxs("div", {
									className: "py-3.5 first:pt-0 last:pb-0",
									children: [/* @__PURE__ */ jsxs("div", {
										onClick: () => setExpandedOpportunity(isExpanded ? null : opp.id),
										className: "flex items-center justify-between gap-4 cursor-pointer group",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-3 flex-1",
											children: [/* @__PURE__ */ jsx("span", {
												className: "w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5",
												children: idx + 1
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition",
												children: opp.title
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5",
												children: opp.description
											})] })]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 shrink-0",
											children: [
												opp.savings_ms > 0 && /* @__PURE__ */ jsxs("span", {
													className: "px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold",
													children: [
														"Save ~",
														opp.savings_ms,
														" ms"
													]
												}),
												opp.savings_kib > 0 && /* @__PURE__ */ jsxs("span", {
													className: "px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-mono font-semibold",
													children: [opp.savings_kib, " KiB"]
												}),
												isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 text-slate-400" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-slate-400" })
											]
										})]
									}), isExpanded && /* @__PURE__ */ jsxs("div", {
										className: "mt-3 pl-9 text-xs text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-2",
										children: [/* @__PURE__ */ jsx("p", { children: opp.description }), opp.display_value && /* @__PURE__ */ jsxs("p", {
											className: "font-semibold text-blue-600 dark:text-blue-400",
											children: ["Impact: ", opp.display_value]
										})]
									})]
								}, idx);
							})
						}) : /* @__PURE__ */ jsxs("div", {
							className: "p-8 text-center text-xs text-slate-500",
							children: [
								/* @__PURE__ */ jsx(CheckCircle2, { className: "w-8 h-8 text-emerald-500 mx-auto mb-2" }),
								/* @__PURE__ */ jsx("p", {
									className: "font-bold text-sm text-slate-700 dark:text-zinc-300",
									children: "No Major Bottlenecks Detected!"
								}),
								/* @__PURE__ */ jsx("p", { children: "All checked Lighthouse performance thresholds are well within Google targets." })
							]
						})]
					}),
					auditResult.diagnostics && auditResult.diagnostics.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
						children: [/* @__PURE__ */ jsxs("h3", {
							className: "text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3",
							children: [/* @__PURE__ */ jsx(Layers, { className: "w-4 h-4 text-indigo-500" }), "Technical Environment Diagnostics"]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs",
							children: auditResult.diagnostics.map((d, i) => /* @__PURE__ */ jsxs("div", {
								className: "p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "font-bold text-slate-800 dark:text-zinc-200",
										children: d.label
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-mono text-blue-600 dark:text-blue-400 font-extrabold mt-1",
										children: d.display_value
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-slate-500 line-clamp-2 mt-1",
										children: d.description
									})
								]
							}, i))
						})]
					})
				]
			}),
			history.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-slate-400" }), "Audit History & Trend Log"]
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-slate-400",
						children: [history.length, " Saved Audits"]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-left text-xs border-collapse",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "border-b border-slate-100 dark:border-zinc-800 text-slate-400 font-semibold",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3",
									children: "Date"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3",
									children: "Tested Page"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3",
									children: "Device"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3 text-center",
									children: "Perf"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3 text-center",
									children: "SEO"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3 text-center",
									children: "a11y"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3",
									children: "LCP"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3",
									children: "CLS"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "py-2.5 px-3 text-right",
									children: "Action"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-100 dark:divide-zinc-800",
							children: history.map((item, i) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 whitespace-nowrap text-slate-500",
										children: item.tested_at
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 font-medium text-slate-900 dark:text-white max-w-xs truncate",
										children: item.url
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3",
										children: /* @__PURE__ */ jsx("span", {
											className: "px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-bold text-[10px] uppercase",
											children: item.strategy
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 text-center font-bold",
										style: { color: item.scores.performance >= 90 ? "#10b981" : item.scores.performance >= 50 ? "#f59e0b" : "#ef4444" },
										children: item.scores.performance
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 text-center font-bold",
										style: { color: item.scores.seo >= 90 ? "#10b981" : item.scores.seo >= 50 ? "#f59e0b" : "#ef4444" },
										children: item.scores.seo
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 text-center font-bold",
										style: { color: item.scores.accessibility >= 90 ? "#10b981" : item.scores.accessibility >= 50 ? "#f59e0b" : "#ef4444" },
										children: item.scores.accessibility
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 font-mono",
										children: item.core_web_vitals?.lcp?.display || "N/A"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 font-mono",
										children: item.core_web_vitals?.cls?.display || "0"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "py-2.5 px-3 text-right",
										children: /* @__PURE__ */ jsx("button", {
											onClick: () => {
												setUrlInput(item.url);
												setStrategy(item.strategy);
												setAuditResult(item);
											},
											className: "text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer",
											children: "View Results"
										})
									})
								]
							}, i))
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { PageSpeedTab as default };
