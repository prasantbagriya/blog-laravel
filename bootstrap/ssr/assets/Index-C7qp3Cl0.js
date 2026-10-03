import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
//#region resources/js/Pages/Admin/ContactMessages/Index.jsx
var AdminLayout = React.lazy(() => import("./AdminLayout-DgYc6ixZ.js"));
function ContactMessagesPage() {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const fetchMessages = () => {
		setLoading(true);
		axios.get((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/contact-messages").then((res) => {
			setMessages(res.data);
			setLoading(false);
		}).catch(() => {
			setLoading(false);
		});
	};
	useEffect(() => {
		fetchMessages();
	}, []);
	const markAsRead = async (id) => {
		try {
			await axios.patch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + `/api/admin/contact-messages/${id}/read`);
			fetchMessages();
		} catch (e) {
			alert("Error updating message status");
		}
	};
	const deleteMessage = async (id) => {
		if (!confirm("Are you sure you want to delete this message?")) return;
		try {
			await axios.delete((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + `/api/admin/contact-messages/${id}`);
			fetchMessages();
		} catch (e) {
			alert("Error deleting message");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		style: { animation: "fadeIn 0.4s ease-out" },
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Contact Messages | Admin" }),
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
					children: "Contact Messages"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#64748b",
						margin: 0
					},
					children: "View and manage inquiries from the Contact Us page"
				})] }), /* @__PURE__ */ jsx("button", {
					onClick: fetchMessages,
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
			loading ? /* @__PURE__ */ jsx("div", { children: "Loading messages..." }) : messages.length === 0 ? /* @__PURE__ */ jsx("div", {
				style: {
					textAlign: "center",
					padding: "3rem",
					background: "#fff",
					borderRadius: "16px",
					border: "1px solid #e2e8f0",
					color: "#64748b"
				},
				children: "No messages found."
			}) : /* @__PURE__ */ jsx("div", {
				style: {
					display: "grid",
					gap: "1rem"
				},
				children: messages.map((msg) => /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						border: "1px solid #e2e8f0",
						borderLeft: msg.status === "unread" ? "4px solid #f59e0b" : "4px solid #10b981",
						borderRadius: "12px",
						padding: "1.5rem",
						display: "flex",
						flexDirection: "column",
						gap: "1rem",
						boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
							flexWrap: "wrap",
							gap: "1rem"
						},
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "8px",
									marginBottom: "4px"
								},
								children: [/* @__PURE__ */ jsx("h3", {
									style: {
										margin: 0,
										fontSize: "18px",
										fontWeight: 800,
										color: "#0f172a"
									},
									children: msg.subject
								}), msg.status === "unread" ? /* @__PURE__ */ jsxs("span", {
									style: {
										background: "#fef3c7",
										color: "#d97706",
										padding: "2px 8px",
										borderRadius: "999px",
										fontSize: "12px",
										fontWeight: 700,
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [/* @__PURE__ */ jsxs("svg", {
										width: "12",
										height: "12",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: [/* @__PURE__ */ jsx("rect", {
											width: "20",
											height: "16",
											x: "2",
											y: "4",
											rx: "2"
										}), /* @__PURE__ */ jsx("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })]
									}), "New"]
								}) : /* @__PURE__ */ jsxs("span", {
									style: {
										background: "#d1fae5",
										color: "#059669",
										padding: "2px 8px",
										borderRadius: "999px",
										fontSize: "12px",
										fontWeight: 700,
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [/* @__PURE__ */ jsxs("svg", {
										width: "12",
										height: "12",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: [/* @__PURE__ */ jsx("path", { d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" }), /* @__PURE__ */ jsx("path", { d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" })]
									}), "Read"]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "14px",
									color: "#64748b",
									fontWeight: 500
								},
								children: [
									"From: ",
									/* @__PURE__ */ jsx("span", {
										style: {
											color: "#0f172a",
											fontWeight: 700
										},
										children: msg.name
									}),
									" <",
									/* @__PURE__ */ jsx("a", {
										href: `mailto:${msg.email}`,
										style: {
											color: "#2563eb",
											textDecoration: "none"
										},
										children: msg.email
									}),
									">"
								]
							}),
							msg.phone && /* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "13px",
									color: "#64748b",
									fontWeight: 500,
									marginTop: "4px"
								},
								children: ["Phone: ", /* @__PURE__ */ jsx("a", {
									href: `tel:${msg.phone}`,
									style: {
										color: "#2563eb",
										textDecoration: "none"
									},
									children: msg.phone
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "12px",
									color: "#94a3b8",
									marginTop: "4px"
								},
								children: ["Received: ", new Date(msg.created_at).toLocaleString()]
							})
						] }), /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "8px"
							},
							children: [msg.status === "unread" && /* @__PURE__ */ jsxs("button", {
								onClick: () => markAsRead(msg.id),
								style: {
									background: "#f1f5f9",
									color: "#475569",
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
									children: [/* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ jsx("path", { d: "m9 11 3 3L22 4" })]
								}), "Mark as Read"]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: () => deleteMessage(msg.id),
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
							})]
						})]
					}), /* @__PURE__ */ jsx("div", {
						style: {
							background: "#f8fafc",
							padding: "1rem",
							borderRadius: "8px",
							fontSize: "15px",
							color: "#334155",
							lineHeight: 1.6,
							whiteSpace: "pre-wrap"
						},
						children: msg.message
					})]
				}, msg.id))
			})
		]
	});
}
ContactMessagesPage.layout = (page) => /* @__PURE__ */ jsx(Suspense, {
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
export { ContactMessagesPage as default };
