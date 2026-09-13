import { Head, Link, router, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp, Bookmark, Flag, Link as Link$1, MessageSquare, MoreHorizontal, Share, Trash } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
//#region resources/js/Pages/Post/Show.jsx
var PostDropdown = ({ post, auth }) => {
	const [isOpen, setIsOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		children: [/* @__PURE__ */ jsx("div", {
			onClick: (e) => {
				e.preventDefault();
				setIsOpen(!isOpen);
			},
			className: "flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#F6F7F8] rounded-sm transition-colors cursor-pointer text-[#878A8C]",
			children: /* @__PURE__ */ jsx(MoreHorizontal, { size: 20 })
		}), isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-10",
			onClick: (e) => {
				e.preventDefault();
				setIsOpen(false);
			}
		}), /* @__PURE__ */ jsxs("div", {
			className: "absolute top-full right-0 mt-1 w-48 bg-white border border-[#EDEFF1] rounded-md shadow-lg z-20 py-1 overflow-hidden",
			children: [
				/* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						navigator.clipboard.writeText(window.location.href);
						alert("Link copied to clipboard!");
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] font-medium text-[#1C1C1C] flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Link$1, { size: 16 }), " Copy Link"]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: (e) => {
						e.preventDefault();
						alert("Post reported.");
						setIsOpen(false);
					},
					className: "w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] font-medium text-[#1C1C1C] flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Flag, { size: 16 }), " Report"]
				}),
				auth?.user?.username === post.author.username && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Link, {
					href: `/submit?edit=${post.id}`,
					className: "w-full text-left px-4 py-2 hover:bg-[#F6F7F8] text-[14px] font-medium text-[#1C1C1C] flex items-center gap-2 border-t border-[#EDEFF1]",
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
					className: "w-full text-left px-4 py-2 hover:bg-red-50 text-[14px] font-medium text-red-600 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Trash, { size: 16 }), " Delete Post"]
				})] })
			]
		})] })]
	});
};
dayjs.extend(relativeTime);
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
		className: "mt-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center",
				children: [/* @__PURE__ */ jsx("img", {
					src: `https://ui-avatars.com/api/?name=${comment.author?.username}&background=random`,
					className: "w-8 h-8 rounded-full"
				}), /* @__PURE__ */ jsx("div", { className: "w-[2px] h-full bg-[#EDEFF1] mt-2 group-hover:bg-[#878A8C] transition-colors cursor-pointer" })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 pb-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "font-bold text-[12px] text-[#1C1C1C]",
							children: ["u/", comment.author?.username || "deleted"]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[#787C7E] text-[12px]",
							children: dayjs(comment.created_at).fromNow()
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-[14px] text-[#1C1C1C] mb-2 leading-relaxed",
						children: comment.content
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1",
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
								className: `flex items-center gap-1 px-2 py-1.5 rounded-sm transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${userVote === 1 ? "text-[#FF4500] bg-orange-50" : "hover:bg-[#F6F7F8] text-[#878A8C] hover:text-[#FF4500]"}`,
								children: /* @__PURE__ */ jsx(ArrowBigUp, {
									size: 20,
									className: userVote === 1 ? "fill-current" : ""
								})
							}),
							/* @__PURE__ */ jsx("span", {
								className: `text-[12px] font-bold ${userVote === 1 ? "text-[#FF4500]" : userVote === -1 ? "text-[#7193FF]" : "text-[#1C1C1C]"}`,
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
								className: `flex items-center gap-1 px-2 py-1.5 rounded-sm transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${userVote === -1 ? "text-[#7193FF] bg-blue-50" : "hover:bg-[#F6F7F8] text-[#878A8C] hover:text-[#7193FF]"}`,
								children: /* @__PURE__ */ jsx(ArrowBigDown, {
									size: 20,
									className: userVote === -1 ? "fill-current" : ""
								})
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setShowReplyForm(!showReplyForm),
								className: "flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#F6F7F8] rounded-sm transition-colors border-0 outline-none focus:outline-none focus:ring-0 text-[#878A8C]",
								children: [/* @__PURE__ */ jsx(MessageSquare, { size: 16 }), /* @__PURE__ */ jsx("span", {
									className: "text-[12px] font-bold",
									children: "Reply"
								})]
							})
						]
					}),
					showReplyForm && auth?.user && /* @__PURE__ */ jsx("div", {
						className: "mt-2 mb-4 pr-4",
						children: /* @__PURE__ */ jsxs("form", {
							onSubmit: submitReply,
							children: [/* @__PURE__ */ jsx("textarea", {
								value: data.content,
								onChange: (e) => setData("content", e.target.value),
								placeholder: "What are your thoughts?",
								className: "w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-2 px-3 text-[14px] outline-none transition-colors min-h-[100px]"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex justify-end gap-2 mt-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowReplyForm(false),
									className: "px-4 py-1.5 font-bold text-[14px] bg-[#F6F7F8] hover:bg-[#E2E7E9] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0",
									children: "Cancel"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: processing || !data.content,
									className: "px-4 py-1.5 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0",
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
	const plainTextContent = post.excerpt || (post.content ? post.content.replace(/<[^>]*>?/gm, "").substring(0, 160) : `Read this post by u/${post.author.username} in r/${community.name}.`);
	const pageTitle = `${post.title} - r/${community.name} - coachinginsikar`;
	const currentUrl = typeof window !== "undefined" ? window.location.href : `https://coachingsinsikar.com/r/${community.name}/comments/${post.id}/${post.slug || ""}`;
	const submitComment = (e) => {
		e.preventDefault();
		submitForm(route("post.comment.store", post.id), { onSuccess: () => reset() });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#DAE0E6] text-[#1C1C1C] font-sans pb-20",
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
			/* @__PURE__ */ jsx("header", {
				className: "fixed top-0 z-50 w-full bg-white border-b border-[#EDEFF1]",
				children: /* @__PURE__ */ jsx("div", {
					className: "w-full px-4 sm:px-6 h-14 flex items-center justify-between",
					children: /* @__PURE__ */ jsxs(Link, {
						href: "/feed",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-white font-black text-lg",
								children: "N"
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "font-extrabold text-xl tracking-tight hidden sm:block",
							children: "coachinginsikar"
						})]
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full mx-auto px-4 sm:px-6 flex gap-6 mt-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1 bg-white rounded-md border border-[#EDEFF1]",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex pr-2 pt-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "w-10 bg-white rounded-l-md flex flex-col items-center pt-2 gap-1 flex-shrink-0",
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
									className: `p-1 rounded transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === 1 ? "text-[#FF4500] bg-orange-50" : "text-[#878A8C] hover:text-[#FF4500] hover:bg-[#EDEFF1]"}`,
									children: /* @__PURE__ */ jsx(ArrowBigUp, {
										size: 24,
										className: post.user_vote === 1 ? "fill-current text-[#FF4500]" : "text-[#878A8C] hover:text-[#FF4500]"
									})
								}),
								/* @__PURE__ */ jsx("span", {
									className: `text-[12px] font-bold ${post.user_vote === 1 ? "text-[#FF4500]" : post.user_vote === -1 ? "text-[#7193FF]" : "text-[#1C1C1C]"}`,
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
									className: `p-1 rounded transition-colors border-0 outline-none focus:outline-none focus:ring-0 shadow-none bg-transparent ${post.user_vote === -1 ? "text-[#7193FF] bg-blue-50" : "text-[#878A8C] hover:text-[#7193FF] hover:bg-[#EDEFF1]"}`,
									children: /* @__PURE__ */ jsx(ArrowBigDown, {
										size: 24,
										className: post.user_vote === -1 ? "fill-current text-[#7193FF]" : "text-[#878A8C] hover:text-[#7193FF]"
									})
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 pt-2 px-2 pb-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1 text-[12px] mb-2",
									children: [
										community.icon_image && /* @__PURE__ */ jsx("img", {
											src: community.icon_image,
											className: "w-5 h-5 rounded-full mr-1"
										}),
										/* @__PURE__ */ jsx(Link, {
											href: `/community/${community.name}`,
											className: "font-bold text-[#1C1C1C] hover:underline",
											children: community.display_name
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-[#787C7E] mx-1",
											children: "•"
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-[#787C7E]",
											children: ["Posted by u/", post.author.username]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-[#787C7E] ml-1",
											children: post.created_at
										})
									]
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-[20px] font-medium text-[#1C1C1C] mb-4 leading-snug",
									children: post.title
								}),
								post.type === "TEXT" && post.content && /* @__PURE__ */ jsx("div", {
									className: "text-[14px] text-[#1C1C1C] mb-6 leading-relaxed whitespace-pre-wrap prose prose-sm sm:prose-base max-w-none prose-a:text-[#0079D3] prose-a:no-underline hover:prose-a:underline prose-img:rounded-md prose-img:my-4 prose-p:my-2",
									dangerouslySetInnerHTML: { __html: post.content }
								}),
								post.type === "LINK" && post.link_url && /* @__PURE__ */ jsx("a", {
									href: post.link_url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "block mb-6 p-4 border border-[#EDEFF1] rounded-md hover:border-[#0079D3] transition-colors bg-[#F8F9FA] group",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0079D3]",
											children: /* @__PURE__ */ jsx(Link$1, { size: 20 })
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex-1 overflow-hidden",
											children: [/* @__PURE__ */ jsx("div", {
												className: "text-[14px] font-bold text-[#1C1C1C] truncate group-hover:text-[#0079D3]",
												children: post.link_url
											}), /* @__PURE__ */ jsx("div", {
												className: "text-[12px] text-[#878A8C] truncate",
												children: "Click to open link"
											})]
										})]
									})
								}),
								(post.type === "IMAGE" || post.type === "VIDEO") && post.media_urls && post.media_urls.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "mb-6 rounded-md overflow-hidden bg-black flex items-center justify-center max-h-[600px]",
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
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#F6F7F8] rounded-sm transition-colors cursor-pointer text-[#878A8C]",
											children: [/* @__PURE__ */ jsx(MessageSquare, { size: 20 }), /* @__PURE__ */ jsxs("span", {
												className: "text-[12px] font-bold",
												children: [post.comments_count, " Comments"]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											onClick: () => {
												navigator.clipboard.writeText(window.location.href);
												alert("Link copied to clipboard!");
											},
											className: "flex items-center gap-1.5 px-2 py-1.5 hover:bg-[#F6F7F8] rounded-sm transition-colors cursor-pointer text-[#878A8C]",
											children: [/* @__PURE__ */ jsx(Share, { size: 20 }), /* @__PURE__ */ jsx("span", {
												className: "text-[12px] font-bold",
												children: "Share"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											onClick: () => router.post(`/posts/${post.id}/save`, {}, { preserveScroll: true }),
											className: `flex items-center gap-1.5 px-2 py-1.5 rounded-sm transition-colors cursor-pointer ${post.is_saved ? "text-[#0079D3] hover:bg-blue-50" : "text-[#878A8C] hover:bg-[#F6F7F8]"}`,
											children: [/* @__PURE__ */ jsx(Bookmark, {
												size: 20,
												className: post.is_saved ? "fill-current" : ""
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[12px] font-bold",
												children: post.is_saved ? "Saved" : "Save"
											})]
										}),
										/* @__PURE__ */ jsx(PostDropdown, {
											post,
											auth
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "px-10 pb-10",
						children: [auth?.user ? /* @__PURE__ */ jsxs("div", {
							className: "mb-6 mt-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "text-[12px] mb-1",
								children: ["Comment as ", /* @__PURE__ */ jsx("span", {
									className: "text-[#0079D3]",
									children: auth.user.username || auth.user.name
								})]
							}), /* @__PURE__ */ jsxs("form", {
								onSubmit: submitComment,
								children: [/* @__PURE__ */ jsx("textarea", {
									value: data.content,
									onChange: (e) => setData("content", e.target.value),
									placeholder: "What are your thoughts?",
									className: "w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-2 px-3 text-[14px] outline-none transition-colors min-h-[140px]"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex justify-end mt-2 bg-[#F6F7F8] border border-t-0 border-[#EDEFF1] rounded-b-md p-2 -mt-1",
									children: /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: processing || !data.content,
										className: "px-6 py-1.5 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0",
										children: "Comment"
									})
								})]
							})]
						}) : /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border border-[#EDEFF1] rounded-md p-4 mb-6",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-[#1C1C1C] font-medium",
								children: "Log in or sign up to leave a comment"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx(Link, {
									href: "/login",
									className: "px-6 py-1.5 font-bold text-[14px] text-[#0079D3] rounded-full hover:bg-[#F6F7F8]",
									children: "Log In"
								}), /* @__PURE__ */ jsx(Link, {
									href: "/register",
									className: "px-6 py-1.5 font-bold text-[14px] text-white bg-[#0079D3] rounded-full hover:bg-[#005EAC]",
									children: "Sign Up"
								})]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "border-t border-[#EDEFF1] pt-6 border-b-0",
							children: comments.length > 0 ? comments.map((comment) => /* @__PURE__ */ jsx(CommentThread, {
								comment,
								postId: post.id,
								auth,
								userCommentVotes
							}, comment.id)) : /* @__PURE__ */ jsx("div", {
								className: "text-center py-10 text-[#878A8C]",
								children: "No comments yet. Be the first to share what you think!"
							})
						})]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "hidden lg:block w-[312px]",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-md border border-[#EDEFF1] p-3 mb-4",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2 mb-3",
								children: /* @__PURE__ */ jsx("h2", {
									className: "font-bold text-[16px]",
									children: "About Community"
								})
							}),
							community.description && /* @__PURE__ */ jsx("p", {
								className: "text-[14px] text-[#1C1C1C] mb-4",
								children: community.description
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4 text-[14px] font-medium border-t border-[#EDEFF1] pt-3 mb-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-[16px] font-bold",
									children: "1"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[#787C7E] text-[12px]",
									children: "Members"
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "text-[16px] font-bold flex items-center gap-1",
									children: [/* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500" }), "1"]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[#787C7E] text-[12px]",
									children: "Online"
								})] })]
							}),
							/* @__PURE__ */ jsx("hr", { className: "mb-4 border-[#EDEFF1]" }),
							/* @__PURE__ */ jsx(Link, {
								href: "/submit",
								className: "flex items-center justify-center w-full py-1.5 bg-[#0079D3] hover:bg-[#005EAC] text-white font-bold rounded-full text-[14px] transition-colors border-0 outline-none focus:outline-none focus:ring-0 mb-2",
								children: "Create Post"
							})
						]
					})
				})]
			})
		]
	});
}
//#endregion
export { ShowPost as default };
