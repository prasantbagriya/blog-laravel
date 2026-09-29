import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
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
					className: "absolute inset-0 opacity-80",
					style: {
						backgroundImage: `url(${business.coverImage || business.logo})`,
						backgroundSize: "cover",
						backgroundPosition: "center"
					}
				}),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 mix-blend-multiply" }),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20 z-20",
					children: [/* @__PURE__ */ jsxs("svg", {
						className: "w-3.5 h-3.5 text-blue-600",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }), /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })]
					}), /* @__PURE__ */ jsxs("span", {
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
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "w-3 h-3",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [/* @__PURE__ */ jsx("path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }), /* @__PURE__ */ jsx("circle", {
								cx: "12",
								cy: "10",
								r: "3"
							})]
						}), /* @__PURE__ */ jsx("span", { children: business.city })]
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
						children: /* @__PURE__ */ jsxs("svg", {
							className: "w-4 h-4",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.5",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [/* @__PURE__ */ jsx("path", { d: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" }), /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 mb-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-100 dark:border-amber-800/30",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4 fill-amber-500 text-amber-500",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
						}), /* @__PURE__ */ jsx("span", {
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
					className: "mt-auto pt-4 flex gap-3",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => onSelectBusiness(business.slug),
						className: "flex-1 flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-zinc-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700/50 text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 rounded-lg transition-colors text-[13px]",
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "w-3.5 h-3.5 shrink-0",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: [/* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ jsx("circle", {
								cx: "12",
								cy: "7",
								r: "4"
							})]
						}), /* @__PURE__ */ jsx("span", { children: "Profile" })]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => onOpenWriteReview(business.id),
						className: "flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors text-[13px] shadow-sm hover:shadow",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-3.5 h-3.5 shrink-0",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
						}), /* @__PURE__ */ jsx("span", { children: "Review" })]
					})]
				})
			]
		})]
	});
};
//#endregion
export { BusinessCard };
