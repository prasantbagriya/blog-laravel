import { t as Navbar } from "./Navbar-Dej3-zgW.js";
import { n as ReportModal, t as PostCard } from "./PostCard-CqLvinb6.js";
import { Head, Link, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { Compass, Flame, Home, Plus, Sparkles, TrendingUp } from "lucide-react";
//#region resources/js/Pages/Community/Feed.jsx
function Feed({ auth, posts, currentSort = "new", currentFilter = "home" }) {
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
	const currentUrl = typeof window !== "undefined" ? window.location.href : "https://coachingsinsikar.com/";
	const collectionSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"name": "coachingsinsikar - The Front Page of the Internet",
		"description": "Welcome to coachingsinsikar. Join communities, share posts, and discuss your favorite topics on the front page of the internet.",
		"url": currentUrl,
		"mainEntity": {
			"@type": "ItemList",
			"itemListElement": allPosts.map((post, index) => ({
				"@type": "ListItem",
				"position": index + 1,
				"url": `https://coachingsinsikar.com/r/${post.community}/comments/${post.id}/${post.slug || ""}`
			}))
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans pb-20 transition-colors",
		children: [
			/* @__PURE__ */ jsxs(Head, {
				title: "coachingsinsikar - The Front Page of the Internet",
				children: [
					/* @__PURE__ */ jsx("meta", {
						name: "description",
						content: "Welcome to coachingsinsikar. Join communities, share posts, and discuss your favorite topics on the front page of the internet."
					}),
					/* @__PURE__ */ jsx("meta", {
						property: "og:title",
						content: "coachingsinsikar - The Front Page of the Internet"
					}),
					/* @__PURE__ */ jsx("meta", {
						property: "og:description",
						content: "Welcome to coachingsinsikar. Join communities, share posts, and discuss your favorite topics on the front page of the internet."
					}),
					/* @__PURE__ */ jsx("meta", {
						property: "og:type",
						content: "website"
					}),
					/* @__PURE__ */ jsx("meta", {
						name: "twitter:card",
						content: "summary_large_image"
					}),
					/* @__PURE__ */ jsx("meta", {
						name: "twitter:title",
						content: "coachingsinsikar - The Front Page of the Internet"
					}),
					/* @__PURE__ */ jsx("meta", {
						name: "twitter:description",
						content: "Welcome to coachingsinsikar. Join communities, share posts, and discuss your favorite topics on the front page of the internet."
					}),
					/* @__PURE__ */ jsx("link", {
						rel: "canonical",
						href: currentUrl
					}),
					nextPageUrl && /* @__PURE__ */ jsx("link", {
						rel: "next",
						href: nextPageUrl
					}),
					/* @__PURE__ */ jsx("script", {
						type: "application/ld+json",
						children: JSON.stringify(collectionSchema)
					})
				]
			}),
			/* @__PURE__ */ jsx(Navbar, { auth }),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full mx-auto pt-6 px-4 flex gap-6",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "hidden lg:block w-64 flex-shrink-0",
						children: /* @__PURE__ */ jsxs("div", {
							className: "sticky top-20 space-y-2",
							children: [
								/* @__PURE__ */ jsxs(Link, {
									href: "/feed?filter=home",
									className: `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${currentFilter === "home" ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm font-bold" : "text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm"}`,
									children: [/* @__PURE__ */ jsx(Home, {
										size: 22,
										strokeWidth: currentFilter === "home" ? 2.5 : 2,
										className: currentFilter === "home" ? "text-blue-600" : "text-slate-400 dark:text-zinc-500"
									}), " Home"]
								}),
								/* @__PURE__ */ jsxs(Link, {
									href: "/feed?filter=popular",
									className: `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${currentFilter === "popular" ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm font-bold" : "text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm"}`,
									children: [/* @__PURE__ */ jsx(Compass, {
										size: 22,
										strokeWidth: currentFilter === "popular" ? 2.5 : 2,
										className: currentFilter === "popular" ? "text-amber-500" : "text-slate-400 dark:text-zinc-500"
									}), " Popular"]
								}),
								auth?.joined_communities && auth.joined_communities.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "pt-4 mt-4 border-t border-slate-200 dark:border-zinc-800",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-4",
										children: "Your Communities"
									}), auth.joined_communities.map((community) => /* @__PURE__ */ jsxs(Link, {
										href: `/community/${community.name}`,
										className: "flex items-center gap-3 px-4 py-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white font-medium transition-all",
										children: [community.icon_image ? /* @__PURE__ */ jsx("img", {
											loading: "lazy",
											decoding: "async",
											fetchPriority: "low",
											src: community.icon_image,
											className: "w-6 h-6 rounded-full object-cover"
										}) : /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-[#0079D3]" }), /* @__PURE__ */ jsxs("span", {
											className: "truncate",
											children: ["r/", community.name]
										})]
									}, community.id))]
								})
							]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 space-y-4",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								href: "/submit",
								className: "bg-white rounded-md p-2 flex gap-2 items-center cursor-text mb-4",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 ml-2 flex items-center justify-center",
										children: /* @__PURE__ */ jsx("span", {
											className: "text-white font-bold text-lg",
											children: auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : "U"
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex-1 bg-slate-100 hover:bg-slate-200 rounded-md py-2 px-4 text-[14px] text-slate-500 transition-colors flex items-center font-medium",
										children: "Create Post"
									}),
									/* @__PURE__ */ jsx("button", {
										className: "text-slate-500 hover:text-slate-800 transition-colors mr-1",
										children: /* @__PURE__ */ jsx(Plus, { size: 24 })
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2 items-center mb-4",
								children: [
									/* @__PURE__ */ jsxs("button", {
										onClick: () => router.get(window.location.pathname, { sort: "hot" }, {
											preserveScroll: true,
											preserveState: true
										}),
										className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === "hot" ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"}`,
										children: [/* @__PURE__ */ jsx(Flame, { size: 16 }), "Hot"]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => router.get(window.location.pathname, { sort: "new" }, {
											preserveScroll: true,
											preserveState: true
										}),
										className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === "new" ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"}`,
										children: [/* @__PURE__ */ jsx(Sparkles, { size: 16 }), "New"]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => router.get(window.location.pathname, { sort: "top" }, {
											preserveScroll: true,
											preserveState: true
										}),
										className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === "top" ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"}`,
										children: [/* @__PURE__ */ jsx(TrendingUp, { size: 16 }), "Top"]
									})
								]
							}),
							allPosts.map((post, index) => /* @__PURE__ */ jsx(PostCard, {
								post,
								auth,
								openReportModal,
								priorityLoad: index === 0
							}, post.id)),
							nextPageUrl && /* @__PURE__ */ jsx("div", {
								ref: loadMoreRef,
								className: "py-8 flex justify-center items-center",
								children: loadingMore ? /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-[#0079D3] border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx("div", {
									className: "text-[14px] text-[#878A8C] font-medium",
									children: "Scroll for more posts"
								})
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "hidden xl:block w-[312px] flex-shrink-0 space-y-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm",
							children: [/* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-500 to-indigo-600 h-12" }), /* @__PURE__ */ jsxs("div", {
								className: "p-5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 mb-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-12 h-12 -mt-10 bg-white dark:bg-zinc-900 rounded-xl p-1.5 shadow-md flex items-center justify-center",
											children: /* @__PURE__ */ jsx(Home, { className: "w-full h-full text-blue-600" })
										}), /* @__PURE__ */ jsx("h2", {
											className: "font-extrabold text-slate-900 dark:text-white text-[16px]",
											children: "Home"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[14px] text-slate-600 dark:text-zinc-400 mb-5 leading-relaxed",
										children: "Your personal feed. Come here to check in with your favorite communities and stay updated on the latest discussions."
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-3 pt-5 border-t border-slate-100 dark:border-zinc-800",
										children: [/* @__PURE__ */ jsx(Link, {
											href: "/submit",
											className: "block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm",
											children: "Create Post"
										}), /* @__PURE__ */ jsx(Link, {
											href: "/communities/create",
											className: "block w-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-center font-medium py-2 rounded-md transition-colors text-sm",
											children: "Create Community"
										})]
									})
								]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(ReportModal, {
				isOpen: reportModalData.isOpen,
				onClose: () => setReportModalData({
					isOpen: false,
					id: null,
					type: null
				}),
				reportableId: reportModalData.id,
				reportableType: reportModalData.type
			})
		]
	});
}
//#endregion
export { Feed as default };
