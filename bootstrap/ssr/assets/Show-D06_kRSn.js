import { t as Navbar } from "./GlobalNavbar-RO4UzKYw.js";
import { t as PostCard } from "./PostCard-Cj9lcwgm.js";
import { Head, Link, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { CircleDot, Flame, MessageSquare, Plus, Shield, Sparkle, TrendingUp, Users } from "lucide-react";
//#region resources/js/Pages/Community/Show.jsx
var ReportModal = React.lazy(() => import("./ReportModal-DnY-odkX.js").then((n) => n.n));
function Show({ auth, community, posts, currentSort = "new" }) {
	const [reportModalData, setReportModalData] = useState({
		isOpen: false,
		id: null,
		type: null
	});
	const openReportModal = (id, type) => {
		if (!auth?.user) {
			alert("Please log in to report.");
			return;
		}
		setReportModalData({
			isOpen: true,
			id,
			type
		});
	};
	const [allPosts, setAllPosts] = useState(posts.data);
	const [nextPageUrl, setNextPageUrl] = useState(posts.next_page_url);
	const [loadingMore, setLoadingMore] = useState(false);
	useEffect(() => {
		setAllPosts(posts.data);
		setNextPageUrl(posts.next_page_url);
	}, [posts]);
	const loadMoreRef = useRef(null);
	const loadMorePosts = useCallback(() => {
		if (!nextPageUrl || loadingMore) return;
		setLoadingMore(true);
		router.get(nextPageUrl, {}, {
			preserveState: true,
			preserveScroll: true,
			only: ["posts"],
			onSuccess: (page) => {
				const newPosts = page.props.posts;
				setAllPosts((prev) => {
					const existingIds = new Set(prev.map((p) => p.id));
					const uniqueNewPosts = newPosts.data.filter((p) => !existingIds.has(p.id));
					return [...prev, ...uniqueNewPosts];
				});
				setNextPageUrl(newPosts.next_page_url);
				setLoadingMore(false);
			},
			onError: () => setLoadingMore(false)
		});
	}, [nextPageUrl, loadingMore]);
	useEffect(() => {
		if (!loadMoreRef.current) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && nextPageUrl && !loadingMore) loadMorePosts();
		}, { threshold: .1 });
		observer.observe(loadMoreRef.current);
		return () => observer.disconnect();
	}, [
		loadMorePosts,
		nextPageUrl,
		loadingMore
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen overflow-x-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans transition-colors selection:bg-blue-500/30",
		children: [
			/* @__PURE__ */ jsx(Head, { title: community.display_name }),
			/* @__PURE__ */ jsx(Navbar, { auth }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx("div", {
					className: "h-40 sm:h-56 w-full bg-cover bg-center",
					style: { backgroundImage: `url(${community.banner_image || "https://www.transparenttextures.com/patterns/carbon-fibre.png"})` },
					children: !community.banner_image && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90" })
				}), /* @__PURE__ */ jsx("div", {
					className: "bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shadow-sm relative z-10",
					children: /* @__PURE__ */ jsx("div", {
						className: "max-w-[1400px] w-full mx-auto px-4 sm:px-6",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-start pb-6",
							children: [/* @__PURE__ */ jsx("div", {
								className: "relative -mt-8 sm:-mt-12 z-20",
								children: community.icon_image ? /* @__PURE__ */ jsx("img", {
									src: community.icon_image,
									alt: community.name,
									className: "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 object-cover shadow-md"
								}) : /* @__PURE__ */ jsx("div", {
									className: "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white dark:border-zinc-900 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-extrabold text-4xl flex items-center justify-center shadow-md",
									children: community.name.charAt(0).toUpperCase()
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "ml-5 sm:ml-6 mt-4 flex-1 flex flex-wrap items-start justify-between gap-6",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
									className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-1",
									children: community.display_name
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-sm font-bold text-slate-500 dark:text-zinc-400",
									children: ["r/", community.name]
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [(community.is_owner || community.is_moderator) && /* @__PURE__ */ jsxs(Link, {
										href: `/community/${community.name}/edit`,
										className: "px-5 py-2 font-bold rounded-xl transition-all text-sm border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 flex items-center gap-2 shadow-sm active:scale-[0.98]",
										children: [/* @__PURE__ */ jsx(Shield, {
											size: 16,
											className: "text-amber-500"
										}), " Mod Tools"]
									}), /* @__PURE__ */ jsx("button", {
										onClick: (e) => {
											e.preventDefault();
											if (!auth?.user) {
												router.visit("/login");
												return;
											}
											router.post(`/community/${community.id}/join`, {}, { preserveScroll: true });
										},
										className: `px-8 py-2 font-bold rounded-xl transition-all text-sm shadow-sm active:scale-[0.98] ${community.is_member ? "bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-700" : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100"}`,
										children: community.is_member ? "Joined" : "Join Community"
									})]
								})]
							})]
						})
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-[1400px] w-full mx-auto pt-8 px-4 sm:px-6 flex gap-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1 max-w-3xl pb-24 min-w-0",
					children: [
						community.is_owner || community.is_member ? /* @__PURE__ */ jsxs(Link, {
							href: `/submit?community_id=${community.id}`,
							className: "bg-slate-50 dark:bg-zinc-900 border-0 rounded-3xl p-3 flex gap-4 items-center cursor-text mb-6 shadow-inner hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-white dark:border-zinc-800 flex-shrink-0 flex items-center justify-center shadow-sm",
									children: /* @__PURE__ */ jsx("span", {
										className: "text-blue-600 dark:text-blue-400 font-extrabold text-lg",
										children: auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : "U"
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex-1 bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 rounded-2xl py-3 px-5 text-sm text-slate-500 dark:text-zinc-400 transition-colors flex items-center font-medium shadow-sm",
									children: "Create Post..."
								}),
								/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 text-slate-400 dark:text-zinc-400 flex items-center justify-center border border-slate-200 shadow-sm group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 transition-colors",
									children: /* @__PURE__ */ jsx(Plus, {
										size: 22,
										strokeWidth: 2.5
									})
								})
							]
						}) : /* @__PURE__ */ jsxs("div", {
							className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(MessageSquare, { size: 20 })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-slate-900 dark:text-white",
									children: "Join to participate"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-sm text-slate-500 dark:text-zinc-400",
									children: "You must join this community to post."
								})] })]
							}), /* @__PURE__ */ jsx("button", {
								onClick: (e) => {
									e.preventDefault();
									if (!auth?.user) {
										router.visit("/login");
										return;
									}
									router.post(`/community/${community.id}/join`, {}, { preserveScroll: true });
								},
								className: "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm whitespace-nowrap active:scale-[0.98]",
								children: "Join Community"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2 items-center mb-6 pb-4 border-b border-slate-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide",
							children: [
								/* @__PURE__ */ jsxs("button", {
									onClick: () => router.get(window.location.pathname, { sort: "hot" }, {
										preserveScroll: true,
										preserveState: true
									}),
									className: `flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${currentSort === "hot" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"}`,
									children: [/* @__PURE__ */ jsx(Flame, {
										size: 18,
										strokeWidth: currentSort === "hot" ? 2.5 : 2,
										className: currentSort === "hot" ? "" : "text-rose-500"
									}), "Hot"]
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: () => router.get(window.location.pathname, { sort: "new" }, {
										preserveScroll: true,
										preserveState: true
									}),
									className: `flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${currentSort === "new" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"}`,
									children: [/* @__PURE__ */ jsx(Sparkle, {
										size: 18,
										strokeWidth: currentSort === "new" ? 2.5 : 2,
										className: currentSort === "new" ? "" : "text-blue-500"
									}), "New"]
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: () => router.get(window.location.pathname, { sort: "top" }, {
										preserveScroll: true,
										preserveState: true
									}),
									className: `flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${currentSort === "top" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"}`,
									children: [/* @__PURE__ */ jsx(TrendingUp, {
										size: 18,
										strokeWidth: currentSort === "top" ? 2.5 : 2,
										className: currentSort === "top" ? "" : "text-emerald-500"
									}), "Top"]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-6",
							children: allPosts.map((post) => /* @__PURE__ */ jsx(PostCard, {
								post,
								auth,
								openReportModal
							}, post.id))
						}),
						nextPageUrl && /* @__PURE__ */ jsx("div", {
							ref: loadMoreRef,
							className: "py-12 flex justify-center items-center",
							children: loadingMore ? /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin shadow-sm" }) : /* @__PURE__ */ jsx("div", {
								className: "text-sm text-slate-500 dark:text-zinc-400 font-bold bg-white dark:bg-zinc-900 px-6 py-2 rounded-full border border-slate-200 dark:border-zinc-800 shadow-sm",
								children: "Scroll for more posts"
							})
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "hidden lg:block w-[320px] flex-shrink-0 space-y-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800",
								children: /* @__PURE__ */ jsx(Users, {
									size: 16,
									strokeWidth: 2.5
								})
							}), /* @__PURE__ */ jsx("h3", {
								className: "font-extrabold text-slate-900 dark:text-white tracking-wide",
								children: "About Community"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed mb-6",
									children: community.description
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-zinc-800 py-4 mb-6",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-extrabold text-xl text-slate-900 dark:text-white leading-tight",
										children: community.members_count.toLocaleString()
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs font-bold text-slate-500 dark:text-zinc-500 mt-1 uppercase tracking-wider",
										children: "Members"
									})] }), /* @__PURE__ */ jsxs("div", {
										className: "pl-4 border-l border-slate-100 dark:border-zinc-800",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "font-extrabold text-xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2 leading-tight",
											children: [/* @__PURE__ */ jsx(CircleDot, {
												size: 12,
												className: "fill-current animate-pulse"
											}), community.online_count.toLocaleString()]
										}), /* @__PURE__ */ jsx("div", {
											className: "text-xs font-bold text-slate-500 dark:text-zinc-500 mt-1 uppercase tracking-wider",
											children: "Online"
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-3",
									children: [community.is_owner || community.is_member ? /* @__PURE__ */ jsx(Link, {
										href: `/submit?community_id=${community.id}`,
										className: "flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all active:scale-[0.98] shadow-md w-full",
										children: "Create Post"
									}) : /* @__PURE__ */ jsx("button", {
										onClick: (e) => {
											e.preventDefault();
											if (!auth?.user) {
												router.visit("/login");
												return;
											}
											router.post(`/community/${community.id}/join`, {}, { preserveScroll: true });
										},
										className: "flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-md w-full",
										children: "Join to Post"
									}), (community.is_owner || community.is_moderator) && /* @__PURE__ */ jsx(Link, {
										href: `/community/${community.name}/modqueue`,
										className: "flex justify-center items-center py-2.5 px-4 rounded-xl text-sm font-bold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-sm w-full",
										children: "Mod Queue"
									})]
								})
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: reportModalData.isOpen && /* @__PURE__ */ jsx(ReportModal, {
					isOpen: reportModalData.isOpen,
					onClose: () => setReportModalData({
						isOpen: false,
						id: null,
						type: null
					}),
					reportableId: reportModalData.id,
					reportableType: reportModalData.type
				})
			})
		]
	});
}
//#endregion
export { Show as default };
