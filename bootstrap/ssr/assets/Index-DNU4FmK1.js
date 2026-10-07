import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { t as Navbar } from "./GlobalNavbar-BDUC9CcK.js";
import { t as BlogFooter } from "./BlogFooter-CXoWON8B.js";
import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { User, Users } from "lucide-react";
//#region resources/js/Pages/Author/Index.jsx
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
function AuthorIndex({ authors, meta }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-slate-50 dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex flex-col transition-colors duration-300",
		children: [
			/* @__PURE__ */ jsx(SeoMeta, { meta }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-grow",
				children: [/* @__PURE__ */ jsxs("section", {
					className: "relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden bg-slate-900",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 z-0 opacity-40 bg-[url('/uploads/aboutus.webp')] bg-cover bg-center",
							role: "img",
							"aria-label": "Authors Background"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/60" }),
						/* @__PURE__ */ jsxs("div", {
							className: "relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 border border-blue-500/20 backdrop-blur-md",
									children: [/* @__PURE__ */ jsx(Users, { className: "w-4 h-4" }), " Our Authors"]
								}),
								/* @__PURE__ */ jsxs("h1", {
									className: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight text-white",
									children: [
										"Meet the ",
										/* @__PURE__ */ jsx("span", {
											className: "text-blue-500",
											children: "Voices"
										}),
										" of CoachingsinSikar"
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto",
									children: "The passionate educators, reviewers, and content creators dedicated to bringing you the most reliable education insights in Sikar."
								})
							]
						})
					]
				}), /* @__PURE__ */ jsx("section", {
					className: "px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto",
					children: /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
						children: authors.map((author) => /* @__PURE__ */ jsxs(AnimatedBorderCard, {
							gradientColor: "#3b82f6",
							containerClassName: "h-full",
							className: "h-full bg-white dark:bg-zinc-900 p-8 flex flex-col items-center text-center group",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "relative w-32 h-32 mb-6 rounded-full overflow-hidden shadow-lg border-4 border-slate-50 dark:border-zinc-800 group-hover:scale-105 group-hover:border-blue-500/30 transition-all duration-300",
									children: /* @__PURE__ */ jsx(Image$1, {
										src: author.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
										alt: author.name,
										fill: true,
										style: { objectFit: "cover" }
									})
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
									children: author.name
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-4",
									children: author.jobTitle || "Contributor"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-slate-600 dark:text-zinc-400 line-clamp-3 mb-8",
									children: author.bio ? author.bio.replace(/<[^>]*>?/gm, "") : "Passionate about guiding students toward the right educational path."
								}),
								/* @__PURE__ */ jsxs(Link, {
									href: window.BASE_PATH + `/author/${author.slug}`,
									className: "mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white rounded-xl font-bold transition-colors w-full text-sm",
									children: [/* @__PURE__ */ jsx(User, { className: "w-4 h-4" }), " View Profile"]
								})
							]
						}, author.slug))
					})
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { AuthorIndex as default };
