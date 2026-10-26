import AdminLayout from "./AdminLayout-B4V0SEL8.js";
import { Head, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
//#region resources/js/Pages/Admin/X/Index.jsx
function XHubPage({ needsMigration = false, isConfigured, clientId, hasClientSecret, consumerKey, hasConsumerSecret, redirectUri, account, pendingApprovals = [], recentShares = [], recentTweets = [], authUrl, errorMessage = null }) {
	const [activeTab, setActiveTab] = useState("approvals");
	const [approvingId, setApprovingId] = useState(null);
	const [editText, setEditText] = useState({});
	const [customText, setCustomText] = useState("");
	const [customImage, setCustomImage] = useState("");
	const [customLink, setCustomLink] = useState("");
	const [isPublishingCustom, setIsPublishingCustom] = useState(false);
	const [publishFeedback, setPublishFeedback] = useState({});
	const [copiedUri, setCopiedUri] = useState(false);
	const fileInputRef = useRef(null);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [showManualUrl, setShowManualUrl] = useState(false);
	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsUploadingImage(true);
		const formData = new FormData();
		formData.append("file", file);
		try {
			const data = await (await fetch("/api/admin/social/upload-image", {
				method: "POST",
				headers: { "X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "" },
				body: formData
			})).json();
			if (data.success && data.url) setCustomImage(data.url);
			else alert(data.message || "Image upload failed");
		} catch (err) {
			alert("Upload error: " + err.message);
		} finally {
			setIsUploadingImage(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const [manualToken, setManualToken] = useState("");
	const [manualSecret, setManualSecret] = useState("");
	const [manualUsername, setManualUsername] = useState("");
	const [isSavingManual, setIsSavingManual] = useState(false);
	const handleCopyUri = () => {
		navigator.clipboard.writeText(redirectUri);
		setCopiedUri(true);
		setTimeout(() => setCopiedUri(false), 2e3);
	};
	const handleApprove = async (share) => {
		setApprovingId(share.id);
		const finalText = editText[share.id] !== void 0 ? editText[share.id] : share.text;
		try {
			const data = await (await fetch("/api/admin/x/approve-publish", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || ""
				},
				body: JSON.stringify({
					share_id: share.id,
					text: finalText,
					media_url: share.media_url,
					target_link: share.target_link
				})
			})).json();
			if (data.success) {
				setPublishFeedback((prev) => ({
					...prev,
					[share.id]: {
						success: true,
						permalink: data.permalink
					}
				}));
				router.reload({ only: [
					"pendingApprovals",
					"recentShares",
					"recentTweets"
				] });
			} else alert(data.message || "Publishing to X failed");
		} catch (e) {
			alert("Network or server error: " + e.message);
		} finally {
			setApprovingId(null);
		}
	};
	const handleCustomTweetSubmit = (e) => {
		e.preventDefault();
		if (!customText.trim() || customText.length > 280) return;
		setIsPublishingCustom(true);
		router.post("/admin/x/custom-tweet", {
			text: customText,
			image_url: customImage,
			target_link: customLink
		}, { onFinish: () => {
			setIsPublishingCustom(false);
			setCustomText("");
			setCustomImage("");
			setCustomLink("");
		} });
	};
	const handleManualTokenSubmit = (e) => {
		e.preventDefault();
		if (!manualToken.trim()) return;
		setIsSavingManual(true);
		router.post("/admin/x/credentials", {
			access_token: manualToken,
			access_token_secret: manualSecret,
			username: manualUsername
		}, { onFinish: () => {
			setIsSavingManual(false);
			setManualToken("");
			setManualSecret("");
		} });
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		style: {
			animation: "fadeIn 0.3s ease-out",
			paddingBottom: "40px"
		},
		children: [
			/* @__PURE__ */ jsx(Head, { title: "X (Twitter) Hub & Profile Manager | Admin" }),
			needsMigration && /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fef3c7",
					border: "1px solid #fde68a",
					color: "#92400e",
					padding: "16px 20px",
					borderRadius: "12px",
					marginBottom: "20px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "12px",
					boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", {
					style: {
						fontSize: "14px",
						display: "block",
						marginBottom: "2px"
					},
					children: "⚠️ X (Twitter) Database Tables Setup Required"
				}), /* @__PURE__ */ jsx("span", {
					style: { fontSize: "13px" },
					children: "X integration tables are not created yet in the database. Run the system database upgrade once to activate all features."
				})] }), /* @__PURE__ */ jsx("a", {
					href: "/app-upgrade",
					style: {
						background: "#000",
						color: "#fff",
						padding: "9px 18px",
						borderRadius: "8px",
						fontWeight: 700,
						textDecoration: "none",
						fontSize: "13px",
						whiteSpace: "nowrap"
					},
					children: "Run Database Upgrade 🚀"
				})]
			}),
			errorMessage && /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fee2e2",
					border: "1px solid #fca5a5",
					color: "#991b1b",
					padding: "14px 20px",
					borderRadius: "12px",
					marginBottom: "20px",
					fontSize: "13px",
					fontWeight: 600
				},
				children: ["⚠️ ", errorMessage]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "linear-gradient(135deg, #09090b, #18181b)",
					border: "1px solid #27272a",
					borderRadius: "16px",
					padding: "28px 32px",
					color: "#fff",
					marginBottom: "24px",
					display: "flex",
					flexWrap: "wrap",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "20px",
					boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "16px"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							background: "#000",
							border: "1px solid #3f3f46",
							color: "#fff",
							width: "54px",
							height: "54px",
							borderRadius: "14px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
							flexShrink: 0
						},
						children: /* @__PURE__ */ jsx("svg", {
							width: "28",
							height: "28",
							viewBox: "0 0 24 24",
							fill: "currentColor",
							children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
						})
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "10px"
						},
						children: [/* @__PURE__ */ jsx("h1", {
							style: {
								fontSize: "24px",
								fontWeight: 900,
								margin: 0,
								letterSpacing: "-0.5px"
							},
							children: "X (Twitter) Hub & Profile Manager"
						}), account ? /* @__PURE__ */ jsx("span", {
							style: {
								background: "#10b981",
								color: "#fff",
								fontSize: "11px",
								fontWeight: 800,
								padding: "3px 8px",
								borderRadius: "12px"
							},
							children: "CONNECTED"
						}) : /* @__PURE__ */ jsx("span", {
							style: {
								background: "#3f3f46",
								color: "#d4d4d8",
								fontSize: "11px",
								fontWeight: 800,
								padding: "3px 8px",
								borderRadius: "12px"
							},
							children: "NOT CONNECTED"
						})]
					}), /* @__PURE__ */ jsxs("p", {
						style: {
							margin: "4px 0 0 0",
							opacity: .85,
							fontSize: "14px"
						},
						children: [
							"Manage @",
							account?.username || "profile",
							", review 280-char blog drafts, and approve direct photo tweets to X via API v2."
						]
					})] })]
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						gap: "12px",
						alignItems: "center",
						flexWrap: "wrap"
					},
					children: account ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
						onClick: () => router.post("/admin/x/sync-profile"),
						style: {
							background: "rgba(255,255,255,0.1)",
							border: "1px solid rgba(255,255,255,0.2)",
							color: "#fff",
							padding: "9px 16px",
							borderRadius: "10px",
							fontWeight: 700,
							fontSize: "13px",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "6px"
						},
						children: "🔄 Re-Sync Profile"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => {
							if (confirm("Are you sure you want to disconnect X account?")) router.post("/admin/x/disconnect");
						},
						style: {
							background: "rgba(239, 68, 68, 0.25)",
							border: "1px solid rgba(239, 68, 68, 0.5)",
							color: "#fff",
							padding: "9px 16px",
							borderRadius: "10px",
							fontWeight: 700,
							fontSize: "13px",
							cursor: "pointer"
						},
						children: "Disconnect"
					})] }) : authUrl ? /* @__PURE__ */ jsxs("a", {
						href: authUrl,
						style: {
							background: "#fff",
							color: "#000",
							padding: "11px 22px",
							borderRadius: "10px",
							fontWeight: 800,
							fontSize: "14px",
							textDecoration: "none",
							display: "flex",
							alignItems: "center",
							gap: "8px",
							boxShadow: "0 4px 14px rgba(255,255,255,0.2)"
						},
						children: [/* @__PURE__ */ jsx("svg", {
							width: "18",
							height: "18",
							viewBox: "0 0 24 24",
							fill: "currentColor",
							children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
						}), "Connect with 𝕏"]
					}) : null
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					gap: "8px",
					borderBottom: "2px solid #e2e8f0",
					marginBottom: "24px"
				},
				children: [
					{
						id: "approvals",
						label: "📋 Approvals Queue",
						badge: pendingApprovals.length
					},
					{
						id: "compose",
						label: "✍️ Quick Tweet Composer"
					},
					{
						id: "feed",
						label: "📊 Profile & Live Tweets"
					},
					{
						id: "settings",
						label: "⚙️ 𝕏 App & API Keys"
					}
				].map((tab) => {
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab(tab.id),
						style: {
							padding: "12px 18px",
							fontWeight: isActive ? 700 : 600,
							fontSize: "14px",
							border: "none",
							background: "none",
							color: isActive ? "#000" : "#64748b",
							borderBottom: isActive ? "3px solid #000" : "3px solid transparent",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "-2px",
							transition: "all 0.15s ease"
						},
						children: [/* @__PURE__ */ jsx("span", { children: tab.label }), tab.badge > 0 && /* @__PURE__ */ jsx("span", {
							style: {
								background: "#ef4444",
								color: "#fff",
								fontSize: "11px",
								fontWeight: 800,
								padding: "2px 7px",
								borderRadius: "10px"
							},
							children: tab.badge
						})]
					}, tab.id);
				})
			}),
			activeTab === "approvals" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "16px"
				},
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					style: {
						fontSize: "18px",
						fontWeight: 800,
						color: "#0f172a",
						margin: 0
					},
					children: "Pending Approval Blog Tweets"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						margin: "2px 0 0 0",
						fontSize: "13px",
						color: "#64748b"
					},
					children: "Auto-drafted from published blog posts. Review, edit caption, and approve for instant posting to X."
				})] })
			}), pendingApprovals.length === 0 ? /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					border: "1px dashed #cbd5e1",
					borderRadius: "14px",
					padding: "48px 24px",
					textAlign: "center",
					color: "#64748b"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "36px",
							marginBottom: "12px"
						},
						children: "🎉"
					}),
					/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "16px",
							fontWeight: 700,
							color: "#1e293b",
							margin: "0 0 6px 0"
						},
						children: "No Pending Tweets Waiting"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							fontSize: "13px",
							margin: 0,
							maxWidth: "440px",
							marginInline: "auto"
						},
						children: "When you create or publish a blog post, a smart 280-character draft will automatically appear here for review."
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "20px"
				},
				children: pendingApprovals.map((share) => {
					const currentText = editText[share.id] !== void 0 ? editText[share.id] : share.text;
					const charCount = currentText.length;
					const isOverLimit = charCount > 280;
					return /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							borderRadius: "16px",
							border: "1px solid #e2e8f0",
							boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
							padding: "24px",
							display: "flex",
							flexDirection: "column",
							gap: "16px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									gap: "16px"
								},
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: "12px",
										fontWeight: 700,
										color: "#0284c7",
										textTransform: "uppercase",
										letterSpacing: "0.5px",
										marginBottom: "4px"
									},
									children: ["Blog Post #", share.post_id]
								}), /* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "17px",
										fontWeight: 800,
										color: "#0f172a",
										margin: 0
									},
									children: share.post?.title || "Standalone Tweet Draft"
								})] }), /* @__PURE__ */ jsx("span", {
									style: {
										background: "#fef3c7",
										color: "#92400e",
										fontSize: "12px",
										fontWeight: 700,
										padding: "4px 10px",
										borderRadius: "12px",
										whiteSpace: "nowrap"
									},
									children: "Pending Approval"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gridTemplateColumns: share.media_url ? "1fr 220px" : "1fr",
									gap: "20px"
								},
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "6px"
										},
										children: [/* @__PURE__ */ jsx("label", {
											style: {
												fontSize: "13px",
												fontWeight: 700,
												color: "#334155"
											},
											children: "Tweet Text (Edit before posting):"
										}), /* @__PURE__ */ jsxs("span", {
											style: {
												fontSize: "12px",
												fontWeight: 800,
												padding: "2px 8px",
												borderRadius: "8px",
												background: isOverLimit ? "#fee2e2" : charCount > 250 ? "#fef3c7" : "#f1f5f9",
												color: isOverLimit ? "#dc2626" : charCount > 250 ? "#d97706" : "#475569"
											},
											children: [charCount, " / 280"]
										})]
									}),
									/* @__PURE__ */ jsx("textarea", {
										rows: 5,
										value: currentText,
										onChange: (e) => setEditText({
											...editText,
											[share.id]: e.target.value
										}),
										style: {
											width: "100%",
											padding: "12px",
											borderRadius: "10px",
											border: isOverLimit ? "2px solid #ef4444" : "1px solid #cbd5e1",
											fontSize: "14px",
											lineHeight: 1.5,
											fontFamily: "inherit",
											outline: "none",
											boxSizing: "border-box"
										}
									}),
									isOverLimit && /* @__PURE__ */ jsxs("div", {
										style: {
											color: "#dc2626",
											fontSize: "12px",
											marginTop: "4px",
											fontWeight: 600
										},
										children: [
											"⚠️ Tweet exceeds 280 character limit by ",
											charCount - 280,
											" characters. Shorten text before approving."
										]
									})
								] }), share.media_url && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: {
										display: "block",
										fontSize: "13px",
										fontWeight: 700,
										color: "#334155",
										marginBottom: "6px"
									},
									children: "Cover Image Preview:"
								}), /* @__PURE__ */ jsx("img", {
									src: share.media_url,
									alt: "Post Preview",
									style: {
										width: "100%",
										height: "140px",
										objectFit: "cover",
										borderRadius: "10px",
										border: "1px solid #e2e8f0"
									}
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									paddingTop: "12px",
									borderTop: "1px solid #f1f5f9"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: "12px",
										color: "#64748b"
									},
									children: ["Target: ", /* @__PURE__ */ jsxs("strong", { children: ["@", account?.username || "x_account"] })]
								}), /* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										gap: "10px"
									},
									children: /* @__PURE__ */ jsx("button", {
										type: "button",
										disabled: approvingId === share.id || isOverLimit,
										onClick: () => handleApprove(share),
										style: {
											background: isOverLimit ? "#94a3b8" : "#000",
											color: "#fff",
											border: "none",
											padding: "10px 20px",
											borderRadius: "8px",
											fontWeight: 700,
											fontSize: "13px",
											cursor: isOverLimit ? "not-allowed" : "pointer",
											display: "flex",
											alignItems: "center",
											gap: "6px"
										},
										children: approvingId === share.id ? "Publishing..." : "Approve & Post to 𝕏 🚀"
									})
								})]
							}),
							publishFeedback[share.id]?.permalink && /* @__PURE__ */ jsxs("div", {
								style: {
									background: "#ecfdf5",
									border: "1px solid #a7f3d0",
									color: "#065f46",
									padding: "10px 14px",
									borderRadius: "8px",
									fontSize: "13px"
								},
								children: [
									"✓ Tweet published!",
									" ",
									/* @__PURE__ */ jsx("a", {
										href: publishFeedback[share.id].permalink,
										target: "_blank",
										rel: "noreferrer",
										style: {
											fontWeight: 700,
											color: "#047857"
										},
										children: "View on X →"
									})
								]
							})
						]
					}, share.id);
				})
			})] }),
			activeTab === "compose" && /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					padding: "28px",
					borderRadius: "16px",
					border: "1px solid #e2e8f0",
					maxWidth: "700px"
				},
				children: [
					/* @__PURE__ */ jsx("h2", {
						style: {
							fontSize: "18px",
							fontWeight: 800,
							color: "#0f172a",
							margin: "0 0 4px 0"
						},
						children: "✍️ Compose Standalone Tweet"
					}),
					/* @__PURE__ */ jsxs("p", {
						style: {
							margin: "0 0 20px 0",
							fontSize: "13px",
							color: "#64748b"
						},
						children: [
							"Create and publish an instant post to your X account (@",
							account?.username || "not connected",
							")."
						]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleCustomTweetSubmit,
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "16px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "6px"
								},
								children: [/* @__PURE__ */ jsxs("label", {
									style: {
										fontSize: "13px",
										fontWeight: 700,
										color: "#334155"
									},
									children: ["Tweet Text ", /* @__PURE__ */ jsx("span", {
										style: { color: "#ef4444" },
										children: "*"
									})]
								}), /* @__PURE__ */ jsxs("span", {
									style: {
										fontSize: "12px",
										fontWeight: 800,
										color: customText.length > 280 ? "#dc2626" : customText.length > 250 ? "#d97706" : "#64748b"
									},
									children: [customText.length, " / 280"]
								})]
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 4,
								required: true,
								placeholder: "What's happening in Sikar? #Sikar #Education...",
								value: customText,
								onChange: (e) => setCustomText(e.target.value),
								style: {
									width: "100%",
									padding: "12px",
									borderRadius: "10px",
									border: customText.length > 280 ? "2px solid #ef4444" : "1px solid #cbd5e1",
									fontSize: "14px",
									outline: "none",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "6px"
								},
								children: [/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "13px",
										fontWeight: 700,
										color: "#334155"
									},
									children: "Tweet Photo (Optional)"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowManualUrl(!showManualUrl),
									style: {
										background: "none",
										border: "none",
										color: "#000",
										fontSize: "12px",
										fontWeight: 700,
										cursor: "pointer",
										padding: 0
									},
									children: showManualUrl ? "📁 Upload File Instead" : "🔗 Or Paste Image URL"
								})]
							}), !showManualUrl ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("input", {
								ref: fileInputRef,
								type: "file",
								accept: "image/*",
								onChange: handleImageUpload,
								style: { display: "none" }
							}), customImage ? /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "14px",
									padding: "12px 14px",
									background: "#f8fafc",
									border: "1px solid #cbd5e1",
									borderRadius: "10px"
								},
								children: [
									/* @__PURE__ */ jsx("img", {
										src: customImage,
										alt: "Uploaded preview",
										style: {
											width: "60px",
											height: "60px",
											objectFit: "cover",
											borderRadius: "8px",
											border: "1px solid #e2e8f0"
										}
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											flex: 1,
											minWidth: 0
										},
										children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "13px",
												fontWeight: 700,
												color: "#0f172a",
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis"
											},
											children: "✓ Photo uploaded to /uploads/social/"
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "11px",
												color: "#64748b",
												marginTop: "2px",
												wordBreak: "break-all"
											},
											children: customImage
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "8px"
										},
										children: [/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => fileInputRef.current?.click(),
											disabled: isUploadingImage,
											style: {
												background: "#f4f4f5",
												color: "#000",
												border: "1px solid #d4d4d8",
												padding: "6px 12px",
												borderRadius: "6px",
												fontSize: "12px",
												fontWeight: 700,
												cursor: "pointer"
											},
											children: "Change"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setCustomImage(""),
											style: {
												background: "#fef2f2",
												color: "#dc2626",
												border: "1px solid #fecaca",
												padding: "6px 12px",
												borderRadius: "6px",
												fontSize: "12px",
												fontWeight: 700,
												cursor: "pointer"
											},
											children: "Remove"
										})]
									})
								]
							}) : /* @__PURE__ */ jsx("div", {
								onClick: () => fileInputRef.current?.click(),
								style: {
									border: "2px dashed #cbd5e1",
									borderRadius: "12px",
									padding: "24px 16px",
									textAlign: "center",
									background: "#f8fafc",
									cursor: isUploadingImage ? "wait" : "pointer",
									transition: "all 0.2s ease"
								},
								children: isUploadingImage ? /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "13px",
										fontWeight: 700,
										color: "#000"
									},
									children: "⏳ Uploading and optimizing photo to /uploads/social/..."
								}) : /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "28px",
											marginBottom: "6px"
										},
										children: "📸"
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "13px",
											fontWeight: 700,
											color: "#1e293b"
										},
										children: "Click to upload photo from your device"
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "11px",
											color: "#64748b",
											marginTop: "4px"
										},
										children: ["JPG, PNG, WebP up to 10MB • Automatically saved in ", /* @__PURE__ */ jsx("code", { children: "uploads/social/" })]
									})
								] })
							})] }) : /* @__PURE__ */ jsx("input", {
								type: "text",
								value: customImage,
								onChange: (e) => setCustomImage(e.target.value),
								placeholder: "https://coachingsinsikar.com/uploads/... or https://...",
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "13px",
									fontWeight: 700,
									color: "#334155",
									marginBottom: "6px"
								},
								children: "Optional Target Link"
							}), /* @__PURE__ */ jsx("input", {
								type: "url",
								placeholder: "https://coachingsinsikar.com/news/article",
								value: customLink,
								onChange: (e) => setCustomLink(e.target.value),
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: isPublishingCustom || !customText.trim() || customText.length > 280,
								style: {
									background: customText.length > 280 ? "#94a3b8" : "#000",
									color: "#fff",
									border: "none",
									padding: "12px 24px",
									borderRadius: "10px",
									fontWeight: 700,
									fontSize: "14px",
									cursor: customText.length > 280 ? "not-allowed" : "pointer",
									alignSelf: "flex-start"
								},
								children: isPublishingCustom ? "Publishing to 𝕏..." : "Publish Tweet 🚀"
							})
						]
					})
				]
			}),
			activeTab === "feed" && /* @__PURE__ */ jsx("div", { children: account ? /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "24px"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
							gap: "16px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									background: "#fff",
									padding: "20px",
									borderRadius: "12px",
									border: "1px solid #e2e8f0",
									boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "12px",
										fontWeight: 700,
										color: "#64748b",
										textTransform: "uppercase"
									},
									children: "Followers"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "28px",
										fontWeight: 900,
										color: "#0f172a",
										marginTop: "4px"
									},
									children: account.followers_count?.toLocaleString() || 0
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									background: "#fff",
									padding: "20px",
									borderRadius: "12px",
									border: "1px solid #e2e8f0",
									boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "12px",
										fontWeight: 700,
										color: "#64748b",
										textTransform: "uppercase"
									},
									children: "Following"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "28px",
										fontWeight: 900,
										color: "#0f172a",
										marginTop: "4px"
									},
									children: account.following_count?.toLocaleString() || 0
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									background: "#fff",
									padding: "20px",
									borderRadius: "12px",
									border: "1px solid #e2e8f0",
									boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "12px",
										fontWeight: 700,
										color: "#64748b",
										textTransform: "uppercase"
									},
									children: "Total Tweets"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "28px",
										fontWeight: 900,
										color: "#0f172a",
										marginTop: "4px"
									},
									children: account.tweet_count?.toLocaleString() || 0
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							padding: "24px",
							borderRadius: "14px",
							border: "1px solid #e2e8f0",
							display: "flex",
							gap: "20px",
							alignItems: "center"
						},
						children: [account.avatar && /* @__PURE__ */ jsx("img", {
							src: account.avatar,
							alt: account.name,
							style: {
								width: "64px",
								height: "64px",
								borderRadius: "50%",
								border: "2px solid #000"
							}
						}), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("h3", {
								style: {
									margin: "0 0 2px 0",
									fontSize: "18px",
									fontWeight: 800
								},
								children: account.name
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									color: "#64748b",
									fontSize: "13px",
									fontWeight: 600
								},
								children: ["@", account.username]
							}),
							account.bio && /* @__PURE__ */ jsx("p", {
								style: {
									margin: "8px 0 0 0",
									fontSize: "14px",
									color: "#334155"
								},
								children: account.bio
							}),
							/* @__PURE__ */ jsx("a", {
								href: account.x_url,
								target: "_blank",
								rel: "noreferrer",
								style: {
									display: "inline-block",
									marginTop: "8px",
									fontSize: "12px",
									fontWeight: 700,
									color: "#0284c7"
								},
								children: "Open Profile on X →"
							})
						] })]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "16px",
							fontWeight: 800,
							color: "#0f172a",
							marginBottom: "14px"
						},
						children: "Recent Published Tweets"
					}), recentTweets.length === 0 ? /* @__PURE__ */ jsx("div", {
						style: {
							background: "#fff",
							padding: "32px",
							borderRadius: "12px",
							textAlign: "center",
							color: "#64748b",
							border: "1px solid #e2e8f0"
						},
						children: "No recent tweets fetched or account timeline is empty."
					}) : /* @__PURE__ */ jsx("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
							gap: "16px"
						},
						children: recentTweets.map((t) => /* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								padding: "18px",
								borderRadius: "12px",
								border: "1px solid #e2e8f0",
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between"
							},
							children: [/* @__PURE__ */ jsx("p", {
								style: {
									margin: "0 0 12px 0",
									fontSize: "13px",
									lineHeight: 1.5,
									color: "#1e293b"
								},
								children: t.text
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									fontSize: "11px",
									color: "#64748b",
									borderTop: "1px solid #f1f5f9",
									paddingTop: "10px"
								},
								children: [/* @__PURE__ */ jsxs("span", { children: [
									"❤️ ",
									t.likes,
									" | 🔁 ",
									t.retweets
								] }), /* @__PURE__ */ jsx("a", {
									href: t.permalink,
									target: "_blank",
									rel: "noreferrer",
									style: {
										color: "#0284c7",
										fontWeight: 700
									},
									children: "View on X →"
								})]
							})]
						}, t.id))
					})] })
				]
			}) : /* @__PURE__ */ jsx("div", {
				style: {
					background: "#fff",
					padding: "48px",
					borderRadius: "14px",
					textAlign: "center",
					color: "#64748b",
					border: "1px solid #e2e8f0"
				},
				children: "Connect an X account to see profile statistics and recent tweets."
			}) }),
			activeTab === "settings" && /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "24px",
					maxWidth: "800px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						padding: "28px",
						borderRadius: "16px",
						border: "1px solid #e2e8f0"
					},
					children: [
						/* @__PURE__ */ jsx("h3", {
							style: {
								fontSize: "17px",
								fontWeight: 800,
								color: "#0f172a",
								margin: "0 0 4px 0"
							},
							children: "🔑 Direct Access Token & Secret Connection"
						}),
						/* @__PURE__ */ jsxs("p", {
							style: {
								margin: "0 0 20px 0",
								fontSize: "13px",
								color: "#64748b"
							},
							children: [
								"If you already generated an Access Token with ",
								/* @__PURE__ */ jsx("em", { children: "Read and Write" }),
								" permissions in your X Developer Portal, paste it here to connect immediately."
							]
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleManualTokenSubmit,
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "14px"
							},
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									style: {
										display: "block",
										fontSize: "12px",
										fontWeight: 700,
										color: "#475569",
										marginBottom: "4px"
									},
									children: ["Access Token ", /* @__PURE__ */ jsx("span", {
										style: { color: "#ef4444" },
										children: "*"
									})]
								}), /* @__PURE__ */ jsx("input", {
									type: "password",
									required: true,
									placeholder: "Enter Access Token...",
									value: manualToken,
									onChange: (e) => setManualToken(e.target.value),
									style: {
										width: "100%",
										padding: "10px 12px",
										borderRadius: "8px",
										border: "1px solid #cbd5e1",
										fontSize: "13px",
										boxSizing: "border-box"
									}
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: {
										display: "block",
										fontSize: "12px",
										fontWeight: 700,
										color: "#475569",
										marginBottom: "4px"
									},
									children: "Access Token Secret (Optional for OAuth 2.0 Bearer)"
								}), /* @__PURE__ */ jsx("input", {
									type: "password",
									placeholder: "Enter Access Token Secret...",
									value: manualSecret,
									onChange: (e) => setManualSecret(e.target.value),
									style: {
										width: "100%",
										padding: "10px 12px",
										borderRadius: "8px",
										border: "1px solid #cbd5e1",
										fontSize: "13px",
										boxSizing: "border-box"
									}
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: {
										display: "block",
										fontSize: "12px",
										fontWeight: 700,
										color: "#475569",
										marginBottom: "4px"
									},
									children: "X Handle / Username"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									placeholder: "coachingsinsikar",
									value: manualUsername,
									onChange: (e) => setManualUsername(e.target.value),
									style: {
										width: "100%",
										padding: "10px 12px",
										borderRadius: "8px",
										border: "1px solid #cbd5e1",
										fontSize: "13px",
										boxSizing: "border-box"
									}
								})] }),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: isSavingManual || !manualToken.trim(),
									style: {
										background: "#000",
										color: "#fff",
										border: "none",
										padding: "11px 22px",
										borderRadius: "8px",
										fontWeight: 700,
										fontSize: "13px",
										cursor: "pointer",
										alignSelf: "flex-start"
									},
									children: isSavingManual ? "Verifying..." : "Save & Connect Access Token 🔒"
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						padding: "28px",
						borderRadius: "16px",
						border: "1px solid #e2e8f0"
					},
					children: [/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "17px",
							fontWeight: 800,
							color: "#0f172a",
							margin: "0 0 16px 0"
						},
						children: "𝕏 Developer App Details"
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "14px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "12px",
									fontWeight: 700,
									color: "#475569",
									marginBottom: "4px"
								},
								children: "OAuth 2.0 Client ID (Used for \"Connect with 𝕏\" button)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								readOnly: true,
								value: clientId || "(Not set in .env)",
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#f8fafc",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "12px",
									fontWeight: 700,
									color: "#475569",
									marginBottom: "4px"
								},
								children: "OAuth 2.0 Client Secret Status"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#f8fafc",
									color: hasClientSecret ? "#059669" : "#dc2626",
									fontWeight: 700
								},
								children: hasClientSecret ? "✓ Configured & Encrypted" : "⚠️ Missing in .env"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "12px",
									fontWeight: 700,
									color: "#475569",
									marginBottom: "4px"
								},
								children: "Consumer Key (API Key for OAuth 1.0a)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								readOnly: true,
								value: consumerKey || "(Not set in .env)",
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#f8fafc",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "12px",
									fontWeight: 700,
									color: "#475569",
									marginBottom: "4px"
								},
								children: "Consumer Secret Key"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#f8fafc",
									color: hasConsumerSecret ? "#059669" : "#dc2626",
									fontWeight: 700
								},
								children: hasConsumerSecret ? "✓ Configured & Encrypted" : "⚠️ Missing in .env"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "12px",
									fontWeight: 700,
									color: "#475569",
									marginBottom: "4px"
								},
								children: "OAuth 2.0 Redirect URI (Paste in developer.twitter.com User Authentication Settings)"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "8px"
								},
								children: [/* @__PURE__ */ jsx("input", {
									type: "text",
									readOnly: true,
									value: redirectUri,
									style: {
										flex: 1,
										padding: "10px 12px",
										borderRadius: "8px",
										border: "1px solid #cbd5e1",
										fontSize: "13px",
										background: "#f8fafc",
										boxSizing: "border-box"
									}
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleCopyUri,
									style: {
										background: "#000",
										color: "#fff",
										border: "none",
										padding: "0 16px",
										borderRadius: "8px",
										fontWeight: 700,
										fontSize: "13px",
										cursor: "pointer"
									},
									children: copiedUri ? "Copied!" : "Copy"
								})]
							})] })
						]
					})]
				})]
			})
		]
	}) });
}
//#endregion
export { XHubPage as default };
