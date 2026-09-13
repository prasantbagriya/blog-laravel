import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { t as Navbar } from "./GlobalNavbar-dTNI2462.js";
import { t as BlogFooter } from "./BlogFooter-L7SI1qpL.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Author/Index.jsx
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
function AuthorIndex({ authors, meta }) {
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
						children: "Our Authors"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-gray-600",
						children: "The minds behind the insights."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8",
					children: authors.map((author) => /* @__PURE__ */ jsxs(Link, {
						href: window.BASE_PATH + `/author/${author.slug}`,
						className: "block text-center group",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all",
								children: /* @__PURE__ */ jsx(Image, {
									src: author.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
									alt: author.name,
									fill: true,
									style: { objectFit: "cover" }
								})
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-bold group-hover:text-blue-600 transition-colors",
								children: author.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-gray-500",
								children: author.jobTitle
							})
						]
					}, author.slug))
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { AuthorIndex as default };
