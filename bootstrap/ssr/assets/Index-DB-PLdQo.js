import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useEffect, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import axios from "axios";
//#region resources/js/Pages/Admin/Newsletters/Index.jsx
var AdminLayout = React.lazy(() => import("./AdminLayout-xqBz233I.js"));
function NewslettersPage() {
	const [subscribers, setSubscribers] = useState([]);
	const [loading, setLoading] = useState(true);
	const fetchSubscribers = () => {
		setLoading(true);
		axios.get((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/newsletters").then((res) => {
			setSubscribers(res.data);
			setLoading(false);
		}).catch(() => {
			setLoading(false);
		});
	};
	useEffect(() => {
		fetchSubscribers();
	}, []);
	const deleteSubscriber = async (id) => {
		if (!confirm("Are you sure you want to remove this subscriber?")) return;
		try {
			await axios.delete((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + `/api/admin/newsletters/${id}`);
			fetchSubscribers();
		} catch (e) {
			alert("Error removing subscriber");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		style: { animation: "fadeIn 0.4s ease-out" },
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Newsletter Subscribers | Admin" }),
			/* @__PURE__ */ jsxs("div", {
				style: {
					marginBottom: "2rem",
					display: "flex",
					flexWrap: "wrap",
					gap: "1rem",
					justifyContent: "space-between",
					alignItems: "flex-end"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					style: {
						fontSize: "2rem",
						fontWeight: 900,
						color: "#0f172a",
						margin: 0
					},
					children: "Newsletter Subscribers"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#64748b",
						margin: 0
					},
					children: "Manage email addresses collected from the footer subscription form"
				})] }), /* @__PURE__ */ jsx("button", {
					onClick: fetchSubscribers,
					style: {
						background: "#2563eb",
						color: "#fff",
						border: "none",
						padding: "8px 16px",
						borderRadius: "8px",
						fontWeight: 600,
						cursor: "pointer"
					},
					children: "Refresh"
				})]
			}),
			loading ? /* @__PURE__ */ jsx("div", { children: "Loading subscribers..." }) : subscribers.length === 0 ? /* @__PURE__ */ jsx("div", {
				style: {
					textAlign: "center",
					padding: "3rem",
					background: "#fff",
					borderRadius: "16px",
					border: "1px solid #e2e8f0",
					color: "#64748b"
				},
				children: "No subscribers found."
			}) : /* @__PURE__ */ jsx("div", {
				style: {
					display: "grid",
					gap: "1rem"
				},
				children: subscribers.map((sub) => /* @__PURE__ */ jsx("div", {
					style: {
						background: "#fff",
						border: "1px solid #e2e8f0",
						borderLeft: "4px solid #10b981",
						borderRadius: "12px",
						padding: "1.5rem",
						display: "flex",
						flexDirection: "column",
						gap: "1rem",
						boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
					},
					children: /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexWrap: "wrap",
							gap: "1rem"
						},
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "8px",
									marginBottom: "4px"
								},
								children: /* @__PURE__ */ jsxs("h3", {
									style: {
										margin: 0,
										fontSize: "18px",
										fontWeight: 800,
										color: "#0f172a",
										display: "flex",
										alignItems: "center",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsx(Mail, {
										size: 16,
										color: "#64748b"
									}), /* @__PURE__ */ jsx("a", {
										href: `mailto:${sub.email}`,
										style: {
											color: "#0f172a",
											textDecoration: "none"
										},
										children: sub.email
									})]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "13px",
									color: "#64748b",
									fontWeight: 500,
									marginTop: "4px"
								},
								children: ["Source: ", /* @__PURE__ */ jsx("span", {
									style: {
										color: "#0f172a",
										fontWeight: 700
									},
									children: sub.source || "unknown"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "12px",
									color: "#94a3b8",
									marginTop: "4px"
								},
								children: ["Subscribed: ", new Date(sub.created_at).toLocaleString()]
							})
						] }), /* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								gap: "8px"
							},
							children: /* @__PURE__ */ jsxs("button", {
								onClick: () => deleteSubscriber(sub.id),
								style: {
									background: "#fef2f2",
									color: "#ef4444",
									border: "none",
									padding: "8px 12px",
									borderRadius: "8px",
									fontWeight: 600,
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									gap: "6px"
								},
								children: [/* @__PURE__ */ jsx(Trash2, { size: 16 }), " Delete"]
							})
						})]
					})
				}, sub.id))
			})
		]
	});
}
NewslettersPage.layout = (page) => /* @__PURE__ */ jsx(Suspense, {
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
//#endregion
export { NewslettersPage as default };
