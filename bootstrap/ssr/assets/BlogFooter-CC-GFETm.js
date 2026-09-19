import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region resources/js/NextComponents/BrandIcons.tsx
var Instagram = (props) => /* @__PURE__ */ jsxs("svg", {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	...props,
	children: [
		/* @__PURE__ */ jsx("rect", {
			x: "2",
			y: "2",
			width: "20",
			height: "20",
			rx: "5",
			ry: "5"
		}),
		/* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
		/* @__PURE__ */ jsx("line", {
			x1: "17.5",
			y1: "6.5",
			x2: "17.51",
			y2: "6.5"
		})
	]
});
var Facebook = (props) => /* @__PURE__ */ jsx("svg", {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
});
var Twitter = (props) => /* @__PURE__ */ jsx("svg", {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	...props,
	children: /* @__PURE__ */ jsx("path", { d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" })
});
var Linkedin = (props) => /* @__PURE__ */ jsxs("svg", {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	...props,
	children: [
		/* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }),
		/* @__PURE__ */ jsx("rect", {
			x: "2",
			y: "9",
			width: "4",
			height: "12"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "4",
			cy: "4",
			r: "2"
		})
	]
});
var Youtube = (props) => /* @__PURE__ */ jsxs("svg", {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	...props,
	children: [/* @__PURE__ */ jsx("path", { d: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z" }), /* @__PURE__ */ jsx("polygon", { points: "9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" })]
});
//#endregion
//#region resources/js/NextComponents/BlogFooter.tsx
function BlogFooter() {
	const pathname = typeof window !== "undefined" ? window.location.pathname : "";
	const [email, setEmail] = useState("");
	if (pathname?.startsWith("/blog/admin")) return null;
	const handleNavClick = (page) => {
		const basePath = typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "";
		if (page === "blog") {
			window.location.href = basePath + "/blog";
			return;
		}
		if (page === "portal") {
			window.location.href = basePath + "/portal/";
			return;
		}
		if (page === "youtubevideodownload") {
			window.location.href = basePath + "/youtubevideodownload";
			return;
		}
		if (page === "playbook") {
			window.location.href = basePath + "/playbook/";
			return;
		}
		if ([
			"prop-firm",
			"sip-calculator",
			"compound-interest",
			"whatsapp-link-generator",
			"whatsapp-direct-message",
			"whatsapp-form-generator"
		].includes(page)) {
			window.location.href = basePath + `/tool/${page}`;
			return;
		}
		window.location.href = basePath + `/${page === "landing" ? "" : page}`;
	};
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
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center space-x-3 group cursor-pointer",
									onClick: () => handleNavClick("landing"),
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden p-1",
										children: /* @__PURE__ */ jsx("img", {
											loading: "lazy",
											decoding: "async",
											fetchPriority: "low",
											src: (typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/images/64/logo.webp",
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
						[{
							title: "Navigation",
							links: [
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
									page: "reviews"
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
						}].map((section) => {
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
											children: /* @__PURE__ */ jsxs("button", {
												onClick: () => handleNavClick(link.page),
												className: "text-sm text-slate-200 hover:text-white hover:translate-x-2 transition-all duration-300 text-left bg-transparent border-none p-0 cursor-pointer flex items-center group outline-none focus:outline-none ring-0",
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
