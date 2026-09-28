import { Link as Link$1 } from "./utils-BjQF728w.js";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { MapPin, ShieldCheck, Star } from "lucide-react";
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
						children: [/* @__PURE__ */ jsxs(Link$1, {
							href: reviewUrl,
							className: "relative aspect-[21/9] w-full block overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center p-4",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: biz.logo || "/uploads/read.webp",
									alt: biz.name,
									className: "w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-md relative z-10 group-hover:scale-105 transition-transform duration-500"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 opacity-80",
									style: {
										backgroundImage: `url(${biz.cover_image || biz.coverImage || "/uploads/read.webp"})`,
										backgroundSize: "cover",
										backgroundPosition: "center"
									}
								}),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 mix-blend-multiply" }),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20 z-20",
									children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-blue-600" }), /* @__PURE__ */ jsxs("span", {
										className: "text-xs font-bold text-slate-900 dark:text-white",
										children: [biz.trust_score || biz.trustScore || 85, /* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-slate-500",
											children: "/100"
										})]
									})]
								})
							]
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
											/* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-amber-700 dark:fill-amber-400" }),
											" ",
											biz.rating || 4.5
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-blue-500" }),
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
											children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3" }), " Verified"]
										}),
										biz.city && /* @__PURE__ */ jsxs("span", {
											className: "bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(MapPin, { size: 12 }), biz.city]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex gap-2",
									children: [/* @__PURE__ */ jsx(Link$1, {
										href: reviewUrl,
										className: "flex-1 flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 text-white dark:text-slate-900 border-2 border-slate-900 dark:border-white text-center font-bold py-2 rounded-md transition-all text-sm active:scale-[0.98] shadow-sm",
										children: "View Profile"
									}), /* @__PURE__ */ jsxs(Link$1, {
										href: `${reviewUrl}#reviews`,
										"aria-label": `Read Reviews for ${biz.name} (${biz.review_count || biz.reviewCount || 0})`,
										className: "flex-1 flex items-center justify-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-center font-bold py-2 rounded-md transition-all text-sm active:scale-[0.98]",
										children: [
											"Read Reviews (",
											biz.review_count || biz.reviewCount || 0,
											")"
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
