import { Link, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Layouts/AdminLayout.jsx
function AdminLayout({ children }) {
	const { url: pathname } = usePage();
	const [isMobile, setIsMobile] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 1024;
			setIsMobile(mobile);
			if (!mobile) setIsSidebarOpen(false);
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const BASE = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
	const menuItems = [
		{
			label: "Dashboard",
			href: BASE + "/admin",
			icon: "🏠"
		},
		{
			label: "All Posts",
			href: BASE + "/admin",
			icon: "📌"
		},
		{
			label: "Authors",
			href: BASE + "/admin/authors",
			icon: "👥"
		},
		{
			label: "Categories",
			href: BASE + "/admin/categories",
			icon: "📁"
		},
		{
			label: "Add New",
			href: BASE + "/admin/posts/new",
			icon: "➕"
		},
		{
			label: "Web Stories",
			href: BASE + "/admin/stories",
			icon: "⚡"
		},
		{
			label: "Businesses",
			href: BASE + "/admin/businesses",
			icon: "🏢"
		},
		{
			label: "Media Library",
			href: BASE + "/admin/media",
			icon: "🖼️"
		},
		{
			label: "SEO Audit",
			href: BASE + "/admin/seo-audit",
			icon: "📈"
		},
		{
			label: "Home Slider",
			href: BASE + "/admin/slider",
			icon: "🖼️"
		},
		{
			label: "Settings",
			href: "#",
			icon: "⚙️"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			background: "#f8fafc",
			color: "#0f172a",
			fontFamily: "\"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
			minHeight: "100vh",
			position: "relative",
			margin: "0 auto",
			width: "100%"
		},
		children: [
			isMobile && isSidebarOpen && /* @__PURE__ */ jsx("div", {
				onClick: () => setIsSidebarOpen(false),
				style: {
					position: "absolute",
					inset: 0,
					background: "rgba(15, 23, 42, 0.4)",
					backdropFilter: "blur(4px)",
					zIndex: 190,
					animation: "fadeIn 0.2s ease"
				}
			}),
			/* @__PURE__ */ jsxs("aside", {
				style: {
					width: isCollapsed && !isMobile ? "80px" : "260px",
					background: "#ffffff",
					borderRight: "1px solid #e2e8f0",
					display: "flex",
					flexDirection: "column",
					position: "fixed",
					top: 0,
					bottom: 0,
					left: 0,
					zIndex: 200,
					transform: isMobile ? isSidebarOpen ? "translateX(0)" : "translateX(-260px)" : "translateX(0)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							height: "72px",
							padding: isCollapsed && !isMobile ? "0" : "0 24px",
							display: "flex",
							alignItems: "center",
							justifyContent: isCollapsed && !isMobile ? "center" : "space-between",
							borderBottom: "1px solid #f1f5f9",
							transition: "padding 0.3s"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "12px"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									background: "linear-gradient(135deg, #2563eb, #4f46e5)",
									color: "#fff",
									width: "32px",
									height: "32px",
									borderRadius: "8px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontWeight: 800,
									fontSize: "16px",
									flexShrink: 0
								},
								children: "C"
							}), !(isCollapsed && !isMobile) && /* @__PURE__ */ jsx("span", {
								style: {
									fontSize: "18px",
									fontWeight: 700,
									letterSpacing: "-0.5px",
									whiteSpace: "nowrap"
								},
								children: "Blog Admin"
							})]
						}), isMobile && /* @__PURE__ */ jsx("button", {
							onClick: () => setIsSidebarOpen(false),
							"aria-label": "Close sidebar",
							style: {
								background: "none",
								border: "none",
								fontSize: "20px",
								cursor: "pointer",
								color: "#64748b"
							},
							children: "✕"
						})]
					}),
					/* @__PURE__ */ jsxs("nav", {
						style: {
							padding: isCollapsed && !isMobile ? "24px 8px" : "24px 16px",
							display: "flex",
							flexDirection: "column",
							gap: "8px",
							flex: 1,
							overflowY: "auto"
						},
						children: [!(isCollapsed && !isMobile) && /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "11px",
								fontWeight: 600,
								color: "#94a3b8",
								letterSpacing: "1px",
								textTransform: "uppercase",
								marginBottom: "8px",
								paddingLeft: "8px"
							},
							children: "Content"
						}), menuItems.map((item) => {
							const isActive = pathname === item.href;
							return /* @__PURE__ */ jsxs(Link, {
								href: item.href,
								onClick: () => isMobile && setIsSidebarOpen(false),
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: isCollapsed && !isMobile ? "center" : "flex-start",
									gap: "12px",
									padding: "10px 12px",
									fontSize: "14px",
									fontWeight: isActive ? 700 : 600,
									color: isActive ? "#2563eb" : "#0f172a",
									textDecoration: "none",
									background: isActive ? "#eff6ff" : "transparent",
									borderRadius: "8px",
									transition: "all 0.2s ease"
								},
								children: [/* @__PURE__ */ jsx("span", {
									style: {
										fontSize: "16px",
										filter: isActive ? "none" : "grayscale(100%)",
										opacity: 1
									},
									title: isCollapsed ? item.label : void 0,
									children: item.icon
								}), !(isCollapsed && !isMobile) && /* @__PURE__ */ jsx("span", {
									style: { whiteSpace: "nowrap" },
									children: item.label
								})]
							}, item.label);
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							padding: isCollapsed && !isMobile ? "24px 0" : "24px",
							borderTop: "1px solid #f1f5f9",
							display: "flex",
							alignItems: "center",
							justifyContent: isCollapsed && !isMobile ? "center" : "flex-start",
							gap: "12px"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								width: "36px",
								height: "36px",
								borderRadius: "50%",
								background: "#e2e8f0",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontWeight: 600,
								color: "#475569",
								flexShrink: 0
							},
							children: "A"
						}), !(isCollapsed && !isMobile) && /* @__PURE__ */ jsxs("div", {
							style: { overflow: "hidden" },
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "13px",
									fontWeight: 600,
									whiteSpace: "nowrap"
								},
								children: "Admin User"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "11px",
									color: "#64748b",
									whiteSpace: "nowrap"
								},
								children: "editorial@blog.com"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					flex: 1,
					marginLeft: isMobile ? 0 : isCollapsed ? "80px" : "260px",
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
					width: isMobile ? "100vw" : `calc(100% - ${isCollapsed ? "80px" : "260px"})`,
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
				},
				children: [/* @__PURE__ */ jsxs("header", {
					style: {
						height: "72px",
						minHeight: "72px",
						background: "#ffffff",
						borderBottom: "1px solid #e2e8f0",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: isMobile ? "0 16px" : "0 32px",
						position: "sticky",
						top: 0,
						zIndex: 100
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "12px"
						},
						children: [
							isMobile && /* @__PURE__ */ jsx("button", {
								onClick: () => setIsSidebarOpen(true),
								"aria-label": "Open sidebar menu",
								style: {
									background: "none",
									border: "1px solid #e2e8f0",
									borderRadius: "6px",
									width: "40px",
									height: "40px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "20px",
									cursor: "pointer",
									color: "#334155"
								},
								children: "☰"
							}),
							!isMobile && /* @__PURE__ */ jsx("button", {
								onClick: () => setIsCollapsed(!isCollapsed),
								"aria-label": "Toggle sidebar",
								style: {
									background: "none",
									border: "1px solid #e2e8f0",
									borderRadius: "6px",
									width: "32px",
									height: "32px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "16px",
									cursor: "pointer",
									color: "#334155",
									marginRight: "8px"
								},
								children: isCollapsed ? "⇥" : "⇤"
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "15px",
									fontWeight: 700,
									color: "#475569",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									maxWidth: isMobile ? "120px" : "none"
								},
								children: (pathname || "").includes("/new") ? "Create" : (pathname || "").includes("/stories") ? "Web Stories" : "Dashboard"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: isMobile ? "8px" : "16px",
							alignItems: "center"
						},
						children: [!isMobile && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("a", {
							href: (typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/",
							target: "_blank",
							style: {
								fontSize: "13px",
								fontWeight: 600,
								color: "#475569",
								textDecoration: "none",
								display: "flex",
								alignItems: "center",
								gap: "6px"
							},
							children: "↗ View Live Site"
						}), /* @__PURE__ */ jsx("div", { style: {
							width: "1px",
							height: "24px",
							background: "#e2e8f0"
						} })] }), /* @__PURE__ */ jsx(Link, {
							href: BASE + "/admin/posts/new",
							style: {
								background: "#2563eb",
								color: "#fff",
								padding: isMobile ? "6px 12px" : "8px 16px",
								borderRadius: "6px",
								fontSize: "13px",
								fontWeight: 700,
								textDecoration: "none",
								boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
								whiteSpace: "nowrap"
							},
							children: "+ New Post"
						})]
					})]
				}), /* @__PURE__ */ jsx("main", {
					style: {
						padding: isMobile ? "0.5rem" : "1.5rem",
						width: "100%",
						flex: 1,
						overflowX: "hidden"
					},
					children
				})]
			})
		]
	});
}
//#endregion
export { AdminLayout as t };
