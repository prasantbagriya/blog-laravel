import { a as Youtube, i as Twitter, n as Instagram, r as Linkedin, t as Facebook } from "./BrandIcons-DkcPiv4u.js";
import { usePage } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region resources/js/NextComponents/BlogFooter.tsx
function BlogFooter({ global_nav: passedNav }) {
	const pathname = typeof window !== "undefined" ? window.location.pathname : "";
	const [email, setEmail] = useState("");
	const inertiaPage = usePage();
	let global_nav = passedNav || inertiaPage.props.global_nav || [];
	if (pathname?.startsWith("/blog/admin")) return null;
	const getLinkHref = (page) => {
		if (!page) return "#";
		if (page.startsWith("http://") || page.startsWith("https://")) return page;
		if (page.startsWith("/")) return page;
		const basePath = typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "";
		if (page === "landing") return basePath + "/";
		return basePath + "/" + page;
	};
	const footerSections = [{
		title: "Navigation",
		links: global_nav && global_nav.length > 0 ? global_nav.filter((n) => n.show_in_footer).map((n) => ({
			label: n.name,
			page: n.url
		})) : [
			{
				label: "Home",
				page: "landing"
			},
			{
				label: "Blog",
				page: "blog"
			},
			{
				label: "About Us",
				page: "about"
			},
			{
				label: "Contact Us",
				page: "contact"
			},
			{
				label: "Explore Institutes",
				page: "business"
			}
		]
	}, {
		title: "Legal & Policies",
		links: [
			{
				label: "Privacy Policy",
				page: "privacy"
			},
			{
				label: "Editorial Policy",
				page: "editorial-policy"
			},
			{
				label: "Fact-Checking",
				page: "fact-checking-policy"
			},
			{
				label: "Terms & Conditions",
				page: "terms"
			}
		]
	}];
	return /* @__PURE__ */ jsxs("footer", {
		className: "relative bg-slate-900 text-slate-300 pt-10 pb-10 overflow-hidden w-full border-t border-slate-800",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600" }),
			/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" }),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-7xl mx-auto relative z-10 px-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-6 lg:gap-12 mb-16",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "col-span-2 md:col-span-2 lg:col-span-2 space-y-8",
							children: [
								/* @__PURE__ */ jsxs("a", {
									href: getLinkHref("landing"),
									className: "flex items-center space-x-3 group cursor-pointer no-underline",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden p-1",
										children: /* @__PURE__ */ jsx("img", {
											loading: "lazy",
											decoding: "async",
											fetchPriority: "low",
											src: (typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/uploads/logo.webp",
											alt: "Coaching Sikar Logo",
											width: "32",
											height: "32",
											className: "w-full h-full object-contain"
										})
									}), /* @__PURE__ */ jsx("span", {
										className: "text-3xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400",
										children: "Coaching Sikar"
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-slate-300 text-sm leading-relaxed max-w-sm",
									children: "Your ultimate guide to finding the best coaching institutes. Explore, compare, and make the right choice for your future."
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex gap-3",
									children: [
										{
											Icon: Facebook,
											url: "https://www.facebook.com/coachinginsikar"
										},
										{
											Icon: Twitter,
											url: "https://x.com/coachinginsikar"
										},
										{
											Icon: Instagram,
											url: "https://www.instagram.com/coachinginsikar"
										},
										{
											Icon: Youtube,
											url: "https://www.youtube.com/@coachinginsikar"
										},
										{
											Icon: Linkedin,
											url: "https://www.linkedin.com/company/coachinginsikar"
										}
									].map(({ Icon, url }, i) => /* @__PURE__ */ jsx("a", {
										href: url,
										target: "_blank",
										rel: "noopener noreferrer",
										"aria-label": `Visit our ${url.split(".")[1] || "social"} page`,
										className: "w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-blue-500/20 hover:-translate-y-1",
										children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
									}, i))
								})
							]
						}),
						footerSections.map((section) => {
							return /* @__PURE__ */ jsxs("div", {
								className: "col-span-1 md:col-span-1 lg:col-span-1",
								children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500 inline-block" }), section.title]
								}), /* @__PURE__ */ jsx("ul", {
									className: "space-y-4 m-0 p-0",
									style: { listStyle: "none" },
									children: section.links.map((link) => {
										return /* @__PURE__ */ jsx("li", {
											className: "m-0 p-0 flex",
											children: /* @__PURE__ */ jsxs("a", {
												href: getLinkHref(link.page),
												className: "text-sm text-slate-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-left bg-transparent border-none p-0 cursor-pointer flex items-center group outline-none focus:outline-none ring-0 no-underline",
												children: [/* @__PURE__ */ jsx("span", {
													className: "opacity-0 group-hover:opacity-100 text-blue-500 mr-2 transition-opacity",
													children: "›"
												}), link.label]
											})
										}, link.label);
									})
								})]
							}, section.title);
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "col-span-2 md:col-span-2 lg:col-span-1",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-blue-500 inline-block" }), "Stay Updated"]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm text-slate-300 leading-relaxed m-0",
									children: "Get the latest educational updates and coaching news delivered to your inbox."
								}), /* @__PURE__ */ jsx("form", {
									className: "relative group m-0 mt-4",
									onSubmit: async (e) => {
										e.preventDefault();
										if (!email) return;
										try {
											if ((await fetch("/api/inquiries/collect", {
												method: "POST",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({
													email,
													source: "footer_newsletter",
													type: "newsletter"
												})
											})).ok) {
												alert("Successfully joined our newsletter!");
												setEmail("");
											}
										} catch (err) {
											console.error(err);
										}
									},
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all",
										children: [/* @__PURE__ */ jsx("input", {
											type: "email",
											"aria-label": "Email address for newsletter",
											placeholder: "Enter your email",
											className: "flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-white px-3 py-2 placeholder:text-slate-500 w-full",
											value: email,
											onChange: (e) => setEmail(e.target.value)
										}), /* @__PURE__ */ jsx("button", {
											className: "bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors border-none cursor-pointer shadow-md hover:shadow-blue-600/30 outline-none focus:outline-none ring-0 shrink-0",
											type: "submit",
											children: "Join"
										})]
									})
								})]
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "text-sm text-slate-300 font-medium m-0",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Coaching Sikar. All rights reserved."
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-6",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700",
							children: [/* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" }), "All Systems Normal"]
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { BlogFooter as t };
