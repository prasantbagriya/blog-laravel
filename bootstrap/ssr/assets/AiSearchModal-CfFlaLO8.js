import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Search, Sparkles, Star, X } from "lucide-react";
//#region resources/js/Pages/Reviews/components/AiSearchModal.tsx
var AiSearchModal = ({ onClose, onSelectBusiness }) => {
	const [query, setQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [results, setResults] = useState(null);
	const handleSearchSubmit = async (e) => {
		e.preventDefault();
		if (!query.trim()) return;
		setIsSearching(true);
		try {
			const data = await (await fetch("/api/ai/semantic-search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query: query.trim() })
			})).json();
			setResults(data);
		} catch (err) {
			console.error("Semantic search error:", err);
		} finally {
			setIsSearching(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 bg-zinc-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-2xl p-6 sm:p-8 space-y-6 my-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-9 h-9 rounded-sm bg-blue-100 text-blue-600 flex items-center justify-center",
							children: /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-base font-bold text-zinc-900 dark:text-white",
							children: "Gemini Semantic AI Search"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs font-mono text-zinc-500 dark:text-zinc-400",
							children: "Ask in natural language to find verified businesses"
						})] })]
					}), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSearchSubmit,
					className: "space-y-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("input", {
							type: "text",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "e.g. 'Find me the best AI tool for coding with top support'...",
							className: "w-full p-3.5 pl-10 text-xs font-medium rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
						}), /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-zinc-400 absolute left-3.5 top-4" })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono",
							children: "Try: \"Fast cloud VPS with high uptime\" or \"Best hospitals in Boston\""
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: !query.trim() || isSearching,
							className: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors text-sm disabled:opacity-50",
							children: isSearching ? "Analyzing..." : "Ask AI"
						})]
					})]
				}),
				results && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-4 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 text-xs text-blue-600 dark:text-blue-400",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-bold font-mono block mb-1",
							children: "AI Recommendation Insight:"
						}), /* @__PURE__ */ jsx("p", {
							className: "leading-relaxed text-zinc-900 dark:text-zinc-100",
							children: results.aiRecommendation
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest block",
							children: "Matching Verified Businesses"
						}), results.matches.map((biz) => /* @__PURE__ */ jsxs("div", {
							onClick: () => {
								onSelectBusiness(biz.slug);
								onClose();
							},
							className: "p-4 rounded-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100/50 dark:hover:bg-blue-600/10 border border-zinc-200 dark:border-zinc-800 cursor-pointer transition flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("img", {
									src: biz.logo,
									alt: biz.name,
									className: "w-10 h-10 rounded-xs object-cover border border-zinc-200 dark:border-zinc-800"
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
									className: "text-xs font-bold text-zinc-900 dark:text-white",
									children: biz.name
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[11px] text-zinc-500 dark:text-zinc-400",
									children: [
										biz.categoryName,
										" • ",
										biz.city
									]
								})] })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-xs font-extrabold font-mono text-blue-600",
									children: [biz.trustScore, "/100"]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[10px] text-amber-500 font-bold flex items-center gap-0.5 justify-end",
									children: [
										/* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-amber-500 text-amber-500" }),
										" ",
										biz.rating
									]
								})]
							})]
						}, biz.id))]
					})]
				})
			]
		})
	});
};
//#endregion
export { AiSearchModal };
