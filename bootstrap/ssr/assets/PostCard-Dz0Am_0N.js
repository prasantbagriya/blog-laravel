import { Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp, Bookmark, Flag, Link as Link$1, MessageSquare, MoreHorizontal, Share, Trash, X } from "lucide-react";
//#region resources/js/Components/ReportModal.jsx
function ReportModal({ isOpen, onClose, reportableId, reportableType }) {
	const [reason, setReason] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	if (!isOpen) return null;
	const reasons = [
		"Spam",
		"Harassment or bullying",
		"Hate speech",
		"Sexually explicit content",
		"Misinformation",
		"Rules Violation",
		"Other"
	];
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!reason) return;
		setIsSubmitting(true);
		router.post("/reports", {
			reportable_id: reportableId,
			reportable_type: reportableType,
			reason
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setIsSubmitting(false);
				alert("Report submitted successfully.");
				onClose();
			},
			onError: () => {
				setIsSubmitting(false);
				alert("An error occurred or you already reported this.");
			}
		});
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-md w-full max-w-md mx-4 shadow-xl overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-center p-4 border-b border-[#EDEFF1]",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[16px] font-bold text-[#1C1C1C]",
					children: "Submit a Report"
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "text-[#878A8C] hover:text-[#1C1C1C] transition-colors",
					children: /* @__PURE__ */ jsx(X, { size: 24 })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "p-4",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-[14px] text-[#1C1C1C] mb-4",
						children: "Why are you reporting this?"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "space-y-2 mb-6",
						children: reasons.map((r, i) => /* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 cursor-pointer hover:bg-[#F6F7F8] p-2 rounded-md transition-colors",
							children: [/* @__PURE__ */ jsx("input", {
								type: "radio",
								name: "reason",
								value: r,
								checked: reason === r,
								onChange: (e) => setReason(e.target.value),
								className: "text-[#0079D3] focus:ring-[#0079D3]"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[14px] font-medium text-[#1C1C1C]",
								children: r
							})]
						}, i))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onClose,
							className: "px-4 py-2 font-bold text-[14px] bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: !reason || isSubmitting,
							className: "px-4 py-2 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0",
							children: isSubmitting ? "Submitting..." : "Submit Report"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region resources/js/Components/PostCard.jsx
