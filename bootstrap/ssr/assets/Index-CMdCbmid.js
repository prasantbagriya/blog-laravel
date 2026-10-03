import AdminLayout from "./AdminLayout-DgYc6ixZ.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Pages/Admin/Users/Index.jsx
function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/users").then((res) => res.json()).then((data) => {
			if (Array.isArray(data)) setUsers(data);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this user?")) return;
		try {
			if ((await fetch((window.location.pathname.startsWith("/list/public") ? "/list/public" : "") + `/api/admin/users?id=${id}`, { method: "DELETE" })).ok) setUsers((prev) => prev.filter((u) => u.id !== id));
			else alert("Failed to delete user");
		} catch (e) {
			alert("Error deleting user");
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", { children: "Loading users..." });
	return /* @__PURE__ */ jsxs("div", {
		style: { animation: "fadeIn 0.4s ease-out" },
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Users | Admin" }),
			/* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "2rem"
				},
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					style: {
						fontSize: "2rem",
						fontWeight: 900,
						color: "#0f172a",
						margin: 0
					},
					children: "Registered Users"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#64748b",
						margin: 0
					},
					children: "Manage community members and users"
				})] })
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
					gap: "1.5rem"
				},
				children: users.map((user) => /* @__PURE__ */ jsxs("div", {
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
								src: user.profile_picture || "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
								alt: user.username,
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
								children: user.name
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "14px",
									color: "#64748b"
								},
								children: ["@", user.username]
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
							children: user.bio || "No bio provided"
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								fontSize: "12px",
								color: "#94a3b8",
								display: "flex",
								justifyContent: "space-between"
							},
							children: [/* @__PURE__ */ jsxs("span", { children: ["Role: ", user.role || (user.is_admin ? "Admin" : "User")] }), /* @__PURE__ */ jsxs("span", { children: ["Karma: ", (user.post_karma || 0) + (user.comment_karma || 0)] })]
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								gap: "0.5rem",
								marginTop: "auto",
								paddingTop: "1rem",
								borderTop: "1px solid #f1f5f9"
							},
							children: /* @__PURE__ */ jsx("button", {
								onClick: () => handleDelete(user.id),
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
								children: "Delete User"
							})
						})
					]
				}, user.id))
			}),
			users.length === 0 && /* @__PURE__ */ jsx("div", {
				style: {
					textAlign: "center",
					padding: "3rem",
					background: "#f8fafc",
					borderRadius: "16px",
					color: "#64748b"
				},
				children: "No users registered yet."
			})
		]
	});
}
UsersPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { UsersPage as default };
