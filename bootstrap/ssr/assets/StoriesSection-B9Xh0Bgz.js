import { Image as Image$1, Link as Link$1 } from "./utils-BjQF728w.js";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { PlayCircle } from "lucide-react";
//#region resources/js/Pages/HomeComponents/StoriesSection.jsx
var StoriesSection = ({ stories, basePath }) => {
	if (!stories || stories.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		className: "pt-20 pb-10 md:pt-24 md:pb-14 bg-slate-50 dark:bg-zinc-900 border-y border-slate-200 dark:border-zinc-800",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
					children: "Visual Web Stories"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg",
					children: "Bite-sized visual guides for modern students."
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x hide-scrollbar",
				children: stories.map((story) => /* @__PURE__ */ jsxs(Link$1, {
					href: `${basePath}/stories/${story.slug}`,
					className: "relative flex-none w-[220px] md:w-[260px] aspect-[9/16] rounded-xl overflow-hidden snap-start group transition-all duration-300",
					children: [
						/* @__PURE__ */ jsx(Image$1, {
							src: story.posterImage || "/uploads/read.webp",
							alt: story.title,
							fill: true,
							width: "260",
							height: "462",
							style: { objectFit: "cover" },
							className: "group-hover:scale-105 transition-transform duration-700"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" }),
						/* @__PURE__ */ jsx("div", {
							className: "absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white",
							children: /* @__PURE__ */ jsx(PlayCircle, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute bottom-0 left-0 right-0 p-5",
							children: /* @__PURE__ */ jsx("h3", {
								className: "text-white font-bold text-base md:text-lg leading-snug drop-shadow-md",
								children: story.title
							})
						})
					]
				}, story.id))
			})]
		})
	});
};
//#endregion
export { StoriesSection as default };
