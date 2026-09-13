import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { n as Navbar, t as BlogFooter } from "./BlogFooter-CC6FshYA.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Category/Show.jsx
var Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
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
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoMeta, { meta }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-8 max-w-6xl mt-16 flex-grow",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "mb-12 border-b pb-8",
					children: [/* @__PURE__ */ jsxs("h1", {
						className: "text-4xl font-bold mb-4",
						children: ["Category: ", categoryName]
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-gray-600",
						children: [
							"Showing ",
							posts.length,
							" articles in this category."
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
					children: posts.map((post) => /* @__PURE__ */ jsxs("article", {
						className: "border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col",
						children: [/* @__PURE__ */ jsx(Link, {
							href: window.BASE_PATH + `/blog/${post.slug}`,
							className: "relative h-48 block",
							children: /* @__PURE__ */ jsx(Image, {
								src: post.coverImage || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
								alt: post.title,
								fill: true,
								style: { objectFit: "cover" }
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6 flex flex-col flex-grow",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-sm text-blue-600 font-bold uppercase tracking-wider mb-2",
									children: post.category
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-xl font-bold mb-3",
									children: /* @__PURE__ */ jsx(Link, {
										href: window.BASE_PATH + `/blog/${post.slug}`,
										children: post.title
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-gray-600 mb-4 flex-grow",
									children: post.excerpt
								})
							]
						})]
					}, post.id))
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { CategoryShow as default };
