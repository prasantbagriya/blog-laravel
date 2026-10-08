import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
//#region resources/js/Pages/HomeComponents/HomeNavbar.tsx
function Navbar({ global_nav: passedNav }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDark, setIsDark] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [expandedMenus, setExpandedMenus] = useState([]);
	const [lastScrollY, setLastScrollY] = useState(0);
	let global_nav = passedNav || [];
	useEffect(() => {
		if (typeof window !== "undefined") {
			const isDarkMode = document.documentElement.classList.contains("dark");
			setIsDark(isDarkMode);
			let lastScrollYValue = window.scrollY || 0;
			const handleScroll = () => {
				const currentScrollY = window.scrollY;
				if (currentScrollY > 60 && currentScrollY > lastScrollYValue) setIsVisible(false);
				else setIsVisible(true);
				lastScrollYValue = currentScrollY;
			};
			window.addEventListener("scroll", handleScroll, { passive: true });
			return () => window.removeEventListener("scroll", handleScroll);
		}
	}, []);
	const toggleDarkMode = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		if (newIsDark) {
			document.documentElement.classList.add("dark");
			localStorage.theme = "dark";
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.theme = "light";
		}
	};
	const getHref = (page) => {
		const basePath = typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "";
		if (page === "landing") return basePath + "/";
		if (page.startsWith("/") || page.startsWith("http")) return page.startsWith("http") ? page : basePath + page;
		if (page === "blog") return basePath + "/blog";
		if (page === "feed") return basePath + "/feed";
		if (page === "category") return basePath + "/category";
		return basePath + `/${page}`;
	};
	const allLinks = global_nav && global_nav.length > 0 ? global_nav.filter((n) => n.is_active).map((n) => ({
		id: n.id,
		parent_id: n.parent_id,
		label: n.name,
		page: n.url || "/"
	})) : [
		{
			id: 1,
			parent_id: null,
			label: "Blog",
			page: "blog"
		},
		{
			id: 2,
			parent_id: null,
			label: "Community",
			page: "feed"
		},
		{
			id: 3,
			parent_id: null,
			label: "Explore Institutes",
			page: "business"
		},
		{
			id: 4,
			parent_id: null,
			label: "Category",
			page: "category"
		},
		{
			id: 5,
			parent_id: null,
			label: "About Us",
			page: "about"
		},
		{
			id: 6,
			parent_id: null,
			label: "Contact Us",
			page: "contact"
		}
	];
	const topLevelLinks = allLinks.filter((link) => !link.parent_id);
	const getChildren = (parentId) => allLinks.filter((link) => link.parent_id === parentId);
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("header", {
		className: `fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-[#111111] border-b border-slate-200 dark:border-zinc-800 pointer-events-auto transition-transform duration-300 font-sans ${isVisible ? "translate-y-0" : "-translate-y-full"}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("nav", {
				className: "flex items-center justify-between h-[54px]",
				children: [
					/* @__PURE__ */ jsxs("a", {
						href: getHref("landing"),
						className: "flex items-center gap-2 group decoration-transparent",
						children: [/* @__PURE__ */ jsx("img", {
							loading: "lazy",
							decoding: "async",
							src: (typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/uploads/logo.webp",
							alt: "Coaching Sikar Logo",
							className: "w-8 h-8 object-contain",
							width: "32",
							height: "32"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-[20px] font-bold text-[#1c1c1c] dark:text-white leading-none",
							children: ["Coachings ", /* @__PURE__ */ jsx("span", {
								className: "text-[#e11d48]",
								children: "Sikar"
							})]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "hidden lg:flex items-center space-x-6 ml-10 h-full",
						children: topLevelLinks.map((link) => {
							const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
							const linkPath = getHref(link.page || link.url);
							const isActive = currentPath === linkPath || (link.page || link.url) !== "landing" && (link.page || link.url) !== "/" && currentPath.includes(link.page || link.url);
							const children = getChildren(link.id);
							if (children.length > 0) return /* @__PURE__ */ jsxs("div", {
								className: "relative group h-full flex items-center",
								children: [
									/* @__PURE__ */ jsxs("a", {
										href: linkPath,
										className: `flex items-center gap-1 text-[15px] font-medium transition-colors decoration-transparent ${isActive ? "text-[#ff642d] dark:text-[#ff8a5c]" : "text-[#424242] dark:text-gray-300 hover:text-[#ff642d] dark:hover:text-[#ff8a5c]"}`,
										children: [link.label || link.name, /* @__PURE__ */ jsx("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "14",
											height: "14",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "opacity-70 group-hover:rotate-180 transition-transform duration-200",
											children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" })
										})]
									}),
									isActive && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff642d] rounded-t-md" }),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-[54px] left-0 min-w-[200px] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 rounded-b-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 flex flex-col py-2",
										children: children.map((child) => {
											const grandChildren = getChildren(child.id);
											if (grandChildren.length > 0) return /* @__PURE__ */ jsxs("div", {
												className: "relative group/sub w-full",
												children: [/* @__PURE__ */ jsxs("a", {
													href: getHref(child.page || child.url),
													className: "w-full text-left px-4 py-2 text-[14px] text-[#424242] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent flex items-center justify-between",
													children: [/* @__PURE__ */ jsx("span", { children: child.label || child.name }), /* @__PURE__ */ jsx("svg", {
														xmlns: "http://www.w3.org/2000/svg",
														width: "12",
														height: "12",
														viewBox: "0 0 24 24",
														fill: "none",
														stroke: "currentColor",
														strokeWidth: "2",
														strokeLinecap: "round",
														strokeLinejoin: "round",
														className: "-rotate-90 opacity-70",
														children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" })
													})]
												}), /* @__PURE__ */ jsx("div", {
													className: "absolute top-0 left-full min-w-[200px] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 transform translate-x-2 group-hover/sub:translate-x-0 z-50 flex flex-col py-2 -mt-2",
													children: grandChildren.map((gc) => /* @__PURE__ */ jsx("a", {
														href: getHref(gc.page || gc.url),
														className: "px-4 py-2 text-[14px] text-[#424242] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent whitespace-nowrap block w-full",
														children: gc.label || gc.name
													}, gc.id || gc.label || gc.name))
												})]
											}, child.id || child.label || child.name);
											return /* @__PURE__ */ jsx("a", {
												href: getHref(child.page || child.url),
												className: "px-4 py-2 text-[14px] text-[#424242] dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent whitespace-nowrap block w-full",
												children: child.label || child.name
											}, child.id || child.label || child.name);
										})
									})
								]
							}, link.id || link.label || link.name);
							return /* @__PURE__ */ jsxs("a", {
								href: linkPath,
								className: `relative flex items-center text-[15px] font-medium transition-colors decoration-transparent h-full ${isActive ? "text-[#ff642d] dark:text-[#ff8a5c]" : "text-[#424242] dark:text-gray-300 hover:text-[#ff642d] dark:hover:text-[#ff8a5c]"}`,
								children: [link.label || link.name, isActive && /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-[3px] bg-[#ff642d] rounded-t-md" })]
							}, link.id || link.label || link.name);
						})
					}),
					/* @__PURE__ */ jsx("div", { className: "hidden lg:flex flex-1" }),
					/* @__PURE__ */ jsxs("div", {
						className: "hidden lg:flex items-center gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 mr-2",
								children: [/* @__PURE__ */ jsx("a", {
									href: "/search",
									className: "text-[#424242] hover:text-[#ff642d] dark:text-gray-300 dark:hover:text-[#ff8a5c] transition-colors",
									"aria-label": "Search",
									children: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "20",
										height: "20",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2.5",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: [/* @__PURE__ */ jsx("circle", {
											cx: "11",
											cy: "11",
											r: "8"
										}), /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })]
									})
								}), /* @__PURE__ */ jsx("button", {
									onClick: toggleDarkMode,
									className: "text-[#424242] hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400 transition-colors",
									"aria-label": "Toggle dark mode",
									children: isDark ? /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Moon, { className: "w-5 h-5" })
								})]
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/login",
								className: "text-[15px] font-medium text-[#1c1c1c] dark:text-white hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent px-3",
								children: "Log In"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/register",
								className: "btn-amber px-6 py-2.5 font-medium text-zinc-950 rounded hover:bg-[#e85522] transition-colors decoration-transparent text-[15px]",
								children: "Sign Up"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "lg:hidden flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: toggleDarkMode,
								className: "text-[#424242] hover:text-amber-500 dark:text-gray-300 dark:hover:text-amber-400 transition-colors",
								"aria-label": "Toggle dark mode",
								children: isDark ? /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Moon, { className: "w-5 h-5" })
							}),
							/* @__PURE__ */ jsx("a", {
								href: "/search",
								className: "text-[#424242] dark:text-gray-300",
								"aria-label": "Search",
								children: /* @__PURE__ */ jsxs("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "22",
									height: "22",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [/* @__PURE__ */ jsx("circle", {
										cx: "11",
										cy: "11",
										r: "8"
									}), /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })]
								})
							}),
							/* @__PURE__ */ jsx("button", {
								"aria-label": "Toggle menu",
								onClick: () => setIsMenuOpen(!isMenuOpen),
								className: "text-[#1c1c1c] dark:text-white",
								children: isMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-7 w-7" }) : /* @__PURE__ */ jsx(Menu, { className: "h-7 w-7" })
							})
						]
					})
				]
			}), isMenuOpen && /* @__PURE__ */ jsxs("div", {
				className: "lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111111] py-4 animate-slide-down absolute left-0 right-0 top-[54px] shadow-lg max-h-[calc(100vh-54px)] overflow-y-auto",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex flex-col",
					children: topLevelLinks.map((link) => {
						const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
						const linkPath = getHref(link.page || link.url);
						const isActive = currentPath === linkPath || (link.page || link.url) !== "landing" && (link.page || link.url) !== "/" && currentPath.includes(link.page || link.url);
						const children = getChildren(link.id);
						const hasChildren = children.length > 0;
						const isExpanded = expandedMenus.includes(link.id || link.label || link.name);
						return /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border-l-4 border-transparent group",
							children: [/* @__PURE__ */ jsx("a", {
								href: linkPath,
								className: `flex-1 px-6 py-3.5 text-[16px] font-medium decoration-transparent ${isActive ? "bg-orange-50 dark:bg-zinc-900 text-[#ff642d]" : "text-[#1c1c1c] dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-zinc-900"}`,
								children: link.label || link.name
							}), hasChildren && /* @__PURE__ */ jsx("button", {
								onClick: (e) => {
									e.preventDefault();
									setExpandedMenus((prev) => prev.includes(link.id || link.label || link.name) ? prev.filter((item) => item !== (link.id || link.label || link.name)) : [...prev, link.id || link.label || link.name]);
								},
								className: `p-3.5 flex items-center justify-center ${isActive ? "bg-orange-50 dark:bg-zinc-900 text-[#ff642d]" : "text-[#1c1c1c] dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-zinc-900"}`,
								children: /* @__PURE__ */ jsx("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "20",
									height: "20",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: `transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`,
									children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" })
								})
							})]
						}), hasChildren && isExpanded && /* @__PURE__ */ jsx("div", {
							className: "bg-slate-50/50 dark:bg-[#151515]/50 border-b border-slate-100 dark:border-zinc-800/50",
							children: children.map((child) => {
								const grandChildren = getChildren(child.id);
								const hasGrandChildren = grandChildren.length > 0;
								const isChildExpanded = expandedMenus.includes(child.id || child.label || child.name);
								return /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between border-l-4 border-transparent",
									children: [/* @__PURE__ */ jsx("a", {
										href: getHref(child.page || child.url),
										className: "flex-1 px-10 py-3 text-[15px] font-medium text-[#707070] dark:text-gray-400 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent",
										children: child.label || child.name
									}), hasGrandChildren && /* @__PURE__ */ jsx("button", {
										onClick: (e) => {
											e.preventDefault();
											setExpandedMenus((prev) => prev.includes(child.id || child.label || child.name) ? prev.filter((item) => item !== (child.id || child.label || child.name)) : [...prev, child.id || child.label || child.name]);
										},
										className: "p-3 pr-6 text-[#707070] dark:text-gray-400 hover:text-[#ff642d] dark:hover:text-[#ff8a5c]",
										children: /* @__PURE__ */ jsx("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "18",
											height: "18",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: `transition-transform duration-200 ${isChildExpanded ? "rotate-180" : ""}`,
											children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" })
										})
									})]
								}), hasGrandChildren && isChildExpanded && /* @__PURE__ */ jsx("div", {
									className: "bg-slate-100/50 dark:bg-[#202020]/50 py-1",
									children: grandChildren.map((gc) => /* @__PURE__ */ jsxs("a", {
										href: getHref(gc.page),
										className: "px-14 py-2.5 text-[14px] font-medium text-[#888] dark:text-gray-500 hover:text-[#ff642d] dark:hover:text-[#ff8a5c] transition-colors decoration-transparent border-l-4 border-transparent block",
										children: ["- ", gc.label]
									}, gc.id || gc.label))
								})] }, child.id || child.label || child.name);
							})
						})] }, link.id || link.label || link.name);
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "px-6 pt-4 pb-4 flex flex-col gap-3 border-t border-slate-200 dark:border-zinc-800",
					children: [/* @__PURE__ */ jsx("a", {
						href: "/login",
						className: "flex items-center justify-center font-medium text-[#1c1c1c] dark:text-white border-2 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 py-3 rounded decoration-transparent transition-colors",
						children: "Log In"
					}), /* @__PURE__ */ jsx("a", {
						href: "/register",
						className: "flex items-center justify-center font-medium text-zinc-950 bg-[#ff642d] hover:bg-[#e85522] py-3 rounded decoration-transparent transition-colors",
						children: "Sign Up"
					})]
				})]
			})]
		})
	}) });
}
//#endregion
export { Navbar as default };
