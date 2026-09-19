import { t as ReportModal } from "./ReportModal-DnY-odkX.js";
import { Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp, Bookmark, Flag, Link as Link$1, Link2, MessageSquare, MoreHorizontal, Share, Trash, X } from "lucide-react";
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
var ShareModal = ({ isOpen, onClose, url, title }) => {
	if (!isOpen) return null;
	const [copied, setCopied] = useState(false);
	const handleCopy = () => {
		navigator.clipboard?.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const shareLinks = [
		{
			name: "WhatsApp",
			icon: /* @__PURE__ */ jsx("svg", {
				viewBox: "0 0 24 24",
				className: "w-5 h-5 fill-current",
				children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" })
			}),
			url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
			color: "bg-[#25D366] text-white hover:bg-[#20bd5a]"
		},
		{
			name: "Facebook",
			icon: /* @__PURE__ */ jsx("svg", {
				viewBox: "0 0 24 24",
				className: "w-5 h-5 fill-current",
				children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" })
			}),
			url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			color: "bg-[#1877F2] text-white hover:bg-[#166fe5]"
		},
		{
			name: "Twitter",
			icon: /* @__PURE__ */ jsx("svg", {
				viewBox: "0 0 24 24",
				className: "w-4 h-4 fill-current",
				children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
			}),
			url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
			color: "bg-[#1DA1F2] text-white hover:bg-[#1a91da]"
		},
		{
			name: "LinkedIn",
			icon: /* @__PURE__ */ jsx("svg", {
				viewBox: "0 0 24 24",
				className: "w-4 h-4 fill-current",
				children: /* @__PURE__ */ jsx("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" })
			}),
			url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
			color: "bg-[#0A66C2] text-white hover:bg-[#0958a7]"
		}
	];
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-center p-5 border-b border-slate-100 dark:border-zinc-800",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-bold text-lg text-slate-900 dark:text-white",
					children: "Share this post"
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors",
					children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-5",
				children: [/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-4 gap-4 mb-6",
					children: shareLinks.map((link) => /* @__PURE__ */ jsxs("a", {
						href: link.url,
						target: "_blank",
						rel: "noreferrer",
						className: "flex flex-col items-center gap-2 group",
						children: [/* @__PURE__ */ jsx("div", {
							className: `w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${link.color}`,
							children: link.icon
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-bold text-slate-500 dark:text-zinc-400",
							children: link.name
						})]
					}, link.name))
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative group",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
							children: /* @__PURE__ */ jsx(Link2, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							readOnly: true,
							value: url,
							className: "block w-full pl-12 pr-24 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: handleCopy,
							className: `absolute inset-y-1.5 right-1.5 px-5 rounded-full font-extrabold text-xs transition-all active:scale-[0.98] ${copied ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20"}`,
							children: copied ? "Copied!" : "Copy"
						})
					]
				})]
			})]
		})
	});
};
function PostCard({ post, auth, openReportModal }) {
	const [showShareModal, setShowShareModal] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
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
		if (!auth?.user) {
			alert("Please log in to save posts.");
			return;
		}
		router.post(`/posts/${post.id}/save`, {}, { preserveScroll: true });
	};
	const handleReport = (id, type) => {
		if (openReportModal) openReportModal(id, type);
		else {
			if (!auth?.user) {
				alert("Please log in to report posts.");
				return;
			}
			setShowReportModal(true);
		}
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
							href: `/community/${post.community?.name || post.community}`,
							className: "font-extrabold text-slate-900 dark:text-white hover:underline flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] text-blue-600 dark:text-blue-400 shrink-0 border border-blue-200 dark:border-blue-800",
									children: (post.community?.name || post.community).charAt(0).toUpperCase()
								}),
								"r/",
								post.community?.name || post.community
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
					href: `/r/${post.community?.name || post.community}/comments/${post.id}/${post.slug}`,
					className: "block font-extrabold text-[18px] sm:text-[20px] text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 leading-snug mb-3 pr-4 transition-colors break-words",
					children: [post.flair && /* @__PURE__ */ jsx("span", {
						className: "inline-flex mr-2 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-[10px] font-extrabold align-text-bottom tracking-wide",
						children: post.flair
					}), post.title]
				}),
				post.type === "TEXT" && post.content && /* @__PURE__ */ jsxs("div", {
					className: "relative overflow-hidden max-h-40 mb-4 pr-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[14px] text-slate-700 dark:text-zinc-300 leading-relaxed prose prose-sm max-w-none break-words overflow-x-auto prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:my-2 prose-p:my-1",
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
							href: `/r/${post.community?.name || post.community}/comments/${post.id}/${post.slug}`,
							className: "shrink-0 whitespace-nowrap flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] group",
							children: [/* @__PURE__ */ jsx(MessageSquare, {
								size: 18,
								className: "text-blue-500"
							}), /* @__PURE__ */ jsxs("span", { children: [post.comments_count, " Comments"] })]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: (e) => {
								e.preventDefault();
								setShowShareModal(true);
							},
							className: "shrink-0 whitespace-nowrap flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] text-slate-600 dark:text-zinc-300 border-0 outline-none focus:outline-none focus:ring-0 group",
							children: [/* @__PURE__ */ jsx(Share, {
								size: 18,
								strokeWidth: 2,
								className: "text-slate-500 dark:text-zinc-400"
							}), "Share"]
						}),
						/* @__PURE__ */ jsx(ShareModal, {
							isOpen: showShareModal,
							onClose: () => setShowShareModal(false),
							url: typeof window !== "undefined" ? `${window.location.origin}/r/${post.community}/comments/${post.id}` : "",
							title: post.title
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
							onReport: handleReport
						})
					]
				}),
				/* @__PURE__ */ jsx(ReportModal, {
					isOpen: showReportModal,
					onClose: () => setShowReportModal(false),
					reportableId: post.id,
					reportableType: "post"
				})
			]
		})]
	});
}
//#endregion
export { PostCard as t };
