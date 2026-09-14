import { t as Navbar } from "./GlobalNavbar-BeiSnBQi.js";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useState } from "react";
import { ArrowBigDown, ArrowBigUp, Bookmark, Compass, Flag, Home, Link as Link$1, MessageSquare, MoreHorizontal, Share, Trash } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
//#region resources/js/Pages/Post/Show.jsx
var ShareModal = React.lazy(() => import("./ShareModal-2YClwU5E.js"));
var ReportModal = React.lazy(() => import("./ReportModal-DnY-odkX.js").then((n) => n.n));
dayjs.extend(relativeTime);
var PostDropdown = ({ post, auth, openReportModal }) => {
	const [isOpen, setIsOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		children: [/* @__PURE__ */ jsx("div", {
			onClick: (e) => {
				e.preventDefault();
				setIsOpen(!isOpen);
			},
			className: "flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-zinc-400",
			children: /* @__PURE__ */ jsx(MoreHorizontal, { size: 20 })
		}), isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-10",
			onClick: (e) => {
				e.preventDefault();
				setIsOpen(false);
			}
		}), /* @__PURE__ */ jsxs("div", {
			className: "absolute top-full right-0 mt-1 w-48 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-lg z-20 py-1 overflow-hidden",
			children: [
				/* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						navigator.clipboard.writeText(window.location.href);
						alert("Link copied to clipboard!");
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[14px] font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Link$1, { size: 16 }), " Copy Link"]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						openReportModal(post.id, "post");
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[14px] font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Flag, { size: 16 }), " Report"]
				}),
				auth?.user?.username === post.author.username && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Link, {
					href: `/submit?edit=${post.id}`,
					className: "w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[14px] font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-2 border-t border-slate-100 dark:border-zinc-800",
					children: [/* @__PURE__ */ jsx("span", {
						className: "w-4 h-4 flex items-center justify-center border border-current rounded-sm text-xs",
						children: "E"
					}), " Edit Post"]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						if (confirm("Are you sure you want to delete this post?")) router.delete(`/posts/${post.id}`);
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-[14px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Trash, { size: 16 }), " Delete Post"]
				})] })
			]
		})] })]
	});
};
var CommentThread = ({ comment, postId, auth, userCommentVotes }) => {
	const userVote = userCommentVotes?.[comment.id] || 0;
	const [showReplyForm, setShowReplyForm] = useState(false);
	const { data, setData, post, processing, reset } = useForm({
		content: "",
		parent_id: comment.id
	});
	const submitReply = (e) => {
		e.preventDefault();
		post(route("post.comment.store", postId), { onSuccess: () => {
			setShowReplyForm(false);
			reset();
		} });
	};
	return /* @__PURE__ */ jsx("div", {
		className: "mt-5",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center group",
				children: [/* @__PURE__ */ jsx("img", {
					src: `https://ui-avatars.com/api/?name=${comment.author?.username}&background=random`,
					width: "32",
					height: "32",
					className: "w-8 h-8 rounded-full shadow-sm"
				}), /* @__PURE__ */ jsx("div", { className: "w-0.5 h-full bg-slate-200 dark:bg-zinc-800 mt-2 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors cursor-pointer rounded-full" })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 pb-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mb-1.5",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "font-bold text-[13px] text-slate-900 dark:text-white",
							children: ["u/", comment.author?.username || "deleted"]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-slate-500 dark:text-zinc-500 text-[12px]",
							children: dayjs(comment.created_at).fromNow()
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-[14px] text-slate-800 dark:text-zinc-300 mb-3 leading-relaxed",
						children: comment.content
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 -ml-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 rounded-full px-1 py-0.5",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: (e) => {
										e.preventDefault();
										router.post("/vote", {
											votable_type: "comment",
											votable_id: comment.id,
											value: 1
										}, { preserveScroll: true });
									},
									className: `flex items-center justify-center w-7 h-7 rounded-full transition-all border-0 outline-none focus:outline-none focus:ring-0 ${userVote === 1 ? "text-rose-600 bg-rose-100 dark:bg-rose-900/30" : "text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-rose-500"}`,
									children: /* @__PURE__ */ jsx(ArrowBigUp, {
										size: 18,
										className: userVote === 1 ? "fill-current" : ""
									})
								}),
								/* @__PURE__ */ jsx("span", {
									className: `text-[12px] font-extrabold px-1 ${userVote === 1 ? "text-rose-600" : userVote === -1 ? "text-blue-600" : "text-slate-700 dark:text-zinc-300"}`,
									children: comment.score
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: (e) => {
										e.preventDefault();
										router.post("/vote", {
											votable_type: "comment",
											votable_id: comment.id,
											value: -1
										}, { preserveScroll: true });
									},
									className: `flex items-center justify-center w-7 h-7 rounded-full transition-all border-0 outline-none focus:outline-none focus:ring-0 ${userVote === -1 ? "text-blue-600 bg-blue-100 dark:bg-blue-900/30" : "text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-blue-500"}`,
									children: /* @__PURE__ */ jsx(ArrowBigDown, {
										size: 18,
										className: userVote === -1 ? "fill-current" : ""
									})
								})
							]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: () => setShowReplyForm(!showReplyForm),
							className: "flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:bg-zinc-800 rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0 text-slate-500 dark:text-zinc-400",
							children: [/* @__PURE__ */ jsx(MessageSquare, { size: 16 }), /* @__PURE__ */ jsx("span", {
								className: "text-[12px] font-bold",
								children: "Reply"
							})]
						})]
					}),
					showReplyForm && auth?.user && /* @__PURE__ */ jsx("div", {
						className: "mt-3 mb-4 pr-4",
						children: /* @__PURE__ */ jsxs("form", {
							onSubmit: submitReply,
							children: [/* @__PURE__ */ jsx("textarea", {
								value: data.content,
								onChange: (e) => setData("content", e.target.value),
								placeholder: "What are your thoughts?",
								className: "w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-3 px-4 text-[14px] text-slate-900 dark:text-white outline-none transition-colors min-h-[100px] hover:border-blue-400"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex justify-end gap-2 mt-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowReplyForm(false),
									className: "px-5 py-2 font-bold text-[14px] bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0",
									children: "Cancel"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: processing || !data.content,
									className: "px-5 py-2 font-bold text-[14px] bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 border-0 outline-none focus:outline-none focus:ring-0 shadow-md shadow-rose-600/20",
									children: "Reply"
								})]
							})]
						})
					}),
					comment.replies && comment.replies.length > 0 && /* @__PURE__ */ jsx("div", {
						className: "pl-4",
						children: comment.replies.map((reply) => /* @__PURE__ */ jsx(CommentThread, {
							comment: reply,
							postId,
							auth,
							userCommentVotes
						}, reply.id))
					})
				]
			})]
		})
	});
};
function ShowPost({ auth, community, post, comments, userCommentVotes }) {
	const { data, setData, post: submitForm, processing, reset } = useForm({
		content: "",
		parent_id: null
	});
	const [showShareModal, setShowShareModal] = useState(false);
	const [reportModalData, setReportModalData] = useState({
		isOpen: false,
		id: null,
		type: null
	});
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const openReportModal = (id, type) => {
		if (!auth?.user) {
			router.visit("/login");
			return;
		}
		setReportModalData({
			isOpen: true,
			id,
			type
		});
	};
	const plainTextContent = post.excerpt || (post.content ? post.content.replace(/<[^>]*>?/gm, "").substring(0, 160) : `Read this post by u/${post.author.username} in r/${community.name}.`);
	const pageTitle = `${post.title} - r/${community.name} - coachinginsikar`;
	const currentUrl = typeof window !== "undefined" ? window.location.href : `https://coachingsinsikar.com/r/${community.name}/comments/${post.id}/${post.slug || ""}`;
	const submitComment = (e) => {
		e.preventDefault();
		submitForm(route("post.comment.store", post.id), { onSuccess: () => reset() });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans transition-colors selection:bg-blue-500/30",
		children: [
			/* @__PURE__ */ jsxs(Head, {
				title: pageTitle,
				children: [
					/* @__PURE__ */ jsx("meta", {
						name: "description",
						content: plainTextContent
					}),
					/* @__PURE__ */ jsx("link", {
						rel: "canonical",
						href: currentUrl
					}),
					/* @__PURE__ */ jsx("meta", {
						property: "og:title",
						content: pageTitle
					}),
					/* @__PURE__ */ jsx("meta", {
						property: "og:description",
						content: plainTextContent
					}),
					/* @__PURE__ */ jsx("meta", {
						property: "og:type",
						content: "article"
					}),
					post.media_urls?.[0] && /* @__PURE__ */ jsx("meta", {
						property: "og:image",
						content: post.media_urls[0]
					}),
					/* @__PURE__ */ jsx("meta", {
						name: "twitter:card",
						content: "summary_large_image"
					}),
					/* @__PURE__ */ jsx("meta", {
						name: "twitter:title",
						content: pageTitle
					}),
					/* @__PURE__ */ jsx("meta", {
						name: "twitter:description",
						content: plainTextContent
					}),
					post.media_urls?.[0] && /* @__PURE__ */ jsx("meta", {
						name: "twitter:image",
						content: post.media_urls[0]
					})
				]
			}),
			/* @__PURE__ */ jsx(Navbar, { auth }),
			/* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: showShareModal && /* @__PURE__ */ jsx(ShareModal, {
					isOpen: showShareModal,
					onClose: () => setShowShareModal(false),
					url: currentUrl,
					title: post.title
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-[1400px] w-full mx-auto pt-24 md:pt-32 px-4 sm:px-6 flex gap-6",
				children: [
					isMobileSidebarOpen && /* @__PURE__ */ jsx("div", {
						className: "fixed inset-0 bg-black/50 z-40 lg:hidden",
						onClick: () => setIsMobileSidebarOpen(false)
					}),
					/* @__PURE__ */ jsxs("div", {
						className: `fixed inset-y-0 left-0 transform ${isMobileSidebarOpen ? "translate-x-0 z-[60] shadow-2xl opacity-100 visible" : "-translate-x-full z-0 shadow-none opacity-0 invisible lg:opacity-100 lg:visible"} lg:relative lg:translate-x-0 lg:z-10 lg:block flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? "w-64 lg:w-20" : "w-64"} bg-white dark:bg-zinc-950 lg:bg-transparent lg:shadow-none pt-0 h-[100dvh] lg:h-auto flex flex-col`,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-4 lg:hidden border-b border-slate-100 dark:border-zinc-800",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-bold text-slate-800 dark:text-white",
								children: "Menu"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setIsMobileSidebarOpen(false),
								className: "p-2 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-500",
								children: /* @__PURE__ */ jsx("svg", {
									className: "w-5 h-5",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 2,
										d: "M6 18L18 6M6 6l12 12"
									})
								})
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 overflow-y-auto lg:overflow-visible p-4 lg:p-0 lg:sticky lg:top-28 space-y-1",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setIsSidebarCollapsed(!isSidebarCollapsed),
									className: "hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 mb-4 transition-colors shadow-sm ml-auto",
									children: /* @__PURE__ */ jsx("svg", {
										className: `w-4 h-4 transition-transform duration-300 ${isSidebarCollapsed ? "rotate-180" : ""}`,
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: 2,
											d: "M11 19l-7-7 7-7m8 14l-7-7 7-7"
										})
									})
								}),
								/* @__PURE__ */ jsxs(Link, {
									href: "/feed?filter=home",
									className: `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-zinc-800`,
									children: [/* @__PURE__ */ jsx(Home, {
										size: 20,
										strokeWidth: 2,
										className: "text-slate-400 dark:text-zinc-500 flex-shrink-0"
									}), /* @__PURE__ */ jsx("span", {
										className: isSidebarCollapsed ? "lg:hidden" : "",
										children: "Home"
									})]
								}),
								/* @__PURE__ */ jsxs(Link, {
									href: "/feed?filter=popular",
									className: `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-slate-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-200 dark:hover:border-zinc-800`,
									children: [/* @__PURE__ */ jsx(Compass, {
										size: 20,
										strokeWidth: 2,
										className: "text-slate-400 dark:text-zinc-500 flex-shrink-0"
									}), /* @__PURE__ */ jsx("span", {
										className: isSidebarCollapsed ? "lg:hidden" : "",
										children: "Popular"
									})]
								}),
								auth?.joined_communities && auth.joined_communities.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800",
									children: [/* @__PURE__ */ jsx("p", {
										className: `text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-4 ${isSidebarCollapsed ? "lg:hidden" : ""}`,
										children: "Your Communities"
									}), auth.joined_communities.map((c) => /* @__PURE__ */ jsxs(Link, {
										href: `/community/${c.name}`,
										className: `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all border border-transparent ${community.id === c.id ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm border-slate-200 dark:border-zinc-800 font-bold" : "text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm hover:text-slate-900 dark:hover:text-white hover:border-slate-200 dark:hover:border-zinc-800"}`,
										children: [c.icon_image ? /* @__PURE__ */ jsx("img", {
											loading: "lazy",
											decoding: "async",
											fetchPriority: "low",
											src: c.icon_image,
											width: "28",
											height: "28",
											className: "w-7 h-7 rounded-lg object-cover shadow-sm border border-slate-100 dark:border-zinc-700 flex-shrink-0"
										}) : /* @__PURE__ */ jsx("div", {
											className: "w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs shadow-sm border border-blue-200 dark:border-blue-800/50 flex-shrink-0",
											children: c.name.charAt(0).toUpperCase()
										}), /* @__PURE__ */ jsxs("span", {
											className: `truncate text-sm ${isSidebarCollapsed ? "lg:hidden" : ""}`,
											children: ["r/", c.name]
										})]
									}, c.id))]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 max-w-3xl pb-24 min-w-0",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-3 lg:hidden mb-4",
							children: /* @__PURE__ */ jsx("button", {
								onClick: () => setIsMobileSidebarOpen(true),
								className: "flex items-center justify-center w-10 h-10 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full shadow-sm text-slate-700 dark:text-zinc-300 hover:text-blue-600 transition-colors",
								children: /* @__PURE__ */ jsx("svg", {
									className: "w-5 h-5",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 2,
										d: "M4 6h16M4 12h16M4 18h7"
									})
								})
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex pr-4 sm:pr-6 pt-6",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "w-12 sm:w-16 bg-white dark:bg-zinc-900 rounded-tl-3xl flex flex-col items-center pt-2 gap-1.5 flex-shrink-0",
									children: [
										/* @__PURE__ */ jsx("button", {
											onClick: (e) => {
												e.preventDefault();
												router.post("/vote", {
													votable_type: "post",
													votable_id: post.id,
													value: 1
												}, { preserveScroll: true });
											},
											className: `flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all border-0 outline-none focus:outline-none focus:ring-0 ${post.user_vote === 1 ? "text-rose-600 bg-rose-50 dark:bg-rose-900/20" : "text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-zinc-800"}`,
											children: /* @__PURE__ */ jsx(ArrowBigUp, {
												size: 24,
												className: post.user_vote === 1 ? "fill-current" : ""
											})
										}),
										/* @__PURE__ */ jsx("span", {
											className: `text-[13px] font-black ${post.user_vote === 1 ? "text-rose-600" : post.user_vote === -1 ? "text-blue-600" : "text-slate-700 dark:text-zinc-300"}`,
											children: post.score
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: (e) => {
												e.preventDefault();
												router.post("/vote", {
													votable_type: "post",
													votable_id: post.id,
													value: -1
												}, { preserveScroll: true });
											},
											className: `flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all border-0 outline-none focus:outline-none focus:ring-0 ${post.user_vote === -1 ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-zinc-800"}`,
											children: /* @__PURE__ */ jsx(ArrowBigDown, {
												size: 24,
												className: post.user_vote === -1 ? "fill-current" : ""
											})
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1 pt-1 pb-4",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center flex-wrap gap-2 text-[12px] sm:text-[13px] mb-3",
											children: [
												community.icon_image ? /* @__PURE__ */ jsx("img", {
													src: community.icon_image,
													width: "24",
													height: "24",
													className: "w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-sm"
												}) : /* @__PURE__ */ jsx("div", {
													className: "w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-sm flex items-center justify-center text-[10px] text-white font-bold",
													children: community.display_name.charAt(0)
												}),
												/* @__PURE__ */ jsxs(Link, {
													href: `/community/${community.name}`,
													className: "font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
													children: ["r/", community.display_name]
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-slate-400 dark:text-zinc-500 hidden sm:inline",
													children: "•"
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "text-slate-500 dark:text-zinc-400 w-full sm:w-auto",
													children: ["Posted by ", /* @__PURE__ */ jsxs("span", {
														className: "font-medium text-slate-700 dark:text-zinc-300",
														children: ["u/", post.author.username]
													})]
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-slate-400 dark:text-zinc-500",
													children: dayjs(post.created_at).fromNow()
												})
											]
										}),
										/* @__PURE__ */ jsx("h1", {
											className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight",
											children: post.title
										}),
										post.type === "TEXT" && post.content && /* @__PURE__ */ jsx("div", {
											className: "text-[14px] sm:text-[15px] text-slate-800 dark:text-zinc-300 mb-6 leading-relaxed whitespace-pre-wrap prose prose-slate dark:prose-invert max-w-none prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-sm prose-img:my-6",
											dangerouslySetInnerHTML: { __html: post.content }
										}),
										post.type === "LINK" && post.link_url && /* @__PURE__ */ jsx("a", {
											href: post.link_url,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "block mb-6 p-4 border border-slate-200 dark:border-zinc-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-slate-50 dark:bg-zinc-800/50 group",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-4",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0",
													children: /* @__PURE__ */ jsx(Link$1, { size: 20 })
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex-1 overflow-hidden",
													children: [/* @__PURE__ */ jsx("div", {
														className: "text-[14px] sm:text-[15px] font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
														children: post.link_url
													}), /* @__PURE__ */ jsx("div", {
														className: "text-[12px] sm:text-[13px] text-slate-500 dark:text-zinc-400 mt-0.5",
														children: "Click to open link"
													})]
												})]
											})
										}),
										(post.type === "IMAGE" || post.type === "VIDEO") && post.media_urls && post.media_urls.length > 0 && /* @__PURE__ */ jsx("div", {
											className: "mb-6 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-950 flex items-center justify-center max-h-[600px] border border-slate-200 dark:border-zinc-800",
											children: post.type === "VIDEO" ? /* @__PURE__ */ jsx("video", {
												src: post.media_urls[0],
												controls: true,
												className: "max-w-full max-h-[600px]"
											}) : /* @__PURE__ */ jsx("img", {
												src: post.media_urls[0],
												alt: "Post media",
												className: "max-w-full max-h-[600px] object-contain"
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-zinc-400",
													children: [/* @__PURE__ */ jsx(MessageSquare, {
														size: 18,
														className: "sm:w-5 sm:h-5"
													}), /* @__PURE__ */ jsxs("span", {
														className: "text-[12px] sm:text-[13px] font-bold",
														children: [post.comments_count, " Comments"]
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													onClick: () => setShowShareModal(true),
													className: "flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer text-slate-500 dark:text-zinc-400",
													children: [/* @__PURE__ */ jsx(Share, {
														size: 18,
														className: "sm:w-5 sm:h-5"
													}), /* @__PURE__ */ jsx("span", {
														className: "text-[12px] sm:text-[13px] font-bold",
														children: "Share"
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													onClick: () => router.post(`/posts/${post.id}/save`, {}, { preserveScroll: true }),
													className: `flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-colors cursor-pointer ${post.is_saved ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"}`,
													children: [/* @__PURE__ */ jsx(Bookmark, {
														size: 18,
														className: `sm:w-5 sm:h-5 ${post.is_saved ? "fill-current" : ""}`
													}), /* @__PURE__ */ jsx("span", {
														className: "text-[12px] sm:text-[13px] font-bold",
														children: post.is_saved ? "Saved" : "Save"
													})]
												}),
												/* @__PURE__ */ jsx(PostDropdown, {
													post,
													auth,
													openReportModal
												})
											]
										})
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "px-4 sm:px-10 pb-10 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800",
								children: [auth?.user ? /* @__PURE__ */ jsxs("div", {
									className: "mb-8 pt-8",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "text-[13px] mb-2 font-medium text-slate-700 dark:text-zinc-300",
										children: ["Comment as ", /* @__PURE__ */ jsx("span", {
											className: "text-blue-600 dark:text-blue-400",
											children: auth.user.username || auth.user.name
										})]
									}), /* @__PURE__ */ jsxs("form", {
										onSubmit: submitComment,
										children: [/* @__PURE__ */ jsx("textarea", {
											value: data.content,
											onChange: (e) => setData("content", e.target.value),
											placeholder: "What are your thoughts?",
											className: "w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 px-5 text-[15px] text-slate-900 dark:text-white outline-none transition-all min-h-[140px] hover:border-blue-400"
										}), /* @__PURE__ */ jsx("div", {
											className: "flex justify-end mt-3",
											children: /* @__PURE__ */ jsx("button", {
												type: "submit",
												disabled: processing || !data.content,
												className: "px-8 py-2.5 font-bold text-[14px] bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 border-0 outline-none focus:outline-none focus:ring-0 shadow-lg shadow-rose-600/20",
												children: "Comment"
											})
										})]
									})]
								}) : /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row items-center justify-between border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl p-6 mt-8 mb-8 shadow-sm gap-4",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "text-slate-900 dark:text-white font-bold text-lg text-center sm:text-left",
										children: "Log in or sign up to leave a comment"
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex gap-3 w-full sm:w-auto",
										children: [/* @__PURE__ */ jsx(Link, {
											href: "/login",
											className: "flex-1 sm:flex-none text-center px-6 py-2 font-bold text-[14px] text-slate-700 dark:text-white bg-slate-100 dark:bg-zinc-800 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors",
											children: "Log In"
										}), /* @__PURE__ */ jsx(Link, {
											href: "/register",
											className: "flex-1 sm:flex-none text-center px-6 py-2 font-bold text-[14px] text-white bg-rose-600 rounded-full hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20",
											children: "Sign Up"
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "pt-2",
									children: [/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider",
										children: "Discussions"
									}), comments.length > 0 ? comments.map((comment) => /* @__PURE__ */ jsx(CommentThread, {
										comment,
										postId: post.id,
										auth,
										userCommentVotes
									}, comment.id)) : /* @__PURE__ */ jsxs("div", {
										className: "text-center py-16",
										children: [
											/* @__PURE__ */ jsx(MessageSquare, {
												size: 48,
												className: "mx-auto text-slate-300 dark:text-zinc-700 mb-4"
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-lg font-bold text-slate-900 dark:text-white mb-2",
												children: "No Comments Yet"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-500 dark:text-zinc-400",
												children: "Be the first to share what you think!"
											})
										]
									})]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "hidden lg:block w-[320px] flex-shrink-0",
						children: /* @__PURE__ */ jsxs("div", {
							className: "bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5 sticky top-28",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 mb-4",
									children: [community.icon_image ? /* @__PURE__ */ jsx("img", {
										src: community.icon_image,
										width: "40",
										height: "40",
										className: "w-10 h-10 rounded-full shadow-sm"
									}) : /* @__PURE__ */ jsx("div", {
										className: "w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm flex items-center justify-center",
										children: /* @__PURE__ */ jsx("span", {
											className: "text-white font-bold text-lg",
											children: "r/"
										})
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
										className: "font-bold text-[16px] text-slate-900 dark:text-white leading-tight",
										children: ["r/", community.display_name]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs text-slate-500 dark:text-zinc-400",
										children: "Community"
									})] })]
								}),
								community.description && /* @__PURE__ */ jsx("p", {
									className: "text-[14px] text-slate-700 dark:text-zinc-300 mb-6 leading-relaxed",
									children: community.description
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-6 text-[14px] font-medium border-t border-slate-200 dark:border-zinc-800 pt-4 mb-6",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "text-lg font-black text-slate-900 dark:text-white",
										children: "1"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-slate-500 dark:text-zinc-400 text-[12px] uppercase tracking-wider font-bold",
										children: "Members"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" }), "1"]
									}), /* @__PURE__ */ jsx("div", {
										className: "text-slate-500 dark:text-zinc-400 text-[12px] uppercase tracking-wider font-bold",
										children: "Online"
									})] })]
								}),
								/* @__PURE__ */ jsx(Link, {
									href: "/submit",
									className: "flex items-center justify-center w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-full text-[15px] transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-rose-600/20 border-0 outline-none focus:outline-none focus:ring-0",
									children: "Create Post"
								})
							]
						})
					})
				]
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
export { ShowPost as default };
