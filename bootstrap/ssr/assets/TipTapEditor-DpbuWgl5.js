import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback } from "react";
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Image, Italic, Link, List, ListOrdered, Quote, Strikethrough, Underline, Video } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link$1 from "@tiptap/extension-link";
import Image$1 from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Underline$1 from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
//#region resources/js/Components/TipTapEditor.jsx
var ToolbarButton = ({ onClick, disabled, isActive, title, children }) => /* @__PURE__ */ jsx("button", {
	type: "button",
	onClick,
	disabled,
	className: `p-1.5 rounded transition-colors flex items-center justify-center border-0 outline-none focus:outline-none focus:ring-0 ${isActive ? "bg-[#E2E2E2] dark:bg-zinc-700 text-[#1C1C1C] dark:text-zinc-100" : "text-[#878A8C] dark:text-zinc-400 hover:bg-[#E2E2E2] dark:hover:bg-zinc-700 hover:text-[#1C1C1C] dark:hover:text-zinc-100"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
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
	const Divider = () => /* @__PURE__ */ jsx("div", { className: "w-[1px] h-6 bg-gray-200 dark:bg-zinc-700 mx-1.5 hidden sm:block" });
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center gap-0.5 p-1.5 bg-[#F6F7F8] dark:bg-zinc-800 border-b border-[#EDEFF1] dark:border-zinc-700",
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
				children: /* @__PURE__ */ jsx(Underline, {
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
				children: /* @__PURE__ */ jsx(Link, { size: 18 })
			}),
			/* @__PURE__ */ jsx(ToolbarButton, {
				onClick: addImage,
				title: "Image URL",
				children: /* @__PURE__ */ jsx(Image, { size: 18 })
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
			Underline$1,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Link$1.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-[#0079D3] hover:underline",
					rel: "ugc nofollow",
					target: "_blank"
				}
			}),
			Image$1.configure({ HTMLAttributes: {
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
		editorProps: { attributes: { class: "prose max-w-none prose-sm sm:prose-base focus:outline-none min-h-[150px] p-4 text-[#1C1C1C] dark:text-zinc-200 dark:prose-invert editor-content" } },
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			if (html === "<p></p>" || html === "") onChange("");
			else onChange(html);
		}
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "border border-[#EDEFF1] dark:border-zinc-700 focus-within:border-[#1C1C1C] dark:focus-within:border-zinc-500 rounded-md overflow-hidden bg-white dark:bg-zinc-900 transition-colors",
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
export { TipTapEditor as default };
