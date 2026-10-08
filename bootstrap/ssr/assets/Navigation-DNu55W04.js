import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useEffect, useState } from "react";
//#region resources/js/Pages/Admin/Settings/Navigation.jsx
var AdminLayout = React.lazy(() => import("./AdminLayout-JWfDMpjr.js"));
function NavigationManager() {
	const [navItems, setNavItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const basePath = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
	useEffect(() => {
		fetchNavItems();
	}, []);
	const fetchNavItems = () => {
		fetch(basePath + "/api/admin/navigations").then((res) => res.json()).then((data) => {
			setNavItems(data);
			setLoading(false);
		});
	};
	const handleAddItem = () => {
		const newItem = {
			id: "",
			tempId: crypto.randomUUID(),
			name: "",
			url: "",
			order: navItems.length,
			is_active: true,
			show_in_footer: false,
			parent_id: null
		};
		setNavItems([...navItems, newItem]);
	};
	const saveItem = async (item) => {
		if (!item.name.trim()) return;
		const payload = { ...item };
		if (!payload.id) delete payload.id;
		try {
			if ((await fetch(basePath + "/api/admin/navigations", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload)
			})).ok) fetchNavItems();
		} catch (e) {
			console.error(e);
			alert("Failed to save navigation item");
		}
	};
	const handleDelete = async (item) => {
		if (!confirm("Delete this navigation item?")) return;
		if (!item.id) {
			setNavItems(navItems.filter((n) => n.tempId !== item.tempId));
			return;
		}
		try {
			await fetch(basePath + `/api/admin/navigations`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: item.id })
			});
			setNavItems(navItems.filter((n) => n.id !== item.id));
		} catch (e) {
			console.error(e);
		}
	};
	const handleFieldChange = (identifier, isNew, field, value) => {
		const updated = navItems.map((n) => {
			if (isNew && n.tempId === identifier) return {
				...n,
				[field]: value
			};
			if (!isNew && n.id === identifier) return {
				...n,
				[field]: value
			};
			return n;
		});
		setNavItems(updated);
	};
	const handleFieldBlur = (item) => {
		saveItem(item);
	};
	const moveItem = (index, dir) => {
		if (index + dir < 0 || index + dir >= navItems.length) return;
		const newItems = [...navItems];
		const temp = newItems[index];
		newItems[index] = newItems[index + dir];
		newItems[index + dir] = temp;
		const ordered = newItems.map((n, i) => ({
			...n,
			order: i
		}));
		setNavItems(ordered);
		ordered.forEach((n) => {
			if (n.id) saveItem(n);
		});
	};
	if (loading) return /* @__PURE__ */ jsx("div", { children: "Loading..." });
	return /* @__PURE__ */ jsxs("div", {
		style: { animation: "fadeIn 0.4s ease-out" },
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Navigation Menu | Admin" }),
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
					children: "Navigation Menu"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#64748b",
						margin: 0
					},
					children: "Manage the main menu links shown on the website"
				})] }), /* @__PURE__ */ jsx("button", {
					onClick: handleAddItem,
					style: {
						background: "#2563eb",
						color: "#fff",
						padding: "10px 20px",
						borderRadius: "8px",
						fontWeight: 700,
						textDecoration: "none",
						border: "none",
						cursor: "pointer",
						whiteSpace: "nowrap"
					},
					children: "+ Add Link"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "1rem"
				},
				children: [navItems.length === 0 && /* @__PURE__ */ jsx("div", {
					style: {
						padding: "3rem",
						textAlign: "center",
						background: "#f8fafc",
						borderRadius: "16px",
						color: "#64748b"
					},
					children: "No navigation links configured. Click \"Add Link\" to create one."
				}), navItems.map((item, index) => {
					const identifier = item.id || item.tempId;
					const isNew = !item.id;
					return /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "1.5rem",
							background: "#fff",
							padding: "1rem 1.5rem",
							borderRadius: "12px",
							border: "1px solid #e2e8f0",
							boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "0.25rem"
								},
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => moveItem(index, -1),
									disabled: index === 0,
									style: {
										padding: "4px",
										cursor: index === 0 ? "not-allowed" : "pointer",
										background: "#f1f5f9",
										border: "none",
										borderRadius: "4px"
									},
									children: "↑"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => moveItem(index, 1),
									disabled: index === navItems.length - 1,
									style: {
										padding: "4px",
										cursor: index === navItems.length - 1 ? "not-allowed" : "pointer",
										background: "#f1f5f9",
										border: "none",
										borderRadius: "4px"
									},
									children: "↓"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									flex: 1,
									display: "grid",
									gridTemplateColumns: "1fr 1fr 1fr auto",
									gap: "1rem",
									alignItems: "center"
								},
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "4px"
										},
										children: [/* @__PURE__ */ jsx("label", {
											style: {
												fontSize: "11px",
												fontWeight: 600,
												color: "#64748b",
												textTransform: "uppercase"
											},
											children: "Label Name"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: item.name,
											onChange: (e) => handleFieldChange(identifier, isNew, "name", e.target.value),
											onBlur: () => handleFieldBlur(item),
											style: {
												padding: "8px 12px",
												border: "1px solid #e2e8f0",
												borderRadius: "8px",
												fontSize: "14px",
												width: "100%"
											},
											placeholder: "e.g., About Us"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "4px"
										},
										children: [/* @__PURE__ */ jsx("label", {
											style: {
												fontSize: "11px",
												fontWeight: 600,
												color: "#64748b",
												textTransform: "uppercase"
											},
											children: "URL or Path"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: item.url || "",
											onChange: (e) => handleFieldChange(identifier, isNew, "url", e.target.value),
											onBlur: () => handleFieldBlur(item),
											style: {
												padding: "8px 12px",
												border: "1px solid #e2e8f0",
												borderRadius: "8px",
												fontSize: "14px",
												width: "100%",
												fontFamily: "monospace"
											},
											placeholder: "e.g., /about or https://google.com"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "4px"
										},
										children: [/* @__PURE__ */ jsx("label", {
											style: {
												fontSize: "11px",
												fontWeight: 600,
												color: "#64748b",
												textTransform: "uppercase"
											},
											children: "Parent Link"
										}), /* @__PURE__ */ jsxs("select", {
											value: item.parent_id || "",
											onChange: (e) => {
												const val = e.target.value ? parseInt(e.target.value) : null;
												handleFieldChange(identifier, isNew, "parent_id", val);
												saveItem({
													...item,
													parent_id: val
												});
											},
											style: {
												padding: "8px 12px",
												border: "1px solid #e2e8f0",
												borderRadius: "8px",
												fontSize: "14px",
												width: "100%"
											},
											children: [/* @__PURE__ */ jsx("option", {
												value: "",
												children: "None (Top Level)"
											}), navItems.filter((n) => n.id && n.id !== item.id && !n.parent_id).map((parent) => /* @__PURE__ */ jsx("option", {
												value: parent.id,
												children: parent.name
											}, parent.id))]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "8px",
											justifyContent: "center",
											height: "100%",
											paddingBottom: "4px"
										},
										children: [/* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "8px",
												cursor: "pointer",
												fontSize: "14px",
												fontWeight: 600,
												color: "#475569"
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: item.is_active,
												onChange: (e) => {
													handleFieldChange(identifier, isNew, "is_active", e.target.checked);
													saveItem({
														...item,
														is_active: e.target.checked
													});
												},
												style: {
													width: "16px",
													height: "16px",
													cursor: "pointer"
												}
											}), "Show in Navbar"]
										}), /* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "8px",
												cursor: "pointer",
												fontSize: "14px",
												fontWeight: 600,
												color: "#475569"
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: item.show_in_footer,
												onChange: (e) => {
													handleFieldChange(identifier, isNew, "show_in_footer", e.target.checked);
													saveItem({
														...item,
														show_in_footer: e.target.checked
													});
												},
												style: {
													width: "16px",
													height: "16px",
													cursor: "pointer"
												}
											}), "Show in Footer"]
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									borderLeft: "1px solid #e2e8f0",
									paddingLeft: "1.5rem",
									display: "flex",
									alignItems: "center"
								},
								children: /* @__PURE__ */ jsx("button", {
									onClick: () => handleDelete(item),
									style: {
										padding: "8px",
										background: "#fef2f2",
										color: "#ef4444",
										border: "none",
										borderRadius: "8px",
										cursor: "pointer",
										transition: "background 0.2s"
									},
									children: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "20",
										height: "20",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: [
											/* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
											/* @__PURE__ */ jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
											/* @__PURE__ */ jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" })
										]
									})
								})
							})
						]
					}, identifier);
				})]
			})
		]
	});
}
NavigationManager.layout = (page) => /* @__PURE__ */ jsx(Suspense, {
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
export { NavigationManager as default };
