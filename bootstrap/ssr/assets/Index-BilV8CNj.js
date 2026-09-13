import { n as Navbar, t as BlogFooter } from "./BlogFooter-CC6FshYA.js";
import { HeroSection } from "./HeroSection-mMxHwLZj.js";
import { CategoryGrid } from "./CategoryGrid-D71pabHX.js";
import { BusinessCard } from "./BusinessCard-BBb6DzZ2.js";
import { BusinessProfileView } from "./BusinessProfileView-C5Kh_AO5.js";
import { SubmitReviewModal } from "./SubmitReviewModal-cV6ol9sx.js";
import { CreateBusinessModal } from "./CreateBusinessModal-DcLw8nnK.js";
import { BusinessDashboard } from "./BusinessDashboard-C1JazekU.js";
import { ModeratorPanel } from "./ModeratorPanel-ChuM8IO4.js";
import { AiSearchModal } from "./AiSearchModal-CfFlaLO8.js";
import { ApiDocsModal } from "./ApiDocsModal-Cnw480tN.js";
import { Head, Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Pages/Reviews/data/mockData.ts
var INITIAL_CATEGORIES = [
	{
		id: "cat-1",
		name: "SaaS & Cloud Platforms",
		slug: "saas",
		iconName: "Cloud",
		description: "Software-as-a-service, productivity tools, enterprise CRM, and cloud infrastructures.",
		businessCount: 1420,
		subcategories: [
			"CRM",
			"Project Management",
			"Analytics",
			"DevOps",
			"Security"
		]
	},
	{
		id: "cat-2",
		name: "AI Tools & Models",
		slug: "ai-tools",
		iconName: "Sparkles",
		description: "Generative AI, code assistants, LLM wrappers, speech synthesis, and image generators.",
		businessCount: 980,
		subcategories: [
			"Text Generation",
			"Image AI",
			"Voice Synthetic",
			"Code Assistants",
			"AI Agents"
		]
	},
	{
		id: "cat-3",
		name: "E-commerce & Retail",
		slug: "ecommerce",
		iconName: "ShoppingBag",
		description: "Online stores, direct-to-consumer brands, fashion hubs, and marketplace merchants.",
		businessCount: 3410,
		subcategories: [
			"Electronics",
			"Fashion",
			"Home & Living",
			"Beauty",
			"Subscription Boxes"
		]
	},
	{
		id: "cat-4",
		name: "Hospitals & Healthcare",
		slug: "hospitals",
		iconName: "Hospital",
		description: "Medical centers, telehealth platforms, dental clinics, and specialized surgery hubs.",
		businessCount: 840,
		subcategories: [
			"Telehealth",
			"Dental Clinics",
			"Diagnostics",
			"Speciality Care",
			"Wellness"
		]
	},
	{
		id: "cat-5",
		name: "Web Hosting & Servers",
		slug: "hosting",
		iconName: "Server",
		description: "VPS providers, managed WordPress hosting, domain registrars, and CDN services.",
		businessCount: 530,
		subcategories: [
			"Cloud VPS",
			"Managed WordPress",
			"Dedicated Servers",
			"Domain Registrars"
		]
	},
	{
		id: "cat-6",
		name: "Coaching & Institutes",
		slug: "coaching",
		iconName: "GraduationCap",
		description: "EdTech platforms, coding bootcamps, executive coaching, and competitive exam hubs.",
		businessCount: 1150,
		subcategories: [
			"Coding Bootcamps",
			"Test Prep",
			"Executive Coaching",
			"Skill Academies"
		]
	},
	{
		id: "cat-7",
		name: "Hotels & Hospitality",
		slug: "hotels",
		iconName: "Building",
		description: "Boutique hotels, luxury resorts, vacation rentals, and business travel stays.",
		businessCount: 2190,
		subcategories: [
			"Luxury Resorts",
			"Boutique Hotels",
			"Serviced Apartments",
			"Budget Stays"
		]
	},
	{
		id: "cat-8",
		name: "Fintech & Banking",
		slug: "finance",
		iconName: "CreditCard",
		description: "Digital banks, payment gateways, personal finance apps, and investment platforms.",
		businessCount: 1670,
		subcategories: [
			"Payment Gateways",
			"Neobanks",
			"Investment Apps",
			"Lending Services"
		]
	}
];
//#endregion
//#region resources/js/Pages/Reviews/Index.tsx
/**
* @license
* SPDX-License-Identifier: Apache-2.0
*/
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
									setShowSearchModal(true);
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
								className: "py-16 bg-slate-50 border-y border-slate-200 dark:bg-zinc-900 dark:border-zinc-800",
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
												className: "block w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white text-center font-medium py-2.5 rounded-md transition-colors text-sm shadow-md",
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
											className: "mt-8 text-center md:hidden",
											children: /* @__PURE__ */ jsxs(Link, {
												href: "/reviews",
												className: "block w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white text-center font-medium py-2.5 rounded-md transition-colors text-sm shadow-md",
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
							className: "py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
									className: "text-2xl font-extrabold text-zinc-900 dark:text-white",
									children: selectedCategorySlug === "all" ? "All Verified Businesses Directory" : categories.find((c) => c.slug === selectedCategorySlug)?.name || "Category Directory"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-zinc-500 mt-1",
									children: [
										"Showing ",
										directoryBusinesses.length,
										" verified companies evaluated by real customer feedback."
									]
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 overflow-x-auto max-w-full pb-1 text-xs",
									children: [/* @__PURE__ */ jsxs("button", {
										onClick: () => setSelectedCategorySlug("all"),
										className: `px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${selectedCategorySlug === "all" ? "bg-emerald-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"}`,
										children: [
											"All (",
											businesses.length,
											")"
										]
									}), categories.map((c) => /* @__PURE__ */ jsx("button", {
										onClick: () => setSelectedCategorySlug(c.slug),
										className: `px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${selectedCategorySlug === c.slug ? "bg-emerald-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"}`,
										children: c.name
									}, c.id))]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
								children: directoryBusinesses.map((biz) => /* @__PURE__ */ jsx(BusinessCard, {
									business: biz,
									onSelectBusiness: handleSelectBusiness,
									onOpenWriteReview: handleOpenWriteReview
								}, biz.id))
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
				showApiDocsModal && /* @__PURE__ */ jsx(ApiDocsModal, { onClose: () => setShowApiDocsModal(false) }),
				/* @__PURE__ */ jsx(BlogFooter, {})
			]
		})
	})] });
}
//#endregion
export { App as default };
