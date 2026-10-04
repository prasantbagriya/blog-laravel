import { Link as Link$1 } from "./utils-BjQF728w.js";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Backpack, Beaker, BookOpen, GraduationCap, Scale, Target } from "lucide-react";
//#region resources/js/Pages/HomeComponents/CategorySection.jsx
var CategorySection = ({ categories, basePath }) => {
	if (!categories || categories.length === 0) return null;
	const getCategoryStyle = (name) => {
		const lowerName = name.toLowerCase();
		if (lowerName.includes("science") || lowerName.includes("neet") || lowerName.includes("medical") || lowerName.includes("doctor")) return {
			icon: Beaker,
			colorClass: "text-emerald-500",
			bgClass: "bg-emerald-50 dark:bg-emerald-500/10",
			hoverBgClass: "group-hover:bg-emerald-500",
			shadowClass: "hover:shadow-emerald-500/20",
			borderClass: "hover:border-emerald-400",
			cardHoverBg: "hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
		};
		if (lowerName.includes("commerce") || lowerName.includes("ca") || lowerName.includes("bank")) return {
			icon: Target,
			colorClass: "text-amber-500",
			bgClass: "bg-amber-50 dark:bg-amber-500/10",
			hoverBgClass: "group-hover:bg-amber-500",
			shadowClass: "hover:shadow-amber-500/20",
			borderClass: "hover:border-amber-400",
			cardHoverBg: "hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
		};
		if (lowerName.includes("arts") || lowerName.includes("law") || lowerName.includes("clat") || lowerName.includes("upsc") || lowerName.includes("ras") || lowerName.includes("ias")) return {
			icon: Scale,
			colorClass: "text-purple-500",
			bgClass: "bg-purple-50 dark:bg-purple-500/10",
			hoverBgClass: "group-hover:bg-purple-500",
			shadowClass: "hover:shadow-purple-500/20",
			borderClass: "hover:border-purple-400",
			cardHoverBg: "hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
		};
		if (lowerName.includes("school") || lowerName.includes("board") || lowerName.includes("cbse") || lowerName.includes("rbse")) return {
			icon: Backpack,
			colorClass: "text-pink-500",
			bgClass: "bg-pink-50 dark:bg-pink-500/10",
			hoverBgClass: "group-hover:bg-pink-500",
			shadowClass: "hover:shadow-pink-500/20",
			borderClass: "hover:border-pink-400",
			cardHoverBg: "hover:bg-pink-50/50 dark:hover:bg-pink-900/10"
		};
		if (lowerName.includes("engineering") || lowerName.includes("jee") || lowerName.includes("tech")) return {
			icon: BookOpen,
			colorClass: "text-blue-500",
			bgClass: "bg-blue-50 dark:bg-blue-500/10",
			hoverBgClass: "group-hover:bg-blue-500",
			shadowClass: "hover:shadow-blue-500/20",
			borderClass: "hover:border-blue-400",
			cardHoverBg: "hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
		};
		return {
			icon: GraduationCap,
			colorClass: "text-indigo-500",
			bgClass: "bg-indigo-50 dark:bg-indigo-500/10",
			hoverBgClass: "group-hover:bg-indigo-500",
			shadowClass: "hover:shadow-indigo-500/20",
			borderClass: "hover:border-indigo-400",
			cardHoverBg: "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
		};
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "pt-10 pb-6 md:pt-14 md:pb-10 bg-white dark:bg-zinc-950 overflow-hidden relative",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/5 rounded-full blur-3xl opacity-50 pointer-events-none -mr-48 -mt-48" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-10 md:mb-14",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
					children: "Explore by Stream"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg",
					children: "Find the right path for your career goals."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex animate-marquee-fast hover:[animation-play-state:paused] items-center justify-center space-x-4 md:space-x-6 whitespace-nowrap pt-4 pb-8 px-2",
					children: [
						...categories,
						...categories,
						...categories,
						...categories
					].map((cat, i) => {
						const style = getCategoryStyle(cat.name);
						const Icon = style.icon;
						return /* @__PURE__ */ jsxs(Link$1, {
							href: `${basePath}/category/${cat.slug || cat.name.toLowerCase().replace(/\\s+/g, "-")}`,
							className: `bg-white dark:bg-zinc-900 w-64 h-56 rounded-[1.5rem] border border-slate-200 dark:border-zinc-800 transition-all duration-300 group flex flex-col items-center justify-center text-center shrink-0 hover:-translate-y-2 ${style.borderClass} ${style.cardHoverBg} p-6`,
							children: [
								/* @__PURE__ */ jsx("div", {
									className: `w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${style.bgClass} ${style.hoverBgClass}`,
									children: /* @__PURE__ */ jsx(Icon, { className: `w-7 h-7 transition-colors duration-300 group-hover:text-white ${style.colorClass}` })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-extrabold text-slate-800 dark:text-zinc-100 text-sm md:text-[15px] group-hover:text-slate-900 dark:group-hover:text-white transition-colors whitespace-normal break-words w-full leading-snug mb-2",
									children: cat.name
								}),
								cat.description && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500 dark:text-zinc-400 line-clamp-3 leading-relaxed whitespace-normal transition-colors group-hover:text-slate-700 dark:group-hover:text-zinc-300",
									children: cat.description
								})
							]
						}, `${cat.id}-${i}`);
					})
				})
			})]
		})]
	});
};
//#endregion
export { CategorySection as default };
