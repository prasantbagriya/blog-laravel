import AdminLayout from "./AdminLayout-xqBz233I.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Edit, FolderSearch, Loader2, Trash2 } from "lucide-react";
//#region resources/js/Pages/Admin/Communities/Index.jsx
function Index() {
	const [communities, setCommunities] = useState([]);
	const [loading, setLoading] = useState(true);
	const fetchCommunities = async () => {
		try {
			const data = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/communities")).json();
			if (Array.isArray(data)) setCommunities(data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchCommunities();
	}, []);
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this community?")) return;
		try {
			if ((await fetch(`${typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : ""}/api/admin/communities?id=${id}`, { method: "DELETE" })).ok) setCommunities(communities.filter((c) => c.id !== id));
		} catch (e) {
			console.error(e);
		}
	};
	const thStyle = {
		padding: "16px 24px",
		textAlign: "left",
		fontSize: "12px",
		fontWeight: 600,
		color: "#64748b",
		textTransform: "uppercase",
		letterSpacing: "0.5px"
	};
	const tdStyle = {
		padding: "16px 24px",
		fontSize: "14px",
		color: "#334155",
		borderBottom: "1px solid #e2e8f0"
	};
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Admin - Communities" }), /* @__PURE__ */ jsxs("div", {
		style: {
			maxWidth: "1200px",
			margin: "0 auto",
			width: "100%"
		},
		children: [/* @__PURE__ */ jsx("div", {
			style: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				marginBottom: "24px"
			},
			children: /* @__PURE__ */ jsx("h1", {
				style: {
					fontSize: "24px",
					fontWeight: 800,
					color: "#0f172a",
					margin: 0,
					letterSpacing: "-0.5px"
				},
				children: "Communities"
			})
		}), /* @__PURE__ */ jsx("div", {
			style: {
				background: "#fff",
				borderRadius: "16px",
				boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
				overflow: "hidden"
			},
			children: loading ? /* @__PURE__ */ jsxs("div", {
				style: {
					padding: "64px 20px",
					textAlign: "center",
					color: "#64748b",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "12px"
				},
				children: [
					/* @__PURE__ */ jsx(Loader2, {
						size: 32,
						style: {
							color: "#cbd5e1",
							animation: "spin 1s linear infinite"
						}
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "15px",
							fontWeight: 500
						},
						children: "Loading communities..."
					}),
					/* @__PURE__ */ jsx("style", { children: `@keyframes spin { 100% { transform: rotate(360deg); } }` })
				]
			}) : communities.length === 0 ? /* @__PURE__ */ jsxs("div", {
				style: {
					padding: "80px 20px",
					textAlign: "center",
					color: "#64748b",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "16px"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						background: "#f1f5f9",
						padding: "16px",
						borderRadius: "50%"
					},
					children: /* @__PURE__ */ jsx(FolderSearch, {
						size: 40,
						style: { color: "#94a3b8" }
					})
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "16px",
						fontWeight: 600,
						color: "#334155",
						marginBottom: "4px"
					},
					children: "No communities found"
				}), /* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "14px",
						color: "#64748b"
					},
					children: "Get started by creating a new community."
				})] })]
			}) : /* @__PURE__ */ jsx("div", {
				style: { overflowX: "auto" },
				children: /* @__PURE__ */ jsxs("table", {
					style: {
						width: "100%",
						borderCollapse: "collapse",
						whiteSpace: "nowrap"
					},
					children: [/* @__PURE__ */ jsx("thead", {
						style: {
							background: "#f8fafc",
							borderBottom: "2px solid #e2e8f0"
						},
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								style: thStyle,
								children: "ID"
							}),
							/* @__PURE__ */ jsx("th", {
								style: thStyle,
								children: "Name"
							}),
							/* @__PURE__ */ jsx("th", {
								style: thStyle,
								children: "Owner"
							}),
							/* @__PURE__ */ jsx("th", {
								style: thStyle,
								children: "Members"
							}),
							/* @__PURE__ */ jsx("th", {
								style: thStyle,
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								style: thStyle,
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", { children: communities.map((community) => /* @__PURE__ */ jsxs("tr", {
						style: { transition: "background-color 0.2s" },
						onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#f8fafc",
						onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "transparent",
						children: [
							/* @__PURE__ */ jsx("td", {
								style: tdStyle,
								children: community.id
							}),
							/* @__PURE__ */ jsxs("td", {
								style: tdStyle,
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontWeight: 600,
										color: "#0f172a"
									},
									children: community.display_name || community.name
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: "12px",
										color: "#64748b"
									},
									children: ["r/", community.name]
								})]
							}),
							/* @__PURE__ */ jsx("td", {
								style: tdStyle,
								children: community.owner ? community.owner.name || community.owner.username : "System"
							}),
							/* @__PURE__ */ jsx("td", {
								style: tdStyle,
								children: community.members_count || 0
							}),
							/* @__PURE__ */ jsx("td", {
								style: tdStyle,
								children: /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "8px"
									},
									children: [
										community.is_private && /* @__PURE__ */ jsx("span", {
											style: {
												background: "#fee2e2",
												color: "#ef4444",
												padding: "2px 8px",
												borderRadius: "9999px",
												fontSize: "11px",
												fontWeight: 600
											},
											children: "Private"
										}),
										community.is_nsfw && /* @__PURE__ */ jsx("span", {
											style: {
												background: "#fef3c7",
												color: "#f59e0b",
												padding: "2px 8px",
												borderRadius: "9999px",
												fontSize: "11px",
												fontWeight: 600
											},
											children: "NSFW"
										}),
										!community.is_private && !community.is_nsfw && /* @__PURE__ */ jsx("span", {
											style: {
												background: "#dcfce7",
												color: "#22c55e",
												padding: "2px 8px",
												borderRadius: "9999px",
												fontSize: "11px",
												fontWeight: 600
											},
											children: "Public"
										})
									]
								})
							}),
							/* @__PURE__ */ jsx("td", {
								style: tdStyle,
								children: /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsxs(Link, {
										href: `${typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : ""}/admin/communities/edit/${community.id}`,
										style: {
											display: "flex",
											alignItems: "center",
											gap: "6px",
											padding: "6px 12px",
											background: "#f8fafc",
											color: "#475569",
											borderRadius: "6px",
											fontSize: "13px",
											fontWeight: 600,
											textDecoration: "none",
											border: "1px solid #e2e8f0",
											cursor: "pointer",
											transition: "all 0.2s",
											boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
										},
										onMouseEnter: (e) => {
											e.currentTarget.style.background = "#f1f5f9";
											e.currentTarget.style.borderColor = "#cbd5e1";
											e.currentTarget.style.transform = "scale(1.02)";
										},
										onMouseLeave: (e) => {
											e.currentTarget.style.background = "#f8fafc";
											e.currentTarget.style.borderColor = "#e2e8f0";
											e.currentTarget.style.transform = "scale(1)";
										},
										children: [/* @__PURE__ */ jsx(Edit, { size: 14 }), " Edit"]
									}), /* @__PURE__ */ jsxs("button", {
										onClick: () => handleDelete(community.id),
										style: {
											display: "flex",
											alignItems: "center",
											gap: "6px",
											padding: "6px 12px",
											background: "#fff",
											color: "#ef4444",
											borderRadius: "6px",
											fontSize: "13px",
											fontWeight: 600,
											border: "1px solid #fecaca",
											cursor: "pointer",
											transition: "all 0.2s",
											boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
										},
										onMouseEnter: (e) => {
											e.currentTarget.style.background = "#fee2e2";
											e.currentTarget.style.transform = "scale(1.02)";
										},
										onMouseLeave: (e) => {
											e.currentTarget.style.background = "#fff";
											e.currentTarget.style.transform = "scale(1)";
										},
										children: [/* @__PURE__ */ jsx(Trash2, { size: 14 }), " Delete"]
									})]
								})
							})
						]
					}, community.id)) })]
				})
			})
		})]
	})] });
}
//#endregion
export { Index as default };
