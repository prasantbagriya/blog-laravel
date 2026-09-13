import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Crown } from "lucide-react";
//#region resources/js/Pages/Reviews/components/AdminPanel.tsx
var AdminPanel = ({ businesses, reviews }) => {
	const verifiedBusinessesCount = businesses.filter((b) => b.isVerified).length;
	const verifiedReviewsCount = reviews.filter((r) => r.isVerifiedPurchase).length;
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 transition-colors",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3.5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 rounded-sm bg-blue-100 text-blue-600 flex items-center justify-center",
							children: /* @__PURE__ */ jsx(Crown, { className: "w-5 h-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-xl font-bold text-zinc-900 dark:text-white",
							children: "TrustPulse Super Admin Dashboard"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-zinc-500 dark:text-zinc-400",
							children: "Platform operational metrics, monetization plans, and Gemini AI system health."
						})] })]
					}), /* @__PURE__ */ jsx("div", {
						className: "px-3.5 py-1.5 rounded-sm bg-blue-100 border border-blue-600/20 text-blue-600 text-xs font-mono font-bold",
						children: "Super Admin Portal Active"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
									children: "Total Businesses"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-2xl font-bold font-mono text-zinc-900 dark:text-white",
									children: [businesses.length, " Listed"]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-[11px] text-blue-600 font-semibold",
									children: [verifiedBusinessesCount, " Claimed Gold/Silver"]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
									children: "Platform Reviews"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-2xl font-bold font-mono text-zinc-900 dark:text-white",
									children: [reviews.length, " Published"]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "text-[11px] text-blue-600 font-semibold",
									children: [verifiedReviewsCount, " Verified Invoices"]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
									children: "MRR Revenue"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-2xl font-bold font-mono text-blue-600",
									children: "$48,920 / mo"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-zinc-500 dark:text-zinc-400 font-medium",
									children: "320 Pro Business Subscribers"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
									children: "Gemini AI Model"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-2xl font-bold font-mono text-blue-600",
									children: "gemini-3.6-flash"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-blue-600 font-semibold",
									children: "99.98% API Uptime"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-bold text-zinc-900 dark:text-white",
						children: "Active Monetization Tiers"
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 space-y-3",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono font-bold uppercase tracking-widest text-zinc-400 text-[10px] block",
										children: "Free Tier"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-bold font-mono text-zinc-900 dark:text-white",
										children: "$0 / month"
									}),
									/* @__PURE__ */ jsxs("ul", {
										className: "space-y-1.5 text-zinc-500 dark:text-zinc-400",
										children: [
											/* @__PURE__ */ jsx("li", { children: "• Basic business profile" }),
											/* @__PURE__ */ jsx("li", { children: "• Public review listing" }),
											/* @__PURE__ */ jsx("li", { children: "• Manual business responses" })
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 space-y-3",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 text-[10px] block",
										children: "Pro Business"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-bold font-mono text-blue-600 dark:text-blue-400",
										children: "$49 / month"
									}),
									/* @__PURE__ */ jsxs("ul", {
										className: "space-y-1.5 text-zinc-900 dark:text-zinc-100",
										children: [
											/* @__PURE__ */ jsx("li", { children: "• Verified Gold Badge" }),
											/* @__PURE__ */ jsx("li", { children: "• Unlimited Gemini AI Auto-Replies" }),
											/* @__PURE__ */ jsx("li", { children: "• Embeddable Trust Score Badges" }),
											/* @__PURE__ */ jsx("li", { children: "• Competitor Benchmark Tool" })
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 space-y-3",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white text-[10px] block",
										children: "Enterprise White-Label"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-bold font-mono text-zinc-900 dark:text-white",
										children: "$199 / month"
									}),
									/* @__PURE__ */ jsxs("ul", {
										className: "space-y-1.5 text-zinc-500 dark:text-zinc-400",
										children: [
											/* @__PURE__ */ jsx("li", { children: "• Custom domain reputation hub" }),
											/* @__PURE__ */ jsx("li", { children: "• Full REST & Webhook API access" }),
											/* @__PURE__ */ jsx("li", { children: "• Dedicated Account Manager" })
										]
									})
								]
							})
						]
					})]
				})
			]
		})
	});
};
//#endregion
export { AdminPanel };
