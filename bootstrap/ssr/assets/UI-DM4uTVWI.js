import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/NextComponents/UI.tsx
var PageHero = ({ badge, badgeIcon: BadgeIcon, title, description, children, className = "" }) => {
	const isCentered = className.includes("text-center");
	return /* @__PURE__ */ jsxs("section", {
		className: `relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#09090b] overflow-hidden ${className}`,
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute -top-20 -right-20 w-96 h-96 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl opacity-40 pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "absolute top-40 -left-20 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 pointer-events-none" }),
			/* @__PURE__ */ jsxs("div", {
				className: `max-w-7xl mx-auto relative z-10 ${isCentered ? "flex flex-col items-center" : ""}`,
				children: [
					badge && /* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-widest uppercase mb-5",
						children: [BadgeIcon && /* @__PURE__ */ jsx(BadgeIcon, { className: "w-3.5 h-3.5" }), badge]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4",
						children: title
					}),
					description && /* @__PURE__ */ jsx("p", {
						className: `text-slate-500 dark:text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed ${isCentered ? "text-center mx-auto" : ""}`,
						children: description
					}),
					children
				]
			})
		]
	});
};
var SectionHeader = ({ badge, badgeIcon: BadgeIcon, badgeColor = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", title, description, action, className = "", center = false }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: `flex flex-col ${center ? "items-center text-center" : "sm:flex-row sm:items-end"} justify-between gap-4 mb-10 ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: center ? "flex flex-col items-center" : "",
			children: [
				badge && /* @__PURE__ */ jsxs("div", {
					className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border mb-3 ${badgeColor}`,
					children: [BadgeIcon && /* @__PURE__ */ jsx(BadgeIcon, { className: "w-3.5 h-3.5" }), badge]
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight",
					children: title
				}),
				description && /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-lg",
					children: description
				})
			]
		}), action && /* @__PURE__ */ jsx("div", {
			className: "shrink-0",
			children: action
		})]
	});
};
var AmberPillButton = ({ as: Tag = "button", href, onClick, disabled, className = "", children, type = "button" }) => {
	return /* @__PURE__ */ jsx(Tag, {
		href,
		onClick,
		disabled,
		type: Tag === "button" ? type : void 0,
		className: `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${className}`,
		children
	});
};
var colorMap = {
	amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
	blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
	green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
	rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
	violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
	slate: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border-slate-200 dark:border-zinc-700"
};
var PillBadge = ({ icon: Icon, color = "amber", children, className = "" }) => {
	return /* @__PURE__ */ jsxs("span", {
		className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${colorMap[color]} ${className}`,
		children: [Icon && /* @__PURE__ */ jsx(Icon, { className: "w-3 h-3" }), children]
	});
};
var InfoCard = ({ icon: Icon, label, value, sub, color = "bg-amber-500/10 text-amber-600 dark:text-amber-400" }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white dark:bg-zinc-900 rounded-2xl p-5 transition-all duration-200",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: `w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`,
				children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "font-extrabold text-slate-800 dark:text-white text-sm mb-1",
				children: label
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-slate-900 dark:text-zinc-200 font-semibold text-sm mb-1",
				children: value
			}),
			sub && /* @__PURE__ */ jsx("p", {
				className: "text-slate-400 dark:text-zinc-500 text-xs",
				children: sub
			})
		]
	});
};
//#endregion
export { SectionHeader as a, PillBadge as i, InfoCard as n, PageHero as r, AmberPillButton as t };
