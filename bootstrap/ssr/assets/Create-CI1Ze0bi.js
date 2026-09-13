import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Users } from "lucide-react";
//#region resources/js/Pages/Community/Create.jsx
function CreateCommunity() {
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
		className: "min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Create a Community" }),
			/* @__PURE__ */ jsx("header", {
				className: "sticky top-0 z-50 bg-white border-b border-[#EDEFF1]",
				children: /* @__PURE__ */ jsx("div", {
					className: "w-full px-4 sm:px-6 h-14 flex items-center justify-between",
					children: /* @__PURE__ */ jsxs(Link, {
						href: "/feed",
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-white font-black text-lg",
								children: "N"
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "font-extrabold text-xl tracking-tight hidden sm:block",
							children: "coachinginsikar"
						})]
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full mx-auto pt-10 px-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 mb-6 border-b border-[#EDEFF1] pb-4",
					children: [/* @__PURE__ */ jsx(Users, {
						size: 32,
						className: "text-[#0079D3]"
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold",
						children: "Create a Community"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "bg-white rounded-md border border-[#EDEFF1] p-6 shadow-sm",
					children: /* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block font-bold text-[16px] text-[#1C1C1C] mb-1",
									children: "Name"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[12px] text-[#787C7E] mb-2",
									children: "Community names including capitalization cannot be changed."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("span", {
										className: "absolute left-3 top-2.5 text-[#787C7E] font-medium",
										children: "r/"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.name,
										onChange: (e) => setData("name", e.target.value),
										maxLength: 21,
										className: "w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-2.5 pl-7 pr-3 text-[14px] outline-none transition-colors"
									})]
								}),
								errors.name && /* @__PURE__ */ jsx("p", {
									className: "text-red-500 text-xs mt-1",
									children: errors.name
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-[12px] text-[#787C7E] mt-1",
									children: [21 - data.name.length, " Characters remaining"]
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block font-bold text-[16px] text-[#1C1C1C] mb-1",
									children: "Display Name (Optional)"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.display_name,
									onChange: (e) => setData("display_name", e.target.value),
									className: "w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors"
								}),
								errors.display_name && /* @__PURE__ */ jsx("p", {
									className: "text-red-500 text-xs mt-1",
									children: errors.display_name
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block font-bold text-[16px] text-[#1C1C1C] mb-1",
									children: "Description"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[12px] text-[#787C7E] mb-2",
									children: "This is how new members come to understand your community."
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.description,
									onChange: (e) => setData("description", e.target.value),
									rows: "4",
									className: "w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors resize-none"
								}),
								errors.description && /* @__PURE__ */ jsx("p", {
									className: "text-red-500 text-xs mt-1",
									children: errors.description
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-[#EDEFF1] flex justify-end gap-3",
								children: [/* @__PURE__ */ jsx(Link, {
									href: "/feed",
									className: "px-5 py-2 font-bold text-[14px] text-[#0079D3] hover:bg-[#F6F7F8] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0",
									children: "Cancel"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: processing,
									className: "px-5 py-2 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0",
									children: "Create Community"
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
