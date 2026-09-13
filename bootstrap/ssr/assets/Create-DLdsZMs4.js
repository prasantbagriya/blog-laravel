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
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Image as Image$1, Italic, Link as Link$2, List, ListOrdered, PencilLine, Quote, Strikethrough, Underline as Underline$1, Video } from "lucide-react";
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
function CreatePost({ communities, default_community_id, editPost }) {
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
		className: "min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20",
		children: [
			/* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Post" : "Create a Post" }),
			/* @__PURE__ */ jsx("header", {
				className: "sticky top-0 z-50 bg-white border-b border-[#EDEFF1]",
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
				className: "w-full mx-auto pt-8 px-4 flex gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ jsx("h1", {
							className: "text-[18px] font-bold text-[#1C1C1C] border-b border-[#EDEFF1] pb-3 mb-5",
							children: isEdit ? "Edit post" : "Create a post"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mb-5 relative w-72",
							children: [
								/* @__PURE__ */ jsxs("select", {
									value: data.community_id,
									onChange: (e) => setData("community_id", e.target.value),
									className: "w-full bg-white border border-black hover:border-[#1C1C1C] focus:border-[#1C1C1C] rounded-md py-2 px-3 text-[14px] font-medium outline-none appearance-none transition-colors cursor-pointer",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										disabled: true,
										children: "Choose a community"
									}), communities.map((c) => /* @__PURE__ */ jsxs("option", {
										value: c.id,
										children: ["r/", c.name]
									}, c.id))]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#878A8C]",
									children: /* @__PURE__ */ jsx("svg", {
										className: "fill-current h-4 w-4",
										xmlns: "http://www.w3.org/2000/svg",
										viewBox: "0 0 20 20",
										children: /* @__PURE__ */ jsx("path", { d: "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" })
									})
								}),
								errors.community_id && /* @__PURE__ */ jsx("p", {
									className: "text-red-500 text-xs mt-1",
									children: errors.community_id
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-md border border-[#EDEFF1] overflow-hidden",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex border-b border-[#EDEFF1]",
								children: [
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setData("type", "TEXT"),
										className: `flex-1 py-3.5 flex items-center justify-center gap-2 text-[14px] font-bold border-b-2 transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${data.type === "TEXT" ? "border-[#0079D3] text-[#0079D3]" : "text-[#878A8C] hover:bg-[#F6F7F8] border-transparent"}`,
										children: [/* @__PURE__ */ jsx(PencilLine, { size: 18 }), " Post"]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setData("type", "MEDIA"),
										className: `flex-1 py-3.5 flex items-center justify-center gap-2 text-[14px] font-bold border-b-2 transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${data.type === "MEDIA" ? "border-[#0079D3] text-[#0079D3]" : "text-[#878A8C] hover:bg-[#F6F7F8] border-transparent"}`,
										children: [/* @__PURE__ */ jsx(Image$1, { size: 18 }), " Images & Video"]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setData("type", "LINK"),
										className: `flex-1 py-3.5 flex items-center justify-center gap-2 text-[14px] font-bold border-b-2 transition-colors border-0 outline-none focus:outline-none focus:ring-0 ${data.type === "LINK" ? "border-[#0079D3] text-[#0079D3]" : "text-[#878A8C] hover:bg-[#F6F7F8] border-transparent"}`,
										children: [/* @__PURE__ */ jsx(Link$2, { size: 18 }), " Link"]
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "p-4",
								children: /* @__PURE__ */ jsxs("form", {
									onSubmit: submit,
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "mb-3 relative",
											children: [
												/* @__PURE__ */ jsx("input", {
													type: "text",
													placeholder: "Title",
													value: data.title,
													onChange: (e) => setData("title", e.target.value),
													maxLength: 300,
													className: "w-full bg-white border border-black focus:ring-1 focus:ring-black rounded-md py-2 px-3 text-[14px] font-medium outline-none transition-colors"
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "absolute right-3 top-2.5 text-[12px] text-[#878A8C] font-medium",
													children: [data.title.length, "/300"]
												}),
												errors.title && /* @__PURE__ */ jsx("p", {
													className: "text-red-500 text-xs mt-1",
													children: errors.title
												})
											]
										}),
										data.type === "TEXT" && /* @__PURE__ */ jsxs("div", {
											className: "mb-4",
											children: [/* @__PURE__ */ jsx(TipTapEditor, {
												value: data.content,
												onChange: (html) => setData("content", html)
											}), errors.content && /* @__PURE__ */ jsx("p", {
												className: "text-red-500 text-xs mt-1",
												children: errors.content
											})]
										}),
										data.type === "MEDIA" && /* @__PURE__ */ jsxs("div", {
											className: "mb-4",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "border-2 border-dashed border-[#EDEFF1] rounded-md p-10 flex flex-col items-center justify-center gap-4",
												children: [/* @__PURE__ */ jsx("input", {
													type: "file",
													id: "media_file",
													accept: "image/*,video/*",
													onChange: handleFileChange,
													className: "hidden"
												}), data.media_file ? /* @__PURE__ */ jsxs("div", {
													className: "text-center",
													children: [/* @__PURE__ */ jsx("p", {
														className: "font-bold text-[#1C1C1C] mb-2",
														children: data.media_file.name
													}), /* @__PURE__ */ jsx("label", {
														htmlFor: "media_file",
														className: "text-[#0079D3] font-bold cursor-pointer hover:underline text-[14px]",
														children: "Change File"
													})]
												}) : /* @__PURE__ */ jsx("label", {
													htmlFor: "media_file",
													className: "px-6 py-2 border border-[#0079D3] text-[#0079D3] font-bold rounded-full hover:bg-blue-50 cursor-pointer transition-colors",
													children: "Upload Image or Video"
												})]
											}), errors.media_file && /* @__PURE__ */ jsx("p", {
												className: "text-red-500 text-xs mt-1",
												children: errors.media_file
											})]
										}),
										data.type === "LINK" && /* @__PURE__ */ jsxs("div", {
											className: "mb-4",
											children: [/* @__PURE__ */ jsx("textarea", {
												placeholder: "Url",
												value: data.link_url,
												onChange: (e) => setData("link_url", e.target.value),
												rows: "3",
												className: "w-full bg-white border border-black focus:ring-1 focus:ring-black rounded-md py-2 px-3 text-[14px] outline-none transition-colors resize-y"
											}), errors.link_url && /* @__PURE__ */ jsx("p", {
												className: "text-red-500 text-xs mt-1",
												children: errors.link_url
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "flex justify-end border-t border-[#EDEFF1] pt-4",
											children: /* @__PURE__ */ jsx("button", {
												type: "submit",
												disabled: processing,
												className: "px-6 py-2 bg-[#0079D3] hover:bg-[#005a9e] text-white font-bold rounded-full transition-colors disabled:opacity-50",
												children: processing ? "Saving..." : isEdit ? "Update Post" : "Post"
											})
										})
									]
								})
							})]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "hidden lg:block w-[312px]",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-md border border-[#EDEFF1] p-3 mb-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 mb-3",
							children: [/* @__PURE__ */ jsx("img", {
								src: "https://www.redditstatic.com/desktop2x/img/snoo-home@2x.png",
								className: "w-10 h-10 object-contain"
							}), /* @__PURE__ */ jsx("h2", {
								className: "font-medium text-[16px]",
								children: "Posting to coachinginsikar"
							})]
						}), /* @__PURE__ */ jsxs("ol", {
							className: "text-[14px] text-[#1C1C1C] font-medium space-y-2 border-t border-[#EDEFF1] pt-3",
							children: [
								/* @__PURE__ */ jsx("li", {
									className: "border-b border-[#EDEFF1] pb-2",
									children: "1. Remember the human"
								}),
								/* @__PURE__ */ jsx("li", {
									className: "border-b border-[#EDEFF1] pb-2",
									children: "2. Behave like you would in real life"
								}),
								/* @__PURE__ */ jsx("li", {
									className: "border-b border-[#EDEFF1] pb-2",
									children: "3. Look for the original source of content"
								}),
								/* @__PURE__ */ jsx("li", {
									className: "border-b border-[#EDEFF1] pb-2",
									children: "4. Search for duplicates before posting"
								}),
								/* @__PURE__ */ jsx("li", { children: "5. Read the community's rules" })
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
