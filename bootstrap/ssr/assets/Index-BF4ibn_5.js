import AdminLayout from "./AdminLayout-BIseTwOl.js";
import { Head, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { AlertTriangle, Briefcase, Building2, FileCheck, MessageSquare, PenSquare, RefreshCw, Repeat, Send, Settings, Sparkles, ThumbsUp, UploadCloud, User } from "lucide-react";
//#region resources/js/Pages/Admin/LinkedIn/Index.jsx
function LinkedInHubPage({ needsMigration = false, isConfigured, clientId, hasClientSecret, redirectUri, account, savedOrgId = "", savedOrgName = "", pendingApprovals = [], recentShares = [], authUrl, errorMessage = null }) {
	const [activeTab, setActiveTab] = useState("approvals");
	const [approvingId, setApprovingId] = useState(null);
	const [editCommentaries, setEditCommentaries] = useState({});
	const [customCommentary, setCustomCommentary] = useState("");
	const [customImage, setCustomImage] = useState("");
	const [customLink, setCustomLink] = useState("");
	const [isPublishingCustom, setIsPublishingCustom] = useState(false);
	const [publishFeedback, setPublishFeedback] = useState({});
	const fileInputRef = useRef(null);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [showManualUrl, setShowManualUrl] = useState(false);
	const [inputClientId, setInputClientId] = useState(clientId || "");
	const [inputClientSecret, setInputClientSecret] = useState("");
	const [isSavingCreds, setIsSavingCreds] = useState(false);
	const [copiedUri, setCopiedUri] = useState(false);
	const [inputOrgId, setInputOrgId] = useState(account?.organization_id || savedOrgId || "");
	const [inputOrgName, setInputOrgName] = useState(account?.organization_name || savedOrgName || "Coachings in Sikar");
	const [inputPostAs, setInputPostAs] = useState(account?.post_as || "organization");
	const [isSavingPageSettings, setIsSavingPageSettings] = useState(false);
	const [isFetchingPages, setIsFetchingPages] = useState(false);
	const [pageSettingsFeedback, setPageSettingsFeedback] = useState(null);
	const handleAutoFetchPages = async () => {
		setIsFetchingPages(true);
		setPageSettingsFeedback(null);
		try {
			const data = await (await fetch("/api/admin/linkedin/fetch-pages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || ""
				}
			})).json();
			if (data.success && data.selected) {
				setInputOrgId(data.selected.urn);
				setInputOrgName(data.selected.name);
				setInputPostAs("organization");
				setPageSettingsFeedback(`Auto-detected: ${data.selected.name} (${data.selected.urn})!`);
				setTimeout(() => {
					router.reload({ only: ["account"] });
				}, 1500);
			} else alert(data.message || "Could not auto-fetch pages.");
		} catch (err) {
			alert("Error fetching company pages: " + err.message);
		} finally {
			setIsFetchingPages(false);
		}
	};
	const handleCopyUri = () => {
		navigator.clipboard.writeText(redirectUri);
		setCopiedUri(true);
		setTimeout(() => setCopiedUri(false), 2e3);
	};
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
	const handleApprove = async (share) => {
		setApprovingId(share.id);
		const finalCommentary = editCommentaries[share.id] !== void 0 ? editCommentaries[share.id] : share.commentary;
		try {
			const data = await (await fetch("/api/admin/linkedin/approve-publish", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || ""
				},
				body: JSON.stringify({
					share_id: share.id,
					commentary: finalCommentary,
					media_url: share.media_url,
					target_link: share.target_link,
					title: share.title
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
				setTimeout(() => {
					router.reload({ only: [
						"pendingApprovals",
						"recentShares",
						"account"
					] });
				}, 1500);
			} else alert(data.message || "Publishing to LinkedIn failed.");
		} catch (err) {
			alert("Network error: " + err.message);
		} finally {
			setApprovingId(null);
		}
	};
	const handlePublishCustom = () => {
		if (!customCommentary.trim()) {
			alert("Please enter post commentary for LinkedIn.");
			return;
		}
		setIsPublishingCustom(true);
		router.post("/admin/linkedin/custom-post", {
			commentary: customCommentary,
			media_url: customImage || null,
			target_link: customLink || null
		}, {
			onFinish: () => setIsPublishingCustom(false),
			onSuccess: () => {
				setCustomCommentary("");
				setCustomImage("");
				setCustomLink("");
			}
		});
	};
	const handleSaveCredentials = (e) => {
		e.preventDefault();
		setIsSavingCreds(true);
		router.post("/admin/linkedin/credentials", {
			client_id: inputClientId,
			client_secret: inputClientSecret
		}, { onFinish: () => setIsSavingCreds(false) });
	};
	const handleSavePageSettings = (e) => {
		e.preventDefault();
		setIsSavingPageSettings(true);
		setPageSettingsFeedback(null);
		router.post("/admin/linkedin/page-settings", {
			organization_id: inputOrgId,
			organization_name: inputOrgName,
			post_as: inputPostAs
		}, {
			onFinish: () => setIsSavingPageSettings(false),
			onSuccess: () => {
				setPageSettingsFeedback("LinkedIn Company Page settings updated successfully!");
				setTimeout(() => setPageSettingsFeedback(null), 3500);
			}
		});
	};
	const handleDisconnect = () => {
		if (confirm("Are you sure you want to disconnect this LinkedIn account?")) router.post("/admin/linkedin/disconnect");
	};
	const countHashtags = (text) => {
		const matches = text.match(/#[a-zA-Z0-9_]+/g);
		return matches ? matches.length : 0;
	};
	const liBlue = "#0a66c2";
	const isOrgMode = (account?.post_as || inputPostAs) === "organization";
	const effectiveDisplayName = isOrgMode ? account?.organization_name || inputOrgName || "Coachings in Sikar" : account?.name || "LinkedIn Member";
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "LinkedIn Hub - Company Page & Member Posts" }), /* @__PURE__ */ jsxs("div", {
		style: {
			maxWidth: "1240px",
			margin: "0 auto",
			padding: "24px 16px",
			color: "#0f172a"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
					borderRadius: "16px",
					padding: "28px 32px",
					color: "#fff",
					marginBottom: "24px",
					boxShadow: "0 10px 25px -5px rgba(10, 102, 194, 0.3)",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "space-between",
					alignItems: "center",
					gap: "20px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: { maxWidth: "640px" },
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "10px",
								marginBottom: "8px"
							},
							children: [/* @__PURE__ */ jsx(Briefcase, {
								size: 28,
								color: "#fff"
							}), /* @__PURE__ */ jsx("span", {
								style: {
									background: "rgba(255,255,255,0.2)",
									backdropFilter: "blur(8px)",
									padding: "3px 10px",
									borderRadius: "20px",
									fontSize: "11px",
									fontWeight: 800,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "LinkedIn Company Page & UGC API"
							})]
						}),
						/* @__PURE__ */ jsx("h1", {
							style: {
								fontSize: "26px",
								fontWeight: 900,
								margin: "0 0 8px 0",
								letterSpacing: "-0.5px"
							},
							children: "LinkedIn Page Management Hub"
						}),
						/* @__PURE__ */ jsxs("p", {
							style: {
								margin: 0,
								fontSize: "13.5px",
								opacity: .95,
								lineHeight: 1.5
							},
							children: [
								"Publish educational articles, coaching analyses, and student alerts directly to your official ",
								/* @__PURE__ */ jsx("strong", { children: "LinkedIn Company Page" }),
								"."
							]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						gap: "10px"
					},
					children: account ? /* @__PURE__ */ jsxs("div", {
						style: {
							background: "rgba(255,255,255,0.96)",
							color: "#0f172a",
							padding: "12px 18px",
							borderRadius: "14px",
							display: "flex",
							alignItems: "center",
							gap: "12px",
							boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								width: "40px",
								height: "40px",
								borderRadius: "10px",
								background: isOrgMode ? "#e0f2fe" : "#f1f5f9",
								color: isOrgMode ? "#0284c7" : liBlue,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "20px",
								border: "1px solid #cbd5e1"
							},
							children: isOrgMode ? /* @__PURE__ */ jsx(Building2, { size: 20 }) : /* @__PURE__ */ jsx(User, { size: 20 })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "8px"
							},
							children: [
								/* @__PURE__ */ jsx("span", {
									style: {
										fontWeight: 900,
										fontSize: "14px"
									},
									children: effectiveDisplayName
								}),
								/* @__PURE__ */ jsx("span", {
									style: {
										background: isOrgMode ? "#0a66c2" : "#64748b",
										color: "#fff",
										fontSize: "10px",
										fontWeight: 800,
										padding: "2px 6px",
										borderRadius: "6px",
										textTransform: "uppercase"
									},
									children: isOrgMode ? "Company Page" : "Personal"
								}),
								/* @__PURE__ */ jsx("span", { style: {
									width: "8px",
									height: "8px",
									borderRadius: "50%",
									background: "#10b981",
									display: "inline-block"
								} })
							]
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								fontSize: "11px",
								color: "#64748b",
								marginTop: "2px"
							},
							children: ["Target URN: ", account.effective_author_urn || account.organization_id || account.person_id]
						})] })]
					}) : authUrl && /* @__PURE__ */ jsxs("a", {
						href: authUrl,
						style: {
							background: "#fff",
							color: "#0a66c2",
							padding: "12px 22px",
							borderRadius: "12px",
							fontWeight: 800,
							fontSize: "13px",
							textDecoration: "none",
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
							transition: "all 0.2s"
						},
						children: [/* @__PURE__ */ jsx(Briefcase, {
							size: 16,
							style: { marginRight: "6px" }
						}), " Connect with LinkedIn"]
					})
				})]
			}),
			needsMigration && /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fef3c7",
					border: "1px solid #fde68a",
					borderRadius: "12px",
					padding: "14px 18px",
					marginBottom: "20px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "12px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "10px"
					},
					children: [/* @__PURE__ */ jsx(AlertTriangle, {
						size: 20,
						color: "#b45309"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", {
						style: {
							color: "#92400e",
							fontSize: "13px"
						},
						children: "Database Upgrade Required"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "12px",
							color: "#b45309"
						},
						children: "LinkedIn database tables are being installed. Click Upgrade to finalize database sync."
					})] })]
				}), /* @__PURE__ */ jsx("a", {
					href: "/app-upgrade",
					style: {
						background: "#d97706",
						color: "#fff",
						padding: "6px 14px",
						borderRadius: "8px",
						fontSize: "12px",
						fontWeight: 700,
						textDecoration: "none"
					},
					children: "Run /app-upgrade"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					gap: "8px",
					borderBottom: "2px solid #e2e8f0",
					marginBottom: "24px",
					overflowX: "auto"
				},
				children: [
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveTab("approvals"),
						style: {
							padding: "12px 18px",
							border: "none",
							background: "transparent",
							fontSize: "13px",
							fontWeight: 800,
							cursor: "pointer",
							color: activeTab === "approvals" ? "#0a66c2" : "#64748b",
							borderBottom: activeTab === "approvals" ? "3px solid #0a66c2" : "3px solid transparent",
							marginBottom: "-2px",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							whiteSpace: "nowrap",
							flexShrink: 0
						},
						children: [
							/* @__PURE__ */ jsx(FileCheck, {
								size: 16,
								style: { marginRight: "6px" }
							}),
							" Approvals Queue",
							pendingApprovals.length > 0 && /* @__PURE__ */ jsx("span", {
								style: {
									background: "#0a66c2",
									color: "#fff",
									borderRadius: "12px",
									padding: "1px 7px",
									fontSize: "10px",
									fontWeight: 900
								},
								children: pendingApprovals.length
							})
						]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveTab("composer"),
						style: {
							padding: "12px 18px",
							border: "none",
							background: "transparent",
							fontSize: "13px",
							fontWeight: 800,
							cursor: "pointer",
							color: activeTab === "composer" ? "#0a66c2" : "#64748b",
							borderBottom: activeTab === "composer" ? "3px solid #0a66c2" : "3px solid transparent",
							marginBottom: "-2px",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							whiteSpace: "nowrap",
							flexShrink: 0
						},
						children: [/* @__PURE__ */ jsx(PenSquare, {
							size: 16,
							style: { marginRight: "6px" }
						}), " Direct Post Composer"]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveTab("company_page"),
						style: {
							padding: "12px 18px",
							border: "none",
							background: "transparent",
							fontSize: "13px",
							fontWeight: 800,
							cursor: "pointer",
							color: activeTab === "company_page" ? "#0a66c2" : "#64748b",
							borderBottom: activeTab === "company_page" ? "3px solid #0a66c2" : "3px solid transparent",
							marginBottom: "-2px",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							whiteSpace: "nowrap",
							flexShrink: 0
						},
						children: [
							/* @__PURE__ */ jsx(Building2, {
								size: 16,
								style: { marginRight: "6px" }
							}),
							" LinkedIn Page & Account",
							account?.organization_id && /* @__PURE__ */ jsx("span", {
								style: {
									background: "#e0f2fe",
									color: "#0369a1",
									borderRadius: "12px",
									padding: "1px 7px",
									fontSize: "10px",
									fontWeight: 800
								},
								children: "Page Active"
							})
						]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveTab("settings"),
						style: {
							padding: "12px 18px",
							border: "none",
							background: "transparent",
							fontSize: "13px",
							fontWeight: 800,
							cursor: "pointer",
							color: activeTab === "settings" ? "#0a66c2" : "#64748b",
							borderBottom: activeTab === "settings" ? "3px solid #0a66c2" : "3px solid transparent",
							marginBottom: "-2px",
							display: "flex",
							alignItems: "center",
							gap: "6px",
							whiteSpace: "nowrap",
							flexShrink: 0
						},
						children: [/* @__PURE__ */ jsx(Settings, {
							size: 16,
							style: { marginRight: "6px" }
						}), " App & API Settings"]
					})
				]
			}),
			activeTab === "approvals" && /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "16px"
					},
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						style: {
							fontSize: "18px",
							fontWeight: 800,
							margin: "0 0 4px 0"
						},
						children: "Pending LinkedIn Approvals"
					}), /* @__PURE__ */ jsxs("p", {
						style: {
							fontSize: "12px",
							color: "#64748b",
							margin: 0
						},
						children: [
							"Review professional educational updates and coaching insights drafted for ",
							/* @__PURE__ */ jsx("strong", { children: effectiveDisplayName }),
							"."
						]
					})] }), /* @__PURE__ */ jsx("a", {
						href: "/admin/posts",
						style: {
							background: "#f1f5f9",
							color: "#334155",
							padding: "8px 14px",
							borderRadius: "8px",
							fontSize: "12px",
							fontWeight: 700,
							textDecoration: "none"
						},
						children: "+ Write New Post"
					})]
				}),
				pendingApprovals.length === 0 ? /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						border: "1px dashed #cbd5e1",
						borderRadius: "16px",
						padding: "48px 24px",
						textAlign: "center",
						color: "#64748b"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								justifyContent: "center",
								marginBottom: "12px"
							},
							children: /* @__PURE__ */ jsx(Briefcase, {
								size: 36,
								color: "#64748b"
							})
						}),
						/* @__PURE__ */ jsx("h3", {
							style: {
								fontSize: "16px",
								fontWeight: 700,
								color: "#1e293b",
								margin: "0 0 6px 0"
							},
							children: "No pending LinkedIn approvals"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								fontSize: "13px",
								margin: "0 0 16px 0",
								maxWidth: "440px",
								marginLeft: "auto",
								marginRight: "auto"
							},
							children: "When you publish or draft a blog post, an authoritative LinkedIn post draft will automatically be generated here for your review and approval."
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setActiveTab("composer"),
							style: {
								background: liBlue,
								color: "#fff",
								border: "none",
								padding: "10px 20px",
								borderRadius: "10px",
								fontWeight: 700,
								fontSize: "12.5px",
								cursor: "pointer"
							},
							children: "Create Standalone Post →"
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
						gap: "20px"
					},
					children: pendingApprovals.map((share) => {
						const currentCommentary = editCommentaries[share.id] !== void 0 ? editCommentaries[share.id] : share.commentary;
						const isApproving = approvingId === share.id;
						const feedback = publishFeedback[share.id];
						return /* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								borderRadius: "16px",
								border: "1px solid #e2e8f0",
								overflow: "hidden",
								boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
								display: "flex",
								flexDirection: "column"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										padding: "12px 16px",
										display: "flex",
										alignItems: "center",
										gap: "10px",
										borderBottom: "1px solid #f1f5f9"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											width: "38px",
											height: "38px",
											borderRadius: "50%",
											background: liBlue,
											color: "#fff",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontWeight: 800,
											fontSize: "14px"
										},
										children: "in"
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											flex: 1,
											minWidth: 0
										},
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "6px"
											},
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													fontWeight: 800,
													fontSize: "13px",
													color: "#0f172a"
												},
												children: effectiveDisplayName
											}), /* @__PURE__ */ jsx("span", {
												style: {
													background: isOrgMode ? "#e0f2fe" : "#f1f5f9",
													color: isOrgMode ? "#0284c7" : "#64748b",
													fontSize: "10px",
													fontWeight: 800,
													padding: "1px 6px",
													borderRadius: "4px"
												},
												children: isOrgMode ? "Company Page" : "Member Profile"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "11px",
												color: "#64748b"
											},
											children: ["Education & Institute Advisory • ", share.created_at]
										})]
									})]
								}),
								share.media_url && /* @__PURE__ */ jsx("div", {
									style: {
										width: "100%",
										height: "220px",
										background: "#f8fafc",
										overflow: "hidden"
									},
									children: /* @__PURE__ */ jsx("img", {
										src: share.media_url,
										alt: share.title,
										style: {
											width: "100%",
											height: "100%",
											objectFit: "cover"
										}
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										padding: "16px",
										flex: 1,
										display: "flex",
										flexDirection: "column"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: "6px"
											},
											children: [/* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: "11px",
													fontWeight: 800,
													color: "#64748b"
												},
												children: [
													"POST COMMENTARY (",
													currentCommentary.length,
													" / 3000 chars)"
												]
											}), /* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: "11px",
													color: "#0a66c2",
													fontWeight: 700
												},
												children: [countHashtags(currentCommentary), " hashtags"]
											})]
										}),
										/* @__PURE__ */ jsx("textarea", {
											rows: 7,
											value: currentCommentary,
											onChange: (e) => setEditCommentaries({
												...editCommentaries,
												[share.id]: e.target.value
											}),
											style: {
												width: "100%",
												padding: "10px",
												borderRadius: "8px",
												border: "1px solid #cbd5e1",
												fontSize: "12px",
												lineHeight: 1.45,
												marginBottom: "12px",
												fontFamily: "inherit",
												resize: "vertical"
											}
										}),
										feedback?.success && /* @__PURE__ */ jsxs("div", {
											style: {
												padding: "10px",
												background: "#ecfdf5",
												border: "1px solid #a7f3d0",
												borderRadius: "8px",
												color: "#065f46",
												fontSize: "12px",
												marginBottom: "12px",
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center"
											},
											children: [/* @__PURE__ */ jsxs("span", { children: [
												"Published to LinkedIn ",
												isOrgMode ? "Company Page" : "",
												"!"
											] }), feedback.permalink && /* @__PURE__ */ jsx("a", {
												href: feedback.permalink,
												target: "_blank",
												rel: "noopener noreferrer",
												style: {
													color: "#047857",
													fontWeight: 800
												},
												children: "View Post ↗"
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											style: { marginTop: "auto" },
											children: /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleApprove(share),
												disabled: isApproving || !account,
												style: {
													width: "100%",
													background: !account ? "#94a3b8" : liBlue,
													color: "#fff",
													border: "none",
													padding: "10px",
													borderRadius: "8px",
													fontWeight: 800,
													fontSize: "12.5px",
													cursor: !account ? "not-allowed" : "pointer",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													gap: "6px"
												},
												children: isApproving ? "Publishing to LinkedIn..." : `Approve & Publish to ${isOrgMode ? "Company Page" : "LinkedIn"}`
											})
										})
									]
								})
							]
						}, share.id);
					})
				}),
				recentShares.length > 0 && /* @__PURE__ */ jsxs("div", {
					style: { marginTop: "40px" },
					children: [/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "16px",
							fontWeight: 800,
							margin: "0 0 12px 0"
						},
						children: "Recent LinkedIn Publishing Audit"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							background: "#fff",
							borderRadius: "12px",
							border: "1px solid #e2e8f0",
							overflowX: "auto"
						},
						children: /* @__PURE__ */ jsxs("table", {
							style: {
								width: "100%",
								minWidth: "600px",
								borderCollapse: "collapse",
								fontSize: "12.5px"
							},
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								style: {
									background: "#f8fafc",
									borderBottom: "1px solid #e2e8f0",
									textAlign: "left",
									color: "#64748b"
								},
								children: [
									/* @__PURE__ */ jsx("th", {
										style: {
											padding: "10px 16px",
											fontWeight: 700
										},
										children: "Post Title / Snippet"
									}),
									/* @__PURE__ */ jsx("th", {
										style: {
											padding: "10px 16px",
											fontWeight: 700
										},
										children: "Status"
									}),
									/* @__PURE__ */ jsx("th", {
										style: {
											padding: "10px 16px",
											fontWeight: 700
										},
										children: "Published At"
									}),
									/* @__PURE__ */ jsx("th", {
										style: {
											padding: "10px 16px",
											fontWeight: 700
										},
										children: "Action"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", { children: recentShares.map((s) => /* @__PURE__ */ jsxs("tr", {
								style: { borderBottom: "1px solid #f1f5f9" },
								children: [
									/* @__PURE__ */ jsx("td", {
										style: {
											padding: "12px 16px",
											fontWeight: 600,
											color: "#0f172a"
										},
										children: s.post_title || s.commentary?.slice(0, 45) + "..."
									}),
									/* @__PURE__ */ jsx("td", {
										style: { padding: "12px 16px" },
										children: /* @__PURE__ */ jsx("span", {
											style: {
												background: s.status === "published" ? "#ecfdf5" : "#fef2f2",
												color: s.status === "published" ? "#059669" : "#dc2626",
												padding: "3px 8px",
												borderRadius: "6px",
												fontSize: "11px",
												fontWeight: 800,
												textTransform: "uppercase"
											},
											children: s.status
										})
									}),
									/* @__PURE__ */ jsx("td", {
										style: {
											padding: "12px 16px",
											color: "#64748b",
											fontSize: "12px"
										},
										children: s.published_at || "Just now"
									}),
									/* @__PURE__ */ jsx("td", {
										style: { padding: "12px 16px" },
										children: s.permalink ? /* @__PURE__ */ jsx("a", {
											href: s.permalink,
											target: "_blank",
											rel: "noopener noreferrer",
											style: {
												color: "#0a66c2",
												fontWeight: 800,
												textDecoration: "none"
											},
											children: "View on LinkedIn ↗"
										}) : /* @__PURE__ */ jsx("span", {
											style: { color: "#94a3b8" },
											children: "—"
										})
									})
								]
							}, s.id)) })]
						})
					})]
				})
			] }),
			activeTab === "composer" && /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start",
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						padding: "24px",
						borderRadius: "16px",
						border: "1px solid #e2e8f0"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start",
								marginBottom: "16px"
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								style: {
									fontSize: "18px",
									fontWeight: 800,
									margin: "0 0 4px 0"
								},
								children: "Create Standalone LinkedIn Post"
							}), /* @__PURE__ */ jsx("p", {
								style: {
									fontSize: "12px",
									color: "#64748b",
									margin: 0
								},
								children: "Write thought leadership articles, institute alerts, or career guidance directly for your LinkedIn audience."
							})] }), /* @__PURE__ */ jsxs("div", {
								style: {
									background: isOrgMode ? "#e0f2fe" : "#f1f5f9",
									color: isOrgMode ? "#0369a1" : "#475569",
									padding: "4px 10px",
									borderRadius: "8px",
									fontSize: "11px",
									fontWeight: 800
								},
								children: ["Posting As: ", isOrgMode ? "Company Page" : "Personal Profile"]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: { marginBottom: "20px" },
							children: [
								/* @__PURE__ */ jsx("label", {
									style: {
										display: "block",
										fontSize: "11px",
										fontWeight: 800,
										color: "#475569",
										marginBottom: "6px"
									},
									children: "ATTACH IMAGE (OPTIONAL)"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									ref: fileInputRef,
									onChange: handleImageUpload,
									accept: "image/png,image/jpeg,image/webp",
									style: { display: "none" }
								}),
								/* @__PURE__ */ jsxs("div", {
									onClick: () => fileInputRef.current?.click(),
									style: {
										border: "2px dashed #cbd5e1",
										borderRadius: "12px",
										padding: "24px",
										textAlign: "center",
										cursor: "pointer",
										background: "#f8fafc",
										transition: "all 0.2s"
									},
									onMouseEnter: (e) => e.currentTarget.style.borderColor = "#0a66c2",
									onMouseLeave: (e) => e.currentTarget.style.borderColor = "#cbd5e1",
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												display: "flex",
												justifyContent: "center",
												marginBottom: "8px"
											},
											children: /* @__PURE__ */ jsx(UploadCloud, {
												size: 32,
												color: "#0a66c2"
											})
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontWeight: 800,
												fontSize: "13px",
												color: "#1e293b"
											},
											children: isUploadingImage ? "Uploading & Optimizing WebP..." : "Click to Upload Image from Device"
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "11px",
												color: "#64748b",
												marginTop: "4px"
											},
											children: "Automatically converted to WebP and registered via LinkedIn Digital Media Asset API"
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										marginTop: "8px",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center"
									},
									children: [/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setShowManualUrl(!showManualUrl),
										style: {
											background: "transparent",
											border: "none",
											color: "#64748b",
											fontSize: "11px",
											cursor: "pointer",
											textDecoration: "underline"
										},
										children: showManualUrl ? "Hide URL input" : "Or enter image URL directly"
									}), customImage && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setCustomImage(""),
										style: {
											background: "transparent",
											border: "none",
											color: "#ef4444",
											fontSize: "11px",
											cursor: "pointer"
										},
										children: "Remove Photo"
									})]
								}),
								showManualUrl && /* @__PURE__ */ jsx("input", {
									type: "text",
									value: customImage,
									onChange: (e) => setCustomImage(e.target.value),
									placeholder: "https://coachingsinsikar.com/uploads/...",
									style: {
										width: "100%",
										marginTop: "8px",
										padding: "8px 12px",
										borderRadius: "8px",
										border: "1px solid #cbd5e1",
										fontSize: "12px"
									}
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: { marginBottom: "20px" },
							children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "11px",
									fontWeight: 800,
									color: "#475569",
									marginBottom: "6px"
								},
								children: "ARTICLE / DESTINATION LINK (OPTIONAL)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: customLink,
								onChange: (e) => setCustomLink(e.target.value),
								placeholder: "https://coachingsinsikar.com/blog/...",
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "12.5px"
								}
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: { marginBottom: "20px" },
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "6px"
								},
								children: [/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#475569"
									},
									children: "POST COMMENTARY (MAX 3,000 CHARACTERS) *"
								}), /* @__PURE__ */ jsxs("span", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: customCommentary.length > 3e3 ? "#ef4444" : "#64748b"
									},
									children: [customCommentary.length, " / 3000"]
								})]
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 8,
								value: customCommentary,
								onChange: (e) => setCustomCommentary(e.target.value),
								placeholder: "Write an authoritative post with key takeaways, bullet points, and hashtags for your coaching network...",
								style: {
									width: "100%",
									padding: "12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "12.5px",
									lineHeight: 1.5,
									fontFamily: "inherit"
								}
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: handlePublishCustom,
							disabled: isPublishingCustom || !customCommentary.trim() || !account,
							style: {
								width: "100%",
								background: !customCommentary.trim() || !account ? "#94a3b8" : liBlue,
								color: "#fff",
								border: "none",
								padding: "14px",
								borderRadius: "10px",
								fontWeight: 800,
								fontSize: "13px",
								cursor: !customCommentary.trim() || !account ? "not-allowed" : "pointer",
								boxShadow: "0 4px 12px rgba(10, 102, 194, 0.25)"
							},
							children: isPublishingCustom ? "Publishing to LinkedIn..." : `Publish to ${effectiveDisplayName}`
						})
					]
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "11px",
						fontWeight: 800,
						color: "#64748b",
						marginBottom: "8px",
						letterSpacing: "0.5px"
					},
					children: "LINKEDIN FEED PREVIEW"
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						borderRadius: "16px",
						border: "1px solid #e2e8f0",
						overflow: "hidden",
						boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "12px 14px",
								display: "flex",
								alignItems: "center",
								gap: "10px"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									width: "38px",
									height: "38px",
									borderRadius: isOrgMode ? "8px" : "50%",
									background: liBlue,
									color: "#fff",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontWeight: 800,
									fontSize: "14px"
								},
								children: isOrgMode ? /* @__PURE__ */ jsx(Building2, { size: 16 }) : "in"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "6px"
								},
								children: [/* @__PURE__ */ jsx("span", {
									style: {
										fontWeight: 800,
										fontSize: "13px",
										color: "#0f172a"
									},
									children: effectiveDisplayName
								}), /* @__PURE__ */ jsx("span", {
									style: {
										background: isOrgMode ? "#e0f2fe" : "#f1f5f9",
										color: isOrgMode ? "#0284c7" : "#64748b",
										fontSize: "9.5px",
										fontWeight: 800,
										padding: "1px 5px",
										borderRadius: "4px"
									},
									children: isOrgMode ? "Company Page" : "Member"
								})]
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "10.5px",
									color: "#64748b"
								},
								children: "Now • Public"
							})] })]
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								padding: "0 14px 12px 14px",
								fontSize: "12.5px",
								lineHeight: 1.5,
								color: "#1e293b",
								whiteSpace: "pre-wrap",
								maxHeight: "160px",
								overflowY: "auto"
							},
							children: customCommentary || "Post commentary preview will appear here with professional takeaways and hashtags..."
						}),
						customImage && /* @__PURE__ */ jsx("div", {
							style: {
								width: "100%",
								height: "220px",
								background: "#f8fafc",
								overflow: "hidden"
							},
							children: /* @__PURE__ */ jsx("img", {
								src: customImage,
								alt: "Preview",
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "8px 14px",
								display: "flex",
								justifyContent: "space-around",
								borderTop: "1px solid #f1f5f9",
								fontSize: "12px",
								color: "#64748b",
								fontWeight: 700
							},
							children: [
								/* @__PURE__ */ jsxs("span", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [/* @__PURE__ */ jsx(ThumbsUp, { size: 13 }), " Like"]
								}),
								/* @__PURE__ */ jsxs("span", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [/* @__PURE__ */ jsx(MessageSquare, { size: 13 }), " Comment"]
								}),
								/* @__PURE__ */ jsxs("span", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [/* @__PURE__ */ jsx(Repeat, { size: 13 }), " Repost"]
								}),
								/* @__PURE__ */ jsxs("span", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "4px"
									},
									children: [/* @__PURE__ */ jsx(Send, { size: 13 }), " Send"]
								})
							]
						})
					]
				})] })]
			}),
			activeTab === "company_page" && /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
					gap: "24px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						borderRadius: "16px",
						border: "1px solid #e2e8f0",
						padding: "28px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "10px",
								marginBottom: "12px"
							},
							children: [/* @__PURE__ */ jsx(Building2, {
								size: 24,
								color: "#0a66c2"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								style: {
									fontSize: "18px",
									fontWeight: 900,
									margin: 0
								},
								children: "LinkedIn Company Page Settings"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "12px",
									color: "#64748b"
								},
								children: "Manage the organization page identity used for publishing blogs & updates."
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								background: "#f0fdf4",
								border: "1px solid #bbf7d0",
								borderRadius: "12px",
								padding: "14px 16px",
								marginBottom: "20px",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								gap: "12px",
								flexWrap: "wrap"
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontWeight: 800,
									fontSize: "13px",
									color: "#166534",
									display: "flex",
									alignItems: "center",
									gap: "6px"
								},
								children: /* @__PURE__ */ jsxs("span", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "6px"
									},
									children: [/* @__PURE__ */ jsx(Sparkles, {
										size: 14,
										color: "#16a34a"
									}), " Auto-Fetch Ready"]
								})
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "11.5px",
									color: "#15803d",
									marginTop: "2px"
								},
								children: "LinkedIn login karte hi aapka Company Page auto-detect ho jata hai, ya aap abhi direct fetch kar sakte hain:"
							})] }), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handleAutoFetchPages,
								disabled: isFetchingPages || !account,
								style: {
									background: "#16a34a",
									color: "#fff",
									border: "none",
									padding: "8px 14px",
									borderRadius: "8px",
									fontWeight: 800,
									fontSize: "12px",
									cursor: !account ? "not-allowed" : "pointer",
									display: "flex",
									alignItems: "center",
									gap: "6px",
									boxShadow: "0 2px 6px rgba(22, 163, 74, 0.25)"
								},
								children: [/* @__PURE__ */ jsx(RefreshCw, {
									size: 14,
									className: isFetchingPages ? "animate-spin" : ""
								}), /* @__PURE__ */ jsx("span", { children: isFetchingPages ? "Detecting Pages..." : "Auto-Fetch My Company Pages" })]
							})]
						}),
						pageSettingsFeedback && /* @__PURE__ */ jsx("div", {
							style: {
								padding: "10px 14px",
								background: "#ecfdf5",
								border: "1px solid #a7f3d0",
								borderRadius: "8px",
								color: "#065f46",
								fontSize: "12px",
								fontWeight: 700,
								marginBottom: "16px"
							},
							children: pageSettingsFeedback
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleSavePageSettings,
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: "20px" },
									children: [/* @__PURE__ */ jsx("label", {
										style: {
											display: "block",
											fontSize: "11px",
											fontWeight: 800,
											color: "#475569",
											marginBottom: "8px"
										},
										children: "PUBLISHING TARGET MODE *"
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											display: "grid",
											gridTemplateColumns: "1fr 1fr",
											gap: "10px"
										},
										children: [/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setInputPostAs("organization"),
											style: {
												padding: "12px",
												borderRadius: "10px",
												border: inputPostAs === "organization" ? "2px solid #0a66c2" : "1px solid #cbd5e1",
												background: inputPostAs === "organization" ? "#eff6ff" : "#fff",
												color: inputPostAs === "organization" ? "#1d4ed8" : "#475569",
												fontWeight: 800,
												fontSize: "12px",
												cursor: "pointer",
												textAlign: "left",
												display: "flex",
												flexDirection: "column",
												gap: "2px"
											},
											children: [/* @__PURE__ */ jsx("span", { children: "Company Page" }), /* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "10px",
													fontWeight: 500,
													color: "#64748b"
												},
												children: "(Recommended for Brand)"
											})]
										}), /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setInputPostAs("person"),
											style: {
												padding: "12px",
												borderRadius: "10px",
												border: inputPostAs === "person" ? "2px solid #0a66c2" : "1px solid #cbd5e1",
												background: inputPostAs === "person" ? "#eff6ff" : "#fff",
												color: inputPostAs === "person" ? "#1d4ed8" : "#475569",
												fontWeight: 800,
												fontSize: "12px",
												cursor: "pointer",
												textAlign: "left",
												display: "flex",
												flexDirection: "column",
												gap: "2px"
											},
											children: [/* @__PURE__ */ jsx("span", { children: "Member Profile" }), /* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "10px",
													fontWeight: 500,
													color: "#64748b"
												},
												children: "(Personal Feed)"
											})]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: "16px" },
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: "6px"
											},
											children: [/* @__PURE__ */ jsx("label", {
												style: {
													fontSize: "11px",
													fontWeight: 800,
													color: "#475569"
												},
												children: "ORGANIZATION ID / PAGE URL / VANITY HANDLE"
											}), (account?.organization_id || savedOrgId) && /* @__PURE__ */ jsx("span", {
												style: {
													background: "#ecfdf5",
													color: "#047857",
													padding: "2px 8px",
													borderRadius: "6px",
													fontSize: "10.5px",
													fontWeight: 800
												},
												children: "✓ Permanently Saved"
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											value: inputOrgId,
											onChange: (e) => setInputOrgId(e.target.value),
											placeholder: "e.g. 12345678, coachings-in-sikar, ya poora Page URL",
											style: {
												width: "100%",
												padding: "10px 12px",
												borderRadius: "8px",
												border: "1px solid #cbd5e1",
												fontSize: "13px",
												fontFamily: "monospace"
											}
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "11px",
												color: "#64748b",
												marginTop: "4px"
											},
											children: [/* @__PURE__ */ jsx("strong", { children: "Permanent Storage:" }), " Ek baar yahan apna ID, Page URL ya handle save kar lene ke baad ye system configuration me permanent save rahega — bar-bar enter karne ki jarurat nahi hogi!"]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: "20px" },
									children: [/* @__PURE__ */ jsx("label", {
										style: {
											display: "block",
											fontSize: "11px",
											fontWeight: 800,
											color: "#475569",
											marginBottom: "6px"
										},
										children: "COMPANY / PAGE NAME"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: inputOrgName,
										onChange: (e) => setInputOrgName(e.target.value),
										placeholder: "Coachings in Sikar",
										style: {
											width: "100%",
											padding: "10px 12px",
											borderRadius: "8px",
											border: "1px solid #cbd5e1",
											fontSize: "13px"
										}
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: isSavingPageSettings,
									style: {
										width: "100%",
										background: liBlue,
										color: "#fff",
										border: "none",
										padding: "12px",
										borderRadius: "8px",
										fontWeight: 800,
										fontSize: "13px",
										cursor: "pointer"
									},
									children: isSavingPageSettings ? "Saving Settings..." : "Save LinkedIn Page Settings"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								marginTop: "24px",
								background: "#f8fafc",
								border: "1px solid #e2e8f0",
								borderRadius: "12px",
								padding: "16px"
							},
							children: [
								/* @__PURE__ */ jsx("div", {
									style: {
										fontWeight: 800,
										fontSize: "12px",
										color: "#0f172a",
										marginBottom: "4px"
									},
									children: "Company Page Verification Link:"
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "11.5px",
										color: "#475569",
										lineHeight: 1.5,
										marginBottom: "10px"
									},
									children: "To link your Company Page (Coachings in Sikar) to your developer app, open the verification link while logged in as the Page Admin:"
								}),
								/* @__PURE__ */ jsx("a", {
									href: "https://www.linkedin.com/developers/apps/verification/68e868d0-1a74-4df8-8d19-ef9019c559ec",
									target: "_blank",
									rel: "noopener noreferrer",
									style: {
										display: "inline-flex",
										alignItems: "center",
										gap: "6px",
										background: "#fff",
										border: "1px solid #0a66c2",
										color: "#0a66c2",
										padding: "6px 12px",
										borderRadius: "6px",
										fontSize: "11.5px",
										fontWeight: 800,
										textDecoration: "none"
									},
									children: "Open Page Verification URL ↗"
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						borderRadius: "16px",
						border: "1px solid #e2e8f0",
						padding: "28px"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "10px",
							marginBottom: "16px"
						},
						children: [/* @__PURE__ */ jsx(User, {
							size: 24,
							color: "#0a66c2"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							style: {
								fontSize: "18px",
								fontWeight: 900,
								margin: 0
							},
							children: "Connected LinkedIn Administrator"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "12px",
								color: "#64748b"
							},
							children: "OAuth 2.0 authorized member managing publishing permissions."
						})] })]
					}), account ? /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "16px",
								marginBottom: "20px"
							},
							children: [account.avatar ? /* @__PURE__ */ jsx("img", {
								src: account.avatar,
								alt: account.name,
								style: {
									width: "64px",
									height: "64px",
									borderRadius: "50%",
									objectFit: "cover",
									border: "3px solid #0a66c2"
								}
							}) : /* @__PURE__ */ jsx("div", {
								style: {
									width: "64px",
									height: "64px",
									borderRadius: "50%",
									background: liBlue,
									color: "#fff",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "24px",
									fontWeight: 900
								},
								children: "in"
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "16px",
										fontWeight: 900,
										margin: "0 0 2px 0"
									},
									children: account.name
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "12px",
										color: "#64748b",
										marginBottom: "4px"
									},
									children: account.email || "OpenID Email Verified"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: "11px",
										color: "#94a3b8",
										fontFamily: "monospace"
									},
									children: ["URN: ", account.person_id]
								})
							] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								background: "#f8fafc",
								padding: "14px",
								borderRadius: "10px",
								border: "1px solid #e2e8f0",
								marginBottom: "20px"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "11px",
									fontWeight: 800,
									color: "#64748b",
									marginBottom: "4px"
								},
								children: "CONNECTION STATUS"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "13px",
									fontWeight: 700,
									color: "#10b981",
									display: "flex",
									alignItems: "center",
									gap: "6px"
								},
								children: [/* @__PURE__ */ jsx("span", { style: {
									width: "8px",
									height: "8px",
									borderRadius: "50%",
									background: "#10b981"
								} }), "Authorized & Ready to Publish via UGC Posts API"]
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: handleDisconnect,
							style: {
								background: "#fef2f2",
								color: "#dc2626",
								border: "1px solid #fecaca",
								padding: "10px 16px",
								borderRadius: "8px",
								fontWeight: 700,
								fontSize: "12.5px",
								cursor: "pointer",
								width: "100%"
							},
							children: "Disconnect LinkedIn Account"
						})
					] }) : /* @__PURE__ */ jsxs("div", {
						style: {
							textAlign: "center",
							padding: "30px 10px"
						},
						children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									justifyContent: "center",
									marginBottom: "10px"
								},
								children: /* @__PURE__ */ jsx(Briefcase, {
									size: 36,
									color: "#0a66c2"
								})
							}),
							/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "15px",
									fontWeight: 800,
									margin: "0 0 6px 0"
								},
								children: "No LinkedIn Account Connected"
							}),
							/* @__PURE__ */ jsx("p", {
								style: {
									fontSize: "12px",
									color: "#64748b",
									margin: "0 0 16px 0"
								},
								children: "Connect your LinkedIn member account using official OAuth 2.0 OpenID Connect."
							}),
							authUrl ? /* @__PURE__ */ jsx("a", {
								href: authUrl,
								style: {
									background: liBlue,
									color: "#fff",
									padding: "10px 20px",
									borderRadius: "8px",
									fontWeight: 800,
									fontSize: "12.5px",
									textDecoration: "none",
									display: "inline-block"
								},
								children: "Connect with LinkedIn →"
							}) : /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setActiveTab("settings"),
								style: {
									background: "#0f172a",
									color: "#fff",
									padding: "8px 16px",
									borderRadius: "8px",
									border: "none",
									fontWeight: 700,
									fontSize: "12px"
								},
								children: "Configure Client ID in Settings →"
							})
						]
					})]
				})]
			}),
			activeTab === "settings" && /* @__PURE__ */ jsxs("div", {
				style: {
					maxWidth: "640px",
					margin: "0 auto"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						padding: "24px",
						borderRadius: "16px",
						border: "1px solid #e2e8f0",
						marginBottom: "24px"
					},
					children: [
						/* @__PURE__ */ jsx("h2", {
							style: {
								fontSize: "18px",
								fontWeight: 800,
								margin: "0 0 6px 0"
							},
							children: "LinkedIn App Credentials"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								fontSize: "12px",
								color: "#64748b",
								margin: "0 0 20px 0"
							},
							children: "Enter your credentials from the official LinkedIn Developer Portal."
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleSaveCredentials,
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: "16px" },
									children: [/* @__PURE__ */ jsx("label", {
										style: {
											display: "block",
											fontSize: "11px",
											fontWeight: 800,
											color: "#475569",
											marginBottom: "6px"
										},
										children: "LINKEDIN CLIENT ID *"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: inputClientId,
										onChange: (e) => setInputClientId(e.target.value),
										required: true,
										style: {
											width: "100%",
											padding: "10px 12px",
											borderRadius: "8px",
											border: "1px solid #cbd5e1",
											fontSize: "13px"
										},
										placeholder: "e.g. 86jg1ugggbwrzn"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: "16px" },
									children: [/* @__PURE__ */ jsxs("label", {
										style: {
											display: "block",
											fontSize: "11px",
											fontWeight: 800,
											color: "#475569",
											marginBottom: "6px"
										},
										children: ["LINKEDIN CLIENT SECRET ", hasClientSecret && "(Configured in .env)"]
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										value: inputClientSecret,
										onChange: (e) => setInputClientSecret(e.target.value),
										placeholder: hasClientSecret ? "••••••••••••••••••••••••" : "Enter Client Secret",
										style: {
											width: "100%",
											padding: "10px 12px",
											borderRadius: "8px",
											border: "1px solid #cbd5e1",
											fontSize: "13px"
										}
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: "20px" },
									children: [/* @__PURE__ */ jsx("label", {
										style: {
											display: "block",
											fontSize: "11px",
											fontWeight: 800,
											color: "#475569",
											marginBottom: "6px"
										},
										children: "OAUTH REDIRECT URL (ADD TO LINKEDIN APP SETTINGS)"
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
												fontSize: "12px",
												background: "#f8fafc",
												color: "#64748b"
											}
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: handleCopyUri,
											style: {
												padding: "10px 16px",
												background: "#f1f5f9",
												border: "1px solid #cbd5e1",
												borderRadius: "8px",
												fontWeight: 700,
												fontSize: "12px",
												cursor: "pointer"
											},
											children: copiedUri ? "Copied!" : "Copy"
										})]
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: isSavingCreds,
									style: {
										background: "#0f172a",
										color: "#fff",
										border: "none",
										padding: "12px 20px",
										borderRadius: "8px",
										fontWeight: 700,
										fontSize: "13px",
										cursor: "pointer"
									},
									children: isSavingCreds ? "Saving..." : "Save Credentials"
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#f8fafc",
						padding: "20px",
						borderRadius: "12px",
						border: "1px solid #e2e8f0",
						fontSize: "12px",
						lineHeight: 1.6,
						color: "#475569"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							fontWeight: 800,
							color: "#0f172a",
							marginBottom: "8px"
						},
						children: "LinkedIn Developer Portal Steps:"
					}), /* @__PURE__ */ jsxs("ol", {
						style: {
							paddingLeft: "18px",
							margin: 0
						},
						children: [
							/* @__PURE__ */ jsxs("li", { children: [
								"Go to ",
								/* @__PURE__ */ jsx("a", {
									href: "https://www.linkedin.com/developers/apps",
									target: "_blank",
									rel: "noopener noreferrer",
									style: {
										color: "#0a66c2",
										fontWeight: 700
									},
									children: "linkedin.com/developers/apps"
								}),
								" and select your app."
							] }),
							/* @__PURE__ */ jsxs("li", { children: [
								"Under the ",
								/* @__PURE__ */ jsx("strong", { children: "Products" }),
								" tab, request access to:",
								/* @__PURE__ */ jsxs("ul", {
									style: { margin: "4px 0" },
									children: [
										/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("strong", { children: "Sign In with LinkedIn using OpenID Connect" }) }),
										/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("strong", { children: "Share on LinkedIn" }) }),
										/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Community Management API" }), " (for Company Pages)"] })
									]
								})
							] }),
							/* @__PURE__ */ jsxs("li", { children: [
								"Under the ",
								/* @__PURE__ */ jsx("strong", { children: "Auth" }),
								" tab, add the Redirect URL shown above."
							] }),
							/* @__PURE__ */ jsxs("li", { children: [
								"Under the ",
								/* @__PURE__ */ jsx("strong", { children: "Settings" }),
								" tab, associate your LinkedIn Page (Coachings in Sikar) via Page Verification."
							] })
						]
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { LinkedInHubPage as default };
