import AdminLayout from "./AdminLayout-B4V0SEL8.js";
import { Head, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { AlertTriangle, Bookmark, Camera, FileCheck, Heart, MessageSquare, PenSquare, Settings, UploadCloud, User } from "lucide-react";
//#region resources/js/Pages/Admin/Instagram/Index.jsx
function InstagramHubPage({ needsMigration = false, isConfigured, appId, hasAppSecret, redirectUri, account, pendingApprovals = [], recentShares = [], authUrl, errorMessage = null }) {
	const [activeTab, setActiveTab] = useState("approvals");
	const [approvingId, setApprovingId] = useState(null);
	const [editCaptions, setEditCaptions] = useState({});
	const [customCaption, setCustomCaption] = useState("");
	const [customImage, setCustomImage] = useState("");
	const [isPublishingCustom, setIsPublishingCustom] = useState(false);
	const [publishFeedback, setPublishFeedback] = useState({});
	const fileInputRef = useRef(null);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [showManualUrl, setShowManualUrl] = useState(false);
	const [inputAppId, setInputAppId] = useState(appId || "");
	const [inputAppSecret, setInputAppSecret] = useState("");
	const [isSavingCreds, setIsSavingCreds] = useState(false);
	const [copiedUri, setCopiedUri] = useState(false);
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
		const finalCaption = editCaptions[share.id] !== void 0 ? editCaptions[share.id] : share.caption;
		try {
			const data = await (await fetch("/api/admin/instagram/approve-publish", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || ""
				},
				body: JSON.stringify({
					share_id: share.id,
					caption: finalCaption,
					image_url: share.image_url
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
			} else alert(data.message || "Publishing to Instagram failed.");
		} catch (err) {
			alert("Network error: " + err.message);
		} finally {
			setApprovingId(null);
		}
	};
	const handlePublishCustom = () => {
		if (!customImage.trim()) {
			alert("Please upload a photo for the Instagram post.");
			return;
		}
		if (!customCaption.trim()) {
			alert("Please enter a caption for Instagram.");
			return;
		}
		setIsPublishingCustom(true);
		router.post("/admin/instagram/custom-post", {
			caption: customCaption,
			image_url: customImage
		}, {
			onFinish: () => setIsPublishingCustom(false),
			onSuccess: () => {
				setCustomCaption("");
				setCustomImage("");
			}
		});
	};
	const handleSaveCredentials = (e) => {
		e.preventDefault();
		setIsSavingCreds(true);
		router.post("/admin/instagram/credentials", {
			app_id: inputAppId,
			app_secret: inputAppSecret
		}, { onFinish: () => setIsSavingCreds(false) });
	};
	const handleSyncProfile = () => {
		router.post("/admin/instagram/sync-profile");
	};
	const handleDisconnect = () => {
		if (confirm("Are you sure you want to disconnect this Instagram account?")) router.post("/admin/instagram/disconnect");
	};
	const countHashtags = (text) => {
		const matches = text.match(/#[a-zA-Z0-9_]+/g);
		return matches ? matches.length : 0;
	};
	const igGradient = "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Instagram Hub - Manage Instagram Posts & Approvals" }), /* @__PURE__ */ jsxs("div", {
		style: {
			maxWidth: "1240px",
			margin: "0 auto",
			padding: "24px 16px",
			color: "#0f172a"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: igGradient,
					borderRadius: "16px",
					padding: "28px 32px",
					color: "#fff",
					marginBottom: "24px",
					boxShadow: "0 10px 25px -5px rgba(220, 39, 67, 0.3)",
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
							children: [/* @__PURE__ */ jsx(Camera, {
								size: 28,
								color: "#fff"
							}), /* @__PURE__ */ jsx("span", {
								style: {
									background: "rgba(255,255,255,0.25)",
									backdropFilter: "blur(8px)",
									padding: "3px 10px",
									borderRadius: "20px",
									fontSize: "11px",
									fontWeight: 800,
									letterSpacing: "0.5px",
									textTransform: "uppercase"
								},
								children: "Meta Graph API v21.0"
							})]
						}),
						/* @__PURE__ */ jsx("h1", {
							style: {
								fontSize: "26px",
								fontWeight: 900,
								margin: "0 0 8px 0",
								letterSpacing: "-0.5px"
							},
							children: "Instagram Business Hub"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								margin: 0,
								fontSize: "13.5px",
								opacity: .95,
								lineHeight: 1.5
							},
							children: "Auto-generate aesthetic Instagram captions, upload direct high-res photos, manage approvals, and publish to your Instagram Business account."
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
							padding: "10px 18px",
							borderRadius: "12px",
							display: "flex",
							alignItems: "center",
							gap: "12px",
							boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
						},
						children: [account.avatar ? /* @__PURE__ */ jsx("img", {
							src: account.avatar,
							alt: account.username,
							style: {
								width: "36px",
								height: "36px",
								borderRadius: "50%",
								objectFit: "cover",
								border: "2px solid #e1306c"
							}
						}) : /* @__PURE__ */ jsx("div", {
							style: {
								width: "36px",
								height: "36px",
								borderRadius: "50%",
								background: igGradient,
								color: "#fff",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontWeight: 800,
								fontSize: "16px"
							},
							children: "IG"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							style: {
								fontWeight: 800,
								fontSize: "13.5px",
								display: "flex",
								alignItems: "center",
								gap: "6px"
							},
							children: [
								"@",
								account.username,
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
								color: "#64748b"
							},
							children: [
								account.followers_count?.toLocaleString(),
								" followers • ",
								account.media_count?.toLocaleString(),
								" posts"
							]
						})] })]
					}) : authUrl && /* @__PURE__ */ jsxs("a", {
						href: authUrl,
						style: {
							background: "#fff",
							color: "#c13584",
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
						children: [/* @__PURE__ */ jsx(Camera, { size: 16 }), " Connect with Instagram"]
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
						children: "Instagram database tables are being installed. Click Upgrade to finalize database sync."
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
							color: activeTab === "approvals" ? "#c13584" : "#64748b",
							borderBottom: activeTab === "approvals" ? "3px solid #c13584" : "3px solid transparent",
							marginBottom: "-2px",
							display: "flex",
							alignItems: "center",
							gap: "6px"
						},
						children: [
							/* @__PURE__ */ jsx(FileCheck, {
								size: 16,
								style: { marginRight: "6px" }
							}),
							" Approvals Queue",
							pendingApprovals.length > 0 && /* @__PURE__ */ jsx("span", {
								style: {
									background: "#f43f5e",
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
							color: activeTab === "composer" ? "#c13584" : "#64748b",
							borderBottom: activeTab === "composer" ? "3px solid #c13584" : "3px solid transparent",
							marginBottom: "-2px",
							display: "flex",
							alignItems: "center",
							gap: "6px"
						},
						children: [/* @__PURE__ */ jsx(PenSquare, {
							size: 16,
							style: { marginRight: "6px" }
						}), " Direct Post Composer"]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveTab("account"),
						style: {
							padding: "12px 18px",
							border: "none",
							background: "transparent",
							fontSize: "13px",
							fontWeight: 800,
							cursor: "pointer",
							color: activeTab === "account" ? "#c13584" : "#64748b",
							borderBottom: activeTab === "account" ? "3px solid #c13584" : "3px solid transparent",
							marginBottom: "-2px",
							display: "flex",
							alignItems: "center",
							gap: "6px"
						},
						children: [/* @__PURE__ */ jsx(User, {
							size: 16,
							style: { marginRight: "6px" }
						}), " Profile & Insights"]
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
							color: activeTab === "settings" ? "#c13584" : "#64748b",
							borderBottom: activeTab === "settings" ? "3px solid #c13584" : "3px solid transparent",
							marginBottom: "-2px",
							display: "flex",
							alignItems: "center",
							gap: "6px"
						},
						children: [/* @__PURE__ */ jsx(Settings, {
							size: 16,
							style: { marginRight: "6px" }
						}), " App & API Settings"]
					})
				]
			}),
			activeTab === "approvals" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
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
					children: "Pending Blog Post Approvals"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						fontSize: "12px",
						color: "#64748b",
						margin: 0
					},
					children: "Review and approve AI-generated captions and graphics before publishing to your Instagram feed."
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
			}), pendingApprovals.length === 0 ? /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					border: "1px dashed #cbd5e1",
					borderRadius: "16px",
					padding: "48px 24px",
					textAlign: "center",
					color: "#64748b"
				},
				children: [
					/* @__PURE__ */ jsx("div", { style: {
						fontSize: "36px",
						marginBottom: "12px"
					} }),
					/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "16px",
							fontWeight: 700,
							color: "#1e293b",
							margin: "0 0 6px 0"
						},
						children: "No pending Instagram approvals"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							fontSize: "13px",
							margin: "0 0 16px 0",
							maxWidth: "440px",
							marginLeft: "auto",
							marginRight: "auto"
						},
						children: "When you draft or publish a blog post, it will appear here with an auto-formatted Instagram caption and cover graphic ready for your approval."
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setActiveTab("composer"),
						style: {
							background: igGradient,
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
					gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
					gap: "20px"
				},
				children: pendingApprovals.map((share) => {
					const currentCaption = editCaptions[share.id] !== void 0 ? editCaptions[share.id] : share.caption;
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
									padding: "10px 14px",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									borderBottom: "1px solid #f1f5f9"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											width: "28px",
											height: "28px",
											borderRadius: "50%",
											background: igGradient,
											color: "#fff",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontWeight: 800,
											fontSize: "12px"
										},
										children: "IG"
									}), /* @__PURE__ */ jsx("span", {
										style: {
											fontWeight: 800,
											fontSize: "12.5px",
											color: "#0f172a"
										},
										children: account ? account.username : "coachingsinsikar"
									})]
								}), /* @__PURE__ */ jsx("span", {
									style: {
										fontSize: "11px",
										color: "#94a3b8"
									},
									children: share.created_at
								})]
							}),
							share.image_url ? /* @__PURE__ */ jsx("div", {
								style: {
									width: "100%",
									height: "260px",
									background: "#f8fafc",
									overflow: "hidden"
								},
								children: /* @__PURE__ */ jsx("img", {
									src: share.image_url,
									alt: share.title,
									style: {
										width: "100%",
										height: "100%",
										objectFit: "cover"
									}
								})
							}) : /* @__PURE__ */ jsx("div", {
								style: {
									height: "180px",
									background: "#f8fafc",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#94a3b8",
									fontSize: "12px"
								},
								children: "No cover image provided"
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									padding: "8px 14px",
									display: "flex",
									gap: "14px",
									color: "#262626",
									fontSize: "18px"
								},
								children: [
									/* @__PURE__ */ jsx("span", {
										style: {
											display: "inline-flex",
											alignItems: "center"
										},
										children: /* @__PURE__ */ jsx(Heart, {
											size: 14,
											color: "#dc2626"
										})
									}),
									/* @__PURE__ */ jsx("span", {
										style: {
											display: "inline-flex",
											alignItems: "center"
										},
										children: /* @__PURE__ */ jsx(MessageSquare, {
											size: 14,
											color: "#64748b"
										})
									}),
									/* @__PURE__ */ jsx("span", { children: "↗️" })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									padding: "0 14px 14px 14px",
									flex: 1,
									display: "flex",
									flexDirection: "column"
								},
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "11px",
											fontWeight: 800,
											color: "#64748b",
											marginBottom: "6px"
										},
										children: [
											"CAPTION (",
											currentCaption.length,
											" / 2200 chars • ",
											countHashtags(currentCaption),
											" hashtags)"
										]
									}),
									/* @__PURE__ */ jsx("textarea", {
										rows: 6,
										value: currentCaption,
										onChange: (e) => setEditCaptions({
											...editCaptions,
											[share.id]: e.target.value
										}),
										style: {
											width: "100%",
											padding: "10px",
											borderRadius: "8px",
											border: "1px solid #cbd5e1",
											fontSize: "12px",
											lineHeight: 1.4,
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
										children: [/* @__PURE__ */ jsx("span", { children: " Published to Instagram!" }), feedback.permalink && /* @__PURE__ */ jsx("a", {
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
										style: {
											marginTop: "auto",
											display: "flex",
											gap: "8px"
										},
										children: /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => handleApprove(share),
											disabled: isApproving || !account || !share.image_url,
											style: {
												flex: 1,
												background: !account || !share.image_url ? "#94a3b8" : igGradient,
												color: "#fff",
												border: "none",
												padding: "10px",
												borderRadius: "8px",
												fontWeight: 800,
												fontSize: "12.5px",
												cursor: !account || !share.image_url ? "not-allowed" : "pointer",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												gap: "6px"
											},
											children: isApproving ? "Publishing..." : "Approve & Publish"
										})
									})
								]
							})
						]
					}, share.id);
				})
			})] }),
			activeTab === "composer" && /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 380px",
					gap: "28px",
					alignItems: "start"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						padding: "24px",
						borderRadius: "16px",
						border: "1px solid #e2e8f0"
					},
					children: [
						/* @__PURE__ */ jsx("h2", {
							style: {
								fontSize: "18px",
								fontWeight: 800,
								margin: "0 0 6px 0"
							},
							children: "Create Standalone Instagram Post"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								fontSize: "12px",
								color: "#64748b",
								margin: "0 0 20px 0"
							},
							children: "Upload an image from your device and write a caption to publish directly to Instagram without creating a blog post."
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
									children: "POST PHOTO (1:1 SQUARE OR 4:5 PORTRAIT RECOMMENDED) *"
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
									onMouseEnter: (e) => e.currentTarget.style.borderColor = "#c13584",
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
												color: "#dc2743"
											})
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontWeight: 800,
												fontSize: "13px",
												color: "#1e293b"
											},
											children: isUploadingImage ? "Uploading & Optimizing WebP..." : "Click to Upload Photo from Device"
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "11px",
												color: "#64748b",
												marginTop: "4px"
											},
											children: ["PNG, JPG, or WebP. Automatically saved to ", /* @__PURE__ */ jsx("code", { children: "/public/uploads/social/" })]
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
									children: "CAPTION (MAX 2,200 CHARACTERS) *"
								}), /* @__PURE__ */ jsxs("span", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: customCaption.length > 2200 ? "#ef4444" : "#64748b"
									},
									children: [
										customCaption.length,
										" / 2200 • ",
										countHashtags(customCaption),
										" / 30 tags"
									]
								})]
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 8,
								value: customCaption,
								onChange: (e) => setCustomCaption(e.target.value),
								placeholder: "Write an engaging caption with emojis, spacing, call to action, and hashtags...",
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
							disabled: isPublishingCustom || !customImage || !customCaption.trim() || !account,
							style: {
								width: "100%",
								background: !customImage || !customCaption.trim() || !account ? "#94a3b8" : igGradient,
								color: "#fff",
								border: "none",
								padding: "14px",
								borderRadius: "10px",
								fontWeight: 800,
								fontSize: "13px",
								cursor: !customImage || !customCaption.trim() || !account ? "not-allowed" : "pointer",
								boxShadow: "0 4px 12px rgba(220, 39, 67, 0.25)"
							},
							children: isPublishingCustom ? "Publishing to Instagram..." : "Publish to Instagram Feed"
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
					children: "LIVE FEED PREVIEW"
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
								padding: "10px 14px",
								display: "flex",
								alignItems: "center",
								gap: "8px"
							},
							children: [account?.avatar ? /* @__PURE__ */ jsx("img", {
								src: account.avatar,
								alt: "avatar",
								style: {
									width: "32px",
									height: "32px",
									borderRadius: "50%",
									objectFit: "cover"
								}
							}) : /* @__PURE__ */ jsx("div", {
								style: {
									width: "32px",
									height: "32px",
									borderRadius: "50%",
									background: igGradient,
									color: "#fff",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontWeight: 800,
									fontSize: "13px"
								},
								children: "IG"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontWeight: 800,
									fontSize: "12.5px",
									color: "#0f172a"
								},
								children: account?.username || "coachingsinsikar"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "10.5px",
									color: "#64748b"
								},
								children: "Sikar, Rajasthan"
							})] })]
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								width: "100%",
								height: "320px",
								background: "#f8fafc",
								overflow: "hidden"
							},
							children: customImage ? /* @__PURE__ */ jsx("img", {
								src: customImage,
								alt: "Preview",
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}) : /* @__PURE__ */ jsxs("div", {
								style: {
									height: "100%",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									color: "#94a3b8",
									gap: "8px"
								},
								children: [/* @__PURE__ */ jsx("span", { style: { fontSize: "32px" } }), /* @__PURE__ */ jsx("span", {
									style: { fontSize: "12px" },
									children: "Upload photo to preview"
								})]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "10px 14px 6px 14px",
								display: "flex",
								justifyContent: "space-between"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "14px",
									fontSize: "18px"
								},
								children: [
									/* @__PURE__ */ jsx("span", {
										style: {
											display: "inline-flex",
											alignItems: "center"
										},
										children: /* @__PURE__ */ jsx(Heart, {
											size: 14,
											color: "#dc2626"
										})
									}),
									/* @__PURE__ */ jsx("span", {
										style: {
											display: "inline-flex",
											alignItems: "center"
										},
										children: /* @__PURE__ */ jsx(MessageSquare, {
											size: 14,
											color: "#64748b"
										})
									}),
									/* @__PURE__ */ jsx("span", { children: "↗️" })
								]
							}), /* @__PURE__ */ jsx(Bookmark, {
								size: 18,
								color: "#64748b"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "0 14px 14px 14px",
								fontSize: "12px",
								lineHeight: 1.4,
								color: "#0f172a"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontWeight: 800,
									marginBottom: "4px"
								},
								children: account?.username || "coachingsinsikar"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									whiteSpace: "pre-wrap",
									maxHeight: "140px",
									overflowY: "auto",
									color: "#334155"
								},
								children: customCaption || "Your Instagram caption will appear here with hashtags and call to action..."
							})]
						})
					]
				})] })]
			}),
			activeTab === "account" && /* @__PURE__ */ jsx("div", {
				style: {
					maxWidth: "680px",
					margin: "0 auto"
				},
				children: account ? /* @__PURE__ */ jsxs("div", {
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
								gap: "20px",
								marginBottom: "24px"
							},
							children: [account.avatar ? /* @__PURE__ */ jsx("img", {
								src: account.avatar,
								alt: account.username,
								style: {
									width: "80px",
									height: "80px",
									borderRadius: "50%",
									objectFit: "cover",
									border: "3px solid #e1306c"
								}
							}) : /* @__PURE__ */ jsx("div", {
								style: {
									width: "80px",
									height: "80px",
									borderRadius: "50%",
									background: igGradient,
									color: "#fff",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "32px",
									fontWeight: 900
								},
								children: "IG"
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h2", {
									style: {
										fontSize: "20px",
										fontWeight: 900,
										margin: "0 0 4px 0"
									},
									children: account.name || account.username
								}),
								/* @__PURE__ */ jsxs("a", {
									href: account.instagram_url,
									target: "_blank",
									rel: "noopener noreferrer",
									style: {
										color: "#c13584",
										fontWeight: 800,
										fontSize: "13px",
										textDecoration: "none"
									},
									children: [
										"@",
										account.username,
										" ↗"
									]
								}),
								account.bio && /* @__PURE__ */ jsx("p", {
									style: {
										margin: "8px 0 0 0",
										fontSize: "12px",
										color: "#64748b",
										lineHeight: 1.4
									},
									children: account.bio
								})
							] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px",
								marginBottom: "24px"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									background: "#f8fafc",
									padding: "16px",
									borderRadius: "12px",
									border: "1px solid #e2e8f0"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#64748b",
										marginBottom: "4px"
									},
									children: "TOTAL FOLLOWERS"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "24px",
										fontWeight: 900,
										color: "#0f172a"
									},
									children: account.followers_count?.toLocaleString()
								})]
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									background: "#f8fafc",
									padding: "16px",
									borderRadius: "12px",
									border: "1px solid #e2e8f0"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#64748b",
										marginBottom: "4px"
									},
									children: "TOTAL POSTS"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "24px",
										fontWeight: 900,
										color: "#0f172a"
									},
									children: account.media_count?.toLocaleString()
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "12px"
							},
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleSyncProfile,
								style: {
									flex: 1,
									background: "#f1f5f9",
									color: "#0f172a",
									border: "1px solid #cbd5e1",
									padding: "10px",
									borderRadius: "8px",
									fontWeight: 700,
									fontSize: "12.5px",
									cursor: "pointer"
								},
								children: "↻ Refresh Live Metrics"
							}), /* @__PURE__ */ jsx("button", {
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
									cursor: "pointer"
								},
								children: "Disconnect"
							})]
						})
					]
				}) : /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						borderRadius: "16px",
						border: "1px dashed #cbd5e1",
						padding: "40px",
						textAlign: "center"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								justifyContent: "center",
								marginBottom: "12px"
							},
							children: /* @__PURE__ */ jsx(Camera, {
								size: 40,
								color: "#dc2743"
							})
						}),
						/* @__PURE__ */ jsx("h3", {
							style: {
								fontSize: "16px",
								fontWeight: 800,
								margin: "0 0 6px 0"
							},
							children: "No Instagram Account Connected"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								fontSize: "13px",
								color: "#64748b",
								margin: "0 0 20px 0"
							},
							children: "Connect your Instagram Professional/Business account via Meta Graph API to start publishing."
						}),
						authUrl ? /* @__PURE__ */ jsx("a", {
							href: authUrl,
							style: {
								background: igGradient,
								color: "#fff",
								padding: "12px 24px",
								borderRadius: "10px",
								fontWeight: 800,
								fontSize: "13px",
								textDecoration: "none",
								display: "inline-block"
							},
							children: "Connect with Instagram →"
						}) : /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setActiveTab("settings"),
							style: {
								background: "#0f172a",
								color: "#fff",
								padding: "10px 20px",
								borderRadius: "8px",
								border: "none",
								fontWeight: 700,
								fontSize: "12px"
							},
							children: "Configure App ID in Settings →"
						})
					]
				})
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
							children: "Meta App Configuration"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								fontSize: "12px",
								color: "#64748b",
								margin: "0 0 20px 0"
							},
							children: "Instagram Business uses Meta Graph API. It automatically shares your Facebook App ID."
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
										children: "META APP ID *"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: inputAppId,
										onChange: (e) => setInputAppId(e.target.value),
										required: true,
										style: {
											width: "100%",
											padding: "10px 12px",
											borderRadius: "8px",
											border: "1px solid #cbd5e1",
											fontSize: "13px"
										},
										placeholder: "1464713225364837"
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
										children: ["META APP SECRET ", hasAppSecret && " (Configured in .env)"]
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										value: inputAppSecret,
										onChange: (e) => setInputAppSecret(e.target.value),
										placeholder: hasAppSecret ? "••••••••••••••••••••••••" : "Enter Meta App Secret",
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
										children: "OAUTH REDIRECT URI (ADD TO META APP SETTINGS)"
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
						children: " Quick Setup Checklist:"
					}), /* @__PURE__ */ jsxs("ol", {
						style: {
							paddingLeft: "18px",
							margin: 0
						},
						children: [
							/* @__PURE__ */ jsxs("li", { children: [
								"Your Instagram account must be a ",
								/* @__PURE__ */ jsx("strong", { children: "Business or Creator" }),
								" account."
							] }),
							/* @__PURE__ */ jsxs("li", { children: [
								"In your Facebook Page settings, link your Instagram account under ",
								/* @__PURE__ */ jsx("strong", { children: "Linked Accounts" }),
								"."
							] }),
							/* @__PURE__ */ jsxs("li", { children: [
								"In your Meta Developer App, ensure ",
								/* @__PURE__ */ jsx("strong", { children: "Instagram Graph API" }),
								" products are added with scopes ",
								/* @__PURE__ */ jsx("code", { children: "instagram_basic" }),
								" and ",
								/* @__PURE__ */ jsx("code", { children: "instagram_content_publish" }),
								"."
							] })
						]
					})]
				})]
			})
		]
	})] });
}
//#endregion
export { InstagramHubPage as default };
