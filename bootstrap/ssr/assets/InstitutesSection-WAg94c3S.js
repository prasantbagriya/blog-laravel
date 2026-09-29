import { Image as Image$1, Link as Link$1 } from "./utils-BjQF728w.js";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import "lucide-react";
//#region resources/js/Pages/HomeComponents/InstitutesSection.jsx
var InstitutesSection = ({ featuredBusinesses, basePath }) => {
	const businesses = featuredBusinesses || [];
	if (businesses.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		id: "top-institutes",
		className: "pt-10 pb-0 md:pt-14 md:pb-0 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
					children: "Top Coaching Institutes in Sikar"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg",
					children: "Explore institutes based on courses, reviews, results and available information."
				})] }), /* @__PURE__ */ jsx(Link$1, {
					href: `${basePath}/business`,
					className: "hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm",
					children: "View All"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
				children: businesses.map((biz) => {
					const reviewUrl = `${basePath}/business/${biz.category || "coaching-institutes"}/${biz.slug || biz.id}`;
					return /* @__PURE__ */ jsxs("article", {
						className: "bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300 flex flex-col group",
						children: [/* @__PURE__ */ jsx(Link$1, {
							href: reviewUrl,
							className: "relative aspect-[16/9] w-full block overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center p-4",
							children: /* @__PURE__ */ jsx(Image$1, {
								src: biz.logo || "/uploads/read.webp",
								alt: biz.name,
								fill: true,
								width: "672",
								height: "378",
								style: { objectFit: "contain" },
								className: "group-hover:scale-105 transition-transform duration-500"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 md:p-5 flex-grow flex flex-col border-t border-slate-100 dark:border-zinc-800",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
									children: /* @__PURE__ */ jsx(Link$1, {
										href: reviewUrl,
										className: "focus:outline-none",
										children: biz.name
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-zinc-400 mb-3",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold",
										children: [
											/* @__PURE__ */ jsx("svg", {
												className: "w-3.5 h-3.5 fill-amber-700 dark:fill-amber-400",
												viewBox: "0 0 24 24",
												stroke: "currentColor",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: /* @__PURE__ */ jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
											}),
											" ",
											biz.rating || 4.5
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsxs("svg", {
												className: "w-3.5 h-3.5 text-blue-500",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: [/* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }), /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })]
											}),
											" Trust: ",
											biz.trust_score || biz.trustScore || 85,
											"/100"
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-1.5 mb-4",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/30",
											children: biz.category_name || biz.categoryName || biz.category
										}),
										biz.isVerified && /* @__PURE__ */ jsxs("span", {
											className: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded border border-green-200 dark:border-green-800/30 flex items-center gap-1",
											children: [/* @__PURE__ */ jsxs("svg", {
												className: "w-3 h-3",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2.5",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: [/* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }), /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })]
											}), " Verified"]
										}),
										biz.location && /* @__PURE__ */ jsxs("span", {
											className: "bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 flex items-center gap-1",
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
											}), biz.location]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-auto pt-4 flex gap-3",
									children: [/* @__PURE__ */ jsxs(Link$1, {
										href: reviewUrl,
										"aria-label": `View Profile of ${biz.name}`,
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
									}), /* @__PURE__ */ jsxs(Link$1, {
										href: reviewUrl + "#reviews",
										"aria-label": `Read Reviews for ${biz.name} (${biz.review_count || biz.reviewCount || 0})`,
										className: "flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors text-[13px] shadow-sm hover:shadow",
										children: [
											/* @__PURE__ */ jsx("svg", {
												className: "w-3.5 h-3.5 shrink-0",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2.2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: /* @__PURE__ */ jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
											}),
											/* @__PURE__ */ jsx("span", { children: "Reviews" }),
											(biz.review_count > 0 || biz.reviewCount > 0) && /* @__PURE__ */ jsx("span", {
												className: "bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none ml-0.5",
												children: biz.review_count || biz.reviewCount
											})
										]
									})]
								})
							]
						})]
					}, biz.id);
				})
			})]
		})
	});
};
//#endregion
export { InstitutesSection as default };
