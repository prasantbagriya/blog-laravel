import { Link, router, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Layouts/AdminLayout.jsx
function AdminLayout({ children }) {
	const { url: pathname } = usePage();
	const [isMobile, setIsMobile] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const handleLogout = (e) => {
		if (e && e.preventDefault) e.preventDefault();
		try {
			router.post(route("logout"), {}, { onFinish: () => {
				window.location.href = "/";
			} });
		} catch (err) {
			window.location.href = "/logout";
		}
	};
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
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("rect", {
						x: "3",
						y: "3",
						width: "7",
						height: "9",
						rx: "1"
					}),
					/* @__PURE__ */ jsx("rect", {
						x: "14",
						y: "3",
						width: "7",
						height: "5",
						rx: "1"
					}),
					/* @__PURE__ */ jsx("rect", {
						x: "14",
						y: "12",
						width: "7",
						height: "9",
						rx: "1"
					}),
					/* @__PURE__ */ jsx("rect", {
						x: "3",
						y: "16",
						width: "7",
						height: "5",
						rx: "1"
					})
				]
			})
		},
		{
			label: "All Posts",
			href: BASE + "/admin",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [/* @__PURE__ */ jsx("line", {
					x1: "12",
					y1: "17",
					x2: "12",
					y2: "22"
				}), /* @__PURE__ */ jsx("path", { d: "M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" })]
			})
		},
		{
			label: "Users",
			href: BASE + "/admin/users",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
					/* @__PURE__ */ jsx("circle", {
						cx: "9",
						cy: "7",
						r: "4"
					}),
					/* @__PURE__ */ jsx("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
					/* @__PURE__ */ jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
				]
			})
		},
		{
			label: "Authors",
			href: BASE + "/admin/authors",
			icon: /* @__PURE__ */ jsxs("svg", {
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
			})
		},
		{
			label: "Categories",
			href: BASE + "/admin/categories",
			icon: /* @__PURE__ */ jsx("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: /* @__PURE__ */ jsx("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" })
			})
		},
		{
			label: "Pages",
			href: BASE + "/admin/pages",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("path", { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
					/* @__PURE__ */ jsx("polyline", { points: "14 2 14 8 20 8" }),
					/* @__PURE__ */ jsx("line", {
						x1: "16",
						y1: "13",
						x2: "8",
						y2: "13"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "16",
						y1: "17",
						x2: "8",
						y2: "17"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "10",
						y1: "9",
						x2: "8",
						y2: "9"
					})
				]
			})
		},
		{
			label: "Add New",
			href: BASE + "/admin/posts/new",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "12",
						r: "10"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "12",
						y1: "8",
						x2: "12",
						y2: "16"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "8",
						y1: "12",
						x2: "16",
						y2: "12"
					})
				]
			})
		},
		{
			label: "Web Stories",
			href: BASE + "/admin/stories",
			icon: /* @__PURE__ */ jsx("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
			})
		},
		{
			label: "Community Posts",
			href: BASE + "/admin/community-posts",
			icon: /* @__PURE__ */ jsx("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
			})
		},
		{
			label: "Communities",
			href: BASE + "/admin/communities",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "12",
						r: "10"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "2",
						y1: "12",
						x2: "22",
						y2: "12"
					}),
					/* @__PURE__ */ jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
				]
			})
		},
		{
			label: "Businesses",
			href: BASE + "/admin/businesses",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("rect", {
						x: "4",
						y: "2",
						width: "16",
						height: "20",
						rx: "2",
						ry: "2"
					}),
					/* @__PURE__ */ jsx("path", { d: "M9 22v-4h6v4" }),
					/* @__PURE__ */ jsx("path", { d: "M8 6h.01" }),
					/* @__PURE__ */ jsx("path", { d: "M16 6h.01" }),
					/* @__PURE__ */ jsx("path", { d: "M12 6h.01" }),
					/* @__PURE__ */ jsx("path", { d: "M12 10h.01" }),
					/* @__PURE__ */ jsx("path", { d: "M12 14h.01" }),
					/* @__PURE__ */ jsx("path", { d: "M16 10h.01" }),
					/* @__PURE__ */ jsx("path", { d: "M16 14h.01" }),
					/* @__PURE__ */ jsx("path", { d: "M8 10h.01" }),
					/* @__PURE__ */ jsx("path", { d: "M8 14h.01" })
				]
			})
		},
		{
			label: "Media Library",
			href: BASE + "/admin/media",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("rect", {
						x: "3",
						y: "3",
						width: "18",
						height: "18",
						rx: "2",
						ry: "2"
					}),
					/* @__PURE__ */ jsx("circle", {
						cx: "8.5",
						cy: "8.5",
						r: "1.5"
					}),
					/* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
				]
			})
		},
		{
			label: "SEO Audit",
			href: BASE + "/admin/seo-audit",
			icon: /* @__PURE__ */ jsx("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: /* @__PURE__ */ jsx("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" })
			})
		},
		{
			label: "Google Search",
			href: BASE + "/admin/google-search",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("circle", {
						cx: "11",
						cy: "11",
						r: "8"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "21",
						y1: "21",
						x2: "16.65",
						y2: "16.65"
					}),
					/* @__PURE__ */ jsx("path", { d: "M11 8v6" }),
					/* @__PURE__ */ jsx("path", { d: "M8 11h6" })
				]
			})
		},
		{
			label: "Bing Webmaster",
			href: BASE + "/admin/bing",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("circle", {
						cx: "12",
						cy: "12",
						r: "10"
					}),
					/* @__PURE__ */ jsx("path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }),
					/* @__PURE__ */ jsx("path", { d: "M2 12h20" })
				]
			})
		},
		{
			label: "Facebook Hub",
			href: BASE + "/admin/facebook",
			icon: /* @__PURE__ */ jsx("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
			})
		},
		{
			label: "X (Twitter) Hub",
			href: BASE + "/admin/x",
			icon: /* @__PURE__ */ jsx("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "currentColor",
				children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
			})
		},
		{
			label: "Pinterest Hub",
			href: BASE + "/admin/pinterest",
			icon: /* @__PURE__ */ jsx("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "currentColor",
				children: /* @__PURE__ */ jsx("path", { d: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.151-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" })
			})
		},
		{
			label: "Instagram Hub",
			href: BASE + "/admin/instagram",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("rect", {
						x: "2",
						y: "2",
						width: "20",
						height: "20",
						rx: "5",
						ry: "5"
					}),
					/* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
					/* @__PURE__ */ jsx("line", {
						x1: "17.5",
						y1: "6.5",
						x2: "17.51",
						y2: "6.5"
					})
				]
			})
		},
		{
			label: "LinkedIn Hub",
			href: BASE + "/admin/linkedin",
			icon: /* @__PURE__ */ jsx("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "currentColor",
				children: /* @__PURE__ */ jsx("path", { d: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 1 0-.01-3.38 1.69 1.69 0 0 0 .01 3.38m1.39 9.74v-8.37H5.07v8.37h2.78z" })
			})
		},
		{
			label: "Home Slider",
			href: BASE + "/admin/slider",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("line", {
						x1: "4",
						y1: "21",
						x2: "4",
						y2: "14"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "4",
						y1: "10",
						x2: "4",
						y2: "3"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "12",
						y1: "21",
						x2: "12",
						y2: "12"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "12",
						y1: "8",
						x2: "12",
						y2: "3"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "20",
						y1: "21",
						x2: "20",
						y2: "16"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "20",
						y1: "12",
						x2: "20",
						y2: "3"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "1",
						y1: "14",
						x2: "7",
						y2: "14"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "9",
						y1: "8",
						x2: "15",
						y2: "8"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "17",
						y1: "16",
						x2: "23",
						y2: "16"
					})
				]
			})
		},
		{
			label: "Contact Messages",
			href: BASE + "/admin/contact-messages",
			icon: /* @__PURE__ */ jsx("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
			})
		},
		{
			label: "Newsletters",
			href: BASE + "/admin/newsletters",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [/* @__PURE__ */ jsx("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ jsx("polyline", { points: "22,6 12,13 2,6" })]
			})
		},
		{
			label: "Settings",
			href: "#",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [/* @__PURE__ */ jsx("circle", {
					cx: "12",
					cy: "12",
					r: "3"
				}), /* @__PURE__ */ jsx("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })]
			})
		},
		{
			label: "Navigation",
			href: BASE + "/admin/navigation",
			icon: /* @__PURE__ */ jsxs("svg", {
				width: "18",
				height: "18",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ jsx("line", {
						x1: "3",
						y1: "12",
						x2: "21",
						y2: "12"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "3",
						y1: "6",
						x2: "21",
						y2: "6"
					}),
					/* @__PURE__ */ jsx("line", {
						x1: "3",
						y1: "18",
						x2: "21",
						y2: "18"
					})
				]
			})
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("style", { children: `
        .admin-sidebar-link {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .admin-sidebar-link:hover {
          background-color: #f1f5f9;
          transform: translateX(4px);
        }
        .admin-sidebar-link.active:hover {
          background-color: #eff6ff;
          transform: translateX(4px);
        }
      ` }),
		/* @__PURE__ */ jsx("style", { children: `
        /* Global Mobile Responsiveness for Admin Panel */
        @media (max-width: 768px) {
          *, *::before, *::after {
            box-sizing: border-box !important;
          }
          
          /* Prevent main container overflow */
          body {
            overflow-x: hidden !important;
            width: 100% !important;
          }
          main {
            padding: 12px !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }

          /* Keep tables from breaking by letting them use their natural min-width */
          div > table {
            /* no min-width override, let inline minWidth handle it */
          }
          
          .overflow-x-auto, 
          div[style*="overflowX"], 
          div[style*="overflow-x"] {
            width: 100% !important;
            max-width: calc(100vw - 24px) !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
          }

          /* Ensure buttons remain legible without breaking words into single letters */
          button, a[style*="padding"] {
            white-space: nowrap !important;
            flex-shrink: 0;
          }
          
          /* Fix header and row layouts */
          .flex-row-mobile-column {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          
          /* Reduce font size for headers */
          h1 {
            font-size: 1.5rem !important;
          }
        }
      ` }),
		/* @__PURE__ */ jsxs("div", {
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
						position: "fixed",
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
								const currentPath = pathname ? pathname.split("?")[0] : "";
								const isActive = currentPath === item.href || item.href !== BASE + "/admin" && currentPath.startsWith(item.href);
								return /* @__PURE__ */ jsxs(Link, {
									href: item.href,
									className: `admin-sidebar-link ${isActive ? "active" : ""}`,
									onClick: () => isMobile && setIsSidebarOpen(false),
									style: {
										display: "flex",
										alignItems: "center",
										justifyContent: isCollapsed && !isMobile ? "center" : "flex-start",
										gap: "12px",
										padding: "10px 12px",
										fontSize: "14px",
										fontWeight: isActive ? 700 : 600,
										color: isActive ? "#2563eb" : "#475569",
										textDecoration: "none",
										background: isActive ? "#eff6ff" : "transparent",
										borderRadius: "8px"
									},
									children: [/* @__PURE__ */ jsx("span", {
										style: {
											display: "flex",
											alignItems: "center",
											opacity: isActive ? 1 : .7
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
						/* @__PURE__ */ jsx("div", {
							style: {
								padding: isCollapsed && !isMobile ? "12px 8px" : "12px 16px",
								borderTop: "1px solid #f1f5f9"
							},
							children: /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handleLogout,
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: isCollapsed && !isMobile ? "center" : "flex-start",
									gap: "10px",
									width: "100%",
									padding: "10px 12px",
									fontSize: "14px",
									fontWeight: 700,
									color: "#dc2626",
									background: "#fef2f2",
									border: "1px solid #fecaca",
									borderRadius: "8px",
									cursor: "pointer",
									textDecoration: "none",
									transition: "all 0.2s ease"
								},
								onMouseEnter: (e) => {
									e.currentTarget.style.background = "#fee2e2";
									e.currentTarget.style.borderColor = "#fca5a5";
								},
								onMouseLeave: (e) => {
									e.currentTarget.style.background = "#fef2f2";
									e.currentTarget.style.borderColor = "#fecaca";
								},
								children: [/* @__PURE__ */ jsxs("svg", {
									width: "17",
									height: "17",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									style: {
										flexShrink: 0,
										opacity: .85
									},
									children: [
										/* @__PURE__ */ jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
										/* @__PURE__ */ jsx("polyline", { points: "16 17 21 12 16 7" }),
										/* @__PURE__ */ jsx("line", {
											x1: "21",
											y1: "12",
											x2: "9",
											y2: "12"
										})
									]
								}), !(isCollapsed && !isMobile) && /* @__PURE__ */ jsx("span", {
									style: { whiteSpace: "nowrap" },
									children: "Sign Out"
								})]
							})
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
						width: isMobile ? "100%" : `calc(100% - ${isCollapsed ? "80px" : "260px"})`,
						transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
					},
					children: [/* @__PURE__ */ jsxs("header", {
						style: {
							height: "72px",
							minHeight: "72px",
							background: "rgba(255, 255, 255, 0.7)",
							backdropFilter: "blur(16px)",
							WebkitBackdropFilter: "blur(16px)",
							borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
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
							children: [!isMobile && /* @__PURE__ */ jsxs(Fragment, { children: [
								/* @__PURE__ */ jsx("a", {
									href: (typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/",
									target: "_blank",
									rel: "noopener noreferrer",
									style: {
										fontSize: "13px",
										fontWeight: 600,
										color: "#475569",
										textDecoration: "none",
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: "Live Site ↗"
								}),
								/* @__PURE__ */ jsx("a", {
									href: (typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/blog",
									target: "_blank",
									rel: "noopener noreferrer",
									style: {
										fontSize: "13px",
										fontWeight: 600,
										color: "#2563eb",
										textDecoration: "none",
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: "Blog ↗"
								}),
								/* @__PURE__ */ jsx("a", {
									href: (typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/news",
									target: "_blank",
									rel: "noopener noreferrer",
									style: {
										fontSize: "13px",
										fontWeight: 600,
										color: "#dc2626",
										textDecoration: "none",
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: "News ↗"
								}),
								/* @__PURE__ */ jsx("div", { style: {
									width: "1px",
									height: "24px",
									background: "#e2e8f0"
								} })
							] }), /* @__PURE__ */ jsx(Link, {
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
		})
	] });
}
//#endregion
export { AdminLayout as default };
