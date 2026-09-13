import { t as AdminLayout } from "./AdminLayout-CqhGBDWs.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { format } from "date-fns";
//#region resources/js/Pages/Admin/SeoAudit/Index.jsx
function SeoAuditDashboard() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/posts").then((res) => res.json()).then((data) => {
			if (Array.isArray(data)) {
				const sorted = data.sort((a, b) => (a.seoScore || 0) - (b.seoScore || 0));
				setPosts(sorted);
			}
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			padding: "40px",
			textAlign: "center",
			color: "#64748b"
		},
		children: "Loading SEO Data..."
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(Head, { title: "SEO Audit | Admin" }),
		/* @__PURE__ */ jsxs("div", {
			style: { marginBottom: "32px" },
			children: [/* @__PURE__ */ jsx("h1", {
				style: {
					fontSize: "28px",
					fontWeight: 800,
					color: "#0f172a",
					letterSpacing: "-0.5px",
					marginBottom: "8px"
				},
				children: "SEO Audit Dashboard"
			}), /* @__PURE__ */ jsx("p", {
				style: {
					color: "#64748b",
					fontSize: "15px",
					maxWidth: "600px"
				},
				children: "Identify posts with low SEO scores and use AI to automatically generate missing metadata, tags, and FAQs."
			})]
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
				background: "#fff",
				border: "1px solid #e2e8f0",
				borderRadius: "12px",
				overflow: "hidden",
				boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
			},
			children: /* @__PURE__ */ jsx("div", {
				style: {
					overflowX: "auto",
					width: "100%"
				},
				children: /* @__PURE__ */ jsxs("table", {
					style: {
						width: "100%",
						minWidth: "600px",
						borderCollapse: "collapse",
						textAlign: "left"
					},
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						style: {
							background: "#f8fafc",
							borderBottom: "1px solid #e2e8f0"
						},
						children: [
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase",
									letterSpacing: "0.5px"
								},
								children: "Article"
							}),
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase",
									letterSpacing: "0.5px"
								},
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase",
									letterSpacing: "0.5px"
								},
								children: "SEO Score"
							}),
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase",
									letterSpacing: "0.5px",
									textAlign: "right"
								},
								children: "Action"
							})
						]
					}) }), /* @__PURE__ */ jsxs("tbody", { children: [posts.map((post) => {
						const score = post.seoScore || 0;
						const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
						const scoreBg = score >= 80 ? "#ecfdf5" : score >= 50 ? "#fffbeb" : "#fef2f2";
						return /* @__PURE__ */ jsxs("tr", {
							style: { borderBottom: "1px solid #e2e8f0" },
							children: [
								/* @__PURE__ */ jsxs("td", {
									style: { padding: "16px 24px" },
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontWeight: 600,
											color: "#0f172a",
											marginBottom: "4px",
											fontSize: "15px"
										},
										children: post.title
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "13px",
											color: "#64748b"
										},
										children: ["Updated: ", format(new Date(post.date || /* @__PURE__ */ new Date()), "MMM d, yyyy")]
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									style: { padding: "16px 24px" },
									children: /* @__PURE__ */ jsx("span", {
										style: {
											display: "inline-block",
											padding: "4px 8px",
											borderRadius: "4px",
											fontSize: "11px",
											fontWeight: 700,
											textTransform: "uppercase",
											background: post.published ? "#eff6ff" : "#f1f5f9",
											color: post.published ? "#2563eb" : "#64748b"
										},
										children: post.published ? "Published" : "Draft"
									})
								}),
								/* @__PURE__ */ jsx("td", {
									style: { padding: "16px 24px" },
									children: /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "8px"
										},
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												background: scoreBg,
												color: scoreColor,
												fontWeight: 800,
												padding: "4px 10px",
												borderRadius: "20px",
												fontSize: "13px",
												border: `1px solid ${scoreColor}30`
											},
											children: [score, "/100"]
										}), score < 80 && /* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "12px",
												color: "#ef4444",
												fontWeight: 600
											},
											children: "Needs Work"
										})]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									style: {
										padding: "16px 24px",
										textAlign: "right"
									},
									children: /* @__PURE__ */ jsx(Link, {
										href: window.BASE_PATH + `/admin/posts/edit/${post.id}`,
										style: {
											display: "inline-block",
											background: score < 80 ? "#9333ea" : "#f1f5f9",
											color: score < 80 ? "#fff" : "#475569",
											padding: "8px 16px",
											borderRadius: "6px",
											textDecoration: "none",
											fontSize: "13px",
											fontWeight: 600,
											transition: "all 0.2s",
											border: score < 80 ? "none" : "1px solid #cbd5e1",
											whiteSpace: "nowrap"
										},
										children: score < 80 ? "✨ Improve with AI" : "Edit Post"
									})
								})
							]
						}, post.id);
					}), posts.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 4,
						style: {
							padding: "40px",
							textAlign: "center",
							color: "#64748b"
						},
						children: "No posts available for audit."
					}) })] })]
				})
			})
		})
	] });
}
SeoAuditDashboard.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { SeoAuditDashboard as default };
