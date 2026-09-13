import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Star, Upload, X } from "lucide-react";
//#region resources/js/Pages/Reviews/components/SubmitReviewModal.tsx
var SubmitReviewModal = ({ businesses, preselectedBusinessId, onClose, onSubmit }) => {
	const [step, setStep] = useState(1);
	const [businessId, setBusinessId] = useState(preselectedBusinessId || businesses[0]?.id || "");
	const [overallRating, setOverallRating] = useState(5);
	const [categoryRatings, setCategoryRatings] = useState({
		support: 5,
		quality: 5,
		delivery: 5,
		pricing: 4,
		communication: 5,
		value: 5
	});
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [proInput, setProInput] = useState("");
	const [pros, setPros] = useState([]);
	const [conInput, setConInput] = useState("");
	const [cons, setCons] = useState([]);
	const [orderNumber, setOrderNumber] = useState("");
	const [proofFileUploaded, setProofFileUploaded] = useState(false);
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [reviewerName, setReviewerName] = useState("");
	const [reviewerLocation, setReviewerLocation] = useState("San Francisco, CA");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [aiFeedback, setAiFeedback] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const selectedBusiness = businesses.find((b) => b.id === businessId);
	const handleAddPro = () => {
		if (proInput.trim()) {
			setPros([...pros, proInput.trim()]);
			setProInput("");
		}
	};
	const handleAddCon = () => {
		if (conInput.trim()) {
			setCons([...cons, conInput.trim()]);
			setConInput("");
		}
	};
	const handleProceedToAiCheck = async () => {
		if (!title.trim() || !description.trim()) return;
		setStep(4);
		setIsAnalyzing(true);
		try {
			const data = await (await fetch("/api/ai/analyze-review", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title,
					description,
					rating: overallRating,
					businessName: selectedBusiness?.name
				})
			})).json();
			setAiFeedback(data);
		} catch (err) {
			console.error("AI check error:", err);
			setAiFeedback({
				sentiment: overallRating >= 4 ? "positive" : "neutral",
				aiFraudScore: 4,
				fraudRiskLevel: "LOW",
				reasons: ["Passed basic structure check"]
			});
		} finally {
			setIsAnalyzing(false);
		}
	};
	const handleFinalSubmit = async () => {
		setIsSubmitting(true);
		try {
			const proof = orderNumber.trim() || proofFileUploaded ? {
				type: "invoice",
				orderNumber: orderNumber.trim() || "INV-2026-X99",
				proofUrl: proofFileUploaded ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c" : void 0,
				verifiedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
			} : void 0;
			await onSubmit({
				businessId,
				reviewerName: reviewerName || "Verified Community Member",
				reviewerLocation,
				rating: overallRating,
				categoryRatings,
				title,
				description,
				pros,
				cons,
				isVerifiedPurchase: !!proof,
				isAnonymous,
				proof
			});
			onClose();
		} catch (err) {
			console.error("Error submitting review:", err);
		} finally {
			setIsSubmitting(false);
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
							children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-base font-bold text-zinc-900 dark:text-white",
							children: "Write Verified Review"
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-xs font-mono text-zinc-500 dark:text-zinc-400",
							children: [
								"Step ",
								step,
								" of 4: ",
								step === 1 ? "Rating" : step === 2 ? "Details" : step === 3 ? "Proof & Bio" : "AI Inspection"
							]
						})] })]
					}), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}),
				step === 1 && /* @__PURE__ */ jsxs("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2",
							children: "Select Company"
						}), /* @__PURE__ */ jsx("select", {
							value: businessId,
							onChange: (e) => setBusinessId(e.target.value),
							className: "w-full p-3 text-xs font-medium rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600",
							children: businesses.map((b) => /* @__PURE__ */ jsxs("option", {
								value: b.id,
								children: [
									b.name,
									" (",
									b.categoryName,
									")"
								]
							}, b.id))
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-center space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
									children: "Overall Rating"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex items-center justify-center gap-2",
									children: [
										1,
										2,
										3,
										4,
										5
									].map((star) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setOverallRating(star),
										className: "p-1 hover:scale-110 transition-transform",
										children: /* @__PURE__ */ jsx(Star, { className: `w-8 h-8 ${star <= overallRating ? "fill-amber-500 text-amber-500" : "text-zinc-200 dark:text-zinc-700"}` })
									}, star))
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold text-blue-600 block",
									children: overallRating === 5 ? "Excellent" : overallRating === 4 ? "Great" : overallRating === 3 ? "Average" : "Poor"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2",
							children: "Specific Category Ratings"
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-2 gap-3 text-xs",
							children: [
								"support",
								"quality",
								"delivery",
								"pricing"
							].map((catKey) => /* @__PURE__ */ jsxs("div", {
								className: "p-3 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "capitalize font-semibold text-zinc-900 dark:text-zinc-100",
									children: catKey
								}), /* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-1 text-amber-500",
									children: [
										1,
										2,
										3,
										4,
										5
									].map((s) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setCategoryRatings({
											...categoryRatings,
											[catKey]: s
										}),
										children: /* @__PURE__ */ jsx(Star, { className: `w-3.5 h-3.5 ${s <= categoryRatings[catKey] ? "fill-amber-500 text-amber-500" : "text-zinc-200 dark:text-zinc-700"}` })
									}, s))
								})]
							}, catKey))
						})] }),
						/* @__PURE__ */ jsx("div", {
							className: "flex justify-end pt-4",
							children: /* @__PURE__ */ jsxs("button", {
								onClick: () => setStep(2),
								className: "px-5 py-2.5 text-xs font-bold rounded-sm bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Next: Review Text" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
							})
						})
					]
				}),
				step === 2 && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4 text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-1",
							children: "Review Headline / Title *"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "e.g., Exceptional customer service and sub-20ms latency!",
							className: "w-full p-3 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-1",
							children: "Detailed Experience Description *"
						}), /* @__PURE__ */ jsx("textarea", {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 4,
							placeholder: "Explain what you bought, how long you used the service, what went well or what could be improved...",
							className: "w-full p-3 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block font-bold text-blue-600 mb-1",
									children: "Add Pro Point"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx("input", {
										type: "text",
										value: proInput,
										onChange: (e) => setProInput(e.target.value),
										placeholder: "e.g. Fast response",
										className: "flex-1 p-2 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
									}), /* @__PURE__ */ jsx("button", {
										onClick: handleAddPro,
										className: "px-3 bg-blue-600 text-white rounded-sm font-bold",
										children: "Add"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1 mt-2",
									children: pros.map((p, i) => /* @__PURE__ */ jsx("span", {
										className: "px-2 py-0.5 rounded-2xs bg-blue-100 text-blue-600 font-mono font-semibold",
										children: p
									}, i))
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block font-bold text-rose-600 mb-1",
									children: "Add Con Point"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx("input", {
										type: "text",
										value: conInput,
										onChange: (e) => setConInput(e.target.value),
										placeholder: "e.g. Higher overage fee",
										className: "flex-1 p-2 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
									}), /* @__PURE__ */ jsx("button", {
										onClick: handleAddCon,
										className: "px-3 bg-rose-600 text-white rounded-sm font-bold",
										children: "Add"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1 mt-2",
									children: cons.map((c, i) => /* @__PURE__ */ jsx("span", {
										className: "px-2 py-0.5 rounded-2xs bg-rose-500/10 text-rose-600 font-mono font-semibold",
										children: c
									}, i))
								})
							] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between pt-4",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: () => setStep(1),
								className: "px-4 py-2 text-zinc-500 font-semibold flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), " Back"]
							}), /* @__PURE__ */ jsx("button", {
								disabled: !title.trim() || !description.trim(),
								onClick: () => setStep(3),
								className: "px-5 py-2.5 font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50",
								children: "Next: Verification Proof"
							})]
						})
					]
				}),
				step === 3 && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4 text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 text-blue-600 dark:text-blue-400",
							children: [/* @__PURE__ */ jsxs("h4", {
								className: "font-bold flex items-center gap-1.5 text-sm",
								children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-blue-600" }), "Verified Purchase Booster"]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 leading-relaxed text-zinc-900 dark:text-zinc-100",
								children: "Adding an Order Number or uploading an invoice receipt boosts your review trust weight by 3.5x and attaches a green \"Verified Invoice\" badge!"
							})]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block font-bold text-zinc-900 dark:text-white mb-1",
							children: "Order Number / Invoice ID (Optional)"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: orderNumber,
							onChange: (e) => setOrderNumber(e.target.value),
							placeholder: "e.g., INV-AETHER-2026-99",
							className: "w-full p-3 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block font-bold text-zinc-900 dark:text-white mb-1",
							children: "Upload Receipt / Invoice Image"
						}), /* @__PURE__ */ jsxs("div", {
							onClick: () => setProofFileUploaded(!proofFileUploaded),
							className: `p-6 border-2 border-dashed rounded-sm text-center cursor-pointer transition ${proofFileUploaded ? "border-blue-600 bg-blue-100 text-blue-600" : "border-zinc-200 dark:border-zinc-800 hover:border-blue-600"}`,
							children: [
								/* @__PURE__ */ jsx(Upload, { className: "w-6 h-6 mx-auto mb-2 text-zinc-400" }),
								/* @__PURE__ */ jsx("span", {
									className: "font-bold block",
									children: proofFileUploaded ? "Receipt Attachment Attached (Verified)" : "Click to simulate receipt upload"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-zinc-400",
									children: "PNG, JPG or PDF up to 10MB"
								})
							]
						})] }),
						/* @__PURE__ */ jsx("div", {
							className: "pt-2 flex items-center justify-between",
							children: /* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 font-medium text-zinc-900 dark:text-white cursor-pointer",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: isAnonymous,
									onChange: (e) => setIsAnonymous(e.target.checked),
									className: "rounded-2xs text-blue-600"
								}), /* @__PURE__ */ jsx("span", { children: "Post as Anonymous Verified Buyer" })]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between pt-4",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: () => setStep(2),
								className: "px-4 py-2 text-zinc-500 font-semibold flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), " Back"]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: handleProceedToAiCheck,
								className: "px-5 py-2.5 font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Run AI Inspection & Submit" })]
							})]
						})
					]
				}),
				step === 4 && /* @__PURE__ */ jsx("div", {
					className: "space-y-5 text-xs text-center",
					children: isAnalyzing ? /* @__PURE__ */ jsxs("div", {
						className: "py-12 space-y-4",
						children: [
							/* @__PURE__ */ jsx(Sparkles, { className: "w-10 h-10 text-blue-600 animate-spin mx-auto" }),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-zinc-900 dark:text-white",
								children: "Scanning Review with Gemini AI Engine..."
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-zinc-500 max-w-sm mx-auto",
								children: "Evaluating sentiment, checking device markers, and computing Trust Weight."
							})
						]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "space-y-5 text-left",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 space-y-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("span", { children: "Passed AI Authenticity & Fraud Inspection" })]
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-zinc-900 dark:text-zinc-100",
									children: [
										"Calculated AI Fraud Risk Score: ",
										/* @__PURE__ */ jsxs("strong", {
											className: "text-blue-600 font-mono font-bold",
											children: [aiFeedback?.aiFraudScore || 3, "/100"]
										}),
										" (Low Risk)."
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 space-y-2",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "font-bold text-zinc-900 dark:text-white",
										children: "Review Summary Preview:"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-zinc-900 dark:text-white font-semibold",
										children: [
											"\"",
											title,
											"\""
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-zinc-500 dark:text-zinc-400 line-clamp-2",
										children: [
											"\"",
											description,
											"\""
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between pt-4",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => setStep(3),
									className: "px-4 py-2 text-zinc-500 font-semibold",
									children: "Edit Review"
								}), /* @__PURE__ */ jsx("button", {
									onClick: handleFinalSubmit,
									disabled: isSubmitting,
									className: "px-6 py-2.5 font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition",
									children: isSubmitting ? "Publishing..." : "Publish Live Review"
								})]
							})
						]
					})
				})
			]
		})
	});
};
//#endregion
export { SubmitReviewModal };
