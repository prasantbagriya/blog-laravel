import { t as AdminLayout } from "./AdminLayout-CqhGBDWs.js";
import DeleteButton from "./DeleteButton-4pbNZztV.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Pages/Admin/Stories/Index.jsx
function StoriesDashboard() {
	const BASE = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
	const [stories, setStories] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/stories").then((res) => res.json()).then((data) => {
			if (Array.isArray(data)) setStories(data);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			padding: "2rem",
			textAlign: "center"
		},
		children: "Loading Stories..."
	});
	return /* @__PURE__ */ jsxs("div", {
		style: {
			margin: 0,
			padding: 0
		},
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Web Stories | Admin" }),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: "24px"
				},
				children: [/* @__PURE__ */ jsx("h1", {
					style: {
						fontSize: "28px",
						fontWeight: 700,
						margin: 0,
						color: "#0f172a"
					},
					children: "Web Stories"
				}), /* @__PURE__ */ jsx(Link, {
					href: BASE + "/admin/stories/new",
					style: {
						background: "#2563eb",
						color: "#fff",
						padding: "10px 20px",
						borderRadius: "8px",
						fontWeight: 600,
						whiteSpace: "nowrap"
					},
					children: "+ Create Story"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					gap: "24px",
					fontSize: "14px",
					marginBottom: "24px",
					color: "#64748b",
					fontWeight: 600
				},
				children: [/* @__PURE__ */ jsxs("div", { children: ["Total Stories: ", /* @__PURE__ */ jsx("span", {
					style: { color: "#2563eb" },
					children: stories.length
				})] }), /* @__PURE__ */ jsxs("div", { children: ["Published: ", /* @__PURE__ */ jsx("span", {
					style: { color: "#059669" },
					children: stories.filter((s) => s.published).length
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
					gap: "20px"
				},
				children: [stories.map((story) => /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						borderRadius: "12px",
						border: "1px solid #e2e8f0",
						overflow: "hidden"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							position: "relative",
							width: "100%",
							aspectRatio: "3/4"
						},
						children: [/* @__PURE__ */ jsx("img", {
							loading: "lazy",
							decoding: "async",
							fetchPriority: "low",
							src: story.posterImage || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
							alt: "",
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover"
							}
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								position: "absolute",
								bottom: 0,
								left: 0,
								right: 0,
								padding: "20px",
								background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
								color: "#fff"
							},
							children: [/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "14px",
									fontWeight: 700,
									margin: 0
								},
								children: story.title
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "11px",
									opacity: .8
								},
								children: [story.slides?.length || 0, " Slides"]
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							padding: "16px",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "12px",
								fontSize: "13px"
							},
							children: [/* @__PURE__ */ jsx(Link, {
								href: BASE + `/admin/stories/edit/${story.id}`,
								style: {
									color: "#2563eb",
									fontWeight: 600
								},
								children: "Edit"
							}), /* @__PURE__ */ jsx(DeleteButton, {
								id: story.id,
								endpoint: "/api/admin/stories",
								onSuccess: () => setStories((s) => s.filter((x) => x.id !== story.id)),
								label: "Delete"
							})]
						}), /* @__PURE__ */ jsx("a", {
							href: BASE + `/stories/${story.slug}`,
							target: "_blank",
							rel: "noopener noreferrer",
							style: {
								fontSize: "12px",
								color: "#64748b"
							},
							children: "View ↗"
						})]
					})]
				}, story.id)), stories.length === 0 && /* @__PURE__ */ jsx("div", {
					style: {
						gridColumn: "1 / -1",
						padding: "40px",
						textAlign: "center",
						background: "#f8fafc",
						borderRadius: "12px",
						color: "#64748b"
					},
					children: "No Web Stories found."
				})]
			})
		]
	});
}
StoriesDashboard.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { StoriesDashboard as default };
