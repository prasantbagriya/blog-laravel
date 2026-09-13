import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { t as Navbar } from "./GlobalNavbar-dTNI2462.js";
import { t as BlogFooter } from "./BlogFooter-L7SI1qpL.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Blog/Index.jsx
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
function Index({ posts, meta }) {
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen",
		children: [
			/* @__PURE__ */ jsx(SeoMeta, { meta }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "w-full px-[25px] pb-8",
				style: { paddingTop: "100px" },
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold mb-12",
					children: "All Articles & Insights"
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
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100",
									children: [/* @__PURE__ */ jsx("span", { children: formatDate(post.date) }), /* @__PURE__ */ jsx(Link, {
										href: window.BASE_PATH + "/author/" + (post.author ? post.author.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""),
										className: "font-semibold hover:text-blue-600 hover:underline",
										children: post.author
									})]
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
export { Index as default };
