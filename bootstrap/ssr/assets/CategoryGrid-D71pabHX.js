import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Building, ChevronRight, Cloud, CreditCard, GraduationCap, Hospital, Server, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
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
var CategoryGrid = ({ categories, onSelectCategory }) => {
	return /* @__PURE__ */ jsx("section", {
		className: "py-12 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-l-3 border-blue-600 pl-3",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-xs font-mono font-bold uppercase tracking-widest text-blue-600 mb-1",
					children: "Verified Business Catalog"
				}), /* @__PURE__ */ jsx("h2", {
					className: "text-2xl sm:text-3xl font-editorial-serif italic font-bold text-zinc-900 dark:text-white",
					children: "Explore Industry Sectors"
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
				children: categories.map((cat) => {
					return /* @__PURE__ */ jsxs("div", {
						onClick: () => onSelectCategory(cat.slug),
						className: "group p-5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 shadow-xs transition-all cursor-pointer flex flex-col justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-3 mb-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-9 h-9 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform",
									children: /* @__PURE__ */ jsx(getCategoryIcon(cat.iconName), { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition",
									children: [cat.businessCount.toLocaleString(), " Listed"]
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition",
								children: cat.name === "Eduction" ? "Education" : cat.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed",
								children: cat.description
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 font-semibold",
							children: [/* @__PURE__ */ jsx("span", { children: "Browse Index" }), /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })]
						})]
					}, cat.id);
				})
			})]
		})
	});
};
//#endregion
export { CategoryGrid };
