import { t as Navbar } from "./Navbar-Dej3-zgW.js";
import { n as ReportModal, t as PostCard } from "./PostCard-CqLvinb6.js";
import { Head, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { Flame, Sparkles, TrendingUp } from "lucide-react";
//#region resources/js/Pages/User/Show.jsx
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
		className: "min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20",
		children: [
			/* @__PURE__ */ jsx(Head, {
				title: profileUser.username,
				children: /* @__PURE__ */ jsx("script", {
					type: "application/ld+json",
					children: JSON.stringify(profileSchema)
				})
			}),
			/* @__PURE__ */ jsx(Navbar, { auth }),
			/* @__PURE__ */ jsx(ReportModal, {
				isOpen: !!reportPostId,
				onClose: () => setReportPostId(null),
				postId: reportPostId
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full mx-auto pt-6 px-4 flex gap-6 max-w-[1200px]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-6 mb-4 px-2 border-b border-[#EDEFF1] justify-between items-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex gap-6",
								children: /* @__PURE__ */ jsx("button", {
									className: "text-[#1C1C1C] font-bold pb-2 border-b-2 border-[#1C1C1C] px-1 text-[14px]",
									children: "POSTS"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "flex gap-2 pb-2",
								children: /* @__PURE__ */ jsxs("div", {
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
								})
							})]
						}),
						allPosts.length === 0 ? /* @__PURE__ */ jsxs("div", {
							className: "bg-white border border-[#EDEFF1] rounded-md p-10 flex flex-col items-center justify-center text-[#878A8C]",
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
							children: loadingMore ? /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-[#0079D3] border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsx("div", {
								className: "text-[14px] text-[#878A8C] font-medium",
								children: "Scroll for more posts"
							})
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "hidden lg:block w-[312px] flex-shrink-0 space-y-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-[#EDEFF1] rounded-md overflow-hidden relative shadow-sm",
						children: [/* @__PURE__ */ jsx("div", {
							className: "h-24 bg-[#33A8FF] bg-cover bg-center",
							style: profileUser.banner_image ? { backgroundImage: `url(${profileUser.banner_image})` } : {}
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-3 pt-0",
							children: [
								/* @__PURE__ */ jsx("img", {
									loading: "lazy",
									decoding: "async",
									fetchPriority: "low",
									src: profileUser.profile_picture || "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
									className: "w-[84px] h-[84px] rounded-md border-4 border-white bg-white -mt-10 mb-2 relative z-10 object-cover"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "font-bold text-[22px] text-[#1C1C1C] leading-none mb-1",
									children: profileUser.name || profileUser.username
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-[12px] text-[#787C7E] font-medium mb-4",
									children: ["u/", profileUser.username]
								}),
								profileUser.bio && /* @__PURE__ */ jsx("p", {
									className: "text-[14px] text-[#1C1C1C] mb-4 leading-snug",
									children: profileUser.bio
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col gap-1 mb-4 pt-4 border-t border-[#EDEFF1]",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[14px] font-medium text-[#1C1C1C]",
										children: "Cake day"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[14px] text-[#787C7E] flex items-center gap-2",
										children: ["🎂 ", profileUser.created_at]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2 mt-4",
									children: [/* @__PURE__ */ jsx("button", {
										className: "w-full py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-full text-[14px] transition-colors shadow-none border-none",
										children: "Follow"
									}), /* @__PURE__ */ jsx("button", {
										className: "w-full py-1.5 bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] font-bold rounded-full text-[14px] transition-colors shadow-none border-none",
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
