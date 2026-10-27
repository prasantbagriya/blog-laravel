import AdminLayout from "./AdminLayout-CeDz327F.js";
import { Head, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, FileCheck, Layers, PenSquare, Pin, Plus, RefreshCw, Search, Settings, Sparkles, UploadCloud, Users, X } from "lucide-react";
//#region resources/js/Pages/Admin/Pinterest/Index.jsx
function PinterestHubPage({ needsMigration = false, isConfigured, hasConfiguredToken = false, configuredTokenPreview = null, clientId, hasClientSecret, redirectUri, account, allAccounts = [], availablePosts = [], boards = [], defaultBoard, pendingApprovals = [], recentShares = [], recentPins = [], authUrl, errorMessage = null }) {
	const [activeTab, setActiveTab] = useState("approvals");
	const [approvingId, setApprovingId] = useState(null);
	const [editTitles, setEditTitles] = useState({});
	const [editDescriptions, setEditDescriptions] = useState({});
	const [editTargetLinks, setEditTargetLinks] = useState({});
	const [editAltTexts, setEditAltTexts] = useState({});
	const [editImages, setEditImages] = useState({});
	const [selectedBoards, setSelectedBoards] = useState({});
	const [isSyncingConfigured, setIsSyncingConfigured] = useState(false);
	const [isRegeneratingId, setIsRegeneratingId] = useState(null);
	const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
	const [postSearchQuery, setPostSearchQuery] = useState("");
	const [isDraftingPostId, setIsDraftingPostId] = useState(null);
	const cardFileInputRefs = useRef({});
	const [uploadingShareId, setUploadingShareId] = useState(null);
	const handleSyncConfiguredToken = () => {
		setIsSyncingConfigured(true);
		router.post("/admin/pinterest/sync-configured", {}, { onFinish: () => setIsSyncingConfigured(false) });
	};
	const handleSwitchAccount = (accountId) => {
		if (!accountId) return;
		router.post(`/admin/pinterest/switch-account/${accountId}`);
	};
	const handleAddPostToApprovals = (postId) => {
		setIsDraftingPostId(postId);
		router.post(`/admin/pinterest/draft-post/${postId}`, {}, {
			onSuccess: () => {
				setIsAddPostModalOpen(false);
			},
			onFinish: () => {
				setIsDraftingPostId(null);
			}
		});
	};
	const handleRegenerateDraft = async (shareId) => {
		setIsRegeneratingId(shareId);
		try {
			const data = await (await fetch(`/api/admin/pinterest/regenerate-draft/${shareId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || ""
				}
			})).json();
			if (data.success && data.draft) {
				setEditTitles((prev) => ({
					...prev,
					[shareId]: data.draft.title
				}));
				setEditDescriptions((prev) => ({
					...prev,
					[shareId]: data.draft.description
				}));
				if (data.draft.target_link) setEditTargetLinks((prev) => ({
					...prev,
					[shareId]: data.draft.target_link
				}));
				if (data.draft.alt_text) setEditAltTexts((prev) => ({
					...prev,
					[shareId]: data.draft.alt_text
				}));
			} else alert(data.message || "AI regeneration failed.");
		} catch (e) {
			alert("Error during AI regeneration: " + e.message);
		} finally {
			setIsRegeneratingId(null);
		}
	};
	const [customBoardId, setCustomBoardId] = useState(defaultBoard?.id || boards[0]?.id || "");
	const [customTitle, setCustomTitle] = useState("");
	const [customDescription, setCustomDescription] = useState("");
	const [customImage, setCustomImage] = useState("");
	const [customLink, setCustomLink] = useState("");
	const [customAltText, setCustomAltText] = useState("");
	const [isPublishingCustom, setIsPublishingCustom] = useState(false);
	const [publishFeedback, setPublishFeedback] = useState({});
	const fileInputRef = useRef(null);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [showManualUrl, setShowManualUrl] = useState(false);
	const [newBoardName, setNewBoardName] = useState("");
	const [newBoardDescription, setNewBoardDescription] = useState("");
	const [newBoardPrivacy, setNewBoardPrivacy] = useState("PUBLIC");
	const [isCreatingBoard, setIsCreatingBoard] = useState(false);
	const [manualToken, setManualToken] = useState("");
	const [isSavingManual, setIsSavingManual] = useState(false);
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
	const handleCardImageUpload = async (shareId, e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingShareId(shareId);
		const formData = new FormData();
		formData.append("file", file);
		try {
			const data = await (await fetch("/api/admin/social/upload-image", {
				method: "POST",
				headers: { "X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || "" },
				body: formData
			})).json();
			if (data.success && data.url) setEditImages((prev) => ({
				...prev,
				[shareId]: data.url
			}));
			else alert(data.message || "Image upload failed");
		} catch (err) {
			alert("Upload error: " + err.message);
		} finally {
			setUploadingShareId(null);
			if (cardFileInputRefs.current[shareId]) cardFileInputRefs.current[shareId].value = "";
		}
	};
	const handleApprove = async (share) => {
		setApprovingId(share.id);
		const finalTitle = editTitles[share.id] !== void 0 ? editTitles[share.id] : share.title;
		const finalDescription = editDescriptions[share.id] !== void 0 ? editDescriptions[share.id] : share.description || "";
		const finalTargetLink = editTargetLinks[share.id] !== void 0 ? editTargetLinks[share.id] : share.target_link || "";
		const finalAltText = editAltTexts[share.id] !== void 0 ? editAltTexts[share.id] : share.alt_text || finalTitle;
		const finalImage = editImages[share.id] || share.image_url;
		const targetBoardId = selectedBoards[share.id] || share.pinterest_board_id || defaultBoard?.id;
		if (!targetBoardId) {
			alert("Please select a target Pinterest board first.");
			setApprovingId(null);
			return;
		}
		try {
			const data = await (await fetch("/api/admin/pinterest/approve-publish", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || ""
				},
				body: JSON.stringify({
					share_id: share.id,
					pinterest_board_id: targetBoardId,
					title: finalTitle,
					description: finalDescription,
					target_link: finalTargetLink,
					alt_text: finalAltText,
					image_url: finalImage
				})
			})).json();
			if (data.success) {
				setPublishFeedback((prev) => ({
					...prev,
					[share.id]: {
						success: true,
						pin_url: data.pin_url
					}
				}));
				router.reload({ only: [
					"pendingApprovals",
					"recentShares",
					"recentPins"
				] });
			} else alert(data.message || "Pin publishing failed");
		} catch (e) {
			alert("Network or server error: " + e.message);
		} finally {
			setApprovingId(null);
		}
	};
	const handleCustomPinSubmit = (e) => {
		e.preventDefault();
		if (!customTitle.trim() || !customImage.trim() || !customBoardId) return;
		setIsPublishingCustom(true);
		router.post("/admin/pinterest/custom-pin", {
			pinterest_board_id: customBoardId,
			title: customTitle,
			description: customDescription,
			image_url: customImage,
			target_link: customLink,
			alt_text: customAltText
		}, { onFinish: () => {
			setIsPublishingCustom(false);
			setCustomTitle("");
			setCustomDescription("");
			setCustomImage("");
			setCustomLink("");
			setCustomAltText("");
		} });
	};
	const handleCreateBoardSubmit = (e) => {
		e.preventDefault();
		if (!newBoardName.trim()) return;
		setIsCreatingBoard(true);
		router.post("/admin/pinterest/boards", {
			name: newBoardName,
			description: newBoardDescription,
			privacy: newBoardPrivacy
		}, { onFinish: () => {
			setIsCreatingBoard(false);
			setNewBoardName("");
			setNewBoardDescription("");
		} });
	};
	const handleManualTokenSubmit = (e) => {
		e.preventDefault();
		if (!manualToken.trim()) return;
		setIsSavingManual(true);
		router.post("/admin/pinterest/credentials", { access_token: manualToken }, { onFinish: () => {
			setIsSavingManual(false);
			setManualToken("");
		} });
	};
	const filteredAvailablePosts = availablePosts.filter((p) => {
		if (!postSearchQuery.trim()) return true;
		const q = postSearchQuery.toLowerCase();
		return p.title && p.title.toLowerCase().includes(q) || p.category && p.category.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		style: {
			animation: "fadeIn 0.3s ease-out",
			paddingBottom: "40px"
		},
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Pinterest Hub & Board Manager | Admin" }),
			needsMigration && /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fef2f2",
					border: "1px solid #fee2e2",
					borderRadius: "12px",
					padding: "16px 20px",
					marginBottom: "20px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					color: "#991b1b"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "12px"
					},
					children: [/* @__PURE__ */ jsx(AlertTriangle, {
						size: 20,
						color: "#dc2626"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("strong", {
						style: {
							display: "block",
							fontSize: "14px"
						},
						children: "Pinterest Database Tables Setup Required"
					}), /* @__PURE__ */ jsx("span", {
						style: { fontSize: "13px" },
						children: "Pinterest integration tables are not created yet in the database. Run the system upgrade to activate all features."
					})] })]
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => router.post("/admin/system-upgrade"),
					style: {
						background: "#dc2626",
						color: "#fff",
						border: "none",
						padding: "9px 18px",
						borderRadius: "8px",
						fontWeight: 700,
						fontSize: "13px",
						cursor: "pointer"
					},
					children: "Run Database Migration"
				})]
			}),
			errorMessage && /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff1f2",
					border: "1px solid #ffe4e6",
					borderRadius: "12px",
					padding: "14px 20px",
					marginBottom: "20px",
					color: "#be123c",
					fontSize: "14px",
					display: "flex",
					alignItems: "center",
					gap: "10px"
				},
				children: [/* @__PURE__ */ jsx(AlertTriangle, { size: 18 }), /* @__PURE__ */ jsx("span", { children: errorMessage })]
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					background: "linear-gradient(135deg, #bd081c 0%, #e60023 50%, #ad081b 100%)",
					borderRadius: "18px",
					padding: "28px 32px",
					color: "#fff",
					marginBottom: "28px",
					boxShadow: "0 10px 25px -5px rgba(230, 0, 35, 0.3)"
				},
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexWrap: "wrap",
						gap: "18px"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "18px"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								width: "56px",
								height: "56px",
								borderRadius: "14px",
								background: "rgba(255, 255, 255, 0.2)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								backdropFilter: "blur(8px)",
								border: "1px solid rgba(255, 255, 255, 0.3)"
							},
							children: /* @__PURE__ */ jsx(Pin, {
								size: 30,
								color: "#fff"
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "10px",
								flexWrap: "wrap"
							},
							children: [/* @__PURE__ */ jsx("h1", {
								style: {
									fontSize: "24px",
									fontWeight: 900,
									margin: 0,
									letterSpacing: "-0.5px"
								},
								children: "Pinterest Hub & Board Manager"
							}), account ? /* @__PURE__ */ jsxs("span", {
								style: {
									background: "#10b981",
									color: "#fff",
									fontSize: "11px",
									fontWeight: 800,
									padding: "3px 10px",
									borderRadius: "12px",
									display: "flex",
									alignItems: "center",
									gap: "4px"
								},
								children: [
									/* @__PURE__ */ jsx(Check, { size: 12 }),
									" CONNECTED (@",
									account.username,
									")"
								]
							}) : /* @__PURE__ */ jsx("span", {
								style: {
									background: "rgba(255,255,255,0.25)",
									color: "#fff",
									fontSize: "11px",
									fontWeight: 800,
									padding: "3px 10px",
									borderRadius: "12px"
								},
								children: "NOT CONNECTED"
							})]
						}), /* @__PURE__ */ jsx("p", {
							style: {
								margin: "4px 0 0 0",
								opacity: .9,
								fontSize: "13px"
							},
							children: "Manage Pinterest boards, auto-draft SEO pin titles & descriptions, and publish visual pins via API v5."
						})] })]
					}), account ? /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "10px",
							flexWrap: "wrap"
						},
						children: [
							allAccounts.length > 1 && /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: "6px"
								},
								children: [/* @__PURE__ */ jsx("span", {
									style: {
										fontSize: "12px",
										fontWeight: 700,
										color: "#fecaca"
									},
									children: "Account:"
								}), /* @__PURE__ */ jsx("select", {
									value: account.id,
									onChange: (e) => handleSwitchAccount(e.target.value),
									style: {
										background: "rgba(255, 255, 255, 0.2)",
										color: "#fff",
										border: "1px solid rgba(255, 255, 255, 0.4)",
										padding: "8px 12px",
										borderRadius: "8px",
										fontSize: "12px",
										fontWeight: 700,
										cursor: "pointer",
										outline: "none"
									},
									children: allAccounts.map((acc) => /* @__PURE__ */ jsxs("option", {
										value: acc.id,
										style: { color: "#0f172a" },
										children: [
											"@",
											acc.username,
											" ",
											acc.is_active ? "✓ (Active)" : ""
										]
									}, acc.id))
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => router.post("/admin/pinterest/sync-boards"),
								style: {
									background: "rgba(255, 255, 255, 0.2)",
									color: "#fff",
									border: "1px solid rgba(255, 255, 255, 0.3)",
									padding: "9px 16px",
									borderRadius: "8px",
									fontWeight: 700,
									fontSize: "13px",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									gap: "6px"
								},
								children: [/* @__PURE__ */ jsx(RefreshCw, { size: 14 }), /* @__PURE__ */ jsx("span", { children: "Sync Boards" })]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: "/auth/pinterest",
								style: {
									background: "#fff",
									color: "#e60023",
									border: "none",
									padding: "9px 16px",
									borderRadius: "8px",
									fontWeight: 800,
									fontSize: "13px",
									textDecoration: "none",
									display: "flex",
									alignItems: "center",
									gap: "6px",
									boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
								},
								title: "Login with Pinterest to connect another account",
								children: [/* @__PURE__ */ jsx(Pin, {
									size: 14,
									color: "#e60023"
								}), /* @__PURE__ */ jsx("span", { children: "+ Login with Pinterest" })]
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => {
									if (confirm(`Are you sure you want to disconnect @${account.username}?`)) router.post("/admin/pinterest/disconnect");
								},
								style: {
									background: "rgba(0, 0, 0, 0.25)",
									color: "#ffcdd2",
									border: "1px solid rgba(255, 255, 255, 0.2)",
									padding: "9px 14px",
									borderRadius: "8px",
									fontWeight: 700,
									fontSize: "13px",
									cursor: "pointer"
								},
								children: "Disconnect"
							})
						]
					}) : /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "10px",
							flexWrap: "wrap"
						},
						children: [authUrl && /* @__PURE__ */ jsx("a", {
							href: authUrl,
							style: {
								background: "#fff",
								color: "#e60023",
								border: "none",
								padding: "11px 22px",
								borderRadius: "10px",
								fontWeight: 800,
								fontSize: "14px",
								textDecoration: "none",
								display: "flex",
								alignItems: "center",
								gap: "8px",
								boxShadow: "0 4px 14px rgba(0,0,0,0.2)"
							},
							children: "Connect with Pinterest"
						}), hasConfiguredToken && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleSyncConfiguredToken,
							disabled: isSyncingConfigured,
							style: {
								background: "rgba(255, 255, 255, 0.2)",
								color: "#fff",
								border: "1px solid rgba(255, 255, 255, 0.4)",
								padding: "11px 20px",
								borderRadius: "10px",
								fontWeight: 700,
								fontSize: "13px",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "8px"
							},
							children: [/* @__PURE__ */ jsx(RefreshCw, { style: {
								width: "16px",
								height: "16px",
								animation: isSyncingConfigured ? "spin 1s linear infinite" : "none"
							} }), /* @__PURE__ */ jsx("span", { children: isSyncingConfigured ? "Connecting..." : "Sync Configured Token" })]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					gap: "8px",
					borderBottom: "1px solid #e2e8f0",
					marginBottom: "24px",
					overflowX: "auto"
				},
				children: [
					{
						id: "approvals",
						label: "Approvals Queue",
						icon: /* @__PURE__ */ jsx(FileCheck, { size: 16 }),
						badge: pendingApprovals.length
					},
					{
						id: "compose",
						label: "Direct Pin Composer",
						icon: /* @__PURE__ */ jsx(PenSquare, { size: 16 })
					},
					{
						id: "boards",
						label: `Boards (${boards.length})`,
						icon: /* @__PURE__ */ jsx(Layers, { size: 16 })
					},
					{
						id: "settings",
						label: "Settings & Accounts",
						icon: /* @__PURE__ */ jsx(Settings, { size: 16 })
					}
				].map((tab) => {
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setActiveTab(tab.id),
						style: {
							background: "none",
							border: "none",
							borderBottom: isActive ? "3px solid #e60023" : "3px solid transparent",
							padding: "12px 18px",
							fontWeight: isActive ? 800 : 600,
							fontSize: "14px",
							color: isActive ? "#e60023" : "#64748b",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "8px",
							whiteSpace: "nowrap",
							transition: "all 0.15s ease"
						},
						children: [
							tab.icon,
							/* @__PURE__ */ jsx("span", { children: tab.label }),
							tab.badge !== void 0 && tab.badge > 0 && /* @__PURE__ */ jsx("span", {
								style: {
									background: isActive ? "#e60023" : "#cbd5e1",
									color: "#fff",
									fontSize: "11px",
									fontWeight: 800,
									padding: "2px 7px",
									borderRadius: "10px"
								},
								children: tab.badge
							})
						]
					}, tab.id);
				})
			}),
			activeTab === "approvals" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "20px",
					flexWrap: "wrap",
					gap: "12px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					style: {
						fontSize: "18px",
						fontWeight: 800,
						color: "#0f172a",
						margin: 0
					},
					children: "Pinterest Pin Approvals Queue"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						margin: "3px 0 0 0",
						fontSize: "13px",
						color: "#64748b"
					},
					children: "Review AI-crafted Pinterest SEO titles, descriptions, target landing URLs, and graphics before publishing."
				})] }), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setIsAddPostModalOpen(true),
					style: {
						display: "flex",
						alignItems: "center",
						gap: "8px",
						background: "#e60023",
						color: "#fff",
						border: "none",
						padding: "10px 18px",
						borderRadius: "10px",
						fontWeight: 700,
						fontSize: "13px",
						cursor: "pointer",
						boxShadow: "0 4px 12px rgba(230, 0, 35, 0.25)",
						transition: "background 0.2s ease"
					},
					children: [/* @__PURE__ */ jsx(Plus, { size: 16 }), /* @__PURE__ */ jsx("span", { children: "+ Add Blog Post to Pin Approvals" })]
				})]
			}), pendingApprovals.length === 0 ? /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					border: "1px dashed #cbd5e1",
					borderRadius: "16px",
					padding: "56px 24px",
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
						children: /* @__PURE__ */ jsx(Pin, {
							size: 36,
							color: "#cbd5e1"
						})
					}),
					/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "17px",
							fontWeight: 800,
							color: "#1e293b",
							margin: "0 0 6px 0"
						},
						children: "No Pending Pins in Approvals Queue"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							fontSize: "13px",
							margin: "0 0 16px 0",
							maxWidth: "460px",
							marginInline: "auto"
						},
						children: "New published blog posts automatically appear here. You can also pick any existing blog post to generate a visual Pinterest Pin draft."
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setIsAddPostModalOpen(true),
						style: {
							background: "#e60023",
							color: "#fff",
							border: "none",
							padding: "9px 18px",
							borderRadius: "8px",
							fontSize: "13px",
							fontWeight: 700,
							cursor: "pointer",
							display: "inline-flex",
							alignItems: "center",
							gap: "6px"
						},
						children: [/* @__PURE__ */ jsx(Plus, { size: 15 }), /* @__PURE__ */ jsx("span", { children: "Choose a Blog Post to Draft Pin" })]
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "24px"
				},
				children: pendingApprovals.map((share) => {
					const currentTitle = editTitles[share.id] !== void 0 ? editTitles[share.id] : share.title;
					const currentDescription = editDescriptions[share.id] !== void 0 ? editDescriptions[share.id] : share.description || "";
					const currentTargetLink = editTargetLinks[share.id] !== void 0 ? editTargetLinks[share.id] : share.target_link || "";
					const currentAltText = editAltTexts[share.id] !== void 0 ? editAltTexts[share.id] : share.alt_text || currentTitle;
					const currentImage = editImages[share.id] || share.image_url;
					const currentBoardId = selectedBoards[share.id] || share.pinterest_board_id || defaultBoard?.id;
					const isRegenerating = isRegeneratingId === share.id;
					return /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							borderRadius: "18px",
							border: "1px solid #e2e8f0",
							boxShadow: "0 3px 12px rgba(0,0,0,0.04)",
							padding: "24px",
							display: "flex",
							flexDirection: "column",
							gap: "20px",
							position: "relative"
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
										display: "flex",
										alignItems: "center",
										gap: "8px",
										marginBottom: "6px"
									},
									children: [/* @__PURE__ */ jsxs("span", {
										style: {
											background: "#fef2f2",
											color: "#e60023",
											border: "1px solid #fecaca",
											fontSize: "11px",
											fontWeight: 800,
											padding: "3px 9px",
											borderRadius: "8px",
											textTransform: "uppercase",
											letterSpacing: "0.4px"
										},
										children: [
											share.post?.category || "Blog Post",
											" #",
											share.post_id || share.id
										]
									}), share.created_at && /* @__PURE__ */ jsxs("span", {
										style: {
											fontSize: "12px",
											color: "#94a3b8"
										},
										children: ["• ", share.created_at]
									})]
								}), /* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "17px",
										fontWeight: 800,
										color: "#0f172a",
										margin: 0,
										lineHeight: 1.4
									},
									children: share.post?.title || share.title
								})] }), /* @__PURE__ */ jsx("span", {
									style: {
										background: "#fef3c7",
										color: "#92400e",
										fontSize: "11px",
										fontWeight: 800,
										padding: "4px 10px",
										borderRadius: "12px",
										whiteSpace: "nowrap"
									},
									children: "Awaiting Approval"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6",
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "16px"
									},
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
											style: {
												display: "block",
												fontSize: "11px",
												fontWeight: 800,
												color: "#475569",
												textTransform: "uppercase",
												letterSpacing: "0.4px",
												marginBottom: "6px"
											},
											children: ["TARGET PINTEREST BOARD ", /* @__PURE__ */ jsx("span", {
												style: { color: "#ef4444" },
												children: "*"
											})]
										}), /* @__PURE__ */ jsxs("select", {
											value: currentBoardId || "",
											onChange: (e) => setSelectedBoards({
												...selectedBoards,
												[share.id]: e.target.value
											}),
											style: {
												width: "100%",
												padding: "9px 12px",
												borderRadius: "8px",
												border: "1px solid #cbd5e1",
												fontSize: "13px",
												background: "#fff",
												color: "#0f172a",
												outline: "none"
											},
											children: [/* @__PURE__ */ jsx("option", {
												value: "",
												children: "Select a Pinterest Board..."
											}), boards.map((b) => /* @__PURE__ */ jsxs("option", {
												value: b.id,
												children: [
													b.name,
													" ",
													b.is_default ? "⭐ (Default)" : ""
												]
											}, b.id))]
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: "6px"
											},
											children: [/* @__PURE__ */ jsxs("label", {
												style: {
													fontSize: "11px",
													fontWeight: 800,
													color: "#475569",
													textTransform: "uppercase",
													letterSpacing: "0.4px"
												},
												children: ["PIN TITLE ", /* @__PURE__ */ jsx("span", {
													style: { color: "#ef4444" },
													children: "*"
												})]
											}), /* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: "11px",
													fontWeight: 800,
													padding: "2px 8px",
													borderRadius: "6px",
													background: currentTitle.length > 100 ? "#fee2e2" : currentTitle.length > 90 ? "#fef3c7" : "#f1f5f9",
													color: currentTitle.length > 100 ? "#dc2626" : currentTitle.length > 90 ? "#d97706" : "#64748b"
												},
												children: [currentTitle.length, " / 100"]
											})]
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											maxLength: 100,
											value: currentTitle,
											onChange: (e) => setEditTitles({
												...editTitles,
												[share.id]: e.target.value
											}),
											placeholder: "SEO-rich Pin title (under 100 characters)...",
											style: {
												width: "100%",
												padding: "9px 12px",
												borderRadius: "8px",
												border: "1px solid #cbd5e1",
												fontSize: "13px",
												background: "#fff",
												color: "#0f172a",
												boxSizing: "border-box",
												outline: "none"
											}
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
													marginBottom: "6px"
												},
												children: [/* @__PURE__ */ jsxs("label", {
													style: {
														fontSize: "11px",
														fontWeight: 800,
														color: "#475569",
														textTransform: "uppercase",
														letterSpacing: "0.4px"
													},
													children: ["PIN DESCRIPTION (MAX 500 CHARS) ", /* @__PURE__ */ jsx("span", {
														style: { color: "#ef4444" },
														children: "*"
													})]
												}), /* @__PURE__ */ jsxs("span", {
													style: {
														fontSize: "11px",
														fontWeight: 800,
														padding: "2px 8px",
														borderRadius: "6px",
														background: currentDescription.length > 500 ? "#fee2e2" : currentDescription.length > 480 ? "#fef3c7" : "#f1f5f9",
														color: currentDescription.length > 500 ? "#dc2626" : currentDescription.length > 480 ? "#d97706" : "#64748b"
													},
													children: [currentDescription.length, " / 500"]
												})]
											}),
											/* @__PURE__ */ jsx("textarea", {
												rows: 6,
												maxLength: 500,
												value: currentDescription,
												onChange: (e) => setEditDescriptions({
													...editDescriptions,
													[share.id]: e.target.value
												}),
												placeholder: "Helpful summary answering search intent, bullet points, CTA, and search hashtags...",
												style: {
													width: "100%",
													padding: "10px 12px",
													borderRadius: "8px",
													border: "1px solid #cbd5e1",
													fontSize: "13px",
													lineHeight: 1.5,
													background: "#fff",
													color: "#0f172a",
													boxSizing: "border-box",
													outline: "none",
													resize: "vertical"
												}
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "11px",
													color: "#64748b",
													marginTop: "4px"
												},
												children: "💡 Structured format: Hook + 2 bullet points + Save CTA + 4-6 search hashtags."
											})
										] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											style: {
												display: "block",
												fontSize: "11px",
												fontWeight: 800,
												color: "#475569",
												textTransform: "uppercase",
												letterSpacing: "0.4px",
												marginBottom: "6px"
											},
											children: "DESTINATION LINK (URL)"
										}), /* @__PURE__ */ jsx("input", {
											type: "url",
											value: currentTargetLink,
											onChange: (e) => setEditTargetLinks({
												...editTargetLinks,
												[share.id]: e.target.value
											}),
											placeholder: "https://coachingsinsikar.com/blog/...",
											style: {
												width: "100%",
												padding: "9px 12px",
												borderRadius: "8px",
												border: "1px solid #cbd5e1",
												fontSize: "13px",
												background: "#fff",
												color: "#0f172a",
												boxSizing: "border-box",
												outline: "none"
											}
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											style: {
												display: "block",
												fontSize: "11px",
												fontWeight: 800,
												color: "#475569",
												textTransform: "uppercase",
												letterSpacing: "0.4px",
												marginBottom: "6px"
											},
											children: "IMAGE ALT TEXT (ACCESSIBILITY & SEARCH)"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											maxLength: 300,
											value: currentAltText,
											onChange: (e) => setEditAltTexts({
												...editAltTexts,
												[share.id]: e.target.value
											}),
											placeholder: "Describe what is seen in the graphic for Pinterest search and screen readers...",
											style: {
												width: "100%",
												padding: "9px 12px",
												borderRadius: "8px",
												border: "1px solid #cbd5e1",
												fontSize: "13px",
												background: "#fff",
												color: "#0f172a",
												boxSizing: "border-box",
												outline: "none"
											}
										})] })
									]
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: {
										display: "block",
										fontSize: "11px",
										fontWeight: 800,
										color: "#475569",
										textTransform: "uppercase",
										letterSpacing: "0.4px",
										marginBottom: "6px"
									},
									children: "PIN GRAPHIC PREVIEW"
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										background: "#f8fafc",
										border: "1px solid #e2e8f0",
										borderRadius: "8px",
										padding: "8px",
										display: "flex",
										flexDirection: "column",
										gap: "8px"
									},
									children: [
										/* @__PURE__ */ jsx("img", {
											src: currentImage,
											alt: currentAltText || "Pin Graphic",
											style: {
												width: "100%",
												height: "260px",
												objectFit: "cover",
												borderRadius: "8px",
												border: "1px solid #e2e8f0"
											},
											onError: (e) => {
												e.target.src = "/uploads/aboutus.webp";
											}
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "11px",
												color: "#64748b",
												textAlign: "center"
											},
											children: "📌 Pinterest 2:3 vertical recommended"
										}),
										/* @__PURE__ */ jsx("input", {
											ref: (el) => cardFileInputRefs.current[share.id] = el,
											type: "file",
											accept: "image/*",
											onChange: (e) => handleCardImageUpload(share.id, e),
											style: { display: "none" }
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => cardFileInputRefs.current[share.id]?.click(),
											disabled: uploadingShareId === share.id,
											style: {
												width: "100%",
												background: "#fff",
												color: "#1e293b",
												border: "1px solid #cbd5e1",
												padding: "8px 12px",
												borderRadius: "8px",
												fontSize: "12px",
												fontWeight: 700,
												cursor: "pointer",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												gap: "6px"
											},
											children: [/* @__PURE__ */ jsx(UploadCloud, {
												size: 14,
												color: "#e60023"
											}), /* @__PURE__ */ jsx("span", { children: uploadingShareId === share.id ? "Uploading..." : "Change Pin Graphic" })]
										})
									]
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									paddingTop: "16px",
									borderTop: "1px solid #f1f5f9",
									flexWrap: "wrap",
									gap: "12px"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "10px"
									},
									children: /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => handleRegenerateDraft(share.id),
										disabled: isRegenerating,
										style: {
											background: "#f8fafc",
											color: "#0f172a",
											border: "1px solid #cbd5e1",
											padding: "9px 16px",
											borderRadius: "10px",
											fontSize: "13px",
											fontWeight: 700,
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											gap: "6px"
										},
										title: "Regenerate Pinterest Title, Description & Hashtags using Gemini AI",
										children: [/* @__PURE__ */ jsx(Sparkles, {
											size: 14,
											color: "#e60023"
										}), /* @__PURE__ */ jsx("span", { children: isRegenerating ? "Crafting with AI..." : "Regenerate with AI" })]
									})
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									disabled: approvingId === share.id,
									onClick: () => handleApprove(share),
									style: {
										background: "#e60023",
										color: "#fff",
										border: "none",
										padding: "11px 24px",
										borderRadius: "10px",
										fontWeight: 800,
										fontSize: "13px",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										gap: "8px",
										boxShadow: "0 4px 12px rgba(230,0,35,0.25)"
									},
									children: [/* @__PURE__ */ jsx(Pin, { size: 15 }), /* @__PURE__ */ jsx("span", { children: approvingId === share.id ? "Pinning to Pinterest..." : "Approve & Pin to Pinterest" })]
								})]
							}),
							publishFeedback[share.id]?.pin_url && /* @__PURE__ */ jsxs("div", {
								style: {
									background: "#ecfdf5",
									border: "1px solid #a7f3d0",
									color: "#065f46",
									padding: "12px 16px",
									borderRadius: "10px",
									fontSize: "13px",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsx(CheckCircle2, {
										size: 16,
										color: "#059669"
									}), /* @__PURE__ */ jsx("span", { children: "Pin published successfully to Pinterest!" })]
								}), /* @__PURE__ */ jsx("a", {
									href: publishFeedback[share.id].pin_url,
									target: "_blank",
									rel: "noreferrer",
									style: {
										fontWeight: 800,
										color: "#047857",
										textDecoration: "none"
									},
									children: "View Live on Pinterest →"
								})]
							})
						]
					}, share.id);
				})
			})] }),
			isAddPostModalOpen && /* @__PURE__ */ jsx("div", {
				style: {
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "rgba(15, 23, 42, 0.65)",
					backdropFilter: "blur(4px)",
					zIndex: 9999,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "20px"
				},
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						borderRadius: "20px",
						width: "100%",
						maxWidth: "680px",
						maxHeight: "85vh",
						display: "flex",
						flexDirection: "column",
						boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
						overflow: "hidden"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								padding: "20px 24px",
								borderBottom: "1px solid #e2e8f0",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								background: "#f8fafc"
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "18px",
									fontWeight: 800,
									color: "#0f172a",
									margin: 0
								},
								children: "Select Blog Post to Draft Pinterest Pin"
							}), /* @__PURE__ */ jsx("p", {
								style: {
									margin: "3px 0 0 0",
									fontSize: "12px",
									color: "#64748b"
								},
								children: "Gemini AI will automatically generate an SEO-optimized Pin title, description, and hashtags from the content."
							})] }), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setIsAddPostModalOpen(false),
								style: {
									background: "none",
									border: "none",
									padding: "6px",
									borderRadius: "8px",
									cursor: "pointer",
									color: "#64748b"
								},
								children: /* @__PURE__ */ jsx(X, { size: 20 })
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								padding: "16px 24px",
								borderBottom: "1px solid #f1f5f9"
							},
							children: /* @__PURE__ */ jsxs("div", {
								style: { position: "relative" },
								children: [/* @__PURE__ */ jsx(Search, {
									size: 16,
									color: "#94a3b8",
									style: {
										position: "absolute",
										left: "12px",
										top: "12px"
									}
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: postSearchQuery,
									onChange: (e) => setPostSearchQuery(e.target.value),
									placeholder: "Search published blog posts by title or category...",
									style: {
										width: "100%",
										padding: "10px 14px 10px 38px",
										borderRadius: "10px",
										border: "1px solid #cbd5e1",
										fontSize: "13px",
										outline: "none",
										boxSizing: "border-box"
									}
								})]
							})
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								flex: 1,
								overflowY: "auto",
								padding: "16px 24px",
								display: "flex",
								flexDirection: "column",
								gap: "12px"
							},
							children: filteredAvailablePosts.length === 0 ? /* @__PURE__ */ jsx("div", {
								style: {
									textAlign: "center",
									padding: "40px 20px",
									color: "#94a3b8"
								},
								children: "No published blog posts found matching your search."
							}) : filteredAvailablePosts.map((post) => /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: "14px",
									padding: "12px 14px",
									borderRadius: "12px",
									border: "1px solid #e2e8f0",
									background: "#fff",
									transition: "all 0.15s ease"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "12px",
										flex: 1,
										minWidth: 0
									},
									children: [/* @__PURE__ */ jsx("img", {
										src: post.cover_image || "/uploads/aboutus.webp",
										alt: post.title,
										style: {
											width: "56px",
											height: "56px",
											objectFit: "cover",
											borderRadius: "8px",
											border: "1px solid #e2e8f0",
											flexShrink: 0
										}
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											minWidth: 0,
											flex: 1
										},
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "6px",
												marginBottom: "2px"
											},
											children: [/* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "11px",
													fontWeight: 700,
													color: "#e60023"
												},
												children: post.category
											}), post.date && /* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: "11px",
													color: "#94a3b8"
												},
												children: ["• ", post.date]
											})]
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "13px",
												fontWeight: 700,
												color: "#0f172a",
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis"
											},
											children: post.title
										})]
									})]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleAddPostToApprovals(post.id),
									disabled: isDraftingPostId === post.id,
									style: {
										background: isDraftingPostId === post.id ? "#cbd5e1" : "#e60023",
										color: "#fff",
										border: "none",
										padding: "9px 16px",
										borderRadius: "8px",
										fontSize: "12px",
										fontWeight: 700,
										cursor: isDraftingPostId === post.id ? "wait" : "pointer",
										display: "flex",
										alignItems: "center",
										gap: "6px",
										flexShrink: 0
									},
									children: [/* @__PURE__ */ jsx(Sparkles, { size: 14 }), /* @__PURE__ */ jsx("span", { children: isDraftingPostId === post.id ? "Drafting Pin..." : "Draft Pin with AI" })]
								})]
							}, post.id))
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								padding: "14px 24px",
								borderTop: "1px solid #e2e8f0",
								background: "#f8fafc",
								display: "flex",
								justifyContent: "flex-end"
							},
							children: /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setIsAddPostModalOpen(false),
								style: {
									background: "#fff",
									border: "1px solid #cbd5e1",
									padding: "8px 16px",
									borderRadius: "8px",
									fontSize: "13px",
									fontWeight: 700,
									color: "#475569",
									cursor: "pointer"
								},
								children: "Close"
							})
						})
					]
				})
			}),
			activeTab === "compose" && /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					padding: "32px",
					borderRadius: "16px",
					border: "1px solid #e2e8f0",
					maxWidth: "760px",
					boxShadow: "0 3px 12px rgba(0,0,0,0.03)"
				},
				children: [
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontSize: "19px",
							fontWeight: 900,
							color: "#0f172a",
							margin: "0 0 4px 0",
							display: "flex",
							alignItems: "center",
							gap: "8px"
						},
						children: [/* @__PURE__ */ jsx(PenSquare, {
							size: 18,
							color: "#e60023"
						}), " Direct Pin Composer"]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 24px 0",
							fontSize: "13px",
							color: "#64748b"
						},
						children: "Create and publish a visual Pin directly from your device to any connected Pinterest board via API v5."
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleCustomPinSubmit,
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "18px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
								style: {
									display: "block",
									fontSize: "11px",
									fontWeight: 800,
									color: "#475569",
									textTransform: "uppercase",
									letterSpacing: "0.4px",
									marginBottom: "6px"
								},
								children: ["TARGET PINTEREST BOARD ", /* @__PURE__ */ jsx("span", {
									style: { color: "#ef4444" },
									children: "*"
								})]
							}), /* @__PURE__ */ jsxs("select", {
								required: true,
								value: customBoardId,
								onChange: (e) => setCustomBoardId(e.target.value),
								style: {
									width: "100%",
									padding: "9px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#fff",
									color: "#0f172a",
									outline: "none"
								},
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Select Board..."
								}), boards.map((b) => /* @__PURE__ */ jsxs("option", {
									value: b.id,
									children: [
										b.name,
										" ",
										b.is_default ? "⭐ (Default)" : ""
									]
								}, b.id))]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "6px"
								},
								children: [/* @__PURE__ */ jsxs("label", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#475569",
										textTransform: "uppercase",
										letterSpacing: "0.4px"
									},
									children: ["PIN TITLE ", /* @__PURE__ */ jsx("span", {
										style: { color: "#ef4444" },
										children: "*"
									})]
								}), /* @__PURE__ */ jsxs("span", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										padding: "2px 8px",
										borderRadius: "6px",
										background: customTitle.length > 100 ? "#fee2e2" : customTitle.length > 90 ? "#fef3c7" : "#f1f5f9",
										color: customTitle.length > 100 ? "#dc2626" : customTitle.length > 90 ? "#d97706" : "#64748b"
									},
									children: [customTitle.length, " / 100"]
								})]
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								maxLength: 100,
								placeholder: "e.g. Best NEET Coaching in Sikar [2026 Rankings & Fees]",
								value: customTitle,
								onChange: (e) => setCustomTitle(e.target.value),
								style: {
									width: "100%",
									padding: "9px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#fff",
									color: "#0f172a",
									boxSizing: "border-box",
									outline: "none"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: "6px"
								},
								children: [/* @__PURE__ */ jsxs("label", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#475569",
										textTransform: "uppercase",
										letterSpacing: "0.4px"
									},
									children: ["PIN PHOTO (2:3 VERTICAL RECOMMENDED) ", /* @__PURE__ */ jsx("span", {
										style: { color: "#ef4444" },
										children: "*"
									})]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowManualUrl(!showManualUrl),
									style: {
										background: "none",
										border: "none",
										color: "#e60023",
										fontSize: "12px",
										fontWeight: 700,
										cursor: "pointer",
										padding: 0
									},
									children: showManualUrl ? "Upload File Instead" : " Or Paste Image URL"
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
									borderRadius: "8px"
								},
								children: [
									/* @__PURE__ */ jsx("img", {
										src: customImage,
										alt: "Uploaded preview",
										style: {
											width: "60px",
											height: "90px",
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
												color: "#0f172a"
											},
											children: "✓ Pin image uploaded"
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
												background: "#fef2f2",
												color: "#e60023",
												border: "1px solid #fecaca",
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
												background: "#f1f5f9",
												color: "#475569",
												border: "1px solid #cbd5e1",
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
									borderRadius: "8px",
									padding: "28px 16px",
									textAlign: "center",
									background: "#f8fafc",
									cursor: isUploadingImage ? "wait" : "pointer"
								},
								children: isUploadingImage ? /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "13px",
										fontWeight: 700,
										color: "#e60023"
									},
									children: "⏳ Uploading and optimizing photo..."
								}) : /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											justifyContent: "center",
											marginBottom: "8px"
										},
										children: /* @__PURE__ */ jsx(Pin, {
											size: 30,
											color: "#e60023"
										})
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "13px",
											fontWeight: 700,
											color: "#1e293b"
										},
										children: "Click to upload Pin photo from your device"
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "11px",
											color: "#64748b",
											marginTop: "4px"
										},
										children: "Recommended: 2:3 vertical (1000x1500) or square JPG/PNG/WebP"
									})
								] })
							})] }) : /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								value: customImage,
								onChange: (e) => setCustomImage(e.target.value),
								placeholder: "https://coachingsinsikar.com/uploads/... or https://...",
								style: {
									width: "100%",
									padding: "9px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#fff",
									color: "#0f172a",
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
										fontSize: "11px",
										fontWeight: 800,
										color: "#475569",
										textTransform: "uppercase",
										letterSpacing: "0.4px"
									},
									children: "PIN DESCRIPTION (MAX 500 CHARS)"
								}), /* @__PURE__ */ jsxs("span", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										padding: "2px 8px",
										borderRadius: "6px",
										background: customDescription.length > 500 ? "#fee2e2" : customDescription.length > 480 ? "#fef3c7" : "#f1f5f9",
										color: customDescription.length > 500 ? "#dc2626" : customDescription.length > 480 ? "#d97706" : "#64748b"
									},
									children: [customDescription.length, " / 500"]
								})]
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 5,
								maxLength: 500,
								placeholder: "Explain what this pin is about, add helpful tips and high-traffic hashtags like #Sikar #NEETCoaching...",
								value: customDescription,
								onChange: (e) => setCustomDescription(e.target.value),
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									lineHeight: 1.5,
									background: "#fff",
									color: "#0f172a",
									outline: "none",
									boxSizing: "border-box",
									resize: "vertical"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "11px",
									fontWeight: 800,
									color: "#475569",
									textTransform: "uppercase",
									letterSpacing: "0.4px",
									marginBottom: "6px"
								},
								children: "DESTINATION LINK (URL)"
							}), /* @__PURE__ */ jsx("input", {
								type: "url",
								placeholder: "https://coachingsinsikar.com/blog/jee-mains-guide",
								value: customLink,
								onChange: (e) => setCustomLink(e.target.value),
								style: {
									width: "100%",
									padding: "9px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#fff",
									color: "#0f172a",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "11px",
									fontWeight: 800,
									color: "#475569",
									textTransform: "uppercase",
									letterSpacing: "0.4px",
									marginBottom: "6px"
								},
								children: "IMAGE ALT TEXT (ACCESSIBILITY & SEARCH)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								maxLength: 300,
								placeholder: "Visual description for screen readers and Pinterest visual AI...",
								value: customAltText,
								onChange: (e) => setCustomAltText(e.target.value),
								style: {
									width: "100%",
									padding: "9px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#fff",
									color: "#0f172a",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: isPublishingCustom || !customTitle.trim() || !customImage.trim() || !customBoardId,
								style: {
									background: "#e60023",
									color: "#fff",
									border: "none",
									padding: "11px 24px",
									borderRadius: "8px",
									fontWeight: 800,
									fontSize: "13px",
									cursor: "pointer",
									alignSelf: "flex-start",
									boxShadow: "0 4px 12px rgba(230,0,35,0.25)"
								},
								children: isPublishingCustom ? "Creating Pin on Pinterest..." : "Create Pin"
							})
						]
					})
				]
			}),
			activeTab === "boards" && /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "24px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						padding: "24px",
						borderRadius: "16px",
						border: "1px solid #e2e8f0",
						maxWidth: "600px"
					},
					children: [/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "16px",
							fontWeight: 800,
							color: "#0f172a",
							margin: "0 0 16px 0"
						},
						children: "Create New Pinterest Board"
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleCreateBoardSubmit,
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "14px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
								style: {
									display: "block",
									fontSize: "11px",
									fontWeight: 800,
									color: "#475569",
									textTransform: "uppercase",
									letterSpacing: "0.4px",
									marginBottom: "6px"
								},
								children: ["BOARD NAME ", /* @__PURE__ */ jsx("span", {
									style: { color: "#ef4444" },
									children: "*"
								})]
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								placeholder: "e.g. Sikar Coaching Institutes",
								value: newBoardName,
								onChange: (e) => setNewBoardName(e.target.value),
								style: {
									width: "100%",
									padding: "9px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#fff",
									color: "#0f172a",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "11px",
									fontWeight: 800,
									color: "#475569",
									textTransform: "uppercase",
									letterSpacing: "0.4px",
									marginBottom: "6px"
								},
								children: "DESCRIPTION"
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 2,
								placeholder: "Brief summary of pins in this board...",
								value: newBoardDescription,
								onChange: (e) => setNewBoardDescription(e.target.value),
								style: {
									width: "100%",
									padding: "9px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#fff",
									color: "#0f172a",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: isCreatingBoard || !newBoardName.trim(),
								style: {
									background: "#e60023",
									color: "#fff",
									border: "none",
									padding: "9px 18px",
									borderRadius: "8px",
									fontWeight: 700,
									fontSize: "13px",
									cursor: "pointer",
									alignSelf: "flex-start"
								},
								children: isCreatingBoard ? "Creating Board..." : "Create Board on Pinterest "
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
					style: {
						fontSize: "16px",
						fontWeight: 800,
						color: "#0f172a",
						margin: "0 0 16px 0"
					},
					children: [
						"Connected Pinterest Boards (",
						boards.length,
						")"
					]
				}), boards.length === 0 ? /* @__PURE__ */ jsx("div", {
					style: {
						background: "#fff",
						border: "1px dashed #cbd5e1",
						borderRadius: "12px",
						padding: "32px",
						textAlign: "center",
						color: "#64748b"
					},
					children: "No boards found. Click \"Sync Boards\" above or create your first board."
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
					children: boards.map((b) => /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							borderRadius: "12px",
							border: b.is_default ? "2px solid #e60023" : "1px solid #e2e8f0",
							padding: "16px",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between"
						},
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									marginBottom: "6px"
								},
								children: [/* @__PURE__ */ jsx("span", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: b.privacy === "PUBLIC" ? "#059669" : "#64748b",
										textTransform: "uppercase"
									},
									children: b.privacy
								}), b.is_default && /* @__PURE__ */ jsx("span", {
									style: {
										background: "#fef2f2",
										color: "#e60023",
										fontSize: "10px",
										fontWeight: 800,
										padding: "2px 6px",
										borderRadius: "4px"
									},
									children: "DEFAULT"
								})]
							}),
							/* @__PURE__ */ jsx("h4", {
								style: {
									margin: "0 0 4px 0",
									fontSize: "15px",
									fontWeight: 800,
									color: "#0f172a"
								},
								children: b.name
							}),
							b.description && /* @__PURE__ */ jsx("p", {
								style: {
									margin: "0 0 10px 0",
									fontSize: "12px",
									color: "#64748b",
									lineHeight: 1.4
								},
								children: b.description
							})
						] }), /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								borderTop: "1px solid #f1f5f9",
								paddingTop: "12px",
								marginTop: "12px"
							},
							children: [/* @__PURE__ */ jsxs("span", {
								style: {
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b"
								},
								children: [b.pin_count, " pins"]
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "8px"
								},
								children: [!b.is_default && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => router.post(`/admin/pinterest/default-board/${b.id}`),
									style: {
										background: "#f1f5f9",
										border: "none",
										padding: "6px 10px",
										borderRadius: "6px",
										fontSize: "11px",
										fontWeight: 700,
										cursor: "pointer"
									},
									children: "Make Default"
								}), /* @__PURE__ */ jsx("a", {
									href: b.board_url,
									target: "_blank",
									rel: "noreferrer",
									style: {
										fontSize: "11px",
										fontWeight: 700,
										color: "#e60023",
										textDecoration: "none",
										display: "flex",
										alignItems: "center"
									},
									children: "View ↗"
								})]
							})]
						})]
					}, b.id))
				})] })]
			}),
			activeTab === "settings" && /* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "24px",
					maxWidth: "800px"
				},
				children: [
					allAccounts.length > 0 && /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							padding: "28px",
							borderRadius: "16px",
							border: "1px solid #e2e8f0",
							boxShadow: "0 3px 12px rgba(0,0,0,0.03)"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "16px",
								flexWrap: "wrap",
								gap: "10px"
							},
							children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								style: {
									fontSize: "17px",
									fontWeight: 800,
									color: "#0f172a",
									margin: 0,
									display: "flex",
									alignItems: "center",
									gap: "8px"
								},
								children: [
									/* @__PURE__ */ jsx(Users, {
										size: 18,
										color: "#e60023"
									}),
									" Connected Pinterest Accounts (",
									allAccounts.length,
									")"
								]
							}), /* @__PURE__ */ jsx("p", {
								style: {
									margin: "3px 0 0 0",
									fontSize: "13px",
									color: "#64748b"
								},
								children: "Switch active account anytime, or connect an additional Pinterest business profile."
							})] })
						}), /* @__PURE__ */ jsx("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "12px"
							},
							children: allAccounts.map((acc) => /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "14px 16px",
									borderRadius: "12px",
									border: acc.is_active ? "2px solid #e60023" : "1px solid #e2e8f0",
									background: acc.is_active ? "#fef2f2" : "#f8fafc"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "12px"
									},
									children: [acc.avatar ? /* @__PURE__ */ jsx("img", {
										src: acc.avatar,
										alt: acc.username,
										style: {
											width: "44px",
											height: "44px",
											borderRadius: "50%",
											objectFit: "cover"
										}
									}) : /* @__PURE__ */ jsx("div", {
										style: {
											width: "44px",
											height: "44px",
											borderRadius: "50%",
											background: "#e60023",
											color: "#fff",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontWeight: 800,
											fontSize: "16px"
										},
										children: acc.username.charAt(0).toUpperCase()
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "8px"
										},
										children: [/* @__PURE__ */ jsxs("strong", {
											style: {
												fontSize: "14px",
												color: "#0f172a"
											},
											children: ["@", acc.username]
										}), acc.is_active ? /* @__PURE__ */ jsx("span", {
											style: {
												background: "#10b981",
												color: "#fff",
												fontSize: "10px",
												fontWeight: 800,
												padding: "2px 8px",
												borderRadius: "10px"
											},
											children: "✓ ACTIVE"
										}) : null]
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "12px",
											color: "#64748b",
											marginTop: "2px"
										},
										children: [
											acc.name || acc.username,
											" • ",
											acc.board_count || 0,
											" boards • ",
											acc.pin_count || 0,
											" pins"
										]
									})] })]
								}), !acc.is_active && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleSwitchAccount(acc.id),
									style: {
										background: "#fff",
										color: "#e60023",
										border: "1px solid #e60023",
										padding: "7px 14px",
										borderRadius: "8px",
										fontSize: "12px",
										fontWeight: 700,
										cursor: "pointer"
									},
									children: "Switch to this Account"
								})]
							}, acc.id))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							padding: "28px",
							borderRadius: "16px",
							border: "1px solid #e2e8f0",
							boxShadow: "0 3px 12px rgba(0,0,0,0.03)"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start",
								flexWrap: "wrap",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									flex: 1,
									minWidth: "280px"
								},
								children: [/* @__PURE__ */ jsxs("h3", {
									style: {
										fontSize: "17px",
										fontWeight: 800,
										color: "#0f172a",
										margin: "0 0 6px 0",
										display: "flex",
										alignItems: "center",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsx(Pin, {
										size: 18,
										color: "#e60023"
									}), " Option 1: Login with Pinterest (OAuth 2.0)"]
								}), /* @__PURE__ */ jsxs("p", {
									style: {
										margin: 0,
										fontSize: "13px",
										color: "#64748b",
										lineHeight: 1.5
									},
									children: [
										"Connect via your official Pinterest App credentials (App ID: ",
										/* @__PURE__ */ jsx("code", { children: clientId || "1629443" }),
										"). Click below to authorize directly on Pinterest without copying tokens manually."
									]
								})]
							}), /* @__PURE__ */ jsxs("a", {
								href: "/auth/pinterest",
								style: {
									background: "#e60023",
									color: "#fff",
									border: "none",
									padding: "11px 22px",
									borderRadius: "10px",
									fontWeight: 800,
									fontSize: "13px",
									textDecoration: "none",
									display: "inline-flex",
									alignItems: "center",
									gap: "8px",
									boxShadow: "0 4px 14px rgba(230,0,35,0.25)"
								},
								children: [/* @__PURE__ */ jsx(Pin, { size: 15 }), /* @__PURE__ */ jsx("span", { children: "Connect with Pinterest" })]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								marginTop: "16px",
								padding: "12px 14px",
								background: "#f8fafc",
								border: "1px solid #e2e8f0",
								borderRadius: "10px",
								fontSize: "12px",
								color: "#475569"
							},
							children: [
								"⚠️ ",
								/* @__PURE__ */ jsx("strong", { children: "Redirect URI Setting:" }),
								" Ensure ",
								/* @__PURE__ */ jsx("code", { children: redirectUri }),
								" is added under ",
								/* @__PURE__ */ jsx("strong", { children: "Redirect URIs" }),
								" in your app settings on ",
								/* @__PURE__ */ jsx("a", {
									href: "https://developers.pinterest.com/apps/",
									target: "_blank",
									rel: "noreferrer",
									style: {
										color: "#e60023",
										fontWeight: 700
									},
									children: "developers.pinterest.com"
								}),
								"."
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							padding: "28px",
							borderRadius: "16px",
							border: "1px solid #e2e8f0",
							boxShadow: "0 3px 12px rgba(0,0,0,0.03)"
						},
						children: [
							/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "17px",
									fontWeight: 800,
									color: "#0f172a",
									margin: "0 0 4px 0"
								},
								children: "Option 2: Link Account via Direct Access Token"
							}),
							/* @__PURE__ */ jsx("p", {
								style: {
									margin: "0 0 20px 0",
									fontSize: "13px",
									color: "#64748b"
								},
								children: "If you generated a Pinterest User Token from developers.pinterest.com for another account (or your primary account), paste it here to authenticate and link immediately."
							}),
							hasConfiguredToken && /* @__PURE__ */ jsxs("div", {
								style: {
									background: "#ecfdf5",
									border: "1px solid #a7f3d0",
									padding: "12px 16px",
									borderRadius: "10px",
									marginBottom: "16px",
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: "12px",
									flexWrap: "wrap"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsx(CheckCircle2, { style: {
										width: "18px",
										height: "18px",
										color: "#059669",
										flexShrink: 0
									} }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "13px",
											fontWeight: 700,
											color: "#065f46"
										},
										children: "Configured Token Found in Environment (.env)"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "12px",
											color: "#047857",
											fontFamily: "monospace"
										},
										children: configuredTokenPreview
									})] })]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleSyncConfiguredToken,
									disabled: isSyncingConfigured,
									style: {
										background: "#059669",
										color: "#fff",
										border: "none",
										padding: "8px 16px",
										borderRadius: "8px",
										fontSize: "12px",
										fontWeight: 700,
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										gap: "6px"
									},
									children: [/* @__PURE__ */ jsx(RefreshCw, { style: {
										width: "14px",
										height: "14px",
										animation: isSyncingConfigured ? "spin 1s linear infinite" : "none"
									} }), /* @__PURE__ */ jsx("span", { children: isSyncingConfigured ? "Syncing..." : "Sync Configured Token Now" })]
								})]
							}),
							/* @__PURE__ */ jsxs("form", {
								onSubmit: handleManualTokenSubmit,
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "14px"
								},
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										style: {
											display: "block",
											fontSize: "11px",
											fontWeight: 800,
											color: "#475569",
											textTransform: "uppercase",
											letterSpacing: "0.4px",
											marginBottom: "6px"
										},
										children: ["NEW PINTEREST ACCESS TOKEN ", /* @__PURE__ */ jsx("span", {
											style: { color: "#ef4444" },
											children: "*"
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "password",
										required: true,
										placeholder: "pina_AMAQH...",
										value: manualToken,
										onChange: (e) => setManualToken(e.target.value),
										style: {
											width: "100%",
											padding: "9px 12px",
											borderRadius: "8px",
											border: "1px solid #cbd5e1",
											fontSize: "13px",
											background: "#fff",
											color: "#0f172a",
											boxSizing: "border-box",
											outline: "none"
										}
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "11px",
											color: "#64748b",
											marginTop: "4px"
										},
										children: "💡 Tip: To link a second account, paste its token here. Both accounts will be saved and you can switch between them at any time."
									})
								] }), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: isSavingManual || !manualToken.trim(),
									style: {
										background: "#e60023",
										color: "#fff",
										border: "none",
										padding: "11px 22px",
										borderRadius: "8px",
										fontWeight: 800,
										fontSize: "13px",
										cursor: "pointer",
										alignSelf: "flex-start",
										boxShadow: "0 4px 12px rgba(230,0,35,0.2)"
									},
									children: isSavingManual ? "Verifying Account..." : "Save & Connect Access Token"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
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
							children: "Pinterest Developer App Details"
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
										fontSize: "11px",
										fontWeight: 800,
										color: "#475569",
										textTransform: "uppercase",
										letterSpacing: "0.4px",
										marginBottom: "6px"
									},
									children: "PINTEREST APP ID (PINTEREST_APP_ID)"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									readOnly: true,
									value: clientId || "(Not set in .env)",
									style: {
										width: "100%",
										padding: "9px 12px",
										borderRadius: "8px",
										border: "1px solid #cbd5e1",
										fontSize: "13px",
										background: "#f8fafc",
										color: "#475569",
										boxSizing: "border-box"
									}
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: {
										display: "block",
										fontSize: "11px",
										fontWeight: 800,
										color: "#475569",
										textTransform: "uppercase",
										letterSpacing: "0.4px",
										marginBottom: "6px"
									},
									children: "PINTEREST CLIENT SECRET (PINTEREST_APP_SECRET)"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									readOnly: true,
									value: hasClientSecret ? "••••••••••••••••••••••••••••••••" : "(Not configured)",
									style: {
										width: "100%",
										padding: "9px 12px",
										borderRadius: "8px",
										border: "1px solid #cbd5e1",
										fontSize: "13px",
										background: "#f8fafc",
										color: "#475569",
										boxSizing: "border-box"
									}
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: {
										display: "block",
										fontSize: "11px",
										fontWeight: 800,
										color: "#475569",
										textTransform: "uppercase",
										letterSpacing: "0.4px",
										marginBottom: "6px"
									},
									children: "OAUTH 2.0 REDIRECT URI"
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
											padding: "9px 12px",
											borderRadius: "8px",
											border: "1px solid #cbd5e1",
											fontSize: "13px",
											background: "#f8fafc",
											color: "#475569"
										}
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: handleCopyUri,
										style: {
											background: copiedUri ? "#10b981" : "#f1f5f9",
											color: copiedUri ? "#fff" : "#1e293b",
											border: "1px solid #cbd5e1",
											padding: "10px 14px",
											borderRadius: "8px",
											fontWeight: 700,
											fontSize: "12px",
											cursor: "pointer"
										},
										children: copiedUri ? "Copied!" : "Copy"
									})]
								})] })
							]
						})]
					})
				]
			})
		]
	}) });
}
//#endregion
export { PinterestHubPage as default };
