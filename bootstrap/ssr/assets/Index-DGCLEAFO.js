import AdminLayout from "./AdminLayout-B4V0SEL8.js";
import { Head, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { FileCheck, FolderPlus, PenSquare, Pin, Settings } from "lucide-react";
//#region resources/js/Pages/Admin/Pinterest/Index.jsx
function PinterestHubPage({ needsMigration = false, isConfigured, clientId, hasClientSecret, redirectUri, account, boards = [], defaultBoard, pendingApprovals = [], recentShares = [], recentPins = [], authUrl, errorMessage = null }) {
	const [activeTab, setActiveTab] = useState("approvals");
	const [approvingId, setApprovingId] = useState(null);
	const [editTitles, setEditTitles] = useState({});
	const [editDescriptions, setEditDescriptions] = useState({});
	const [selectedBoards, setSelectedBoards] = useState({});
	const [customBoardId, setCustomBoardId] = useState(defaultBoard?.id || boards[0]?.id || "");
	const [customTitle, setCustomTitle] = useState("");
	const [customDescription, setCustomDescription] = useState("");
	const [customImage, setCustomImage] = useState("");
	const [customLink, setCustomLink] = useState("");
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
	const handleApprove = async (share) => {
		setApprovingId(share.id);
		const finalTitle = editTitles[share.id] !== void 0 ? editTitles[share.id] : share.title;
		const finalDescription = editDescriptions[share.id] !== void 0 ? editDescriptions[share.id] : share.description;
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
					image_url: share.image_url,
					target_link: share.target_link
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
			target_link: customLink
		}, { onFinish: () => {
			setIsPublishingCustom(false);
			setCustomTitle("");
			setCustomDescription("");
			setCustomImage("");
			setCustomLink("");
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
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		style: {
			animation: "fadeIn 0.3s ease-out",
			paddingBottom: "40px"
		},
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Pinterest Hub & Board Manager | Admin" }),
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
					children: "Pinterest Database Tables Setup Required"
				}), /* @__PURE__ */ jsx("span", {
					style: { fontSize: "13px" },
					children: "Pinterest integration tables are not created yet in the database. Run the system upgrade to activate all features."
				})] }), /* @__PURE__ */ jsx("a", {
					href: "/app-upgrade",
					style: {
						background: "#e60023",
						color: "#fff",
						padding: "9px 18px",
						borderRadius: "8px",
						fontWeight: 700,
						textDecoration: "none",
						fontSize: "13px",
						whiteSpace: "nowrap"
					},
					children: "Run Database Upgrade"
				})]
			}),
			errorMessage && /* @__PURE__ */ jsx("div", {
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
				children: errorMessage
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "linear-gradient(135deg, #e60023, #ad081b)",
					borderRadius: "16px",
					padding: "28px 32px",
					color: "#fff",
					marginBottom: "24px",
					display: "flex",
					flexWrap: "wrap",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "20px",
					boxShadow: "0 10px 25px -5px rgba(230, 0, 35, 0.35)"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "16px"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							background: "#fff",
							color: "#e60023",
							width: "54px",
							height: "54px",
							borderRadius: "14px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
							flexShrink: 0
						},
						children: /* @__PURE__ */ jsx("svg", {
							width: "32",
							height: "32",
							viewBox: "0 0 24 24",
							fill: "currentColor",
							children: /* @__PURE__ */ jsx("path", { d: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.151-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" })
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
							children: "Pinterest Hub & Board Manager"
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
								background: "rgba(255,255,255,0.25)",
								color: "#fff",
								fontSize: "11px",
								fontWeight: 800,
								padding: "3px 8px",
								borderRadius: "12px"
							},
							children: "NOT CONNECTED"
						})]
					}), /* @__PURE__ */ jsx("p", {
						style: {
							margin: "4px 0 0 0",
							opacity: .9,
							fontSize: "14px"
						},
						children: "Manage Pinterest boards, auto-draft SEO pin titles & descriptions, and publish visual pins via API v5."
					})] })]
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						gap: "12px",
						alignItems: "center",
						flexWrap: "wrap"
					},
					children: account ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
						onClick: () => router.post("/admin/pinterest/sync-boards"),
						style: {
							background: "rgba(255,255,255,0.2)",
							border: "1px solid rgba(255,255,255,0.4)",
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
						children: "Re-Sync Boards"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => {
							if (confirm("Are you sure you want to disconnect Pinterest?")) router.post("/admin/pinterest/disconnect");
						},
						style: {
							background: "rgba(0, 0, 0, 0.3)",
							border: "1px solid rgba(255, 255, 255, 0.3)",
							color: "#fff",
							padding: "9px 16px",
							borderRadius: "10px",
							fontWeight: 700,
							fontSize: "13px",
							cursor: "pointer"
						},
						children: "Disconnect"
					})] }) : authUrl ? /* @__PURE__ */ jsx("a", {
						href: authUrl,
						style: {
							background: "#fff",
							color: "#e60023",
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
						label: "Boards Manager",
						icon: /* @__PURE__ */ jsx(FolderPlus, { size: 16 }),
						badge: boards.length
					},
					{
						id: "settings",
						label: "App & API Settings",
						icon: /* @__PURE__ */ jsx(Settings, { size: 16 })
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
							color: isActive ? "#e60023" : "#64748b",
							borderBottom: isActive ? "3px solid #e60023" : "3px solid transparent",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "-2px",
							transition: "all 0.15s ease"
						},
						children: [/* @__PURE__ */ jsxs("span", {
							style: {
								display: "inline-flex",
								alignItems: "center",
								gap: "6px"
							},
							children: [tab.icon, /* @__PURE__ */ jsx("span", { children: tab.label })]
						}), tab.badge > 0 && /* @__PURE__ */ jsx("span", {
							style: {
								background: "#e60023",
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
					children: "Pending Approval Pins"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						margin: "2px 0 0 0",
						fontSize: "13px",
						color: "#64748b"
					},
					children: "Auto-drafted from published blog posts. Review title, SEO description, choose board, and approve."
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
						children: "No Pending Pins Waiting"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							fontSize: "13px",
							margin: 0,
							maxWidth: "440px",
							marginInline: "auto"
						},
						children: "When you publish a new blog post, a visual Pin draft will appear here for one-click approval."
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "20px"
				},
				children: pendingApprovals.map((share) => {
					const currentTitle = editTitles[share.id] !== void 0 ? editTitles[share.id] : share.title;
					const currentDescription = editDescriptions[share.id] !== void 0 ? editDescriptions[share.id] : share.description || "";
					const currentBoardId = selectedBoards[share.id] || share.pinterest_board_id || defaultBoard?.id;
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
										color: "#e60023",
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
									children: share.post?.title || share.title
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
									gridTemplateColumns: "1fr 220px",
									gap: "20px"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "12px"
									},
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											style: {
												display: "block",
												fontSize: "12px",
												fontWeight: 700,
												color: "#334155",
												marginBottom: "4px"
											},
											children: "Target Pinterest Board:"
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
												background: "#fff"
											},
											children: [/* @__PURE__ */ jsx("option", {
												value: "",
												children: "Select a Board..."
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
												marginBottom: "4px"
											},
											children: [/* @__PURE__ */ jsx("label", {
												style: {
													fontSize: "12px",
													fontWeight: 700,
													color: "#334155"
												},
												children: "Pin Title:"
											}), /* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: "11px",
													color: currentTitle.length > 100 ? "#ef4444" : "#64748b"
												},
												children: [currentTitle.length, " / 100"]
											})]
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: currentTitle,
											maxLength: 100,
											onChange: (e) => setEditTitles({
												...editTitles,
												[share.id]: e.target.value
											}),
											style: {
												width: "100%",
												padding: "9px 12px",
												borderRadius: "8px",
												border: "1px solid #cbd5e1",
												fontSize: "13px",
												boxSizing: "border-box"
											}
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												marginBottom: "4px"
											},
											children: [/* @__PURE__ */ jsx("label", {
												style: {
													fontSize: "12px",
													fontWeight: 700,
													color: "#334155"
												},
												children: "Pin Description & Keywords:"
											}), /* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: "11px",
													color: currentDescription.length > 500 ? "#ef4444" : "#64748b"
												},
												children: [currentDescription.length, " / 500"]
											})]
										}), /* @__PURE__ */ jsx("textarea", {
											rows: 4,
											value: currentDescription,
											maxLength: 500,
											onChange: (e) => setEditDescriptions({
												...editDescriptions,
												[share.id]: e.target.value
											}),
											style: {
												width: "100%",
												padding: "10px 12px",
												borderRadius: "8px",
												border: "1px solid #cbd5e1",
												fontSize: "13px",
												lineHeight: 1.5,
												boxSizing: "border-box"
											}
										})] })
									]
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: {
										display: "block",
										fontSize: "12px",
										fontWeight: 700,
										color: "#334155",
										marginBottom: "4px"
									},
									children: "Pin Graphic Preview:"
								}), /* @__PURE__ */ jsx("img", {
									src: share.image_url,
									alt: "Pin Preview",
									style: {
										width: "100%",
										height: "240px",
										objectFit: "cover",
										borderRadius: "12px",
										border: "1px solid #e2e8f0",
										boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
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
									children: ["Target Link: ", /* @__PURE__ */ jsx("strong", { children: share.target_link })]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									disabled: approvingId === share.id,
									onClick: () => handleApprove(share),
									style: {
										background: "#e60023",
										color: "#fff",
										border: "none",
										padding: "10px 22px",
										borderRadius: "8px",
										fontWeight: 700,
										fontSize: "13px",
										cursor: "pointer"
									},
									children: approvingId === share.id ? "Pinning to Board..." : "Approve & Pin to Pinterest"
								})]
							}),
							publishFeedback[share.id]?.pin_url && /* @__PURE__ */ jsxs("div", {
								style: {
									background: "#ecfdf5",
									border: "1px solid #a7f3d0",
									color: "#065f46",
									padding: "10px 14px",
									borderRadius: "8px",
									fontSize: "13px"
								},
								children: [
									"Pin created!",
									" ",
									/* @__PURE__ */ jsx("a", {
										href: publishFeedback[share.id].pin_url,
										target: "_blank",
										rel: "noreferrer",
										style: {
											fontWeight: 700,
											color: "#047857"
										},
										children: "View on Pinterest →"
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
					maxWidth: "720px"
				},
				children: [
					/* @__PURE__ */ jsxs("h2", {
						style: {
							fontSize: "18px",
							fontWeight: 800,
							color: "#0f172a",
							margin: "0 0 4px 0"
						},
						children: [/* @__PURE__ */ jsx(PenSquare, {
							size: 16,
							style: { marginRight: "6px" }
						}), " Direct Pin Composer"]
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							margin: "0 0 20px 0",
							fontSize: "13px",
							color: "#64748b"
						},
						children: "Create and publish a visual Pin directly from your device to any Pinterest board."
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleCustomPinSubmit,
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "16px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
								style: {
									display: "block",
									fontSize: "13px",
									fontWeight: 700,
									color: "#334155",
									marginBottom: "6px"
								},
								children: ["Target Board ", /* @__PURE__ */ jsx("span", {
									style: { color: "#ef4444" },
									children: "*"
								})]
							}), /* @__PURE__ */ jsxs("select", {
								required: true,
								value: customBoardId,
								onChange: (e) => setCustomBoardId(e.target.value),
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "14px",
									background: "#fff"
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
									marginBottom: "6px"
								},
								children: [/* @__PURE__ */ jsxs("label", {
									style: {
										fontSize: "13px",
										fontWeight: 700,
										color: "#334155"
									},
									children: ["Pin Title ", /* @__PURE__ */ jsx("span", {
										style: { color: "#ef4444" },
										children: "*"
									})]
								}), /* @__PURE__ */ jsxs("span", {
									style: {
										fontSize: "12px",
										color: "#64748b"
									},
									children: [customTitle.length, " / 100"]
								})]
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								maxLength: 100,
								placeholder: "e.g. Best IIT JEE Coaching in Sikar 2027",
								value: customTitle,
								onChange: (e) => setCustomTitle(e.target.value),
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "14px",
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
								children: [/* @__PURE__ */ jsxs("label", {
									style: {
										fontSize: "13px",
										fontWeight: 700,
										color: "#334155"
									},
									children: ["Pin Photo ", /* @__PURE__ */ jsx("span", {
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
											children: "Pin image uploaded to /uploads/social/"
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
									borderRadius: "12px",
									padding: "24px 16px",
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
									children: "⏳ Uploading and optimizing photo to /uploads/social/..."
								}) : /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											justifyContent: "center",
											marginBottom: "6px"
										},
										children: /* @__PURE__ */ jsx(Pin, {
											size: 28,
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
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "14px",
									boxSizing: "border-box"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "6px"
								},
								children: [/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "13px",
										fontWeight: 700,
										color: "#334155"
									},
									children: "Pin Description & Search Keywords"
								}), /* @__PURE__ */ jsxs("span", {
									style: {
										fontSize: "12px",
										color: "#64748b"
									},
									children: [customDescription.length, " / 500"]
								})]
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 4,
								maxLength: 500,
								placeholder: "Explain what this pin is about, add helpful tips and high-traffic hashtags like #Sikar #JEECoaching...",
								value: customDescription,
								onChange: (e) => setCustomDescription(e.target.value),
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "14px",
									outline: "none",
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
								children: "Destination Website Link (Where users land when clicking the pin)"
							}), /* @__PURE__ */ jsx("input", {
								type: "url",
								placeholder: "https://coachingsinsikar.com/blog/jee-mains-guide",
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
								disabled: isPublishingCustom || !customTitle.trim() || !customImage.trim() || !customBoardId,
								style: {
									background: "#e60023",
									color: "#fff",
									border: "none",
									padding: "12px 24px",
									borderRadius: "10px",
									fontWeight: 700,
									fontSize: "14px",
									cursor: "pointer",
									alignSelf: "flex-start"
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
						maxWidth: "700px"
					},
					children: [/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "16px",
							fontWeight: 800,
							color: "#0f172a",
							margin: "0 0 12px 0"
						},
						children: "Create New Pinterest Board"
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleCreateBoardSubmit,
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "12px"
						},
						children: [
							/* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								placeholder: "Board Name (e.g. Sikar Coaching Reviews 2027)",
								value: newBoardName,
								onChange: (e) => setNewBoardName(e.target.value),
								style: {
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px"
								}
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "Board Description (Optional)",
								value: newBoardDescription,
								onChange: (e) => setNewBoardDescription(e.target.value),
								style: {
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px"
								}
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: isCreatingBoard || !newBoardName.trim(),
								style: {
									background: "#0f172a",
									color: "#fff",
									border: "none",
									padding: "10px 18px",
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
						marginBottom: "14px"
					},
					children: [
						"Connected Pinterest Boards (",
						boards.length,
						")"
					]
				}), boards.length === 0 ? /* @__PURE__ */ jsx("div", {
					style: {
						background: "#fff",
						padding: "32px",
						borderRadius: "12px",
						textAlign: "center",
						color: "#64748b",
						border: "1px solid #e2e8f0"
					},
					children: "No boards found. Click \"Re-Sync Boards\" or create your first board above."
				}) : /* @__PURE__ */ jsx("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
						gap: "16px"
					},
					children: boards.map((b) => /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							padding: "20px",
							borderRadius: "14px",
							border: b.is_default ? "2px solid #e60023" : "1px solid #e2e8f0",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between"
						},
						children: [/* @__PURE__ */ jsxs("div", { children: [
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
										color: b.privacy === "PUBLIC" ? "#059669" : "#d97706",
										textTransform: "uppercase"
									},
									children: [b.privacy, " BOARD"]
								}), b.is_default && /* @__PURE__ */ jsx("span", {
									style: {
										background: "#fef2f2",
										color: "#e60023",
										fontSize: "11px",
										fontWeight: 800,
										padding: "2px 8px",
										borderRadius: "10px"
									},
									children: "DEFAULT BOARD"
								})]
							}),
							/* @__PURE__ */ jsx("h4", {
								style: {
									margin: "0 0 4px 0",
									fontSize: "16px",
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
							children: "Direct Access Token Connection"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								margin: "0 0 20px 0",
								fontSize: "13px",
								color: "#64748b"
							},
							children: "If you generated a Pinterest User Token from developers.pinterest.com, paste it here to authenticate immediately."
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleManualTokenSubmit,
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "14px"
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
								style: {
									display: "block",
									fontSize: "12px",
									fontWeight: 700,
									color: "#475569",
									marginBottom: "4px"
								},
								children: ["Pinterest Access Token ", /* @__PURE__ */ jsx("span", {
									style: { color: "#ef4444" },
									children: "*"
								})]
							}), /* @__PURE__ */ jsx("input", {
								type: "password",
								required: true,
								placeholder: "pina_...",
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
							})] }), /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: isSavingManual || !manualToken.trim(),
								style: {
									background: "#e60023",
									color: "#fff",
									border: "none",
									padding: "11px 22px",
									borderRadius: "8px",
									fontWeight: 700,
									fontSize: "13px",
									cursor: "pointer",
									alignSelf: "flex-start"
								},
								children: isSavingManual ? "Verifying..." : "Save & Connect Access Token "
							})]
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
									fontSize: "12px",
									fontWeight: 700,
									color: "#475569",
									marginBottom: "4px"
								},
								children: "Pinterest App ID (PINTEREST_APP_ID)"
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
								children: "Pinterest App Secret"
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
								children: hasClientSecret ? " Configured & Encrypted" : "Missing in .env"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "12px",
									fontWeight: 700,
									color: "#475569",
									marginBottom: "4px"
								},
								children: "OAuth 2.0 Redirect URI (Paste in Pinterest Developer Portal App Settings)"
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
										background: "#e60023",
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
export { PinterestHubPage as default };
