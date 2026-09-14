import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CheckCircle2, Search, ShieldCheck, Sparkles, Star, TrendingUp, Zap } from "lucide-react";
//#region resources/js/Pages/Reviews/components/HeroSection.tsx
var HeroSection = ({ onSearchSubmit, onOpenAiAssistant, categories, onSelectCategory, trendingBusinesses, onSelectBusiness }) => {
	const [query, setQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const handleSearch = (e) => {
		e.preventDefault();
		if (query.trim()) onSearchSubmit(query.trim());
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "relative w-full min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden bg-slate-900",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 z-0 bg-cover bg-center",
				style: { backgroundImage: `url('/uploads/background.webp')` },
				role: "img",
				"aria-label": "Hero Background"
			}),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 bg-slate-900/85" }),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "text-center w-full",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold tracking-wide border border-blue-500/30",
								children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-blue-400" }), /* @__PURE__ */ jsx("span", {
									className: "uppercase tracking-widest",
									children: "Editorial Reputation Intelligence Platform"
								})]
							}),
							/* @__PURE__ */ jsxs("h1", {
								className: "text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] text-white tracking-tight mt-4",
								children: [
									"Read Reviews. ",
									/* @__PURE__ */ jsx("br", { className: "hidden sm:block" }),
									/* @__PURE__ */ jsx("span", {
										className: "text-blue-400",
										children: "Trust What You Buy."
									})
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto",
								children: "Discover 10M+ verified companies evaluated by real customer invoices, AI fraud detection, and 0–100 Trust Scores."
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleSearch,
								className: "pt-6 pb-2 max-w-3xl mx-auto relative",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative flex items-center gap-2 rounded-full bg-white p-2 w-full z-20 border-2 border-transparent transition-all duration-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] group",
									children: [
										/* @__PURE__ */ jsx(Search, { className: "w-5 h-5 text-slate-400 ml-4 shrink-0" }),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											value: query,
											onChange: (e) => {
												setQuery(e.target.value);
												setShowSuggestions(true);
											},
											onFocus: () => setShowSuggestions(true),
											onBlur: () => setTimeout(() => setShowSuggestions(false), 200),
											placeholder: "Search company, category, or ask AI... e.g. 'Aether Cloud'",
											className: "flex-1 border-0 outline-none focus:ring-0 text-slate-900 text-sm md:text-base py-2.5 bg-transparent placeholder-slate-400 px-2"
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: onOpenAiAssistant,
											className: "hidden sm:flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-500/20 transition shrink-0 border border-pink-400 dark:border-pink-500/60 hover:border-pink-500 outline-none ring-0 shadow-sm shadow-pink-200 dark:shadow-pink-500/10",
											children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-pink-500 dark:text-pink-400" }), /* @__PURE__ */ jsx("span", { children: "Ask AI" })]
										}),
										/* @__PURE__ */ jsx("button", {
											type: "submit",
											className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-8 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none ring-0 focus:ring-0",
											children: "Search"
										})
									]
								}), showSuggestions && query.trim().length > 0 && /* @__PURE__ */ jsx("div", {
									className: "absolute top-[calc(100%-0.5rem)] left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-100 max-h-[300px] overflow-y-auto text-left",
									children: (() => {
										const filteredBiz = (trendingBusinesses || []).filter((b) => b.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4);
										const filteredCat = (categories || []).filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 2);
										if (filteredBiz.length === 0 && filteredCat.length === 0) return /* @__PURE__ */ jsxs("div", {
											className: "p-4 text-center text-slate-500 text-sm",
											children: [
												"No results found for \"",
												query,
												"\""
											]
										});
										const basePath = typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "";
										return /* @__PURE__ */ jsxs("div", {
											className: "py-2",
											children: [filteredCat.length > 0 && /* @__PURE__ */ jsxs("div", {
												className: "mb-2",
												children: [/* @__PURE__ */ jsx("div", {
													className: "px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider",
													children: "Categories"
												}), filteredCat.map((cat) => /* @__PURE__ */ jsxs(Link, {
													href: `${basePath}/reviews/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`,
													className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
													children: [/* @__PURE__ */ jsx("div", {
														className: "bg-blue-50 p-2 rounded-lg text-blue-600",
														children: /* @__PURE__ */ jsx(TrendingUp, { size: 16 })
													}), /* @__PURE__ */ jsx("span", {
														className: "font-medium text-slate-800",
														children: cat.name
													})]
												}, `cat-${cat.id}`))]
											}), filteredBiz.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider",
												children: "Institutes"
											}), filteredBiz.map((biz) => /* @__PURE__ */ jsxs(Link, {
												href: `${basePath}/reviews/${biz.category || "coaching-institutes"}/${biz.slug}`,
												className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200",
													children: /* @__PURE__ */ jsx("img", {
														src: biz.logo || "/uploads/read.webp",
														alt: biz.name,
														width: "44",
														height: "44",
														className: "w-full h-full object-contain"
													})
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex flex-col",
													children: [/* @__PURE__ */ jsx("span", {
														className: "font-medium text-slate-800",
														children: biz.name
													}), /* @__PURE__ */ jsx("span", {
														className: "text-xs text-slate-500",
														children: biz.categoryName || biz.category
													})]
												})]
											}, `biz-${biz.id}`))] })]
										});
									})()
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2 flex flex-wrap items-center justify-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold uppercase text-white/50 mr-1 tracking-wider",
									children: "Trending:"
								}), categories.slice(0, 5).map((cat) => /* @__PURE__ */ jsx("button", {
									onClick: () => onSelectCategory(cat.slug),
									className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-xs font-semibold border-none outline-none focus:outline-none ring-0",
									children: cat.name
								}, cat.id))]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-8 flex flex-wrap justify-center gap-3",
								children: [/* @__PURE__ */ jsx(Link, {
									href: `${typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : ""}/reviews`,
									className: "bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-3 rounded-md transition-colors text-center inline-flex items-center justify-center",
									children: "Explore Institutes"
								}), /* @__PURE__ */ jsx(Link, {
									href: `${typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : ""}/blog`,
									className: "bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors text-center inline-flex items-center justify-center",
									children: "Browse Articles"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center transform transition-transform hover:-translate-y-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { children: "100M+" }), /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-green-400" })]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-white/60 mt-2",
									children: "Verified Reviews"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center transform transition-transform hover:-translate-y-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { children: "10M+" }), /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-blue-400" })]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-white/60 mt-2",
									children: "Listed Businesses"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center transform transition-transform hover:-translate-y-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { children: "99.8%" }), /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5 text-amber-400" })]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-white/60 mt-2",
									children: "AI Fraud Precision"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center transform transition-transform hover:-translate-y-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { children: "0 - 100" }), /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 text-amber-400 fill-amber-400" })]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold uppercase tracking-wider text-white/60 mt-2",
									children: "Trust Score Engine"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-16 max-w-5xl mx-auto",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-2 mb-6",
							children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-amber-400" }), /* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold uppercase tracking-widest text-white/90",
								children: "Trending High Trust Companies"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
							children: trendingBusinesses.slice(0, 3).map((biz) => /* @__PURE__ */ jsxs("div", {
								onClick: () => onSelectBusiness(biz.slug),
								className: "group p-4 rounded-xl bg-white/10 border border-white/10 hover:border-blue-500/50 hover:bg-white/15 backdrop-blur-sm transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xl",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 overflow-hidden",
									children: [/* @__PURE__ */ jsx("img", {
										src: biz.logo,
										alt: biz.name,
										className: "w-12 h-12 rounded-lg object-cover bg-white p-0.5 shrink-0"
									}), /* @__PURE__ */ jsxs("div", {
										className: "truncate",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-sm font-bold text-white truncate group-hover:text-blue-300 transition",
											children: biz.name
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-white/60 truncate mt-0.5 uppercase tracking-wide",
											children: biz.categoryName
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-right shrink-0",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-bold",
										children: [/* @__PURE__ */ jsx("span", { children: biz.trustScore }), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] opacity-70",
											children: "/100"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1 text-[11px] text-amber-400 justify-end mt-1.5 font-bold",
										children: [/* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-amber-400" }), /* @__PURE__ */ jsx("span", { children: biz.rating })]
									})]
								})]
							}, biz.id))
						})]
					})
				]
			})
		]
	});
};
//#endregion
export { HeroSection };
