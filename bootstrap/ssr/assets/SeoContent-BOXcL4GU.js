import { Link as Link$1 } from "./utils-BjQF728w.js";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Award, ShieldCheck } from "lucide-react";
//#region resources/js/Pages/HomeComponents/SeoContent.jsx
var SeoContent = ({ basePath }) => /* @__PURE__ */ jsx("section", {
	className: "py-10 md:py-14 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800",
	children: /* @__PURE__ */ jsx("div", {
		className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("span", {
					className: "text-blue-600 font-bold tracking-widest text-xs mb-3 block",
					children: "About Us"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight",
					children: "CoachinginSikar: Your Complete Education Guide"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed space-y-4",
					children: [/* @__PURE__ */ jsxs("p", { children: [
						"CoachinginSikar is an education platform helping students and parents find the best CoachinginSikar through top ",
						/* @__PURE__ */ jsx(Link$1, {
							href: `${basePath}/business/coaching-institutes`,
							className: "text-blue-600 dark:text-blue-400 font-semibold hover:underline",
							children: "coaching institutes"
						}),
						", coaching centre lists, fees, rankings, reviews, results, admissions, and other comparisons. We cover NEET coaching, JEE coaching, IAS / RAS / SSC-CGL Coaching, CLAT & CA Coaching, CUET, Olympiads, schools, colleges, and other competitive exam coaching educational information."
					] }), /* @__PURE__ */ jsxs("p", { children: [
						"Starting with Sikar, our platform covers more than just top coaching institutes in Sikar, Rajasthan. Yes, we also provide information on the best schools, colleges, education news, results, Olympiads, hospitals, and other useful local information. We aim to make finding top institutions, fees, admissions, results, reviews, and opportunities simple, while expanding our coverage beyond Sikar to more cities, regions, categories, and ",
						/* @__PURE__ */ jsx(Link$1, {
							href: `${basePath}/feed`,
							className: "text-blue-600 dark:text-blue-400 font-semibold hover:underline",
							children: "communities"
						}),
						"."
					] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 flex flex-wrap items-center gap-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400",
								children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-6 h-6" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-bold text-slate-800 dark:text-white",
								children: "Verified Data"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-sm text-slate-500 dark:text-zinc-400",
								children: "Trusted reviews"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600 dark:text-amber-400",
								children: /* @__PURE__ */ jsx(Award, { className: "w-6 h-6" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-bold text-slate-800 dark:text-white",
								children: "Top Institutes"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-sm text-slate-500 dark:text-zinc-400",
								children: "Ranked accurately"
							})] })]
						}),
						/* @__PURE__ */ jsx(Link$1, {
							href: `${basePath}/about`,
							className: "text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all ml-auto sm:ml-0",
							children: "More About Us"
						})
					]
				})
			] }), /* @__PURE__ */ jsxs("div", {
				className: "relative mt-8 lg:mt-0",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-blue-600/10 rounded-[2rem] transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6" }), /* @__PURE__ */ jsxs("div", {
					className: "relative z-10 rounded-[2rem] shadow-xl w-full aspect-[4/3] border-4 border-white dark:border-zinc-700 overflow-hidden",
					children: [/* @__PURE__ */ jsx("img", {
						src: "/uploads/aboutus.webp",
						alt: "Students studying",
						className: "w-full h-full object-cover"
					}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none mix-blend-overlay" })]
				})]
			})]
		})
	})
});
//#endregion
export { SeoContent as default };
