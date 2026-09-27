import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { t as Navbar } from "./GlobalNavbar-RO4UzKYw.js";
import { t as BlogFooter } from "./BlogFooter-CC-GFETm.js";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
//#region resources/js/Pages/Blog/Show.jsx
dayjs.extend(relativeTime);
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
function Show({ post, recentPosts, meta, comments = [], userCommentVotes = {} }) {
	const { auth } = usePage().props;
	const { data, setData, post: submitForm, processing, reset } = useForm({
		content: "",
		parent_id: null
	});
	const submitComment = (e) => {
		e.preventDefault();
		submitForm(route("post.comment.store", post.id), { onSuccess: () => reset() });
	};
	const contentRef = useRef(null);
	const [toc, setToc] = useState([]);
	let seoRating = null;
	if (post?.seoRating || post?.seo_rating) try {
		const raw = post.seoRating || post.seo_rating;
		seoRating = typeof raw === "string" ? JSON.parse(raw) : raw;
	} catch (e) {}
	useEffect(() => {
		if (!contentRef.current) return;
		contentRef.current.querySelectorAll("img").forEach((img) => {
			if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
		});
		const headings = contentRef.current.querySelectorAll("h2");
		const tocItems = [];
		headings.forEach((heading, index) => {
			const id = `toc-heading-${index}`;
			heading.id = id;
			tocItems.push({
				id,
				text: heading.innerText
			});
		});
		setToc(tocItems);
	}, [post]);
	if (!post) return /* @__PURE__ */ jsx("div", { children: "Post not found" });
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	};
	const finalCanonicalUrl = post.canonicalUrl || `https://coachingsinsikar.com/blog/${post.slug}`;
	const displayAuthor = post.author?.toLowerCase() === "prasant" ? "Prashant" : post.author;
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white transition-colors duration-300",
		children: [
			/* @__PURE__ */ jsx(SeoMeta, { meta }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto w-full px-[15px] pb-8",
				style: { paddingTop: "100px" },
				children: [/* @__PURE__ */ jsx("main", {
					className: "w-full lg:w-[70%]",
					children: /* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsxs("header", {
							className: "mb-8",
							children: [
								post.category && /* @__PURE__ */ jsx(Link, {
									href: `${window.BASE_PATH}/category/${post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
									className: "text-blue-600 font-bold uppercase tracking-widest text-sm mb-3 block hover:underline",
									children: post.category
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white",
									children: post.title
								}),
								post.isSponsored && /* @__PURE__ */ jsx("div", {
									className: "inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-full mb-6",
									children: "Sponsored Content"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-row items-center justify-between gap-2 sm:gap-4 mb-8 p-3 sm:p-4 border border-black dark:border-white rounded-lg bg-white dark:bg-zinc-900",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 sm:gap-4 text-gray-600 min-w-0",
										children: [post.authorImage && /* @__PURE__ */ jsx("img", {
											loading: "lazy",
											decoding: "async",
											fetchPriority: "low",
											src: post.authorImage.startsWith("http") || post.authorImage.startsWith("/") ? post.authorImage : "/" + post.authorImage,
											alt: displayAuthor,
											width: "48",
											height: "48",
											className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
										}), /* @__PURE__ */ jsxs("div", {
											className: "truncate",
											children: [
												/* @__PURE__ */ jsx(Link, {
													href: window.BASE_PATH + "/author/" + (displayAuthor ? displayAuthor.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""),
													className: "font-semibold text-base sm:text-lg text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline truncate block",
													children: displayAuthor
												}),
												post.authorJobTitle && /* @__PURE__ */ jsx("p", {
													className: "text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400 truncate",
													children: post.authorJobTitle
												}),
												post.authorAwards && post.authorAwards.length > 0 && /* @__PURE__ */ jsxs("p", {
													className: "text-[10px] sm:text-xs font-semibold text-amber-600 dark:text-amber-500 mt-0.5 flex items-center gap-1 truncate",
													children: [/* @__PURE__ */ jsxs("svg", {
														xmlns: "http://www.w3.org/2000/svg",
														width: "12",
														height: "12",
														viewBox: "0 0 24 24",
														fill: "none",
														stroke: "currentColor",
														strokeWidth: "2",
														strokeLinecap: "round",
														strokeLinejoin: "round",
														className: "shrink-0",
														children: [/* @__PURE__ */ jsx("circle", {
															cx: "12",
															cy: "8",
															r: "6"
														}), /* @__PURE__ */ jsx("path", { d: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" })]
													}), /* @__PURE__ */ jsxs("span", {
														className: "truncate",
														children: [
															post.authorAwards[0],
															" ",
															post.authorAwards.length > 1 ? `+${post.authorAwards.length - 1}` : ""
														]
													})]
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-[10px] sm:text-xs text-slate-600 dark:text-zinc-500 mt-0.5 sm:mt-1",
													children: formatDate(post.date)
												})
											]
										})]
									}), /* @__PURE__ */ jsxs("a", {
										href: "https://google.com/preferences/source?q=coachingsinsikar.com",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "shrink-0 inline-flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 text-[11px] sm:text-[15px] font-medium rounded border border-gray-300 dark:border-gray-700 shadow-sm transition-colors",
										children: [
											/* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "16",
												height: "16",
												viewBox: "0 0 24 24",
												className: "w-4 h-4 sm:w-[18px] sm:h-[18px]",
												children: [
													/* @__PURE__ */ jsx("path", {
														fill: "#4285F4",
														d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
													}),
													/* @__PURE__ */ jsx("path", {
														fill: "#34A853",
														d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
													}),
													/* @__PURE__ */ jsx("path", {
														fill: "#FBBC05",
														d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
													}),
													/* @__PURE__ */ jsx("path", {
														fill: "#EA4335",
														d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
													})
												]
											}),
											/* @__PURE__ */ jsx("span", {
												className: "hidden sm:inline",
												children: "Make us preferred source on Google"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "inline sm:hidden",
												children: "Follow"
											})
										]
									})]
								}),
								post.factCheckedBy && /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-lg text-emerald-800 dark:text-emerald-400 text-sm",
									children: [/* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide lucide-check-circle-2 text-emerald-600 dark:text-emerald-500",
										children: [/* @__PURE__ */ jsx("circle", {
											cx: "12",
											cy: "12",
											r: "10"
										}), /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })]
									}), /* @__PURE__ */ jsxs("span", { children: [
										"Fact-checked by ",
										/* @__PURE__ */ jsx("strong", { children: post.factCheckedBy }),
										" ",
										post.factCheckerRole ? `(${post.factCheckerRole})` : ""
									] })]
								}),
								seoRating && seoRating.ratingValue && /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-lg text-amber-800 dark:text-amber-400 text-sm w-fit",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "flex text-amber-500",
											children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("svg", {
												className: `w-4 h-4 ${i < Math.round(Number(seoRating.ratingValue)) ? "fill-current" : "text-amber-200 dark:text-amber-800/50 fill-current"}`,
												xmlns: "http://www.w3.org/2000/svg",
												viewBox: "0 0 24 24",
												children: /* @__PURE__ */ jsx("path", { d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" })
											}, i))
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "font-semibold text-slate-800 dark:text-amber-300",
											children: [parseFloat(seoRating.ratingValue).toFixed(1), "/5 Rating"]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-amber-600 dark:text-amber-500/80",
											children: [
												"(",
												seoRating.reviewCount,
												" reviews)"
											]
										})
									]
								}),
								post.coverImage && /* @__PURE__ */ jsx("div", {
									className: "relative w-full max-w-[800px] mx-auto rounded-xl overflow-hidden mb-8 shadow-lg",
									style: { aspectRatio: "1080/630" },
									children: /* @__PURE__ */ jsx(Image$1, {
										src: post.coverImage,
										alt: post.title,
										fill: true,
										style: { objectFit: "cover" },
										priority: true
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-3 mb-8 border-y border-slate-100 dark:border-zinc-800 py-4",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-700 dark:text-zinc-300 mr-2",
									children: "Share this article:"
								}),
								/* @__PURE__ */ jsxs("a", {
									href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(finalCanonicalUrl)}&text=${encodeURIComponent(meta?.title || post.title)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-full text-sm font-medium transition-colors",
									children: [/* @__PURE__ */ jsx("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: /* @__PURE__ */ jsx("path", { d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" })
									}), "Twitter"]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(finalCanonicalUrl)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full text-sm font-medium transition-colors",
									children: [/* @__PURE__ */ jsx("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
									}), "Facebook"]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(finalCanonicalUrl)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 rounded-full text-sm font-medium transition-colors",
									children: [/* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: [
											/* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }),
											/* @__PURE__ */ jsx("rect", {
												width: "4",
												height: "12",
												x: "2",
												y: "9"
											}),
											/* @__PURE__ */ jsx("circle", {
												cx: "4",
												cy: "4",
												r: "2"
											})
										]
									}), "LinkedIn"]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: `https://api.whatsapp.com/send?text=${encodeURIComponent((meta?.title || post.title) + " " + finalCanonicalUrl)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 rounded-full text-sm font-medium transition-colors",
									children: [/* @__PURE__ */ jsx("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: /* @__PURE__ */ jsx("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" })
									}), "WhatsApp"]
								})
							]
						}),
						toc.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 mb-8 max-w-md",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-xl font-bold mb-4 text-slate-800 dark:text-white",
								children: "Table of Contents"
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-2 text-blue-600",
								children: toc.map((item) => /* @__PURE__ */ jsx("li", {
									className: "font-medium text-sm",
									children: /* @__PURE__ */ jsx("a", {
										href: `#${item.id}`,
										className: "hover:underline",
										children: item.text
									})
								}, item.id))
							})]
						}),
						post.keyTakeaways && post.keyTakeaways.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10 shadow-sm",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-xl font-bold mb-4 text-amber-900 flex items-center gap-2",
								children: [/* @__PURE__ */ jsxs("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "20",
									height: "20",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [/* @__PURE__ */ jsx("path", { d: "M12 2v20" }), /* @__PURE__ */ jsx("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })]
								}), "Key Takeaways"]
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-3",
								children: post.keyTakeaways.map((takeaway, index) => /* @__PURE__ */ jsxs("li", {
									className: "flex gap-3 text-amber-800",
									children: [/* @__PURE__ */ jsx("div", { className: "mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" }), /* @__PURE__ */ jsx("span", { children: takeaway })]
								}, index))
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							ref: contentRef,
							className: "prose prose-lg dark:prose-invert max-w-none prose-blue dark:[&_p]:!text-zinc-300 dark:[&_span]:!text-zinc-300 dark:[&_li]:!text-zinc-300 dark:[&_h1]:!text-zinc-100 dark:[&_h2]:!text-zinc-100 dark:[&_h3]:!text-zinc-100 dark:[&_h4]:!text-zinc-100 dark:[&_strong]:!text-zinc-200 dark:[&_a]:!text-blue-400",
							dangerouslySetInnerHTML: { __html: post.content }
						}),
						post.sources && post.sources.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-lg font-bold text-slate-800 dark:text-white mb-4",
								children: "Sources & References"
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-2 text-sm text-slate-600 dark:text-zinc-400",
								children: post.sources.map((source, idx) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsxs("span", {
									className: "mr-2 text-slate-500 dark:text-zinc-500",
									children: [
										"[",
										idx + 1,
										"]"
									]
								}), source.url ? /* @__PURE__ */ jsx("a", {
									href: source.url,
									target: "_blank",
									rel: "nofollow noreferrer",
									className: "hover:text-blue-600 dark:hover:text-blue-400 hover:underline",
									children: source.title || source.url
								}) : /* @__PURE__ */ jsx("span", { children: source.title })] }, idx))
							})]
						}),
						post.corrections && post.corrections.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-md font-bold text-slate-700 mb-3",
								children: "Corrections & Updates"
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-3 text-sm text-slate-600",
								children: post.corrections.map((corr, idx) => /* @__PURE__ */ jsxs("li", {
									className: "flex flex-col sm:flex-row gap-2",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "font-semibold text-slate-800 shrink-0",
										children: [formatDate(corr.date), ":"]
									}), /* @__PURE__ */ jsx("span", { children: corr.note })]
								}, idx))
							})]
						}),
						post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "mt-8 flex flex-wrap gap-2",
							children: post.tags.map((tag, idx) => /* @__PURE__ */ jsxs(Link, {
								href: `${window.BASE_PATH}/category/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
								className: "px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-colors",
								children: ["#", tag]
							}, idx))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row gap-6 items-start",
								children: [post.authorImage && /* @__PURE__ */ jsx("img", {
									loading: "lazy",
									decoding: "async",
									fetchPriority: "low",
									src: post.authorImage.startsWith("http") || post.authorImage.startsWith("/") ? post.authorImage : "/" + post.authorImage,
									alt: displayAuthor,
									width: "96",
									height: "96",
									className: "w-24 h-24 rounded-full object-cover shrink-0 ring-4 ring-slate-50"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ jsx("h3", {
											className: "text-xl font-bold text-slate-800 dark:text-white mb-1",
											children: displayAuthor
										}),
										post.authorJobTitle && /* @__PURE__ */ jsx("p", {
											className: "text-blue-600 font-medium text-sm mb-3",
											children: post.authorJobTitle
										}),
										post.authorBio && /* @__PURE__ */ jsx("p", {
											className: "text-slate-600 dark:text-zinc-400 leading-relaxed text-sm mb-4",
											children: post.authorBio
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50",
											children: [
												post.authorExperienceYears > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													className: "block text-xs font-bold text-slate-600 dark:text-zinc-500 uppercase tracking-wider mb-1",
													children: "Experience"
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-sm font-semibold text-slate-700 dark:text-zinc-300",
													children: [post.authorExperienceYears, "+ Years"]
												})] }),
												post.authorAwards && post.authorAwards.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													className: "block text-xs font-bold text-slate-600 dark:text-zinc-500 uppercase tracking-wider mb-1",
													children: "Awards"
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-500",
													children: [
														/* @__PURE__ */ jsxs("svg", {
															xmlns: "http://www.w3.org/2000/svg",
															width: "14",
															height: "14",
															viewBox: "0 0 24 24",
															fill: "none",
															stroke: "currentColor",
															strokeWidth: "2",
															strokeLinecap: "round",
															strokeLinejoin: "round",
															children: [/* @__PURE__ */ jsx("circle", {
																cx: "12",
																cy: "8",
																r: "6"
															}), /* @__PURE__ */ jsx("path", { d: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" })]
														}),
														post.authorAwards[0],
														" ",
														post.authorAwards.length > 1 ? `+${post.authorAwards.length - 1}` : ""
													]
												})] }),
												post.authorAlumniOf && post.authorAlumniOf.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													className: "block text-xs font-bold text-slate-600 dark:text-zinc-500 uppercase tracking-wider mb-1",
													children: "Alumni"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-sm font-semibold text-slate-700 dark:text-zinc-300",
													children: post.authorAlumniOf[0].name
												})] })
											]
										}),
										post.authorSocials && (post.authorSocials.twitter || post.authorSocials.linkedin || post.authorSocials.website) && /* @__PURE__ */ jsxs("div", {
											className: "flex gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50",
											children: [
												post.authorSocials.twitter && /* @__PURE__ */ jsx("a", {
													href: post.authorSocials.twitter,
													target: "_blank",
													rel: "nofollow noreferrer",
													className: "p-2 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-full transition-colors",
													children: /* @__PURE__ */ jsx("svg", {
														xmlns: "http://www.w3.org/2000/svg",
														width: "16",
														height: "16",
														viewBox: "0 0 24 24",
														fill: "none",
														stroke: "currentColor",
														strokeWidth: "2",
														strokeLinecap: "round",
														strokeLinejoin: "round",
														children: /* @__PURE__ */ jsx("path", { d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" })
													})
												}),
												post.authorSocials.linkedin && /* @__PURE__ */ jsx("a", {
													href: post.authorSocials.linkedin,
													target: "_blank",
													rel: "nofollow noreferrer",
													className: "p-2 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-full transition-colors",
													children: /* @__PURE__ */ jsxs("svg", {
														xmlns: "http://www.w3.org/2000/svg",
														width: "16",
														height: "16",
														viewBox: "0 0 24 24",
														fill: "none",
														stroke: "currentColor",
														strokeWidth: "2",
														strokeLinecap: "round",
														strokeLinejoin: "round",
														children: [
															/* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }),
															/* @__PURE__ */ jsx("rect", {
																width: "4",
																height: "12",
																x: "2",
																y: "9"
															}),
															/* @__PURE__ */ jsx("circle", {
																cx: "4",
																cy: "4",
																r: "2"
															})
														]
													})
												}),
												post.authorSocials.website && /* @__PURE__ */ jsx("a", {
													href: post.authorSocials.website,
													target: "_blank",
													rel: "nofollow noreferrer",
													className: "p-2 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-500 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-full transition-colors",
													children: /* @__PURE__ */ jsxs("svg", {
														xmlns: "http://www.w3.org/2000/svg",
														width: "16",
														height: "16",
														viewBox: "0 0 24 24",
														fill: "none",
														stroke: "currentColor",
														strokeWidth: "2",
														strokeLinecap: "round",
														strokeLinejoin: "round",
														children: [
															/* @__PURE__ */ jsx("circle", {
																cx: "12",
																cy: "12",
																r: "10"
															}),
															/* @__PURE__ */ jsx("line", {
																x1: "2",
																x2: "22",
																y1: "12",
																y2: "12"
															}),
															/* @__PURE__ */ jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
														]
													})
												})
											]
										})
									]
								})]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-8 shadow-sm",
							children: [
								/* @__PURE__ */ jsxs("h3", {
									className: "text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx(MessageSquare, {
											size: 20,
											className: "text-blue-600 dark:text-blue-400"
										}),
										"Discussions (",
										comments.length,
										")"
									]
								}),
								auth?.user ? /* @__PURE__ */ jsxs("div", {
									className: "mb-8",
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
											className: "w-full bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 px-5 text-[15px] text-slate-900 dark:text-white outline-none transition-all min-h-[140px] hover:border-blue-400"
										}), /* @__PURE__ */ jsx("div", {
											className: "flex justify-end mt-3",
											children: /* @__PURE__ */ jsx("button", {
												type: "submit",
												disabled: processing || !data.content,
												className: "px-8 py-2.5 font-bold text-[14px] bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 border-0 outline-none focus:outline-none focus:ring-0 shadow-lg shadow-blue-600/20",
												children: "Comment"
											})
										})]
									})]
								}) : /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row items-center justify-between border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-6 mt-2 mb-8 shadow-sm gap-4",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "text-slate-900 dark:text-white font-bold text-lg text-center sm:text-left",
										children: "Log in or sign up to leave a comment"
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex gap-3 w-full sm:w-auto",
										children: [/* @__PURE__ */ jsx(Link, {
											href: "/login",
											className: "flex-1 sm:flex-none text-center px-6 py-2 font-bold text-[14px] text-slate-700 dark:text-white bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors shadow-sm",
											children: "Log In"
										}), /* @__PURE__ */ jsx(Link, {
											href: "/register",
											className: "flex-1 sm:flex-none text-center px-6 py-2 font-bold text-[14px] text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20",
											children: "Sign Up"
										})]
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2",
									children: comments.length > 0 ? comments.map((comment) => /* @__PURE__ */ jsx(CommentThread, {
										comment,
										postId: post.id,
										auth,
										userCommentVotes
									}, comment.id)) : /* @__PURE__ */ jsxs("div", {
										className: "text-center py-12 border-t border-slate-100 dark:border-zinc-800/50 mt-4",
										children: [
											/* @__PURE__ */ jsx(MessageSquare, {
												size: 40,
												className: "mx-auto text-slate-300 dark:text-zinc-700 mb-4"
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-lg font-bold text-slate-900 dark:text-white mb-2",
												children: "No Comments Yet"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-500 dark:text-zinc-400",
												children: "Be the first to share your thoughts on this article!"
											})
										]
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm text-center",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-bold text-slate-800 dark:text-white mb-3",
									children: "Join the Conversation!"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-slate-600 dark:text-zinc-400 mb-6 text-lg",
									children: "What are your thoughts on this topic? Discuss this article and more with our active community on coachingsinsikar."
								}),
								/* @__PURE__ */ jsx(Link, {
									href: "/feed",
									className: "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-md",
									children: "Go to Community"
								})
							]
						})
					] })
				}), /* @__PURE__ */ jsx("aside", {
					className: "w-full lg:w-[30%]",
					children: /* @__PURE__ */ jsxs("div", {
						style: {
							position: "sticky",
							top: "120px",
							maxHeight: "calc(100vh - 140px)",
							overflowY: "auto",
							scrollbarWidth: "none",
							msOverflowStyle: "none"
						},
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xl font-bold mb-6 pb-2 border-b-2 border-blue-600 inline-block text-slate-900 dark:text-white",
							children: "Recent Articles"
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-col gap-4",
							children: recentPosts && recentPosts.map((rp) => /* @__PURE__ */ jsxs(Link, {
								href: `${window.BASE_PATH}/blog/${rp.slug}`,
								className: "flex gap-4 group bg-white dark:bg-zinc-900 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all",
								children: [/* @__PURE__ */ jsx("div", {
									className: "relative w-24 h-20 shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-slate-50",
									children: /* @__PURE__ */ jsx(Image$1, {
										src: rp.coverImage || "/uploads/read.webp",
										alt: rp.title,
										fill: true,
										style: { objectFit: "cover" },
										className: "transition-transform duration-300 group-hover:scale-105"
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col justify-center",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider",
										children: rp.category
									}), /* @__PURE__ */ jsx("h4", {
										className: "font-bold text-sm leading-tight text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 mt-1 line-clamp-3",
										children: rp.title
									})]
								})]
							}, rp.id))
						})]
					})
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { Show as default };
