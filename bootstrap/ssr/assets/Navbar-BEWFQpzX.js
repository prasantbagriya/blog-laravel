import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BarChart3, Building2, ChevronDown, Crown, Grid, Moon, Plus, Search, ShieldAlert, ShieldCheck, Sparkles, Sun, UserCheck } from "lucide-react";
//#region resources/js/Pages/Reviews/components/Navbar.tsx
var Navbar = ({ authUser, currentRole, onRoleChange, onOpenSearch, onOpenWriteReview, onOpenListBusiness, onSelectCategory, onNavigateHome, categories, isDarkMode, onToggleDarkMode, activeView, onNavigateView }) => {
	const [showCategoryMenu, setShowCategoryMenu] = useState(false);
	const [showRoleMenu, setShowRoleMenu] = useState(false);
	const getRoleBadge = (role) => {
		switch (role) {
			case "visitor": return {
				label: "Visitor",
				bg: "bg-zinc-100 text-zinc-900 dark:bg-[#1A1A19] dark:text-zinc-100",
				icon: UserCheck
			};
			case "reviewer": return {
				label: "Verified Reviewer",
				bg: "bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400",
				icon: ShieldCheck
			};
			case "business_owner": return {
				label: "Business Owner",
				bg: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg rounded-lg transition-all border border-transparent",
				icon: Building2
			};
			case "moderator": return {
				label: "AI Moderator",
				bg: "bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300",
				icon: ShieldAlert
			};
			case "super_admin": return {
				label: "Super Admin",
				bg: "bg-purple-50 text-purple-900 dark:bg-purple-950/60 dark:text-purple-300",
				icon: Crown
			};
			default: return {
				label: "Visitor",
				bg: "bg-zinc-100 text-zinc-900",
				icon: UserCheck
			};
		}
	};
	getRoleBadge(currentRole).icon;
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-md transition-colors",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-6 lg:gap-8",
					children: [/* @__PURE__ */ jsxs("a", {
						href: "/",
						className: "flex items-center gap-3 text-left focus:outline-none group",
						id: "nav-brand-logo",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-white font-black text-lg",
								children: "C"
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "flex items-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline-block font-bold text-[22px] tracking-tight ml-1 text-zinc-900 dark:text-white",
								children: "coachinginsikar"
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative hidden md:block",
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => setShowCategoryMenu(!showCategoryMenu),
							className: "flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition",
							id: "nav-categories-btn",
							children: [
								/* @__PURE__ */ jsx(Grid, { className: "w-3.5 h-3.5 text-blue-600" }),
								/* @__PURE__ */ jsx("span", { children: "Categories" }),
								/* @__PURE__ */ jsx(ChevronDown, { className: "w-3 h-3 opacity-60" })
							]
						}), showCategoryMenu && /* @__PURE__ */ jsxs("div", {
							className: "absolute top-full left-0 mt-2 w-72 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2",
							onMouseLeave: () => setShowCategoryMenu(false),
							children: [/* @__PURE__ */ jsx("div", {
								className: "px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400",
								children: "Directory Index"
							}), /* @__PURE__ */ jsx("div", {
								className: "py-1 max-h-80 overflow-y-auto",
								children: categories.map((cat) => /* @__PURE__ */ jsxs("button", {
									onClick: () => {
										onSelectCategory(cat.slug);
										setShowCategoryMenu(false);
									},
									className: "w-full text-left px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 flex items-center justify-between group transition",
									children: [/* @__PURE__ */ jsx("span", {
										className: "group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
										children: cat.name
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition",
										children: cat.businessCount
									})]
								}, cat.id))
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 max-w-md hidden lg:block",
					children: /* @__PURE__ */ jsxs("button", {
						onClick: onOpenSearch,
						className: "w-full flex items-center gap-3 px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-md transition group text-left",
						id: "nav-ai-search-bar",
						children: [
							/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" }),
							/* @__PURE__ */ jsx("span", {
								className: "flex-1 truncate",
								children: "Search index, ask AI agent... e.g. \"Top CRM for startups\""
							}),
							/* @__PURE__ */ jsxs("kbd", {
								className: "hidden sm:inline-flex items-center gap-1 text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded text-zinc-900 dark:text-zinc-100 font-mono shadow-2xs",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-2.5 h-2.5 text-blue-600" }), " AI"]
							})
						]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5",
					children: [
						/* @__PURE__ */ jsx("button", {
							onClick: onOpenSearch,
							className: "lg:hidden text-zinc-900 dark:text-zinc-100 hover:text-blue-600 transition",
							title: "Search",
							children: /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: () => {
								if (authUser) onOpenListBusiness();
								else window.location.href = "/login?redirect=/reviews";
							},
							className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-all shadow-sm active:scale-95 transition-all flex whitespace-nowrap shrink-0",
							id: "nav-list-business-btn",
							children: [/* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5 stroke-[2]" }), /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: "List Business"
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: () => {
								if (authUser) onOpenWriteReview();
								else window.location.href = "/login?redirect=/reviews";
							},
							className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 active:scale-95 transition-all whitespace-nowrap shrink-0",
							id: "nav-write-review-btn",
							children: [/* @__PURE__ */ jsx(Plus, { className: "w-3.5 h-3.5 stroke-[3]" }), /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: "Write Review"
							})]
						}),
						authUser?.role === "business_owner" && /* @__PURE__ */ jsxs("button", {
							onClick: () => onNavigateView("dashboard"),
							className: `flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition whitespace-nowrap shrink-0 ${activeView === "dashboard" ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`,
							children: [/* @__PURE__ */ jsx(BarChart3, { className: "w-3.5 h-3.5 text-blue-600" }), /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: "Business Suite"
							})]
						}),
						currentRole === "moderator" && /* @__PURE__ */ jsxs("button", {
							onClick: () => onNavigateView("moderation"),
							className: `flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition whitespace-nowrap shrink-0 ${activeView === "moderation" ? "bg-amber-900 border-amber-900 text-white" : "border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`,
							children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "w-3.5 h-3.5 text-amber-500" }), /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: "AI Queue"
							})]
						}),
						currentRole === "super_admin" && /* @__PURE__ */ jsxs("a", {
							href: "/admin",
							className: `flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition whitespace-nowrap shrink-0 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900`,
							children: [/* @__PURE__ */ jsx(Crown, { className: "w-3.5 h-3.5 text-purple-400" }), /* @__PURE__ */ jsx("span", {
								className: "hidden sm:inline",
								children: "Admin Panel"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "relative shrink-0",
							children: authUser ? /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 whitespace-nowrap",
								children: [/* @__PURE__ */ jsxs("a", {
									href: "/dashboard",
									className: "flex items-center gap-2 hover:opacity-80 transition-opacity",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-6 h-6 rounded-full overflow-hidden bg-gray-200 shrink-0",
										children: authUser.avatar ? /* @__PURE__ */ jsx("img", {
											src: authUser.avatar,
											alt: authUser.name,
											className: "w-full h-full object-cover"
										}) : /* @__PURE__ */ jsx(UserCheck, { className: "w-4 h-4 m-1 text-gray-500" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-semibold leading-tight dark:text-white",
											children: authUser.name
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[9px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider",
											children: authUser.role
										})]
									})]
								}), /* @__PURE__ */ jsx("a", {
									href: "/logout",
									className: "ml-1 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded whitespace-nowrap",
									children: "Logout"
								})]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsxs("a", {
									href: "/login?redirect=/reviews",
									className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-md transition-colors whitespace-nowrap shrink-0",
									children: [/* @__PURE__ */ jsx(UserCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Login" })]
								}), /* @__PURE__ */ jsx("a", {
									href: "/register?redirect=/reviews",
									className: "px-3 py-1.5 text-xs font-semibold text-white dark:text-white hover:text-white dark:hover:text-white bg-zinc-900 dark:bg-zinc-900 hover:bg-black dark:hover:bg-black rounded-md transition-colors whitespace-nowrap shrink-0",
									children: "Register"
								})]
							})
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: onToggleDarkMode,
							className: "text-zinc-900 dark:text-zinc-100 hover:text-blue-600 transition",
							title: "Toggle theme",
							id: "nav-theme-toggle-btn",
							children: isDarkMode ? /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4 text-amber-400" }) : /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4 text-zinc-900" })
						})
					]
				})
			]
		})
	});
};
//#endregion
export { Navbar };
