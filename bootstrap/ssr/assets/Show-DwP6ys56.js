import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { t as Navbar } from "./GlobalNavbar-DC1OZ9Uw.js";
import { t as BlogFooter } from "./BlogFooter-CYmzluWU.js";
import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowRight, BookOpen, ChevronLeft, User } from "lucide-react";
//#region resources/js/Pages/Author/Show.jsx
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
function AuthorShow({ author, posts, meta }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-slate-50 dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex flex-col transition-colors duration-300",
		children: [
			/* @__PURE__ */ jsx(SeoMeta, { meta }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-grow",
				children: [/* @__PURE__ */ jsxs("section", {
					className: "bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden",
					children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 opacity-5 dark:opacity-10 rounded-full blur-3xl pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
						className: "max-w-4xl mx-auto relative z-10",
						children: [/* @__PURE__ */ jsxs(Link, {
							href: window.BASE_PATH + "/author",
							className: "inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 mb-8 transition-colors",
							children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }), " Back to Authors"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left",
							children: [/* @__PURE__ */ jsx("div", {
								className: "relative w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 border-4 border-white dark:border-zinc-800",
								children: /* @__PURE__ */ jsx(Image$1, {
									src: author.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
									alt: author.name,
									fill: true,
									style: { objectFit: "cover" }
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-grow",
								children: [
									/* @__PURE__ */ jsx("h1", {
										className: "text-4xl md:text-5xl font-extrabold mb-3 tracking-tight",
										children: author.name
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold tracking-wide uppercase mb-6",
										children: [
											/* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
											" ",
											author.jobTitle || "Contributor"
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "prose prose-lg dark:prose-invert prose-blue max-w-2xl text-slate-600 dark:text-zinc-400 leading-relaxed font-medium mx-auto md:mx-0",
										dangerouslySetInnerHTML: { __html: author.bio || "Passionate about guiding students toward the right educational path." }
									})
								]
							})]
						})]
					})]
				}), /* @__PURE__ */ jsxs("section", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mb-10",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center",
							children: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" })
						}), /* @__PURE__ */ jsxs("h2", {
							className: "text-3xl font-extrabold tracking-tight",
							children: ["Articles by ", author.name]
						})]
					}), posts && posts.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
						children: posts.map((post) => /* @__PURE__ */ jsxs(AnimatedBorderCard, {
							gradientColor: "#3b82f6",
							containerClassName: "h-full",
							className: "h-full bg-white dark:bg-zinc-900 flex flex-col overflow-hidden group",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: window.BASE_PATH + (post.url_path || `/blog/${post.slug}`),
								className: "relative h-56 block overflow-hidden",
								children: [/* @__PURE__ */ jsx(Image$1, {
									src: post.coverImage || "/uploads/read.webp",
									alt: post.title,
									fill: true,
									style: { objectFit: "cover" },
									className: "group-hover:scale-105 transition-transform duration-500"
								}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-6 md:p-8 flex flex-col flex-grow",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-400 tracking-wider uppercase mb-4 self-start",
										children: post.category || "Article"
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-xl md:text-2xl font-bold mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
										children: /* @__PURE__ */ jsx(Link, {
											href: window.BASE_PATH + (post.url_path || `/blog/${post.slug}`),
											children: post.title
										})
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-slate-600 dark:text-zinc-400 mb-6 flex-grow font-medium leading-relaxed line-clamp-3",
										children: post.excerpt
									}),
									/* @__PURE__ */ jsxs(Link, {
										href: window.BASE_PATH + (post.url_path || `/blog/${post.slug}`),
										className: "inline-flex items-center font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-auto group/btn",
										children: ["Read Article ", /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" })]
									})
								]
							})]
						}, post.id))
					}) : /* @__PURE__ */ jsxs("div", {
						className: "text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800",
						children: [
							/* @__PURE__ */ jsx(BookOpen, { className: "w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-4" }),
							/* @__PURE__ */ jsx("h3", {
								className: "text-xl font-bold text-slate-900 dark:text-white mb-2",
								children: "No Articles Yet"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-slate-500 dark:text-zinc-400",
								children: [author.name, " hasn't published any articles yet."]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { AuthorShow as default };
