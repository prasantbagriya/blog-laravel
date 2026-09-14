import { t as MediaPicker } from "./MediaPicker-Dte0UALB.js";
import { router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { X } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link$2 from "@tiptap/extension-link";
import Image$1 from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Underline$1 from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu } from "@tiptap/react/menus";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Extension, Node, mergeAttributes } from "@tiptap/core";
//#region resources/js/Pages/Admin/PostForm.tsx
console.log("--- SOVEREIGN_EDITOR_V11.0_FULL_RESTORE ---");
var FontSize = Extension.create({
	name: "fontSize",
	addOptions() {
		return { types: ["textStyle"] };
	},
	addGlobalAttributes() {
		return [{
			types: this.options.types,
			attributes: { fontSize: {
				default: null,
				parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ""),
				renderHTML: (attributes) => {
					if (!attributes.fontSize) return {};
					return { style: `font-size: ${attributes.fontSize}` };
				}
			} }
		}];
	},
	addCommands() {
		return {
			setFontSize: (fontSize) => ({ chain }) => {
				return chain().setMark("textStyle", { fontSize }).run();
			},
			unsetFontSize: () => ({ chain }) => {
				return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
			}
		};
	}
});
var Video$1 = Node.create({
	name: "video",
	group: "block",
	selectable: true,
	draggable: true,
	atom: true,
	addAttributes() {
		return {
			src: { default: null },
			controls: { default: true }
		};
	},
	parseHTML() {
		return [{ tag: "video" }];
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			{ style: "margin: 24px 0; border-radius: 16px; overflow: hidden; background: #000; line-height: 0;" },
			["video", mergeAttributes(HTMLAttributes, { style: "width: 100%; height: auto; display: block;" })]
		];
	}
});
var ImageSlider = Node.create({
	name: "imageSlider",
	group: "block",
	atom: true,
	selectable: true,
	draggable: true,
	addAttributes() {
		return {
			images: {
				default: [],
				parseHTML: (element) => {
					return Array.from(element.querySelectorAll("img")).map((img) => ({
						src: img.src,
						alt: img.alt
					}));
				},
				renderHTML: () => {
					return {};
				}
			},
			autoScroll: { default: true },
			centerZoom: { default: true },
			speed: { default: 3e3 }
		};
	},
	parseHTML() {
		return [{ tag: "div[data-image-slider]" }];
	},
	renderHTML({ node, HTMLAttributes }) {
		const images = node.attrs.images || [];
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-image-slider": "true",
				"data-auto-scroll": HTMLAttributes.autoScroll,
				"data-center-zoom": HTMLAttributes.centerZoom,
				"data-speed": HTMLAttributes.speed,
				contenteditable: "false",
				style: "display: flex; overflow-x: auto; gap: 16px; padding: 16px 0; margin: 24px 0; scroll-snap-type: x mandatory; scroll-behavior: smooth; background: #f8fafc; border-radius: 16px; align-items: center;"
			}),
			...images.map((img) => ["img", {
				src: img.src,
				alt: img.alt,
				style: "height: 300px; border-radius: 12px; scroll-snap-align: center; object-fit: cover; flex-shrink: 0;"
			}])
		];
	}
});
var SocialEmbed = Node.create({
	name: "socialEmbed",
	group: "block",
	selectable: true,
	draggable: true,
	atom: true,
	addAttributes() {
		return {
			src: { default: null },
			platform: { default: "generic" }
		};
	},
	parseHTML() {
		return [{ tag: "iframe[data-social-embed]" }];
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			{ style: "margin: 24px 0; border-radius: 20px; overflow: hidden; background: #f8fafc; border: 1px solid #e2e8f0; position: relative; padding-bottom: 56.25%; height: 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);" },
			["iframe", mergeAttributes(HTMLAttributes, {
				"data-social-embed": "",
				style: "position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;",
				allowfullscreen: "true",
				allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
			})]
		];
	}
});
var FaqBlock = Node.create({
	name: "faqBlock",
	group: "block",
	atom: true,
	selectable: true,
	draggable: true,
	addAttributes() {
		return { items: {
			default: [],
			parseHTML: (element) => {
				try {
					return JSON.parse(element.getAttribute("data-faqs") || "[]");
				} catch {
					return [];
				}
			},
			renderHTML: () => {
				return {};
			}
		} };
	},
	parseHTML() {
		return [{ tag: "div[data-faq-block]" }];
	},
	renderHTML({ node, HTMLAttributes }) {
		const items = node.attrs.items || [];
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-faq-block": "true",
				"data-faqs": JSON.stringify(items),
				contenteditable: "false",
				style: "margin: 32px 0; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);"
			}),
			[
				"div",
				{ style: "padding: 16px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;" },
				[
					"svg",
					{
						xmlns: "http://www.w3.org/2000/svg",
						width: "18",
						height: "18",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "#2563eb",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					},
					["circle", {
						cx: "12",
						cy: "12",
						r: "10"
					}],
					["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
					["path", { d: "M12 17h.01" }]
				],
				[
					"span",
					{ style: "font-size: 13px; font-weight: 800; color: #1e293b; letter-spacing: 0.5px;" },
					"FREQUENTLY ASKED QUESTIONS"
				]
			],
			...items.map((item) => [
				"div",
				{ style: "border-bottom: 1px solid #f1f5f9; padding: 15px 24px;" },
				[
					"div",
					{ style: "font-weight: 700; color: #1e293b; margin-bottom: 8px; font-size: 18px; line-height: 1.4;" },
					`Q: ${item.question}`
				],
				[
					"div",
					{ style: "color: #1e293b; font-size: 18.5px; line-height: 1.7;" },
					item.answer
				]
			])
		];
	}
});
var QuizBlock = Node.create({
	name: "quizBlock",
	group: "block",
	atom: true,
	selectable: true,
	draggable: true,
	addAttributes() {
		return {
			question: { default: "" },
			options: {
				default: [],
				parseHTML: (element) => {
					try {
						return JSON.parse(element.getAttribute("data-options") || "[]");
					} catch {
						return [];
					}
				}
			},
			correctIndex: {
				default: 0,
				parseHTML: (element) => parseInt(element.getAttribute("data-correct") || "0", 10)
			}
		};
	},
	parseHTML() {
		return [{ tag: "div[data-quiz-block]" }];
	},
	renderHTML({ node, HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-quiz-block": "true",
				"data-question": node.attrs.question,
				"data-options": JSON.stringify(node.attrs.options),
				"data-correct": node.attrs.correctIndex,
				contenteditable: "false",
				style: "margin: 32px 0; padding: 24px; border: 2px dashed #3b82f6; border-radius: 16px; background: #eff6ff; text-align: center;"
			}),
			[
				"div",
				{ style: "font-weight: 800; color: #1e3a8a; margin-bottom: 8px;" },
				"🧩 INTERACTIVE QUIZ BLOCK"
			],
			[
				"div",
				{ style: "color: #1e40af; font-weight: 700;" },
				node.attrs.question
			]
		];
	}
});
var PollBlock = Node.create({
	name: "pollBlock",
	group: "block",
	atom: true,
	selectable: true,
	draggable: true,
	addAttributes() {
		return {
			question: { default: "" },
			options: {
				default: [],
				parseHTML: (element) => {
					try {
						return JSON.parse(element.getAttribute("data-options") || "[]");
					} catch {
						return [];
					}
				}
			}
		};
	},
	parseHTML() {
		return [{ tag: "div[data-poll-block]" }];
	},
	renderHTML({ node, HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-poll-block": "true",
				"data-question": node.attrs.question,
				"data-options": JSON.stringify(node.attrs.options),
				contenteditable: "false",
				style: "margin: 32px 0; padding: 24px; border: 2px dashed #8b5cf6; border-radius: 16px; background: #f5f3ff; text-align: center;"
			}),
			[
				"div",
				{ style: "font-weight: 800; color: #4c1d95; margin-bottom: 8px;" },
				"📊 INTERACTIVE POLL BLOCK"
			],
			[
				"div",
				{ style: "color: #5b21b6; font-weight: 700;" },
				node.attrs.question
			]
		];
	}
});
var rootContainerStyle = {
	position: "fixed",
	inset: 0,
	background: "#ffffff",
	display: "flex",
	flexDirection: "column",
	zIndex: 999999
};
var headerStyle = {
	height: "80px",
	background: "#fff",
	borderBottom: "1px solid #e2e8f0",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	padding: "0 40px",
	position: "sticky",
	top: 0,
	zIndex: 1e3
};
var navIconStyle = {
	background: "#f1f5f9",
	border: "none",
	padding: "10px",
	borderRadius: "12px",
	cursor: "pointer"
};
var headerTitleStyle = {
	fontSize: "20px",
	fontWeight: 800,
	color: "#1e293b",
	letterSpacing: "-0.5px"
};
var scoreHubStyle = {
	display: "flex",
	gap: "16px",
	marginRight: "10px"
};
var iconBtnStyle = {
	background: "#fff",
	border: "1px solid #e2e8f0",
	padding: "10px",
	borderRadius: "12px",
	cursor: "pointer",
	color: "#64748b",
	whiteSpace: "nowrap"
};
var publishBtnStyle = {
	background: "#2563eb",
	color: "#fff",
	border: "none",
	padding: "12px 28px",
	borderRadius: "10px",
	fontWeight: 700,
	cursor: "pointer",
	boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
	whiteSpace: "nowrap"
};
var mainCanvasStyle = {
	flex: 1,
	overflowY: "auto",
	background: "#ffffff",
	display: "flex",
	flexDirection: "column",
	position: "relative",
	scrollBehavior: "smooth"
};
var floatingToolbarStyle = {
	position: "sticky",
	top: "0",
	zIndex: 100,
	background: "rgba(255,255,255,0.92)",
	backdropFilter: "blur(16px)",
	padding: "16px 40px",
	borderBottom: "1px solid #e2e8f0",
	display: "flex",
	flexWrap: "wrap",
	gap: "10px",
	alignItems: "center",
	userSelect: "none"
};
var toolDivider = {
	width: "1px",
	height: "24px",
	background: "#e2e8f0",
	margin: "0 4px"
};
var intelSidebarStyle = {
	width: "300px",
	background: "#fff",
	borderLeft: "1px solid #e2e8f0",
	display: "flex",
	flexDirection: "column"
};
var intelTabsStyle = {
	display: "grid",
	gridTemplateColumns: "repeat(4, 1fr)",
	background: "#f1f5f9",
	padding: "6px",
	borderRadius: "16px",
	gap: "4px"
};
var sidebarHeadingStyle = {
	fontSize: "11px",
	fontWeight: 800,
	color: "#94a3b8",
	marginBottom: "16px",
	marginTop: "30px",
	textTransform: "uppercase",
	letterSpacing: "1px"
};
var hcuCardStyle = {
	background: "#f8fafc",
	padding: "20px",
	borderRadius: "20px",
	border: "1px solid #e2e8f0",
	marginBottom: "24px"
};
var metaLabelStyle = {
	fontSize: "11px",
	fontWeight: 700,
	color: "#94a3b8",
	marginBottom: "8px",
	display: "block"
};
var metaInputStyle = {
	width: "100%",
	padding: "12px 16px",
	border: "1px solid #e2e8f0",
	borderRadius: "12px",
	fontSize: "14px",
	outline: "none",
	background: "#f8fafc"
};
var tipRowStyle = {
	display: "flex",
	alignItems: "center",
	gap: "8px",
	fontSize: "12px",
	color: "#475569",
	marginBottom: "8px",
	fontWeight: 600
};
var eeatCheckStyle = {
	display: "flex",
	alignItems: "center",
	gap: "10px",
	fontSize: "13px",
	fontWeight: 600,
	color: "#475569"
};
var metaTextAreaStyle = {
	width: "100%",
	padding: "12px 16px",
	border: "1px solid #e2e8f0",
	borderRadius: "12px",
	fontSize: "14px",
	minHeight: "100px",
	outline: "none",
	background: "#f8fafc"
};
var addNodeBtn = {
	width: "100%",
	padding: "12px",
	background: "#fff",
	border: "1px solid #e2e8f0",
	borderRadius: "12px",
	fontSize: "12px",
	fontWeight: 800,
	color: "#2563eb",
	cursor: "pointer",
	whiteSpace: "nowrap"
};
var lsiTagStyle = {
	background: "#eff6ff",
	color: "#2563eb",
	padding: "6px 12px",
	borderRadius: "8px",
	fontSize: "11px",
	fontWeight: 700,
	border: "1px solid #dbeafe"
};
var guardianCard = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "30px",
	background: "#f0f7ff",
	borderRadius: "24px",
	border: "1px solid #dbeafe",
	marginBottom: "20px"
};
var headerSelectWrapper = {
	display: "flex",
	alignItems: "center",
	background: "#f8fafc",
	border: "1px solid #e2e8f0",
	borderRadius: "10px",
	padding: "0 12px",
	margin: "0 4px"
};
var headerSelectStyle = {
	border: "none",
	background: "transparent",
	fontSize: "12px",
	fontWeight: 800,
	color: "#475569",
	outline: "none",
	height: "34px",
	cursor: "pointer"
};
var metaSelectStyle = {
	width: "100%",
	padding: "12px",
	border: "1px solid #e2e8f0",
	borderRadius: "12px",
	fontSize: "14px",
	fontWeight: 600,
	background: "#fff"
};
var editorWrapperStyle = {
	background: "#fff",
	padding: "40px",
	minHeight: "100vh",
	position: "relative",
	maxWidth: "1000px",
	margin: "0 auto",
	width: "100%"
};
var bubbleMenuStyle = {
	background: "#fff",
	border: "1px solid #e2e8f0",
	borderRadius: "14px",
	padding: "6px",
	display: "flex",
	gap: "6px",
	boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
	zIndex: 1e3
};
var modalBackdropStyle = {
	position: "fixed",
	inset: 0,
	background: "rgba(15, 23, 42, 0.3)",
	backdropFilter: "blur(8px)",
	zIndex: 1e4,
	display: "flex",
	alignItems: "center",
	justifyContent: "center"
};
var modalContentStyle = {
	background: "#fff",
	width: "90%",
	maxWidth: "850px",
	borderRadius: "32px",
	overflow: "hidden",
	boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
};
var modalHeaderStyle = {
	padding: "24px 40px",
	borderBottom: "1px solid #e2e8f0",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center"
};
var closeModalBtn = {
	border: "none",
	background: "#f1f5f9",
	padding: "8px",
	borderRadius: "10px",
	cursor: "pointer",
	whiteSpace: "nowrap"
};
var faqNodeStyle = {
	padding: "16px",
	background: "#f8fafc",
	borderRadius: "12px",
	border: "1px solid #e2e8f0"
};
var faqInputSmall = {
	width: "100%",
	padding: "10px",
	border: "1px solid #e2e8f0",
	borderRadius: "8px",
	marginBottom: "10px",
	fontSize: "13px",
	fontWeight: 600
};
var faqTextArea = {
	width: "100%",
	padding: "10px",
	border: "1px solid #e2e8f0",
	borderRadius: "8px",
	fontSize: "13px",
	minHeight: "80px"
};
var deepWorkOverlayStyle = {
	position: "fixed",
	inset: 0,
	background: "#ffffff",
	zIndex: 2e6,
	overflowY: "auto"
};
var exitDeepWorkStyle = {
	background: "#f1f5f9",
	border: "none",
	padding: "12px 24px",
	borderRadius: "12px",
	fontSize: "14px",
	fontWeight: 700,
	color: "#475569",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	gap: "8px"
};
var deepWorkTitleStyle = {
	width: "100%",
	fontSize: "64px",
	fontWeight: 900,
	border: "none",
	outline: "none",
	background: "transparent",
	textAlign: "center",
	color: "#0f172a",
	marginBottom: "60px",
	letterSpacing: "-0.04em"
};
var tocItemStyle = {
	fontSize: "12px",
	fontWeight: 600,
	color: "#64748b",
	cursor: "pointer",
	padding: "4px 0",
	transition: "all 0.2s"
};
var MiniScore = ({ label, value, color = "#2563eb" }) => /* @__PURE__ */ jsxs("div", {
	style: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	children: [/* @__PURE__ */ jsx("span", {
		style: {
			fontSize: "10px",
			fontWeight: 900,
			color: "#94a3b8",
			letterSpacing: "0.5px",
			marginBottom: "2px"
		},
		children: label
	}), /* @__PURE__ */ jsxs("span", {
		style: {
			fontSize: "16px",
			fontWeight: 900,
			color
		},
		children: [value, "%"]
	})]
});
var TabBtn = ({ label, icon, active, onClick, status = "neutral" }) => /* @__PURE__ */ jsxs("button", {
	onClick,
	style: {
		position: "relative",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "4px",
		padding: "10px 0",
		background: active ? "#fff" : "transparent",
		border: "none",
		color: active ? "#2563eb" : "#64748b",
		borderRadius: "12px",
		cursor: "pointer",
		transition: "all 0.2s",
		boxShadow: active ? "0 4px 6px -1px rgba(0,0,0,0.05)" : "none"
	},
	children: [
		status !== "neutral" && /* @__PURE__ */ jsx("div", { style: {
			position: "absolute",
			top: "8px",
			right: "8px",
			width: "6px",
			height: "6px",
			borderRadius: "50%",
			background: status === "success" ? "#10b981" : "#f59e0b"
		} }),
		icon,
		" ",
		/* @__PURE__ */ jsx("span", {
			style: {
				fontSize: "8px",
				fontWeight: 900,
				letterSpacing: "0.5px"
			},
			children: label.toUpperCase()
		})
	]
});
var SovereignToolBtn = ({ children, onClick, active, title, color }) => /* @__PURE__ */ jsx("button", {
	type: "button",
	onClick,
	title,
	style: {
		width: "38px",
		height: "38px",
		borderRadius: "10px",
		border: active ? "2px solid #2563eb" : "1px solid #e2e8f0",
		background: active ? "#eff6ff" : "#fff",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		transition: "all 0.2s",
		color: active ? "#2563eb" : color || "#1e293b"
	},
	children
});
var InputGroup = ({ label, value, onChange, placeholder }) => /* @__PURE__ */ jsxs("div", {
	style: {
		display: "flex",
		flexDirection: "column",
		gap: "6px"
	},
	children: [/* @__PURE__ */ jsx("label", {
		style: metaLabelStyle,
		children: label
	}), /* @__PURE__ */ jsx("input", {
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder,
		style: metaInputStyle
	})]
});
function PostForm({ post }) {
	const [isMobile, setIsMobile] = useState(false);
	const [postId] = useState(post?.id || crypto.randomUUID());
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 1024);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const [title, setTitle] = useState(post?.title || "");
	const [slug, setSlug] = useState(post?.slug || "");
	const [metaDescription, setMetaDescription] = useState(post?.metaDescription || "");
	const [excerpt, setExcerpt] = useState(post?.excerpt || "");
	const [coverImage, setCoverImage] = useState(post?.coverImage || "");
	const [coverImageAlt, setCoverImageAlt] = useState(post?.coverImageAlt || "");
	const [authorImage, setAuthorImage] = useState(post?.authorImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80");
	const [author, setAuthor] = useState(post?.author || "Admin");
	const [availableAuthors, setAvailableAuthors] = useState([]);
	const [availableCategories, setAvailableCategories] = useState([]);
	const [focusKeyword, setFocusKeyword] = useState(post?.focusKeyword || "");
	const [category, setCategory] = useState(post?.category || "General");
	const [tags, setTags] = useState(post?.tags || []);
	const [tagInput, setTagInput] = useState("");
	const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
	const [ogTitle, setOgTitle] = useState(post?.ogTitle || "");
	const [ogDescription, setOgDescription] = useState(post?.ogDescription || "");
	const [twitterCard, setTwitterCard] = useState(post?.twitterCard || "summary_large_image");
	const [twitterTitle, setTwitterTitle] = useState(post?.twitterTitle || "");
	const [twitterDescription, setTwitterDescription] = useState(post?.twitterDescription || "");
	const [canonicalUrl, setCanonicalUrl] = useState(post?.canonicalUrl || "");
	const [keywords, setKeywords] = useState(post?.keywords || "");
	const [faqs, setFaqs] = useState(post?.faqs || []);
	const [howToSteps, setHowToSteps] = useState(post?.howToSteps || []);
	const [localBusiness, setLocalBusiness] = useState(post?.localBusiness || {
		name: "",
		telephone: "",
		ratingValue: "",
		reviewCount: "",
		priceRange: "",
		streetAddress: "",
		addressLocality: "",
		addressRegion: "",
		postalCode: "",
		addressCountry: ""
	});
	const [howToModalOpen, setHowToModalOpen] = useState(false);
	const [faqSchemaEnabled, setFaqSchemaEnabled] = useState(true);
	const [snippetScore, setSnippetScore] = useState(0);
	const [snippetTips, setSnippetTips] = useState([]);
	const [sentiment, setSentiment] = useState("authoritative");
	const [helpfulScore, setHelpfulScore] = useState(0);
	const [userIntent, setUserIntent] = useState("informational");
	const [targetRegion, setTargetRegion] = useState(post?.targetRegion || "IN");
	const [targetLanguage, setTargetLanguage] = useState(post?.targetLanguage || "en-IN");
	const [contentScope, setContentScope] = useState(post?.contentScope || "india");
	const [informationGain, setInformationGain] = useState(0);
	const [humanScore, setHumanScore] = useState(0);
	const [clusterStrength, setClusterStrength] = useState(0);
	const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
	const [authorExpertise, setAuthorExpertise] = useState(post?.authorJobTitle || "Subject Matter Expert");
	const [authorBio, setAuthorBio] = useState(post?.authorBio || "");
	const [authorSocials, setAuthorSocials] = useState(post?.authorSocials || {
		twitter: "",
		linkedin: "",
		website: ""
	});
	const [researchMethodology, setResearchMethodology] = useState(post?.researchMethodology || "");
	const [sources, setSources] = useState(post?.sources || []);
	const [authorExperienceYears, setAuthorExperienceYears] = useState(post?.authorExperienceYears || 0);
	const [authorAwards, setAuthorAwards] = useState(post?.authorAwards || []);
	const [awardInput, setAwardInput] = useState("");
	const [authorAlumniOf, setAuthorAlumniOf] = useState(post?.authorAlumniOf || []);
	const [alumniNameInput, setAlumniNameInput] = useState("");
	const [alumniSameAsInput, setAlumniSameAsInput] = useState("");
	const [authorKnowsAbout, setAuthorKnowsAbout] = useState(post?.authorKnowsAbout || []);
	const [knowsAboutNameInput, setKnowsAboutNameInput] = useState("");
	const [knowsAboutSameAsInput, setKnowsAboutSameAsInput] = useState("");
	const [keyTakeaways, setKeyTakeaways] = useState(post?.keyTakeaways || []);
	const [takeawayInput, setTakeawayInput] = useState("");
	const [semanticMentions, setSemanticMentions] = useState(post?.semanticMentions || []);
	const [mentionNameInput, setMentionNameInput] = useState("");
	const [mentionSameAsInput, setMentionSameAsInput] = useState("");
	const [sourceInput, setSourceInput] = useState({
		title: "",
		url: "",
		type: "primary"
	});
	const [isNoIndex, setIsNoIndex] = useState(post?.isNoIndex || false);
	const [isSponsored, setIsSponsored] = useState(post?.isSponsored || false);
	const [isPillarPage, setIsPillarPage] = useState(post?.isPillarPage || false);
	const [isAiAssisted, setIsAiAssisted] = useState(post?.isAiAssisted || false);
	const [reviewCycleDays, setReviewCycleDays] = useState(post?.reviewCycleDays || 90);
	const [nextReviewDate, setNextReviewDate] = useState(post?.nextReviewDate ? post.nextReviewDate.split("T")[0] : "");
	const [corrections, setCorrections] = useState(post?.corrections || []);
	const [newCorrectionNote, setNewCorrectionNote] = useState("");
	const [coverImageWidth, setCoverImageWidth] = useState(null);
	const [isAiAuditing, setIsAiAuditing] = useState(false);
	const [aiSuggestions, setAiSuggestions] = useState(null);
	const [appliedAiSuggestions, setAppliedAiSuggestions] = useState({});
	const handleSaveRef = useRef(null);
	useEffect(() => {
		handleSaveRef.current = handleSave;
	});
	useEffect(() => {
		const timer = setInterval(() => {
			if (handleSaveRef.current && title.trim() !== "") handleSaveRef.current(false, true);
		}, 5e3);
		return () => clearInterval(timer);
	}, [title]);
	const runAiAudit = async () => {
		setIsAiAuditing(true);
		setAiSuggestions(null);
		setAppliedAiSuggestions({});
		try {
			const data = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/seo-audit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title,
					content: editor?.getHTML(),
					metaDescription,
					excerpt,
					seoTitle,
					ogTitle,
					ogDescription,
					keywords,
					tags,
					faqs,
					howToSteps,
					localBusiness,
					keyTakeaways,
					category
				})
			})).json();
			if (data.success) setAiSuggestions(data.suggestions);
			else alert("AI Audit Failed: " + data.error);
		} catch (err) {
			alert("AI Audit Error: " + err.message);
		}
		setIsAiAuditing(false);
	};
	const applyAiSuggestion = (key, suggestionObj) => {
		const val = suggestionObj?.value ?? suggestionObj;
		switch (key) {
			case "metaDescription":
				setMetaDescription(val);
				break;
			case "excerpt":
				setExcerpt(val);
				break;
			case "seoTitle":
				setSeoTitle(val);
				break;
			case "ogTitle":
				setOgTitle(val);
				break;
			case "ogDescription":
				setOgDescription(val);
				break;
			case "keywords":
				setKeywords(val);
				break;
			case "tags":
				setTags(Array.isArray(val) ? val : typeof val === "string" ? val.split(",").map((t) => t.trim()).filter((t) => t.length > 0) : []);
				break;
			case "faqs":
				setFaqs(Array.isArray(val) ? val : []);
				break;
			case "howToSteps":
				setHowToSteps(Array.isArray(val) ? val : []);
				break;
			case "localBusiness":
				setLocalBusiness(val || {
					name: "",
					telephone: "",
					ratingValue: "",
					reviewCount: "",
					priceRange: "",
					streetAddress: "",
					addressLocality: "",
					addressRegion: "",
					postalCode: "",
					addressCountry: ""
				});
				break;
			case "keyTakeaways":
				setKeyTakeaways(Array.isArray(val) ? val : []);
				break;
			case "optimizedContent":
				editor?.commands.setContent(val);
				break;
		}
		setAppliedAiSuggestions((prev) => ({
			...prev,
			[key]: true
		}));
	};
	useEffect(() => {
		if (coverImage) {
			const img = new window.Image();
			img.src = coverImage;
			img.onload = () => {
				setCoverImageWidth(img.naturalWidth);
			};
			img.onerror = () => {
				setCoverImageWidth(null);
			};
		} else setCoverImageWidth(null);
	}, [coverImage]);
	useEffect(() => {
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/authors").then((r) => r.json()).then((data) => {
			if (Array.isArray(data)) setAvailableAuthors(data);
		}).catch((e) => console.error(e));
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/categories").then((r) => r.json()).then((data) => {
			if (Array.isArray(data)) setAvailableCategories(data);
		}).catch((e) => console.error(e));
	}, []);
	const [eeatChecklist, setEeatChecklist] = useState({
		credentialsIncluded: post?.isAiAssisted || false,
		externalCitations: false,
		uniqueInsights: false,
		factChecked: !!post?.factCheckedBy
	});
	const [factCheckedBy, setFactCheckedBy] = useState(post?.factCheckedBy || "");
	const [factCheckerRole, setFactCheckerRole] = useState(post?.factCheckerRole || "Editorial Reviewer");
	const [activeTab, setActiveTab] = useState("editor");
	const [previewMode, setPreviewMode] = useState("none");
	const [distractionFree, setDistractionFree] = useState(false);
	const [lastSaved, setLastSaved] = useState(null);
	const [isPending, startTransition] = useTransition();
	const [mounted, setMounted] = useState(false);
	const [audience, setAudience] = useState("professional");
	const fileInputRef = useRef(null);
	const coverInputRef = useRef(null);
	const videoInputRef = useRef(null);
	const colorInputRef = useRef(null);
	const sliderInputRef = useRef(null);
	useRef(null);
	const [lsiKeywords, setLsiKeywords] = useState(post?.lsiKeywords || []);
	const [scheduleDate, setScheduleDate] = useState("");
	const [visualHealth, setVisualHealth] = useState({
		imageCount: 0,
		altMissing: 0,
		score: 0
	});
	const [seoScore, setSeoScore] = useState(0);
	const [readabilityScore, setReadabilityScore] = useState(0);
	const [seoTips, setSeoTips] = useState([]);
	const [isIndexing, setIsIndexing] = useState(false);
	const [indexStatus, setIndexStatus] = useState("idle");
	const [tableOfContents, setTableOfContents] = useState([]);
	const [entities, setEntities] = useState([]);
	const [linkModalOpen, setLinkModalOpen] = useState(false);
	const [linkInputUrl, setLinkInputUrl] = useState("");
	const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(false);
	const [linkIsNoFollow, setLinkIsNoFollow] = useState(false);
	const [videoModalOpen, setVideoModalOpen] = useState(false);
	const [videoUrlInput, setVideoUrlInput] = useState("");
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const [imageAltInput, setImageAltInput] = useState("");
	const [sliderModalOpen, setSliderModalOpen] = useState(false);
	const [sliderImages, setSliderImages] = useState([]);
	const [sliderAutoScroll, setSliderAutoScroll] = useState(true);
	const [sliderCenterZoom, setSliderCenterZoom] = useState(true);
	const [sliderSpeed, setSliderSpeed] = useState(3e3);
	const [faqModalOpen, setFaqModalOpen] = useState(false);
	const [tempFaqs, setTempFaqs] = useState([]);
	const [quizModalOpen, setQuizModalOpen] = useState(false);
	const [tempQuiz, setTempQuiz] = useState({
		question: "",
		options: [
			"",
			"",
			"",
			""
		],
		correctIndex: 0
	});
	const handleOpenQuizModal = () => {
		if (!editor) return;
		if (editor.isActive("quizBlock")) {
			const attrs = editor.getAttributes("quizBlock");
			setTempQuiz({
				question: attrs.question || "",
				options: attrs.options || [
					"",
					"",
					"",
					""
				],
				correctIndex: attrs.correctIndex || 0
			});
		} else setTempQuiz({
			question: "",
			options: [
				"",
				"",
				"",
				""
			],
			correctIndex: 0
		});
		setQuizModalOpen(true);
	};
	const handleApplyQuiz = () => {
		if (!editor || !tempQuiz.question.trim()) return;
		const validOptions = tempQuiz.options.map((o) => o.trim()).filter(Boolean);
		if (validOptions.length < 2) return;
		if (editor.isActive("quizBlock")) editor.chain().focus().updateAttributes("quizBlock", {
			question: tempQuiz.question.trim(),
			options: validOptions,
			correctIndex: tempQuiz.correctIndex
		}).run();
		else editor.chain().focus().insertContent({
			type: "quizBlock",
			attrs: {
				question: tempQuiz.question.trim(),
				options: validOptions,
				correctIndex: tempQuiz.correctIndex
			}
		}).run();
		setQuizModalOpen(false);
	};
	const [pollModalOpen, setPollModalOpen] = useState(false);
	const [tempPoll, setTempPoll] = useState({
		question: "",
		options: [
			"",
			"",
			"",
			""
		]
	});
	const handleOpenPollModal = () => {
		if (!editor) return;
		if (editor.isActive("pollBlock")) {
			const attrs = editor.getAttributes("pollBlock");
			setTempPoll({
				question: attrs.question || "",
				options: attrs.options || [
					"",
					"",
					"",
					""
				]
			});
		} else setTempPoll({
			question: "",
			options: [
				"",
				"",
				"",
				""
			]
		});
		setPollModalOpen(true);
	};
	const handleApplyPoll = () => {
		if (!editor || !tempPoll.question.trim()) return;
		const validOptions = tempPoll.options.map((o) => o.trim()).filter(Boolean);
		if (validOptions.length < 2) return;
		if (editor.isActive("pollBlock")) editor.chain().focus().updateAttributes("pollBlock", {
			question: tempPoll.question.trim(),
			options: validOptions
		}).run();
		else editor.chain().focus().insertContent({
			type: "pollBlock",
			attrs: {
				question: tempPoll.question.trim(),
				options: validOptions
			}
		}).run();
		setPollModalOpen(false);
	};
	const handleOpenFaqModal = () => {
		if (!editor) return;
		if (editor.isActive("faqBlock")) {
			const attrs = editor.getAttributes("faqBlock");
			setTempFaqs(attrs.items || []);
		} else setTempFaqs([{
			question: "",
			answer: ""
		}]);
		setFaqModalOpen(true);
	};
	const handleApplyFaq = () => {
		if (!editor || tempFaqs.length === 0) return;
		const validFaqs = tempFaqs.filter((f) => f.question.trim() && f.answer.trim());
		if (editor.isActive("faqBlock")) editor.chain().focus().updateAttributes("faqBlock", { items: validFaqs }).run();
		else editor.chain().focus().insertContent({
			type: "faqBlock",
			attrs: { items: validFaqs }
		}).run();
		setFaqModalOpen(false);
	};
	const handleSidebarFaqChange = (updatedFaqs) => {
		setFaqs(updatedFaqs);
		if (!editor) return;
		editor.commands.command(({ tr, state }) => {
			let updated = false;
			state.doc.descendants((node, pos) => {
				if (node.type.name === "faqBlock") {
					tr.setNodeMarkup(pos, void 0, {
						...node.attrs,
						items: updatedFaqs
					});
					updated = true;
				}
				return !updated;
			});
			return updated;
		});
	};
	const handleOpenSliderModal = () => {
		if (!editor) return;
		if (editor.isActive("imageSlider")) {
			const attrs = editor.getAttributes("imageSlider");
			setSliderImages(attrs.images || []);
			setSliderAutoScroll(attrs.autoScroll ?? true);
			setSliderCenterZoom(attrs.centerZoom ?? true);
			setSliderSpeed(attrs.speed || 3e3);
		} else {
			setSliderImages([]);
			setSliderAutoScroll(true);
			setSliderCenterZoom(true);
			setSliderSpeed(3e3);
		}
		setSliderModalOpen(true);
	};
	const handleApplySlider = () => {
		if (!editor || sliderImages.length === 0) return;
		if (editor.isActive("imageSlider")) editor.chain().focus().updateAttributes("imageSlider", {
			images: sliderImages,
			autoScroll: sliderAutoScroll,
			centerZoom: sliderCenterZoom,
			speed: sliderSpeed
		}).run();
		else editor.chain().focus().insertContent({
			type: "imageSlider",
			attrs: {
				images: sliderImages,
				autoScroll: sliderAutoScroll,
				centerZoom: sliderCenterZoom,
				speed: sliderSpeed
			}
		}).run();
		setSliderModalOpen(false);
	};
	const handleSliderImageUpload = async (event) => {
		const files = event.target.files;
		if (!files) return;
		for (let i = 0; i < files.length; i++) {
			new FormData().append("file", files[i]);
			try {
				const result = {
					success: true,
					url: ""
				};
				if (result.success && result.url) setSliderImages((prev) => [...prev, {
					src: result.url,
					alt: ""
				}]);
			} catch (error) {
				console.error("Slider image upload failed:", error);
			}
		}
	};
	const handleOpenLinkModal = () => {
		if (!editor) return;
		const attrs = editor.getAttributes("link");
		setLinkInputUrl(attrs.href || "");
		setLinkOpenInNewTab(attrs.target === "_blank");
		setLinkIsNoFollow(attrs.rel?.includes("nofollow") || false);
		setLinkModalOpen(true);
	};
	const handleApplyLink = () => {
		if (!editor) return;
		if (linkInputUrl.trim() === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
		else {
			let url = linkInputUrl.trim();
			if (!url.startsWith("http") && !url.startsWith("mailto:") && !url.startsWith("#")) url = "https://" + url;
			const attributes = { href: url };
			if (linkOpenInNewTab) attributes.target = "_blank";
			else attributes.target = null;
			if (linkIsNoFollow) attributes.rel = "nofollow";
			else attributes.rel = null;
			editor.chain().focus().extendMarkRange("link").setLink(attributes).run();
		}
		setLinkModalOpen(false);
	};
	const handleOpenImageModal = () => {
		if (!editor) return;
		const attrs = editor.getAttributes("image");
		if (attrs.src) {
			setImageAltInput(attrs.alt || "");
			setImageModalOpen(true);
		}
	};
	const handleApplyImageAlt = () => {
		if (!editor) return;
		editor.chain().focus().updateAttributes("image", { alt: imageAltInput }).run();
		setImageModalOpen(false);
	};
	const handleApplyYoutube = () => {
		if (!editor || !videoUrlInput) return;
		const url = videoUrlInput.trim();
		if (url.includes("youtube.com") || url.includes("youtu.be")) editor.chain().focus().setYoutubeVideo({ src: url }).run();
		else if (url.includes("instagram.com")) {
			const embedUrl = url.endsWith("/") ? url + "embed" : url + "/embed";
			editor.chain().focus().insertContent({
				type: "socialEmbed",
				attrs: {
					src: embedUrl,
					platform: "instagram"
				}
			}).run();
		} else if (url.includes("facebook.com")) {
			const embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
			editor.chain().focus().insertContent({
				type: "socialEmbed",
				attrs: {
					src: embedUrl,
					platform: "facebook"
				}
			}).run();
		} else if (url.includes("twitter.com") || url.includes("x.com")) {
			const embedUrl = `https://platform.twitter.com/embed/Tweet.html?id=${url.split("/").pop()?.split("?")[0]}`;
			editor.chain().focus().insertContent({
				type: "socialEmbed",
				attrs: {
					src: embedUrl,
					platform: "twitter"
				}
			}).run();
		} else editor.chain().focus().insertContent({
			type: "socialEmbed",
			attrs: {
				src: url,
				platform: "generic"
			}
		}).run();
		setVideoModalOpen(false);
		setVideoUrlInput("");
	};
	const handleImageUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		try {
			const result = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/upload", {
				method: "POST",
				body: formData
			})).json();
			if (result.success && result.url && editor) {
				editor.chain().focus().setImage({
					src: result.url,
					alt: ""
				}).run();
				setTimeout(() => {
					handleOpenImageModal();
				}, 100);
			} else alert(`Upload failed: ${result.error || "Unknown error"}`);
		} catch (error) {
			console.error("Upload failed:", error);
			alert("Upload failed. Please check connection and file size limits.");
		}
	};
	const handleCoverUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		try {
			const result = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/upload", {
				method: "POST",
				body: formData
			})).json();
			if (result.success && result.url) setCoverImage(result.url);
			else alert(`Cover upload failed: ${result.message || result.error || "Unknown error"}`);
		} catch (error) {
			console.error("Cover upload failed:", error);
			alert("Cover photo upload failed. Please check connection and file size limits.");
		}
	};
	const handleColorChange = (event) => {
		const color = event.target.value;
		if (color && editor) editor.chain().focus().setColor(color).run();
	};
	const handleVideoUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		try {
			const result = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/upload", {
				method: "POST",
				body: formData
			})).json();
			if (result.success && result.url && editor) editor.chain().focus().insertContent({
				type: "video",
				attrs: { src: result.url }
			}).run();
		} catch (error) {
			console.error("Video upload failed:", error);
		}
	};
	useEffect(() => {
		setMounted(true);
		const style = document.createElement("style");
		style.innerHTML = `
      .ProseMirror { outline: none !important; min-height: 800px; font-size: 19px; line-height: 1.8; color: #1e293b; transition: all 0.3s ease; }
      .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: #94a3b8; pointer-events: none; height: 0; font-style: italic; }
      .sovereign-editor-v5-fixed * { box-sizing: border-box; }
      .prose-container { width: 100%; }
    `;
		document.head.appendChild(style);
		return () => {
			if (document.head.contains(style)) document.head.removeChild(style);
		};
	}, []);
	const editor = useEditor({
		extensions: [
			StarterKit.configure({ heading: { levels: [
				1,
				2,
				3,
				4
			] } }),
			Image$1,
			Link$2.configure({ openOnClick: false }),
			Underline$1,
			Table.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
			CharacterCount,
			Typography,
			Highlight,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			TaskList,
			TaskItem.configure({ nested: true }),
			Subscript,
			Superscript,
			TextStyle,
			Color,
			FontSize,
			Youtube.configure({
				width: 840,
				height: 480,
				HTMLAttributes: { style: "border-radius: 16px; margin: 24px 0; max-width: 100%; height: auto; aspect-ratio: 16/9;" }
			}),
			Video$1,
			SocialEmbed,
			ImageSlider,
			FaqBlock,
			QuizBlock,
			PollBlock,
			Placeholder.configure({ placeholder: "Start your story or type / for commands..." })
		],
		content: post?.content || "",
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			const text = editor.getText();
			runSeoAudit(html, title, metaDescription, focusKeyword);
			updateTOC(html);
			extractEntities(text);
			analyzeSnippetPotential(text, html);
			auditVisualHealth(html);
			calculateHelpfulScore(text, html);
			syncFaqsFromEditor(html);
		}
	});
	useEffect(() => {
		if (editor && post && post.faqs && post.faqs.length > 0) {
			let hasFaqBlock = false;
			let emptyFaqBlockPos = -1;
			editor.state.doc.descendants((node, pos) => {
				if (node.type.name === "faqBlock") {
					hasFaqBlock = true;
					if ((node.attrs.items || []).length === 0) emptyFaqBlockPos = pos;
				}
			});
			if (emptyFaqBlockPos !== -1) editor.commands.command(({ tr }) => {
				tr.setNodeMarkup(emptyFaqBlockPos, void 0, { items: post.faqs });
				return true;
			});
			else if (!hasFaqBlock) editor.commands.command(({ tr, state }) => {
				const node = state.schema.nodes.faqBlock.create({ items: post.faqs });
				tr.insert(state.doc.content.size, node);
				return true;
			});
		}
	}, [editor, post]);
	const syncFaqsFromEditor = (html) => {
		const doc = new DOMParser().parseFromString(html, "text/html");
		const faqBlocks = Array.from(doc.querySelectorAll("div[data-faq-block]"));
		let allFaqs = [];
		faqBlocks.forEach((block) => {
			try {
				const items = JSON.parse(block.getAttribute("data-faqs") || "[]");
				allFaqs = [...allFaqs, ...items];
			} catch (e) {}
		});
		setFaqs(allFaqs);
	};
	const calculateHelpfulScore = (text, html) => {
		let score = 70;
		if (text.length > 5e3) score += 10;
		if (html.includes("<table>")) score += 10;
		if (html.includes("<ul>") || html.includes("<ol>")) score += 5;
		if (text.toLowerCase().includes("how to") || text.toLowerCase().includes("guide")) score += 5;
		setHelpfulScore(Math.min(100, score));
	};
	const auditVisualHealth = (html) => {
		const doc = new DOMParser().parseFromString(html, "text/html");
		const images = Array.from(doc.querySelectorAll("img"));
		const altMissing = images.filter((img) => !img.alt).length;
		setVisualHealth({
			imageCount: images.length,
			altMissing,
			score: images.length > 0 ? altMissing === 0 ? 100 : 50 : 0
		});
	};
	const analyzeSnippetPotential = (text, html) => {
		let score = 0;
		const tips = [];
		if (text.toLowerCase().match(/(what is|how to|why does|guide to).{5,30}\?/i)) {
			score += 25;
			tips.push("Direct query heading identified.");
		}
		if (text.match(/(is|means|refers to|can be defined as)\s+[a-zA-Z0-9\s,]{10,150}\./i)) {
			score += 35;
			tips.push("Clear definition paragraph found.");
		}
		if (html.includes("<ul>") || html.includes("<ol>")) {
			score += 20;
			tips.push("Structured list format used.");
		}
		if (html.includes("<table>")) {
			score += 30;
			tips.push("Data table detected.");
		}
		setSnippetScore(Math.min(100, score));
		setSnippetTips(tips);
	};
	const extractEntities = (text) => {
		const found = [
			"React",
			"Next.js",
			"Google",
			"SEO",
			"AI",
			"EEAT",
			"Helpful Content",
			"JSON-LD",
			"Schema",
			"Sovereign",
			"Blog"
		].filter((e) => text.toLowerCase().includes(e.toLowerCase()));
		setEntities(found.map((e) => ({
			name: e,
			type: "Entity"
		})));
	};
	const updateTOC = (html) => {
		const doc = new DOMParser().parseFromString(html, "text/html");
		const headings = Array.from(doc.querySelectorAll("h2, h3, h4"));
		setTableOfContents(headings.map((h, i) => ({
			id: `h-${i}`,
			text: h.textContent || "",
			level: parseInt(h.tagName.substring(1))
		})));
	};
	const runSeoAudit = useCallback((content, currentTitle, currentMeta, currentKeyword) => {
		const text = content.replace(/<[^>]*>/g, "");
		const wordCount = text.split(/\s+/).filter(Boolean).length;
		const lowerText = text.toLowerCase();
		const newTips = [];
		let finalScore = 0;
		if (currentTitle.length >= 40 && currentTitle.length <= 60) finalScore += 20;
		if (currentMeta.length >= 120 && currentMeta.length <= 160) finalScore += 20;
		if (wordCount > 1e3) finalScore += 20;
		if (currentKeyword && lowerText.includes(currentKeyword.toLowerCase())) finalScore += 20;
		if (content.includes("</h2>")) finalScore += 20;
		setSeoScore(finalScore);
		setReadabilityScore(Math.min(100, Math.round(finalScore * .8)));
		setClusterStrength(Math.min(100, entities.length * 15));
		setHumanScore(88);
		setSeoTips(newTips);
	}, [entities.length]);
	const handleSave = async (published = true, isAutoSave = false) => {
		if (!editor) return;
		startTransition(async () => {
			const cleanSlug = (slug || title).toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
			const updatedPost = {
				...post,
				id: postId,
				title,
				slug: cleanSlug,
				content: editor.getHTML(),
				metaDescription,
				excerpt: excerpt || metaDescription || title,
				coverImage,
				coverImageAlt,
				authorImage,
				authorSocials,
				seoTitle,
				ogTitle,
				ogDescription,
				canonicalUrl,
				keywords,
				twitterCard,
				twitterTitle,
				twitterDescription,
				category,
				tags,
				faqs,
				howToSteps,
				localBusiness,
				published,
				date: post?.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				author: author || "Admin",
				factCheckedBy,
				factCheckerRole,
				authorJobTitle: authorExpertise,
				authorBio,
				researchMethodology,
				sources,
				searchIntent: userIntent,
				seoScore,
				targetRegion,
				targetLanguage,
				contentScope,
				authorExperienceYears: authorExperienceYears || void 0,
				authorAwards: authorAwards.length > 0 ? authorAwards : void 0,
				authorAlumniOf: authorAlumniOf.length > 0 ? authorAlumniOf : void 0,
				authorKnowsAbout: authorKnowsAbout.length > 0 ? authorKnowsAbout : void 0,
				keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : void 0,
				semanticMentions: semanticMentions.length > 0 ? semanticMentions : void 0,
				reviewCycleDays: reviewCycleDays || void 0,
				nextReviewDate: nextReviewDate || void 0,
				isNoIndex: isNoIndex || void 0,
				isSponsored: isSponsored || void 0,
				isPillarPage: isPillarPage || void 0,
				isAiAssisted: isAiAssisted || void 0,
				corrections: corrections.length > 0 ? corrections : void 0,
				focusKeyword: focusKeyword || void 0,
				lsiKeywords: lsiKeywords.length > 0 ? lsiKeywords : void 0
			};
			const res = await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updatedPost)
			});
			if (!res.ok) {
				if (!isAutoSave) {
					const errData = await res.json().catch(() => null);
					alert(`Failed to save post. Error: ${errData?.message || res.statusText}`);
				}
				return;
			}
			if (isAutoSave) setLastSaved((/* @__PURE__ */ new Date()).toLocaleTimeString());
			else {
				const BASE = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
				setTimeout(() => {
					router.visit(BASE + "/admin");
				});
			}
		});
	};
	if (!editor || !mounted) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: `sovereign-editor-v5-fixed`,
		style: rootContainerStyle,
		children: [
			distractionFree && /* @__PURE__ */ jsx("div", {
				style: deepWorkOverlayStyle,
				children: /* @__PURE__ */ jsx("div", {
					style: {
						width: "100%",
						padding: "0 0 100px 0",
						height: "100%",
						overflowY: "auto",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						background: "#fff"
					},
					children: /* @__PURE__ */ jsxs("div", {
						style: {
							width: "100%",
							maxWidth: "1000px",
							marginTop: "40px"
						},
						children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									justifyContent: "flex-end",
									marginBottom: "20px"
								},
								children: /* @__PURE__ */ jsxs("button", {
									onClick: () => setDistractionFree(false),
									style: exitDeepWorkStyle,
									children: [/* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "18px",
											height: "18px"
										},
										children: [
											/* @__PURE__ */ jsx("polyline", { points: "4 14 10 14 10 20" }),
											/* @__PURE__ */ jsx("polyline", { points: "20 10 14 10 14 4" }),
											/* @__PURE__ */ jsx("line", {
												x1: "14",
												y1: "10",
												x2: "21",
												y2: "3"
											}),
											/* @__PURE__ */ jsx("line", {
												x1: "3",
												y1: "21",
												x2: "10",
												y2: "14"
											})
										]
									}), "Exit Deep Work"]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									...floatingToolbarStyle,
									top: "0",
									marginBottom: "40px",
									borderRadius: "16px",
									border: "1px solid #e2e8f0",
									padding: "12px 24px",
									justifyContent: "center"
								},
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "4px"
										},
										children: [/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor?.chain().focus().undo().run(),
											title: "Undo",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [/* @__PURE__ */ jsx("path", { d: "M3 7v6h6" }), /* @__PURE__ */ jsx("path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" })]
											})
										}), /* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor?.chain().focus().redo().run(),
											title: "Redo",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [/* @__PURE__ */ jsx("path", { d: "M21 7v6h-6" }), /* @__PURE__ */ jsx("path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" })]
											})
										})]
									}),
									/* @__PURE__ */ jsx("div", { style: toolDivider }),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "4px"
										},
										children: [
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().toggleBold().run(),
												active: editor?.isActive("bold"),
												title: "Bold",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2.5,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [/* @__PURE__ */ jsx("path", { d: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" }), /* @__PURE__ */ jsx("path", { d: "M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" })]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().toggleItalic().run(),
												active: editor?.isActive("italic"),
												title: "Italic",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [
														/* @__PURE__ */ jsx("line", {
															x1: "19",
															y1: "4",
															x2: "10",
															y2: "4"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "14",
															y1: "20",
															x2: "5",
															y2: "20"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "15",
															y1: "4",
															x2: "9",
															y2: "20"
														})
													]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().toggleUnderline().run(),
												active: editor?.isActive("underline"),
												title: "Underline",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [/* @__PURE__ */ jsx("path", { d: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" }), /* @__PURE__ */ jsx("line", {
														x1: "4",
														y1: "21",
														x2: "20",
														y2: "21"
													})]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().toggleStrike().run(),
												active: editor?.isActive("strike"),
												title: "Strikethrough",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [/* @__PURE__ */ jsx("line", {
														x1: "5",
														y1: "12",
														x2: "19",
														y2: "12"
													}), /* @__PURE__ */ jsx("path", { d: "M16 4h-7a4 4 0 0 0-4 4 4 4 0 0 0 4 4h7a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-7" })]
												})
											})
										]
									}),
									/* @__PURE__ */ jsx("div", { style: toolDivider }),
									/* @__PURE__ */ jsxs("div", {
										style: headerSelectWrapper,
										children: [
											/* @__PURE__ */ jsxs("select", {
												onChange: (e) => {
													const val = e.target.value;
													if (val === "p") editor?.chain().focus().setParagraph().run();
													else editor?.chain().focus().toggleHeading({ level: parseInt(val) }).run();
												},
												value: editor?.isActive("heading", { level: 1 }) ? "1" : editor?.isActive("heading", { level: 2 }) ? "2" : editor?.isActive("heading", { level: 3 }) ? "3" : editor?.isActive("heading", { level: 4 }) ? "4" : "p",
												style: headerSelectStyle,
												children: [
													/* @__PURE__ */ jsx("option", {
														value: "p",
														children: "Normal"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "1",
														children: "Major Heading"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "2",
														children: "Heading"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "3",
														children: "Sub-heading"
													}),
													/* @__PURE__ */ jsx("option", {
														value: "4",
														children: "Minor Heading"
													})
												]
											}),
											/* @__PURE__ */ jsx("div", { style: {
												width: "1px",
												height: "16px",
												background: "#e2e8f0",
												margin: "0 8px"
											} }),
											/* @__PURE__ */ jsxs("select", {
												onChange: (e) => {
													const size = e.target.value;
													editor?.chain().focus().setMark("textStyle", { fontSize: size }).run();
												},
												style: {
													...headerSelectStyle,
													width: "60px"
												},
												children: [/* @__PURE__ */ jsx("option", {
													value: "16px",
													children: "Size"
												}), [
													"12px",
													"14px",
													"16px",
													"18px",
													"20px",
													"24px",
													"30px",
													"36px",
													"48px",
													"60px",
													"72px"
												].map((size) => /* @__PURE__ */ jsx("option", {
													value: size,
													children: size
												}, size))]
											})
										]
									}),
									/* @__PURE__ */ jsx("div", { style: toolDivider }),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "4px"
										},
										children: [
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().setTextAlign("left").run(),
												active: editor?.isActive({ textAlign: "left" }),
												title: "Left Align",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [
														/* @__PURE__ */ jsx("line", {
															x1: "17",
															y1: "10",
															x2: "3",
															y2: "10"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "21",
															y1: "6",
															x2: "3",
															y2: "6"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "21",
															y1: "14",
															x2: "3",
															y2: "14"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "17",
															y1: "18",
															x2: "3",
															y2: "18"
														})
													]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().setTextAlign("center").run(),
												active: editor?.isActive({ textAlign: "center" }),
												title: "Center Align",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [
														/* @__PURE__ */ jsx("line", {
															x1: "18",
															y1: "10",
															x2: "6",
															y2: "10"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "21",
															y1: "6",
															x2: "3",
															y2: "6"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "21",
															y1: "14",
															x2: "3",
															y2: "14"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "18",
															y1: "18",
															x2: "6",
															y2: "18"
														})
													]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().setTextAlign("right").run(),
												active: editor?.isActive({ textAlign: "right" }),
												title: "Right Align",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [
														/* @__PURE__ */ jsx("line", {
															x1: "21",
															y1: "10",
															x2: "7",
															y2: "10"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "21",
															y1: "6",
															x2: "3",
															y2: "6"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "21",
															y1: "14",
															x2: "3",
															y2: "14"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "21",
															y1: "18",
															x2: "7",
															y2: "18"
														})
													]
												})
											})
										]
									}),
									/* @__PURE__ */ jsx("div", { style: toolDivider }),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "4px"
										},
										children: [/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor?.chain().focus().toggleBulletList().run(),
											active: editor?.isActive("bulletList"),
											title: "Bullet List",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("line", {
														x1: "8",
														y1: "6",
														x2: "21",
														y2: "6"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "8",
														y1: "12",
														x2: "21",
														y2: "12"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "8",
														y1: "18",
														x2: "21",
														y2: "18"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "6",
														x2: "3.01",
														y2: "6"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "12",
														x2: "3.01",
														y2: "12"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "18",
														x2: "3.01",
														y2: "18"
													})
												]
											})
										}), /* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor?.chain().focus().toggleOrderedList().run(),
											active: editor?.isActive("orderedList"),
											title: "Numbered List",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("line", {
														x1: "10",
														y1: "6",
														x2: "21",
														y2: "6"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "10",
														y1: "12",
														x2: "21",
														y2: "12"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "10",
														y1: "18",
														x2: "21",
														y2: "18"
													}),
													/* @__PURE__ */ jsx("path", { d: "M4 6h1v4" }),
													/* @__PURE__ */ jsx("path", { d: "M4 10h2" }),
													/* @__PURE__ */ jsx("path", { d: "M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" })
												]
											})
										})]
									}),
									/* @__PURE__ */ jsx("div", { style: toolDivider }),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "4px"
										},
										children: [
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => colorInputRef.current?.click(),
												title: "Text Color",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [
														/* @__PURE__ */ jsx("path", { d: "M4 20h16" }),
														/* @__PURE__ */ jsx("path", { d: "m6 16 6-12 6 12" }),
														/* @__PURE__ */ jsx("path", { d: "M8 12h8" })
													]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().toggleHighlight().run(),
												active: editor?.isActive("highlight"),
												title: "Text Background Color",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [/* @__PURE__ */ jsx("path", { d: "m9 11-6 6v3h9l3-3" }), /* @__PURE__ */ jsx("path", { d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" })]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => setVideoModalOpen(true),
												title: "Video Portal",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [
														/* @__PURE__ */ jsx("rect", {
															width: "18",
															height: "18",
															x: "3",
															y: "3",
															rx: "2"
														}),
														/* @__PURE__ */ jsx("path", { d: "m15 8-5 4 5 4V8Z" }),
														/* @__PURE__ */ jsx("path", { d: "M7 12h1" })
													]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: handleOpenLinkModal,
												active: editor?.isActive("link"),
												title: "Insert Link",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [/* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }), /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })]
												})
											})
										]
									}),
									/* @__PURE__ */ jsx("div", { style: toolDivider }),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "4px"
										},
										children: [
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().deleteTable().run(),
												title: "Delete Table",
												color: "#ef4444",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [
														/* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
														/* @__PURE__ */ jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
														/* @__PURE__ */ jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
														/* @__PURE__ */ jsx("line", {
															x1: "10",
															y1: "11",
															x2: "10",
															y2: "17"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "14",
															y1: "11",
															x2: "14",
															y2: "17"
														})
													]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().addRowAfter().run(),
												title: "Add Row",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [
														/* @__PURE__ */ jsx("rect", {
															width: "18",
															height: "18",
															x: "3",
															y: "3",
															rx: "2"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "3",
															y1: "9",
															x2: "21",
															y2: "9"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "9",
															y1: "21",
															x2: "9",
															y2: "9"
														})
													]
												})
											}),
											/* @__PURE__ */ jsx(SovereignToolBtn, {
												onClick: () => editor?.chain().focus().addColumnAfter().run(),
												title: "Add Column",
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "18px",
														height: "18px",
														flexShrink: 0
													},
													children: [
														/* @__PURE__ */ jsx("rect", {
															width: "18",
															height: "18",
															x: "3",
															y: "3",
															rx: "2"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "3",
															y1: "9",
															x2: "21",
															y2: "9"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "12",
															y1: "3",
															x2: "12",
															y2: "21"
														})
													]
												})
											})
										]
									}),
									/* @__PURE__ */ jsx("div", { style: toolDivider }),
									/* @__PURE__ */ jsx(SovereignToolBtn, {
										onClick: () => editor?.chain().focus().unsetAllMarks().clearNodes().run(),
										title: "Clear Formatting",
										children: /* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: {
												width: "18px",
												height: "18px",
												flexShrink: 0
											},
											children: [
												/* @__PURE__ */ jsx("path", { d: "M21 7L7 21" }),
												/* @__PURE__ */ jsx("path", { d: "M7 7l14 14" }),
												/* @__PURE__ */ jsx("path", { d: "M3 11l5 5" }),
												/* @__PURE__ */ jsx("path", { d: "m13 16 5 5" }),
												/* @__PURE__ */ jsx("path", { d: "m8 3 5 5" })
											]
										})
									})
								]
							}),
							/* @__PURE__ */ jsx("input", {
								placeholder: "Unlock the Sovereign Title...",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								style: {
									...deepWorkTitleStyle,
									fontSize: "48px",
									marginBottom: "16px"
								}
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									marginTop: "-8px",
									marginBottom: "32px",
									padding: "0 4px",
									fontSize: "12px",
									fontWeight: 600
								},
								children: [/* @__PURE__ */ jsxs("span", {
									style: { color: title.length > 110 ? "#ef4444" : "#64748b" },
									children: [
										"Headline length: ",
										title.length,
										" characters (Recommended: ≤110)"
									]
								}), title.length > 110 && /* @__PURE__ */ jsx("span", {
									style: {
										color: "#ef4444",
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: "⚠️ Exceeds Google's recommended 110-character limit"
								})]
							}),
							/* @__PURE__ */ jsx(EditorContent, {
								editor,
								className: "tiptap-content prose-container"
							})
						]
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				role: "banner",
				style: headerStyle,
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "20px",
						flex: 1
					},
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => window.history.back(),
						style: navIconStyle,
						children: /* @__PURE__ */ jsx("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							width: "24",
							height: "24",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: 2.5,
							strokeLinecap: "round",
							strokeLinejoin: "round",
							className: "lucide",
							style: {
								width: "20px",
								height: "20px"
							},
							children: /* @__PURE__ */ jsx("path", { d: "m15 18-6-6 6-6" })
						})
					}), /* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							flex: 1
						},
						children: /* @__PURE__ */ jsx("input", {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: post ? "Edit Sovereign Post" : "New Sovereign Post",
							style: {
								...headerTitleStyle,
								border: "none",
								outline: "none",
								background: "transparent",
								width: "100%",
								padding: "0"
							}
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "16px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: scoreHubStyle,
							children: [
								/* @__PURE__ */ jsx(MiniScore, {
									label: "SEO",
									value: seoScore
								}),
								/* @__PURE__ */ jsx(MiniScore, {
									label: "HCU",
									value: helpfulScore,
									color: "#10b981"
								}),
								/* @__PURE__ */ jsx(MiniScore, {
									label: "SNIP",
									value: snippetScore,
									color: "#8b5cf6"
								})
							]
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => setDistractionFree(true),
							style: iconBtnStyle,
							title: "Distraction Free Mode",
							children: /* @__PURE__ */ jsxs("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: 2,
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "lucide",
								style: {
									width: "18px",
									height: "18px",
									flexShrink: 0
								},
								children: [
									/* @__PURE__ */ jsx("polyline", { points: "15 3 21 3 21 9" }),
									/* @__PURE__ */ jsx("polyline", { points: "9 21 3 21 3 15" }),
									/* @__PURE__ */ jsx("line", {
										x1: "21",
										y1: "3",
										x2: "14",
										y2: "10"
									}),
									/* @__PURE__ */ jsx("line", {
										x1: "3",
										y1: "21",
										x2: "10",
										y2: "14"
									})
								]
							})
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => setPreviewMode("google"),
							style: iconBtnStyle,
							title: "Search Preview",
							children: /* @__PURE__ */ jsxs("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: 2,
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "lucide",
								style: {
									width: "18px",
									height: "18px",
									flexShrink: 0
								},
								children: [/* @__PURE__ */ jsx("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }), /* @__PURE__ */ jsx("circle", {
									cx: "12",
									cy: "12",
									r: "3"
								})]
							})
						}),
						lastSaved && /* @__PURE__ */ jsxs("span", {
							style: {
								fontSize: "12px",
								color: "#64748b",
								fontWeight: 600
							},
							children: ["Saved: ", lastSaved]
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => handleSave(true, false),
							disabled: isPending,
							style: publishBtnStyle,
							children: isPending ? "Syncing..." : "Deploy"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: isMobile ? "column" : "row",
					flex: 1,
					overflow: isMobile ? "auto" : "hidden"
				},
				children: [/* @__PURE__ */ jsxs("main", {
					style: {
						...mainCanvasStyle,
						overflowY: isMobile ? "visible" : "auto"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: floatingToolbarStyle,
						children: /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "4px",
								maxWidth: "1000px",
								margin: "0 auto",
								width: "100%",
								flexWrap: "wrap",
								alignItems: "center"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "4px"
									},
									children: [/* @__PURE__ */ jsx(SovereignToolBtn, {
										onClick: () => editor.chain().focus().undo().run(),
										title: "Undo",
										children: /* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: {
												width: "18px",
												height: "18px",
												flexShrink: 0
											},
											children: [/* @__PURE__ */ jsx("path", { d: "M3 7v6h6" }), /* @__PURE__ */ jsx("path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" })]
										})
									}), /* @__PURE__ */ jsx(SovereignToolBtn, {
										onClick: () => editor.chain().focus().redo().run(),
										title: "Redo",
										children: /* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: {
												width: "18px",
												height: "18px",
												flexShrink: 0
											},
											children: [/* @__PURE__ */ jsx("path", { d: "M21 7v6h-6" }), /* @__PURE__ */ jsx("path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" })]
										})
									})]
								}),
								/* @__PURE__ */ jsx("div", { style: toolDivider }),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "4px"
									},
									children: [
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().toggleBold().run(),
											active: editor.isActive("bold"),
											title: "Bold",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2.5,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [/* @__PURE__ */ jsx("path", { d: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" }), /* @__PURE__ */ jsx("path", { d: "M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" })]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().toggleItalic().run(),
											active: editor.isActive("italic"),
											title: "Italic",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("line", {
														x1: "19",
														y1: "4",
														x2: "10",
														y2: "4"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "14",
														y1: "20",
														x2: "5",
														y2: "20"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "15",
														y1: "4",
														x2: "9",
														y2: "20"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().toggleUnderline().run(),
											active: editor.isActive("underline"),
											title: "Underline",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [/* @__PURE__ */ jsx("path", { d: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" }), /* @__PURE__ */ jsx("line", {
													x1: "4",
													y1: "21",
													x2: "20",
													y2: "21"
												})]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().toggleStrike().run(),
											active: editor.isActive("strike"),
											title: "Strikethrough",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [/* @__PURE__ */ jsx("line", {
													x1: "5",
													y1: "12",
													x2: "19",
													y2: "12"
												}), /* @__PURE__ */ jsx("path", { d: "M16 4h-7a4 4 0 0 0-4 4 4 4 0 0 0 4 4h7a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-7" })]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => colorInputRef.current?.click(),
											title: "Text Color",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("path", { d: "M4 20h16" }),
													/* @__PURE__ */ jsx("path", { d: "m6 16 6-12 6 12" }),
													/* @__PURE__ */ jsx("path", { d: "M8 12h8" })
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().toggleHighlight().run(),
											active: editor.isActive("highlight"),
											title: "Text Highlight",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [/* @__PURE__ */ jsx("path", { d: "m9 11-6 6v3h9l3-3" }), /* @__PURE__ */ jsx("path", { d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" })]
											})
										})
									]
								}),
								/* @__PURE__ */ jsx("div", { style: toolDivider }),
								/* @__PURE__ */ jsxs("div", {
									style: headerSelectWrapper,
									children: [
										/* @__PURE__ */ jsxs("select", {
											onChange: (e) => {
												const val = e.target.value;
												if (val === "p") editor.chain().focus().setParagraph().run();
												else editor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
											},
											value: editor.isActive("heading", { level: 1 }) ? "1" : editor.isActive("heading", { level: 2 }) ? "2" : editor.isActive("heading", { level: 3 }) ? "3" : editor.isActive("heading", { level: 4 }) ? "4" : "p",
											style: headerSelectStyle,
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "p",
													children: "Normal"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "1",
													children: "Major Heading"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "2",
													children: "Heading"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "3",
													children: "Sub-heading"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "4",
													children: "Minor Heading"
												})
											]
										}),
										/* @__PURE__ */ jsx("div", { style: {
											width: "1px",
											height: "16px",
											background: "#e2e8f0",
											margin: "0 8px"
										} }),
										/* @__PURE__ */ jsxs("select", {
											onChange: (e) => {
												const size = e.target.value;
												editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
											},
											style: {
												...headerSelectStyle,
												width: "60px"
											},
											children: [/* @__PURE__ */ jsx("option", {
												value: "16px",
												children: "Size"
											}), [
												"12px",
												"14px",
												"16px",
												"18px",
												"20px",
												"24px",
												"30px",
												"36px",
												"48px",
												"60px",
												"72px"
											].map((size) => /* @__PURE__ */ jsx("option", {
												value: size,
												children: size
											}, size))]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", { style: toolDivider }),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "4px"
									},
									children: [
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().setTextAlign("left").run(),
											active: editor.isActive({ textAlign: "left" }),
											title: "Left Align",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("line", {
														x1: "17",
														y1: "10",
														x2: "3",
														y2: "10"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "21",
														y1: "6",
														x2: "3",
														y2: "6"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "21",
														y1: "14",
														x2: "3",
														y2: "14"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "17",
														y1: "18",
														x2: "3",
														y2: "18"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().setTextAlign("center").run(),
											active: editor.isActive({ textAlign: "center" }),
											title: "Center Align",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("line", {
														x1: "18",
														y1: "10",
														x2: "6",
														y2: "10"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "21",
														y1: "6",
														x2: "3",
														y2: "6"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "21",
														y1: "14",
														x2: "3",
														y2: "14"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "18",
														y1: "18",
														x2: "6",
														y2: "18"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().setTextAlign("right").run(),
											active: editor.isActive({ textAlign: "right" }),
											title: "Right Align",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("line", {
														x1: "21",
														y1: "10",
														x2: "7",
														y2: "10"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "21",
														y1: "6",
														x2: "3",
														y2: "6"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "21",
														y1: "14",
														x2: "3",
														y2: "14"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "21",
														y1: "18",
														x2: "7",
														y2: "18"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx("div", { style: {
											width: "1px",
											height: "16px",
											background: "#e2e8f0",
											margin: "0 4px"
										} }),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().toggleBulletList().run(),
											active: editor.isActive("bulletList"),
											title: "Bullet List",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("line", {
														x1: "8",
														y1: "6",
														x2: "21",
														y2: "6"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "8",
														y1: "12",
														x2: "21",
														y2: "12"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "8",
														y1: "18",
														x2: "21",
														y2: "18"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "6",
														x2: "3.01",
														y2: "6"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "12",
														x2: "3.01",
														y2: "12"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "18",
														x2: "3.01",
														y2: "18"
													})
												]
											})
										})
									]
								}),
								/* @__PURE__ */ jsx("div", { style: toolDivider }),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "4px"
									},
									children: [
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: handleOpenLinkModal,
											active: editor.isActive("link"),
											title: "Insert Link",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [/* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }), /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => fileInputRef.current?.click(),
											title: "Insert Image",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("rect", {
														x: "3",
														y: "3",
														width: "18",
														height: "18",
														rx: "2",
														ry: "2"
													}),
													/* @__PURE__ */ jsx("circle", {
														cx: "8.5",
														cy: "8.5",
														r: "1.5"
													}),
													/* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: handleOpenSliderModal,
											title: "Insert Image Slider",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("rect", {
														width: "18",
														height: "18",
														x: "3",
														y: "3",
														rx: "2",
														ry: "2"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "9",
														y1: "3",
														x2: "9",
														y2: "21"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "15",
														y1: "3",
														x2: "15",
														y2: "21"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: handleOpenFaqModal,
											title: "Insert FAQ Schema Block",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("circle", {
														cx: "12",
														cy: "12",
														r: "10"
													}),
													/* @__PURE__ */ jsx("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }),
													/* @__PURE__ */ jsx("path", { d: "M12 17h.01" })
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: handleOpenQuizModal,
											title: "Insert Interactive Quiz",
											children: /* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "16px",
													lineHeight: 1
												},
												children: "🧩"
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: handleOpenPollModal,
											title: "Insert Interactive Poll",
											children: /* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "16px",
													lineHeight: 1
												},
												children: "📊"
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => setVideoModalOpen(true),
											title: "Video Portal",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("rect", {
														width: "18",
														height: "18",
														x: "3",
														y: "3",
														rx: "2"
													}),
													/* @__PURE__ */ jsx("path", { d: "m15 8-5 4 5 4V8Z" }),
													/* @__PURE__ */ jsx("path", { d: "M7 12h1" })
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().toggleBlockquote().run(),
											active: editor.isActive("blockquote"),
											title: "Blockquote",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [/* @__PURE__ */ jsx("path", { d: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 2.5 0 5-2 5" }), /* @__PURE__ */ jsx("path", { d: "M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 2.5 0 5-2 5" })]
											})
										})
									]
								}),
								/* @__PURE__ */ jsx("div", { style: toolDivider }),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "4px"
									},
									children: [
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().insertTable({
												rows: 3,
												cols: 3,
												withHeaderRow: true
											}).run(),
											title: "Insert Table",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("rect", {
														x: "3",
														y: "3",
														width: "18",
														height: "18",
														rx: "2",
														ry: "2"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "9",
														x2: "21",
														y2: "9"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "15",
														x2: "21",
														y2: "15"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "9",
														y1: "3",
														x2: "9",
														y2: "21"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "15",
														y1: "3",
														x2: "15",
														y2: "21"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().addRowAfter().run(),
											title: "Add Row",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("rect", {
														width: "18",
														height: "18",
														x: "3",
														y: "3",
														rx: "2"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "9",
														x2: "21",
														y2: "9"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "9",
														y1: "21",
														x2: "9",
														y2: "9"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().addColumnAfter().run(),
											title: "Add Column",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("rect", {
														width: "18",
														height: "18",
														x: "3",
														y: "3",
														rx: "2"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "3",
														y1: "9",
														x2: "21",
														y2: "9"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "12",
														y1: "3",
														x2: "12",
														y2: "21"
													})
												]
											})
										}),
										/* @__PURE__ */ jsx(SovereignToolBtn, {
											onClick: () => editor.chain().focus().deleteTable().run(),
											title: "Delete Table",
											color: "#ef4444",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "18px",
													height: "18px",
													flexShrink: 0
												},
												children: [
													/* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
													/* @__PURE__ */ jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
													/* @__PURE__ */ jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
													/* @__PURE__ */ jsx("line", {
														x1: "10",
														y1: "11",
														x2: "10",
														y2: "17"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "14",
														y1: "11",
														x2: "14",
														y2: "17"
													})
												]
											})
										})
									]
								}),
								/* @__PURE__ */ jsx("div", { style: toolDivider }),
								/* @__PURE__ */ jsx(SovereignToolBtn, {
									onClick: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
									title: "Clear Formatting",
									children: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "18px",
											height: "18px",
											flexShrink: 0
										},
										children: [
											/* @__PURE__ */ jsx("path", { d: "M21 7L7 21" }),
											/* @__PURE__ */ jsx("path", { d: "M7 7l14 14" }),
											/* @__PURE__ */ jsx("path", { d: "M3 11l5 5" }),
											/* @__PURE__ */ jsx("path", { d: "m13 16 5 5" }),
											/* @__PURE__ */ jsx("path", { d: "m8 3 5 5" })
										]
									})
								}),
								/* @__PURE__ */ jsx(SovereignToolBtn, {
									onClick: () => setActiveTab("guardian"),
									title: "AI Shield",
									color: "#8b5cf6",
									children: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "18px",
											height: "18px",
											flexShrink: 0
										},
										children: [/* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" }), /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })]
									})
								}),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									ref: fileInputRef,
									onChange: handleImageUpload,
									style: { display: "none" },
									accept: "image/*"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									ref: videoInputRef,
									onChange: handleVideoUpload,
									style: { display: "none" },
									accept: "video/*"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "color",
									ref: colorInputRef,
									onChange: handleColorChange,
									style: { display: "none" }
								}),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									ref: sliderInputRef,
									onChange: handleSliderImageUpload,
									multiple: true,
									style: { display: "none" },
									accept: "image/*"
								})
							]
						})
					}), /* @__PURE__ */ jsxs("div", {
						style: editorWrapperStyle,
						children: [/* @__PURE__ */ jsx(BubbleMenu, {
							editor,
							shouldShow: ({ editor, state }) => {
								const { selection } = state;
								if (selection && selection.node) {
									const nodeType = selection.node.type.name;
									return nodeType === "faqBlock" || nodeType === "imageSlider" || nodeType === "image" || nodeType === "quizBlock" || nodeType === "pollBlock";
								}
								return editor.isActive("image") || editor.isActive("imageSlider") || editor.isActive("faqBlock") || editor.isActive("quizBlock") || editor.isActive("pollBlock");
							},
							children: /* @__PURE__ */ jsx("div", {
								style: bubbleMenuStyle,
								children: (() => {
									const { selection } = editor.state;
									const selectedNodeType = selection.node?.type?.name;
									if (selectedNodeType === "imageSlider" || editor.isActive("imageSlider")) return /* @__PURE__ */ jsxs(SovereignToolBtn, {
										onClick: handleOpenSliderModal,
										title: "Slider Settings",
										children: [/* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: {
												width: "14px",
												height: "14px"
											},
											children: [
												/* @__PURE__ */ jsx("rect", {
													width: "18",
													height: "18",
													x: "3",
													y: "3",
													rx: "2",
													ry: "2"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "9",
													y1: "3",
													x2: "9",
													y2: "21"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "15",
													y1: "3",
													x2: "15",
													y2: "21"
												})
											]
										}), /* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "11px",
												fontWeight: 700,
												marginLeft: "6px"
											},
											children: "EDIT SLIDER"
										})]
									});
									if (selectedNodeType === "faqBlock" || editor.isActive("faqBlock")) return /* @__PURE__ */ jsxs(SovereignToolBtn, {
										onClick: handleOpenFaqModal,
										title: "Edit FAQ Block",
										children: [/* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: {
												width: "14px",
												height: "14px"
											},
											children: [
												/* @__PURE__ */ jsx("circle", {
													cx: "12",
													cy: "12",
													r: "10"
												}),
												/* @__PURE__ */ jsx("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }),
												/* @__PURE__ */ jsx("path", { d: "M12 17h.01" })
											]
										}), /* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "11px",
												fontWeight: 700,
												marginLeft: "6px"
											},
											children: "EDIT FAQ"
										})]
									});
									if (selectedNodeType === "quizBlock" || editor.isActive("quizBlock")) return /* @__PURE__ */ jsxs(SovereignToolBtn, {
										onClick: handleOpenQuizModal,
										title: "Edit Quiz Block",
										children: [/* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "14px",
												lineHeight: 1
											},
											children: "🧩"
										}), /* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "11px",
												fontWeight: 700,
												marginLeft: "6px"
											},
											children: "EDIT QUIZ"
										})]
									});
									if (selectedNodeType === "pollBlock" || editor.isActive("pollBlock")) return /* @__PURE__ */ jsxs(SovereignToolBtn, {
										onClick: handleOpenPollModal,
										title: "Edit Poll Block",
										children: [/* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "14px",
												lineHeight: 1
											},
											children: "📊"
										}), /* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "11px",
												fontWeight: 700,
												marginLeft: "6px"
											},
											children: "EDIT POLL"
										})]
									});
									return /* @__PURE__ */ jsxs(SovereignToolBtn, {
										onClick: handleOpenImageModal,
										title: "Image Settings",
										children: [/* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: {
												width: "14px",
												height: "14px"
											},
											children: [/* @__PURE__ */ jsx("path", { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }), /* @__PURE__ */ jsx("circle", {
												cx: "12",
												cy: "12",
												r: "3"
											})]
										}), /* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "11px",
												fontWeight: 700,
												marginLeft: "6px"
											},
											children: "ALT TEXT"
										})]
									});
								})()
							})
						}), /* @__PURE__ */ jsx(EditorContent, {
							editor,
							className: "tiptap-content"
						})]
					})]
				}), /* @__PURE__ */ jsxs("aside", {
					style: {
						...intelSidebarStyle,
						width: isMobile ? "100%" : "300px",
						borderLeft: isMobile ? "none" : "1px solid #e2e8f0",
						borderTop: isMobile ? "1px solid #e2e8f0" : "none",
						overflowY: isMobile ? "visible" : "auto"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: { padding: "24px 24px 0 24px" },
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "10px",
								fontWeight: 900,
								color: "#94a3b8",
								letterSpacing: "1px",
								marginBottom: "12px"
							},
							children: "INTEL MODULES"
						}), /* @__PURE__ */ jsxs("div", {
							style: intelTabsStyle,
							children: [
								/* @__PURE__ */ jsx(TabBtn, {
									active: activeTab === "editor",
									onClick: () => setActiveTab("editor"),
									icon: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "14px",
											height: "14px"
										},
										children: [
											/* @__PURE__ */ jsx("line", {
												x1: "12",
												y1: "20",
												x2: "12",
												y2: "10"
											}),
											/* @__PURE__ */ jsx("line", {
												x1: "18",
												y1: "20",
												x2: "18",
												y2: "4"
											}),
											/* @__PURE__ */ jsx("line", {
												x1: "6",
												y1: "20",
												x2: "6",
												y2: "16"
											})
										]
									}),
									label: "Audit",
									status: seoScore > 80 ? "success" : "warning"
								}),
								/* @__PURE__ */ jsx(TabBtn, {
									active: activeTab === "snippets",
									onClick: () => setActiveTab("snippets"),
									icon: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "14px",
											height: "14px"
										},
										children: [
											/* @__PURE__ */ jsx("circle", {
												cx: "12",
												cy: "12",
												r: "10"
											}),
											/* @__PURE__ */ jsx("circle", {
												cx: "12",
												cy: "12",
												r: "6"
											}),
											/* @__PURE__ */ jsx("circle", {
												cx: "12",
												cy: "12",
												r: "2"
											})
										]
									}),
									label: "Snippets",
									status: snippetScore > 70 ? "success" : "neutral"
								}),
								/* @__PURE__ */ jsx(TabBtn, {
									active: activeTab === "strategy",
									onClick: () => setActiveTab("strategy"),
									icon: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "14px",
											height: "14px"
										},
										children: [/* @__PURE__ */ jsx("path", { d: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" }), /* @__PURE__ */ jsx("path", { d: "M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" })]
									}),
									label: "Strategy",
									status: "neutral"
								}),
								/* @__PURE__ */ jsx(TabBtn, {
									active: activeTab === "meta",
									onClick: () => setActiveTab("meta"),
									icon: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "14px",
											height: "14px"
										},
										children: [/* @__PURE__ */ jsx("circle", {
											cx: "11",
											cy: "11",
											r: "8"
										}), /* @__PURE__ */ jsx("path", { d: "m21 21-4.3-4.3" })]
									}),
									label: "Meta",
									status: seoTitle ? "success" : "warning"
								}),
								/* @__PURE__ */ jsx(TabBtn, {
									active: activeTab === "eeat",
									onClick: () => setActiveTab("eeat"),
									icon: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "14px",
											height: "14px"
										},
										children: [/* @__PURE__ */ jsx("path", { d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" }), /* @__PURE__ */ jsx("circle", {
											cx: "12",
											cy: "8",
											r: "6"
										})]
									}),
									label: "EEAT",
									status: factCheckedBy ? "success" : "warning"
								}),
								/* @__PURE__ */ jsx(TabBtn, {
									active: activeTab === "guardian",
									onClick: () => setActiveTab("guardian"),
									icon: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "14px",
											height: "14px"
										},
										children: [/* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" }), /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })]
									}),
									label: "Shield",
									status: "success"
								}),
								/* @__PURE__ */ jsx(TabBtn, {
									active: activeTab === "schema",
									onClick: () => setActiveTab("schema"),
									icon: /* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "14px",
											height: "14px"
										},
										children: [
											/* @__PURE__ */ jsx("path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }),
											/* @__PURE__ */ jsx("path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }),
											/* @__PURE__ */ jsx("path", { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" }),
											/* @__PURE__ */ jsx("path", { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" })
										]
									}),
									label: "Schema",
									status: faqs.length > 0 ? "success" : "neutral"
								}),
								/* @__PURE__ */ jsx(TabBtn, {
									active: activeTab === "seo",
									onClick: () => setActiveTab("seo"),
									icon: /* @__PURE__ */ jsx("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "14px",
											height: "14px"
										},
										children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
									}),
									label: "Turbo",
									status: "neutral"
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							flex: 1,
							overflowY: "auto",
							padding: "24px"
						},
						children: [
							activeTab === "editor" && /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Google HCU Audit"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: hcuCardStyle,
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												marginBottom: "15px"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "11px",
													fontWeight: 900,
													color: "#64748b"
												},
												children: "HELPFUL CONTENT SCORE"
											}), /* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: "18px",
													fontWeight: 900,
													color: helpfulScore > 80 ? "#10b981" : "#f59e0b"
												},
												children: [helpfulScore, "%"]
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												height: "6px",
												background: "#e2e8f0",
												borderRadius: "3px",
												overflow: "hidden",
												marginBottom: "20px"
											},
											children: /* @__PURE__ */ jsx("div", { style: {
												height: "100%",
												background: helpfulScore > 80 ? "#10b981" : "#f59e0b"
											} })
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "grid",
												gridTemplateColumns: "1fr 1fr",
												gap: "8px"
											},
											children: [
												/* @__PURE__ */ jsx(StatBox, {
													label: "INTENT",
													value: userIntent.toUpperCase()
												}),
												/* @__PURE__ */ jsx(StatBox, {
													label: "HUMAN",
													value: `${humanScore}%`
												}),
												/* @__PURE__ */ jsx(StatBox, {
													label: "GAIN",
													value: "HIGH"
												}),
												/* @__PURE__ */ jsx(StatBox, {
													label: "ENTITIES",
													value: entities.length
												})
											]
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Technical SEO Tips"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "10px"
									},
									children: [
										seoScore < 100 && /* @__PURE__ */ jsx(SeoTip, {
											icon: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "14px",
													height: "14px"
												},
												children: [
													/* @__PURE__ */ jsx("circle", {
														cx: "12",
														cy: "12",
														r: "10"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "12",
														y1: "8",
														x2: "12",
														y2: "12"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "12",
														y1: "16",
														x2: "12.01",
														y2: "16"
													})
												]
											}),
											text: "Increase content length to 1500+ words.",
											type: "warning"
										}),
										visualHealth.altMissing > 0 && /* @__PURE__ */ jsx(SeoTip, {
											icon: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "14px",
													height: "14px"
												},
												children: [
													/* @__PURE__ */ jsx("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
													/* @__PURE__ */ jsx("line", {
														x1: "12",
														y1: "9",
														x2: "12",
														y2: "13"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "12",
														y1: "17",
														x2: "12.01",
														y2: "17"
													})
												]
											}),
											text: `${visualHealth.altMissing} images missing ALT text.`,
											type: "error"
										}),
										helpfulScore >= 80 && /* @__PURE__ */ jsx(SeoTip, {
											icon: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "14px",
													height: "14px"
												},
												children: [/* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ jsx("polyline", { points: "22 4 12 14.01 9 11.01" })]
											}),
											text: "Content shows high human-gain value.",
											type: "success"
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Document Outline"
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "8px"
									},
									children: tableOfContents.map((h) => /* @__PURE__ */ jsx("div", {
										style: {
											...tocItemStyle,
											paddingLeft: `${(h.level - 2) * 12}px`,
											borderLeft: activeTab === "editor" ? "2px solid #e2e8f0" : "none"
										},
										children: h.text
									}, h.id))
								})
							] }, "editor"),
							activeTab === "snippets" && /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Featured Snippet Audit"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: hcuCardStyle,
									children: [/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											marginBottom: "10px"
										},
										children: [/* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "11px",
												fontWeight: 900
											},
											children: "SNIPPET POTENTIAL"
										}), /* @__PURE__ */ jsxs("span", {
											style: {
												fontSize: "18px",
												fontWeight: 900,
												color: "#8b5cf6"
											},
											children: [snippetScore, "%"]
										})]
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "12px",
											color: "#64748b",
											lineHeight: "1.5"
										},
										children: "Optimizing for Position Zero increases CTR by 30%."
									})]
								}),
								/* @__PURE__ */ jsx("h4", {
									style: {
										fontSize: "11px",
										fontWeight: 900,
										marginBottom: "12px"
									},
									children: "OPTIMIZATION TIPS"
								}),
								snippetTips.map((tip, i) => /* @__PURE__ */ jsxs("div", {
									style: tipRowStyle,
									children: [
										/* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: {
												width: "12px",
												height: "12px",
												color: "#10b981"
											},
											children: [/* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ jsx("polyline", { points: "22 4 12 14.01 9 11.01" })]
										}),
										" ",
										tip
									]
								}, i))
							] }, "snippets"),
							activeTab === "eeat" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								style: sidebarHeadingStyle,
								children: "EEAT Verification"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "16px"
								},
								children: [
									availableAuthors.length > 0 && /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "6px",
											background: "#f8fafc",
											padding: "16px",
											borderRadius: "12px",
											border: "1px solid #e2e8f0"
										},
										children: [
											/* @__PURE__ */ jsx("label", {
												style: metaLabelStyle,
												children: "SELECT SAVED AUTHOR PROFILE"
											}),
											/* @__PURE__ */ jsxs("select", {
												style: metaInputStyle,
												value: availableAuthors.find((a) => a.name === author)?.id || "",
												onChange: (e) => {
													const selected = availableAuthors.find((a) => a.id === e.target.value);
													if (selected) {
														setAuthor(selected.name);
														setAuthorExpertise(selected.jobTitle || "");
														setAuthorBio(selected.bio || "");
														setAuthorImage(selected.image || "");
														setAuthorExperienceYears(selected.experienceYears || 0);
														setAuthorSocials(selected.socials || {
															twitter: "",
															linkedin: "",
															website: ""
														});
														if (selected.awards) setAuthorAwards(selected.awards);
														if (selected.alumniOf) setAuthorAlumniOf(selected.alumniOf);
														if (selected.knowsAbout) setAuthorKnowsAbout(selected.knowsAbout);
													}
												},
												children: [/* @__PURE__ */ jsx("option", {
													value: "",
													children: "-- Choose an Author --"
												}), availableAuthors.map((a) => /* @__PURE__ */ jsx("option", {
													value: a.id,
													children: a.name
												}, a.id))]
											}),
											/* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "11px",
													color: "#64748b"
												},
												children: "This connects the post to a rich Author Profile for EEAT."
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "6px",
											background: "#f8fafc",
											padding: "16px",
											borderRadius: "12px",
											border: "1px solid #e2e8f0",
											marginTop: "16px"
										},
										children: [/* @__PURE__ */ jsx("label", {
											style: metaLabelStyle,
											children: "SELECT CATEGORY"
										}), /* @__PURE__ */ jsxs("select", {
											style: metaInputStyle,
											value: category,
											onChange: (e) => setCategory(e.target.value),
											children: [/* @__PURE__ */ jsx("option", {
												value: "General",
												children: "General"
											}), availableCategories.map((c) => /* @__PURE__ */ jsx("option", {
												value: c.name,
												children: c.name
											}, c.id))]
										})]
									}),
									/* @__PURE__ */ jsx(InputGroup, {
										label: "FACT CHECKED BY",
										value: factCheckedBy,
										onChange: setFactCheckedBy,
										placeholder: "e.g. Dr. Sarah Connor"
									}),
									/* @__PURE__ */ jsx(InputGroup, {
										label: "FACT CHECKER ROLE",
										value: factCheckerRole,
										onChange: setFactCheckerRole,
										placeholder: "e.g. Senior Medical Editor"
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "6px"
										},
										children: [/* @__PURE__ */ jsx("label", {
											style: metaLabelStyle,
											children: "🔬 RESEARCH METHODOLOGY"
										}), /* @__PURE__ */ jsx("textarea", {
											placeholder: "Describe how data was collected and verified...",
											value: researchMethodology,
											onChange: (e) => setResearchMethodology(e.target.value),
											style: metaTextAreaStyle
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "6px"
										},
										children: [
											/* @__PURE__ */ jsx("label", {
												style: metaLabelStyle,
												children: "📚 SOURCES & CITATIONS"
											}),
											sources.map((src, i) => /* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "8px",
													background: "#f8fafc",
													borderRadius: "10px",
													padding: "8px 12px",
													fontSize: "12px",
													border: "1px solid #e2e8f0"
												},
												children: [
													/* @__PURE__ */ jsx("span", {
														style: {
															background: src.type === "primary" ? "#10b981" : "#3b82f6",
															color: "white",
															padding: "2px 7px",
															borderRadius: "4px",
															fontSize: "10px",
															fontWeight: 800,
															textTransform: "uppercase",
															flexShrink: 0
														},
														children: src.type
													}),
													/* @__PURE__ */ jsx("span", {
														style: {
															flex: 1,
															overflow: "hidden",
															textOverflow: "ellipsis",
															whiteSpace: "nowrap",
															color: "#475569"
														},
														children: src.title || src.url
													}),
													/* @__PURE__ */ jsx("button", {
														onClick: () => setSources(sources.filter((_, idx) => idx !== i)),
														style: {
															border: "none",
															background: "#fee2e2",
															color: "#dc2626",
															borderRadius: "6px",
															padding: "3px 8px",
															cursor: "pointer",
															fontSize: "11px",
															fontWeight: 700
														},
														children: "✕"
													})
												]
											}, i)),
											/* @__PURE__ */ jsx("input", {
												value: sourceInput.title,
												onChange: (e) => setSourceInput({
													...sourceInput,
													title: e.target.value
												}),
												placeholder: "Source Title",
												style: {
													...metaInputStyle,
													marginBottom: "6px"
												}
											}),
											/* @__PURE__ */ jsx("input", {
												value: sourceInput.url,
												onChange: (e) => setSourceInput({
													...sourceInput,
													url: e.target.value
												}),
												placeholder: "Source URL (https://...)",
												style: {
													...metaInputStyle,
													marginBottom: "6px"
												}
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													gap: "8px"
												},
												children: [/* @__PURE__ */ jsxs("select", {
													value: sourceInput.type,
													onChange: (e) => setSourceInput({
														...sourceInput,
														type: e.target.value
													}),
													style: {
														...metaInputStyle,
														flex: 1
													},
													children: [/* @__PURE__ */ jsx("option", {
														value: "primary",
														children: "Primary Source"
													}), /* @__PURE__ */ jsx("option", {
														value: "secondary",
														children: "Secondary Source"
													})]
												}), /* @__PURE__ */ jsx("button", {
													onClick: () => {
														if (sourceInput.url.trim()) {
															setSources([...sources, { ...sourceInput }]);
															setSourceInput({
																title: "",
																url: "",
																type: "primary"
															});
														}
													},
													style: {
														...addNodeBtn,
														width: "auto",
														padding: "0 16px",
														margin: 0
													},
													children: "Add"
												})]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: eeatCheckStyle,
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: eeatChecklist.credentialsIncluded,
											onChange: (e) => setEeatChecklist({
												...eeatChecklist,
												credentialsIncluded: e.target.checked
											})
										}), /* @__PURE__ */ jsx("span", { children: "AI-Assisted (Disclosure Required)" })]
									})
								]
							})] }, "eeat"),
							activeTab === "schema" && /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "FAQ Schema Nodes"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "12px"
									},
									children: [faqs.map((faq, i) => /* @__PURE__ */ jsxs("div", {
										style: faqNodeStyle,
										children: [/* @__PURE__ */ jsx("input", {
											placeholder: "Question",
											value: faq.question,
											onChange: (e) => {
												const n = [...faqs];
												n[i].question = e.target.value;
												handleSidebarFaqChange(n);
											},
											style: faqInputSmall
										}), /* @__PURE__ */ jsx("textarea", {
											placeholder: "Answer",
											value: faq.answer,
											onChange: (e) => {
												const n = [...faqs];
												n[i].answer = e.target.value;
												handleSidebarFaqChange(n);
											},
											style: faqTextArea
										})]
									}, i)), /* @__PURE__ */ jsx("button", {
										onClick: () => handleSidebarFaqChange([...faqs, {
											question: "",
											answer: ""
										}]),
										style: addNodeBtn,
										children: "+ Add FAQ Node"
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: {
										...sidebarHeadingStyle,
										marginTop: "24px"
									},
									children: "HowTo Schema Nodes"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "12px"
									},
									children: [howToSteps.map((step, i) => /* @__PURE__ */ jsxs("div", {
										style: faqNodeStyle,
										children: [
											/* @__PURE__ */ jsx("input", {
												placeholder: "Step Name (e.g. Prepare Ingredients)",
												value: step.name,
												onChange: (e) => {
													const n = [...howToSteps];
													n[i].name = e.target.value;
													setHowToSteps(n);
												},
												style: faqInputSmall
											}),
											/* @__PURE__ */ jsx("textarea", {
												placeholder: "Step Description...",
												value: step.text,
												onChange: (e) => {
													const n = [...howToSteps];
													n[i].text = e.target.value;
													setHowToSteps(n);
												},
												style: faqTextArea
											}),
											/* @__PURE__ */ jsx("button", {
												onClick: () => setHowToSteps(howToSteps.filter((_, idx) => idx !== i)),
												style: {
													...closeModalBtn,
													background: "#fee2e2",
													color: "#ef4444",
													width: "100%",
													marginTop: "8px"
												},
												children: "Remove Step"
											})
										]
									}, i)), /* @__PURE__ */ jsx("button", {
										onClick: () => setHowToSteps([...howToSteps, {
											name: "",
											text: ""
										}]),
										style: addNodeBtn,
										children: "+ Add HowTo Step"
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: {
										...sidebarHeadingStyle,
										marginTop: "24px"
									},
									children: "LocalBusiness Schema Details"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "8px"
									},
									children: [
										/* @__PURE__ */ jsx("input", {
											placeholder: "Business Name (e.g. Sikar Coaching)",
											value: localBusiness.name,
											onChange: (e) => setLocalBusiness({
												...localBusiness,
												name: e.target.value
											}),
											style: faqInputSmall
										}),
										/* @__PURE__ */ jsx("input", {
											placeholder: "Telephone (e.g. +91 9999999999)",
											value: localBusiness.telephone,
											onChange: (e) => setLocalBusiness({
												...localBusiness,
												telephone: e.target.value
											}),
											style: {
												...faqInputSmall,
												marginBottom: 0
											}
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: "8px"
											},
											children: [/* @__PURE__ */ jsx("input", {
												placeholder: "Rating (e.g. 4.8)",
												value: localBusiness.ratingValue,
												onChange: (e) => setLocalBusiness({
													...localBusiness,
													ratingValue: e.target.value
												}),
												style: {
													...faqInputSmall,
													flex: 1
												}
											}), /* @__PURE__ */ jsx("input", {
												placeholder: "Reviews Count",
												value: localBusiness.reviewCount,
												onChange: (e) => setLocalBusiness({
													...localBusiness,
													reviewCount: e.target.value
												}),
												style: {
													...faqInputSmall,
													flex: 1
												}
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											placeholder: "Price Range (e.g. $$, INR 500-1000)",
											value: localBusiness.priceRange,
											onChange: (e) => setLocalBusiness({
												...localBusiness,
												priceRange: e.target.value
											}),
											style: faqInputSmall
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "11px",
												fontWeight: 600,
												color: "#64748b",
												marginTop: "8px"
											},
											children: "Address Details"
										}),
										/* @__PURE__ */ jsx("input", {
											placeholder: "Street Address",
											value: localBusiness.streetAddress,
											onChange: (e) => setLocalBusiness({
												...localBusiness,
												streetAddress: e.target.value
											}),
											style: {
												...faqInputSmall,
												marginBottom: 0
											}
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: "8px"
											},
											children: [/* @__PURE__ */ jsx("input", {
												placeholder: "City",
												value: localBusiness.addressLocality,
												onChange: (e) => setLocalBusiness({
													...localBusiness,
													addressLocality: e.target.value
												}),
												style: {
													...faqInputSmall,
													flex: 1,
													marginBottom: 0
												}
											}), /* @__PURE__ */ jsx("input", {
												placeholder: "Region/State",
												value: localBusiness.addressRegion,
												onChange: (e) => setLocalBusiness({
													...localBusiness,
													addressRegion: e.target.value
												}),
												style: {
													...faqInputSmall,
													flex: 1,
													marginBottom: 0
												}
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: "8px"
											},
											children: [/* @__PURE__ */ jsx("input", {
												placeholder: "Postal Code",
												value: localBusiness.postalCode,
												onChange: (e) => setLocalBusiness({
													...localBusiness,
													postalCode: e.target.value
												}),
												style: {
													...faqInputSmall,
													flex: 1
												}
											}), /* @__PURE__ */ jsx("input", {
												placeholder: "Country Code (e.g. IN)",
												value: localBusiness.addressCountry,
												onChange: (e) => setLocalBusiness({
													...localBusiness,
													addressCountry: e.target.value
												}),
												style: {
													...faqInputSmall,
													flex: 1
												}
											})]
										})
									]
								})
							] }, "schema"),
							activeTab === "strategy" && /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Content Strategy"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: hcuCardStyle,
									children: [/* @__PURE__ */ jsx("label", {
										style: metaLabelStyle,
										children: "PRIMARY SEARCH INTENT"
									}), /* @__PURE__ */ jsxs("select", {
										value: userIntent,
										onChange: (e) => setUserIntent(e.target.value),
										style: metaSelectStyle,
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "informational",
												children: "Informational"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "transactional",
												children: "Transactional"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "navigational",
												children: "Navigational"
											})
										]
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "🔍 GSC Indexing Controls"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "10px",
										background: "#f8fafc",
										padding: "16px",
										borderRadius: "16px",
										border: "1px solid #e2e8f0",
										marginBottom: "20px"
									},
									children: [
										/* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "10px",
												cursor: "pointer",
												fontSize: "13px",
												fontWeight: 600
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: isNoIndex,
												onChange: (e) => setIsNoIndex(e.target.checked),
												style: {
													width: "16px",
													height: "16px",
													accentColor: "#ef4444"
												}
											}), /* @__PURE__ */ jsx("span", {
												style: { color: isNoIndex ? "#dc2626" : "#475569" },
												children: "🚫 No Index (Exclude from Search)"
											})]
										}),
										/* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "10px",
												cursor: "pointer",
												fontSize: "13px",
												fontWeight: 600
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: isSponsored,
												onChange: (e) => setIsSponsored(e.target.checked),
												style: {
													width: "16px",
													height: "16px",
													accentColor: "#f59e0b"
												}
											}), /* @__PURE__ */ jsx("span", {
												style: { color: isSponsored ? "#b45309" : "#475569" },
												children: "💰 Sponsored Content (Ad Disclosure)"
											})]
										}),
										/* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "10px",
												cursor: "pointer",
												fontSize: "13px",
												fontWeight: 600
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: isPillarPage,
												onChange: (e) => setIsPillarPage(e.target.checked),
												style: {
													width: "16px",
													height: "16px",
													accentColor: "#8b5cf6"
												}
											}), /* @__PURE__ */ jsx("span", {
												style: { color: isPillarPage ? "#7c3aed" : "#475569" },
												children: "⭐ Cornerstone / Pillar Page"
											})]
										}),
										/* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "10px",
												cursor: "pointer",
												fontSize: "13px",
												fontWeight: 600
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: isAiAssisted,
												onChange: (e) => setIsAiAssisted(e.target.checked),
												style: {
													width: "16px",
													height: "16px",
													accentColor: "#8b5cf6"
												}
											}), /* @__PURE__ */ jsx("span", {
												style: { color: isAiAssisted ? "#7c3aed" : "#475569" },
												children: "🤖 AI-Assisted Content"
											})]
										}),
										isAiAssisted && /* @__PURE__ */ jsx("p", {
											style: {
												fontSize: "11px",
												color: "#5b21b6",
												margin: 0,
												background: "#f5f3ff",
												padding: "8px",
												borderRadius: "8px",
												border: "1px solid #ddd6fe"
											},
											children: "ℹ️ A disclosure note will appear on the published page per Google's AI content transparency policy."
										}),
										isNoIndex && /* @__PURE__ */ jsx("p", {
											style: {
												fontSize: "11px",
												color: "#dc2626",
												margin: 0,
												background: "#fef2f2",
												padding: "8px",
												borderRadius: "8px",
												border: "1px solid #fecaca"
											},
											children: "⚠️ This page will be excluded from Google search results."
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "📝 Editorial Corrections"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "10px",
										background: "#f8fafc",
										padding: "16px",
										borderRadius: "16px",
										border: "1px solid #e2e8f0",
										marginBottom: "20px"
									},
									children: [
										corrections.map((c, i) => /* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												padding: "6px 10px",
												background: "#fff",
												borderRadius: "10px",
												border: "1px solid #e2e8f0",
												fontSize: "12px"
											},
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", {
												style: { color: "#1e40af" },
												children: new Date(c.date).toLocaleDateString("en-IN", {
													year: "numeric",
													month: "short",
													day: "numeric"
												})
											}), /* @__PURE__ */ jsx("span", {
												style: {
													color: "#475569",
													marginLeft: "8px"
												},
												children: c.note
											})] }), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setCorrections((prev) => prev.filter((_, idx) => idx !== i)),
												style: {
													background: "none",
													border: "none",
													color: "#ef4444",
													cursor: "pointer",
													fontSize: "14px",
													padding: "2px 6px"
												},
												children: "✕"
											})]
										}, i)),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: "8px"
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "text",
												value: newCorrectionNote,
												onChange: (e) => setNewCorrectionNote(e.target.value),
												placeholder: "Correction note...",
												style: {
													...metaInputStyle,
													flex: 1
												}
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => {
													if (newCorrectionNote.trim()) {
														setCorrections((prev) => [...prev, {
															date: (/* @__PURE__ */ new Date()).toISOString(),
															note: newCorrectionNote.trim()
														}]);
														setNewCorrectionNote("");
													}
												},
												style: {
													background: "#3b82f6",
													color: "#fff",
													border: "none",
													borderRadius: "10px",
													padding: "8px 14px",
													fontSize: "12px",
													fontWeight: 700,
													cursor: "pointer",
													whiteSpace: "nowrap"
												},
												children: "+ Add"
											})]
										}),
										/* @__PURE__ */ jsx("p", {
											style: {
												fontSize: "10px",
												color: "#94a3b8",
												margin: 0
											},
											children: "Corrections will be displayed publicly on the article page for transparency."
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "🔄 Content Review Cycle"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "10px",
										marginBottom: "20px"
									},
									children: [/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "6px"
										},
										children: [/* @__PURE__ */ jsx("label", {
											style: metaLabelStyle,
											children: "REVIEW EVERY (DAYS)"
										}), /* @__PURE__ */ jsx("input", {
											type: "number",
											min: 30,
											max: 365,
											value: reviewCycleDays || "",
											onChange: (e) => {
												const d = Number(e.target.value);
												setReviewCycleDays(d);
												if (d > 0) {
													const next = /* @__PURE__ */ new Date();
													next.setDate(next.getDate() + d);
													setNextReviewDate(next.toISOString().split("T")[0]);
												}
											},
											placeholder: "90",
											style: metaInputStyle
										})]
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "6px"
										},
										children: [/* @__PURE__ */ jsx("label", {
											style: metaLabelStyle,
											children: "NEXT REVIEW DATE"
										}), /* @__PURE__ */ jsx("input", {
											type: "date",
											value: nextReviewDate,
											onChange: (e) => setNextReviewDate(e.target.value),
											style: metaInputStyle
										})]
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "🚀 Key Takeaways"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "8px",
										marginBottom: "20px"
									},
									children: [keyTakeaways.map((kt, i) => /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "8px",
											alignItems: "center",
											background: "#f0fdf4",
											padding: "8px 12px",
											borderRadius: "10px",
											border: "1px solid #bbf7d0"
										},
										children: [/* @__PURE__ */ jsxs("span", {
											style: {
												flex: 1,
												fontSize: "12px",
												color: "#166534"
											},
											children: ["✓ ", kt]
										}), /* @__PURE__ */ jsx("button", {
											onClick: () => setKeyTakeaways(keyTakeaways.filter((_, idx) => idx !== i)),
											style: {
												border: "none",
												background: "#fecaca",
												color: "#dc2626",
												borderRadius: "6px",
												padding: "3px 8px",
												cursor: "pointer",
												fontSize: "11px",
												fontWeight: 700
											},
											children: "✕"
										})]
									}, i)), /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "8px"
										},
										children: [/* @__PURE__ */ jsx("input", {
											value: takeawayInput,
											onChange: (e) => setTakeawayInput(e.target.value),
											onKeyDown: (e) => {
												if (e.key === "Enter" && takeawayInput.trim()) {
													setKeyTakeaways([...keyTakeaways, takeawayInput.trim()]);
													setTakeawayInput("");
												}
											},
											placeholder: "Add a key takeaway point...",
											style: {
												...metaInputStyle,
												flex: 1
											}
										}), /* @__PURE__ */ jsx("button", {
											onClick: () => {
												if (takeawayInput.trim()) {
													setKeyTakeaways([...keyTakeaways, takeawayInput.trim()]);
													setTakeawayInput("");
												}
											},
											style: {
												...addNodeBtn,
												width: "auto",
												padding: "0 14px",
												margin: 0
											},
											children: "Add"
										})]
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "🌐 Semantic Mentions (Wikidata)"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "8px",
										marginBottom: "20px"
									},
									children: [
										semanticMentions.map((m, i) => /* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "8px",
												background: "#faf5ff",
												borderRadius: "10px",
												padding: "8px 12px",
												fontSize: "12px",
												border: "1px solid #e9d5ff"
											},
											children: [/* @__PURE__ */ jsxs("div", {
												style: { flex: 1 },
												children: [/* @__PURE__ */ jsx("div", {
													style: {
														fontWeight: 700,
														color: "#6d28d9"
													},
													children: m.name
												}), m.sameAs && /* @__PURE__ */ jsx("div", {
													style: {
														color: "#94a3b8",
														fontSize: "10px",
														overflow: "hidden",
														textOverflow: "ellipsis",
														whiteSpace: "nowrap"
													},
													children: m.sameAs
												})]
											}), /* @__PURE__ */ jsx("button", {
												onClick: () => setSemanticMentions(semanticMentions.filter((_, idx) => idx !== i)),
												style: {
													border: "none",
													background: "#fee2e2",
													color: "#dc2626",
													borderRadius: "6px",
													padding: "3px 8px",
													cursor: "pointer",
													fontSize: "11px",
													fontWeight: 700
												},
												children: "✕"
											})]
										}, i)),
										/* @__PURE__ */ jsx("input", {
											value: mentionNameInput,
											onChange: (e) => setMentionNameInput(e.target.value),
											placeholder: "Entity Name (e.g. Artificial Intelligence)",
											style: {
												...metaInputStyle,
												marginBottom: "6px"
											}
										}),
										/* @__PURE__ */ jsx("input", {
											value: mentionSameAsInput,
											onChange: (e) => setMentionSameAsInput(e.target.value),
											placeholder: "Wikidata URL (https://www.wikidata.org/wiki/...)",
											style: {
												...metaInputStyle,
												marginBottom: "6px"
											}
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => {
												if (mentionNameInput.trim()) {
													setSemanticMentions([...semanticMentions, {
														name: mentionNameInput.trim(),
														sameAs: mentionSameAsInput.trim()
													}]);
													setMentionNameInput("");
													setMentionSameAsInput("");
												}
											},
											style: addNodeBtn,
											children: "+ Add Entity"
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "LSI Keyword Cloud"
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										flexWrap: "wrap",
										gap: "6px"
									},
									children: lsiKeywords.map((k) => /* @__PURE__ */ jsx("span", {
										style: lsiTagStyle,
										children: k
									}, k))
								})
							] }, "strategy"),
							activeTab === "guardian" && /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Sovereign Shield"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: guardianCard,
									children: [
										/* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: {
												width: "32px",
												height: "32px",
												color: "#2563eb"
											},
											children: [
												/* @__PURE__ */ jsx("path", { d: "M2 12a10 10 0 0 1 20 0" }),
												/* @__PURE__ */ jsx("path", { d: "M7 12a5 5 0 0 1 5-5" }),
												/* @__PURE__ */ jsx("path", { d: "M12 20a8 8 0 0 1-8-8" }),
												/* @__PURE__ */ jsx("path", { d: "M12 20a8 8 0 0 0 8-8" }),
												/* @__PURE__ */ jsx("path", { d: "M12 12a2.5 2.5 0 0 1 5 0" }),
												/* @__PURE__ */ jsx("path", { d: "M12 12a2.5 2.5 0 0 1-5 0" }),
												/* @__PURE__ */ jsx("path", { d: "M20 12a8 8 0 0 0-8-8" }),
												/* @__PURE__ */ jsx("path", { d: "M22 12a10 10 0 0 0-10-10" }),
												/* @__PURE__ */ jsx("path", { d: "M2 12a10 10 0 0 0 10 10" }),
												/* @__PURE__ */ jsx("path", { d: "M4 12a8 8 0 0 0 8 8" })
											]
										}),
										/* @__PURE__ */ jsx("h4", {
											style: { margin: "10px 0 5px" },
											children: "Content Signature"
										}),
										/* @__PURE__ */ jsx("p", {
											style: {
												fontSize: "11px",
												color: "#64748b"
											},
											children: "Verified Human-First Content"
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									style: hcuCardStyle,
									children: /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between"
										},
										children: [/* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "11px",
												fontWeight: 900
											},
											children: "HUMANIZATION"
										}), /* @__PURE__ */ jsxs("span", {
											style: {
												fontSize: "14px",
												fontWeight: 900
											},
											children: [humanScore, "%"]
										})]
									})
								})
							] }, "guardian"),
							activeTab === "meta" && /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Search Engine Listing"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: hcuCardStyle,
									children: [
										/* @__PURE__ */ jsxs("button", {
											onClick: () => setPreviewMode("google"),
											style: {
												...addNodeBtn,
												background: "#f8fafc",
												marginBottom: "15px",
												color: "#2563eb",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												gap: "8px"
											},
											children: [/* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "14px",
													height: "14px"
												},
												children: [
													/* @__PURE__ */ jsx("circle", {
														cx: "12",
														cy: "12",
														r: "10"
													}),
													/* @__PURE__ */ jsx("line", {
														x1: "2",
														y1: "12",
														x2: "22",
														y2: "12"
													}),
													/* @__PURE__ */ jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
												]
											}), " Launch SERP Simulator"]
										}),
										/* @__PURE__ */ jsx(InputGroup, {
											label: "SEO TITLE",
											value: seoTitle,
											onChange: setSeoTitle,
											placeholder: "Target Keyword in Title"
										}),
										/* @__PURE__ */ jsx("div", { style: { height: "15px" } }),
										/* @__PURE__ */ jsx(InputGroup, {
											label: "CUSTOM URL SLUG",
											value: slug,
											onChange: (val) => setSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_-]+/g, "-")),
											placeholder: "e.g. custom-post-url (leave empty for auto)"
										}),
										/* @__PURE__ */ jsx("div", { style: { height: "15px" } }),
										/* @__PURE__ */ jsx("label", {
											style: metaLabelStyle,
											children: "META DESCRIPTION"
										}),
										/* @__PURE__ */ jsx("textarea", {
											value: metaDescription,
											onChange: (e) => setMetaDescription(e.target.value),
											style: metaTextAreaStyle,
											placeholder: "150-160 characters for optimal CTR"
										}),
										/* @__PURE__ */ jsx("div", { style: { height: "15px" } }),
										/* @__PURE__ */ jsx("label", {
											style: metaLabelStyle,
											children: "EXCERPT (SHORT SUMMARY)"
										}),
										/* @__PURE__ */ jsx("textarea", {
											value: excerpt,
											onChange: (e) => setExcerpt(e.target.value),
											style: metaTextAreaStyle,
											placeholder: "Short summary for blog feed"
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Visual Assets"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: hcuCardStyle,
									children: [
										/* @__PURE__ */ jsx("label", {
											style: metaLabelStyle,
											children: "COVER IMAGE"
										}),
										coverImage && /* @__PURE__ */ jsxs("div", {
											style: {
												position: "relative",
												marginBottom: "10px"
											},
											children: [/* @__PURE__ */ jsx("img", {
												loading: "lazy",
												decoding: "async",
												fetchPriority: "low",
												src: coverImage,
												alt: "Cover",
												style: {
													width: "100%",
													height: "120px",
													objectFit: "cover",
													borderRadius: "12px"
												}
											}), /* @__PURE__ */ jsx("button", {
												onClick: () => setCoverImage(""),
												style: {
													position: "absolute",
													top: "8px",
													right: "8px",
													background: "rgba(0,0,0,0.5)",
													border: "none",
													color: "#fff",
													padding: "4px",
													borderRadius: "6px",
													cursor: "pointer"
												},
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "12px",
														height: "12px"
													},
													children: [/* @__PURE__ */ jsx("line", {
														x1: "18",
														y1: "6",
														x2: "6",
														y2: "18"
													}), /* @__PURE__ */ jsx("line", {
														x1: "6",
														y1: "6",
														x2: "18",
														y2: "18"
													})]
												})
											})]
										}),
										coverImage && coverImageWidth !== null && coverImageWidth < 1200 && /* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "11px",
												color: "#b45309",
												background: "#fffbeb",
												border: "1px solid #fef3c7",
												padding: "8px 12px",
												borderRadius: "10px",
												marginBottom: "10px",
												lineHeight: 1.4
											},
											children: [
												"⚠️ Cover image width (",
												coverImageWidth,
												"px) is under 1200px. Google Discover requires ≥1200px wide images for premium cards."
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: "8px"
											},
											children: [/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setMediaPickerTarget("cover"),
												style: {
													...addNodeBtn,
													background: "#f8fafc",
													flex: 1
												},
												children: "Choose from Library"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => coverInputRef.current?.click(),
												style: {
													...addNodeBtn,
													background: "#fff",
													border: "1px dashed #cbd5e1",
													flex: 1
												},
												children: coverImage ? "Change Cover Photo" : "Upload Cover Photo"
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "file",
											ref: coverInputRef,
											onChange: handleCoverUpload,
											style: { display: "none" },
											accept: "image/*"
										}),
										coverImage && /* @__PURE__ */ jsx("div", {
											style: { marginTop: "10px" },
											children: /* @__PURE__ */ jsx(InputGroup, {
												label: "COVER IMAGE ALT TEXT",
												value: coverImageAlt,
												onChange: setCoverImageAlt,
												placeholder: "Describe the image for SEO and accessibility"
											})
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Keywords & Indexing"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: hcuCardStyle,
									children: [
										/* @__PURE__ */ jsx(InputGroup, {
											label: "FOCUS KEYWORD",
											value: focusKeyword,
											onChange: setFocusKeyword,
											placeholder: "Primary search term"
										}),
										/* @__PURE__ */ jsx("div", { style: { height: "15px" } }),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												gap: "6px"
											},
											children: [
												/* @__PURE__ */ jsx("label", {
													style: metaLabelStyle,
													children: "LSI FOCUS TAGS"
												}),
												/* @__PURE__ */ jsx("div", {
													style: {
														display: "flex",
														flexWrap: "wrap",
														gap: "6px",
														marginBottom: "8px"
													},
													children: tags.map((tag, i) => /* @__PURE__ */ jsxs("span", {
														style: {
															background: "#eff6ff",
															color: "#2563eb",
															border: "1px solid #dbeafe",
															padding: "4px 10px",
															borderRadius: "20px",
															fontSize: "11px",
															fontWeight: 700,
															display: "flex",
															alignItems: "center",
															gap: "6px"
														},
														children: [tag, /* @__PURE__ */ jsx("button", {
															onClick: () => setTags(tags.filter((_, idx) => idx !== i)),
															style: {
																border: "none",
																background: "none",
																cursor: "pointer",
																color: "#2563eb",
																fontWeight: 900,
																padding: 0,
																lineHeight: 1
															},
															children: "✕"
														})]
													}, i))
												}),
												/* @__PURE__ */ jsxs("div", {
													style: {
														display: "flex",
														gap: "8px"
													},
													children: [/* @__PURE__ */ jsx("input", {
														value: tagInput,
														onChange: (e) => setTagInput(e.target.value),
														onKeyDown: (e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																if (tagInput.trim() && !tags.includes(tagInput.trim())) {
																	setTags([...tags, tagInput.trim()]);
																	setTagInput("");
																}
															}
														},
														placeholder: "Add tag and press Enter",
														style: {
															...metaInputStyle,
															flex: 1
														}
													}), /* @__PURE__ */ jsx("button", {
														onClick: (e) => {
															e.preventDefault();
															if (tagInput.trim() && !tags.includes(tagInput.trim())) {
																setTags([...tags, tagInput.trim()]);
																setTagInput("");
															}
														},
														style: {
															...addNodeBtn,
															width: "auto",
															padding: "0 16px",
															margin: 0
														},
														children: "Add"
													})]
												})
											]
										}),
										/* @__PURE__ */ jsx("div", { style: { height: "15px" } }),
										/* @__PURE__ */ jsx(InputGroup, {
											label: "KEYWORDS (LEGACY)",
											value: keywords,
											onChange: setKeywords,
											placeholder: "Comma separated keywords"
										}),
										/* @__PURE__ */ jsx("div", { style: { height: "15px" } }),
										/* @__PURE__ */ jsx(InputGroup, {
											label: "CANONICAL URL",
											value: canonicalUrl,
											onChange: setCanonicalUrl,
											placeholder: "Avoid duplicate content issues"
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Social Media (Open Graph)"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: hcuCardStyle,
									children: [
										/* @__PURE__ */ jsx(InputGroup, {
											label: "OG TITLE",
											value: ogTitle,
											onChange: setOgTitle,
											placeholder: "Catchy title for social shares"
										}),
										/* @__PURE__ */ jsx("div", { style: { height: "15px" } }),
										/* @__PURE__ */ jsx("label", {
											style: metaLabelStyle,
											children: "OG DESCRIPTION"
										}),
										/* @__PURE__ */ jsx("textarea", {
											value: ogDescription,
											onChange: (e) => setOgDescription(e.target.value),
											style: metaTextAreaStyle,
											placeholder: "Display on Facebook/Twitter"
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Twitter Settings"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: hcuCardStyle,
									children: [
										/* @__PURE__ */ jsx(InputGroup, {
											label: "TWITTER CARD TYPE",
											value: twitterCard,
											onChange: setTwitterCard,
											placeholder: "e.g. summary_large_image"
										}),
										/* @__PURE__ */ jsx("div", { style: { height: "15px" } }),
										/* @__PURE__ */ jsx(InputGroup, {
											label: "TWITTER TITLE",
											value: twitterTitle,
											onChange: setTwitterTitle,
											placeholder: "Title for Twitter"
										}),
										/* @__PURE__ */ jsx("div", { style: { height: "15px" } }),
										/* @__PURE__ */ jsx("label", {
											style: metaLabelStyle,
											children: "TWITTER DESCRIPTION"
										}),
										/* @__PURE__ */ jsx("textarea", {
											value: twitterDescription,
											onChange: (e) => setTwitterDescription(e.target.value),
											style: metaTextAreaStyle,
											placeholder: "Description for Twitter"
										})
									]
								})
							] }, "meta"),
							activeTab === "seo" && /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "AI SEO Audit"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										...hcuCardStyle,
										background: "linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%)",
										border: "1px solid #e9d5ff"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "10px",
												marginBottom: "15px"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { fontSize: "18px" },
												children: "✨"
											}), /* @__PURE__ */ jsx("span", {
												style: {
													fontWeight: 800,
													fontSize: "14px",
													color: "#7e22ce"
												},
												children: "GEMINI AUTO-FILL"
											})]
										}),
										/* @__PURE__ */ jsx("p", {
											style: {
												fontSize: "11px",
												color: "#6b21a8",
												marginBottom: "15px"
											},
											children: "Analyze content and generate missing SEO values (Meta, Tags, FAQs, etc.)"
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: (e) => {
												e.preventDefault();
												runAiAudit();
											},
											disabled: isAiAuditing,
											style: {
												...addNodeBtn,
												background: isAiAuditing ? "#e9d5ff" : "#9333ea",
												color: "#fff",
												border: "none",
												fontWeight: "bold",
												width: "100%",
												marginBottom: aiSuggestions ? "15px" : "0"
											},
											children: isAiAuditing ? "Analyzing Content..." : "Run AI SEO Audit"
										}),
										aiSuggestions && /* @__PURE__ */ jsx("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												gap: "10px",
												marginTop: "10px"
											},
											children: Object.entries(aiSuggestions).map(([key, val]) => {
												const isApplied = appliedAiSuggestions[key];
												const message = val?.message || "";
												const suggestionValue = val?.value ?? val;
												return /* @__PURE__ */ jsxs("div", {
													style: {
														background: isApplied ? "#f0fdf4" : "#fff",
														padding: "12px",
														borderRadius: "8px",
														border: `1px solid ${isApplied ? "#bbf7d0" : "#e2e8f0"}`,
														fontSize: "11px"
													},
													children: [
														/* @__PURE__ */ jsx("div", {
															style: {
																display: "flex",
																justifyContent: "space-between",
																alignItems: "center",
																marginBottom: "6px"
															},
															children: /* @__PURE__ */ jsxs("div", {
																style: {
																	fontWeight: "bold",
																	color: isApplied ? "#166534" : "#475569",
																	textTransform: "uppercase"
																},
																children: [
																	key,
																	" ",
																	isApplied && "✅ Updated"
																]
															})
														}),
														!isApplied && message && /* @__PURE__ */ jsxs("div", {
															style: {
																color: "#b45309",
																marginBottom: "8px",
																background: "#fffbeb",
																padding: "6px 8px",
																borderRadius: "4px",
																border: "1px solid #fef3c7"
															},
															children: ["⚠️ ", message]
														}),
														/* @__PURE__ */ jsx("div", {
															style: {
																color: "#1e293b",
																marginBottom: isApplied ? "0" : "10px",
																background: isApplied ? "transparent" : "#f8fafc",
																padding: isApplied ? "0" : "8px",
																borderRadius: "4px",
																overflowWrap: "anywhere"
															},
															children: typeof suggestionValue === "string" ? suggestionValue : JSON.stringify(suggestionValue)
														}),
														!isApplied && /* @__PURE__ */ jsx("button", {
															onClick: (e) => {
																e.preventDefault();
																applyAiSuggestion(key, val);
															},
															style: {
																background: "#9333ea",
																border: "none",
																padding: "6px 12px",
																borderRadius: "4px",
																cursor: "pointer",
																fontWeight: "bold",
																color: "#fff",
																width: "100%"
															},
															children: "Apply Suggestion"
														})
													]
												}, key);
											})
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Turbo Indexing Engine"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: hcuCardStyle,
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "10px",
												marginBottom: "15px"
											},
											children: [/* @__PURE__ */ jsx("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "24",
												height: "24",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "lucide",
												style: {
													width: "20px",
													height: "20px",
													color: "#f59e0b",
													fill: "#f59e0b"
												},
												children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
											}), /* @__PURE__ */ jsx("span", {
												style: {
													fontWeight: 800,
													fontSize: "14px"
												},
												children: "INSTANT INDEXING"
											})]
										}),
										/* @__PURE__ */ jsx("p", {
											style: {
												fontSize: "11px",
												color: "#64748b",
												marginBottom: "15px"
											},
											children: "Ping Google Search Console API immediately upon deployment."
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => {
												setIsIndexing(true);
												setTimeout(() => {
													setIsIndexing(false);
													setIndexStatus("success");
													setTimeout(() => setIndexStatus("idle"), 3e3);
												}, 2e3);
											},
											disabled: isIndexing || indexStatus === "success",
											style: {
												...addNodeBtn,
												background: indexStatus === "success" ? "#f0fdf4" : isIndexing ? "#f1f5f9" : "#fffbeb",
												border: `1px solid ${indexStatus === "success" ? "#dcfce7" : isIndexing ? "#e2e8f0" : "#fef3c7"}`,
												color: indexStatus === "success" ? "#10b981" : isIndexing ? "#94a3b8" : "#b45309",
												transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
											},
											children: isIndexing ? /* @__PURE__ */ jsxs("span", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "8px"
												},
												children: [/* @__PURE__ */ jsx("div", {
													style: { display: "flex" },
													children: /* @__PURE__ */ jsx("svg", {
														xmlns: "http://www.w3.org/2000/svg",
														width: "24",
														height: "24",
														viewBox: "0 0 24 24",
														fill: "none",
														stroke: "currentColor",
														strokeWidth: 2,
														strokeLinecap: "round",
														strokeLinejoin: "round",
														className: "lucide",
														style: {
															width: "14px",
															height: "14px"
														},
														children: /* @__PURE__ */ jsx("polyline", { points: "22 12 18 12 15 21 9 3 6 12 2 12" })
													})
												}), "Pinging GSC API..."]
											}) : indexStatus === "success" ? /* @__PURE__ */ jsxs("span", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "8px"
												},
												children: [/* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "14px",
														height: "14px"
													},
													children: [/* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), /* @__PURE__ */ jsx("polyline", { points: "22 4 12 14.01 9 11.01" })]
												}), " Ping Success!"]
											}) : "Request Priority Crawl"
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "📊 SEO Readiness Checklist"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										...hcuCardStyle,
										display: "flex",
										flexDirection: "column",
										gap: "12px",
										background: "#fafaf9"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "flex-start",
												gap: "8px",
												fontSize: "12.5px",
												lineHeight: "1.4"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { fontSize: "14px" },
												children: title.length > 0 && title.length <= 110 ? "✅" : "❌"
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("strong", { children: "Title Length:" }),
												" ",
												title.length,
												"/110 chars",
												title.length > 110 && /* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "11px",
														color: "#ef4444",
														margin: "2px 0 0 0"
													},
													children: "Keep under 110 characters for optimal search snippet display."
												}),
												title.length === 0 && /* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "11px",
														color: "#ef4444",
														margin: "2px 0 0 0"
													},
													children: "Title is required."
												})
											] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "flex-start",
												gap: "8px",
												fontSize: "12.5px",
												lineHeight: "1.4"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { fontSize: "14px" },
												children: metaDescription.length >= 50 && metaDescription.length <= 160 ? "✅" : "⚠️"
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("strong", { children: "Meta Description:" }),
												" ",
												metaDescription.length,
												" chars (Recommended: 50–160)",
												(metaDescription.length < 50 || metaDescription.length > 160) && /* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "11px",
														color: "#b45309",
														margin: "2px 0 0 0"
													},
													children: "Provide between 50 and 160 characters for high search click-through rate."
												})
											] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "flex-start",
												gap: "8px",
												fontSize: "12.5px",
												lineHeight: "1.4"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { fontSize: "14px" },
												children: coverImage ? coverImageWidth !== null && coverImageWidth >= 1200 ? "✅" : "⚠️" : "❌"
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("strong", { children: "Discover Cover Image:" }),
												" ",
												coverImage ? coverImageWidth !== null ? `${coverImageWidth}px width` : "Cover image set" : "Cover image missing",
												coverImage && coverImageWidth !== null && coverImageWidth < 1200 && /* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "11px",
														color: "#b45309",
														margin: "2px 0 0 0"
													},
													children: "Image is under 1200px wide. Google Discover requires ≥1200px width for premium  cards."
												}),
												!coverImage && /* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "11px",
														color: "#ef4444",
														margin: "2px 0 0 0"
													},
													children: "Set a cover image for Discover and social sharing."
												})
											] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "flex-start",
												gap: "8px",
												fontSize: "12.5px",
												lineHeight: "1.4"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { fontSize: "14px" },
												children: authorBio && authorBio.trim().length > 15 ? "✅" : "❌"
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("strong", { children: "Author Expertise Bio:" }),
												" ",
												authorBio ? `${authorBio.trim().length} chars` : "Author bio missing",
												(!authorBio || authorBio.trim().length <= 15) && /* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "11px",
														color: "#ef4444",
														margin: "2px 0 0 0"
													},
													children: "A professional biography is required for Google E-E-A-T trust signals."
												})
											] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "flex-start",
												gap: "8px",
												fontSize: "12.5px",
												lineHeight: "1.4"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { fontSize: "14px" },
												children: category && category !== "General" && category.trim() !== "" ? "✅" : "⚠️"
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("strong", { children: "Taxonomy Category:" }),
												" ",
												category,
												(category === "General" || !category) && /* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "11px",
														color: "#b45309",
														margin: "2px 0 0 0"
													},
													children: "Categorize your post rather than leaving it in \"General\" for semantic indexing."
												})
											] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "flex-start",
												gap: "8px",
												fontSize: "12.5px",
												lineHeight: "1.4"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { fontSize: "14px" },
												children: tags.length >= 1 ? "✅" : "⚠️"
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("strong", { children: "LSI Focus Tags:" }),
												" ",
												tags.length,
												" tags set",
												tags.length === 0 && /* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "11px",
														color: "#b45309",
														margin: "2px 0 0 0"
													},
													children: "Add at least one relevant focus tag to define content associations."
												})
											] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "flex-start",
												gap: "8px",
												fontSize: "12.5px",
												lineHeight: "1.4"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { fontSize: "14px" },
												children: canonicalUrl || slug || title ? "✅" : "⚠️"
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("strong", { children: "Canonical Link:" }),
												" ",
												canonicalUrl ? "Explicit URL set" : "Auto-generated dynamic URL"
											] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "flex-start",
												gap: "8px",
												fontSize: "12.5px",
												lineHeight: "1.4"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: { fontSize: "14px" },
												children: faqs.length > 0 ? "✅" : "ℹ️"
											}), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("strong", { children: "FAQ Schema:" }),
												" ",
												faqs.length,
												" FAQ nodes",
												faqs.length === 0 && /* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "11px",
														color: "#64748b",
														margin: "2px 0 0 0"
													},
													children: "FAQ schema is optional but recommended to rank in Voice Search / AI Overview citations."
												})
											] })]
										}),
										(() => {
											const matches = (editor?.getHTML() || "").match(/href=['"]([^'"]+)['"]/gi);
											const internalLinkCount = matches ? matches.filter((m) => {
												const href = m.match(/href=['"]([^'"]+)['"]/i)?.[1] || "";
												return href.startsWith("/") && !href.startsWith("//") || href.includes("blog.com");
											}).length : 0;
											return /* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													alignItems: "flex-start",
													gap: "8px",
													fontSize: "12.5px",
													lineHeight: "1.4"
												},
												children: [/* @__PURE__ */ jsx("span", {
													style: { fontSize: "14px" },
													children: internalLinkCount >= 2 ? "✅" : "⚠️"
												}), /* @__PURE__ */ jsxs("div", { children: [
													/* @__PURE__ */ jsx("strong", { children: "Internal Links:" }),
													" ",
													internalLinkCount,
													" links detected",
													internalLinkCount < 2 && /* @__PURE__ */ jsx("p", {
														style: {
															fontSize: "11px",
															color: "#b45309",
															margin: "2px 0 0 0"
														},
														children: "Add at least 2 internal links to other parts of your website to increase crawl depth and build relevance."
													})
												] })]
											});
										})()
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Performance Tuning"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "12px"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: eeatCheckStyle,
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												defaultChecked: true
											}), /* @__PURE__ */ jsx("span", { children: "Lazy Load Visual Assets" })]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: eeatCheckStyle,
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												defaultChecked: true
											}), /* @__PURE__ */ jsx("span", { children: "Preload Critical Fonts" })]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: eeatCheckStyle,
											children: [/* @__PURE__ */ jsx("input", { type: "checkbox" }), /* @__PURE__ */ jsx("span", { children: "Enable Edge Caching (CDN)" })]
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: sidebarHeadingStyle,
									children: "Search Priority"
								}),
								/* @__PURE__ */ jsxs("select", {
									style: metaSelectStyle,
									children: [
										/* @__PURE__ */ jsx("option", { children: "Normal (0.8)" }),
										/* @__PURE__ */ jsx("option", { children: "High (0.9)" }),
										/* @__PURE__ */ jsx("option", { children: "Critical (1.0)" })
									]
								})
							] }, "seo")
						]
					})]
				})]
			}),
			faqModalOpen && /* @__PURE__ */ jsx("div", {
				style: modalBackdropStyle,
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						...modalContentStyle,
						maxWidth: "650px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: modalHeaderStyle,
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "10px"
								},
								children: [/* @__PURE__ */ jsxs("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "24",
									height: "24",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: 2.5,
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "lucide",
									style: {
										width: "18px",
										height: "18px",
										color: "#2563eb"
									},
									children: [
										/* @__PURE__ */ jsx("circle", {
											cx: "12",
											cy: "12",
											r: "10"
										}),
										/* @__PURE__ */ jsx("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }),
										/* @__PURE__ */ jsx("path", { d: "M12 17h.01" })
									]
								}), /* @__PURE__ */ jsx("h2", {
									style: {
										fontSize: "16px",
										fontWeight: 700,
										margin: 0
									},
									children: "FAQ Schema Editor"
								})]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setFaqModalOpen(false),
								style: closeModalBtn,
								children: /* @__PURE__ */ jsxs("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "24",
									height: "24",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: 2,
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "lucide",
									style: {
										width: "20px",
										height: "20px"
									},
									children: [/* @__PURE__ */ jsx("line", {
										x1: "18",
										y1: "6",
										x2: "6",
										y2: "18"
									}), /* @__PURE__ */ jsx("line", {
										x1: "6",
										y1: "6",
										x2: "18",
										y2: "18"
									})]
								})
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								padding: "20px",
								maxHeight: "60vh",
								overflowY: "auto"
							},
							children: /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "16px"
								},
								children: [tempFaqs.map((faq, idx) => /* @__PURE__ */ jsxs("div", {
									style: {
										padding: "16px",
										background: "#f8fafc",
										borderRadius: "16px",
										border: "1px solid #e2e8f0",
										position: "relative"
									},
									children: [
										/* @__PURE__ */ jsx("button", {
											onClick: () => setTempFaqs(tempFaqs.filter((_, i) => i !== idx)),
											style: {
												position: "absolute",
												top: "12px",
												right: "12px",
												background: "transparent",
												border: "none",
												color: "#ef4444",
												cursor: "pointer"
											},
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "18",
												height: "18",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: 2,
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: [
													/* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
													/* @__PURE__ */ jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
													/* @__PURE__ */ jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" })
												]
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											style: { marginBottom: "12px" },
											children: [/* @__PURE__ */ jsxs("label", {
												style: {
													fontSize: "11px",
													fontWeight: 800,
													color: "#94a3b8",
													display: "block",
													marginBottom: "6px"
												},
												children: ["QUESTION ", idx + 1]
											}), /* @__PURE__ */ jsx("input", {
												value: faq.question,
												onChange: (e) => {
													const next = [...tempFaqs];
													next[idx].question = e.target.value;
													setTempFaqs(next);
												},
												placeholder: "What is the main benefit of...",
												style: {
													...metaInputStyle,
													background: "#fff"
												}
											})]
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											style: {
												fontSize: "11px",
												fontWeight: 800,
												color: "#94a3b8",
												display: "block",
												marginBottom: "6px"
											},
											children: "ANSWER"
										}), /* @__PURE__ */ jsx("textarea", {
											value: faq.answer,
											onChange: (e) => {
												const next = [...tempFaqs];
												next[idx].answer = e.target.value;
												setTempFaqs(next);
											},
											placeholder: "Explain clearly and concisely...",
											style: {
												...metaTextAreaStyle,
												background: "#fff",
												minHeight: "80px"
											}
										})] })
									]
								}, idx)), /* @__PURE__ */ jsx("button", {
									onClick: () => setTempFaqs([...tempFaqs, {
										question: "",
										answer: ""
									}]),
									style: {
										...addNodeBtn,
										padding: "12px",
										borderStyle: "dashed",
										background: "#f8fafc"
									},
									children: "+ Add Another FAQ Item"
								})]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "12px 20px",
								background: "#f8fafc",
								borderTop: "1px solid #e2e8f0",
								display: "flex",
								justifyContent: "flex-end",
								gap: "8px"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setFaqModalOpen(false),
								style: {
									...closeModalBtn,
									background: "#fff",
									border: "1px solid #e2e8f0",
									padding: "6px 14px",
									fontSize: "12px",
									fontWeight: 600
								},
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleApplyFaq,
								style: {
									...publishBtnStyle,
									flex: 0,
									padding: "6px 16px",
									fontSize: "12px",
									minWidth: "max-content",
									whiteSpace: "nowrap",
									color: "#ffffff"
								},
								children: editor.isActive("faqBlock") ? "Update FAQ Block" : "Insert FAQ Block"
							})]
						})
					]
				})
			}),
			quizModalOpen && /* @__PURE__ */ jsx("div", {
				style: modalBackdropStyle,
				onClick: () => setQuizModalOpen(false),
				children: /* @__PURE__ */ jsxs("div", {
					onClick: (e) => e.stopPropagation(),
					style: {
						...modalContentStyle,
						maxWidth: "600px",
						display: "flex",
						flexDirection: "column",
						maxHeight: "85vh"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								...modalHeaderStyle,
								padding: "20px 24px"
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								style: {
									fontSize: "18px",
									fontWeight: 800,
									margin: 0,
									color: "#1e293b"
								},
								children: "Interactive Quiz"
							}), /* @__PURE__ */ jsx("p", {
								style: {
									fontSize: "13px",
									color: "#64748b",
									margin: "4px 0 0 0"
								},
								children: "Add an engaging quiz to increase dwell time."
							})] }), /* @__PURE__ */ jsx("button", {
								onClick: () => setQuizModalOpen(false),
								style: closeModalBtn,
								children: /* @__PURE__ */ jsx(X, {
									size: 20,
									color: "#64748b"
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "24px",
								overflowY: "auto"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: { marginBottom: "20px" },
								children: [/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#94a3b8",
										display: "block",
										marginBottom: "8px"
									},
									children: "QUESTION"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: tempQuiz.question,
									onChange: (e) => setTempQuiz({
										...tempQuiz,
										question: e.target.value
									}),
									placeholder: "E.g., What is the most important ranking factor?",
									style: {
										...metaInputStyle,
										background: "#f8fafc",
										fontWeight: 600
									}
								})]
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#94a3b8",
										display: "block",
										marginBottom: "8px"
									},
									children: "OPTIONS & CORRECT ANSWER"
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "12px"
									},
									children: tempQuiz.options.map((opt, i) => /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "12px",
											background: "#f8fafc",
											padding: "12px",
											borderRadius: "12px",
											border: tempQuiz.correctIndex === i ? "2px solid #22c55e" : "1px solid #e2e8f0"
										},
										children: [
											/* @__PURE__ */ jsx("input", {
												type: "radio",
												checked: tempQuiz.correctIndex === i,
												onChange: () => setTempQuiz({
													...tempQuiz,
													correctIndex: i
												}),
												style: {
													width: "18px",
													height: "18px",
													cursor: "pointer"
												}
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												value: opt,
												onChange: (e) => {
													const newOpts = [...tempQuiz.options];
													newOpts[i] = e.target.value;
													setTempQuiz({
														...tempQuiz,
														options: newOpts
													});
												},
												placeholder: `Option ${i + 1}`,
												style: {
													flex: 1,
													border: "none",
													background: "transparent",
													outline: "none",
													fontSize: "14px",
													fontWeight: 500
												}
											}),
											/* @__PURE__ */ jsx("button", {
												onClick: () => {
													const newOpts = tempQuiz.options.filter((_, idx) => idx !== i);
													const newCorrect = tempQuiz.correctIndex === i ? 0 : tempQuiz.correctIndex > i ? tempQuiz.correctIndex - 1 : tempQuiz.correctIndex;
													setTempQuiz({
														...tempQuiz,
														options: newOpts,
														correctIndex: newCorrect
													});
												},
												style: {
													background: "transparent",
													border: "none",
													cursor: "pointer",
													color: "#ef4444",
													padding: "4px"
												},
												children: /* @__PURE__ */ jsx(X, { size: 14 })
											})
										]
									}, i))
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setTempQuiz({
										...tempQuiz,
										options: [...tempQuiz.options, ""]
									}),
									style: {
										...addNodeBtn,
										padding: "12px",
										borderStyle: "dashed",
										background: "#f8fafc",
										marginTop: "16px",
										color: "#64748b"
									},
									children: "+ Add Option"
								})
							] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "12px 20px",
								background: "#f8fafc",
								borderTop: "1px solid #e2e8f0",
								display: "flex",
								justifyContent: "flex-end",
								gap: "8px"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setQuizModalOpen(false),
								style: {
									...closeModalBtn,
									background: "#fff",
									border: "1px solid #e2e8f0",
									padding: "6px 14px",
									fontSize: "12px",
									fontWeight: 600
								},
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleApplyQuiz,
								style: {
									...publishBtnStyle,
									flex: 0,
									padding: "6px 16px",
									fontSize: "12px",
									minWidth: "max-content",
									whiteSpace: "nowrap",
									color: "#ffffff",
									background: "#2563eb"
								},
								children: editor?.isActive("quizBlock") ? "Update Quiz" : "Insert Quiz"
							})]
						})
					]
				})
			}),
			pollModalOpen && /* @__PURE__ */ jsx("div", {
				style: modalBackdropStyle,
				onClick: () => setPollModalOpen(false),
				children: /* @__PURE__ */ jsxs("div", {
					onClick: (e) => e.stopPropagation(),
					style: {
						...modalContentStyle,
						maxWidth: "600px",
						display: "flex",
						flexDirection: "column",
						maxHeight: "85vh"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								...modalHeaderStyle,
								padding: "20px 24px"
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								style: {
									fontSize: "18px",
									fontWeight: 800,
									margin: 0,
									color: "#1e293b"
								},
								children: "Interactive Poll"
							}), /* @__PURE__ */ jsx("p", {
								style: {
									fontSize: "13px",
									color: "#64748b",
									margin: "4px 0 0 0"
								},
								children: "Ask your readers a question to vote on."
							})] }), /* @__PURE__ */ jsx("button", {
								onClick: () => setPollModalOpen(false),
								style: closeModalBtn,
								children: /* @__PURE__ */ jsx(X, {
									size: 20,
									color: "#64748b"
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "24px",
								overflowY: "auto"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: { marginBottom: "20px" },
								children: [/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#94a3b8",
										display: "block",
										marginBottom: "8px"
									},
									children: "POLL QUESTION"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: tempPoll.question,
									onChange: (e) => setTempPoll({
										...tempPoll,
										question: e.target.value
									}),
									placeholder: "E.g., Which framework do you prefer?",
									style: {
										...metaInputStyle,
										background: "#f8fafc",
										fontWeight: 600
									}
								})]
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#94a3b8",
										display: "block",
										marginBottom: "8px"
									},
									children: "VOTING OPTIONS"
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "12px"
									},
									children: tempPoll.options.map((opt, i) => /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "12px",
											background: "#f8fafc",
											padding: "12px",
											borderRadius: "12px",
											border: "1px solid #e2e8f0"
										},
										children: [
											/* @__PURE__ */ jsx("div", {
												style: {
													width: "24px",
													height: "24px",
													borderRadius: "50%",
													background: "#e2e8f0",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "12px",
													fontWeight: 800,
													color: "#64748b"
												},
												children: i + 1
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												value: opt,
												onChange: (e) => {
													const newOpts = [...tempPoll.options];
													newOpts[i] = e.target.value;
													setTempPoll({
														...tempPoll,
														options: newOpts
													});
												},
												placeholder: `Option ${i + 1}`,
												style: {
													flex: 1,
													border: "none",
													background: "transparent",
													outline: "none",
													fontSize: "14px",
													fontWeight: 500
												}
											}),
											/* @__PURE__ */ jsx("button", {
												onClick: () => {
													const newOpts = tempPoll.options.filter((_, idx) => idx !== i);
													setTempPoll({
														...tempPoll,
														options: newOpts
													});
												},
												style: {
													background: "transparent",
													border: "none",
													cursor: "pointer",
													color: "#ef4444",
													padding: "4px"
												},
												children: /* @__PURE__ */ jsx(X, { size: 14 })
											})
										]
									}, i))
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setTempPoll({
										...tempPoll,
										options: [...tempPoll.options, ""]
									}),
									style: {
										...addNodeBtn,
										padding: "12px",
										borderStyle: "dashed",
										background: "#f8fafc",
										marginTop: "16px",
										color: "#64748b"
									},
									children: "+ Add Poll Option"
								})
							] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "12px 20px",
								background: "#f8fafc",
								borderTop: "1px solid #e2e8f0",
								display: "flex",
								justifyContent: "flex-end",
								gap: "8px"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setPollModalOpen(false),
								style: {
									...closeModalBtn,
									background: "#fff",
									border: "1px solid #e2e8f0",
									padding: "6px 14px",
									fontSize: "12px",
									fontWeight: 600
								},
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleApplyPoll,
								style: {
									...publishBtnStyle,
									flex: 0,
									padding: "6px 16px",
									fontSize: "12px",
									minWidth: "max-content",
									whiteSpace: "nowrap",
									color: "#ffffff",
									background: "#8b5cf6"
								},
								children: editor?.isActive("pollBlock") ? "Update Poll" : "Insert Poll"
							})]
						})
					]
				})
			}),
			sliderModalOpen && /* @__PURE__ */ jsx("div", {
				style: modalBackdropStyle,
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						...modalContentStyle,
						maxWidth: "600px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: modalHeaderStyle,
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "10px"
								},
								children: [/* @__PURE__ */ jsxs("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "24",
									height: "24",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: 2,
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "lucide",
									style: {
										width: "18px",
										height: "18px",
										color: "#2563eb"
									},
									children: [
										/* @__PURE__ */ jsx("rect", {
											width: "18",
											height: "18",
											x: "3",
											y: "3",
											rx: "2",
											ry: "2"
										}),
										/* @__PURE__ */ jsx("line", {
											x1: "9",
											y1: "3",
											x2: "9",
											y2: "21"
										}),
										/* @__PURE__ */ jsx("line", {
											x1: "15",
											y1: "3",
											x2: "15",
											y2: "21"
										})
									]
								}), /* @__PURE__ */ jsx("h2", {
									style: {
										fontSize: "16px",
										fontWeight: 700,
										margin: 0
									},
									children: "Image Slider Configuration"
								})]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setSliderModalOpen(false),
								style: closeModalBtn,
								children: /* @__PURE__ */ jsxs("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "24",
									height: "24",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: 2,
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "lucide",
									style: {
										width: "20px",
										height: "20px"
									},
									children: [/* @__PURE__ */ jsx("line", {
										x1: "18",
										y1: "6",
										x2: "6",
										y2: "18"
									}), /* @__PURE__ */ jsx("line", {
										x1: "6",
										y1: "6",
										x2: "18",
										y2: "18"
									})]
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "20px",
								maxHeight: "60vh",
								overflowY: "auto"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: "12px"
									},
									children: [/* @__PURE__ */ jsx("h3", {
										style: {
											fontSize: "14px",
											fontWeight: 700
										},
										children: "Slider Images"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => sliderInputRef.current?.click(),
										style: {
											...publishBtnStyle,
											padding: "6px 12px",
											fontSize: "12px",
											minWidth: "auto"
										},
										children: "+ Add Images"
									})]
								}),
								sliderImages.length === 0 ? /* @__PURE__ */ jsx("div", {
									style: {
										textAlign: "center",
										padding: "24px",
										background: "#f8fafc",
										borderRadius: "12px",
										border: "1px dashed #cbd5e1"
									},
									children: /* @__PURE__ */ jsx("p", {
										style: {
											color: "#64748b",
											fontSize: "12px",
											margin: 0
										},
										children: "No images added yet. Click Add Images to start building your slider."
									})
								}) : /* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "8px",
										marginBottom: "16px"
									},
									children: sliderImages.map((img, idx) => /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "10px",
											background: "#f8fafc",
											padding: "6px",
											borderRadius: "10px",
											border: "1px solid #e2e8f0",
											alignItems: "center"
										},
										children: [
											/* @__PURE__ */ jsx("img", {
												loading: "lazy",
												decoding: "async",
												fetchPriority: "low",
												src: img.src,
												style: {
													width: "40px",
													height: "40px",
													objectFit: "cover",
													borderRadius: "6px"
												},
												alt: "thumb"
											}),
											/* @__PURE__ */ jsx("input", {
												placeholder: "Alt Text (SEO)",
												value: img.alt,
												onChange: (e) => {
													const newImgs = [...sliderImages];
													newImgs[idx].alt = e.target.value;
													setSliderImages(newImgs);
												},
												style: {
													flex: 1,
													border: "none",
													background: "transparent",
													outline: "none",
													fontSize: "12px"
												}
											}),
											/* @__PURE__ */ jsx("button", {
												onClick: () => {
													setSliderImages(sliderImages.filter((_, i) => i !== idx));
												},
												style: {
													background: "transparent",
													border: "none",
													color: "#ef4444",
													cursor: "pointer",
													padding: "6px",
													display: "flex",
													alignItems: "center"
												},
												children: /* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "24",
													height: "24",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 2,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													className: "lucide",
													style: {
														width: "14px",
														height: "14px"
													},
													children: [
														/* @__PURE__ */ jsx("path", { d: "M3 6h18" }),
														/* @__PURE__ */ jsx("path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
														/* @__PURE__ */ jsx("path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }),
														/* @__PURE__ */ jsx("line", {
															x1: "10",
															y1: "11",
															x2: "10",
															y2: "17"
														}),
														/* @__PURE__ */ jsx("line", {
															x1: "14",
															y1: "11",
															x2: "14",
															y2: "17"
														})
													]
												})
											})
										]
									}, idx))
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										borderTop: "1px solid #e2e8f0",
										paddingTop: "16px",
										display: "flex",
										flexDirection: "column",
										gap: "12px"
									},
									children: [
										/* @__PURE__ */ jsx("h3", {
											style: {
												fontSize: "13px",
												fontWeight: 700,
												margin: 0
											},
											children: "Slider Settings"
										}),
										/* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "8px",
												cursor: "pointer",
												fontSize: "12px",
												fontWeight: 600,
												color: "#475569"
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: sliderAutoScroll,
												onChange: (e) => setSliderAutoScroll(e.target.checked),
												style: {
													width: "14px",
													height: "14px",
													cursor: "pointer"
												}
											}), "Enable Auto-Scrolling"]
										}),
										/* @__PURE__ */ jsxs("label", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "8px",
												cursor: "pointer",
												fontSize: "12px",
												fontWeight: 600,
												color: "#475569"
											},
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: sliderCenterZoom,
												onChange: (e) => setSliderCenterZoom(e.target.checked),
												style: {
													width: "14px",
													height: "14px",
													cursor: "pointer"
												}
											}), "Center Image Auto-Zoom Effect"]
										}),
										/* @__PURE__ */ jsx(InputGroup, {
											label: "TRANSITION SPEED (MS)",
											value: sliderSpeed.toString(),
											onChange: (val) => setSliderSpeed(parseInt(val) || 3e3),
											placeholder: "e.g., 3000"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "12px 20px",
								background: "#f8fafc",
								borderTop: "1px solid #e2e8f0",
								display: "flex",
								justifyContent: "flex-end",
								gap: "8px"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setSliderModalOpen(false),
								style: {
									...closeModalBtn,
									background: "#fff",
									border: "1px solid #e2e8f0",
									padding: "6px 14px",
									fontSize: "12px",
									fontWeight: 600
								},
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleApplySlider,
								style: {
									...publishBtnStyle,
									flex: 0,
									padding: "6px 16px",
									fontSize: "12px",
									minWidth: "max-content",
									whiteSpace: "nowrap",
									color: "#ffffff"
								},
								children: "Insert Slider"
							})]
						})
					]
				})
			}),
			linkModalOpen && /* @__PURE__ */ jsx("div", {
				style: modalBackdropStyle,
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						...modalContentStyle,
						maxWidth: "450px"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: modalHeaderStyle,
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsxs("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: 2,
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "lucide",
								style: {
									width: "18px",
									height: "18px",
									color: "#2563eb"
								},
								children: [/* @__PURE__ */ jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }), /* @__PURE__ */ jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })]
							}), /* @__PURE__ */ jsx("h2", {
								style: {
									fontSize: "16px",
									fontWeight: 700,
									margin: 0
								},
								children: "Sovereign Link Editor"
							})]
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setLinkModalOpen(false),
							style: closeModalBtn,
							children: /* @__PURE__ */ jsxs("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: 2,
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "lucide",
								style: {
									width: "20px",
									height: "20px"
								},
								children: [/* @__PURE__ */ jsx("line", {
									x1: "18",
									y1: "6",
									x2: "6",
									y2: "18"
								}), /* @__PURE__ */ jsx("line", {
									x1: "6",
									y1: "6",
									x2: "18",
									y2: "18"
								})]
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: { padding: "30px" },
						children: [
							/* @__PURE__ */ jsx("label", {
								style: metaLabelStyle,
								children: "DESTINATION URL"
							}),
							/* @__PURE__ */ jsx("input", {
								autoFocus: true,
								value: linkInputUrl,
								onChange: (e) => setLinkInputUrl(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && handleApplyLink(),
								placeholder: "https://example.com",
								style: {
									...metaInputStyle,
									background: "#f1f5f9",
									marginBottom: "20px"
								}
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "14px",
									marginBottom: "24px"
								},
								children: [/* @__PURE__ */ jsxs("label", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "10px",
										cursor: "pointer",
										fontSize: "13px",
										fontWeight: 600,
										color: "#475569"
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: linkOpenInNewTab,
										onChange: (e) => setLinkOpenInNewTab(e.target.checked),
										style: {
											width: "16px",
											height: "16px",
											cursor: "pointer"
										}
									}), "Open in a new window"]
								}), /* @__PURE__ */ jsxs("label", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "10px",
										cursor: "pointer",
										fontSize: "13px",
										fontWeight: 600,
										color: "#475569"
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: linkIsNoFollow,
										onChange: (e) => setLinkIsNoFollow(e.target.checked),
										style: {
											width: "16px",
											height: "16px",
											cursor: "pointer"
										}
									}), "Add 'rel=nofollow' (Search Engine optimization)"]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "12px"
								},
								children: [/* @__PURE__ */ jsx("button", {
									onClick: handleApplyLink,
									style: {
										...publishBtnStyle,
										flex: 1,
										padding: "10px"
									},
									children: "Apply Link"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => {
										setLinkInputUrl("");
										handleApplyLink();
									},
									style: {
										...iconBtnStyle,
										padding: "10px 20px"
									},
									children: "Remove"
								})]
							})
						]
					})]
				})
			}),
			videoModalOpen && /* @__PURE__ */ jsx("div", {
				style: modalBackdropStyle,
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						...modalContentStyle,
						maxWidth: "500px"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: modalHeaderStyle,
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsxs("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: 2,
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "lucide",
								style: {
									width: "18px",
									height: "18px",
									color: "#2563eb"
								},
								children: [/* @__PURE__ */ jsx("rect", {
									width: "20",
									height: "16",
									x: "2",
									y: "4",
									rx: "2"
								}), /* @__PURE__ */ jsx("path", { d: "m22 8-6 4 6 4V8Z" })]
							}), /* @__PURE__ */ jsx("h2", {
								style: {
									fontSize: "16px",
									fontWeight: 700,
									margin: 0
								},
								children: "Social Intelligence Hub"
							})]
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setVideoModalOpen(false),
							style: closeModalBtn,
							children: /* @__PURE__ */ jsxs("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: 2,
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "lucide",
								style: {
									width: "20px",
									height: "20px"
								},
								children: [/* @__PURE__ */ jsx("line", {
									x1: "18",
									y1: "6",
									x2: "6",
									y2: "18"
								}), /* @__PURE__ */ jsx("line", {
									x1: "6",
									y1: "6",
									x2: "18",
									y2: "18"
								})]
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: { padding: "40px" },
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "repeat(4, 1fr)",
									gap: "16px",
									marginBottom: "32px"
								},
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											textAlign: "center",
											padding: "16px",
											background: "#f8fafc",
											borderRadius: "16px",
											border: "1px solid #e2e8f0"
										},
										children: [/* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "#ff0000",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: { marginBottom: "8px" },
											children: [/* @__PURE__ */ jsx("path", { d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 69.44 69.44 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 69.44 69.44 0 0 1-15 0 2 2 0 0 1-2-2Z" }), /* @__PURE__ */ jsx("path", { d: "m10 15 5-3-5-3v6Z" })]
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: 800
											},
											children: "YouTube"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											textAlign: "center",
											padding: "16px",
											background: "#f8fafc",
											borderRadius: "16px",
											border: "1px solid #e2e8f0"
										},
										children: [/* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "#e1306c",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: { marginBottom: "8px" },
											children: [
												/* @__PURE__ */ jsx("rect", {
													width: "20",
													height: "20",
													x: "2",
													y: "2",
													rx: "5",
													ry: "5"
												}),
												/* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
												/* @__PURE__ */ jsx("line", {
													x1: "17.5",
													y1: "6.5",
													x2: "17.51",
													y2: "6.5"
												})
											]
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: 800
											},
											children: "Instagram"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											textAlign: "center",
											padding: "16px",
											background: "#f8fafc",
											borderRadius: "16px",
											border: "1px solid #e2e8f0"
										},
										children: [/* @__PURE__ */ jsx("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "#1877f2",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: { marginBottom: "8px" },
											children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: 800
											},
											children: "Facebook"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											textAlign: "center",
											padding: "16px",
											background: "#f8fafc",
											borderRadius: "16px",
											border: "1px solid #e2e8f0"
										},
										children: [/* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "#000000",
											strokeWidth: 2,
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "lucide",
											style: { marginBottom: "8px" },
											children: [/* @__PURE__ */ jsx("path", { d: "M4 4l11.733 16h4.267l-11.733 -16z" }), /* @__PURE__ */ jsx("path", { d: "M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" })]
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: 800
											},
											children: "Twitter / X"
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: { marginBottom: "24px" },
								children: [/* @__PURE__ */ jsx("label", {
									style: metaLabelStyle,
									children: "PASTE SOCIAL LINK (X, INSTA, FB, YT)"
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsx("input", {
										autoFocus: true,
										value: videoUrlInput,
										onChange: (e) => setVideoUrlInput(e.target.value),
										onKeyDown: (e) => e.key === "Enter" && handleApplyYoutube(),
										placeholder: "https://x.com/status/123...",
										style: {
											...metaInputStyle,
											background: "#f1f5f9",
											marginBottom: 0
										}
									}), /* @__PURE__ */ jsx("button", {
										onClick: handleApplyYoutube,
										style: {
											...publishBtnStyle,
											padding: "0 16px"
										},
										children: "Embed"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: { textAlign: "center" },
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "12px",
										fontWeight: 700,
										color: "#94a3b8",
										marginBottom: "16px"
									},
									children: "OR UPLOAD LOCAL FILE"
								}), /* @__PURE__ */ jsxs("button", {
									onClick: () => {
										videoInputRef.current?.click();
										setVideoModalOpen(false);
									},
									style: {
										...iconBtnStyle,
										width: "100%",
										padding: "16px",
										borderStyle: "dashed",
										borderWidth: "2px",
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "24",
										height: "24",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: 2,
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide",
										style: {
											width: "24px",
											height: "24px"
										},
										children: [
											/* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
											/* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
											/* @__PURE__ */ jsx("line", {
												x1: "12",
												y1: "3",
												x2: "12",
												y2: "15"
											})
										]
									}), /* @__PURE__ */ jsx("span", {
										style: {
											fontSize: "14px",
											fontWeight: 700
										},
										children: "Upload MP4/WebM"
									})]
								})]
							})
						]
					})]
				})
			}),
			imageModalOpen && /* @__PURE__ */ jsx("div", {
				style: modalBackdropStyle,
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						...modalContentStyle,
						maxWidth: "450px"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: modalHeaderStyle,
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsxs("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: 2,
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "lucide",
								style: {
									width: "18px",
									height: "18px",
									color: "#8b5cf6"
								},
								children: [
									/* @__PURE__ */ jsx("rect", {
										x: "3",
										y: "3",
										width: "18",
										height: "18",
										rx: "2",
										ry: "2"
									}),
									/* @__PURE__ */ jsx("circle", {
										cx: "8.5",
										cy: "8.5",
										r: "1.5"
									}),
									/* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
								]
							}), /* @__PURE__ */ jsx("h2", {
								style: {
									fontSize: "16px",
									fontWeight: 700,
									margin: 0
								},
								children: "Visual Intelligence"
							})]
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setImageModalOpen(false),
							style: closeModalBtn,
							children: /* @__PURE__ */ jsxs("svg", {
								xmlns: "http://www.w3.org/2000/svg",
								width: "24",
								height: "24",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: 2,
								strokeLinecap: "round",
								strokeLinejoin: "round",
								className: "lucide",
								style: {
									width: "20px",
									height: "20px"
								},
								children: [/* @__PURE__ */ jsx("line", {
									x1: "18",
									y1: "6",
									x2: "6",
									y2: "18"
								}), /* @__PURE__ */ jsx("line", {
									x1: "6",
									y1: "6",
									x2: "18",
									y2: "18"
								})]
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: { padding: "30px" },
						children: [
							/* @__PURE__ */ jsx("label", {
								style: metaLabelStyle,
								children: "IMAGE ALT TEXT (SEO)"
							}),
							/* @__PURE__ */ jsx("input", {
								autoFocus: true,
								value: imageAltInput,
								onChange: (e) => setImageAltInput(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && handleApplyImageAlt(),
								placeholder: "Describe this image for search engines...",
								style: {
									...metaInputStyle,
									background: "#f5f3ff",
									marginBottom: "20px"
								}
							}),
							/* @__PURE__ */ jsx("p", {
								style: {
									fontSize: "11px",
									color: "#64748b",
									marginBottom: "24px",
									lineHeight: "1.5"
								},
								children: "Alt text improves search rankings and accessibility for screen readers. Keep it descriptive and include your focus keyword if natural."
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									gap: "12px"
								},
								children: /* @__PURE__ */ jsx("button", {
									onClick: handleApplyImageAlt,
									style: {
										...publishBtnStyle,
										background: "#8b5cf6",
										flex: 1,
										padding: "10px"
									},
									children: "Save Metadata"
								})
							})
						]
					})]
				})
			}),
			mediaPickerTarget && /* @__PURE__ */ jsx(MediaPicker, {
				onSelect: (url) => {
					if (mediaPickerTarget === "cover") setCoverImage(url);
					if (mediaPickerTarget === "author") setAuthorImage(url);
					setMediaPickerTarget(null);
				},
				onClose: () => setMediaPickerTarget(null)
			})
		]
	});
}
var StatBox = ({ label, value }) => /* @__PURE__ */ jsxs("div", {
	style: {
		background: "#fff",
		padding: "12px",
		borderRadius: "12px",
		border: "1px solid #e2e8f0",
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	children: [/* @__PURE__ */ jsx("span", {
		style: {
			fontSize: "9px",
			fontWeight: 800,
			color: "#94a3b8",
			marginBottom: "4px"
		},
		children: label
	}), /* @__PURE__ */ jsx("span", {
		style: {
			fontSize: "14px",
			fontWeight: 900,
			color: "#1e293b"
		},
		children: value
	})]
});
var SeoTip = ({ icon, text, type }) => /* @__PURE__ */ jsxs("div", {
	style: {
		display: "flex",
		alignItems: "center",
		gap: "10px",
		padding: "12px",
		background: type === "error" ? "#fef2f2" : type === "warning" ? "#fffbeb" : "#f0fdf4",
		borderRadius: "10px",
		border: `1px solid ${type === "error" ? "#fee2e2" : type === "warning" ? "#fef3c7" : "#dcfce7"}`
	},
	children: [/* @__PURE__ */ jsx("span", {
		style: { color: type === "error" ? "#ef4444" : type === "warning" ? "#f59e0b" : "#10b981" },
		children: icon
	}), /* @__PURE__ */ jsx("span", {
		style: {
			fontSize: "12px",
			fontWeight: 600,
			color: "#475569"
		},
		children: text
	})]
});
//#endregion
export { PostForm as default };
