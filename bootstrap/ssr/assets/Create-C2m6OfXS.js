import { t as Navbar } from "./GlobalNavbar-RO4UzKYw.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Users } from "lucide-react";
//#region resources/js/Pages/Community/Create.jsx
function CreateCommunity({ auth }) {
	const { data, setData, post, processing, errors } = useForm({
		name: "",
		display_name: "",
		description: ""
	});
	const submit = (e) => {
		e.preventDefault();
		post(route("community.store"));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans transition-colors selection:bg-blue-500/30 pb-20",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Create a Community" }),
			/* @__PURE__ */ jsx(Navbar, { auth }),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-3xl mx-auto pt-32 px-4 sm:px-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4 mb-8 border-b border-slate-200 dark:border-zinc-800 pb-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-sm",
						children: /* @__PURE__ */ jsx(Users, {
							size: 24,
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-extrabold tracking-tight",
						children: "Create a Community"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium text-slate-500 dark:text-zinc-400 mt-1",
						children: "Start a new place for discussion and sharing."
					})] })]
				}), /* @__PURE__ */ jsx("div", {
					className: "bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 p-8 shadow-sm",
					children: /* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "space-y-8",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block font-extrabold text-lg text-slate-900 dark:text-white mb-1",
									children: "Name"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm font-medium text-slate-500 dark:text-zinc-400 mb-3",
									children: "Community names including capitalization cannot be changed once created."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative flex items-center",
									children: [/* @__PURE__ */ jsx("span", {
										className: "absolute left-4 text-slate-400 dark:text-zinc-500 font-extrabold text-lg",
										children: "r/"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.name,
										onChange: (e) => setData("name", e.target.value),
										maxLength: 21,
										className: "w-full bg-slate-100 dark:bg-zinc-800/80 border-0 shadow-inner hover:bg-slate-200/60 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500/50 rounded-xl py-3.5 pl-10 pr-4 text-base font-bold text-slate-900 dark:text-white outline-none transition-all placeholder-slate-400",
										placeholder: "e.g. jee-preparation"
									})]
								}),
								errors.name && /* @__PURE__ */ jsx("p", {
									className: "text-rose-500 text-sm font-bold mt-2",
									children: errors.name
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs font-bold text-slate-400 dark:text-zinc-500 mt-2",
									children: [21 - data.name.length, " Characters remaining"]
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block font-extrabold text-lg text-slate-900 dark:text-white mb-1",
									children: ["Display Name ", /* @__PURE__ */ jsx("span", {
										className: "text-slate-400 font-medium text-sm",
										children: "(Optional)"
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm font-medium text-slate-500 dark:text-zinc-400 mb-3",
									children: "This is the title that shows up on the community banner."
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.display_name,
									onChange: (e) => setData("display_name", e.target.value),
									className: "w-full bg-slate-100 dark:bg-zinc-800/80 border-0 shadow-inner hover:bg-slate-200/60 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500/50 rounded-xl py-3.5 px-4 text-base font-bold text-slate-900 dark:text-white outline-none transition-all placeholder-slate-400",
									placeholder: "e.g. JEE Main & Advanced Discussion"
								}),
								errors.display_name && /* @__PURE__ */ jsx("p", {
									className: "text-rose-500 text-sm font-bold mt-2",
									children: errors.display_name
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block font-extrabold text-lg text-slate-900 dark:text-white mb-1",
									children: "Description"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm font-medium text-slate-500 dark:text-zinc-400 mb-3",
									children: "This is how new members come to understand your community."
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.description,
									onChange: (e) => setData("description", e.target.value),
									rows: "4",
									className: "w-full bg-slate-100 dark:bg-zinc-800/80 border-0 shadow-inner hover:bg-slate-200/60 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500/50 rounded-xl py-3.5 px-4 text-base font-medium text-slate-900 dark:text-white outline-none transition-all resize-y placeholder-slate-400",
									placeholder: "Welcome to our community..."
								}),
								errors.description && /* @__PURE__ */ jsx("p", {
									className: "text-rose-500 text-sm font-bold mt-2",
									children: errors.description
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-end gap-4",
								children: [/* @__PURE__ */ jsx(Link, {
									href: "/feed",
									className: "px-6 py-3 font-bold text-sm text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-all border border-slate-200 dark:border-zinc-700 shadow-sm active:scale-[0.98]",
									children: "Cancel"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: processing,
									className: "px-8 py-3 font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 active:scale-[0.98] shadow-md shadow-blue-600/20",
									children: processing ? "Creating..." : "Create Community"
								})]
							})
						]
					})
				})]
			})
		]
	});
}
//#endregion
export { CreateCommunity as default };
