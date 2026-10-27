import { n as GlobalNavbar } from "./GlobalNavbar-BuANkPBG.js";
import { t as BlogFooter } from "./BlogFooter-Knqp4MD1.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
//#region resources/js/Pages/Static/CustomPage.jsx
function CustomPage({ page, meta = {}, faqs = [] }) {
	const [openFaq, setOpenFaq] = React.useState(null);
	const toggleFaq = (index) => {
		setOpenFaq(openFaq === index ? null : index);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white dark:bg-zinc-950 min-h-screen flex flex-col text-slate-900 dark:text-white font-sans transition-colors duration-300",
		children: [
			/* @__PURE__ */ jsxs(Head, { children: [
				/* @__PURE__ */ jsx("title", { children: meta.title || page.title }),
				meta.description && /* @__PURE__ */ jsx("meta", {
					name: "description",
					content: meta.description
				}),
				meta.keywords && /* @__PURE__ */ jsx("meta", {
					name: "keywords",
					content: meta.keywords
				}),
				meta.og_title && /* @__PURE__ */ jsx("meta", {
					property: "og:title",
					content: meta.og_title
				}),
				meta.og_description && /* @__PURE__ */ jsx("meta", {
					property: "og:description",
					content: meta.og_description
				}),
				meta.og_image && /* @__PURE__ */ jsx("meta", {
					property: "og:image",
					content: meta.og_image
				}),
				meta.url && /* @__PURE__ */ jsx("link", {
					rel: "canonical",
					href: meta.url
				})
			] }),
			/* @__PURE__ */ jsx(GlobalNavbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 flex-grow",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "mb-10 text-center md:text-left border-b border-slate-200 dark:border-zinc-800 pb-8",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4",
							children: meta.h1 || page.title
						}), meta.description && /* @__PURE__ */ jsx("p", {
							className: "text-lg text-slate-600 dark:text-zinc-400 max-w-3xl",
							children: meta.description
						})]
					}),
					page.content ? /* @__PURE__ */ jsx("article", {
						className: "prose prose-slate dark:prose-invert max-w-none prose-img:rounded-2xl prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline",
						dangerouslySetInnerHTML: { __html: page.content }
					}) : null,
					faqs && faqs.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "mt-16 pt-10 border-t border-slate-200 dark:border-zinc-800",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 mb-6",
							children: [/* @__PURE__ */ jsx(HelpCircle, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }), /* @__PURE__ */ jsx("h2", {
								className: "text-2xl font-bold text-slate-900 dark:text-white",
								children: "Frequently Asked Questions"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-4",
							children: faqs.map((faq, index) => /* @__PURE__ */ jsxs("div", {
								className: "border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-900/50",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => toggleFaq(index),
									className: "w-full flex items-center justify-between p-4 text-left font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
									children: [/* @__PURE__ */ jsx("span", { children: faq.question }), openFaq === index ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-5 h-5 flex-shrink-0 text-slate-500" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5 flex-shrink-0 text-slate-500" })]
								}), openFaq === index && /* @__PURE__ */ jsx("div", {
									className: "px-4 pb-4 pt-1 text-slate-600 dark:text-zinc-400 text-sm leading-relaxed border-t border-slate-200 dark:border-zinc-800/80",
									children: faq.answer
								})]
							}, index))
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { CustomPage as default };
