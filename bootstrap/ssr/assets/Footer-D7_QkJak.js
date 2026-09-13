import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Award, Cpu, Globe, Lock, ShieldCheck, Sparkles } from "lucide-react";
//#region resources/js/Pages/Reviews/components/Footer.tsx
var Footer = ({ onOpenApiDocs, onSelectCategory }) => {
	return /* @__PURE__ */ jsx("footer", {
		className: "border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 transition-colors",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-12 p-6 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-l-4 border-l-blue-600 grid grid-cols-1 md:grid-cols-3 gap-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-widest",
								children: "100% Verified Purchases"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
								children: "Reviews are linked to verified invoices and order receipts to eliminate fake feedback."
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ jsx(Cpu, { className: "w-5 h-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-widest",
								children: "AI Fraud Detection"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
								children: "Real-time Gemini AI engine scans device fingerprints and behavioral markers to block bot spam."
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ jsx(Award, { className: "w-5 h-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-widest",
								children: "0-100 Trust Score Standard"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
								children: "Transparent mathematical score combining verified reviews, freshness, and business response rates."
							})] })]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-zinc-200 dark:border-zinc-800",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "col-span-2 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-xs",
										children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 stroke-[2.5]" })
									}), /* @__PURE__ */ jsx("span", {
										className: "font-editorial-serif italic font-bold text-xl text-zinc-900 dark:text-white",
										children: "TrustPulse AI"
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm",
									children: "The next-generation AI reputation intelligence platform empowering millions of consumers to discover verified businesses and helping companies build authentic trust."
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-3 pt-2",
									children: /* @__PURE__ */ jsxs("button", {
										onClick: onOpenApiDocs,
										className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 hover:text-blue-600 text-zinc-900 dark:text-zinc-100 transition",
										children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-blue-600" }), /* @__PURE__ */ jsx("span", { children: "API & Developer Docs" })]
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h5", {
							className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-4",
							children: "Top Directories"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "space-y-2.5 text-xs",
							children: [
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
									onClick: () => onSelectCategory("saas"),
									className: "hover:text-blue-600 transition",
									children: "SaaS & Cloud"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
									onClick: () => onSelectCategory("ai-tools"),
									className: "hover:text-blue-600 transition",
									children: "AI Tools & Models"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
									onClick: () => onSelectCategory("finance"),
									className: "hover:text-blue-600 transition",
									children: "Fintech & Banking"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
									onClick: () => onSelectCategory("hospitals"),
									className: "hover:text-blue-600 transition",
									children: "Hospitals & Health"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
									onClick: () => onSelectCategory("hosting"),
									className: "hover:text-blue-600 transition",
									children: "Web Hosting"
								}) })
							]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h5", {
							className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-4",
							children: "For Businesses"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "space-y-2.5 text-xs",
							children: [
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#dashboard",
									className: "hover:text-blue-600 transition",
									children: "Claim Business Page"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#widgets",
									className: "hover:text-blue-600 transition",
									children: "Embeddable Widgets"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#campaigns",
									className: "hover:text-blue-600 transition",
									children: "QR & Review Invites"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#pricing",
									className: "hover:text-blue-600 transition",
									children: "Plans & Pricing"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#auto-reply",
									className: "hover:text-blue-600 transition",
									children: "AI Auto-Reply Suite"
								}) })
							]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h5", {
							className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-4",
							children: "Trust & Safety"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "space-y-2.5 text-xs",
							children: [
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#guidelines",
									className: "hover:text-blue-600 transition",
									children: "Review Guidelines"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#moderation",
									className: "hover:text-blue-600 transition",
									children: "Fraud Detection Standard"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#privacy",
									className: "hover:text-blue-600 transition",
									children: "Privacy Policy"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#terms",
									className: "hover:text-blue-600 transition",
									children: "Terms of Service"
								}) }),
								/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: "#transparency",
									className: "hover:text-blue-600 transition",
									children: "Transparency Index"
								}) })
							]
						})] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-mono",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ jsx("span", { children: "© 2026 TrustPulse AI Platform Inc. All rights reserved." })
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5 text-blue-600" }), " Global (EN)"]
						}), /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5 text-blue-600" }), " SSL Encrypted"]
						})]
					})]
				})
			]
		})
	});
};
//#endregion
export { Footer };
