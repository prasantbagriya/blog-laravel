import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { a as SectionHeader } from "./UI-CULDxtFe.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowRight, Building, Cloud, CreditCard, GraduationCap, Hospital, Server, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
//#region resources/js/Pages/Reviews/components/CategoryGrid.tsx
var getCategoryIcon = (iconName) => {
	switch (iconName) {
		case "Cloud": return Cloud;
		case "Sparkles": return Sparkles;
		case "ShoppingBag": return ShoppingBag;
		case "Hospital": return Hospital;
		case "Server": return Server;
		case "GraduationCap": return GraduationCap;
		case "Building": return Building;
		case "CreditCard": return CreditCard;
		default: return ShieldCheck;
	}
};
var categoryColors = {
	Cloud: {
		bg: "bg-sky-500/10",
		icon: "text-sky-600 dark:text-sky-400",
		border: "group-hover:border-sky-500/60",
		badge: "group-hover:bg-sky-600/10 group-hover:text-sky-700 dark:group-hover:text-sky-300"
	},
	Sparkles: {
		bg: "bg-violet-500/10",
		icon: "text-violet-600 dark:text-violet-400",
		border: "group-hover:border-violet-500/60",
		badge: "group-hover:bg-violet-600/10 group-hover:text-violet-700 dark:group-hover:text-violet-300"
	},
	ShoppingBag: {
		bg: "bg-amber-500/10",
		icon: "text-amber-600 dark:text-amber-400",
		border: "group-hover:border-amber-500/60",
		badge: "group-hover:bg-amber-600/10 group-hover:text-amber-700 dark:group-hover:text-amber-300"
	},
	Hospital: {
		bg: "bg-rose-500/10",
		icon: "text-rose-600 dark:text-rose-400",
		border: "group-hover:border-rose-500/60",
		badge: "group-hover:bg-rose-600/10 group-hover:text-rose-700 dark:group-hover:text-rose-300"
	},
	Server: {
		bg: "bg-emerald-500/10",
		icon: "text-emerald-600 dark:text-emerald-400",
		border: "group-hover:border-emerald-500/60",
		badge: "group-hover:bg-emerald-600/10 group-hover:text-emerald-700 dark:group-hover:text-emerald-300"
	},
	GraduationCap: {
		bg: "bg-indigo-500/10",
		icon: "text-indigo-600 dark:text-indigo-400",
		border: "group-hover:border-indigo-500/60",
		badge: "group-hover:bg-indigo-600/10 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
	},
	Building: {
		bg: "bg-orange-500/10",
		icon: "text-orange-600 dark:text-orange-400",
		border: "group-hover:border-orange-500/60",
		badge: "group-hover:bg-orange-600/10 group-hover:text-orange-700 dark:group-hover:text-orange-300"
	},
	CreditCard: {
		bg: "bg-teal-500/10",
		icon: "text-teal-600 dark:text-teal-400",
		border: "group-hover:border-teal-500/60",
		badge: "group-hover:bg-teal-600/10 group-hover:text-teal-700 dark:group-hover:text-teal-300"
	}
};
var defaultColor = {
	bg: "bg-blue-500/10",
	icon: "text-blue-600 dark:text-blue-400",
	border: "group-hover:border-blue-500/60",
	badge: "group-hover:bg-blue-600/10 group-hover:text-blue-700 dark:group-hover:text-blue-300"
};
var CategoryGrid = ({ categories, onSelectCategory }) => {
	return /* @__PURE__ */ jsx("section", {
		className: "py-16 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800/60",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsx(SectionHeader, {
				badge: "Verified Business Catalog",
				badgeIcon: ShieldCheck,
				title: /* @__PURE__ */ jsx(Fragment, { children: "Explore Industry Sectors" }),
				description: "Browse verified companies by sector — each backed by real invoices and AI fraud detection."
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: categories.map((cat) => {
					const IconComponent = getCategoryIcon(cat.iconName);
					const colors = categoryColors[cat.iconName] || defaultColor;
					return /* @__PURE__ */ jsxs(AnimatedBorderCard, {
						onClick: () => onSelectCategory(cat.slug),
						containerClassName: "hover:-translate-y-0.5 cursor-pointer",
						className: `p-5 flex flex-col justify-between h-full ${colors.border}`,
						children: [
							/* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl` }),
							/* @__PURE__ */ jsxs("div", {
								className: "relative z-10",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start justify-between gap-3 mb-4",
										children: [/* @__PURE__ */ jsx("div", {
											className: `w-10 h-10 rounded-xl ${colors.bg} ${colors.icon} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shrink-0`,
											children: /* @__PURE__ */ jsx(IconComponent, { className: "w-5 h-5" })
										}), /* @__PURE__ */ jsxs("span", {
											className: `text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 ${colors.badge} transition-colors duration-200 shrink-0`,
											children: [cat.businessCount.toLocaleString(), " Listed"]
										})]
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-sm font-extrabold text-slate-900 dark:text-white mb-1.5",
										children: cat.name
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-600 dark:text-zinc-300 line-clamp-2 leading-relaxed",
										children: cat.description
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative z-10 mt-5 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 transition-colors duration-200",
								children: [/* @__PURE__ */ jsx("span", { children: "Browse Index" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200 text-slate-700 dark:text-zinc-300" })]
							})
						]
					}, cat.id);
				})
			})]
		})
	});
};
//#endregion
export { CategoryGrid };
