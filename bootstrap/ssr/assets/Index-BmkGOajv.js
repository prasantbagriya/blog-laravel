import { t as Navbar } from "./GlobalNavbar-BeiSnBQi.js";
import { t as BlogFooter } from "./BlogFooter-iDkZqha6.js";
import { t as INITIAL_CATEGORIES } from "./mockData-WYrlIyrH.js";
import { HeroSection } from "./HeroSection-B-WL49tl.js";
import { CategoryGrid } from "./CategoryGrid-ag_AA1Xa.js";
import { BusinessCard } from "./BusinessCard-BV0kVSA6.js";
import { BusinessProfileView } from "./BusinessProfileView-CJol6CFI.js";
import { BusinessDashboard } from "./BusinessDashboard-C1JazekU.js";
import { ModeratorPanel } from "./ModeratorPanel-ChuM8IO4.js";
import { Head, Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useEffect, useState } from "react";
import { ChevronDown, Grid3X3, HelpCircle, MessageSquare } from "lucide-react";
//#region resources/js/Pages/Reviews/Index.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
var SubmitReviewModal = React.lazy(() => import("./SubmitReviewModal-cV6ol9sx.js").then((module) => ({ default: module.SubmitReviewModal })));
var CreateBusinessModal = React.lazy(() => import("./CreateBusinessModal-DcLw8nnK.js").then((module) => ({ default: module.CreateBusinessModal })));
var AiSearchModal = React.lazy(() => import("./AiSearchModal-CIqeFegw.js").then((module) => ({ default: module.AiSearchModal })));
var ApiDocsModal = React.lazy(() => import("./ApiDocsModal-Cnw480tN.js").then((module) => ({ default: module.ApiDocsModal })));
var ReviewsFAQ = () => {
	const [openIndex, setOpenIndex] = useState(0);
	return /* @__PURE__ */ jsxs("section", {
		className: "py-16 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800/60 relative overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none",
			children: [/* @__PURE__ */ jsx("div", { className: "absolute -top-24 -right-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 animate-blob" }), /* @__PURE__ */ jsx("div", { className: "absolute top-48 -left-24 w-72 h-72 bg-amber-100 dark:bg-amber-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 animate-blob animation-delay-2000" })]
		}), /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-5 lg:sticky lg:top-32 space-y-8",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-6",
							children: [/* @__PURE__ */ jsx(MessageSquare, { className: "w-4 h-4" }), " Got Questions?"]
						}),
						/* @__PURE__ */ jsxs("h2", {
							className: "text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight",
							children: ["Frequently Asked ", /* @__PURE__ */ jsx("span", {
								className: "text-blue-500",
								children: "Questions"
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed",
							children: "Everything you need to know about our verified business directory, reviews, and Trust Scores."
						})
					] }), /* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm flex items-start gap-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0",
							children: /* @__PURE__ */ jsx(HelpCircle, { className: "w-6 h-6 text-amber-600 dark:text-amber-400" })
						}), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("h3", {
								className: "font-bold text-slate-900 dark:text-white mb-1",
								children: "Still have questions?"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-slate-500 dark:text-zinc-400 mb-4",
								children: "Contact our team and we'll help you find the right answers."
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/contact",
								className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]",
								children: "Contact Support"
							})
						] })]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "lg:col-span-7 space-y-4",
					children: [
						{
							question: "How are businesses verified on this platform?",
							answer: "Every business listed goes through our editorial verification process. We cross-check business registration details, customer invoices, and use AI fraud detection to assign a Trust Score from 0–100. Only genuine businesses with real customer interactions make it to our catalog."
						},
						{
							question: "Can I trust the reviews on this platform?",
							answer: "Yes. Our reviews are submitted by verified users who have actually interacted with the business. We use AI-powered review analysis to detect fake or biased reviews and remove them before they're published."
						},
						{
							question: "How do I write a review for a business?",
							answer: "Simply search for the business, visit its profile page, and click 'Write a Review'. You'll need to be logged in. Rate the business across multiple dimensions and share your experience in detail — the more specific, the more helpful."
						},
						{
							question: "How can a business owner manage their listing?",
							answer: "Business owners can claim their listing by creating an account and verifying ownership. Once verified, you can update your business information, respond to reviews, add photos, and access your Business Dashboard for analytics."
						},
						{
							question: "What does the Trust Score mean?",
							answer: "The Trust Score (0–100) is our proprietary rating that combines verified review scores, AI fraud analysis, editorial assessments, and customer invoice data. A score above 80 indicates a highly trustworthy and well-performing business."
						}
					].map((faq, index) => {
						const isOpen = openIndex === index;
						return /* @__PURE__ */ jsxs("div", {
							className: `group border rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? "bg-white dark:bg-zinc-900 shadow-xl shadow-blue-900/5 border-blue-200 dark:border-blue-500/30 ring-1 ring-blue-100 dark:ring-blue-500/20" : "bg-white/60 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-white dark:hover:bg-zinc-900 backdrop-blur-sm"}`,
							children: [/* @__PURE__ */ jsxs("button", {
								className: "w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none focus:ring-0 ring-0 border-none bg-transparent cursor-pointer",
								onClick: () => setOpenIndex(isOpen ? null : index),
								"aria-expanded": isOpen,
								children: [/* @__PURE__ */ jsx("span", {
									className: `font-bold text-base sm:text-lg pr-4 transition-colors duration-300 ${isOpen ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"}`,
									children: faq.question
								}), /* @__PURE__ */ jsx("div", {
									className: `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? "bg-blue-600 text-white rotate-180 shadow-md shadow-blue-600/20" : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-500"}`,
									children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5" })
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: `overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`,
								children: /* @__PURE__ */ jsxs("div", {
									className: "px-6 pb-6",
									children: [/* @__PURE__ */ jsx("div", { className: "w-full h-px bg-slate-200 dark:bg-zinc-700 mb-5" }), /* @__PURE__ */ jsx("p", {
										className: "text-slate-600 dark:text-zinc-400 leading-relaxed text-base m-0",
										children: faq.answer
									})]
								})
							})]
						}, index);
					})
				})]
			})
		})]
	});
};
function App({ auth, initialView = "home", initialCategorySlug = "all", businessData = null }) {
	const authUser = auth?.user;
	const [currentRole, setCurrentRole] = useState(authUser?.role || "visitor");
	const [activeView, setActiveView] = useState(initialView);
	const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategorySlug);
	const [selectedBusinessSlug, setSelectedBusinessSlug] = useState(businessData ? businessData.slug : null);
	const [viewedBusiness, setViewedBusiness] = useState(businessData);
	const [showSearchModal, setShowSearchModal] = useState(false);
	const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
	const [showCreateBusinessModal, setShowCreateBusinessModal] = useState(false);
	const [showEditBusinessModal, setShowEditBusinessModal] = useState(false);
	const [showApiDocsModal, setShowApiDocsModal] = useState(false);
	const [preselectedBusinessId, setPreselectedBusinessId] = useState(void 0);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [categories, setCategories] = useState(INITIAL_CATEGORIES);
	const [businesses, setBusinesses] = useState([]);
	const [currentReviews, setCurrentReviews] = useState([]);
	const [moderationQueue, setModerationQueue] = useState([]);
	const [campaigns, setCampaigns] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const fetchBusinesses = async () => {
		try {
			const data = await (await fetch("/api/businesses", { headers: { "Accept": "application/json" } })).json();
			if (Array.isArray(data)) setBusinesses(data);
			else console.error("Expected array, got:", data);
		} catch (err) {
			console.error("Error fetching businesses:", err);
		} finally {
			setIsLoading(false);
		}
	};
	const fetchReviewsForBusiness = async (slugOrId) => {
		try {
			const data = await (await fetch(`/api/businesses/${slugOrId}/reviews`, { headers: { "Accept": "application/json" } })).json();
			if (Array.isArray(data)) setCurrentReviews(data);
		} catch (err) {
			console.error("Error fetching reviews:", err);
		}
	};
	const fetchModerationQueue = async () => {
		try {
			const data = await (await fetch("/api/moderation/queue", { headers: { "Accept": "application/json" } })).json();
			if (Array.isArray(data)) setModerationQueue(data);
		} catch (err) {
			console.error("Error fetching moderation queue:", err);
		}
	};
	useEffect(() => {
		fetchBusinesses();
		fetchModerationQueue();
	}, []);
	useEffect(() => {
		setActiveView(initialView);
		setSelectedCategorySlug(initialCategorySlug);
		setSelectedBusinessSlug(businessData ? businessData.slug : null);
		setViewedBusiness(businessData);
	}, [
		initialView,
		initialCategorySlug,
		businessData
	]);
	useEffect(() => {
		if (selectedBusinessSlug) fetchReviewsForBusiness(selectedBusinessSlug);
	}, [selectedBusinessSlug]);
	const handleSelectBusiness = (slug) => {
		const catSlug = businesses.find((b) => b.slug === slug || b.id === slug)?.category || "coaching-institutes";
		router.visit(`/reviews/${catSlug}/${slug}`);
	};
	const handleSelectCategory = (slug) => {
		if (slug === "all") router.visit("/reviews");
		else router.visit(`/reviews/${slug}`);
	};
	const handleOpenWriteReview = (businessId) => {
		setPreselectedBusinessId(businessId);
		setShowWriteReviewModal(true);
	};
	const handleSubmitReview = async (reviewData) => {
		try {
			const data = await (await fetch("/api/reviews", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(reviewData)
			})).json();
			if (data.review) {
				await fetchBusinesses();
				if (selectedBusinessSlug) await fetchReviewsForBusiness(selectedBusinessSlug);
				else setCurrentReviews((prev) => [data.review, ...prev]);
			}
		} catch (err) {
			console.error("Error submitting review:", err);
		}
	};
	const handleVoteHelpful = async (reviewId, direction) => {
		try {
			const updated = await (await fetch(`/api/reviews/${reviewId}/vote`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ direction })
			})).json();
			setCurrentReviews((prev) => prev.map((r) => r.id === reviewId ? {
				...r,
				helpfulCount: updated.helpfulCount,
				unhelpfulCount: updated.unhelpfulCount
			} : r));
		} catch (err) {
			console.error("Error voting on review:", err);
		}
	};
	const handleFlagReview = async (reviewId) => {
		try {
			await fetch(`/api/reviews/${reviewId}/flag`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ reason: "Flagged for Community Guidelines Inspection" })
			});
			alert("Review submitted to AI moderation queue!");
			fetchModerationQueue();
		} catch (err) {
			console.error("Error flagging review:", err);
		}
	};
	const handleAddReply = async (reviewId, replyText) => {
		try {
			const updated = await (await fetch(`/api/reviews/${reviewId}/reply`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					authorName: "Official Business Representative",
					authorRole: "Manager",
					content: replyText
				})
			})).json();
			setCurrentReviews((prev) => prev.map((r) => r.id === reviewId ? {
				...r,
				businessReply: updated.businessReply
			} : r));
		} catch (err) {
			console.error("Error adding reply:", err);
		}
	};
	const handleModeratorAction = async (reviewId, action, notes) => {
		try {
			await fetch("/api/moderation/action", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					reviewId,
					action,
					notes
				})
			});
			fetchModerationQueue();
			fetchBusinesses();
		} catch (err) {
			console.error("Error processing moderation action:", err);
		}
	};
	const directoryBusinesses = businesses.filter((b) => {
		if (selectedCategorySlug !== "all" && b.category !== selectedCategorySlug) return false;
		return true;
	});
	const selectedBusinessObject = businesses.find((b) => b.slug === selectedBusinessSlug || b.id === selectedBusinessSlug) || businesses[0];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { children: activeView === "profile" && viewedBusiness ? /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("title", { children: `${viewedBusiness.name} Reviews & Trust Score | TrustPulse` }),
		/* @__PURE__ */ jsx("meta", {
			name: "description",
			content: `Read ${viewedBusiness.reviewCount} verified reviews for ${viewedBusiness.name}. Trust score: ${viewedBusiness.trustScore}/100. ${viewedBusiness.description}`
		}),
		/* @__PURE__ */ jsx("script", {
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "LocalBusiness",
				"name": viewedBusiness.name,
				"image": viewedBusiness.logo,
				"description": viewedBusiness.description,
				"aggregateRating": {
					"@type": "AggregateRating",
					"ratingValue": viewedBusiness.rating,
					"reviewCount": viewedBusiness.reviewCount,
					"bestRating": 5,
					"worstRating": 1
				}
			})
		})
	] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("title", { children: "TrustPulse | Verified AI Software & SaaS Reviews" }), /* @__PURE__ */ jsx("meta", {
		name: "description",
		content: "Discover verified reviews for SaaS, AI tools, and online businesses. Real customer feedback powered by AI fraud detection."
	})] }) }), /* @__PURE__ */ jsx("div", {
		className: `trustpulse-app min-h-screen flex flex-col font-sans transition-colors ${isDarkMode ? "dark bg-zinc-950 text-white" : "bg-white text-zinc-900"}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex-1 overflow-auto",
			children: [
				/* @__PURE__ */ jsx(Navbar, {}),
				/* @__PURE__ */ jsxs("main", {
					className: "min-h-screen",
					children: [
						activeView === "home" && /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx(HeroSection, {
								onSearchSubmit: (q) => {
									window.location.href = `/search?q=${encodeURIComponent(q)}&tab=businesses`;
								},
								onOpenAiAssistant: () => setShowSearchModal(true),
								categories,
								onSelectCategory: handleSelectCategory,
								trendingBusinesses: businesses,
								onSelectBusiness: handleSelectBusiness
							}),
							/* @__PURE__ */ jsx(CategoryGrid, {
								categories,
								onSelectCategory: handleSelectCategory
							}),
							/* @__PURE__ */ jsx("section", {
								className: "pt-16 pb-0 bg-slate-50 border-y border-slate-200 dark:bg-zinc-900 dark:border-zinc-800",
								children: /* @__PURE__ */ jsxs("div", {
									className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-end justify-between mb-10",
											children: [/* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("div", {
													className: "text-amber-500 text-sm font-bold uppercase tracking-wider mb-1",
													children: "Highest Trust Rating"
												}),
												/* @__PURE__ */ jsx("h2", {
													className: "text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
													children: "Verified Top Rated Companies"
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-slate-500 mt-2 text-base md:text-lg",
													children: "Discover the most trusted institutions based on verified student reviews."
												})
											] }), /* @__PURE__ */ jsxs(Link, {
												href: "/reviews",
												className: "inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors",
												children: [
													"View All Directory (",
													businesses.length,
													") →"
												]
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
											children: businesses.slice(0, 6).map((biz) => /* @__PURE__ */ jsx(BusinessCard, {
												business: biz,
												onSelectBusiness: handleSelectBusiness,
												onOpenWriteReview: handleOpenWriteReview
											}, biz.id))
										}),
										/* @__PURE__ */ jsx("div", {
											className: "mt-8 pb-8 text-center md:hidden",
											children: /* @__PURE__ */ jsxs(Link, {
												href: "/reviews",
												className: "inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors",
												children: [
													"View All Directory (",
													businesses.length,
													") →"
												]
											})
										})
									]
								})
							})
						] }),
						activeView === "directory" && /* @__PURE__ */ jsxs("div", {
							className: "w-full flex flex-col min-h-screen",
							children: [/* @__PURE__ */ jsxs("section", {
								className: "relative w-full pt-32 pb-16 bg-slate-900 overflow-hidden",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "absolute inset-0 z-0 opacity-40 bg-cover bg-center",
										style: {
											backgroundImage: `url('/uploads/background.webp')`,
											filter: "blur(8px)"
										}
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 bg-gradient-to-b from-slate-900/80 via-slate-900/95 to-slate-950" }),
									/* @__PURE__ */ jsx("div", {
										className: "relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex flex-col items-center text-center",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase border border-blue-500/30 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
													children: [/* @__PURE__ */ jsx(Grid3X3, { className: "w-4 h-4" }), "Verified Directory"]
												}),
												/* @__PURE__ */ jsx("h1", {
													className: "text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight",
													children: selectedCategorySlug === "all" ? "Global Business Directory" : categories.find((c) => c.slug === selectedCategorySlug)?.name || "Category Directory"
												}),
												/* @__PURE__ */ jsxs("p", {
													className: "text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed",
													children: [
														"Explore ",
														/* @__PURE__ */ jsx("span", {
															className: "font-bold text-white",
															children: directoryBusinesses.length
														}),
														" highly-rated companies, meticulously evaluated by real customers and AI fraud detection."
													]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "w-full flex flex-wrap justify-center gap-3",
													children: [/* @__PURE__ */ jsx("button", {
														onClick: () => setSelectedCategorySlug("all"),
														className: `px-5 py-2.5 rounded-full font-bold transition-all duration-300 text-sm shadow-sm ${selectedCategorySlug === "all" ? "bg-blue-600 text-white shadow-blue-600/30 scale-105 border-none outline-none focus:outline-none ring-0 focus:ring-0" : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50 backdrop-blur-sm"}`,
														children: "All Categories"
													}), categories.map((c) => /* @__PURE__ */ jsx("button", {
														onClick: () => setSelectedCategorySlug(c.slug),
														className: `px-5 py-2.5 rounded-full font-bold transition-all duration-300 text-sm shadow-sm ${selectedCategorySlug === c.slug ? "bg-blue-600 text-white shadow-blue-600/30 scale-105 border-none outline-none focus:outline-none ring-0 focus:ring-0" : "bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50 backdrop-blur-sm"}`,
														children: c.name
													}, c.id))]
												})
											]
										})
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex-grow py-16 bg-slate-50 dark:bg-zinc-950",
								children: /* @__PURE__ */ jsx("div", {
									className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
									children: /* @__PURE__ */ jsx("div", {
										className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
										children: directoryBusinesses.map((biz) => /* @__PURE__ */ jsx(BusinessCard, {
											business: biz,
											onSelectBusiness: handleSelectBusiness,
											onOpenWriteReview: handleOpenWriteReview
										}, biz.id))
									})
								})
							})]
						}),
						activeView === "profile" && selectedBusinessObject && /* @__PURE__ */ jsx(BusinessProfileView, {
							business: selectedBusinessObject,
							reviews: currentReviews,
							allBusinesses: businesses,
							onOpenWriteReview: handleOpenWriteReview,
							onOpenEditBusiness: () => setShowEditBusinessModal(true),
							onVoteHelpful: handleVoteHelpful,
							onFlagReview: handleFlagReview,
							onAddReply: handleAddReply,
							authUser
						}),
						activeView === "dashboard" && selectedBusinessObject && /* @__PURE__ */ jsx(BusinessDashboard, {
							business: selectedBusinessObject,
							reviews: currentReviews,
							campaigns,
							allBusinesses: businesses,
							onAddReply: handleAddReply
						}),
						activeView === "moderation" && /* @__PURE__ */ jsx(ModeratorPanel, {
							moderationQueue,
							onModeratorAction: handleModeratorAction
						})
					]
				}),
				/* @__PURE__ */ jsxs(Suspense, {
					fallback: null,
					children: [
						showSearchModal && /* @__PURE__ */ jsx(AiSearchModal, {
							onClose: () => setShowSearchModal(false),
							onSelectBusiness: handleSelectBusiness
						}),
						showWriteReviewModal && /* @__PURE__ */ jsx(SubmitReviewModal, {
							businesses,
							preselectedBusinessId,
							onClose: () => setShowWriteReviewModal(false),
							onSubmit: handleSubmitReview
						}),
						showCreateBusinessModal && /* @__PURE__ */ jsx(CreateBusinessModal, {
							categories,
							onClose: () => setShowCreateBusinessModal(false),
							onSubmitSuccess: (newBusiness) => {
								setBusinesses([newBusiness, ...businesses]);
								setShowCreateBusinessModal(false);
								router.visit(`/reviews/${newBusiness.category}/${newBusiness.slug}`);
							}
						}),
						showEditBusinessModal && selectedBusinessObject && /* @__PURE__ */ jsx(CreateBusinessModal, {
							categories,
							onClose: () => setShowEditBusinessModal(false),
							onSubmitSuccess: (updatedBusiness) => {
								setShowEditBusinessModal(false);
								const index = businesses.findIndex((b) => b.id === updatedBusiness.id);
								if (index !== -1) {
									const newBusinesses = [...businesses];
									newBusinesses[index] = updatedBusiness;
									setBusinesses(newBusinesses);
									if (viewedBusiness?.id === updatedBusiness.id) setViewedBusiness(updatedBusiness);
								}
							},
							initialData: selectedBusinessObject,
							isEdit: true
						}),
						showApiDocsModal && /* @__PURE__ */ jsx(ApiDocsModal, { onClose: () => setShowApiDocsModal(false) })
					]
				}),
				/* @__PURE__ */ jsx(ReviewsFAQ, {}),
				/* @__PURE__ */ jsx(BlogFooter, {})
			]
		})
	})] });
}
//#endregion
export { App as default };
