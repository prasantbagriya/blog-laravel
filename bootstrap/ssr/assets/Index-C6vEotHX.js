import AdminLayout from "./AdminLayout-B4V0SEL8.js";
import { Head, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { FileText, MessageSquare, ThumbsUp } from "lucide-react";
//#region resources/js/Pages/Admin/Facebook/Index.jsx
function FacebookHubPage({ needsMigration = false, isConfigured, clientId, hasClientSecret, redirectUri, account, pages = [], defaultPage, pendingApprovals = [], recentShares = [], recentFeed = [], insights = {
	impressions: 0,
	engagements: 0,
	views: 0
}, authUrl, errorMessage = null }) {
	const [activeTab, setActiveTab] = useState("pages");
	const [approvingId, setApprovingId] = useState(null);
	const [editCaptions, setEditCaptions] = useState({});
	const [selectedPages, setSelectedPages] = useState({});
	const [customPageId, setCustomPageId] = useState(defaultPage?.id || pages[0]?.id || "");
	const [customCaption, setCustomCaption] = useState("");
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
	const handleCopyUri = () => {
		navigator.clipboard.writeText(redirectUri);
		setCopiedUri(true);
		setTimeout(() => setCopiedUri(false), 2e3);
	};
	const handleApprove = async (share) => {
		setApprovingId(share.id);
		const targetPageId = selectedPages[share.id] || share.facebook_page_id || defaultPage?.id;
		const finalCaption = editCaptions[share.id] !== void 0 ? editCaptions[share.id] : share.caption;
		try {
			const data = await (await fetch("/api/admin/facebook/approve-publish", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content") || ""
				},
				body: JSON.stringify({
					share_id: share.id,
					post_id: share.post_id,
					facebook_page_id: targetPageId,
					caption: finalCaption,
					image_url: share.image_url,
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
					"recentFeed"
				] });
			} else alert(data.message || "Publishing failed");
		} catch (e) {
			alert("Network or server error: " + e.message);
		} finally {
			setApprovingId(null);
		}
	};
	const handleCustomPostSubmit = (e) => {
		e.preventDefault();
		if (!customCaption.trim()) return;
		setIsPublishingCustom(true);
		router.post("/admin/facebook/custom-post", {
			facebook_page_id: customPageId,
			caption: customCaption,
			image_url: customImage,
			link: customLink
		}, { onFinish: () => {
			setIsPublishingCustom(false);
			setCustomCaption("");
			setCustomImage("");
			setCustomLink("");
		} });
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		style: {
			animation: "fadeIn 0.3s ease-out",
			paddingBottom: "40px"
		},
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Facebook Hub & Page Manager | Admin" }),
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
					children: "Facebook Database Tables Setup Required"
				}), /* @__PURE__ */ jsx("span", {
					style: { fontSize: "13px" },
					children: "Facebook integration tables are not created yet in the database. Run the system database upgrade once to activate all features."
				})] }), /* @__PURE__ */ jsx("a", {
					href: "/app-upgrade",
					style: {
						background: "#2563eb",
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
			/* @__PURE__ */ jsxs("div", {
				style: {
					background: "linear-gradient(135deg, #1877f2, #0d5cb6)",
					borderRadius: "16px",
					padding: "28px 32px",
					color: "#fff",
					marginBottom: "24px",
					display: "flex",
					flexWrap: "wrap",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "20px",
					boxShadow: "0 10px 25px -5px rgba(24, 119, 242, 0.3)"
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
							color: "#1877f2",
							width: "54px",
							height: "54px",
							borderRadius: "14px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
							flexShrink: 0
						},
						children: /* @__PURE__ */ jsx("svg", {
							width: "32",
							height: "32",
							viewBox: "0 0 24 24",
							fill: "currentColor",
							children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" })
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
							children: "Facebook Hub & Page Manager"
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
						children: "Manage Facebook Pages, auto-draft blog captions, and approve instant photo publishing via Meta Graph API."
					})] })]
				}), /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						gap: "12px",
						alignItems: "center",
						flexWrap: "wrap"
					},
					children: account ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
						onClick: () => router.post("/admin/facebook/sync-pages"),
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
						children: "Re-Sync Pages"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => {
							if (confirm("Are you sure you want to disconnect Facebook? This will remove synced pages.")) router.post("/admin/facebook/disconnect");
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
					})] }) : authUrl ? /* @__PURE__ */ jsx("a", {
						href: authUrl,
						style: {
							background: "#fff",
							color: "#1877f2",
							padding: "11px 22px",
							borderRadius: "10px",
							fontWeight: 800,
							fontSize: "14px",
							textDecoration: "none",
							boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
							display: "inline-flex",
							alignItems: "center",
							gap: "8px"
						},
						children: "Connect Facebook Account →"
					}) : /* @__PURE__ */ jsx("button", {
						onClick: () => setActiveTab("settings"),
						style: {
							background: "#fff",
							color: "#1877f2",
							padding: "11px 22px",
							borderRadius: "10px",
							fontWeight: 800,
							fontSize: "14px",
							border: "none",
							cursor: "pointer"
						},
						children: "Setup App Credentials"
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					gap: "8px",
					borderBottom: "1px solid #e2e8f0",
					marginBottom: "24px",
					overflowX: "auto",
					paddingBottom: "4px"
				},
				children: [
					{
						key: "pages",
						label: `Connected Pages (${pages.length})`
					},
					{
						key: "approvals",
						label: `Pending Approvals (${pendingApprovals.length})`
					},
					{
						key: "feed",
						label: "Live Page Feed & Insights"
					},
					{
						key: "custom",
						label: "Quick Direct Post"
					},
					{
						key: "settings",
						label: "Meta App Setup"
					}
				].map((tab) => /* @__PURE__ */ jsx("button", {
					onClick: () => setActiveTab(tab.key),
					style: {
						padding: "10px 18px",
						fontWeight: activeTab === tab.key ? 800 : 600,
						fontSize: "14px",
						color: activeTab === tab.key ? "#1877f2" : "#64748b",
						background: activeTab === tab.key ? "#eff6ff" : "transparent",
						border: "none",
						borderBottom: activeTab === tab.key ? "3px solid #1877f2" : "3px solid transparent",
						borderRadius: "8px 8px 0 0",
						cursor: "pointer",
						whiteSpace: "nowrap",
						transition: "all 0.2s ease"
					},
					children: tab.label
				}, tab.key))
			}),
			activeTab === "pages" && /* @__PURE__ */ jsx("div", { children: pages.length === 0 ? /* @__PURE__ */ jsxs("div", {
				style: {
					background: "#fff",
					border: "1px dashed #cbd5e1",
					borderRadius: "16px",
					padding: "48px",
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							justifyContent: "center",
							marginBottom: "12px"
						},
						children: /* @__PURE__ */ jsx(FileText, {
							size: 40,
							color: "#1877f2"
						})
					}),
					/* @__PURE__ */ jsx("h3", {
						style: {
							margin: "0 0 6px 0",
							fontSize: "18px",
							color: "#0f172a"
						},
						children: "No Facebook Pages Connected Yet"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#64748b",
							maxWidth: "480px",
							margin: "0 auto 20px auto",
							fontSize: "14px"
						},
						children: "Connect your personal Facebook profile that manages your official Facebook Pages (e.g. Coachings in Sikar) to start auto-publishing."
					}),
					authUrl && /* @__PURE__ */ jsx("a", {
						href: authUrl,
						style: {
							background: "#1877f2",
							color: "#fff",
							padding: "11px 24px",
							borderRadius: "10px",
							fontWeight: 700,
							textDecoration: "none",
							display: "inline-block"
						},
						children: "Connect Facebook Account →"
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
					gap: "20px"
				},
				children: pages.map((page) => /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						border: page.is_default ? "2px solid #1877f2" : "1px solid #e2e8f0",
						borderRadius: "16px",
						padding: "20px",
						position: "relative",
						boxShadow: "0 4px 6px -1px rgba(0,0,0,0.04)",
						display: "flex",
						flexDirection: "column",
						gap: "16px"
					},
					children: [
						page.is_default && /* @__PURE__ */ jsx("span", {
							style: {
								position: "absolute",
								top: 16,
								right: 16,
								background: "#eff6ff",
								color: "#1877f2",
								border: "1px solid #bfdbfe",
								padding: "3px 8px",
								borderRadius: "6px",
								fontSize: "11px",
								fontWeight: 800
							},
							children: "Primary Default"
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "14px",
								alignItems: "center"
							},
							children: [/* @__PURE__ */ jsx("img", {
								src: page.picture_url || "https://graph.facebook.com/v20.0/" + page.page_id + "/picture?type=large",
								alt: page.name,
								style: {
									width: "56px",
									height: "56px",
									borderRadius: "12px",
									objectFit: "cover",
									border: "1px solid #e2e8f0",
									background: "#f8fafc"
								}
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									flex: 1,
									minWidth: 0
								},
								children: [
									/* @__PURE__ */ jsx("h3", {
										style: {
											margin: "0 0 2px 0",
											fontSize: "16px",
											fontWeight: 800,
											color: "#0f172a",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis"
										},
										children: page.name
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "12px",
											color: "#64748b"
										},
										children: page.category || "Education Page"
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "11px",
											color: "#94a3b8",
											marginTop: "2px"
										},
										children: ["ID: ", page.page_id]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "space-between",
								background: "#f8fafc",
								padding: "10px 14px",
								borderRadius: "10px",
								fontSize: "13px"
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								style: { color: "#64748b" },
								children: "Followers: "
							}), /* @__PURE__ */ jsx("strong", {
								style: { color: "#0f172a" },
								children: page.followers_count.toLocaleString()
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								style: { color: "#64748b" },
								children: "Page Likes: "
							}), /* @__PURE__ */ jsx("strong", {
								style: { color: "#0f172a" },
								children: page.fan_count.toLocaleString()
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								marginTop: "auto",
								display: "flex",
								gap: "8px",
								flexWrap: "wrap",
								paddingTop: "8px",
								borderTop: "1px solid #f1f5f9"
							},
							children: [!page.is_default && /* @__PURE__ */ jsx("button", {
								onClick: () => router.post(`/admin/facebook/default-page/${page.id}`),
								style: {
									flex: 1,
									background: "#eff6ff",
									color: "#1877f2",
									border: "none",
									padding: "8px 12px",
									borderRadius: "8px",
									fontWeight: 700,
									fontSize: "12px",
									cursor: "pointer"
								},
								children: "Set as Default"
							}), /* @__PURE__ */ jsx("a", {
								href: page.facebook_url,
								target: "_blank",
								rel: "noopener noreferrer",
								style: {
									padding: "8px 12px",
									background: "#f8fafc",
									border: "1px solid #e2e8f0",
									color: "#475569",
									borderRadius: "8px",
									fontWeight: 600,
									fontSize: "12px",
									textDecoration: "none"
								},
								children: "Visit Page ↗"
							})]
						})
					]
				}, page.id))
			}) }),
			activeTab === "approvals" && /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs("div", {
					style: { marginBottom: "16px" },
					children: [/* @__PURE__ */ jsx("h2", {
						style: {
							fontSize: "18px",
							fontWeight: 800,
							margin: "0 0 4px 0",
							color: "#0f172a"
						},
						children: "Blog Posts Pending Facebook Approval"
					}), /* @__PURE__ */ jsx("p", {
						style: {
							color: "#64748b",
							fontSize: "13px",
							margin: 0
						},
						children: "Review the cover image and generated caption before approving. Once approved, it will be published immediately to your Facebook Page."
					})]
				}),
				pendingApprovals.length === 0 ? /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						border: "1px solid #e2e8f0",
						borderRadius: "16px",
						padding: "40px",
						textAlign: "center",
						color: "#64748b"
					},
					children: [
						/* @__PURE__ */ jsx("div", { style: {
							fontSize: "32px",
							marginBottom: "8px"
						} }),
						/* @__PURE__ */ jsx("h3", {
							style: {
								margin: 0,
								fontSize: "16px",
								color: "#0f172a"
							},
							children: "All Caught Up!"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								margin: "4px 0 0 0",
								fontSize: "13px"
							},
							children: "There are no pending posts awaiting Facebook publication. New posts published from the blog editor will appear here automatically."
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "20px"
					},
					children: pendingApprovals.map((share) => {
						const currentCaption = editCaptions[share.id] !== void 0 ? editCaptions[share.id] : share.caption;
						const feedback = publishFeedback[share.id];
						return /* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								border: "1px solid #e2e8f0",
								borderRadius: "16px",
								overflow: "hidden",
								boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
								display: "grid",
								gridTemplateColumns: "minmax(300px, 1fr) minmax(320px, 1.2fr)",
								gap: "0"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									background: "#f0f2f5",
									padding: "20px",
									borderRight: "1px solid #e2e8f0"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "11px",
										fontWeight: 800,
										color: "#64748b",
										textTransform: "uppercase",
										marginBottom: "12px"
									},
									children: "Live Facebook Mockup Preview"
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										background: "#fff",
										borderRadius: "12px",
										boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
										overflow: "hidden"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												padding: "12px 14px",
												display: "flex",
												gap: "10px",
												alignItems: "center"
											},
											children: [/* @__PURE__ */ jsx("img", {
												src: defaultPage?.picture_url || "https://via.placeholder.com/40",
												alt: "Page",
												style: {
													width: "40px",
													height: "40px",
													borderRadius: "50%",
													objectFit: "cover"
												}
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												style: {
													fontWeight: 700,
													fontSize: "14px",
													color: "#050505"
												},
												children: defaultPage?.name || "CoachingsinSikar"
											}), /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "12px",
													color: "#65676b"
												},
												children: "Just now •  Public"
											})] })]
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												padding: "0 14px 12px 14px",
												fontSize: "13px",
												color: "#050505",
												lineHeight: 1.5,
												whiteSpace: "pre-wrap",
												maxHeight: "180px",
												overflowY: "auto"
											},
											children: currentCaption
										}),
										share.image_url && /* @__PURE__ */ jsx("div", {
											style: {
												background: "#000",
												maxHeight: "240px",
												overflow: "hidden"
											},
											children: /* @__PURE__ */ jsx("img", {
												src: share.image_url,
												alt: "Cover",
												style: {
													width: "100%",
													height: "auto",
													maxHeight: "240px",
													objectFit: "cover",
													display: "block"
												}
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												padding: "10px 14px",
												borderTop: "1px solid #e4e6eb",
												display: "flex",
												justifyContent: "space-around",
												color: "#65676b",
												fontSize: "12px",
												fontWeight: 600
											},
											children: [
												/* @__PURE__ */ jsxs("span", {
													style: {
														display: "flex",
														alignItems: "center",
														gap: "4px"
													},
													children: [/* @__PURE__ */ jsx(ThumbsUp, { size: 14 }), " Like"]
												}),
												/* @__PURE__ */ jsxs("span", {
													style: {
														display: "flex",
														alignItems: "center",
														gap: "4px"
													},
													children: [/* @__PURE__ */ jsx(MessageSquare, { size: 14 }), " Comment"]
												}),
												/* @__PURE__ */ jsx("span", { children: "↗ Share" })
											]
										})
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									padding: "24px",
									display: "flex",
									flexDirection: "column",
									gap: "14px"
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start"
										},
										children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											style: {
												background: "#fef3c7",
												color: "#92400e",
												fontSize: "11px",
												fontWeight: 800,
												padding: "3px 8px",
												borderRadius: "6px"
											},
											children: "Awaiting Admin Approval"
										}), /* @__PURE__ */ jsx("h3", {
											style: {
												margin: "8px 0 0 0",
												fontSize: "16px",
												fontWeight: 800,
												color: "#0f172a"
											},
											children: share.post?.title || "Blog Post Announcement"
										})] })
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										style: {
											display: "block",
											fontSize: "12px",
											fontWeight: 700,
											color: "#475569",
											marginBottom: "6px"
										},
										children: "Target Facebook Page:"
									}), /* @__PURE__ */ jsx("select", {
										value: selectedPages[share.id] || share.facebook_page_id || defaultPage?.id,
										onChange: (e) => setSelectedPages({
											...selectedPages,
											[share.id]: e.target.value
										}),
										style: {
											width: "100%",
											padding: "8px 12px",
											borderRadius: "8px",
											border: "1px solid #cbd5e1",
											fontSize: "13px",
											background: "#fff"
										},
										children: pages.map((p) => /* @__PURE__ */ jsxs("option", {
											value: p.id,
											children: [
												p.name,
												" (",
												p.followers_count,
												" followers)"
											]
										}, p.id))
									})] }),
									/* @__PURE__ */ jsxs("div", {
										style: { flex: 1 },
										children: [/* @__PURE__ */ jsx("label", {
											style: {
												display: "block",
												fontSize: "12px",
												fontWeight: 700,
												color: "#475569",
												marginBottom: "6px"
											},
											children: "Edit Caption / Hashtags:"
										}), /* @__PURE__ */ jsx("textarea", {
											rows: 6,
											value: currentCaption,
											onChange: (e) => setEditCaptions({
												...editCaptions,
												[share.id]: e.target.value
											}),
											style: {
												width: "100%",
												padding: "10px 12px",
												borderRadius: "8px",
												border: "1px solid #cbd5e1",
												fontSize: "13px",
												lineHeight: 1.5,
												resize: "vertical"
											}
										})]
									}),
									feedback?.success && /* @__PURE__ */ jsxs("div", {
										style: {
											padding: "10px 14px",
											background: "#ecfdf5",
											border: "1px solid #a7f3d0",
											borderRadius: "8px",
											color: "#065f46",
											fontSize: "13px",
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between"
										},
										children: [/* @__PURE__ */ jsx("span", { children: " Published to Facebook!" }), /* @__PURE__ */ jsx("a", {
											href: feedback.permalink,
											target: "_blank",
											rel: "noopener noreferrer",
											style: {
												color: "#047857",
												fontWeight: 700
											},
											children: "View Post on Facebook ↗"
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											gap: "10px",
											marginTop: "auto"
										},
										children: /* @__PURE__ */ jsx("button", {
											onClick: () => handleApprove(share),
											disabled: approvingId === share.id || feedback?.success,
											style: {
												flex: 1,
												background: feedback?.success ? "#10b981" : "#1877f2",
												color: "#fff",
												border: "none",
												padding: "11px 20px",
												borderRadius: "10px",
												fontWeight: 700,
												fontSize: "14px",
												cursor: "pointer",
												opacity: approvingId === share.id ? .7 : 1
											},
											children: approvingId === share.id ? "Publishing to Meta..." : feedback?.success ? " Published!" : "Approve & Publish to Facebook"
										})
									})
								]
							})]
						}, share.id);
					})
				}),
				recentShares.length > 0 && /* @__PURE__ */ jsxs("div", {
					style: { marginTop: "36px" },
					children: [/* @__PURE__ */ jsx("h3", {
						style: {
							fontSize: "16px",
							fontWeight: 800,
							margin: "0 0 12px 0"
						},
						children: "Recent Facebook Publishing Audit"
					}), /* @__PURE__ */ jsx("div", {
						style: {
							background: "#fff",
							borderRadius: "12px",
							border: "1px solid #e2e8f0",
							overflow: "hidden"
						},
						children: /* @__PURE__ */ jsxs("table", {
							style: {
								width: "100%",
								borderCollapse: "collapse",
								textAlign: "left",
								fontSize: "13px"
							},
							children: [/* @__PURE__ */ jsx("thead", {
								style: {
									background: "#f8fafc",
									borderBottom: "1px solid #e2e8f0"
								},
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										style: {
											padding: "12px 16px",
											color: "#64748b"
										},
										children: "Post Title"
									}),
									/* @__PURE__ */ jsx("th", {
										style: {
											padding: "12px 16px",
											color: "#64748b"
										},
										children: "Target Page"
									}),
									/* @__PURE__ */ jsx("th", {
										style: {
											padding: "12px 16px",
											color: "#64748b"
										},
										children: "Status"
									}),
									/* @__PURE__ */ jsx("th", {
										style: {
											padding: "12px 16px",
											color: "#64748b"
										},
										children: "Date"
									}),
									/* @__PURE__ */ jsx("th", {
										style: {
											padding: "12px 16px",
											color: "#64748b",
											textAlign: "right"
										},
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ jsx("tbody", { children: recentShares.map((s) => /* @__PURE__ */ jsxs("tr", {
								style: { borderBottom: "1px solid #f1f5f9" },
								children: [
									/* @__PURE__ */ jsx("td", {
										style: {
											padding: "12px 16px",
											fontWeight: 600,
											color: "#0f172a"
										},
										children: s.post?.title || s.caption?.slice(0, 40) + "..."
									}),
									/* @__PURE__ */ jsx("td", {
										style: {
											padding: "12px 16px",
											color: "#475569"
										},
										children: s.page?.name
									}),
									/* @__PURE__ */ jsx("td", {
										style: { padding: "12px 16px" },
										children: s.status === "published" ? /* @__PURE__ */ jsx("span", {
											style: {
												color: "#059669",
												fontWeight: 700
											},
											children: " Published"
										}) : /* @__PURE__ */ jsx("span", {
											style: {
												color: "#dc2626",
												fontWeight: 700
											},
											children: "Failed"
										})
									}),
									/* @__PURE__ */ jsx("td", {
										style: {
											padding: "12px 16px",
											color: "#64748b"
										},
										children: s.published_at ? new Date(s.published_at).toLocaleString() : "-"
									}),
									/* @__PURE__ */ jsx("td", {
										style: {
											padding: "12px 16px",
											textAlign: "right"
										},
										children: s.fb_permalink && /* @__PURE__ */ jsx("a", {
											href: s.fb_permalink,
											target: "_blank",
											rel: "noopener noreferrer",
											style: {
												color: "#1877f2",
												fontWeight: 600,
												textDecoration: "none"
											},
											children: "View on FB ↗"
										})
									})
								]
							}, s.id)) })]
						})
					})]
				})
			] }),
			activeTab === "feed" && /* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
						gap: "16px",
						marginBottom: "24px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								padding: "20px",
								borderRadius: "14px",
								border: "1px solid #e2e8f0"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									color: "#64748b",
									fontSize: "13px",
									fontWeight: 600
								},
								children: "28-Day Impressions"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "26px",
									fontWeight: 900,
									color: "#1877f2",
									marginTop: "4px"
								},
								children: insights.impressions.toLocaleString()
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								padding: "20px",
								borderRadius: "14px",
								border: "1px solid #e2e8f0"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									color: "#64748b",
									fontSize: "13px",
									fontWeight: 600
								},
								children: "28-Day Engagements"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "26px",
									fontWeight: 900,
									color: "#10b981",
									marginTop: "4px"
								},
								children: insights.engagements.toLocaleString()
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								padding: "20px",
								borderRadius: "14px",
								border: "1px solid #e2e8f0"
							},
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									color: "#64748b",
									fontSize: "13px",
									fontWeight: 600
								},
								children: "Page Views Total"
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "26px",
									fontWeight: 900,
									color: "#8b5cf6",
									marginTop: "4px"
								},
								children: insights.views.toLocaleString()
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("h3", {
					style: {
						fontSize: "18px",
						fontWeight: 800,
						margin: "0 0 16px 0",
						color: "#0f172a"
					},
					children: ["Recent Posts on ", defaultPage?.name || "Selected Page"]
				}),
				recentFeed.length === 0 ? /* @__PURE__ */ jsx("div", {
					style: {
						background: "#fff",
						padding: "32px",
						borderRadius: "14px",
						textAlign: "center",
						color: "#64748b",
						border: "1px solid #e2e8f0"
					},
					children: "No recent posts found on the page or feed is loading."
				}) : /* @__PURE__ */ jsx("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
						gap: "16px"
					},
					children: recentFeed.map((post) => /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							borderRadius: "14px",
							border: "1px solid #e2e8f0",
							overflow: "hidden",
							display: "flex",
							flexDirection: "column"
						},
						children: [post.image && /* @__PURE__ */ jsx("img", {
							src: post.image,
							alt: "",
							style: {
								width: "100%",
								height: "160px",
								objectFit: "cover"
							}
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								padding: "16px",
								flex: 1,
								display: "flex",
								flexDirection: "column",
								gap: "8px"
							},
							children: [
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "12px",
										color: "#64748b"
									},
									children: post.created_time ? new Date(post.created_time).toLocaleDateString() : ""
								}),
								/* @__PURE__ */ jsx("p", {
									style: {
										margin: 0,
										fontSize: "13px",
										color: "#0f172a",
										lineHeight: 1.4,
										display: "-webkit-box",
										WebkitLineClamp: 3,
										WebkitBoxOrient: "vertical",
										overflow: "hidden"
									},
									children: post.message || "(Photo Post)"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										marginTop: "auto",
										paddingTop: "10px",
										borderTop: "1px solid #f1f5f9",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										fontSize: "12px",
										color: "#64748b"
									},
									children: [/* @__PURE__ */ jsxs("span", {
										style: {
											display: "inline-flex",
											alignItems: "center",
											gap: "6px"
										},
										children: [
											/* @__PURE__ */ jsx(ThumbsUp, { size: 12 }),
											" ",
											post.reactions_count,
											" • ",
											/* @__PURE__ */ jsx(MessageSquare, { size: 12 }),
											" ",
											post.comments_count
										]
									}), /* @__PURE__ */ jsx("a", {
										href: post.permalink,
										target: "_blank",
										rel: "noopener noreferrer",
										style: {
											color: "#1877f2",
											fontWeight: 700,
											textDecoration: "none"
										},
										children: "View ↗"
									})]
								})
							]
						})]
					}, post.id))
				})
			] }),
			activeTab === "custom" && /* @__PURE__ */ jsxs("div", {
				style: {
					maxWidth: "640px",
					background: "#fff",
					borderRadius: "16px",
					padding: "28px",
					border: "1px solid #e2e8f0"
				},
				children: [
					/* @__PURE__ */ jsx("h2", {
						style: {
							fontSize: "18px",
							fontWeight: 800,
							margin: "0 0 6px 0",
							color: "#0f172a"
						},
						children: "Publish Direct Announcement to Facebook Page"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#64748b",
							fontSize: "13px",
							marginBottom: "20px"
						},
						children: "Post quick updates, photo announcements, or admissions alerts to your Facebook Page directly from here."
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleCustomPostSubmit,
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "16px"
						},
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "13px",
									fontWeight: 700,
									color: "#334155",
									marginBottom: "6px"
								},
								children: "Select Target Page *"
							}), /* @__PURE__ */ jsx("select", {
								value: customPageId,
								onChange: (e) => setCustomPageId(e.target.value),
								required: true,
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "14px",
									background: "#fff"
								},
								children: pages.map((p) => /* @__PURE__ */ jsxs("option", {
									value: p.id,
									children: [
										p.name,
										" (",
										p.followers_count,
										" followers)"
									]
								}, p.id))
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "13px",
									fontWeight: 700,
									color: "#334155",
									marginBottom: "6px"
								},
								children: "Post Caption / Announcement *"
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 5,
								required: true,
								value: customCaption,
								onChange: (e) => setCustomCaption(e.target.value),
								placeholder: "Write your announcement or post message with hashtags...",
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "14px",
									lineHeight: 1.5
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
									children: "Post Photo (Optional)"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowManualUrl(!showManualUrl),
									style: {
										background: "none",
										border: "none",
										color: "#1877f2",
										fontSize: "12px",
										fontWeight: 600,
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
											children: "Photo uploaded to /uploads/social/"
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
												background: "#eff6ff",
												color: "#1877f2",
												border: "1px solid #bfdbfe",
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
										color: "#1877f2"
									},
									children: "⏳ Uploading and optimizing photo to /uploads/social/..."
								}) : /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "28px",
											marginBottom: "6px"
										},
										children: "️"
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
									fontSize: "14px",
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
								children: "Action Link (Optional)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: customLink,
								onChange: (e) => setCustomLink(e.target.value),
								placeholder: "https://coachingsinsikar.com/...",
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "14px"
								}
							})] }),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: isPublishingCustom,
								style: {
									background: "#1877f2",
									color: "#fff",
									border: "none",
									padding: "12px 24px",
									borderRadius: "10px",
									fontWeight: 700,
									fontSize: "14px",
									cursor: "pointer",
									opacity: isPublishingCustom ? .7 : 1
								},
								children: isPublishingCustom ? "Publishing to Facebook..." : "Publish Post Now"
							})
						]
					})
				]
			}),
			activeTab === "settings" && /* @__PURE__ */ jsxs("div", {
				style: {
					maxWidth: "680px",
					background: "#fff",
					borderRadius: "16px",
					padding: "28px",
					border: "1px solid #e2e8f0"
				},
				children: [
					/* @__PURE__ */ jsx("h2", {
						style: {
							fontSize: "18px",
							fontWeight: 800,
							margin: "0 0 6px 0",
							color: "#0f172a"
						},
						children: "Meta Developer Credentials & Webhook Setup"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#64748b",
							fontSize: "13px",
							marginBottom: "24px"
						},
						children: "Configure your Meta App details from developers.facebook.com to enable Facebook Login and Page Publishing."
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "16px"
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
								children: "Facebook App ID (FACEBOOK_CLIENT_ID)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								readOnly: true,
								value: clientId || "(Not yet set in .env)",
								style: {
									width: "100%",
									padding: "10px 12px",
									borderRadius: "8px",
									border: "1px solid #cbd5e1",
									fontSize: "13px",
									background: "#f8fafc"
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
								children: "Facebook App Secret Status"
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
								children: "Valid OAuth Redirect URI (Paste this in Meta App Settings)"
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
										background: "#f8fafc"
									}
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleCopyUri,
									style: {
										background: "#1877f2",
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
							})] }),
							/* @__PURE__ */ jsxs("div", {
								style: {
									marginTop: "16px",
									padding: "16px",
									background: "#f8fafc",
									borderRadius: "12px",
									border: "1px solid #e2e8f0",
									fontSize: "13px",
									lineHeight: 1.6,
									color: "#475569"
								},
								children: [/* @__PURE__ */ jsx("strong", {
									style: { color: "#0f172a" },
									children: "Quick Steps to set up your Meta App:"
								}), /* @__PURE__ */ jsxs("ol", {
									style: {
										margin: "8px 0 0 0",
										paddingLeft: "20px"
									},
									children: [
										/* @__PURE__ */ jsxs("li", { children: [
											"Go to ",
											/* @__PURE__ */ jsx("a", {
												href: "https://developers.facebook.com",
												target: "_blank",
												rel: "noreferrer",
												style: { color: "#1877f2" },
												children: "developers.facebook.com"
											}),
											" and click ",
											/* @__PURE__ */ jsx("strong", { children: "Create App" }),
											"."
										] }),
										/* @__PURE__ */ jsxs("li", { children: [
											"Select ",
											/* @__PURE__ */ jsx("strong", { children: "Business" }),
											" as the app type."
										] }),
										/* @__PURE__ */ jsxs("li", { children: [
											"Add ",
											/* @__PURE__ */ jsx("strong", { children: "Facebook Login for Business" }),
											" and paste the Redirect URI above into ",
											/* @__PURE__ */ jsx("em", { children: "Valid OAuth Redirect URIs" }),
											"."
										] }),
										/* @__PURE__ */ jsxs("li", { children: [
											"Copy your ",
											/* @__PURE__ */ jsx("strong", { children: "App ID" }),
											" and ",
											/* @__PURE__ */ jsx("strong", { children: "App Secret" }),
											" into your server's ",
											/* @__PURE__ */ jsx("code", { children: ".env" }),
											" file under ",
											/* @__PURE__ */ jsx("code", { children: "FACEBOOK_CLIENT_ID" }),
											" and ",
											/* @__PURE__ */ jsx("code", { children: "FACEBOOK_CLIENT_SECRET" }),
											"."
										] })
									]
								})]
							})
						]
					})
				]
			})
		]
	}) });
}
//#endregion
export { FacebookHubPage as default };
