import { t as Navbar } from "./GlobalNavbar-dTNI2462.js";
import { t as BlogFooter } from "./BlogFooter-L7SI1qpL.js";
import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { r as PageHero } from "./UI-DM4uTVWI.js";
import { Head, Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp, Compass, LayoutGrid, MessageSquare, Search, User, Users } from "lucide-react";
//#region resources/js/Pages/Search/Index.jsx
function SearchIndex({ auth, posts, blogs, businesses, communities, users, query }) {
	const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
	const [activeTab, setActiveTab] = useState((urlParams ? urlParams.get("tab") : null) || "businesses");
	const [searchQuery, setSearchQuery] = useState(query || "");
	const basePath = typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "";
	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) router.visit(`${basePath}/search?q=${encodeURIComponent(searchQuery)}`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-slate-50 dark:bg-[#09090b] min-h-screen flex flex-col font-sans",
		children: [
			/* @__PURE__ */ jsx(Head, { title: `Search Results for "${query}"` }),
			/* @__PURE__ */ jsx(Navbar, {
				auth,
				searchQuery: query
			}),
			/* @__PURE__ */ jsx(PageHero, {
				badge: "Search Results",
				badgeIcon: Search,
				title: /* @__PURE__ */ jsxs(Fragment, { children: [
					"Results for \"",
					/* @__PURE__ */ jsx("span", {
						className: "text-amber-500",
						children: query
					}),
					"\""
				] }),
				description: "Find discussions, communities, institutes, and blogs.",
				className: "!pt-32 !pb-8"
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8",
				children: [
					/* @__PURE__ */ jsx("form", {
						onSubmit: handleSearch,
						className: "mb-8 max-w-2xl mx-auto",
						children: /* @__PURE__ */ jsx(AnimatedBorderCard, {
							containerClassName: "rounded-full",
							className: "rounded-full",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 bg-white dark:bg-zinc-900 px-2 py-2 group",
								children: [
									/* @__PURE__ */ jsx(Search, { className: "w-5 h-5 text-slate-500 dark:text-zinc-400 ml-3 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" }),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										name: "q",
										className: "flex-1 border-0 outline-none focus:ring-0 text-slate-900 dark:text-white text-sm py-2.5 bg-transparent placeholder-slate-500 dark:placeholder-zinc-400",
										placeholder: "Search for coaching, courses, blog posts or communities...",
										value: searchQuery,
										onChange: (e) => setSearchQuery(e.target.value)
									}),
									/* @__PURE__ */ jsx("button", {
										type: "submit",
										className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none",
										children: "Search"
									})
								]
							})
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-2 mb-8",
						children: [
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setActiveTab("businesses"),
								className: `flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${activeTab === "businesses" ? "bg-amber-500 text-white shadow-md shadow-amber-500/25" : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20"}`,
								children: [/* @__PURE__ */ jsx(Compass, { size: 15 }), " Institutes"]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setActiveTab("blogs"),
								className: `flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${activeTab === "blogs" ? "bg-violet-500 text-white shadow-md shadow-violet-500/25" : "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20"}`,
								children: [/* @__PURE__ */ jsx(MessageSquare, { size: 15 }), " Blogs"]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setActiveTab("posts"),
								className: `flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${activeTab === "posts" ? "bg-blue-500 text-white shadow-md shadow-blue-500/25" : "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20"}`,
								children: [/* @__PURE__ */ jsx(MessageSquare, { size: 15 }), " Community Posts"]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setActiveTab("communities"),
								className: `flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${activeTab === "communities" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"}`,
								children: [/* @__PURE__ */ jsx(LayoutGrid, { size: 15 }), " Communities"]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setActiveTab("users"),
								className: `flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${activeTab === "users" ? "bg-pink-500 text-white shadow-md shadow-pink-500/25" : "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-500/20"}`,
								children: [/* @__PURE__ */ jsx(Users, { size: 15 }), " People"]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							activeTab === "businesses" && /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
								children: !businesses || businesses.length === 0 ? /* @__PURE__ */ jsxs("div", {
									className: "col-span-full bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4",
										children: /* @__PURE__ */ jsx(Compass, { className: "w-8 h-8 text-slate-400" })
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xl font-bold text-slate-900 dark:text-white mb-2",
										children: "No institutes found"
									})]
								}) : businesses.map((biz) => /* @__PURE__ */ jsxs(Link, {
									href: basePath + `/reviews/${biz.category || "coaching-institutes"}/${biz.slug}`,
									className: "group flex flex-col gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-full h-32 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-[1.02] transition-transform",
										children: biz.logo ? /* @__PURE__ */ jsx("img", {
											loading: "lazy",
											decoding: "async",
											fetchPriority: "low",
											src: biz.logo,
											className: "w-full h-full object-contain p-2"
										}) : /* @__PURE__ */ jsx(Compass, {
											size: 40,
											className: "text-slate-400"
										})
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
										className: "font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1",
										children: biz.name
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed",
										children: biz.description || biz.category || "Coaching Institute"
									})] })]
								}, biz.id))
							}),
							activeTab === "blogs" && /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: !blogs || blogs.length === 0 ? /* @__PURE__ */ jsxs("div", {
									className: "col-span-full bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4",
										children: /* @__PURE__ */ jsx(MessageSquare, { className: "w-8 h-8 text-slate-400" })
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xl font-bold text-slate-900 dark:text-white mb-2",
										children: "No blog posts found"
									})]
								}) : blogs.map((blog) => /* @__PURE__ */ jsxs(Link, {
									href: basePath + `/blog/${blog.slug}`,
									className: "group flex flex-col sm:flex-row gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-full sm:w-32 h-40 sm:h-auto rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-[1.02] transition-transform",
										children: blog.coverImage || blog.cover_image ? /* @__PURE__ */ jsx("img", {
											loading: "lazy",
											decoding: "async",
											fetchPriority: "low",
											src: blog.coverImage || blog.cover_image,
											className: "w-full h-full object-cover"
										}) : /* @__PURE__ */ jsx(MessageSquare, {
											size: 32,
											className: "text-slate-400"
										})
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col justify-center",
										children: [/* @__PURE__ */ jsx("h3", {
											className: "font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2",
											children: blog.title
										}), /* @__PURE__ */ jsx("p", {
											className: "text-sm text-slate-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed",
											children: blog.category || "Article"
										})]
									})]
								}, blog.id))
							}),
							activeTab === "posts" && /* @__PURE__ */ jsx("div", { children: !posts || posts.length === 0 ? /* @__PURE__ */ jsxs("div", {
								className: "bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4",
										children: /* @__PURE__ */ jsx(Search, { className: "w-8 h-8 text-slate-400" })
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xl font-bold text-slate-900 dark:text-white mb-2",
										children: "No posts found"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-slate-500 dark:text-zinc-400 text-sm",
										children: "Try checking your spelling or using less specific keywords."
									})
								]
							}) : posts.map((post) => /* @__PURE__ */ jsxs("div", {
								className: "group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md rounded-2xl flex cursor-pointer transition-all duration-200 mb-4 overflow-hidden",
								onClick: () => router.visit(basePath + `/r/${post.community.name}/comments/${post.id}`),
								children: [/* @__PURE__ */ jsxs("div", {
									className: "w-12 bg-slate-50 dark:bg-zinc-950/50 flex flex-col items-center py-4 gap-1 border-r border-slate-100 dark:border-zinc-800/50",
									children: [
										/* @__PURE__ */ jsx(ArrowBigUp, {
											size: 24,
											className: "text-slate-400 dark:text-zinc-500 group-hover:text-amber-500 transition-colors"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-sm font-bold text-slate-700 dark:text-zinc-300",
											children: post.score
										}),
										/* @__PURE__ */ jsx(ArrowBigDown, {
											size: 24,
											className: "text-slate-400 dark:text-zinc-500"
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "p-4 sm:p-5 flex-1",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap items-center gap-2 text-xs mb-3",
											children: [
												/* @__PURE__ */ jsxs(Link, {
													href: basePath + `/r/${post.community?.name}`,
													className: "font-bold text-slate-900 dark:text-white hover:text-amber-500 transition-colors",
													onClick: (e) => e.stopPropagation(),
													children: ["r/", post.community?.name]
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-slate-300 dark:text-zinc-600",
													children: "•"
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-slate-500 dark:text-zinc-400",
													children: "Posted by"
												}),
												/* @__PURE__ */ jsxs(Link, {
													href: basePath + `/u/${post.author?.username}`,
													className: "text-slate-600 dark:text-zinc-300 hover:text-amber-500 transition-colors",
													onClick: (e) => e.stopPropagation(),
													children: ["u/", post.author?.username]
												})
											]
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-lg font-bold text-slate-900 dark:text-white mb-4 group-hover:text-amber-500 transition-colors leading-snug",
											children: post.title
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 text-slate-500 dark:text-zinc-400 text-xs font-bold bg-slate-100 dark:bg-zinc-800/50 w-fit px-3 py-1.5 rounded-full",
											children: [/* @__PURE__ */ jsx(MessageSquare, { size: 14 }), /* @__PURE__ */ jsx("span", { children: post.comments_count || "Comments" })]
										})
									]
								})]
							}, post.id)) }),
							activeTab === "communities" && /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: !communities || communities.length === 0 ? /* @__PURE__ */ jsxs("div", {
									className: "col-span-full bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4",
										children: /* @__PURE__ */ jsx(Compass, { className: "w-8 h-8 text-slate-400" })
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xl font-bold text-slate-900 dark:text-white mb-2",
										children: "No communities found"
									})]
								}) : communities.map((community) => /* @__PURE__ */ jsxs(Link, {
									href: basePath + `/r/${community.name}`,
									className: "group flex items-start gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform",
										children: community.icon_image ? /* @__PURE__ */ jsx("img", {
											loading: "lazy",
											decoding: "async",
											fetchPriority: "low",
											src: community.icon_image,
											className: "w-full h-full object-cover"
										}) : /* @__PURE__ */ jsx(Compass, {
											size: 28,
											className: "text-blue-500 dark:text-blue-400"
										})
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
										className: "font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors",
										children: ["r/", community.name]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed",
										children: community.description || "A community to discuss things related to " + community.name
									})] })]
								}, community.id))
							}),
							activeTab === "users" && /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
								children: !users || users.length === 0 ? /* @__PURE__ */ jsxs("div", {
									className: "col-span-full bg-white dark:bg-zinc-900 p-12 rounded-2xl text-center border border-slate-200 dark:border-zinc-800 flex flex-col items-center",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4",
										children: /* @__PURE__ */ jsx(User, { className: "w-8 h-8 text-slate-400" })
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xl font-bold text-slate-900 dark:text-white mb-2",
										children: "No users found"
									})]
								}) : users.map((user) => /* @__PURE__ */ jsxs(Link, {
									href: basePath + `/u/${user.username}`,
									className: "group flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform",
										children: user.profile_picture ? /* @__PURE__ */ jsx("img", {
											loading: "lazy",
											decoding: "async",
											fetchPriority: "low",
											src: user.profile_picture,
											className: "w-full h-full object-cover"
										}) : /* @__PURE__ */ jsx(User, {
											size: 24,
											className: "text-slate-400"
										})
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
										className: "font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors",
										children: ["u/", user.username]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
										children: user.name || "Reddit User"
									})] })]
								}, user.id))
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { SearchIndex as default };
