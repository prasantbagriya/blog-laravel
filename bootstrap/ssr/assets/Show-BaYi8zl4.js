import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { t as Navbar } from "./GlobalNavbar-zZ4BwNn2.js";
import { t as BlogFooter } from "./BlogFooter-BKjg8DJQ.js";
import "./AnimatedBorderCard-B7gc4jxI.js";
import { t as PostCard } from "./PostCard-Cj9lcwgm.js";
import { Head, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Calendar, Flame, MessageSquare, Sparkles, Star, TrendingUp } from "lucide-react";
//#region resources/js/Pages/User/Show.jsx
var ReportModal = React.lazy(() => import("./ReportModal-DnY-odkX.js").then((n) => n.n));
var Image$1 = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
	return /* @__PURE__ */ jsx("img", {
		src,
		alt,
		style: fill ? {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			width: "100%",
			height: "100%",
			...style
		} : style,
		sizes,
		fetchPriority: priority ? "high" : fetchPriority || "auto",
		loading: priority ? "eager" : "lazy",
		decoding: priority ? "sync" : "async",
		...props
	});
};
function Show({ auth, profileUser, posts, currentSort = "new", meta }) {
	const [allPosts, setAllPosts] = useState(posts.data);
	const [nextPageUrl, setNextPageUrl] = useState(posts.next_page_url);
	const [loadingMore, setLoadingMore] = useState(false);
	const [reportPostId, setReportPostId] = useState(null);
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
	const profileSchema = {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		"dateCreated": profileUser.created_at,
		"mainEntity": {
			"@type": "Person",
			"name": profileUser.username,
			"identifier": profileUser.username,
			"interactionStatistic": [{
				"@type": "InteractionCounter",
				"interactionType": "https://schema.org/WriteAction",
				"userInteractionCount": profileUser.post_karma + profileUser.comment_karma
			}],
			"agentInteractionStatistic": {
				"@type": "InteractionCounter",
				"interactionType": "https://schema.org/WriteAction",
				"userInteractionCount": posts.total || 0
			}
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-slate-50 dark:bg-[#09090b] min-h-screen flex flex-col font-sans transition-colors duration-300",
		children: [
			meta ? /* @__PURE__ */ jsx(SeoMeta, { meta }) : /* @__PURE__ */ jsx(Head, {
				title: `${profileUser.name || profileUser.username} (@${profileUser.username})`,
				children: /* @__PURE__ */ jsx("script", {
					type: "application/ld+json",
					children: JSON.stringify(profileSchema)
				})
			}),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: !!reportPostId && /* @__PURE__ */ jsx(ReportModal, {
					isOpen: !!reportPostId,
					onClose: () => setReportPostId(null),
					postId: reportPostId
				})
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-8 max-w-[1000px] mt-16 flex-grow",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-800 mb-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "h-48 md:h-64 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 relative",
						children: [profileUser.banner_image && /* @__PURE__ */ jsx("img", {
							src: profileUser.banner_image,
							alt: `${profileUser.username} banner`,
							className: "w-full h-full object-cover absolute inset-0 mix-blend-overlay opacity-80"
						}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "px-6 md:px-10 pb-8 relative",
						children: [/* @__PURE__ */ jsx("div", {
							className: "relative -mt-16 md:-mt-20 mb-4 inline-block",
							children: /* @__PURE__ */ jsx("div", {
								className: "w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 overflow-hidden shadow-lg relative z-10",
								children: /* @__PURE__ */ jsx(Image$1, {
									src: profileUser.profile_picture || "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
									alt: profileUser.name || profileUser.username,
									fill: true,
									style: { objectFit: "cover" }
								})
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row md:justify-between md:items-start gap-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ jsx("h1", {
										className: "text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight",
										children: profileUser.name || profileUser.username
									}),
									/* @__PURE__ */ jsxs("h2", {
										className: "text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2",
										children: ["u/", profileUser.username]
									}),
									profileUser.bio && /* @__PURE__ */ jsx("p", {
										className: "text-slate-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed max-w-2xl mb-6",
										children: profileUser.bio
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-4 text-sm font-medium",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700",
											children: [/* @__PURE__ */ jsx(Calendar, {
												size: 16,
												className: "text-amber-500"
											}), /* @__PURE__ */ jsxs("span", { children: ["Joined ", profileUser.created_at] })]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700",
											children: [/* @__PURE__ */ jsx(Star, {
												size: 16,
												className: "text-blue-500 fill-blue-500/20"
											}), /* @__PURE__ */ jsxs("span", { children: [(profileUser.post_karma || 0) + (profileUser.comment_karma || 0), " Karma"] })]
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 shrink-0",
								children: [/* @__PURE__ */ jsx("button", {
									className: "px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-full text-[15px] transition-transform hover:scale-105 shadow-md flex items-center justify-center min-w-[120px]",
									children: "Follow"
								}), /* @__PURE__ */ jsxs("button", {
									className: "px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold rounded-full text-[15px] transition-colors border border-slate-200 dark:border-zinc-700 flex items-center justify-center min-w-[120px]",
									children: [/* @__PURE__ */ jsx(MessageSquare, {
										size: 16,
										className: "mr-2"
									}), " Chat"]
								})]
							})]
						})]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-col lg:flex-row gap-8",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex-1 space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900 p-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-xl font-extrabold text-slate-900 dark:text-white px-2 hidden sm:block",
									children: "Activity"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar pb-1 sm:pb-0",
									children: [
										/* @__PURE__ */ jsxs("button", {
											onClick: () => router.get(window.location.pathname, { sort: "hot" }, {
												preserveScroll: true,
												preserveState: true
											}),
											className: `flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-[14px] transition-all shadow-sm whitespace-nowrap ${currentSort === "hot" ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"}`,
											children: [/* @__PURE__ */ jsx(Flame, {
												size: 16,
												className: currentSort === "hot" ? "text-white" : "text-amber-500"
											}), "Hot"]
										}),
										/* @__PURE__ */ jsxs("button", {
											onClick: () => router.get(window.location.pathname, { sort: "new" }, {
												preserveScroll: true,
												preserveState: true
											}),
											className: `flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-[14px] transition-all shadow-sm whitespace-nowrap ${currentSort === "new" ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"}`,
											children: [/* @__PURE__ */ jsx(Sparkles, {
												size: 16,
												className: currentSort === "new" ? "text-white" : "text-amber-500"
											}), "New"]
										}),
										/* @__PURE__ */ jsxs("button", {
											onClick: () => router.get(window.location.pathname, { sort: "top" }, {
												preserveScroll: true,
												preserveState: true
											}),
											className: `flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-[14px] transition-all shadow-sm whitespace-nowrap ${currentSort === "top" ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"}`,
											children: [/* @__PURE__ */ jsx(TrendingUp, {
												size: 16,
												className: currentSort === "top" ? "text-white" : "text-amber-500"
											}), "Top"]
										})
									]
								})]
							}),
							allPosts.length === 0 ? /* @__PURE__ */ jsxs("div", {
								className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400 shadow-sm mt-4",
								children: [
									/* @__PURE__ */ jsx("div", { className: "w-24 h-24 mb-6 opacity-50 bg-[url('https://www.redditstatic.com/desktop2x/img/snoo_thoughtful.png')] bg-contain bg-no-repeat bg-center mix-blend-luminosity" }),
									/* @__PURE__ */ jsxs("p", {
										className: "font-extrabold text-xl text-slate-700 dark:text-zinc-300",
										children: [
											"hmm... u/",
											profileUser.username,
											" hasn't posted anything"
										]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm mt-2",
										children: "When they do, their posts will show up here."
									})
								]
							}) : /* @__PURE__ */ jsx("div", {
								className: "space-y-6",
								children: allPosts.map((post, index) => /* @__PURE__ */ jsx(PostCard, {
									post,
									auth,
									openReportModal: setReportPostId,
									priorityLoad: index === 0
								}, post.id))
							}),
							nextPageUrl && /* @__PURE__ */ jsx("div", {
								ref: loadMoreRef,
								className: "py-10 flex justify-center items-center",
								children: loadingMore ? /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx("div", {
									className: "px-6 py-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full text-[14px] text-slate-600 dark:text-zinc-400 font-bold border border-slate-200 dark:border-zinc-700",
									children: "Scroll for more"
								})
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { Show as default };
