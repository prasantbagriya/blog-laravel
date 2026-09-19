import DeleteButton from "./DeleteButton-4pbNZztV.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useEffect, useMemo, useState } from "react";
//#region resources/js/Pages/Admin/Index.jsx
var AdminLayout = React.lazy(() => import("./AdminLayout-xqBz233I.js"));
function AdminPage() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const BASE = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
	const [activeTab, setActiveTab] = useState("dashboard");
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			if (isMounted) controller.abort("timeout");
		}, 15e3);
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/posts", {
			cache: "no-store",
			signal: controller.signal
		}).then((res) => {
			clearTimeout(timeoutId);
			if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
			return res.json();
		}).then((data) => {
			if (!isMounted) return;
			if (Array.isArray(data)) setPosts(data);
			else {
				console.error("[Admin] Invalid data received from /api/admin/posts:", data);
				setError("Invalid data format received from the server.");
			}
			setLoading(false);
		}).catch((err) => {
			if (!isMounted) return;
			clearTimeout(timeoutId);
			console.error("[Admin] Fetch error for /api/admin/posts:", err);
			setError(err.name === "AbortError" ? "Request timed out." : err.message);
			setLoading(false);
		});
		return () => {
			isMounted = false;
			clearTimeout(timeoutId);
		};
	}, []);
	const stats = useMemo(() => {
		const total = posts.length;
		const published = posts.filter((p) => p.published).length;
		const drafts = total - published;
		const totalSeo = posts.reduce((sum, p) => sum + (p.seoScore || 0), 0);
		const avgSeo = total > 0 ? Math.round(totalSeo / total) : 0;
		const totalWords = posts.map((p) => {
			return (p.content || "").replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
		}).reduce((sum, count) => sum + count, 0);
		const avgWords = total > 0 ? Math.round(totalWords / total) : 0;
		const pillarCount = posts.filter((p) => p.isPillarPage).length;
		const hasFactChecker = posts.filter((p) => p.factCheckedBy).length;
		const hasSources = posts.filter((p) => p.sources && p.sources.length > 0).length;
		const hasSocials = posts.filter((p) => p.authorSocials?.twitter || p.authorSocials?.linkedin || p.authorSocials?.website).length;
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
			eeatScore: total > 0 ? Math.round((hasFactChecker / total * .4 + hasSources / total * .4 + hasSocials / total * .2) * 100) : 0
		};
	}, [posts]);
	const intentAnalysis = useMemo(() => {
		const counts = {
			informational: 0,
			transactional: 0,
			commercial: 0,
			navigational: 0
		};
		posts.forEach((p) => {
			const intent = p.searchIntent || "informational";
			if (counts[intent] !== void 0) counts[intent]++;
		});
		const total = posts.length || 1;
		return Object.entries(counts).map(([intent, count]) => ({
			name: intent.charAt(0).toUpperCase() + intent.slice(1),
			count,
			percentage: Math.round(count / total * 100)
		}));
	}, [posts]);
	const seoAlerts = useMemo(() => {
		const alerts = [];
		posts.forEach((p) => {
			if (!p.metaDescription || p.metaDescription.trim() === "") alerts.push({
				id: `meta-${p.id}`,
				postTitle: p.title || "Untitled Post",
				postId: p.id,
				severity: "critical",
				message: "Missing Meta Description: Google will auto-generate one, drastically lowering CTR potential.",
				type: "SEO"
			});
			if (!p.seoScore || p.seoScore < 80) alerts.push({
				id: `score-${p.id}`,
				postTitle: p.title || "Untitled Post",
				postId: p.id,
				severity: "critical",
				message: `Low SEO Score (${p.seoScore || 0}%): Under the recommended 80% baseline. High ranking is unlikely.`,
				type: "SEO"
			});
			if (!p.sources || p.sources.length === 0) alerts.push({
				id: `source-${p.id}`,
				postTitle: p.title || "Untitled Post",
				postId: p.id,
				severity: "warning",
				message: "No External Sources: Lacks references or primary literature link. Harder to rank under E-E-A-T guidelines.",
				type: "E-E-A-T"
			});
			if (!p.factCheckedBy || p.factCheckedBy.trim() === "") alerts.push({
				id: `fact-${p.id}`,
				postTitle: p.title || "Untitled Post",
				postId: p.id,
				severity: "warning",
				message: "No Fact-Checker Assigned: Incomplete reviewedBy schema. Missing credibility badge.",
				type: "E-E-A-T"
			});
			if (p.nextReviewDate) {
				if (new Date(p.nextReviewDate) < /* @__PURE__ */ new Date()) {
					const formattedDate = new Date(p.nextReviewDate).toLocaleDateString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric"
					});
					alerts.push({
						id: `stale-${p.id}`,
						postTitle: p.title || "Untitled Post",
						postId: p.id,
						severity: "info",
						message: `Review Overdue: Content review date was scheduled for ${formattedDate}. Updates required.`,
						type: "Staleness"
					});
				}
			}
			if (!p.targetRegion || !p.targetLanguage) alerts.push({
				id: `geo-${p.id}`,
				postTitle: p.title || "Untitled Post",
				postId: p.id,
				severity: "warning",
				message: "Missing Geographic/Language Targeting: Define targetRegion (e.g., IN) and targetLanguage (e.g., en-IN) to ensure Google GSC registers geographic relevance for AI Overviews.",
				type: "SEO"
			});
		});
		return alerts.sort((a, b) => {
			const priority = {
				critical: 0,
				warning: 1,
				info: 2
			};
			return priority[a.severity] - priority[b.severity];
		});
	}, [posts]);
	if (loading) return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			minHeight: "300px",
			gap: "1rem"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				width: "40px",
				height: "40px",
				border: "3px solid #e2e8f0",
				borderTopColor: "var(--primary)",
				borderRadius: "50%",
				animation: "spin 1s linear infinite"
			} }),
			/* @__PURE__ */ jsx("div", {
				style: {
					color: "var(--muted-foreground)",
					fontWeight: 600
				},
				children: "Analyzing Editorial Database..."
			}),
			/* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: "@keyframes spin { to { transform: rotate(360deg); } }" } })
		]
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			minHeight: "300px",
			gap: "1rem",
			color: "#ef4444"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				style: { fontSize: "3rem" },
				children: "⚠️"
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					fontWeight: 800,
					fontSize: "1.25rem"
				},
				children: "Failed to Load Data"
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					color: "var(--muted-foreground)",
					fontWeight: 500
				},
				children: error
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: () => window.location.reload(),
				style: {
					marginTop: "1rem",
					background: "var(--primary)",
					color: "#fff",
					padding: "0.5rem 1rem",
					borderRadius: "6px",
					border: "none",
					cursor: "pointer",
					fontWeight: 700
				},
				children: "Try Again"
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		style: { animation: "fadeIn 0.4s ease-out" },
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Admin Dashboard" }),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "0.5rem",
					marginBottom: "2rem"
				},
				children: [/* @__PURE__ */ jsx("h1", {
					style: {
						fontSize: "2rem",
						fontWeight: 900,
						letterSpacing: "-0.04em",
						color: "#0f172a",
						margin: 0
					},
					children: "Editorial Control Center"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "var(--muted-foreground)",
						fontSize: "0.9375rem",
						margin: 0
					},
					children: "Manage content publishing, audit SEO compliance parameters, and review active E-E-A-T metrics."
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					gap: "0.5rem",
					borderBottom: "1px solid var(--border)",
					paddingBottom: "0.75rem",
					marginBottom: "2rem",
					overflowX: "auto",
					WebkitOverflowScrolling: "touch",
					whiteSpace: "nowrap"
				},
				children: [
					/* @__PURE__ */ jsx("button", {
						onClick: () => setActiveTab("dashboard"),
						style: {
							background: activeTab === "dashboard" ? "var(--primary)" : "transparent",
							color: activeTab === "dashboard" ? "#fff" : "var(--muted-foreground)",
							border: "none",
							borderRadius: "var(--radius)",
							padding: "0.5rem 1.25rem",
							fontSize: "0.875rem",
							fontWeight: 700,
							cursor: "pointer",
							transition: "all 0.2s ease",
							boxShadow: activeTab === "dashboard" ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "none"
						},
						children: "📊 Insights & Analytics"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setActiveTab("posts"),
						style: {
							background: activeTab === "posts" ? "var(--primary)" : "transparent",
							color: activeTab === "posts" ? "#fff" : "var(--muted-foreground)",
							border: "none",
							borderRadius: "var(--radius)",
							padding: "0.5rem 1.25rem",
							fontSize: "0.875rem",
							fontWeight: 700,
							cursor: "pointer",
							transition: "all 0.2s ease",
							boxShadow: activeTab === "posts" ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "none"
						},
						children: "📌 Manage Posts"
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab("auditor"),
						style: {
							background: activeTab === "auditor" ? "var(--primary)" : "transparent",
							color: activeTab === "auditor" ? "#fff" : "var(--muted-foreground)",
							border: "none",
							borderRadius: "var(--radius)",
							padding: "0.5rem 1.25rem",
							fontSize: "0.875rem",
							fontWeight: 700,
							cursor: "pointer",
							transition: "all 0.2s ease",
							position: "relative",
							boxShadow: activeTab === "auditor" ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "none"
						},
						children: ["🛡️ E-E-A-T & SEO Auditor", seoAlerts.length > 0 && /* @__PURE__ */ jsx("span", {
							style: {
								position: "absolute",
								top: "-6px",
								right: "-6px",
								background: "#ef4444",
								color: "#fff",
								fontSize: "10px",
								fontWeight: 800,
								padding: "2px 6px",
								borderRadius: "999px",
								border: "2px solid #f8fafc"
							},
							children: seoAlerts.length
						})]
					})
				]
			}),
			activeTab === "dashboard" && /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "2rem"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
							gap: "1.5rem"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "glass-panel",
								style: {
									padding: "1.5rem",
									display: "flex",
									flexDirection: "column",
									gap: "0.5rem"
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "0.75rem",
											fontWeight: 800,
											textTransform: "uppercase",
											letterSpacing: "0.05em",
											color: "var(--muted-foreground)"
										},
										children: "Total Content Base"
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "2.25rem",
											fontWeight: 900,
											color: "#0f172a",
											lineHeight: 1
										},
										children: stats.total
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "0.8125rem",
											color: "var(--muted-foreground)",
											display: "flex",
											gap: "8px"
										},
										children: [
											/* @__PURE__ */ jsxs("span", {
												style: {
													color: "#059669",
													fontWeight: 700
												},
												children: [
													"● ",
													stats.published,
													" Published"
												]
											}),
											/* @__PURE__ */ jsx("span", { children: "•" }),
											/* @__PURE__ */ jsxs("span", {
												style: { fontWeight: 700 },
												children: [
													"● ",
													stats.drafts,
													" Drafts"
												]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "glass-panel",
								style: {
									padding: "1.5rem",
									display: "flex",
									flexDirection: "column",
									gap: "0.5rem"
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "0.75rem",
											fontWeight: 800,
											textTransform: "uppercase",
											letterSpacing: "0.05em",
											color: "var(--muted-foreground)"
										},
										children: "Avg SEO Optimization"
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "2.25rem",
											fontWeight: 900,
											color: "var(--primary)",
											lineHeight: 1
										},
										children: [stats.avgSeo, "%"]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "0.8125rem",
											color: "var(--muted-foreground)"
										},
										children: [
											"Targeting a minimum of ",
											/* @__PURE__ */ jsx("strong", {
												style: { color: "#059669" },
												children: "80%"
											}),
											" sitewide standard"
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "glass-panel",
								style: {
									padding: "1.5rem",
									display: "flex",
									flexDirection: "column",
									gap: "0.5rem"
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "0.75rem",
											fontWeight: 800,
											textTransform: "uppercase",
											letterSpacing: "0.05em",
											color: "var(--muted-foreground)"
										},
										children: "E-E-A-T Credibility Index"
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "2.25rem",
											fontWeight: 900,
											color: "#7c3aed",
											lineHeight: 1
										},
										children: [stats.eeatScore, "%"]
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "0.8125rem",
											color: "var(--muted-foreground)"
										},
										children: "Weighted trust index based on E-E-A-T factors"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "glass-panel",
								style: {
									padding: "1.5rem",
									display: "flex",
									flexDirection: "column",
									gap: "0.5rem"
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "0.75rem",
											fontWeight: 800,
											textTransform: "uppercase",
											letterSpacing: "0.05em",
											color: "var(--muted-foreground)"
										},
										children: "Aggregated Word Count"
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "2.25rem",
											fontWeight: 900,
											color: "#0f172a",
											lineHeight: 1
										},
										children: stats.totalWords.toLocaleString()
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "0.8125rem",
											color: "var(--muted-foreground)"
										},
										children: [
											"Averaging ",
											/* @__PURE__ */ jsx("strong", { children: stats.avgWords }),
											" words per article"
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
							gap: "1.5rem"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							className: "glass-panel",
							style: { padding: "2rem" },
							children: [/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "1.125rem",
									fontWeight: 800,
									marginBottom: "1.5rem",
									display: "flex",
									alignItems: "center",
									gap: "0.5rem"
								},
								children: "🎯 Search Intent Distribution"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "1.25rem"
								},
								children: intentAnalysis.map((intent) => /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "0.35rem"
									},
									children: [/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											fontSize: "0.875rem",
											fontWeight: 700
										},
										children: [/* @__PURE__ */ jsx("span", {
											style: { color: "#334155" },
											children: intent.name
										}), /* @__PURE__ */ jsxs("span", {
											style: { color: "var(--primary)" },
											children: [
												intent.percentage,
												"% ",
												/* @__PURE__ */ jsxs("span", {
													style: {
														fontWeight: 500,
														color: "var(--muted-foreground)",
														fontSize: "0.75rem"
													},
													children: [
														"(",
														intent.count,
														")"
													]
												})
											]
										})]
									}), /* @__PURE__ */ jsx("div", {
										style: {
											width: "100%",
											height: "8px",
											background: "#f1f5f9",
											borderRadius: "4px",
											overflow: "hidden"
										},
										children: /* @__PURE__ */ jsx("div", { style: {
											width: `${intent.percentage}%`,
											height: "100%",
											background: "linear-gradient(to right, var(--primary), #4f46e5)",
											borderRadius: "4px",
											transition: "width 0.8s ease"
										} })
									})]
								}, intent.name))
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "glass-panel",
							style: { padding: "2rem" },
							children: [/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "1.125rem",
									fontWeight: 800,
									marginBottom: "1.5rem",
									display: "flex",
									alignItems: "center",
									gap: "0.5rem"
								},
								children: "🛡️ E-E-A-T Quality Signals"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "1.25rem"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "0.35rem"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												fontSize: "0.875rem",
												fontWeight: 700
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { color: "#334155" },
												children: "Verified Fact-Checking Rate"
											}), /* @__PURE__ */ jsxs("span", {
												style: { color: "#059669" },
												children: [stats.total > 0 ? Math.round(stats.hasFactChecker / stats.total * 100) : 0, "%"]
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												width: "100%",
												height: "8px",
												background: "#f1f5f9",
												borderRadius: "4px",
												overflow: "hidden"
											},
											children: /* @__PURE__ */ jsx("div", { style: {
												width: `${stats.total > 0 ? stats.hasFactChecker / stats.total * 100 : 0}%`,
												height: "100%",
												background: "#059669",
												borderRadius: "4px"
											} })
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "0.75rem",
												color: "var(--muted-foreground)"
											},
											children: [
												stats.hasFactChecker,
												" out of ",
												stats.total,
												" posts carry a checkedBy editorial signature."
											]
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "0.35rem",
										marginTop: "0.5rem"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												fontSize: "0.875rem",
												fontWeight: 700
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { color: "#334155" },
												children: "Authoritative Source Citation Rate"
											}), /* @__PURE__ */ jsxs("span", {
												style: { color: "#059669" },
												children: [stats.total > 0 ? Math.round(stats.hasSources / stats.total * 100) : 0, "%"]
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												width: "100%",
												height: "8px",
												background: "#f1f5f9",
												borderRadius: "4px",
												overflow: "hidden"
											},
											children: /* @__PURE__ */ jsx("div", { style: {
												width: `${stats.total > 0 ? stats.hasSources / stats.total * 100 : 0}%`,
												height: "100%",
												background: "#059669",
												borderRadius: "4px"
											} })
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "0.75rem",
												color: "var(--muted-foreground)"
											},
											children: [
												stats.hasSources,
												" out of ",
												stats.total,
												" posts cite primary external research databases."
											]
										})
									]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "glass-panel",
						style: {
							padding: "2rem",
							background: "linear-gradient(to right, var(--accent), #ffffff)",
							borderLeft: "4px solid var(--primary)",
							display: "flex",
							gap: "1.5rem",
							alignItems: "flex-start"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: { fontSize: "2rem" },
							children: "💡"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							style: {
								fontSize: "1rem",
								fontWeight: 800,
								marginBottom: "0.5rem",
								color: "#0f172a"
							},
							children: "Strategic Recommendation"
						}), /* @__PURE__ */ jsxs("p", {
							style: {
								fontSize: "0.875rem",
								color: "var(--muted-foreground)",
								lineHeight: 1.6,
								margin: 0
							},
							children: [
								"Google's 2026 search quality rater guidelines highly prioritize content with verifiable E-E-A-T signals. To boost sitewide ranking authority, focus on increasing the ",
								/* @__PURE__ */ jsx("strong", { children: "Verified Fact-Checking Rate" }),
								" by assigning an editor signature, and linking at least three peer-reviewed or primary data source references to each article."
							]
						})] })]
					})
				]
			}),
			activeTab === "posts" && /* @__PURE__ */ jsxs("div", {
				style: { animation: "fadeIn 0.3s ease-out" },
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "1.5rem",
						gap: "0.75rem",
						flexWrap: "wrap"
					},
					children: [/* @__PURE__ */ jsxs("h3", {
						style: {
							fontSize: "1.125rem",
							fontWeight: 800,
							margin: 0,
							whiteSpace: "nowrap"
						},
						children: [
							"Content Catalog (",
							posts.length,
							" items)"
						]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "0.5rem",
							alignItems: "center",
							flexShrink: 0
						},
						children: [/* @__PURE__ */ jsx("a", {
							href: BASE + "/admin/export-seo",
							style: {
								background: "#10b981",
								color: "#fff",
								padding: "0.5rem 0.75rem",
								borderRadius: "6px",
								fontSize: "0.8125rem",
								fontWeight: 700,
								textDecoration: "none",
								boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
								whiteSpace: "nowrap",
								flexShrink: 0
							},
							children: "Export SEO CSV"
						}), /* @__PURE__ */ jsx(Link, {
							href: BASE + "/admin/posts/new",
							style: {
								background: "var(--primary)",
								color: "#fff",
								padding: "0.5rem 0.75rem",
								borderRadius: "6px",
								fontSize: "0.8125rem",
								fontWeight: 700,
								textDecoration: "none",
								boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
								whiteSpace: "nowrap",
								flexShrink: 0
							},
							children: "+ Create New Post"
						})]
					})]
				}), isMobile ? /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "1rem"
					},
					children: posts.map((post) => {
						const words = (post.content || "").replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
						return /* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								borderRadius: "12px",
								border: "1px solid #e2e8f0",
								padding: "1rem",
								display: "flex",
								flexDirection: "column",
								gap: "0.75rem"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										alignItems: "flex-start"
									},
									children: [/* @__PURE__ */ jsx(Link, {
										href: BASE + `/admin/posts/edit/${post.id}`,
										style: {
											fontWeight: 800,
											color: "#0f172a",
											textDecoration: "none",
											fontSize: "15px"
										},
										children: post.title || "Untitled Article"
									}), post.published ? /* @__PURE__ */ jsx("span", {
										style: {
											background: "#ecfdf5",
											color: "#047857",
											padding: "2px 8px",
											borderRadius: "999px",
											fontSize: "10px",
											fontWeight: 800
										},
										children: "Published"
									}) : /* @__PURE__ */ jsx("span", {
										style: {
											background: "#f1f5f9",
											color: "#475569",
											padding: "2px 8px",
											borderRadius: "999px",
											fontSize: "10px",
											fontWeight: 800
										},
										children: "Draft"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: "11px",
										color: "#64748b",
										display: "flex",
										flexWrap: "wrap",
										gap: "8px"
									},
									children: [
										/* @__PURE__ */ jsxs("span", { children: ["📁 ", post.category] }),
										/* @__PURE__ */ jsxs("span", { children: ["📅 ", post.date ? new Date(post.date).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric"
										}) : ""] }),
										/* @__PURE__ */ jsxs("span", { children: [
											"✍️ ",
											words,
											" words"
										] }),
										/* @__PURE__ */ jsxs("span", {
											style: {
												color: (post.seoScore || 0) >= 80 ? "#059669" : "#d97706",
												fontWeight: 700
											},
											children: [
												"📈 ",
												post.seoScore || 0,
												"% SEO"
											]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginTop: "0.5rem",
										paddingTop: "0.5rem",
										borderTop: "1px solid #f1f5f9"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											flexDirection: "column"
										},
										children: /* @__PURE__ */ jsx("span", {
											style: {
												fontWeight: 600,
												color: "#334155",
												fontSize: "13px"
											},
											children: post.author
										})
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "1rem",
											fontSize: "13px"
										},
										children: [/* @__PURE__ */ jsx(Link, {
											href: BASE + `/admin/posts/edit/${post.id}`,
											style: {
												color: "var(--primary)",
												fontWeight: 700,
												textDecoration: "none",
												whiteSpace: "nowrap"
											},
											children: "Edit"
										}), /* @__PURE__ */ jsx(DeleteButton, {
											id: post.id,
											type: "post"
										})]
									})]
								})
							]
						}, post.id);
					})
				}) : /* @__PURE__ */ jsx("div", {
					style: {
						background: "#ffffff",
						borderRadius: "12px",
						border: "1px solid #e2e8f0",
						overflow: "hidden"
					},
					children: /* @__PURE__ */ jsx("div", {
						style: {
							width: "100%",
							overflowX: "auto",
							WebkitOverflowScrolling: "touch"
						},
						children: /* @__PURE__ */ jsxs("table", {
							style: {
								width: "100%",
								minWidth: "800px",
								borderCollapse: "collapse"
							},
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								style: {
									background: "#f8fafc",
									borderBottom: "1px solid #e2e8f0"
								},
								children: [
									/* @__PURE__ */ jsx("th", {
										style: thStyle,
										children: "Title & Category"
									}),
									/* @__PURE__ */ jsx("th", {
										style: thStyle,
										children: "Author Profile"
									}),
									/* @__PURE__ */ jsx("th", {
										style: thStyle,
										children: "SEO Health"
									}),
									/* @__PURE__ */ jsx("th", {
										style: thStyle,
										children: "EEAT Signals"
									}),
									/* @__PURE__ */ jsx("th", {
										style: thStyle,
										children: "Publish Status"
									}),
									/* @__PURE__ */ jsx("th", {
										style: thStyle,
										children: "Control Options"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", { children: posts.map((post) => {
								const words = (post.content || "").replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
								post.factCheckedBy && post.sources && post.sources.length;
								return /* @__PURE__ */ jsxs("tr", {
									className: "admin-table-row",
									style: { borderBottom: "1px solid #f1f5f9" },
									children: [
										/* @__PURE__ */ jsxs("td", {
											style: tdStyle,
											children: [/* @__PURE__ */ jsx(Link, {
												href: BASE + `/admin/posts/edit/${post.id}`,
												style: {
													fontWeight: 800,
													color: "#0f172a",
													textDecoration: "none"
												},
												children: post.title || "Untitled Article"
											}), /* @__PURE__ */ jsxs("div", {
												style: {
													fontSize: "11px",
													color: "#64748b",
													marginTop: "0.25rem",
													display: "flex",
													gap: "8px"
												},
												children: [
													/* @__PURE__ */ jsxs("span", { children: ["📁 ", post.category] }),
													/* @__PURE__ */ jsx("span", { children: "•" }),
													/* @__PURE__ */ jsxs("span", { children: ["📅 ", post.date ? new Date(post.date).toLocaleDateString("en-US", {
														year: "numeric",
														month: "short",
														day: "numeric"
													}) : ""] }),
													/* @__PURE__ */ jsx("span", { children: "•" }),
													/* @__PURE__ */ jsxs("span", { children: [
														"✍️ ",
														words,
														" words"
													] })
												]
											})]
										}),
										/* @__PURE__ */ jsxs("td", {
											style: tdStyle,
											children: [/* @__PURE__ */ jsx("span", {
												style: {
													fontWeight: 600,
													color: "#334155"
												},
												children: post.author
											}), /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "10px",
													color: "#64748b"
												},
												children: post.authorJobTitle
											})]
										}),
										/* @__PURE__ */ jsx("td", {
											style: tdStyle,
											children: /* @__PURE__ */ jsxs("span", {
												style: {
													fontWeight: 800,
													color: (post.seoScore || 0) >= 80 ? "#059669" : "#d97706"
												},
												children: [post.seoScore || 0, "%"]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											style: tdStyle,
											children: /* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													gap: "4px"
												},
												children: [
													/* @__PURE__ */ jsx("span", {
														title: post.factCheckedBy ? `Fact Checked by ${post.factCheckedBy}` : "Unverified Content",
														style: {
															opacity: post.factCheckedBy ? 1 : .25,
															cursor: "help",
															fontSize: "14px"
														},
														children: "🛡️"
													}),
													/* @__PURE__ */ jsx("span", {
														title: post.sources && post.sources.length > 0 ? `${post.sources.length} authoritative references cited` : "No references cited",
														style: {
															opacity: post.sources && post.sources.length > 0 ? 1 : .25,
															cursor: "help",
															fontSize: "14px"
														},
														children: "📚"
													}),
													/* @__PURE__ */ jsx("span", {
														title: post.isPillarPage ? "High-value pillar page" : "Regular post",
														style: {
															opacity: post.isPillarPage ? 1 : .25,
															cursor: "help",
															fontSize: "14px"
														},
														children: "⭐"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											style: tdStyle,
											children: post.published ? /* @__PURE__ */ jsx("span", {
												style: {
													background: "#ecfdf5",
													color: "#047857",
													padding: "4px 10px",
													borderRadius: "999px",
													fontSize: "11px",
													fontWeight: 800,
													display: "inline-block"
												},
												children: "Published"
											}) : /* @__PURE__ */ jsx("span", {
												style: {
													background: "#f1f5f9",
													color: "#475569",
													padding: "4px 10px",
													borderRadius: "999px",
													fontSize: "11px",
													fontWeight: 800,
													display: "inline-block"
												},
												children: "Draft"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											style: tdStyle,
											children: /* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													gap: "1rem",
													fontSize: "13px"
												},
												children: [/* @__PURE__ */ jsx(Link, {
													href: BASE + `/admin/posts/edit/${post.id}`,
													style: {
														color: "var(--primary)",
														fontWeight: 700,
														textDecoration: "none",
														whiteSpace: "nowrap"
													},
													children: "Edit"
												}), /* @__PURE__ */ jsx(DeleteButton, {
													id: post.id,
													type: "post"
												})]
											})
										})
									]
								}, post.id);
							}) })]
						})
					})
				})]
			}),
			activeTab === "auditor" && /* @__PURE__ */ jsxs("div", {
				style: {
					animation: "fadeIn 0.3s ease-out",
					display: "flex",
					flexDirection: "column",
					gap: "1.5rem"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center"
					},
					children: [/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "1.125rem",
							fontWeight: 800,
							margin: 0
						},
						children: "Active Editorial Audits Checklist"
					}), /* @__PURE__ */ jsx("span", {
						style: {
							fontSize: "0.8125rem",
							color: "var(--muted-foreground)"
						},
						children: "Scan dynamically detects compliance risks for Google 2026 indexing algorithms."
					})]
				}), seoAlerts.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "glass-panel",
					style: {
						padding: "3rem",
						textAlign: "center",
						display: "flex",
						flexDirection: "column",
						gap: "1rem",
						alignItems: "center"
					},
					children: [
						/* @__PURE__ */ jsx("span", {
							style: { fontSize: "3rem" },
							children: "🎉"
						}),
						/* @__PURE__ */ jsx("h4", {
							style: {
								fontSize: "1.25rem",
								fontWeight: 800,
								color: "#0f172a",
								margin: 0
							},
							children: "100% Compliance Achieved!"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								color: "var(--muted-foreground)",
								fontSize: "0.875rem",
								maxWidth: "400px",
								margin: 0,
								lineHeight: 1.6
							},
							children: "Excellent work! All published posts successfully carry authoritative backlinks, detailed fact-checker reviewedBy schemas, completed meta properties, and optimal search index metadata."
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "1rem"
					},
					children: seoAlerts.map((alert) => /* @__PURE__ */ jsxs("div", {
						className: "glass-panel",
						style: {
							padding: "1.25rem 1.5rem",
							borderLeft: `5px solid ${alert.severity === "critical" ? "#ef4444" : alert.severity === "warning" ? "#f59e0b" : "#3b82f6"}`,
							display: "flex",
							flexDirection: "column",
							gap: "0.5rem",
							background: "#ffffff"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									flexWrap: "wrap",
									gap: "0.5rem"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "0.5rem"
									},
									children: [/* @__PURE__ */ jsx("span", {
										style: {
											background: alert.severity === "critical" ? "#fee2e2" : alert.severity === "warning" ? "#fef3c7" : "#dbeafe",
											color: alert.severity === "critical" ? "#dc2626" : alert.severity === "warning" ? "#d97706" : "#2563eb",
											fontSize: "10px",
											fontWeight: 800,
											padding: "2px 8px",
											borderRadius: "4px",
											textTransform: "uppercase"
										},
										children: alert.severity
									}), /* @__PURE__ */ jsx("strong", {
										style: {
											fontSize: "0.9375rem",
											color: "#0f172a"
										},
										children: alert.postTitle
									})]
								}), /* @__PURE__ */ jsx(Link, {
									href: BASE + `/admin/posts/edit/${alert.postId}`,
									style: {
										fontSize: "0.8125rem",
										fontWeight: 800,
										color: "var(--primary)",
										textDecoration: "none"
									},
									children: "Optimize Post →"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								style: {
									margin: 0,
									fontSize: "0.875rem",
									color: "var(--muted-foreground)",
									lineHeight: 1.5
								},
								children: alert.message
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "10px",
									color: "#94a3b8",
									display: "flex",
									gap: "10px"
								},
								children: /* @__PURE__ */ jsxs("span", { children: ["Audit Type: ", /* @__PURE__ */ jsx("strong", { children: alert.type })] })
							})
						]
					}, alert.id))
				})]
			})
		]
	});
}
AdminPage.layout = (page) => /* @__PURE__ */ jsx(Suspense, {
	fallback: /* @__PURE__ */ jsx("div", {
		style: {
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		children: "Loading Admin Workspace..."
	}),
	children: /* @__PURE__ */ jsx(AdminLayout, { children: page })
});
var thStyle = {
	padding: "16px 24px",
	textAlign: "left",
	fontSize: "11px",
	color: "#64748b",
	textTransform: "uppercase",
	fontWeight: 800,
	letterSpacing: "0.05em"
};
var tdStyle = {
	padding: "16px 24px",
	fontSize: "14px",
	color: "#475569"
};
//#endregion
export { AdminPage as default };
