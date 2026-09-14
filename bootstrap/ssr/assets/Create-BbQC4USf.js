import { t as Navbar } from "./GlobalNavbar-dTNI2462.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link$1 from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube";
import { AlignCenter, AlignLeft, AlignRight, Bold, CheckCircle2, ChevronDown, Heading1, Heading2, Image as Image$1, Italic, Link as Link$2, List, ListOrdered, PencilLine, Quote, Sparkles, Strikethrough, Underline as Underline$1, Video } from "lucide-react";
//#region resources/js/Components/TipTapEditor.jsx
var ToolbarButton = ({ onClick, disabled, isActive, title, children }) => /* @__PURE__ */ jsx("button", {
	type: "button",
	onClick,
	disabled,
	className: `p-1.5 rounded transition-colors flex items-center justify-center border-0 outline-none focus:outline-none focus:ring-0 ${isActive ? "bg-[#F6F7F8] text-[#1C1C1C]" : "text-[#878A8C] hover:bg-[#F6F7F8] hover:text-[#1C1C1C]"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
	title,
	children
});
var MenuBar = ({ editor }) => {
	if (!editor) return null;
	const addImage = useCallback(() => {
		const url = window.prompt("URL of the image");
		if (url) editor.chain().focus().setImage({ src: url }).run();
	}, [editor]);
	const addVideo = useCallback(() => {
		const url = window.prompt("URL of the YouTube video");
		if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
	}, [editor]);
	const setLink = useCallback(() => {
		const previousUrl = editor.getAttributes("link").href;
		const url = window.prompt("URL", previousUrl);
		if (url === null) return;
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	}, [editor]);
	const Divider = () => /* @__PURE__ */ jsx("div", { className: "w-[1px] h-6 bg-gray-200 mx-1.5 hidden sm:block" });
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center gap-0.5 p-1.5 bg-[#F6F7F8] border-b border-[#EDEFF1]",
		children: [
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().toggleBold().run(),
				disabled: !editor.can().chain().focus().toggleBold().run(),
				isActive: editor.isActive("bold"),
				title: "Bold",
				children: /* @__PURE__ */ jsx(Bold, {
					size: 18,
					strokeWidth: editor.isActive("bold") ? 2.5 : 2
				})
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().toggleItalic().run(),
				disabled: !editor.can().chain().focus().toggleItalic().run(),
				isActive: editor.isActive("italic"),
				title: "Italic",
				children: /* @__PURE__ */ jsx(Italic, {
					size: 18,
					strokeWidth: editor.isActive("italic") ? 2.5 : 2
				})
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().toggleUnderline().run(),
				isActive: editor.isActive("underline"),
				title: "Underline",
				children: /* @__PURE__ */ jsx(Underline$1, {
					size: 18,
					strokeWidth: editor.isActive("underline") ? 2.5 : 2
				})
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().toggleStrike().run(),
				disabled: !editor.can().chain().focus().toggleStrike().run(),
				isActive: editor.isActive("strike"),
				title: "Strikethrough",
				children: /* @__PURE__ */ jsx(Strikethrough, {
					size: 18,
					strokeWidth: editor.isActive("strike") ? 2.5 : 2
				})
			}),
			/* @__PURE__ */ jsx(Divider, {}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
				isActive: editor.isActive("heading", { level: 1 }),
				title: "Heading 1",
				children: /* @__PURE__ */ jsx(Heading1, { size: 18 })
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
				isActive: editor.isActive("heading", { level: 2 }),
				title: "Heading 2",
				children: /* @__PURE__ */ jsx(Heading2, { size: 18 })
			}),
			/* @__PURE__ */ jsx(Divider, {}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().setTextAlign("left").run(),
				isActive: editor.isActive({ textAlign: "left" }),
				title: "Align Left",
				children: /* @__PURE__ */ jsx(AlignLeft, { size: 18 })
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().setTextAlign("center").run(),
				isActive: editor.isActive({ textAlign: "center" }),
				title: "Align Center",
				children: /* @__PURE__ */ jsx(AlignCenter, { size: 18 })
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().setTextAlign("right").run(),
				isActive: editor.isActive({ textAlign: "right" }),
				title: "Align Right",
				children: /* @__PURE__ */ jsx(AlignRight, { size: 18 })
			}),
			/* @__PURE__ */ jsx(Divider, {}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().toggleBulletList().run(),
				isActive: editor.isActive("bulletList"),
				title: "Bullet List",
				children: /* @__PURE__ */ jsx(List, { size: 18 })
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().toggleOrderedList().run(),
				isActive: editor.isActive("orderedList"),
				title: "Numbered List",
				children: /* @__PURE__ */ jsx(ListOrdered, { size: 18 })
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: () => editor.chain().focus().toggleBlockquote().run(),
				isActive: editor.isActive("blockquote"),
				title: "Quote",
				children: /* @__PURE__ */ jsx(Quote, { size: 18 })
			}),
			/* @__PURE__ */ jsx(Divider, {}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: setLink,
				isActive: editor.isActive("link"),
				title: "Link",
				children: /* @__PURE__ */ jsx(Link$2, { size: 18 })
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: addImage,
				title: "Image URL",
				children: /* @__PURE__ */ jsx(Image$1, { size: 18 })
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: addVideo,
				title: "YouTube Video",
				children: /* @__PURE__ */ jsx(Video, { size: 18 })
			})
		]
	});
};
function TipTapEditor({ value, onChange }) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Link$1.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-[#0079D3] hover:underline",
					rel: "ugc nofollow",
					target: "_blank"
				}
			}),
			Image.configure({ HTMLAttributes: {
				class: "max-w-full rounded-md mt-4 mb-4 bg-gray-50",
				loading: "lazy",
				decoding: "async"
			} }),
			Youtube.configure({
				controls: true,
				nocookie: true,
				HTMLAttributes: { class: "w-full aspect-video rounded-md mt-4 mb-4" }
			}),
			Placeholder.configure({
				placeholder: "Text (optional)",
				emptyEditorClass: "is-editor-empty"
			})
		],
		content: value,
		editorProps: { attributes: { class: "prose max-w-none prose-sm sm:prose-base focus:outline-none min-h-[150px] p-4 text-[#1C1C1C] editor-content" } },
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			if (html === "<p></p>" || html === "") onChange("");
			else onChange(html);
		}
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "border border-[#EDEFF1] focus-within:border-[#1C1C1C] rounded-md overflow-hidden bg-white transition-colors",
		children: [
			/* @__PURE__ */ jsx(MenuBar, { editor }),
			/* @__PURE__ */ jsx(EditorContent, { editor }),
			/* @__PURE__ */ jsx("style", {
				jsx: true,
				global: true,
				children: `
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #878A8C;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .ProseMirror iframe {
                    width: 100%;
                    min-height: 400px;
                }
                .editor-content {
                    font-family: inherit;
                }
                .editor-content p {
                    margin-bottom: 0.5em;
                }
                .editor-content h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
                .editor-content h2 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; }
                .editor-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
                .editor-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.5em; }
                .editor-content blockquote { border-left: 3px solid #EDEFF1; padding-left: 1em; margin-left: 0; color: #878A8C; font-style: italic; }
            `
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Post/Create.jsx
function CreatePost({ auth, communities, default_community_id, editPost }) {
	const { data, setData, post, put, processing, errors } = useForm({
		community_id: editPost?.community_id || default_community_id || "",
		title: editPost?.title || "",
		content: editPost?.content || "",
		type: editPost?.type || "TEXT",
		media_file: null,
		link_url: editPost?.link_url || ""
	});
	const isEdit = !!editPost;
	const submit = (e) => {
		e.preventDefault();
		if (isEdit) put(route("post.update", editPost.id));
		else post(route("post.store"));
	};
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) setData("media_file", e.target.files[0]);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#f8fafc] dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans pb-20 transition-colors relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[120px]" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-400/10 dark:bg-amber-600/10 blur-[120px]" })]
			}),
			/* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Post" : "Create a Post" }),
			/* @__PURE__ */ jsx(Navbar, { auth }),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-6xl mx-auto pt-32 px-4 flex flex-col lg:flex-row gap-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 mb-8",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400",
								children: /* @__PURE__ */ jsx(Sparkles, {
									size: 24,
									strokeWidth: 2
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
								className: "text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
								children: isEdit ? "Edit your post" : "Create a new post"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-slate-500 dark:text-zinc-400 text-sm font-medium mt-1",
								children: "Share your thoughts, questions, or resources with the community."
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mb-6 relative w-full sm:w-80 z-20",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsxs("select", {
									value: data.community_id,
									onChange: (e) => setData("community_id", e.target.value),
									className: "w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/40 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-zinc-500 focus:border-blue-500 rounded-2xl py-3.5 pl-4 pr-10 text-base font-bold text-slate-700 dark:text-zinc-200 outline-none appearance-none transition-all shadow-sm cursor-pointer",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										disabled: true,
										children: "Choose a community"
									}), communities.map((c) => /* @__PURE__ */ jsxs("option", {
										value: c.id,
										children: ["r/", c.name]
									}, c.id))]
								}), /* @__PURE__ */ jsx("div", {
									className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400",
									children: /* @__PURE__ */ jsx(ChevronDown, {
										size: 18,
										strokeWidth: 2.5
									})
								})]
							}), errors.community_id && /* @__PURE__ */ jsx("p", {
								className: "text-rose-500 text-xs mt-2 font-bold pl-2",
								children: errors.community_id
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-zinc-800/60 shadow-xl overflow-hidden",
							children: [/* @__PURE__ */ jsx("div", {
								className: "p-2 sm:p-3 border-b border-slate-100 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/40",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex p-1 bg-slate-100/50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 max-w-md mx-auto sm:mx-0",
									children: [
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setData("type", "TEXT"),
											className: `flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all border-0 outline-none focus:outline-none focus:ring-0 ${data.type === "TEXT" ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"}`,
											children: [
												/* @__PURE__ */ jsx(PencilLine, { size: 18 }),
												" ",
												/* @__PURE__ */ jsx("span", {
													className: "hidden sm:inline",
													children: "Post"
												})
											]
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setData("type", "MEDIA"),
											className: `flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all border-0 outline-none focus:outline-none focus:ring-0 ${data.type === "MEDIA" ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"}`,
											children: [
												/* @__PURE__ */ jsx(Image$1, { size: 18 }),
												" ",
												/* @__PURE__ */ jsx("span", {
													className: "hidden sm:inline",
													children: "Media"
												})
											]
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setData("type", "LINK"),
											className: `flex-1 py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all border-0 outline-none focus:outline-none focus:ring-0 ${data.type === "LINK" ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300"}`,
											children: [
												/* @__PURE__ */ jsx(Link$2, { size: 18 }),
												" ",
												/* @__PURE__ */ jsx("span", {
													className: "hidden sm:inline",
													children: "Link"
												})
											]
										})
									]
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "p-4 sm:p-8",
								children: /* @__PURE__ */ jsxs("form", {
									onSubmit: submit,
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "mb-6 relative group",
											children: [/* @__PURE__ */ jsx("input", {
												type: "text",
												placeholder: "An interesting title...",
												value: data.title,
												onChange: (e) => setData("title", e.target.value),
												maxLength: 300,
												className: "w-full bg-transparent border-none focus:border-transparent focus:ring-0 py-2 px-0 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white outline-none transition-colors placeholder-slate-300 dark:placeholder-zinc-600"
											}), /* @__PURE__ */ jsxs("div", {
												className: "absolute right-0 bottom-2 text-xs font-bold text-slate-300 dark:text-zinc-600 opacity-0 group-focus-within:opacity-100 transition-opacity",
												children: [data.title.length, "/300"]
											})]
										}),
										errors.title && /* @__PURE__ */ jsx("p", {
											className: "text-rose-500 text-sm font-bold mb-4",
											children: errors.title
										}),
										data.type === "TEXT" && /* @__PURE__ */ jsxs("div", {
											className: "mb-6",
											children: [/* @__PURE__ */ jsx("div", {
												className: "bg-white/50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-inner overflow-hidden",
												children: /* @__PURE__ */ jsx(TipTapEditor, {
													value: data.content,
													onChange: (html) => setData("content", html)
												})
											}), errors.content && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-sm font-bold mt-2",
												children: errors.content
											})]
										}),
										data.type === "MEDIA" && /* @__PURE__ */ jsxs("div", {
											className: "mb-6",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "border-2 border-dashed border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-colors",
												children: [/* @__PURE__ */ jsx("input", {
													type: "file",
													id: "media_file",
													accept: "image/*,video/*",
													onChange: handleFileChange,
													className: "hidden"
												}), data.media_file ? /* @__PURE__ */ jsxs("div", {
													className: "text-center",
													children: [
														/* @__PURE__ */ jsx("div", {
															className: "w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3",
															children: /* @__PURE__ */ jsx(CheckCircle2, { size: 32 })
														}),
														/* @__PURE__ */ jsx("p", {
															className: "font-bold text-lg text-slate-900 dark:text-white mb-2",
															children: data.media_file.name
														}),
														/* @__PURE__ */ jsx("label", {
															htmlFor: "media_file",
															className: "text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline text-sm",
															children: "Change File"
														})
													]
												}) : /* @__PURE__ */ jsxs("div", {
													className: "text-center",
													children: [
														/* @__PURE__ */ jsx("div", {
															className: "w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-zinc-700",
															children: /* @__PURE__ */ jsx(Image$1, {
																size: 32,
																className: "text-blue-500",
																strokeWidth: 1.5
															})
														}),
														/* @__PURE__ */ jsx("p", {
															className: "text-slate-500 dark:text-zinc-400 font-medium mb-4",
															children: "Drag and drop or click to upload media"
														}),
														/* @__PURE__ */ jsx("label", {
															htmlFor: "media_file",
															className: "px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-block",
															children: "Upload File"
														})
													]
												})]
											}), errors.media_file && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-sm font-bold mt-2",
												children: errors.media_file
											})]
										}),
										data.type === "LINK" && /* @__PURE__ */ jsxs("div", {
											className: "mb-6",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "relative",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
													children: /* @__PURE__ */ jsx(Link$2, { className: "h-5 w-5 text-slate-400" })
												}), /* @__PURE__ */ jsx("textarea", {
													placeholder: "https://...",
													value: data.link_url,
													onChange: (e) => setData("link_url", e.target.value),
													rows: "3",
													className: "w-full bg-white/50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl py-4 pl-12 pr-4 text-base font-medium text-slate-900 dark:text-white outline-none transition-all resize-none placeholder-slate-400 shadow-inner"
												})]
											}), errors.link_url && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-sm font-bold mt-2",
												children: errors.link_url
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex justify-end border-t border-slate-100 dark:border-zinc-800/60 pt-6 mt-4",
											children: [/* @__PURE__ */ jsx(Link, {
												href: "/feed",
												className: "px-8 py-3.5 font-bold text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors mr-2",
												children: "Cancel"
											}), /* @__PURE__ */ jsx("button", {
												type: "submit",
												disabled: processing,
												className: "px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-full transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md text-base",
												children: processing ? "Posting..." : isEdit ? "Update Post" : "Publish Post"
											})]
										})
									]
								})
							})]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "hidden lg:block w-[340px]",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-zinc-800/60 p-6 shadow-xl sticky top-28",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-zinc-800/60",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-500 border border-amber-200 dark:border-amber-800/50",
								children: /* @__PURE__ */ jsx(ListOrdered, {
									size: 24,
									strokeWidth: 2
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "font-extrabold text-slate-900 dark:text-white text-lg",
								children: "Community Rules"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs font-medium text-slate-500",
								children: "Please read before posting"
							})] })]
						}), /* @__PURE__ */ jsxs("ul", {
							className: "text-sm text-slate-700 dark:text-zinc-300 font-semibold space-y-4",
							children: [
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-start gap-3 group",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors",
										children: "1"
									}), /* @__PURE__ */ jsx("span", {
										className: "pt-0.5 leading-snug",
										children: "Remember the human and be respectful."
									})]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-start gap-3 group",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors",
										children: "2"
									}), /* @__PURE__ */ jsx("span", {
										className: "pt-0.5 leading-snug",
										children: "Behave like you would in real life."
									})]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-start gap-3 group",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-6 h-6 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors",
										children: "3"
									}), /* @__PURE__ */ jsx("span", {
										className: "pt-0.5 leading-snug",
										children: "Look for the original source of content."
									})]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-start gap-3 group",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-6 h-6 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-colors",
										children: "4"
									}), /* @__PURE__ */ jsx("span", {
										className: "pt-0.5 leading-snug",
										children: "Search for duplicates before posting."
									})]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-start gap-3 group",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors",
										children: "5"
									}), /* @__PURE__ */ jsx("span", {
										className: "pt-0.5 leading-snug",
										children: "Read the specific community's rules."
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
export { CreatePost as default };
