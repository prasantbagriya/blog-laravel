import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { CheckCircle, MapPin, ShieldCheck, Star } from "lucide-react";
//#region resources/js/Pages/Reviews/components/BusinessCard.tsx
var BusinessCard = ({ business, onSelectBusiness, onOpenWriteReview }) => {
	return /* @__PURE__ */ jsxs(AnimatedBorderCard, {
		containerClassName: "hover:-translate-y-1",
		className: "flex flex-col h-full",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[21/9] w-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center p-4 cursor-pointer overflow-hidden",
			onClick: () => onSelectBusiness(business.slug),
			children: [
				/* @__PURE__ */ jsx("img", {
					src: business.logo,
					alt: business.name,
					className: "w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-md relative z-10 group-hover:scale-105 transition-transform duration-500"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 opacity-40 blur-xl scale-110",
					style: {
						backgroundImage: `url(${business.logo})`,
						backgroundSize: "cover",
						backgroundPosition: "center"
					}
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20 z-20",
					children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-blue-600" }), /* @__PURE__ */ jsxs("span", {
						className: "text-xs font-bold text-slate-900 dark:text-white",
						children: [business.trustScore, /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-slate-500",
							children: "/100"
						})]
					})]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5 flex-grow flex flex-col",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-2 mb-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/50",
						children: business.categoryName
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 font-medium",
						children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: business.city })]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-2 mb-3",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer",
						onClick: () => onSelectBusiness(business.slug),
						children: business.name
					}), business.isVerified && /* @__PURE__ */ jsx("span", {
						className: "text-green-500 flex-shrink-0",
						title: "Verified Top Rated",
						children: /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 mb-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-100 dark:border-amber-800/30",
						children: [/* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-amber-500 text-amber-500" }), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-amber-700 dark:text-amber-400 text-sm",
							children: business.rating
						})]
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-sm font-medium text-slate-500 dark:text-zinc-400",
						children: [business.reviewCount.toLocaleString(), " verified reviews"]
					})]
				}),
				business.aiSummary?.positiveHighlights?.[0] ? /* @__PURE__ */ jsxs("div", {
					className: "mt-auto bg-slate-50 dark:bg-zinc-800/50 rounded-lg p-3 text-xs text-slate-600 dark:text-zinc-300 italic border border-slate-100 dark:border-zinc-800/50 relative",
					children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-lg" }), /* @__PURE__ */ jsxs("span", {
						className: "line-clamp-2 pl-1",
						children: [
							"\"",
							business.aiSummary.positiveHighlights[0],
							"\""
						]
					})]
				}) : /* @__PURE__ */ jsx("div", {
					className: "mt-auto",
					children: /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed",
						children: business.description
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => onSelectBusiness(business.slug),
						className: "flex-1 flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 text-white dark:text-slate-900 border-2 border-slate-900 dark:border-white text-center font-bold py-2.5 rounded-xl transition-all text-sm active:scale-[0.98] shadow-sm",
						children: "View Profile"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => onOpenWriteReview(business.id),
						className: "flex-1 flex items-center justify-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-center font-bold py-2.5 rounded-xl transition-all text-sm active:scale-[0.98]",
						children: "Write Review"
					})]
				})
			]
		})]
	});
};
//#endregion
export { BusinessCard };
