import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { n as Navbar, t as BlogFooter } from "./BlogFooter-CC6FshYA.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Category/Index.jsx
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
function CategoryIndex({ categories, meta }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoMeta, { meta }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-8 max-w-6xl mt-16 flex-grow",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "mb-12 border-b pb-8 text-center",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-4xl font-bold mb-4",
						children: "Explore Categories"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-gray-600",
						children: "Find insights by topic."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8",
					children: categories.map((category) => /* @__PURE__ */ jsx(Link, {
						href: window.BASE_PATH + `/category/${category.slug}`,
						className: "block text-center group",
						children: /* @__PURE__ */ jsxs("div", {
							className: "relative w-full h-48 mx-auto mb-4 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all",
							children: [/* @__PURE__ */ jsx(Image, {
								src: category.image || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&q=80",
								alt: category.name,
								fill: true,
								style: { objectFit: "cover" }
							}), /* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors",
								children: /* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-bold text-white drop-shadow-md",
									children: category.name
								})
							})]
						})
					}, category.id || category.slug))
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { CategoryIndex as default };
