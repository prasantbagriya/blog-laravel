import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
//#region resources/js/Pages/Admin/Media/Index.jsx
var AdminLayout = React.lazy(() => import("./AdminLayout-xqBz233I.js"));
function MediaLibraryPage() {
	const BASE = typeof window !== "undefined" && window.location.pathname.startsWith("/list/public") ? "/list/public" : "";
	const [media, setMedia] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [isReplacing, setIsReplacing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState("grid");
	const fetchMedia = () => {
		setLoading(true);
		axios.get((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/media").then((res) => {
			if (Array.isArray(res.data)) setMedia(res.data);
			setLoading(false);
		}).catch(() => setLoading(false));
	};
	useEffect(() => {
		fetchMedia();
	}, []);
	const formatSize = (bytes) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = [
			"B",
			"KB",
			"MB",
			"GB"
		];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};
	const handleReplace = async (e, oldFilename) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsReplacing(true);
		const formData = new FormData();
		formData.append("oldFilename", oldFilename);
		formData.append("file", file);
		try {
			await axios.post((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/media", formData);
			alert("Image replaced successfully! All articles have been updated.");
			setSelectedMedia(null);
			fetchMedia();
		} catch (err) {
			const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to replace image.";
			alert(errorMsg);
		} finally {
			setIsReplacing(false);
		}
	};
	const handleDelete = async (filename) => {
		const item = media.find((m) => m.name === filename);
		if (item && item.usedIn && item.usedIn.length > 0) {
			if (!confirm(`WARNING: This image is used in ${item.usedIn.length} places. Deleting it will break those images. Are you absolutely sure?`)) return;
		} else if (!confirm("Are you sure you want to delete this image?")) return;
		try {
			await axios.delete((window.location.pathname.startsWith("/list/public") ? "/list/public" : "") + `/api/admin/media?filename=${filename}`);
			setSelectedMedia(null);
			fetchMedia();
		} catch (e) {
			alert("Error deleting file");
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", { children: "Loading Media Library..." });
	const filteredMedia = media.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
	return /* @__PURE__ */ jsxs("div", {
		style: { animation: "fadeIn 0.4s ease-out" },
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Media Library | Admin" }),
			/* @__PURE__ */ jsxs("div", {
				style: {
					marginBottom: "2rem",
					display: "flex",
					flexWrap: "wrap",
					gap: "1rem",
					justifyContent: "space-between",
					alignItems: "flex-end"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					style: {
						fontSize: "2rem",
						fontWeight: 900,
						color: "#0f172a",
						margin: 0
					},
					children: "Media Library"
				}), /* @__PURE__ */ jsx("p", {
					style: {
						color: "#64748b",
						margin: 0
					},
					children: "Manage uploaded images and see where they are used"
				})] }), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						gap: "1rem",
						alignItems: "center"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "8px",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ jsxs("label", {
							style: {
								background: "#2563eb",
								color: "#fff",
								padding: "8px 16px",
								borderRadius: "8px",
								fontWeight: 600,
								cursor: "pointer",
								margin: 0
							},
							children: ["Upload Image", /* @__PURE__ */ jsx("input", {
								type: "file",
								style: { display: "none" },
								accept: "image/*",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									const formData = new FormData();
									formData.append("file", file);
									try {
										await axios.post((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/media", formData);
										fetchMedia();
									} catch (e) {
										alert(e.response?.data?.message || "Upload error");
									}
								}
							})]
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Search images...",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							style: {
								padding: "8px 16px",
								borderRadius: "8px",
								border: "1px solid #e2e8f0",
								outline: "none",
								width: "250px"
							}
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							background: "#f1f5f9",
							padding: "4px",
							borderRadius: "8px"
						},
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setViewMode("grid"),
							style: {
								background: viewMode === "grid" ? "#fff" : "transparent",
								color: viewMode === "grid" ? "#2563eb" : "#64748b",
								border: "none",
								padding: "6px 12px",
								borderRadius: "6px",
								fontWeight: 600,
								cursor: "pointer",
								boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
							},
							children: "Grid"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setViewMode("list"),
							style: {
								background: viewMode === "list" ? "#fff" : "transparent",
								color: viewMode === "list" ? "#2563eb" : "#64748b",
								border: "none",
								padding: "6px 12px",
								borderRadius: "6px",
								fontWeight: 600,
								cursor: "pointer",
								boxShadow: viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
							},
							children: "List"
						})]
					})]
				})]
			}),
			filteredMedia.length === 0 ? /* @__PURE__ */ jsx("div", {
				style: {
					textAlign: "center",
					padding: "3rem",
					background: "#f8fafc",
					borderRadius: "16px",
					color: "#64748b"
				},
				children: "No media files found."
			}) : viewMode === "grid" ? /* @__PURE__ */ jsx("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
					gap: "1rem"
				},
				children: filteredMedia.map((item) => /* @__PURE__ */ jsxs("div", {
					onClick: () => setSelectedMedia(item),
					style: {
						background: "#fff",
						border: selectedMedia?.id === item.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
						borderRadius: "12px",
						overflow: "hidden",
						cursor: "pointer",
						position: "relative",
						boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
						transition: "transform 0.2s ease, border-color 0.2s ease"
					},
					onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-4px)",
					onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							width: "100%",
							paddingBottom: "100%",
							position: "relative",
							background: "#f1f5f9"
						},
						children: /* @__PURE__ */ jsx("img", {
							loading: "lazy",
							decoding: "async",
							fetchPriority: "low",
							src: item.url,
							alt: item.name,
							style: {
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								height: "100%",
								objectFit: "cover"
							}
						})
					}), /* @__PURE__ */ jsxs("div", {
						style: { padding: "12px" },
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "12px",
								fontWeight: 700,
								color: "#0f172a",
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis"
							},
							children: item.name
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								fontSize: "11px",
								color: "#64748b",
								marginTop: "4px",
								display: "flex",
								justifyContent: "space-between"
							},
							children: [/* @__PURE__ */ jsx("span", { children: formatSize(item.sizeBytes) }), item.usedIn && item.usedIn.length > 0 && /* @__PURE__ */ jsxs("span", {
								style: {
									background: "#dbeafe",
									color: "#1e40af",
									padding: "2px 6px",
									borderRadius: "4px",
									fontWeight: 700
								},
								children: ["Used: ", item.usedIn.length]
							})]
						})]
					})]
				}, item.id || item.name))
			}) : /* @__PURE__ */ jsx("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "8px"
				},
				children: filteredMedia.map((item) => /* @__PURE__ */ jsxs("div", {
					onClick: () => setSelectedMedia(item),
					style: {
						display: "flex",
						alignItems: "center",
						gap: "16px",
						background: "#fff",
						border: selectedMedia?.id === item.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
						borderRadius: "12px",
						padding: "12px",
						cursor: "pointer",
						transition: "transform 0.1s ease"
					},
					onMouseEnter: (e) => e.currentTarget.style.transform = "translateX(4px)",
					onMouseLeave: (e) => e.currentTarget.style.transform = "translateX(0)",
					children: [
						/* @__PURE__ */ jsx("img", {
							loading: "lazy",
							decoding: "async",
							fetchPriority: "low",
							src: item.url,
							alt: item.name,
							style: {
								width: "60px",
								height: "60px",
								objectFit: "cover",
								borderRadius: "8px",
								background: "#f1f5f9"
							}
						}),
						/* @__PURE__ */ jsxs("div", {
							style: { flex: 1 },
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontWeight: 700,
									color: "#0f172a"
								},
								children: item.name
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "12px",
									color: "#64748b",
									marginTop: "4px"
								},
								children: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								width: "100px",
								fontSize: "13px",
								color: "#475569",
								fontWeight: 600
							},
							children: formatSize(item.sizeBytes)
						}),
						/* @__PURE__ */ jsx("div", {
							style: {
								width: "100px",
								textAlign: "right"
							},
							children: item.usedIn && item.usedIn.length > 0 ? /* @__PURE__ */ jsxs("span", {
								style: {
									background: "#dbeafe",
									color: "#1e40af",
									padding: "4px 8px",
									borderRadius: "6px",
									fontSize: "12px",
									fontWeight: 700
								},
								children: [item.usedIn.length, " Uses"]
							}) : /* @__PURE__ */ jsx("span", {
								style: {
									color: "#94a3b8",
									fontSize: "12px"
								},
								children: "Unused"
							})
						})
					]
				}, item.id || item.name))
			}),
			selectedMedia && /* @__PURE__ */ jsx("div", {
				style: {
					position: "fixed",
					inset: 0,
					background: "rgba(15, 23, 42, 0.7)",
					backdropFilter: "blur(4px)",
					zIndex: 1e3,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "1rem"
				},
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						background: "#fff",
						width: "100%",
						maxWidth: "800px",
						maxHeight: "90vh",
						borderRadius: "16px",
						overflow: "hidden",
						display: "flex",
						flexDirection: "column",
						animation: "fadeIn 0.2s ease"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							padding: "16px 24px",
							borderBottom: "1px solid #e2e8f0",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							background: "#f8fafc"
						},
						children: [/* @__PURE__ */ jsx("h2", {
							style: {
								margin: 0,
								fontSize: "18px",
								fontWeight: 800
							},
							children: "Media Details"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setSelectedMedia(null),
							style: {
								background: "none",
								border: "none",
								fontSize: "24px",
								cursor: "pointer",
								color: "#64748b"
							},
							children: "×"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexWrap: "wrap",
							flex: 1,
							overflowY: "auto"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								flex: "1 1 300px",
								background: "#f1f5f9",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								minHeight: "300px",
								borderRight: "1px solid #e2e8f0"
							},
							children: /* @__PURE__ */ jsx("img", {
								loading: "lazy",
								decoding: "async",
								fetchPriority: "low",
								src: selectedMedia.url,
								style: {
									maxWidth: "100%",
									maxHeight: "400px",
									objectFit: "contain"
								},
								alt: "Preview"
							})
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								flex: "1 1 300px",
								padding: "24px",
								display: "flex",
								flexDirection: "column",
								gap: "1.5rem"
							},
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("h3", {
										style: {
											margin: "0 0 8px 0",
											fontSize: "14px",
											color: "#64748b",
											textTransform: "uppercase"
										},
										children: "File Info"
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											fontWeight: 600,
											fontSize: "14px",
											wordBreak: "break-all"
										},
										children: selectedMedia.name
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "13px",
											color: "#475569",
											marginTop: "4px"
										},
										children: ["Size: ", formatSize(selectedMedia.sizeBytes)]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "13px",
											color: "#475569",
											marginTop: "4px"
										},
										children: ["Date: ", selectedMedia.createdAt ? new Date(selectedMedia.createdAt).toLocaleDateString() : ""]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											fontSize: "13px",
											color: "#475569",
											marginTop: "4px"
										},
										children: ["URL: ", /* @__PURE__ */ jsx("a", {
											href: selectedMedia.url,
											target: "_blank",
											rel: "noreferrer",
											style: { color: "#2563eb" },
											children: selectedMedia.url
										})]
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									style: {
										margin: "0 0 12px 0",
										fontSize: "14px",
										color: "#64748b",
										textTransform: "uppercase"
									},
									children: "Where is this used?"
								}), !selectedMedia.usedIn || selectedMedia.usedIn.length === 0 ? /* @__PURE__ */ jsx("div", {
									style: {
										padding: "12px",
										background: "#f1f5f9",
										borderRadius: "8px",
										fontSize: "13px",
										color: "#475569"
									},
									children: "This image is not currently used in any Posts, Stories, or Author Profiles. Safe to delete."
								}) : /* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "8px",
										maxHeight: "200px",
										overflowY: "auto"
									},
									children: selectedMedia.usedIn.map((usage, i) => /* @__PURE__ */ jsxs("div", {
										style: {
											border: "1px solid #e2e8f0",
											borderRadius: "8px",
											padding: "12px",
											background: "#fff"
										},
										children: [
											/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "11px",
													fontWeight: 800,
													color: "#2563eb",
													textTransform: "uppercase",
													marginBottom: "4px"
												},
												children: usage.type
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "14px",
													fontWeight: 600,
													color: "#0f172a",
													marginBottom: "8px",
													whiteSpace: "nowrap",
													overflow: "hidden",
													textOverflow: "ellipsis"
												},
												children: usage.title
											}),
											/* @__PURE__ */ jsxs(Link, {
												href: BASE + usage.editUrl,
												style: {
													fontSize: "13px",
													color: "#2563eb",
													textDecoration: "none",
													fontWeight: 600
												},
												children: [
													"Edit ",
													usage.type,
													" →"
												]
											})
										]
									}, i))
								})] }),
								/* @__PURE__ */ jsxs("div", {
									style: {
										marginTop: "auto",
										paddingTop: "16px",
										borderTop: "1px solid #e2e8f0",
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										flexWrap: "wrap",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsxs("div", {
										style: { position: "relative" },
										children: [/* @__PURE__ */ jsx("input", {
											type: "file",
											accept: "image/*",
											onChange: (e) => handleReplace(e, selectedMedia.name),
											style: {
												position: "absolute",
												inset: 0,
												opacity: 0,
												cursor: "pointer"
											},
											disabled: isReplacing
										}), /* @__PURE__ */ jsx("button", {
											style: {
												background: "#2563eb",
												color: "#fff",
												border: "none",
												padding: "10px 20px",
												borderRadius: "8px",
												fontWeight: 700,
												cursor: "pointer",
												opacity: isReplacing ? .7 : 1,
												whiteSpace: "nowrap"
											},
											disabled: isReplacing,
											children: isReplacing ? "Replacing..." : "Replace Image"
										})]
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => handleDelete(selectedMedia.name),
										style: {
											background: "#fef2f2",
											color: "#ef4444",
											border: "none",
											padding: "10px 20px",
											borderRadius: "8px",
											fontWeight: 700,
											cursor: "pointer",
											whiteSpace: "nowrap"
										},
										disabled: isReplacing,
										children: "Delete Permanently"
									})]
								})
							]
						})]
					})]
				})
			})
		]
	});
}
MediaLibraryPage.layout = (page) => /* @__PURE__ */ jsx(Suspense, {
	fallback: /* @__PURE__ */ jsx("div", {
		style: {
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		children: "Loading Admin Workspace..."
	}),
	children: /* @__PURE__ */ jsx(AdminLayout, { children: page })
});
//#endregion
export { MediaLibraryPage as default };
