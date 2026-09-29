import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { GraduationCap } from "lucide-react";
//#region resources/js/Pages/HomeComponents/TrustMarquee.jsx
var TrustMarquee = ({ categories }) => {
	const items = categories && categories.length > 0 ? categories : [
		{
			name: "Engineering",
			id: 1
		},
		{
			name: "Medical",
			id: 2
		},
		{
			name: "Foundation",
			id: 3
		},
		{
			name: "Commerce",
			id: 4
		},
		{
			name: "Arts",
			id: 5
		},
		{
			name: "Law",
			id: 6
		}
	];
	return /* @__PURE__ */ jsxs("section", {
		className: "py-6 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4",
			children: /* @__PURE__ */ jsx("p", {
				className: "text-xs font-bold text-slate-600 dark:text-zinc-400 tracking-wider",
				children: "Trusted Categories & Streams"
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]",
			children: /* @__PURE__ */ jsx("div", {
				className: "flex animate-marquee items-center justify-center space-x-8 md:space-x-16 whitespace-nowrap",
				children: [
					...items,
					...items,
					...items
				].map((item, idx) => /* @__PURE__ */ jsxs("div", {
					className: "text-slate-400 dark:text-zinc-500 font-bold text-xl md:text-2xl opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6" }),
						" ",
						item.name
					]
				}, `${item.id}-${idx}`))
			})
		})]
	});
};
//#endregion
export { TrustMarquee as default };
