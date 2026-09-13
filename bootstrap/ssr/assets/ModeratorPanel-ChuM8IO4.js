import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Cpu, ShieldAlert, Star, XCircle } from "lucide-react";
//#region resources/js/Pages/Reviews/components/ModeratorPanel.tsx
var ModeratorPanel = ({ moderationQueue, onModeratorAction }) => {
	const [selectedReviewId, setSelectedReviewId] = useState(moderationQueue[0]?.id || null);
	const [moderatorNotes, setModeratorNotes] = useState("");
	const activeReview = moderationQueue.find((r) => r.id === selectedReviewId) || moderationQueue[0];
	const handleAction = (action) => {
		if (activeReview) {
			onModeratorAction(activeReview.id, action, moderatorNotes);
			setModeratorNotes("");
			const nextQueue = moderationQueue.filter((r) => r.id !== activeReview.id);
			setSelectedReviewId(nextQueue[0]?.id || null);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 transition-colors",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3.5",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 rounded-sm bg-amber-500/10 text-amber-600 flex items-center justify-center",
						children: /* @__PURE__ */ jsx(ShieldAlert, { className: "w-5 h-5" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "text-xl font-bold text-zinc-900 dark:text-white",
						children: "AI Moderation & Fraud Inspection Queue"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-zinc-500 dark:text-zinc-400",
						children: "Real-time inspection queue for flagged reviews and suspicious AI risk markers."
					})] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "px-3.5 py-1.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold",
					children: [moderationQueue.length, " Pending Inspection"]
				})]
			}), moderationQueue.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "p-16 text-center bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800",
				children: [
					/* @__PURE__ */ jsx(CheckCircle2, { className: "w-12 h-12 text-blue-600 mx-auto mb-3" }),
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-zinc-900 dark:text-white",
						children: "Moderation Queue Clear!"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-zinc-500 dark:text-zinc-400 mt-1",
						children: "No pending flagged reviews require human inspection."
					})
				]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 block px-1",
						children: [
							"Flagged Items (",
							moderationQueue.length,
							")"
						]
					}), moderationQueue.map((rev) => /* @__PURE__ */ jsxs("div", {
						onClick: () => setSelectedReviewId(rev.id),
						className: `p-4 rounded-sm border cursor-pointer transition ${activeReview?.id === rev.id ? "bg-blue-100 dark:bg-blue-600/20 border-blue-600 text-zinc-900 dark:text-white" : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-600/30"}`,
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs font-bold mb-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-zinc-900 dark:text-white",
									children: rev.reviewerName
								}), /* @__PURE__ */ jsxs("span", {
									className: "px-2 py-0.5 rounded-2xs bg-rose-500/10 text-rose-600 font-mono text-[10px]",
									children: [
										"Fraud Score: ",
										rev.aiFraudScore,
										"/100"
									]
								})]
							}),
							/* @__PURE__ */ jsxs("h4", {
								className: "text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate",
								children: [
									"\"",
									rev.title,
									"\""
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5",
								children: rev.description
							})
						]
					}, rev.id))]
				}), activeReview && /* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-2 p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-xs font-mono font-bold text-zinc-900 dark:text-white",
								children: [/* @__PURE__ */ jsx(Cpu, { className: "w-4 h-4 text-blue-600" }), /* @__PURE__ */ jsxs("span", { children: ["Review Inspection ID: ", activeReview.id] })]
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xs font-mono font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-2xs",
								children: ["Fraud Risk Level: ", activeReview.aiFraudScore > 65 ? "HIGH" : "MEDIUM"]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-3 text-xs",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "font-bold text-zinc-900 dark:text-white text-sm",
									children: [
										"\"",
										activeReview.title,
										"\""
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "flex items-center text-amber-500",
									children: [
										1,
										2,
										3,
										4,
										5
									].map((s) => /* @__PURE__ */ jsx(Star, { className: `w-3.5 h-3.5 ${s <= activeReview.rating ? "fill-amber-500 text-amber-500" : "text-zinc-200 dark:text-zinc-700"}` }, s))
								})]
							}), /* @__PURE__ */ jsxs("p", {
								className: "p-3 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white leading-relaxed border border-zinc-200 dark:border-zinc-800",
								children: [
									"\"",
									activeReview.description,
									"\""
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-sm bg-amber-500/10 border border-amber-500/20 text-xs space-y-2",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-mono",
								children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-amber-500" }), "AI Fraud Reason:"]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-amber-900 dark:text-amber-200",
								children: activeReview.aiFraudReason || "Unusual ip burst pattern detected."
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3 text-xs",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "p-3 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-zinc-400 block text-[10px] font-mono font-bold uppercase",
									children: "Device Fingerprint"
								}), /* @__PURE__ */ jsx("code", {
									className: "text-zinc-900 dark:text-white font-mono",
									children: activeReview.deviceFingerprint || "fp_mac_881"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-3 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-zinc-400 block text-[10px] font-mono font-bold uppercase",
									children: "IP Location"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-zinc-900 dark:text-white font-medium",
									children: activeReview.ipLocation || "Verified ISP"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-3 pt-2",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400",
									children: "Moderator Audit Note"
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: moderatorNotes,
									onChange: (e) => setModeratorNotes(e.target.value),
									placeholder: "Enter audit reasoning for approving or rejecting...",
									rows: 2,
									className: "w-full p-3 text-xs rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-3 pt-2",
									children: [/* @__PURE__ */ jsxs("button", {
										onClick: () => handleAction("reject"),
										className: "px-5 py-2.5 text-xs font-bold rounded-sm bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition",
										children: [/* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Reject & Purge Review" })]
									}), /* @__PURE__ */ jsxs("button", {
										onClick: () => handleAction("approve"),
										className: "px-5 py-2.5 text-xs font-bold rounded-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Approve & Publish Live" })]
									})]
								})
							]
						})
					]
				})]
			})]
		})
	});
};
//#endregion
export { ModeratorPanel };