var PostDropdown = ({ post, auth, onReport }) => {
	const [isOpen, setIsOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		children: [/* @__PURE__ */ jsx("button", {
			onClick: (e) => {
				e.preventDefault();
				setIsOpen(!isOpen);
			},
			className: "bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-2 rounded-xl transition-colors font-bold text-[12px] text-slate-600 dark:text-zinc-300 border-0 outline-none focus:outline-none focus:ring-0 flex items-center justify-center h-full",
			children: /* @__PURE__ */ jsx(MoreHorizontal, {
				size: 18,
				strokeWidth: 2
			})
		}), isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-10",
			onClick: (e) => {
				e.preventDefault();
				setIsOpen(false);
			}
		}), /* @__PURE__ */ jsxs("div", {
			className: "absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 py-1 overflow-hidden font-medium",
			children: [
				/* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						navigator.clipboard.writeText(`${window.location.origin}/r/${post.community}/comments/${post.id}`);
						alert("Link copied to clipboard!");
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[14px] text-slate-700 dark:text-zinc-300 flex items-center gap-2 transition-colors",
					children: [/* @__PURE__ */ jsx(Link$1, { size: 16 }), " Copy Link"]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						onReport(post.id, "post");
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[14px] text-slate-700 dark:text-zinc-300 flex items-center gap-2 transition-colors",
					children: [/* @__PURE__ */ jsx(Flag, { size: 16 }), " Report"]
				}),
				auth?.user?.username === post.author?.username && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Link, {
					href: `/submit?edit=${post.id}`,
					className: "w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800 text-[14px] text-slate-700 dark:text-zinc-300 flex items-center gap-2 border-t border-slate-100 dark:border-zinc-800 transition-colors",
					children: [/* @__PURE__ */ jsx("span", {
						className: "w-4 h-4 flex items-center justify-center border border-current rounded-[4px] text-[10px] font-bold",
						children: "E"
					}), " Edit Post"]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						if (confirm("Are you sure you want to delete this post?")) router.delete(`/posts/${post.id}`);
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-[14px] font-bold text-rose-600 flex items-center gap-2 transition-colors",
					children: [/* @__PURE__ */ jsx(Trash, { size: 16 }), " Delete Post"]
				})] })
			]
		})] })]
	});
};
function PostCard({ post, auth, openReportModal }) {
	const handleVote = (value, e) => {
		e.preventDefault();
		router.post("/vote", {
			votable_type: "post",
			votable_id: post.id,
			value
		}, { preserveScroll: true });
	};
	const handleSave = (e) => {
		e.preventDefault();
		router.post(`/posts/${post.id}/save`, {}, { preserveScroll: true });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-6 cursor-pointer bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/40 rounded-3xl flex h-full w-full hover:border-blue-400 dark:hover:border-blue-700 transition-colors",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "w-12 sm:w-16 bg-slate-50/50 dark:bg-zinc-900/50 flex flex-col items-center py-5 gap-2 flex-shrink-0 border-r border-slate-100 dark:border-zinc-800/50 rounded-l-3xl",
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: (e) => handleVote(1, e),
					className: `transition-all border-0 outline-none focus:outline-none focus:ring-0 flex items-center justify-center w-9 h-9 rounded-full ${post.user_vote === 1 ? "bg-blue-600 text-white shadow-sm" : "bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-zinc-700 shadow-sm"}`,
					children: /* @__PURE__ */ jsx(ArrowBigUp, {
						size: 20,
						strokeWidth: post.user_vote === 1 ? 2.5 : 2,
						className: post.user_vote === 1 ? "fill-current" : ""
					})
				}),
				/* @__PURE__ */ jsx("span", {
					className: `text-[14px] font-extrabold ${post.user_vote === 1 ? "text-blue-600" : post.user_vote === -1 ? "text-rose-600" : "text-slate-700 dark:text-zinc-300"}`,
					children: post.score
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: (e) => handleVote(-1, e),
					className: `transition-all border-0 outline-none focus:outline-none focus:ring-0 flex items-center justify-center w-9 h-9 rounded-full ${post.user_vote === -1 ? "bg-rose-600 text-white shadow-sm" : "bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-zinc-700 shadow-sm"}`,
					children: /* @__PURE__ */ jsx(ArrowBigDown, {
						size: 20,
						strokeWidth: post.user_vote === -1 ? 2.5 : 2,
						className: post.user_vote === -1 ? "fill-current" : ""
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-4 sm:p-5 pt-4 flex-1 min-w-0",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-[12px] text-slate-500 dark:text-zinc-400 mb-2.5 font-medium flex-wrap",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: `/community/${post.community}`,
							className: "font-extrabold text-slate-900 dark:text-white hover:underline flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] text-blue-600 dark:text-blue-400 shrink-0 border border-blue-200 dark:border-blue-800",
									children: post.community.charAt(0).toUpperCase()
								}),
								"r/",
								post.community
							]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-slate-300 dark:text-zinc-600",
							children: "•"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [
								"Posted by ",
								/* @__PURE__ */ jsxs(Link, {
									href: `/u/${post.author?.username}`,
									className: "hover:underline font-bold text-slate-600 dark:text-zinc-300",
									children: ["u/", post.author?.username]
								}),
								post.author?.flair && /* @__PURE__ */ jsx("span", {
									className: "px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-md text-[10px] font-bold leading-none ml-1",
									children: post.author.flair
								})
							]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-slate-300 dark:text-zinc-600",
							children: "•"
						}),
						/* @__PURE__ */ jsx("span", { children: post.created_at })
					]
				}),
				/* @__PURE__ */ jsxs(Link, {
					href: `/r/${post.community}/comments/${post.id}/${post.slug}`,
					className: "block font-extrabold text-[18px] sm:text-[20px] text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 leading-snug mb-3 pr-4 transition-colors",
					children: [post.flair && /* @__PURE__ */ jsx("span", {
						className: "inline-flex mr-2 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-[10px] font-extrabold align-text-bottom tracking-wide",
						children: post.flair
					}), post.title]
				}),
				post.type === "TEXT" && post.content && /* @__PURE__ */ jsxs("div", {
					className: "relative overflow-hidden max-h-40 mb-4 pr-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[14px] text-slate-700 dark:text-zinc-300 leading-relaxed prose prose-sm max-w-none prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:my-2 prose-p:my-1",
						dangerouslySetInnerHTML: { __html: post.content }
					}), /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" })]
				}),
				post.type === "LINK" && post.link_url && /* @__PURE__ */ jsx("a", {
					href: post.link_url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "block mb-4 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-slate-50 dark:bg-zinc-800/50 group mr-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm text-blue-600 dark:text-blue-400 shrink-0 border border-slate-100 dark:border-zinc-700",
							children: /* @__PURE__ */ jsx(Link$1, { size: 18 })
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 overflow-hidden",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[14px] font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
								children: post.link_url
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-[12px] font-medium text-slate-500 mt-0.5 truncate flex items-center gap-1",
								children: ["Click to open external link ", /* @__PURE__ */ jsx(ArrowBigUp, {
									size: 12,
									className: "rotate-45"
								})]
							})]
						})]
					})
				}),
				(post.type === "IMAGE" || post.type === "VIDEO") && post.media_urls && post.media_urls.length > 0 && /* @__PURE__ */ jsx("div", {
					className: "mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-950 flex items-center justify-center max-h-[400px] mr-4 border border-slate-100 dark:border-zinc-800/50 shadow-sm",
					children: post.type === "VIDEO" ? /* @__PURE__ */ jsx("video", {
						src: post.media_urls[0],
						controls: true,
						preload: "metadata",
						className: "max-w-full max-h-[400px]"
					}) : /* @__PURE__ */ jsx("img", {
						src: post.media_urls[0],
						alt: "Post media",
						loading: "lazy",
						className: "max-w-full max-h-[400px] object-contain"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-2 -ml-1.5 mt-2 flex-nowrap whitespace-nowrap overflow-x-auto pb-1",
					style: {
						scrollbarWidth: "none",
						msOverflowStyle: "none"
					},
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: `/r/${post.community}/comments/${post.id}/${post.slug}`,
							className: "shrink-0 whitespace-nowrap flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] group",
							children: [/* @__PURE__ */ jsx(MessageSquare, {
								size: 18,
								className: "text-blue-500"
							}), /* @__PURE__ */ jsxs("span", { children: [post.comments_count, " Comments"] })]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: (e) => {
								e.preventDefault();
								navigator.clipboard.writeText(`${window.location.origin}/r/${post.community}/comments/${post.id}`);
								alert("Link copied to clipboard!");
							},
							className: "shrink-0 whitespace-nowrap flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] text-slate-600 dark:text-zinc-300 border-0 outline-none focus:outline-none focus:ring-0 group",
							children: [/* @__PURE__ */ jsx(Share, {
								size: 18,
								strokeWidth: 2,
								className: "text-slate-500 dark:text-zinc-400"
							}), "Share"]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: handleSave,
							className: `shrink-0 whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] border-0 outline-none focus:outline-none focus:ring-0 group ${post.is_saved ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40" : "bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300"}`,
							children: [/* @__PURE__ */ jsx(Bookmark, {
								size: 18,
								strokeWidth: 2,
								className: post.is_saved ? "fill-current text-amber-500" : "text-slate-500 dark:text-zinc-400"
							}), post.is_saved ? "Saved" : "Save"]
						}),
						/* @__PURE__ */ jsx(PostDropdown, {
							post,
							auth,
							onReport: openReportModal
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { ReportModal as n, PostCard as t };
