import { t as AnimatedBorderCard } from "./AnimatedBorderCard-kIZ2YD7I.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AlertCircle, Building2, CheckCircle2, Clock, FileText, Flag, Globe, Languages, MapPin, MessageSquare, Phone, Plus, ShieldCheck, Sparkles, Star, ThumbsUp, TrendingUp } from "lucide-react";
//#region resources/js/Pages/Reviews/components/BusinessProfileView.tsx
var BusinessProfileView = ({ business, reviews, allBusinesses, onOpenWriteReview, onVoteHelpful, onFlagReview, onAddReply, onOpenEditBusiness, authUser }) => {
	const [activeTab, setActiveTab] = useState("reviews");
	const [reviewFilterRating, setReviewFilterRating] = useState("all");
	const [verifiedOnly, setVerifiedOnly] = useState(false);
	const [reviewSearchQuery, setReviewSearchQuery] = useState("");
	const [selectedCompetitorId, setSelectedCompetitorId] = useState("");
	const [competitorReport, setCompetitorReport] = useState(null);
	const [isLoadingCompetitorReport, setIsLoadingCompetitorReport] = useState(false);
	const [replyingReviewId, setReplyingReviewId] = useState(null);
	const [replyText, setReplyText] = useState("");
	const [translatedReviewIds, setTranslatedReviewIds] = useState({});
	const filteredReviews = reviews.filter((r) => {
		if (reviewFilterRating !== "all" && r.rating !== reviewFilterRating) return false;
		if (verifiedOnly && !r.isVerifiedPurchase) return false;
		if (reviewSearchQuery.trim()) {
			const q = reviewSearchQuery.toLowerCase();
			return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.reviewerName.toLowerCase().includes(q);
		}
		return true;
	});
	const handleRunCompetitorComparison = async () => {
		if (!selectedCompetitorId) return;
		setIsLoadingCompetitorReport(true);
		try {
			const data = await (await fetch("/api/ai/competitor-compare", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					targetBusinessId: business.id,
					competitorBusinessId: selectedCompetitorId
				})
			})).json();
			setCompetitorReport(data);
		} catch (err) {
			console.error("Competitor report error:", err);
		} finally {
			setIsLoadingCompetitorReport(false);
		}
	};
	const handleTranslateReview = (reviewId) => {
		if (translatedReviewIds[reviewId]) {
			const newMap = { ...translatedReviewIds };
			delete newMap[reviewId];
			setTranslatedReviewIds(newMap);
		} else setTranslatedReviewIds({
			...translatedReviewIds,
			[reviewId]: "AI Translation (Spanish): \"Excelente experiencia con esta empresa. La atención al cliente fue inmediata y los resultados superaron nuestras expectativas.\""
		});
	};
	const handlePostReply = (reviewId) => {
		if (replyText.trim()) {
			onAddReply(reviewId, replyText.trim());
			setReplyingReviewId(null);
			setReplyText("");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20 transition-colors font-sans",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "h-64 sm:h-80 lg:h-[400px] w-full relative overflow-hidden bg-zinc-900",
			children: [/* @__PURE__ */ jsx("img", {
				src: business.coverImage,
				alt: business.name,
				className: "w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 hover:scale-105"
			}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-zinc-950 via-slate-900/30 to-transparent" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "p-8 sm:p-10 rounded-[2.5rem] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-white/40 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] mb-12 relative overflow-hidden",
					children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row items-start gap-8 w-full lg:w-auto",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative group shrink-0",
								children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity" }), /* @__PURE__ */ jsx("img", {
									src: business.logo,
									alt: business.name,
									className: "w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-4 border-white dark:border-zinc-800 shadow-xl relative z-10 bg-white"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "pt-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 flex-wrap mb-3",
										children: [/* @__PURE__ */ jsx("h1", {
											className: "text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight",
											children: business.name
										}), business.isVerified && /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[11px] uppercase tracking-widest font-black shadow-sm border border-blue-100 dark:border-blue-800",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-blue-600" }), "VERIFIED"]
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-base sm:text-lg text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl mb-6 font-medium",
										children: business.description
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-zinc-300 flex-wrap",
										children: [
											/* @__PURE__ */ jsxs("a", {
												href: business.website,
												target: "_blank",
												rel: "noreferrer",
												className: "flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-zinc-800/80 px-4 py-2 rounded-xl shadow-sm hover:shadow",
												children: [/* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-blue-500" }), /* @__PURE__ */ jsx("span", { children: "Website" })]
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-2 bg-slate-100 dark:bg-zinc-800/80 px-4 py-2 rounded-xl shadow-sm",
												children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ jsxs("span", { children: [
													business.city,
													", ",
													business.country
												] })]
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-2 bg-slate-100 dark:bg-zinc-800/80 px-4 py-2 rounded-xl shadow-sm",
												children: [/* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ jsx("span", { children: business.categoryName })]
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "group relative flex flex-col items-center sm:items-end w-full lg:w-auto shrink-0 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-3xl transition-all duration-500 overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-3xl border border-slate-200/60 dark:border-zinc-700/50 group-hover:border-transparent transition-colors duration-300" }),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-3xl border-2 border-blue-500 opacity-0 group-hover:opacity-100 scale-[1.03] group-hover:scale-100 transition-all duration-500 pointer-events-none" }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col items-center sm:items-end w-full justify-center text-center sm:text-right relative z-10",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6 w-full justify-center sm:justify-end",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "text-center sm:text-right flex flex-col items-center sm:items-end",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "text-4xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-end gap-2 mb-1",
													children: [business.rating, /* @__PURE__ */ jsx(Star, { className: "w-7 h-7 fill-amber-500 text-amber-500 -mt-1 drop-shadow-md" })]
												}), /* @__PURE__ */ jsxs("div", {
													className: "text-sm text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider",
													children: [business.reviewCount.toLocaleString(), " reviews"]
												})]
											}),
											/* @__PURE__ */ jsx("div", { className: "hidden sm:block h-14 w-px bg-slate-200 dark:bg-zinc-700" }),
											/* @__PURE__ */ jsx("div", { className: "sm:hidden w-14 h-px bg-slate-200 dark:bg-zinc-700 my-2" }),
											/* @__PURE__ */ jsxs("div", {
												className: "text-center",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight flex items-baseline justify-center mb-1",
													children: [
														business.trustScore,
														" ",
														/* @__PURE__ */ jsx("span", {
															className: "text-base text-blue-400 dark:text-blue-500/70 ml-1 font-bold",
															children: "/100"
														})
													]
												}), /* @__PURE__ */ jsxs("div", {
													className: "text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-1.5",
													children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-blue-500" }), "Trust Score"]
												})]
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "w-full space-y-3 mt-4",
										children: [/* @__PURE__ */ jsx("button", {
											onClick: () => onOpenWriteReview(business.id),
											className: "block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3.5 rounded-full transition-all shadow-sm active:scale-95 border border-slate-900 dark:border-white",
											children: "Write a Review"
										}), authUser && (business.userId && business.userId == authUser.id || business.email && business.email === authUser.email || authUser.role === "super_admin") && /* @__PURE__ */ jsx("button", {
											onClick: () => onOpenEditBusiness?.(),
											className: "block w-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white text-center font-bold py-3.5 rounded-full transition-all border border-slate-200 dark:border-zinc-700 active:scale-95 shadow-sm",
											children: "Manage Profile"
										})]
									})]
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2 mb-10 overflow-x-auto p-1.5 bg-slate-200/50 dark:bg-zinc-900/50 rounded-2xl w-max max-w-full backdrop-blur-sm border border-slate-200 dark:border-zinc-800 scrollbar-hide",
					children: [
						{
							id: "reviews",
							label: "Reviews",
							icon: MessageSquare,
							count: business.reviewCount
						},
						{
							id: "ai_insights",
							label: "AI Insights",
							icon: Sparkles
						},
						{
							id: "competitors",
							label: "Competitor Benchmark",
							icon: TrendingUp
						},
						{
							id: "about",
							label: "Company Info",
							icon: Building2
						}
					].map((tab) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab(tab.id),
						className: `py-3 px-6 text-sm font-bold rounded-xl transition-all shrink-0 flex items-center gap-2 ${activeTab === tab.id ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm border-transparent" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50"}`,
						children: [/* @__PURE__ */ jsx(tab.icon, { className: `w-4 h-4 ${activeTab === tab.id ? "text-blue-500" : "text-slate-400 dark:text-zinc-500"}` }), /* @__PURE__ */ jsxs("span", { children: [
							tab.label,
							" ",
							tab.count ? /* @__PURE__ */ jsxs("span", {
								className: "opacity-60 ml-1",
								children: [
									"(",
									tab.count,
									")"
								]
							}) : ""
						] })]
					}, tab.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 xl:grid-cols-3 gap-10",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "xl:col-span-2 space-y-10",
						children: [
							activeTab === "reviews" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-8",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex-1 w-full relative",
										children: [/* @__PURE__ */ jsx("input", {
											type: "text",
											value: reviewSearchQuery,
											onChange: (e) => setReviewSearchQuery(e.target.value),
											placeholder: "Search in reviews...",
											className: "w-full pl-12 pr-4 py-3.5 text-sm font-medium rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white transition-all outline-none shadow-sm"
										}), /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-slate-400 absolute left-4 top-3.5" })]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-4 shrink-0 px-2",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1 bg-slate-50 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-slate-100 dark:border-zinc-700",
											children: [/* @__PURE__ */ jsx("button", {
												onClick: () => setReviewFilterRating("all"),
												className: `px-4 py-2 text-xs font-bold rounded-xl transition-all ${reviewFilterRating === "all" ? "bg-white dark:bg-zinc-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"}`,
												children: "All"
											}), [
												5,
												4,
												3,
												2,
												1
											].map((s) => /* @__PURE__ */ jsxs("button", {
												onClick: () => setReviewFilterRating(s),
												className: `px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${reviewFilterRating === s ? "bg-white dark:bg-zinc-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"}`,
												children: [
													s,
													" ",
													/* @__PURE__ */ jsx(Star, { className: `w-3.5 h-3.5 ${reviewFilterRating === s ? "fill-amber-500 text-amber-500" : "text-slate-400 dark:text-zinc-500"}` })
												]
											}, s))]
										}), /* @__PURE__ */ jsxs("label", {
											className: "flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300 font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 p-2 rounded-xl transition-colors",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: verifiedOnly,
												onChange: (e) => setVerifiedOnly(e.target.checked),
												className: "w-5 h-5 rounded-md text-blue-600 focus:ring-blue-500/30 border-slate-300 dark:border-zinc-600 dark:bg-zinc-800 transition"
											}), /* @__PURE__ */ jsx("span", { children: "Verified" })]
										})]
									})]
								}), filteredReviews.length === 0 ? /* @__PURE__ */ jsxs("div", {
									className: "p-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-20 h-20 bg-slate-50 dark:bg-zinc-800/80 rounded-full flex items-center justify-center mx-auto mb-6",
											children: /* @__PURE__ */ jsx(MessageSquare, { className: "w-10 h-10 text-slate-400 dark:text-zinc-500" })
										}),
										/* @__PURE__ */ jsx("h4", {
											className: "text-2xl font-black text-slate-900 dark:text-white mb-2",
											children: "No reviews found"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-base text-slate-500 font-medium",
											children: "Try adjusting your filters to see more results."
										})
									]
								}) : filteredReviews.map((rev) => /* @__PURE__ */ jsxs(AnimatedBorderCard, {
									className: "p-8 sm:p-10 relative",
									children: [
										/* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none" }),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start justify-between gap-4 mb-8 relative z-10",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-5",
												children: [/* @__PURE__ */ jsx("img", {
													src: rev.reviewerAvatar,
													alt: rev.reviewerName,
													className: "w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-zinc-800 shadow-sm"
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-3 mb-1",
													children: [/* @__PURE__ */ jsx("h4", {
														className: "text-base font-extrabold text-slate-900 dark:text-white tracking-tight",
														children: rev.reviewerName
													}), rev.isVerifiedPurchase && /* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-800/50",
														children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-blue-600" }), /* @__PURE__ */ jsx("span", { children: "Verified Buyer" })]
													})]
												}), /* @__PURE__ */ jsxs("div", {
													className: "text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-2",
													children: [
														/* @__PURE__ */ jsx("span", { children: rev.reviewerLocation }),
														/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700" }),
														/* @__PURE__ */ jsx("span", { children: rev.createdAt })
													]
												})] })]
											}), /* @__PURE__ */ jsx("div", {
												className: "flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-800/30 shadow-sm",
												children: [
													1,
													2,
													3,
													4,
													5
												].map((s) => /* @__PURE__ */ jsx(Star, { className: `w-4 h-4 ${s <= rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-300 dark:text-zinc-700"}` }, s))
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "space-y-4 mb-8 relative z-10",
											children: [
												/* @__PURE__ */ jsx("h3", {
													className: "text-xl font-black text-slate-900 dark:text-white leading-tight",
													children: rev.title
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-base text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-medium",
													children: rev.description
												}),
												translatedReviewIds[rev.id] && /* @__PURE__ */ jsxs("div", {
													className: "p-5 mt-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-sm font-medium text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 italic relative overflow-hidden",
													children: [/* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1 bg-blue-500" }), translatedReviewIds[rev.id]]
												})
											]
										}),
										(rev.pros.length > 0 || rev.cons.length > 0) && /* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm mb-8 relative z-10",
											children: [rev.pros.length > 0 && /* @__PURE__ */ jsxs("div", {
												className: "p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-100",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "font-black uppercase tracking-widest flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400 text-xs",
													children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), " Pros"]
												}), /* @__PURE__ */ jsx("ul", {
													className: "space-y-2",
													children: rev.pros.map((p, idx) => /* @__PURE__ */ jsxs("li", {
														className: "flex items-start gap-2.5 font-medium",
														children: [
															/* @__PURE__ */ jsx("span", {
																className: "text-emerald-500 mt-0.5 font-bold",
																children: "•"
															}),
															" ",
															p
														]
													}, idx))
												})]
											}), rev.cons.length > 0 && /* @__PURE__ */ jsxs("div", {
												className: "p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-rose-900 dark:text-rose-100",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "font-black uppercase tracking-widest flex items-center gap-2 mb-3 text-rose-700 dark:text-rose-400 text-xs",
													children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" }), " Cons"]
												}), /* @__PURE__ */ jsx("ul", {
													className: "space-y-2",
													children: rev.cons.map((c, idx) => /* @__PURE__ */ jsxs("li", {
														className: "flex items-start gap-2.5 font-medium",
														children: [
															/* @__PURE__ */ jsx("span", {
																className: "text-rose-500 mt-0.5 font-bold",
																children: "•"
															}),
															" ",
															c
														]
													}, idx))
												})]
											})]
										}),
										rev.proof && /* @__PURE__ */ jsxs("div", {
											className: "p-4 mb-8 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 flex flex-wrap items-center justify-between text-sm text-slate-700 dark:text-zinc-300 gap-4 relative z-10",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3 font-medium",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center",
													children: /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" })
												}), /* @__PURE__ */ jsxs("span", { children: ["Proof Verified: ", /* @__PURE__ */ jsx("strong", {
													className: "text-slate-900 dark:text-white",
													children: rev.proof.orderNumber || "Invoice #8891"
												})] })]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[11px] uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-black",
												children: "Verified"
											})]
										}),
										rev.businessReply && /* @__PURE__ */ jsxs("div", {
											className: "mb-8 p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-sm space-y-3 relative overflow-hidden z-10",
											children: [
												/* @__PURE__ */ jsx("div", {
													className: "absolute -bottom-4 -right-4 p-4 opacity-5 pointer-events-none",
													children: /* @__PURE__ */ jsx(Building2, { className: "w-32 h-32" })
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between relative z-10 mb-2",
													children: [/* @__PURE__ */ jsxs("span", {
														className: "font-extrabold text-slate-900 dark:text-white flex items-center gap-2",
														children: [
															/* @__PURE__ */ jsx("div", {
																className: "w-6 h-6 rounded-md bg-slate-200 dark:bg-zinc-700 flex items-center justify-center",
																children: /* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5 text-slate-600 dark:text-zinc-300" })
															}),
															"Reply from ",
															rev.businessReply.authorName
														]
													}), /* @__PURE__ */ jsx("span", {
														className: "text-xs font-bold uppercase tracking-wider text-slate-400",
														children: rev.businessReply.createdAt
													})]
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-slate-600 dark:text-zinc-300 leading-relaxed relative z-10 font-medium",
													children: rev.businessReply.content
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "pt-6 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between text-sm text-slate-500 dark:text-zinc-400 relative z-10 gap-4",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsxs("button", {
													onClick: () => onVoteHelpful(rev.id, "up"),
													className: "flex items-center gap-2 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl transition-all font-bold text-slate-600 dark:text-zinc-300 border border-transparent hover:border-blue-100 dark:hover:border-blue-800/50",
													children: [/* @__PURE__ */ jsx(ThumbsUp, { className: "w-4 h-4" }), /* @__PURE__ */ jsxs("span", { children: [
														"Helpful (",
														rev.helpfulCount,
														")"
													] })]
												}), /* @__PURE__ */ jsxs("button", {
													onClick: () => handleTranslateReview(rev.id),
													className: "flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl transition-all font-bold",
													children: [/* @__PURE__ */ jsx(Languages, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Translate" })]
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("button", {
													onClick: () => setReplyingReviewId(replyingReviewId === rev.id ? null : rev.id),
													className: "hover:bg-slate-50 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl transition-all font-bold",
													children: "Reply"
												}), /* @__PURE__ */ jsx("button", {
													onClick: () => onFlagReview(rev.id),
													className: "hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 p-2.5 rounded-xl transition-all",
													title: "Report review",
													children: /* @__PURE__ */ jsx(Flag, { className: "w-4 h-4" })
												})]
											})]
										}),
										replyingReviewId === rev.id && /* @__PURE__ */ jsxs("div", {
											className: "mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 space-y-4 relative z-10",
											children: [/* @__PURE__ */ jsx("textarea", {
												value: replyText,
												onChange: (e) => setReplyText(e.target.value),
												placeholder: "Write an official response on behalf of the business...",
												rows: 3,
												className: "w-full p-4 text-sm font-medium rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-600 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none shadow-sm"
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex justify-end gap-3",
												children: [/* @__PURE__ */ jsx("button", {
													onClick: () => setReplyingReviewId(null),
													className: "px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-xl transition-all",
													children: "Cancel"
												}), /* @__PURE__ */ jsx("button", {
													onClick: () => handlePostReply(rev.id),
													className: "px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all",
													children: "Post Reply"
												})]
											})]
										})
									]
								}, rev.id))]
							}),
							activeTab === "ai_insights" && /* @__PURE__ */ jsxs("div", {
								className: "p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-10 relative overflow-hidden",
								children: [
									/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" }),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-5 border-b border-slate-100 dark:border-zinc-800 pb-8 relative z-10",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30",
											children: /* @__PURE__ */ jsx(Sparkles, { className: "w-7 h-7" })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
											className: "text-2xl font-black text-slate-900 dark:text-white tracking-tight",
											children: "AI Synthesis Report"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-base text-slate-500 font-medium mt-1",
											children: "Real-time analysis extracted from all customer feedback"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-8 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/80 text-base text-slate-700 dark:text-zinc-300 leading-relaxed relative overflow-hidden z-10 shadow-sm",
										children: [
											/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-2 h-full bg-blue-500" }),
											/* @__PURE__ */ jsx("span", {
												className: "font-black text-blue-600 uppercase tracking-widest text-xs block mb-3",
												children: "Executive Summary"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-lg font-medium",
												children: business.aiSummary?.overallSentiment || "Customer reviews reflect strong satisfaction with service reliability and team responsiveness. The overall sentiment indicates a highly positive experience across majority of the user base."
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "bg-emerald-50/50 dark:bg-emerald-900/10 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-800/20",
											children: [/* @__PURE__ */ jsxs("h4", {
												className: "text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-6 flex items-center gap-2.5",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center",
													children: /* @__PURE__ */ jsx(ThumbsUp, { className: "w-4 h-4" })
												}), "Top Strengths"]
											}), /* @__PURE__ */ jsx("ul", {
												className: "space-y-4 text-base",
												children: (business.aiSummary?.positiveHighlights || [
													"Fast response time",
													"High reliability",
													"Friendly staff"
												]).map((item, idx) => /* @__PURE__ */ jsxs("li", {
													className: "text-emerald-900 dark:text-emerald-100 flex items-start gap-3 font-medium",
													children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6 text-emerald-500 shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "pt-0.5",
														children: item
													})]
												}, idx))
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "bg-rose-50/50 dark:bg-rose-900/10 p-8 rounded-2xl border border-rose-100 dark:border-rose-800/20",
											children: [/* @__PURE__ */ jsxs("h4", {
												className: "text-xs font-black uppercase tracking-widest text-rose-700 dark:text-rose-400 mb-6 flex items-center gap-2.5",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center",
													children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" })
												}), "Areas To Improve"]
											}), /* @__PURE__ */ jsx("ul", {
												className: "space-y-4 text-base",
												children: (business.aiSummary?.criticalPoints || ["Pricing tiers for high bandwidth", "Weekend support availability"]).map((item, idx) => /* @__PURE__ */ jsxs("li", {
													className: "text-rose-900 dark:text-rose-100 flex items-start gap-3 font-medium",
													children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6 text-rose-500 shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "pt-0.5",
														children: item
													})]
												}, idx))
											})]
										})]
									})
								]
							}),
							activeTab === "competitors" && /* @__PURE__ */ jsxs("div", {
								className: "p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-10",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "border-b border-slate-100 dark:border-zinc-800 pb-8",
										children: [/* @__PURE__ */ jsxs("h3", {
											className: "text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center",
												children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" })
											}), "AI Competitor Benchmark Tool"]
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-base font-medium text-slate-500 mt-3 ml-15",
											children: [
												"Compare ",
												/* @__PURE__ */ jsx("strong", {
													className: "text-slate-700 dark:text-zinc-300",
													children: business.name
												}),
												" side-by-side with industry rivals to uncover market gaps."
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm",
										children: [/* @__PURE__ */ jsxs("select", {
											value: selectedCompetitorId,
											onChange: (e) => setSelectedCompetitorId(e.target.value),
											className: "flex-1 p-4 text-base font-bold rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer transition-all",
											children: [/* @__PURE__ */ jsx("option", {
												value: "",
												children: "-- Select Competitor to Analyze --"
											}), allBusinesses.filter((b) => b.id !== business.id).map((b) => /* @__PURE__ */ jsxs("option", {
												value: b.id,
												children: [
													b.name,
													" (Trust Score: ",
													b.trustScore,
													"/100)"
												]
											}, b.id))]
										}), /* @__PURE__ */ jsx("button", {
											onClick: handleRunCompetitorComparison,
											disabled: !selectedCompetitorId || isLoadingCompetitorReport,
											className: "px-8 py-4 text-sm font-black uppercase tracking-wider rounded-xl bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 disabled:opacity-50 transition-all shrink-0 shadow-md active:scale-95",
											children: isLoadingCompetitorReport ? "Analyzing..." : "Generate Benchmark"
										})]
									}),
									competitorReport && /* @__PURE__ */ jsxs("div", {
										className: "p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/50 space-y-8 shadow-lg shadow-blue-500/5 relative overflow-hidden",
										children: [
											/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 dark:opacity-10 pointer-events-none" }),
											/* @__PURE__ */ jsxs("h4", {
												className: "font-black text-slate-900 dark:text-white text-2xl border-b border-slate-100 dark:border-zinc-800 pb-6 relative z-10 flex items-center flex-wrap gap-4",
												children: [
													/* @__PURE__ */ jsx("span", {
														className: "text-blue-600 dark:text-blue-400",
														children: competitorReport.targetBusinessName
													}),
													/* @__PURE__ */ jsx("span", {
														className: "text-slate-300 dark:text-zinc-600 text-lg uppercase px-3 py-1 bg-slate-50 dark:bg-zinc-800 rounded-lg",
														children: "vs"
													}),
													/* @__PURE__ */ jsx("span", {
														className: "text-slate-700 dark:text-zinc-300",
														children: competitorReport.competitorName
													})
												]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-300 font-medium leading-relaxed text-lg relative z-10",
												children: competitorReport.comparisonSummary
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 relative z-10",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30",
													children: [/* @__PURE__ */ jsxs("span", {
														className: "font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest text-xs block mb-5 flex items-center gap-2",
														children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5" }), " Key Advantages"]
													}), /* @__PURE__ */ jsx("ul", {
														className: "space-y-3 text-emerald-900 dark:text-emerald-100 font-medium",
														children: competitorReport.keyAdvantages.map((a, i) => /* @__PURE__ */ jsxs("li", {
															className: "flex gap-3",
															children: [/* @__PURE__ */ jsx("span", {
																className: "text-emerald-500 font-bold",
																children: "•"
															}), a]
														}, i))
													})]
												}), /* @__PURE__ */ jsxs("div", {
													className: "p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30",
													children: [/* @__PURE__ */ jsxs("span", {
														className: "font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest text-xs block mb-5 flex items-center gap-2",
														children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5" }), " Improvement Areas"]
													}), /* @__PURE__ */ jsx("ul", {
														className: "space-y-3 text-amber-900 dark:text-amber-100 font-medium",
														children: competitorReport.areasOfImprovement.map((a, i) => /* @__PURE__ */ jsxs("li", {
															className: "flex gap-3",
															children: [/* @__PURE__ */ jsx("span", {
																className: "text-amber-500 font-bold",
																children: "•"
															}), a]
														}, i))
													})]
												})]
											})
										]
									})
								]
							}),
							activeTab === "about" && /* @__PURE__ */ jsxs("div", {
								className: "p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-10",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-2xl font-black text-slate-900 dark:text-white mb-5",
									children: ["About ", business.name]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed",
									children: business.description
								})] }), business.products && business.products.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
									className: "text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4",
									children: "Products & Services"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
									children: business.products.map((p) => /* @__PURE__ */ jsxs("div", {
										className: "p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700 space-y-3 hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-600 transition-all",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "font-extrabold text-slate-900 dark:text-white flex justify-between items-start gap-4",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-lg leading-tight",
												children: p.name
											}), /* @__PURE__ */ jsx("span", {
												className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold text-sm px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap",
												children: p.price
											})]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-slate-500 dark:text-zinc-400 font-medium text-sm leading-relaxed pt-1",
											children: p.description
										})]
									}, p.id))
								})] })]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-8 xl:sticky xl:top-24 h-max",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6 sm:space-y-8",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-base font-bold text-slate-900 dark:text-white flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-amber-500 fill-amber-500" })
								}), "Category Ratings"]
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-5 text-sm font-bold",
								children: business.categoryAverages && Object.entries(business.categoryAverages).map(([key, val]) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-slate-700 dark:text-zinc-300 capitalize mb-2",
									children: [/* @__PURE__ */ jsx("span", { children: key }), /* @__PURE__ */ jsxs("span", {
										className: "text-slate-900 dark:text-white font-black",
										children: [
											Number(val).toFixed(1),
											" ",
											/* @__PURE__ */ jsx("span", {
												className: "text-slate-400 font-medium text-[11px]",
												children: "/ 5.0"
											})
										]
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden relative",
									children: /* @__PURE__ */ jsx("div", {
										className: "absolute top-0 left-0 h-full bg-blue-500 dark:bg-blue-400 rounded-full",
										style: { width: `${(Number(val) || 0) / 5 * 100}%` }
									})
								})] }, key))
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6 sm:space-y-8",
							children: [
								/* @__PURE__ */ jsxs("h3", {
									className: "text-base font-bold text-slate-900 dark:text-white flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-blue-500" })
									}), "Contact & Details"]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 shrink-0 border border-slate-100 dark:border-zinc-700",
										children: /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-slate-600 dark:text-zinc-400" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "pt-0.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mb-0.5",
											children: "Phone"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-sm font-bold text-slate-900 dark:text-white",
											children: business.phone
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 shrink-0 border border-slate-100 dark:border-zinc-700",
										children: /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-slate-600 dark:text-zinc-400" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "pt-0.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mb-0.5",
											children: "Address"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-sm font-medium leading-relaxed text-slate-900 dark:text-white",
											children: business.address
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 shrink-0 border border-slate-100 dark:border-zinc-700",
										children: /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-slate-600 dark:text-zinc-400" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "pt-0.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mb-0.5",
											children: "Opening Hours"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-sm font-medium leading-relaxed text-slate-900 dark:text-white",
											children: business.openingHours
										})]
									})]
								})
							]
						})]
					})]
				})
			]
		})]
	});
};
//#endregion
export { BusinessProfileView };
