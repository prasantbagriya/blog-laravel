import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { Image, Link } from "./utils-BjQF728w.js";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/HomeComponents/BlogSection.jsx
var BlogSection = ({ morePosts, basePath, formatDate }) => {
	const posts = (morePosts || []).slice(0, 4);
	if (posts.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		className: "py-10 md:py-14 bg-slate-50 dark:bg-zinc-900",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-blue-700 dark:text-blue-400 text-sm font-bold tracking-wider mb-1",
						children: "Editor's Picks"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
						children: "Explore the Blog"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg",
						children: "Read the latest articles, guides, and updates."
					})
				] }), /* @__PURE__ */ jsx(Link, {
					href: `${basePath}/blog`,
					className: "hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm",
					children: "View All Blog"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
				children: posts.map((post, index) => {
					const borderColors = [
						"#3b82f6",
						"#e11d48",
						"#10b981",
						"#f59e0b"
					];
					return /* @__PURE__ */ jsxs(AnimatedBorderCard, {
						containerClassName: "hover:-translate-y-1 transition-all duration-300 h-full flex flex-col",
						className: "flex-grow flex flex-col",
						gradientColor: borderColors[index % borderColors.length],
						children: [/* @__PURE__ */ jsxs(Link, {
							href: `${basePath}${post.url_path || "/blog/" + post.slug}`,
							className: "relative aspect-[16/9] w-full block overflow-hidden shrink-0",
							children: [/* @__PURE__ */ jsx(Image, {
								src: post.coverImage || "/uploads/read.webp",
								alt: post.title,
								fill: true,
								width: "672",
								height: "378",
								style: { objectFit: "cover" },
								className: "group-hover:scale-105 transition-transform duration-500"
							}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 md:p-5 flex-grow flex flex-col bg-white dark:bg-zinc-900",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
									children: /* @__PURE__ */ jsx(Link, {
										href: `${basePath}${post.url_path || "/blog/" + post.slug}`,
										className: "focus:outline-none",
										children: post.title
									})
								}),
								post.excerpt && /* @__PURE__ */ jsx("p", {
									className: "text-sm text-slate-600 dark:text-zinc-400 line-clamp-1 mb-3",
									children: post.excerpt
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1.5 mb-4",
									children: /* @__PURE__ */ jsx("span", {
										className: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/30",
										children: post.category || "Article"
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-1 text-sm text-slate-600 dark:text-zinc-400",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between items-center mb-3",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-slate-500 dark:text-zinc-400",
											children: "Posted:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-semibold text-slate-800 dark:text-zinc-200",
											children: formatDate(post.date)
										})]
									}), /* @__PURE__ */ jsx(Link, {
										href: `${basePath}${post.url_path || "/blog/" + post.slug}`,
										className: "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold py-2.5 rounded-full transition-all text-sm w-full text-center flex justify-center items-center active:scale-[0.98]",
										children: "Read Article"
									})]
								})
							]
						})]
					}, post.id);
				})
			})]
		})
	});
};
//#endregion
export { BlogSection as default };
