import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BarChart3, Check, Code2, Copy, QrCode, Sparkles, Star, TrendingUp } from "lucide-react";
//#region resources/js/Pages/Reviews/components/BusinessDashboard.tsx
var BusinessDashboard = ({ business, reviews, campaigns, allBusinesses, onAddReply }) => {
	const [activeTab, setActiveTab] = useState("overview");
	const [selectedReviewIdForReply, setSelectedReviewIdForReply] = useState("");
	const [selectedTone, setSelectedTone] = useState("Professional & Empathetic");
	const [generatedAiReply, setGeneratedAiReply] = useState("");
	const [isGeneratingReply, setIsGeneratingReply] = useState(false);
	const [widgetConfig, setWidgetConfig] = useState({
		theme: "light",
		style: "badge_horizontal",
		showTrustScore: true,
		showStarRating: true,
		primaryColor: "#0052FF",
		badgeRadius: "md"
	});
	const [copiedCode, setCopiedCode] = useState(false);
	const unrepliedReviews = reviews.filter((r) => r.businessId === business.id && !r.businessReply);
	const handleGenerateAiReply = async () => {
		const rev = reviews.find((r) => r.id === selectedReviewIdForReply);
		if (!rev) return;
		setIsGeneratingReply(true);
		try {
			const data = await (await fetch("/api/ai/generate-reply", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					reviewTitle: rev.title,
					reviewDescription: rev.description,
					rating: rev.rating,
					tone: selectedTone,
					businessName: business.name
				})
			})).json();
			setGeneratedAiReply(data.reply || "");
		} catch (err) {
			console.error("Error generating AI reply:", err);
		} finally {
			setIsGeneratingReply(false);
		}
	};
	const handlePostGeneratedReply = () => {
		if (selectedReviewIdForReply && generatedAiReply.trim()) {
			onAddReply(selectedReviewIdForReply, generatedAiReply.trim());
			setGeneratedAiReply("");
			setSelectedReviewIdForReply("");
		}
	};
	const getEmbedCode = () => {
		return `<iframe src="https://trustpulse.ai/embed/widget?business=${business.slug}&style=${widgetConfig.style}&theme=${widgetConfig.theme}" width="360" height="120" frameborder="0" scrolling="no"></iframe>`;
	};
	const handleCopyCode = () => {
		navigator.clipboard.writeText(getEmbedCode());
		setCopiedCode(true);
		setTimeout(() => setCopiedCode(false), 2e3);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 transition-colors",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsx("img", {
							src: business.logo,
							alt: business.name,
							className: "w-14 h-14 rounded-xs object-cover border border-zinc-200 dark:border-zinc-800"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("h1", {
								className: "text-xl font-bold text-zinc-900 dark:text-white",
								children: [business.name, " Suite"]
							}), /* @__PURE__ */ jsx("span", {
								className: "px-2 py-0.5 rounded-2xs bg-blue-100 text-blue-600 text-xs font-mono font-bold border border-blue-600/20",
								children: "Pro Owner Hub"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-zinc-500 dark:text-zinc-400 mt-0.5",
							children: "Manage reviews, automate responses, collect feedback, and embed badges."
						})] })]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "px-3.5 py-2 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 text-center",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "text-lg font-mono font-bold text-blue-600 dark:text-blue-400",
								children: [business.trustScore, "/100"]
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400",
								children: "Trust Score"
							})]
						})
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-1 overflow-x-auto",
					children: [
						{
							id: "overview",
							label: "Executive Analytics",
							icon: BarChart3
						},
						{
							id: "ai_reply",
							label: "AI Auto-Reply Studio",
							icon: Sparkles,
							badge: unrepliedReviews.length
						},
						{
							id: "campaigns",
							label: "QR & Review Requests",
							icon: QrCode
						},
						{
							id: "widgets",
							label: "Embeddable Badges",
							icon: Code2
						}
					].map((tab) => {
						const Icon = tab.icon;
						return /* @__PURE__ */ jsxs("button", {
							onClick: () => setActiveTab(tab.id),
							className: `px-4 py-2.5 text-xs font-bold rounded-sm transition shrink-0 flex items-center gap-2 ${activeTab === tab.id ? "bg-blue-600 text-white shadow-2xs" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`,
							children: [
								/* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ jsx("span", { children: tab.label }),
								tab.badge !== void 0 && tab.badge > 0 && /* @__PURE__ */ jsx("span", {
									className: "px-1.5 py-0.2 rounded-2xs bg-rose-600 text-white text-[10px]",
									children: tab.badge
								})
							]
						}, tab.id);
					})
				}),
				activeTab === "overview" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
										children: "Total Reviews"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold font-mono text-zinc-900 dark:text-white",
										children: business.reviewCount
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-[11px] text-blue-600 font-semibold flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(TrendingUp, { className: "w-3.5 h-3.5" }), " +18.4% this month"]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
										children: "Trust Score Index"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-2xl font-bold font-mono text-blue-600",
										children: [business.trustScore, "/100"]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-[11px] text-zinc-500 dark:text-zinc-400 font-medium",
										children: ["Top 5% in ", business.categoryName]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
										children: "Response Rate"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold font-mono text-blue-600",
										children: "96.2%"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-blue-600 font-semibold",
										children: "Avg reply under 1.2 hours"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
										children: "Profile Visitors"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-bold font-mono text-zinc-900 dark:text-white",
										children: "18,420"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-blue-600 font-semibold",
										children: "+12% traffic conversion"
									})
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold text-zinc-900 dark:text-white",
							children: "AI Sentiment Breakdown"
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 text-blue-600 dark:text-blue-400",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-bold font-mono block text-sm",
										children: "88% Positive"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-zinc-900 dark:text-zinc-100",
										children: "Praised for latency speed, customer support response, and pricing clarity."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-bold font-mono block text-sm",
										children: "9% Neutral"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-zinc-900 dark:text-zinc-100",
										children: "Suggestions regarding deeper C++ SDK documentation examples."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-bold font-mono block text-sm",
										children: "3% Critical"
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-zinc-900 dark:text-zinc-100",
										children: "Minor concerns regarding bandwidth overage fee caps."
									})]
								})
							]
						})]
					})]
				}),
				activeTab === "ai_reply" && /* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 rounded-sm bg-blue-100 text-blue-600 flex items-center justify-center",
							children: /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold text-zinc-900 dark:text-white",
							children: "Gemini AI Auto-Reply Generator"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-zinc-500 dark:text-zinc-400",
							children: "Draft customized, empathetic executive replies in 1 click."
						})] })]
					}), unrepliedReviews.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "p-8 text-center bg-zinc-100 dark:bg-zinc-800 rounded-sm border border-zinc-200 dark:border-zinc-800",
						children: [
							/* @__PURE__ */ jsx(Check, { className: "w-8 h-8 text-blue-600 mx-auto mb-2" }),
							/* @__PURE__ */ jsx("h4", {
								className: "text-sm font-bold text-zinc-900 dark:text-white",
								children: "All Reviews Replied!"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
								children: "You have answered 100% of customer reviews. Excellent work!"
							})
						]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2",
								children: "Select Unreplied Review"
							}), /* @__PURE__ */ jsxs("select", {
								value: selectedReviewIdForReply,
								onChange: (e) => setSelectedReviewIdForReply(e.target.value),
								className: "w-full p-3 text-xs rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-black dark:border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "-- Select Review --"
								}), unrepliedReviews.map((r) => /* @__PURE__ */ jsxs("option", {
									value: r.id,
									children: [
										"[",
										r.rating,
										" Stars] ",
										r.reviewerName,
										": \"",
										r.title,
										"\""
									]
								}, r.id))]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2",
								children: "Desired Tone"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs",
								children: [
									"Professional & Empathetic",
									"Direct Resolution",
									"Enthusiastic Thank You",
									"Executive Officer"
								].map((t) => /* @__PURE__ */ jsx("button", {
									onClick: () => setSelectedTone(t),
									className: `p-2.5 rounded-sm font-semibold border transition ${selectedTone === t ? "bg-blue-600 text-white border-blue-600" : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"}`,
									children: t
								}, t))
							})] }),
							/* @__PURE__ */ jsxs("button", {
								onClick: handleGenerateAiReply,
								disabled: !selectedReviewIdForReply || isGeneratingReply,
								className: "px-5 py-2.5 text-xs font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: isGeneratingReply ? "Generating AI Reply..." : "Generate Official Reply" })]
							}),
							generatedAiReply && /* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 space-y-3",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-bold text-blue-600 dark:text-blue-400 block",
										children: "AI Draft Preview:"
									}),
									/* @__PURE__ */ jsx("textarea", {
										value: generatedAiReply,
										onChange: (e) => setGeneratedAiReply(e.target.value),
										rows: 3,
										className: "w-full p-2.5 text-xs rounded-sm bg-zinc-50 dark:bg-zinc-900 border border-black dark:border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex justify-end gap-2",
										children: /* @__PURE__ */ jsx("button", {
											onClick: handlePostGeneratedReply,
											className: "px-4 py-2 text-xs font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700",
											children: "Publish Official Response"
										})
									})
								]
							})
						]
					})]
				}),
				activeTab === "campaigns" && /* @__PURE__ */ jsx("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-zinc-900 dark:text-white",
								children: "Counter & Receipt QR Code Generator"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-zinc-500 dark:text-zinc-400",
								children: "Print or embed this QR code on receipts, invoices, or front desks to collect verified reviews instantly."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row items-center gap-6 p-6 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "p-4 bg-zinc-50 rounded-sm border border-zinc-200 flex flex-col items-center",
									children: [/* @__PURE__ */ jsx(QrCode, { className: "w-28 h-28 text-zinc-900" }), /* @__PURE__ */ jsxs("span", {
										className: "text-[10px] font-mono font-bold text-zinc-500 mt-2",
										children: ["Scan to Review ", business.name]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-2 text-xs",
									children: [
										/* @__PURE__ */ jsx("h4", {
											className: "font-bold text-zinc-900 dark:text-white text-sm",
											children: "Direct Review Link:"
										}),
										/* @__PURE__ */ jsxs("code", {
											className: "p-2 rounded-xs bg-zinc-200 dark:bg-zinc-800 text-blue-600 font-mono block",
											children: ["https://trustpulse.ai/r/", business.slug]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-zinc-500 dark:text-zinc-400",
											children: "Customers scanning this QR code are automatically directed to your verified review submission form."
										})
									]
								})]
							})
						]
					})
				}),
				activeTab === "widgets" && /* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold text-zinc-900 dark:text-white",
							children: "Embeddable Trust Badge Studio"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-zinc-500 dark:text-zinc-400",
							children: "Showcase your live Trust Score and verified customer ratings on your website."
						})] }),
						/* @__PURE__ */ jsx("div", {
							className: "p-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center",
							children: /* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 max-w-sm",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-10 h-10 rounded-xs bg-blue-100 text-blue-600 flex items-center justify-center font-bold font-mono text-sm",
									children: business.trustScore
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1 text-xs font-bold text-zinc-900 dark:text-white",
									children: [/* @__PURE__ */ jsx("span", { children: "Verified on TrustPulse" }), /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-amber-500 text-amber-500" })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[11px] font-mono text-zinc-500 dark:text-zinc-400",
									children: [
										business.rating,
										" / 5.0 (",
										business.reviewCount,
										" reviews)"
									]
								})] })]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
								children: "Embed Code (HTML / Iframe)"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "text",
									readOnly: true,
									value: getEmbedCode(),
									className: "flex-1 p-2.5 text-xs font-mono rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-black dark:border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
								}), /* @__PURE__ */ jsxs("button", {
									onClick: handleCopyCode,
									className: "px-4 py-2.5 text-xs font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5",
									children: [copiedCode ? /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: copiedCode ? "Copied" : "Copy Code" })]
								})]
							})]
						})
					]
				})
			]
		})
	});
};
//#endregion
export { BusinessDashboard };
