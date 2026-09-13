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
			className: "hover:bg-[#E2E7E9] px-2 py-1.5 rounded-full transition-colors font-bold text-[12px] text-[#878A8C] border-0 outline-none focus:outline-none focus:ring-0",
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
			className: "absolute top-full right-0 mt-1 w-48 bg-white border border-[#EDEFF1] rounded-md shadow-lg z-20 py-1 overflow-hidden font-medium",
			children: [
				/* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						navigator.clipboard.writeText(`${window.location.origin}/r/${post.community}/comments/${post.id}`);
						alert("Link copied to clipboard!");
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] text-[#1C1C1C] flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Link$1, { size: 16 }), " Copy Link"]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						onReport(post.id, "post");
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] text-[#1C1C1C] flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Flag, { size: 16 }), " Report"]
				}),
				auth?.user?.username === post.author?.username && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Link, {
					href: `/submit?edit=${post.id}`,
					className: "w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] text-[#1C1C1C] flex items-center gap-2 border-t border-[#EDEFF1]",
					children: [/* @__PURE__ */ jsx("span", {
						className: "w-4 h-4 flex items-center justify-center border border-current rounded-sm",
						children: "E"
					}), " Edit Post"]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						if (confirm("Are you sure you want to delete this post?")) router.delete(`/posts/${post.id}`);
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] font-medium text-[#FF4500] flex items-center gap-2",
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
		className: "bg-white border border-[#EDEFF1] hover:border-[#878A8C] rounded-md flex cursor-pointer transition-colors mb-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "w-10 bg-[#F8F9FA] rounded-l-md flex flex-col items-center py-2 gap-1 flex-shrink-0",
			children: [
				/* @__PURE__ */ jsx("button", {
					onClick: (e) => handleVote(1, e),
					className: `transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === 1 ? "text-[#FF4500]" : "text-[#878A8C] hover:text-[#FF4500]"}`,
					children: /* @__PURE__ */ jsx(ArrowBigUp, {
						size: 22,
						strokeWidth: 1.5,
						className: post.user_vote === 1 ? "fill-current" : ""
					})
				}),
				/* @__PURE__ */ jsx("span", {
					className: `text-[12px] font-bold ${post.user_vote === 1 ? "text-[#FF4500]" : post.user_vote === -1 ? "text-[#7193FF]" : "text-[#1C1C1C]"}`,
					children: post.score
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: (e) => handleVote(-1, e),
					className: `transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === -1 ? "text-[#7193FF]" : "text-[#878A8C] hover:text-[#7193FF]"}`,
					children: /* @__PURE__ */ jsx(ArrowBigDown, {
						size: 22,
						strokeWidth: 1.5,
						className: post.user_vote === -1 ? "fill-current" : ""
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-2 pt-2.5 flex-1 min-w-0",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5 text-[12px] text-[#787C7E] mb-2 font-medium flex-wrap",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: `/community/${post.community}`,
							className: "font-bold text-[#1C1C1C] hover:underline",
							children: ["r/", post.community]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-[#878A8C]",
							children: "•"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [
								"Posted by ",
								/* @__PURE__ */ jsxs(Link, {
									href: `/u/${post.author?.username}`,
									className: "hover:underline",
									children: ["u/", post.author?.username]
								}),
								post.author?.flair && /* @__PURE__ */ jsx("span", {
									className: "px-1.5 py-0.5 bg-[#EDEFF1] text-[#1C1C1C] rounded-sm text-[10px] font-bold leading-none",
									children: post.author.flair
								})
							]
						}),
						/* @__PURE__ */ jsx("span", { children: post.created_at })
					]
				}),
				/* @__PURE__ */ jsxs(Link, {
					href: `/r/${post.community}/comments/${post.id}/${post.slug}`,
					className: "block font-bold text-[18px] text-[#1C1C1C] hover:underline leading-snug mb-2 pr-4",
					children: [post.flair && /* @__PURE__ */ jsx("span", {
						className: "inline-block mr-2 px-2 py-0.5 bg-[#0079D3] text-white rounded-full text-[10px] font-bold align-middle",
						children: post.flair
					}), post.title]
				}),
				post.type === "TEXT" && post.content && /* @__PURE__ */ jsxs("div", {
					className: "relative overflow-hidden max-h-40 mb-3 pr-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[14px] text-[#1C1C1C] leading-relaxed prose prose-sm max-w-none prose-a:text-[#0079D3] prose-a:no-underline hover:prose-a:underline prose-img:rounded-md prose-img:my-2 prose-p:my-1",
						dangerouslySetInnerHTML: { __html: post.content }
					}), /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" })]
				}),
				post.type === "LINK" && post.link_url && /* @__PURE__ */ jsx("a", {
					href: post.link_url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "block mb-3 p-3 border border-[#EDEFF1] rounded-md hover:border-[#0079D3] transition-colors bg-[#F8F9FA] group mr-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0079D3]",
							children: /* @__PURE__ */ jsx(Link$1, { size: 16 })
						}), /* @__PURE__ */ jsx("div", {
							className: "flex-1 overflow-hidden",
							children: /* @__PURE__ */ jsx("div", {
								className: "text-[14px] font-bold text-[#1C1C1C] truncate group-hover:text-[#0079D3]",
								children: post.link_url
							})
						})]
					})
				}),
				(post.type === "IMAGE" || post.type === "VIDEO") && post.media_urls && post.media_urls.length > 0 && /* @__PURE__ */ jsx("div", {
					className: "mb-3 rounded-md overflow-hidden bg-black flex items-center justify-center max-h-96 mr-4",
					children: post.type === "VIDEO" ? /* @__PURE__ */ jsx("video", {
						src: post.media_urls[0],
						controls: true,
						preload: "metadata",
						className: "max-w-full max-h-96"
					}) : /* @__PURE__ */ jsx("img", {
						src: post.media_urls[0],
						alt: "Post media",
						loading: "lazy",
						className: "max-w-full max-h-96 object-contain"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-1 -ml-1 mt-1",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: `/r/${post.community}/comments/${post.id}/${post.slug}`,
							className: "flex items-center gap-1.5 hover:bg-[#E2E7E9] px-2 py-1.5 rounded-sm transition-colors font-bold text-[12px] text-[#878A8C]",
							children: [/* @__PURE__ */ jsx(MessageSquare, { size: 20 }), /* @__PURE__ */ jsxs("span", {
								className: "text-[12px] font-bold",
								children: [post.comments_count, " Comments"]
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: (e) => {
								e.preventDefault();
								navigator.clipboard.writeText(`${window.location.origin}/r/${post.community}/comments/${post.id}`);
								alert("Link copied to clipboard!");
							},
							className: "flex items-center gap-1.5 hover:bg-[#E2E7E9] px-2 py-1.5 rounded-sm transition-colors font-bold text-[12px] text-[#878A8C] border-0 outline-none focus:outline-none focus:ring-0",
							children: [/* @__PURE__ */ jsx(Share, {
								size: 18,
								strokeWidth: 2
							}), "Share"]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: handleSave,
							className: `flex items-center gap-1.5 px-2 py-1.5 rounded-sm transition-colors font-bold text-[12px] border-0 outline-none focus:outline-none focus:ring-0 ${post.is_saved ? "text-[#0079D3] bg-blue-50 hover:bg-blue-100" : "text-[#878A8C] hover:bg-[#E2E7E9]"}`,
							children: [/* @__PURE__ */ jsx(Bookmark, {
								size: 18,
								strokeWidth: 2,
								className: post.is_saved ? "fill-current" : ""
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
