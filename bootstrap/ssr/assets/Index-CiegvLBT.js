import { t as Navbar } from "./GlobalNavbar-dTNI2462.js";
import { t as BlogFooter } from "./BlogFooter-L7SI1qpL.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Story/Index.jsx
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
function StoryIndex({ stories }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Web Stories | Blog" }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-8 max-w-6xl mt-16 flex-grow",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold mb-12",
					children: "Visual Web Stories"
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
					children: stories.map((story) => /* @__PURE__ */ jsxs(Link, {
						href: window.BASE_PATH + `/stories/${story.slug}`,
						className: "block relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg group",
						children: [/* @__PURE__ */ jsx(Image, {
							src: story.posterImage || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
							alt: story.title,
							fill: true,
							style: { objectFit: "cover" },
							className: "transition-transform duration-300 group-hover:scale-105"
						}), /* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4",
							children: /* @__PURE__ */ jsx("h3", {
								className: "text-white font-bold text-lg leading-tight",
								children: story.title
							})
						})]
					}, story.id))
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { StoryIndex as default };
