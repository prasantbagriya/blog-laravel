import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { t as PostCard } from "./PostCard-Cj9lcwgm.js";
import { Head, Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check, Flame, Search, Sparkles, TrendingUp } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
//#region resources/js/Components/Navbar.jsx
dayjs.extend(relativeTime);
function Navbar({ auth, searchQuery = "" }) {
	const [query, setQuery] = useState(searchQuery);
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const notifRef = useRef(null);
	const handleSearch = (e) => {
		if (e.key === "Enter") router.get("/search", { q: query });
	};
	const markAsRead = (id = null) => {
		router.post("/notifications/mark-read", { id }, {
			preserveScroll: true,
			preserveState: true,
			onSuccess: () => {
				if (!id) setIsNotifOpen(false);
			}
		});
	};
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-50 bg-white border-b border-[#EDEFF1]",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full px-4 sm:px-6 h-14 flex items-center justify-between",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ jsxs(Link, {
						href: "/",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-white font-black text-lg",
								children: "N"
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline-block font-bold text-[22px] tracking-tight ml-2",
							children: "coachingsinsikar"
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "hidden sm:block flex-1 max-w-2xl mx-8 relative",
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute inset-y-0 left-4 flex items-center pointer-events-none",
						children: /* @__PURE__ */ jsx(Search, {
							size: 20,
							className: "text-[#878A8C]"
						})
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Search coachingsinsikar",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						onKeyDown: handleSearch,
						className: "w-full bg-[#F6F7F8] hover:bg-white hover:border-[#0079D3] border border-transparent rounded-full py-2.5 pl-12 pr-4 text-[14px] font-medium text-[#1C1C1C] placeholder-[#878A8C] focus:outline-none focus:bg-white focus:border-[#0079D3] focus:ring-0 transition-all shadow-none"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-4",
					children: auth?.user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
						className: "relative",
						ref: notifRef,
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => setIsNotifOpen(!isNotifOpen),
							className: "p-2 hover:bg-[#F6F7F8] rounded-full relative transition-colors",
							children: [/* @__PURE__ */ jsx(Bell, {
								size: 24,
								className: "text-[#1C1C1C]"
							}), auth.unread_notifications_count > 0 && /* @__PURE__ */ jsx("div", { className: "absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" })]
						}), isNotifOpen && /* @__PURE__ */ jsxs("div", {
							className: "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#EDEFF1] overflow-hidden z-50",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "p-4 border-b border-[#EDEFF1] flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-[#1C1C1C]",
									children: "Notifications"
								}), auth.unread_notifications_count > 0 && /* @__PURE__ */ jsxs("button", {
									onClick: () => markAsRead(),
									className: "text-[12px] font-medium text-[#0079D3] hover:underline flex items-center gap-1",
									children: [/* @__PURE__ */ jsx(Check, { size: 14 }), " Mark all as read"]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "max-h-96 overflow-y-auto",
								children: auth.notifications?.length === 0 ? /* @__PURE__ */ jsx("div", {
									className: "p-8 text-center text-[#878A8C] text-[14px]",
									children: "You have no notifications."
								}) : auth.notifications?.map((notif) => /* @__PURE__ */ jsxs("div", {
									onClick: () => {
										if (!notif.read_at) markAsRead(notif.id);
										router.visit(notif.data.url);
									},
									className: `p-4 border-b border-[#EDEFF1] flex gap-3 cursor-pointer hover:bg-[#F6F7F8] transition-colors ${!notif.read_at ? "bg-[#F0F8FF]" : ""}`,
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-gray-200",
											children: notif.data.profile_picture ? /* @__PURE__ */ jsx("img", {
												loading: "lazy",
												decoding: "async",
												fetchPriority: "low",
												src: notif.data.profile_picture,
												className: "w-full h-full object-cover"
											}) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-tr from-[#0079D3] to-[#4F46E5]" })
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-[14px] text-[#1C1C1C] leading-snug",
												children: notif.data.message
											}), /* @__PURE__ */ jsx("p", {
												className: "text-[12px] text-[#878A8C] mt-1",
												children: dayjs(notif.created_at).fromNow()
											})]
										}),
										!notif.read_at && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-[#0079D3] mt-2" })
									]
								}, notif.id))
							})]
						})]
					}), /* @__PURE__ */ jsxs(Link, {
						href: "/dashboard",
						className: "flex items-center gap-2 hover:bg-[#F6F7F8] px-2 py-1.5 rounded-full transition-colors",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-full bg-blue-100 overflow-hidden",
							children: auth.user.profile_picture ? /* @__PURE__ */ jsx("img", {
								loading: "lazy",
								decoding: "async",
								fetchPriority: "low",
								src: auth.user.profile_picture,
								className: "w-full h-full object-cover"
							}) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-tr from-[#0079D3] to-[#4F46E5]" })
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-[14px] hidden sm:block",
							children: auth.user.name
						})]
					})] }) : /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Link, {
							href: "/login",
							className: "px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] transition-colors",
							children: "Log In"
						}), /* @__PURE__ */ jsx(Link, {
							href: "/register",
							className: "px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-colors",
							children: "Sign Up"
						})]
					})
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/User/Show.jsx
var ReportModal = React.lazy(() => import("./ReportModal-DnY-odkX.js").then((n) => n.n));
function Show({ auth, profileUser, posts, currentSort = "new" }) {
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
	typeof window !== "undefined" ? window.location.href : `${profileUser.username}`;
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
		className: "min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-white font-sans pb-20",
		children: [
			/* @__PURE__ */ jsx(Head, {
				title: profileUser.username,
				children: /* @__PURE__ */ jsx("script", {
					type: "application/ld+json",
					children: JSON.stringify(profileSchema)
				})
			}),
			/* @__PURE__ */ jsx(Navbar, { auth }),
			/* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: !!reportPostId && /* @__PURE__ */ jsx(ReportModal, {
					isOpen: !!reportPostId,
					onClose: () => setReportPostId(null),
					postId: reportPostId
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full mx-auto pt-6 px-4 flex flex-col lg:flex-row gap-6 max-w-[1200px]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4 px-2 border-b border-slate-200 dark:border-zinc-800 justify-between sm:items-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex gap-6",
								children: /* @__PURE__ */ jsx("button", {
									className: "text-slate-900 dark:text-white font-bold pb-2 border-b-2 border-amber-500 px-1 text-[14px]",
									children: "POSTS"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "flex gap-2 pb-2",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 items-center mb-0 sm:mb-4",
									children: [
										/* @__PURE__ */ jsxs("button", {
											onClick: () => router.get(window.location.pathname, { sort: "hot" }, {
												preserveScroll: true,
												preserveState: true
											}),
											className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === "hot" ? "bg-slate-900 dark:bg-zinc-800 border-slate-900 dark:border-zinc-700 text-white" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"}`,
											children: [/* @__PURE__ */ jsx(Flame, {
												size: 16,
												className: currentSort === "hot" ? "text-amber-500" : ""
											}), "Hot"]
										}),
										/* @__PURE__ */ jsxs("button", {
											onClick: () => router.get(window.location.pathname, { sort: "new" }, {
												preserveScroll: true,
												preserveState: true
											}),
											className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === "new" ? "bg-slate-900 dark:bg-zinc-800 border-slate-900 dark:border-zinc-700 text-white" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"}`,
											children: [/* @__PURE__ */ jsx(Sparkles, {
												size: 16,
												className: currentSort === "new" ? "text-amber-500" : ""
											}), "New"]
										}),
										/* @__PURE__ */ jsxs("button", {
											onClick: () => router.get(window.location.pathname, { sort: "top" }, {
												preserveScroll: true,
												preserveState: true
											}),
											className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-[13px] transition-colors border shadow-sm ${currentSort === "top" ? "bg-slate-900 dark:bg-zinc-800 border-slate-900 dark:border-zinc-700 text-white" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700"}`,
											children: [/* @__PURE__ */ jsx(TrendingUp, {
												size: 16,
												className: currentSort === "top" ? "text-amber-500" : ""
											}), "Top"]
										})
									]
								})
							})]
						}),
						allPosts.length === 0 ? /* @__PURE__ */ jsxs("div", {
							className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400 shadow-sm",
							children: [/* @__PURE__ */ jsx("div", { className: "w-20 h-20 mb-4 opacity-50 bg-[url('https://www.redditstatic.com/desktop2x/img/snoo_thoughtful.png')] bg-contain bg-no-repeat bg-center" }), /* @__PURE__ */ jsxs("p", {
								className: "font-medium text-[16px]",
								children: [
									"hmm... u/",
									profileUser.username,
									" hasn't posted anything"
								]
							})]
						}) : allPosts.map((post, index) => /* @__PURE__ */ jsx(PostCard, {
							post,
							auth,
							openReportModal: setReportPostId,
							priorityLoad: index === 0
						}, post.id)),
						nextPageUrl && /* @__PURE__ */ jsx("div", {
							ref: loadMoreRef,
							className: "py-8 flex justify-center items-center",
							children: loadingMore ? /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx("div", {
								className: "text-[14px] text-slate-500 dark:text-zinc-400 font-medium",
								children: "Scroll for more posts"
							})
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "w-full lg:w-[312px] flex-shrink-0 space-y-4",
					children: /* @__PURE__ */ jsxs(AnimatedBorderCard, {
						className: "relative group",
						children: [/* @__PURE__ */ jsx("div", {
							className: "h-28 bg-gradient-to-r from-blue-600 to-amber-500 bg-cover bg-center",
							style: profileUser.banner_image ? { backgroundImage: `url(${profileUser.banner_image})` } : {}
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-5 pt-0",
							children: [
								/* @__PURE__ */ jsx("img", {
									loading: "lazy",
									decoding: "async",
									fetchPriority: "low",
									src: profileUser.profile_picture || "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
									className: "w-[84px] h-[84px] rounded-2xl border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 -mt-10 mb-3 relative z-10 object-cover shadow-md"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "font-extrabold text-[22px] text-slate-900 dark:text-white leading-none mb-1 group-hover:text-amber-500 transition-colors",
									children: profileUser.name || profileUser.username
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-[13px] text-slate-500 dark:text-zinc-400 font-medium mb-4",
									children: ["u/", profileUser.username]
								}),
								profileUser.bio && /* @__PURE__ */ jsx("p", {
									className: "text-[14px] text-slate-700 dark:text-zinc-300 mb-4 leading-relaxed",
									children: profileUser.bio
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col gap-1 mb-5 pt-4 border-t border-slate-100 dark:border-zinc-800/60",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[14px] font-bold text-slate-900 dark:text-white",
										children: "Cake day"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[13px] text-slate-500 dark:text-zinc-400 flex items-center gap-2 font-medium",
										children: ["🎂 ", profileUser.created_at]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2 mt-4",
									children: [/* @__PURE__ */ jsx("button", {
										className: "w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-full text-[14px] transition-transform hover:scale-105 shadow-md",
										children: "Follow"
									}), /* @__PURE__ */ jsx("button", {
										className: "w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold rounded-full text-[14px] transition-colors border border-slate-200 dark:border-zinc-700",
										children: "Chat"
									})]
								})
							]
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { Show as default };
