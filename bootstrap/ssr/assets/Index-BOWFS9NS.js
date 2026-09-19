import AdminLayout from "./AdminLayout-xqBz233I.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Pages/Admin/Authors/Index.jsx
function AuthorsPage() {
	const BASE = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
	const [authors, setAuthors] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/authors").then((res) => res.json()).then((data) => {
			if (Array.isArray(data)) setAuthors(data);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this author?")) return;
		try {
			if ((await fetch((window.location.pathname.startsWith("/list/public") ? "/list/public" : "") + `/api/admin/authors?id=${id}`, { method: "DELETE" })).ok) setAuthors((prev) => prev.filter((a) => a.id !== id));
			else alert("Failed to delete");
		} catch (e) {
			alert("Error deleting author");
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", { children: "Loading authors..." });
	return /* @__PURE__ */ jsxs("div", {
		style: { animation: "fadeIn 0.4s ease-out" },
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Authors | Admin" }),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "2rem"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					style: {
						fontSize: "2rem",
						fontWeight: 900,
						color: "#0f172a",
						margin: 0
					},
					children: "Author Profiles"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#64748b",
						margin: 0
					},
					children: "Manage writers and their E-E-A-T credentials"
				})] }), /* @__PURE__ */ jsx(Link, {
					href: BASE + "/admin/authors/new",
					style: {
						background: "#2563eb",
						color: "#fff",
						padding: "10px 20px",
						borderRadius: "8px",
						fontWeight: 700,
						textDecoration: "none",
						whiteSpace: "nowrap"
					},
					children: "+ Add New Author"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
					gap: "1.5rem"
				},
				children: authors.map((author) => /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						border: "1px solid #e2e8f0",
						borderRadius: "16px",
						padding: "1.5rem",
						display: "flex",
						flexDirection: "column",
						gap: "1rem",
						boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "1rem"
							},
							children: [/* @__PURE__ */ jsx("img", {
								loading: "lazy",
								decoding: "async",
								fetchPriority: "low",
								src: author.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
								alt: author.name,
								style: {
									width: "60px",
									height: "60px",
									borderRadius: "50%",
									objectFit: "cover"
								}
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								style: {
									margin: 0,
									fontSize: "18px",
									fontWeight: 800
								},
								children: author.name
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "14px",
									color: "#64748b"
								},
								children: author.jobTitle
							})] })]
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								fontSize: "14px",
								color: "#475569",
								margin: 0,
								display: "-webkit-box",
								WebkitLineClamp: 3,
								WebkitBoxOrient: "vertical",
								overflow: "hidden"
							},
							children: author.bio
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "0.5rem",
								marginTop: "auto",
								paddingTop: "1rem",
								borderTop: "1px solid #f1f5f9"
							},
							children: [/* @__PURE__ */ jsx(Link, {
								href: BASE + `/admin/authors/edit/${author.id}`,
								style: {
									flex: 1,
									textAlign: "center",
									background: "#eff6ff",
									color: "#2563eb",
									padding: "8px",
									borderRadius: "8px",
									fontWeight: 700,
									textDecoration: "none",
									fontSize: "14px",
									whiteSpace: "nowrap"
								},
								children: "Edit Profile"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => handleDelete(author.id),
								style: {
									flex: 1,
									background: "#fef2f2",
									color: "#ef4444",
									padding: "8px",
									borderRadius: "8px",
									fontWeight: 700,
									border: "none",
									cursor: "pointer",
									fontSize: "14px",
									whiteSpace: "nowrap"
								},
								children: "Delete"
							})]
						})
					]
				}, author.id))
			}),
			authors.length === 0 && /* @__PURE__ */ jsx("div", {
				style: {
					textAlign: "center",
					padding: "3rem",
					background: "#f8fafc",
					borderRadius: "16px",
					color: "#64748b"
				},
				children: "No authors created yet. Create one to easily select them when writing articles."
			})
		]
	});
}
AuthorsPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { AuthorsPage as default };
