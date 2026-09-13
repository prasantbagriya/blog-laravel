import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Image, Settings } from "lucide-react";
//#region resources/js/Pages/Community/Edit.jsx
function EditCommunity({ community }) {
	const { data, setData, post, processing, errors } = useForm({
		display_name: community.display_name || "",
		description: community.description || "",
		icon_image: community.icon_image || "",
		banner_image: community.banner_image || ""
	});
	const submit = (e) => {
		e.preventDefault();
		post(route("community.update", community.name));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20",
		children: [
			/* @__PURE__ */ jsx(Head, { title: `Settings - ${community.display_name}` }),
			/* @__PURE__ */ jsx("header", {
				className: "sticky top-0 z-50 bg-white border-b border-[#EDEFF1]",
				children: /* @__PURE__ */ jsx("div", {
					className: "w-full px-4 sm:px-6 h-14 flex items-center justify-between",
					children: /* @__PURE__ */ jsxs(Link, {
						href: `/community/${community.name}`,
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
				className: "w-full mx-auto max-w-[800px] pt-10 px-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 mb-6 border-b border-[#EDEFF1] pb-4",
					children: [/* @__PURE__ */ jsx(Settings, {
						size: 32,
						className: "text-[#0079D3]"
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold",
						children: "Community Settings"
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
									children: "Display Name"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[12px] text-[#787C7E] mb-2",
									children: "This is what is shown in the community header (e.g. \"Laravel PHP Framework\")."
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
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block font-bold text-[16px] text-[#1C1C1C] mb-1",
									children: "Icon Image URL"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[12px] text-[#787C7E] mb-2",
									children: "The profile picture of your community."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-4 items-center",
									children: [data.icon_image ? /* @__PURE__ */ jsx("img", {
										src: data.icon_image,
										className: "w-16 h-16 rounded-full object-cover border border-[#EDEFF1]"
									}) : /* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 rounded-full bg-[#F6F7F8] flex items-center justify-center border border-[#EDEFF1] text-[#878A8C]",
										children: /* @__PURE__ */ jsx(Image, { size: 24 })
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.icon_image,
										onChange: (e) => setData("icon_image", e.target.value),
										placeholder: "https://...",
										className: "flex-1 bg-white border border-[#EDEFF1] focus:border-[#1C1C1C] rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors"
									})]
								}),
								errors.icon_image && /* @__PURE__ */ jsx("p", {
									className: "text-red-500 text-xs mt-1",
									children: errors.icon_image
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block font-bold text-[16px] text-[#1C1C1C] mb-1",
									children: "Banner Image URL"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[12px] text-[#787C7E] mb-2",
									children: "The cover image of your community."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-3",
									children: [data.banner_image ? /* @__PURE__ */ jsx("img", {
										src: data.banner_image,
										className: "w-full h-32 object-cover rounded-md border border-[#EDEFF1]"
									}) : /* @__PURE__ */ jsx("div", {
										className: "w-full h-32 bg-[#F6F7F8] rounded-md flex items-center justify-center border border-[#EDEFF1] text-[#878A8C]",
										children: /* @__PURE__ */ jsx(Image, { size: 32 })
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.banner_image,
										onChange: (e) => setData("banner_image", e.target.value),
										placeholder: "https://...",
										className: "w-full bg-white border border-[#EDEFF1] focus:border-[#1C1C1C] rounded-md py-2.5 px-3 text-[14px] outline-none transition-colors"
									})]
								}),
								errors.banner_image && /* @__PURE__ */ jsx("p", {
									className: "text-red-500 text-xs mt-1",
									children: errors.banner_image
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-[#EDEFF1] flex justify-end gap-3",
								children: [/* @__PURE__ */ jsx(Link, {
									href: `/community/${community.name}`,
									className: "px-5 py-2 font-bold text-[14px] text-[#0079D3] hover:bg-[#F6F7F8] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0",
									children: "Cancel"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: processing,
									className: "px-5 py-2 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0",
									children: "Save Changes"
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
export { EditCommunity as default };
