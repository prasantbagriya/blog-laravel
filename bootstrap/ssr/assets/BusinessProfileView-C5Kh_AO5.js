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
			className: "h-56 sm:h-72 lg:h-96 w-full relative overflow-hidden bg-zinc-900",
			children: [/* @__PURE__ */ jsx("img", {
				src: business.coverImage,
				alt: business.name,
				className: "w-full h-full object-cover opacity-60 mix-blend-overlay"
			}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "p-6 sm:p-8 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800 shadow-2xl mb-10",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row items-start gap-6 sm:gap-8 w-full lg:w-auto",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative group shrink-0",
								children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" }), /* @__PURE__ */ jsx("img", {
									src: business.logo,
									alt: business.name,
									className: "w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg relative z-10 bg-white"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "pt-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 flex-wrap mb-2",
										children: [/* @__PURE__ */ jsx("h1", {
											className: "text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight",
											children: business.name
										}), business.isVerified && /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold shadow-sm border border-blue-100 dark:border-blue-800",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-blue-600" }), /* @__PURE__ */ jsx("span", { children: "VERIFIED PROFILE" })]
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm sm:text-base text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl mb-4",
										children: business.description
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-zinc-300 flex-wrap",
										children: [
											/* @__PURE__ */ jsxs("a", {
												href: business.website,
												target: "_blank",
												rel: "noreferrer",
												className: "flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg",
												children: [/* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-blue-500" }), /* @__PURE__ */ jsx("span", { children: "Website" })]
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg",
												children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-rose-500" }), /* @__PURE__ */ jsxs("span", { children: [
													business.city,
													", ",
													business.country
												] })]
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg",
												children: [/* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-amber-500" }), /* @__PURE__ */ jsx("span", { children: business.categoryName })]
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center sm:items-end w-full lg:w-auto shrink-0 bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-6 mb-5 w-full justify-between sm:justify-end",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "text-right",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-end gap-2 mb-1",
											children: [business.rating, /* @__PURE__ */ jsx(Star, { className: "w-6 h-6 fill-amber-500 text-amber-500 -mt-1" })]
										}), /* @__PURE__ */ jsxs("div", {
											className: "text-sm text-slate-500 dark:text-zinc-400 font-medium",
											children: [business.reviewCount.toLocaleString(), " reviews"]
										})]
									}),
									/* @__PURE__ */ jsx("div", { className: "h-12 w-px bg-slate-200 dark:bg-zinc-700" }),
									/* @__PURE__ */ jsxs("div", {
										className: "text-center",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight flex items-baseline justify-center mb-1",
											children: [
												business.trustScore,
												" ",
												/* @__PURE__ */ jsx("span", {
													className: "text-sm text-blue-400 dark:text-blue-500/70 ml-1 font-medium",
													children: "/100"
												})
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-blue-500" }), "Trust Score"]
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "w-full space-y-2",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => onOpenWriteReview(business.id),
									className: "block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm",
									children: "Write a Review"
								}), authUser && (business.userId && business.userId == authUser.id || business.email && business.email === authUser.email || authUser.role === "super_admin") && /* @__PURE__ */ jsx("button", {
									onClick: () => onOpenEditBusiness?.(),
									className: "block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm",
									children: "Manage Business Profile"
								})]
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-6 mb-10 overflow-x-auto border-b border-slate-200 dark:border-zinc-800 scrollbar-hide",
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
						className: `py-4 text-sm font-semibold transition-all shrink-0 flex items-center gap-2 border-b-2 -mb-[1px] ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 dark:text-zinc-300 hover:text-blue-600 hover:border-slate-300 dark:hover:border-zinc-600"}`,
						children: [/* @__PURE__ */ jsx(tab.icon, { className: `w-4 h-4 ${activeTab === tab.id ? "" : "text-slate-400 dark:text-zinc-500"}` }), /* @__PURE__ */ jsxs("span", { children: [
							tab.label,
							" ",
							tab.count ? `(${tab.count})` : ""
						] })]
					}, tab.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-2 space-y-8",
						children: [
							activeTab === "reviews" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-6",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex-1 w-full relative",
										children: [/* @__PURE__ */ jsx("input", {
											type: "text",
											value: reviewSearchQuery,
											onChange: (e) => setReviewSearchQuery(e.target.value),
											placeholder: "Search in reviews...",
											className: "w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-900 border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white transition-all outline-none"
										}), /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" })]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 shrink-0",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl",
											children: [/* @__PURE__ */ jsx("button", {
												onClick: () => setReviewFilterRating("all"),
												className: `px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${reviewFilterRating === "all" ? "bg-white dark:bg-zinc-600 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700"}`,
												children: "All"
											}), [
												5,
												4,
												3,
												2,
												1
											].map((s) => /* @__PURE__ */ jsxs("button", {
												onClick: () => setReviewFilterRating(s),
												className: `px-2 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${reviewFilterRating === s ? "bg-white dark:bg-zinc-600 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 dark:text-zinc-400 hover:text-slate-700"}`,
												children: [
													s,
													" ",
													/* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-amber-500 text-amber-500" })
												]
											}, s))]
										}), /* @__PURE__ */ jsxs("label", {
											className: "flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300 font-medium cursor-pointer ml-2",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: verifiedOnly,
												onChange: (e) => setVerifiedOnly(e.target.checked),
												className: "w-4 h-4 rounded text-blue-600 focus:ring-blue-600 border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 transition"
											}), /* @__PURE__ */ jsx("span", { children: "Verified" })]
										})]
									})]
								}), filteredReviews.length === 0 ? /* @__PURE__ */ jsxs("div", {
									className: "p-16 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm",
									children: [
										/* @__PURE__ */ jsx(MessageSquare, { className: "w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-4" }),
										/* @__PURE__ */ jsx("h4", {
											className: "text-lg font-bold text-slate-900 dark:text-white",
											children: "No reviews found"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm text-slate-500 mt-2",
											children: "Try adjusting your filters to see more results."
										})
									]
								}) : filteredReviews.map((rev) => /* @__PURE__ */ jsxs("article", {
									className: "p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start justify-between gap-4 mb-6",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-4",
												children: [/* @__PURE__ */ jsx("img", {
													src: rev.reviewerAvatar,
													alt: rev.reviewerName,
													className: "w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-zinc-800"
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ jsx("h4", {
														className: "text-sm font-bold text-slate-900 dark:text-white",
														children: rev.reviewerName
													}), rev.isVerifiedPurchase && /* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold border border-blue-100 dark:border-blue-800/50",
														children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-blue-600" }), /* @__PURE__ */ jsx("span", { children: "Verified Invoice" })]
													})]
												}), /* @__PURE__ */ jsxs("div", {
													className: "text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2 mt-1",
													children: [
														/* @__PURE__ */ jsx("span", { children: rev.reviewerLocation }),
														/* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" }),
														/* @__PURE__ */ jsx("span", { children: rev.createdAt })
													]
												})] })]
											}), /* @__PURE__ */ jsx("div", {
												className: "flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-800/30",
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
											className: "space-y-3 mb-6",
											children: [
												/* @__PURE__ */ jsx("h3", {
													className: "text-lg font-bold text-slate-900 dark:text-white",
													children: rev.title
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-sm text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line",
													children: rev.description
												}),
												translatedReviewIds[rev.id] && /* @__PURE__ */ jsx("div", {
													className: "p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 italic",
													children: translatedReviewIds[rev.id]
												})
											]
										}),
										(rev.pros.length > 0 || rev.cons.length > 0) && /* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6",
											children: [rev.pros.length > 0 && /* @__PURE__ */ jsxs("div", {
												className: "p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-100",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "font-bold flex items-center gap-1.5 mb-2 text-emerald-700 dark:text-emerald-400",
													children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), " Pros"]
												}), /* @__PURE__ */ jsx("ul", {
													className: "space-y-1",
													children: rev.pros.map((p, idx) => /* @__PURE__ */ jsxs("li", {
														className: "flex items-start gap-2",
														children: [
															/* @__PURE__ */ jsx("span", {
																className: "text-emerald-500 mt-0.5",
																children: "•"
															}),
															" ",
															p
														]
													}, idx))
												})]
											}), rev.cons.length > 0 && /* @__PURE__ */ jsxs("div", {
												className: "p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-rose-900 dark:text-rose-100",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "font-bold flex items-center gap-1.5 mb-2 text-rose-700 dark:text-rose-400",
													children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" }), " Cons"]
												}), /* @__PURE__ */ jsx("ul", {
													className: "space-y-1",
													children: rev.cons.map((c, idx) => /* @__PURE__ */ jsxs("li", {
														className: "flex items-start gap-2",
														children: [
															/* @__PURE__ */ jsx("span", {
																className: "text-rose-500 mt-0.5",
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
											className: "p-3.5 mb-6 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-between text-sm text-slate-600 dark:text-zinc-300",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2 font-medium",
												children: [/* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-blue-600" }), /* @__PURE__ */ jsxs("span", { children: ["Proof Verified: ", /* @__PURE__ */ jsx("strong", { children: rev.proof.orderNumber || "Invoice #8891" })] })]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-md font-bold",
												children: "Verified"
											})]
										}),
										rev.businessReply && /* @__PURE__ */ jsxs("div", {
											className: "mb-6 p-5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border-l-4 border-slate-300 dark:border-zinc-600 text-sm space-y-2 relative overflow-hidden",
											children: [
												/* @__PURE__ */ jsx("div", {
													className: "absolute top-0 right-0 p-4 opacity-5 pointer-events-none",
													children: /* @__PURE__ */ jsx(Building2, { className: "w-16 h-16" })
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between relative z-10",
													children: [/* @__PURE__ */ jsxs("span", {
														className: "font-bold text-slate-900 dark:text-white flex items-center gap-2",
														children: [
															/* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-slate-500" }),
															"Reply from ",
															rev.businessReply.authorName
														]
													}), /* @__PURE__ */ jsx("span", {
														className: "text-xs font-medium text-slate-400",
														children: rev.businessReply.createdAt
													})]
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-slate-600 dark:text-zinc-300 leading-relaxed relative z-10",
													children: rev.businessReply.content
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-sm text-slate-500 dark:text-zinc-400",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-4",
												children: [/* @__PURE__ */ jsxs("button", {
													onClick: () => onVoteHelpful(rev.id, "up"),
													className: "flex items-center gap-1.5 hover:text-blue-600 transition font-medium text-slate-600 dark:text-zinc-300",
													children: [/* @__PURE__ */ jsx(ThumbsUp, { className: "w-4 h-4" }), /* @__PURE__ */ jsxs("span", { children: [
														"Helpful (",
														rev.helpfulCount,
														")"
													] })]
												}), /* @__PURE__ */ jsxs("button", {
													onClick: () => handleTranslateReview(rev.id),
													className: "flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-zinc-300 transition font-medium px-3 py-1.5",
													children: [/* @__PURE__ */ jsx(Languages, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Translate" })]
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("button", {
													onClick: () => setReplyingReviewId(replyingReviewId === rev.id ? null : rev.id),
													className: "hover:text-slate-700 dark:hover:text-zinc-300 transition font-medium px-3 py-1.5",
													children: "Reply"
												}), /* @__PURE__ */ jsx("button", {
													onClick: () => onFlagReview(rev.id),
													className: "hover:text-rose-600 dark:hover:text-rose-400 transition",
													title: "Report review",
													children: /* @__PURE__ */ jsx(Flag, { className: "w-4 h-4" })
												})]
											})]
										}),
										replyingReviewId === rev.id && /* @__PURE__ */ jsxs("div", {
											className: "mt-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 space-y-3",
											children: [/* @__PURE__ */ jsx("textarea", {
												value: replyText,
												onChange: (e) => setReplyText(e.target.value),
												placeholder: "Write an official response on behalf of the business...",
												rows: 3,
												className: "w-full p-3 text-sm rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow resize-none"
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex justify-end gap-3",
												children: [/* @__PURE__ */ jsx("button", {
													onClick: () => setReplyingReviewId(null),
													className: "px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition",
													children: "Cancel"
												}), /* @__PURE__ */ jsx("button", {
													onClick: () => handlePostReply(rev.id),
													className: "px-4 py-2 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors",
													children: "Post Reply"
												})]
											})]
										})
									]
								}, rev.id))]
							}),
							activeTab === "ai_insights" && /* @__PURE__ */ jsxs("div", {
								className: "p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-8",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30",
											children: /* @__PURE__ */ jsx(Sparkles, { className: "w-6 h-6" })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
											className: "text-xl font-extrabold text-slate-900 dark:text-white",
											children: "AI Synthesis Report"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-sm text-slate-500 font-medium",
											children: "Real-time analysis extracted from all customer feedback"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-6 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed relative overflow-hidden",
										children: [
											/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-1.5 h-full bg-blue-500" }),
											/* @__PURE__ */ jsx("span", {
												className: "font-bold text-blue-600 text-base block mb-2",
												children: "Executive Summary:"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-base",
												children: business.aiSummary?.overallSentiment || "Customer reviews reflect strong satisfaction with service reliability and team responsiveness."
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-6",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800/20",
											children: [/* @__PURE__ */ jsxs("h4", {
												className: "text-sm font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2",
												children: [/* @__PURE__ */ jsx(ThumbsUp, { className: "w-4 h-4" }), " Top Strengths"]
											}), /* @__PURE__ */ jsx("ul", {
												className: "space-y-3 text-sm",
												children: (business.aiSummary?.positiveHighlights || ["Fast response time", "High reliability"]).map((item, idx) => /* @__PURE__ */ jsxs("li", {
													className: "text-emerald-900 dark:text-emerald-100 flex items-start gap-2.5",
													children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-500 shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "font-medium pt-0.5",
														children: item
													})]
												}, idx))
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "bg-rose-50/50 dark:bg-rose-900/10 p-6 rounded-xl border border-rose-100 dark:border-rose-800/20",
											children: [/* @__PURE__ */ jsxs("h4", {
												className: "text-sm font-extrabold uppercase tracking-widest text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2",
												children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4" }), " Areas To Improve"]
											}), /* @__PURE__ */ jsx("ul", {
												className: "space-y-3 text-sm",
												children: (business.aiSummary?.criticalPoints || ["Pricing tiers for high bandwidth"]).map((item, idx) => /* @__PURE__ */ jsxs("li", {
													className: "text-rose-900 dark:text-rose-100 flex items-start gap-2.5",
													children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-rose-500 shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "font-medium pt-0.5",
														children: item
													})]
												}, idx))
											})]
										})]
									})
								]
							}),
							activeTab === "competitors" && /* @__PURE__ */ jsxs("div", {
								className: "p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-8",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "border-b border-slate-100 dark:border-zinc-800 pb-6",
										children: [/* @__PURE__ */ jsxs("h3", {
											className: "text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2",
											children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-6 h-6 text-blue-500" }), "AI Competitor Benchmark Tool"]
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-sm text-slate-500 mt-1",
											children: [
												"Compare ",
												business.name,
												" side-by-side with industry rivals"
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800",
										children: [/* @__PURE__ */ jsxs("select", {
											value: selectedCompetitorId,
											onChange: (e) => setSelectedCompetitorId(e.target.value),
											className: "flex-1 p-3 text-sm font-medium rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30",
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
											className: "px-6 py-3 text-sm font-bold rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 disabled:opacity-50 transition-colors shrink-0 shadow-sm",
											children: isLoadingCompetitorReport ? "Analyzing..." : "Generate Benchmark"
										})]
									}),
									competitorReport && /* @__PURE__ */ jsxs("div", {
										className: "p-6 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 space-y-6 text-sm",
										children: [
											/* @__PURE__ */ jsxs("h4", {
												className: "font-extrabold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-zinc-700 pb-4",
												children: [
													competitorReport.targetBusinessName,
													" ",
													/* @__PURE__ */ jsx("span", {
														className: "text-slate-400 mx-2 text-sm font-normal",
														children: "vs"
													}),
													" ",
													competitorReport.competitorName
												]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-700 dark:text-zinc-300 leading-relaxed text-base",
												children: competitorReport.comparisonSummary
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30",
													children: [/* @__PURE__ */ jsxs("span", {
														className: "font-bold text-emerald-700 dark:text-emerald-400 text-base block mb-3 flex items-center gap-2",
														children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5" }), " Key Advantages"]
													}), /* @__PURE__ */ jsx("ul", {
														className: "space-y-2 text-emerald-900 dark:text-emerald-100",
														children: competitorReport.keyAdvantages.map((a, i) => /* @__PURE__ */ jsxs("li", {
															className: "flex gap-2",
															children: [/* @__PURE__ */ jsx("span", {
																className: "text-emerald-500",
																children: "•"
															}), a]
														}, i))
													})]
												}), /* @__PURE__ */ jsxs("div", {
													className: "p-5 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30",
													children: [/* @__PURE__ */ jsxs("span", {
														className: "font-bold text-amber-700 dark:text-amber-400 text-base block mb-3 flex items-center gap-2",
														children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5" }), " Improvement Areas"]
													}), /* @__PURE__ */ jsx("ul", {
														className: "space-y-2 text-amber-900 dark:text-amber-100",
														children: competitorReport.areasOfImprovement.map((a, i) => /* @__PURE__ */ jsxs("li", {
															className: "flex gap-2",
															children: [/* @__PURE__ */ jsx("span", {
																className: "text-amber-500",
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
								className: "p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-8",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-xl font-extrabold text-slate-900 dark:text-white mb-4",
									children: ["About ", business.name]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-sm text-slate-600 dark:text-zinc-400 leading-relaxed",
									children: business.description
								})] }), business.products && business.products.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
									className: "text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-zinc-800 pb-3",
									children: "Products & Services"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: business.products.map((p) => /* @__PURE__ */ jsxs("div", {
										className: "p-5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-800 space-y-2 hover:shadow-md transition-shadow",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "font-extrabold text-slate-900 dark:text-white flex justify-between items-start gap-4",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-base",
												children: p.name
											}), /* @__PURE__ */ jsx("span", {
												className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-mono text-xs px-2 py-1 rounded-md",
												children: p.price
											})]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-slate-500 dark:text-zinc-400 text-sm leading-relaxed pt-1",
											children: p.description
										})]
									}, p.id))
								})] })]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-amber-500" }), "Category Ratings"]
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-4 text-sm font-medium",
								children: business.categoryAverages && Object.entries(business.categoryAverages).map(([key, val]) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-slate-700 dark:text-zinc-300 capitalize mb-2",
									children: [/* @__PURE__ */ jsx("span", { children: key }), /* @__PURE__ */ jsxs("span", {
										className: "text-slate-900 dark:text-white font-bold",
										children: [
											Number(val).toFixed(1),
											" ",
											/* @__PURE__ */ jsx("span", {
												className: "text-slate-400 font-normal",
												children: "/ 5.0"
											})
										]
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "w-full h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden relative",
									children: /* @__PURE__ */ jsx("div", {
										className: "absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full",
										style: { width: `${(Number(val) || 0) / 5 * 100}%` }
									})
								})] }, key))
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-2xl bg-slate-900 text-white shadow-xl space-y-5",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-sm font-bold uppercase tracking-widest text-white/80 mb-2",
									children: "Contact & Details"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "p-2 rounded-lg bg-white/10 shrink-0",
										children: /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-white" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "pt-1.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-xs text-white/60 font-medium mb-0.5",
											children: "Phone"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-sm font-medium",
											children: business.phone
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "p-2 rounded-lg bg-white/10 shrink-0",
										children: /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-white" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "pt-1.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-xs text-white/60 font-medium mb-0.5",
											children: "Address"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-sm font-medium leading-relaxed",
											children: business.address
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "p-2 rounded-lg bg-white/10 shrink-0",
										children: /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-white" })
									}), /* @__PURE__ */ jsxs("div", {
										className: "pt-1.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-xs text-white/60 font-medium mb-0.5",
											children: "Opening Hours"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-sm font-medium leading-relaxed",
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
