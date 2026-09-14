import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { t as Navbar } from "./GlobalNavbar-BeiSnBQi.js";
import { t as BlogFooter } from "./BlogFooter-iDkZqha6.js";
import { i as PillBadge, r as PageHero, t as AmberPillButton } from "./UI-DM4uTVWI.js";
import { Link } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowRight, BookOpen, Calendar, ChevronRight, Tag } from "lucide-react";
//#region resources/js/Pages/Category/Show.jsx
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
function CategoryShow({ categoryName, posts, meta }) {
	const basePath = typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "";
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white dark:bg-[#09090b] min-h-screen flex flex-col font-sans",
		children: [
			/* @__PURE__ */ jsx(SeoMeta, { meta }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx(PageHero, {
				badge: "Category",
				badgeIcon: Tag,
				title: categoryName,
				description: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
					className: "font-bold text-slate-700 dark:text-zinc-200",
					children: posts.length
				}), " articles in this category"] }),
				children: /* @__PURE__ */ jsxs("nav", {
					className: "flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500 font-medium mt-6",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: basePath + "/",
							className: "hover:text-amber-500 transition-colors",
							children: "Home"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" }),
						/* @__PURE__ */ jsx(Link, {
							href: basePath + "/category",
							className: "hover:text-amber-500 transition-colors",
							children: "Categories"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5" }),
						/* @__PURE__ */ jsx("span", {
							className: "text-slate-600 dark:text-zinc-300",
							children: categoryName
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800/60",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto",
					children: posts.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "text-center py-24",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4",
								children: /* @__PURE__ */ jsx(BookOpen, { className: "w-7 h-7 text-slate-400" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-xl font-bold text-slate-900 dark:text-white mb-2",
								children: "No articles yet"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-slate-500 dark:text-zinc-400 text-sm mb-6",
								children: "Check back soon — we're constantly adding new content."
							}),
							/* @__PURE__ */ jsx(AmberPillButton, {
								as: Link,
								href: basePath + "/",
								children: "Back to Home"
							})
						]
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
						children: posts.map((post) => /* @__PURE__ */ jsxs("article", {
							className: "group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: basePath + `/blog/${post.slug}`,
								className: "relative h-48 block overflow-hidden",
								children: [/* @__PURE__ */ jsx(Image$1, {
									src: post.coverImage || "/uploads/read.webp",
									alt: post.title,
									fill: true,
									style: { objectFit: "cover" },
									className: "group-hover:scale-105 transition-transform duration-500"
								}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-5 flex-grow flex flex-col",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "mb-3",
										children: /* @__PURE__ */ jsx(PillBadge, {
											icon: Tag,
											color: "amber",
											children: post.category || categoryName
										})
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors",
										children: /* @__PURE__ */ jsx(Link, {
											href: basePath + `/blog/${post.slug}`,
											children: post.title
										})
									}),
									post.excerpt && /* @__PURE__ */ jsx("p", {
										className: "text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4 flex-grow",
										children: post.excerpt
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500",
											children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: post.date ? new Date(post.date).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric"
											}) : "" })]
										}), /* @__PURE__ */ jsxs(Link, {
											href: basePath + `/blog/${post.slug}`,
											className: "inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:gap-2 transition-all",
											children: ["Read ", /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
										})]
									})
								]
							})]
						}, post.id))
					})
				})
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { CategoryShow as default };
