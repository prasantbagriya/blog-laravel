import { Link as Link$1, navigate, postHomeAction } from "./utils-BjQF728w.js";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useState } from "react";
import { ChevronRight, MessageSquare, Share2, TrendingUp } from "lucide-react";
//#region resources/js/Pages/HomeComponents/CommunityFeedSection.jsx
var ShareModal = React.lazy(() => import("./ShareModal-2YClwU5E.js"));
var CommunityFeedSection = ({ basePath, feedPosts, topCommunities }) => {
	const displayPosts = feedPosts || [];
	const displayCommunities = topCommunities || [];
	const [shareModalOpen, setShareModalOpen] = useState(false);
	const [shareData, setShareData] = useState({
		url: "",
		title: ""
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "pt-6 pb-10 md:pt-10 md:pb-14 bg-slate-50 dark:bg-zinc-950 relative border-b border-slate-200 dark:border-zinc-800",
		children: [
			/* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: shareModalOpen && /* @__PURE__ */ jsx(ShareModal, {
					isOpen: shareModalOpen,
					onClose: () => setShareModalOpen(false),
					url: shareData.url,
					title: shareData.title
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none",
				style: {
					backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
					backgroundSize: "24px 24px"
				}
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-4 border border-blue-200 dark:border-blue-800/30",
							children: [/* @__PURE__ */ jsx(MessageSquare, { size: 14 }), " Student Community"]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight",
							children: "Recent Discussions"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-slate-600 dark:text-zinc-400 mt-3 text-base md:text-lg max-w-2xl",
							children: "Join the conversation with thousands of students. Share study materials, ask doubts, and get exam strategies."
						})
					] }), /* @__PURE__ */ jsxs(Link$1, {
						href: "/feed",
						className: "text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 group shrink-0 whitespace-nowrap hidden md:inline-flex",
						children: ["View All Feed ", /* @__PURE__ */ jsx(ChevronRight, {
							size: 18,
							className: "group-hover:translate-x-1 transition-transform"
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-8 space-y-5",
						children: [displayPosts.length > 0 ? displayPosts.map((post) => /* @__PURE__ */ jsxs("div", {
							onClick: () => navigate(`${basePath}/r/${post.community}/comments/${post.id}`),
							className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-5 md:p-6 flex gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer group",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "hidden sm:flex flex-col items-center gap-2 min-w-[44px]",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: (e) => {
										e.stopPropagation();
										postHomeAction(`${basePath}/vote`, {
											votable_type: "post",
											votable_id: post.id,
											value: 1
										});
									},
									className: `p-1.5 rounded-full transition-colors border-none outline-none focus:outline-none ring-0 focus:ring-0 ${post.has_voted ? "text-white bg-amber-500 shadow-md shadow-amber-500/20" : "text-slate-400 dark:text-zinc-500 hover:text-white hover:bg-amber-500 hover:shadow-md hover:shadow-amber-500/20"}`,
									title: post.has_voted ? "Upvoted" : "Upvote",
									children: /* @__PURE__ */ jsx(TrendingUp, { size: 20 })
								}), /* @__PURE__ */ jsx("span", {
									className: `font-bold text-sm ${post.has_voted ? "text-amber-500" : "text-slate-800 dark:text-zinc-300"}`,
									children: post.score
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 mb-3 flex-wrap",
										children: [
											/* @__PURE__ */ jsxs("span", {
												className: "font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border border-blue-100 dark:border-blue-800/30",
												children: ["r/", post.community]
											}),
											/* @__PURE__ */ jsx("span", { children: "•" }),
											/* @__PURE__ */ jsxs("span", { children: ["Posted by ", /* @__PURE__ */ jsxs("span", {
												className: "font-bold text-slate-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
												children: ["u/", post.author?.username || post.author]
											})] }),
											/* @__PURE__ */ jsx("span", { children: "•" }),
											/* @__PURE__ */ jsx("span", { children: post.created_at ? new Date(post.created_at).toLocaleDateString() : post.time })
										]
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "font-bold text-slate-900 dark:text-white text-lg md:text-xl mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 break-words",
										children: post.title
									}),
									post.type === "TEXT" && post.content && /* @__PURE__ */ jsx("p", {
										className: "text-slate-600 dark:text-zinc-400 text-sm line-clamp-2 mb-3 leading-relaxed",
										children: post.content.replace(/<[^>]*>?/gm, "")
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex gap-2 -ml-1.5 mt-2 flex-nowrap whitespace-nowrap overflow-x-auto pb-1",
										style: {
											scrollbarWidth: "none",
											msOverflowStyle: "none"
										},
										children: [
											/* @__PURE__ */ jsxs("button", {
												onClick: (e) => {
													e.stopPropagation();
													postHomeAction(`${basePath}/vote`, {
														votable_type: "post",
														votable_id: post.id,
														value: 1
													});
												},
												className: `shrink-0 whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] border-0 outline-none focus:outline-none focus:ring-0 sm:hidden ${post.has_voted ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "bg-slate-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400"}`,
												children: [/* @__PURE__ */ jsx(TrendingUp, {
													size: 16,
													className: post.has_voted ? "text-amber-500" : ""
												}), /* @__PURE__ */ jsx("span", {
													className: post.has_voted ? "text-amber-500" : "",
													children: post.score
												})]
											}),
											/* @__PURE__ */ jsxs(Link$1, {
												href: `/r/${post.community}/comments/${post.id}`,
												onClick: (e) => e.stopPropagation(),
												className: "shrink-0 whitespace-nowrap flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-2 rounded-xl transition-colors font-bold text-[13px]",
												children: [
													/* @__PURE__ */ jsx(MessageSquare, {
														size: 16,
														className: "text-blue-500"
													}),
													post.comments_count || post.comments,
													" Comments"
												]
											}),
											/* @__PURE__ */ jsxs("button", {
												onClick: (e) => {
													e.stopPropagation();
													setShareData({
														url: `${window.location.origin}/r/${post.community}/comments/${post.id}`,
														title: post.title
													});
													setShareModalOpen(true);
												},
												className: "shrink-0 whitespace-nowrap flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] text-slate-600 dark:text-zinc-300 border-0 outline-none focus:outline-none focus:ring-0",
												children: [/* @__PURE__ */ jsx(Share2, {
													size: 16,
													strokeWidth: 2,
													className: "text-slate-500 dark:text-zinc-400"
												}), "Share"]
											})
										]
									})
								]
							})]
						}, post.id)) : /* @__PURE__ */ jsxs("div", {
							className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center",
							children: [
								/* @__PURE__ */ jsx(MessageSquare, {
									size: 48,
									className: "text-slate-300 dark:text-zinc-700 mb-4"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl font-bold text-slate-700 dark:text-zinc-300 mb-2",
									children: "No discussions yet"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-slate-500 dark:text-zinc-500 mb-6",
									children: "Be the first to start a conversation in our community."
								}),
								/* @__PURE__ */ jsx(Link$1, {
									href: "/submit",
									className: "px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md",
									children: "Create a Post"
								})
							]
						}), /* @__PURE__ */ jsxs(Link$1, {
							href: "/feed",
							className: "md:hidden flex w-full justify-center items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-colors group mt-2",
							children: ["View All Feed ", /* @__PURE__ */ jsx(ChevronRight, {
								size: 18,
								className: "group-hover:translate-x-1 transition-transform"
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-4 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden relative",
							children: [/* @__PURE__ */ jsx("div", { className: "h-2 w-full bg-gradient-to-r from-blue-500 to-amber-500" }), /* @__PURE__ */ jsxs("div", {
								className: "p-6",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-xl text-slate-900 dark:text-white mb-5",
									children: "Top Communities"
								}), /* @__PURE__ */ jsx("div", {
									className: "divide-y divide-slate-100 dark:divide-zinc-800",
									children: displayCommunities.length > 0 ? displayCommunities.map((community, index) => /* @__PURE__ */ jsxs(Link$1, {
										href: `/community/${community.name}`,
										className: "p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "font-bold text-slate-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors w-4",
												children: index + 1
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex-1 min-w-0",
												children: [
													/* @__PURE__ */ jsx("div", {
														className: "flex items-center justify-between mb-1",
														children: /* @__PURE__ */ jsx("h4", {
															className: "font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
															children: community.display_name || `r/${community.name}`
														})
													}),
													/* @__PURE__ */ jsx("p", {
														className: "text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 mb-1",
														children: community.description || `Welcome to the ${community.display_name || community.name} community. Join the discussion!`
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "text-xs font-bold text-slate-500 dark:text-zinc-500 flex items-center gap-2 mt-0.5",
														children: [/* @__PURE__ */ jsxs("span", {
															className: "flex items-center gap-1.5 bg-slate-100 text-slate-600 dark:bg-zinc-800/80 dark:text-zinc-300 px-2 py-0.5 rounded-md",
															children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), (() => {
																let count = community.members_count || community.members;
																let numCount = parseInt(count);
																if (!count || isNaN(numCount) || numCount < 10 || String(count).includes("+")) {
																	const fakeCounts = [
																		450,
																		1200,
																		890,
																		520,
																		2100,
																		340,
																		670,
																		410,
																		950,
																		1500,
																		800,
																		300,
																		250,
																		750,
																		1100
																	];
																	count = fakeCounts[(community.id || index) % fakeCounts.length];
																}
																const num = Number(count);
																if (isNaN(num)) return count + " members";
																if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k members";
																return num + " members";
															})()]
														}), /* @__PURE__ */ jsxs("span", {
															className: "flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-500/20",
															children: [/* @__PURE__ */ jsx(TrendingUp, { size: 12 }), " Hot"]
														})]
													})
												]
											}),
											/* @__PURE__ */ jsx("button", {
												onClick: (e) => {
													e.preventDefault();
													e.stopPropagation();
													postHomeAction(`${basePath}/community/${community.id}/join`);
												},
												className: `px-4 py-1.5 text-xs font-bold rounded-full transition-all border ${community.is_joined ? "border-transparent bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700" : "border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:border-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:hover:text-white shadow-sm"}`,
												children: community.is_joined ? "Joined" : "Join"
											})
										]
									}, community.id)) : /* @__PURE__ */ jsxs("div", {
										className: "p-8 text-center",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-sm font-bold text-slate-500 dark:text-zinc-500 mb-4",
											children: "No top communities yet"
										}), /* @__PURE__ */ jsx(Link$1, {
											href: "/communities/create",
											className: "text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors",
											children: "Create one"
										})]
									})
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "bg-slate-900 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden border border-slate-700",
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" }),
								/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-xl mb-2 relative z-10 text-white",
									children: "Have a Question?"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-slate-200 text-sm mb-5 relative z-10",
									children: "Get answers from toppers and expert faculty in Sikar."
								}),
								/* @__PURE__ */ jsx(Link$1, {
									href: `${basePath}/contact`,
									className: "btn-amber px-6 py-2.5 w-full block relative z-10 shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform text-slate-900 font-bold rounded-full",
									children: "Ask Now"
								})
							]
						})]
					})]
				})]
			})
		]
	});
};
//#endregion
export { CommunityFeedSection as default };
