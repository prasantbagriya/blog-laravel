import AdminLayout from "./AdminLayout-DgYc6ixZ.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
//#region resources/js/Pages/Admin/Newsletters/Index.jsx
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
		if (!confirm("Are you sure you want to delete this subscriber?")) return;
		try {
			await axios.delete((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + `/api/admin/newsletters/${id}`);
			fetchSubscribers();
		} catch (e) {
			alert("Error deleting subscriber");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		style: { animation: "fadeIn 0.4s ease-out" },
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Newsletters | Admin" }),
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
					children: "View and manage newsletter subscribers"
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
						borderLeft: "4px solid #3b82f6",
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
									children: [/* @__PURE__ */ jsxs("svg", {
										width: "18",
										height: "18",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: [
											/* @__PURE__ */ jsx("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
											/* @__PURE__ */ jsx("circle", {
												cx: "9",
												cy: "7",
												r: "4"
											}),
											/* @__PURE__ */ jsx("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
											/* @__PURE__ */ jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
										]
									}), sub.email]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "13px",
									color: "#64748b",
									fontWeight: 500
								},
								children: ["Source: ", /* @__PURE__ */ jsx("span", {
									style: {
										color: "#0f172a",
										fontWeight: 700
									},
									children: sub.source || "N/A"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "13px",
									color: "#64748b",
									fontWeight: 500
								},
								children: ["Type: ", /* @__PURE__ */ jsx("span", {
									style: {
										color: "#0f172a",
										fontWeight: 700
									},
									children: sub.type || "N/A"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "12px",
									color: "#94a3b8",
									marginTop: "4px"
								},
								children: ["Subscribed on: ", new Date(sub.created_at).toLocaleString()]
							})
						] }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("button", {
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
							children: [/* @__PURE__ */ jsxs("svg", {
								width: "16",
								height: "16",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [
									/* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
									/* @__PURE__ */ jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
									/* @__PURE__ */ jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
									/* @__PURE__ */ jsx("line", {
										x1: "10",
										y1: "11",
										x2: "10",
										y2: "17"
									}),
									/* @__PURE__ */ jsx("line", {
										x1: "14",
										y1: "11",
										x2: "14",
										y2: "17"
									})
								]
							}), "Delete"]
						}) })]
					})
				}, sub.id))
			})
		]
	});
}
NewslettersPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { NewslettersPage as default };
