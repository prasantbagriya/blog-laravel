import AdminLayout from "./AdminLayout-DgYc6ixZ.js";
import { t as MediaPicker } from "./MediaPicker-DRyBj2N5.js";
import { Head } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Pages/Admin/Pages/Index.jsx
function ConfirmModal({ title, message, onConfirm, onCancel }) {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 999,
			background: "rgba(15,23,42,0.5)",
			backdropFilter: "blur(4px)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "16px"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				background: "#fff",
				borderRadius: "16px",
				padding: "32px",
				maxWidth: "420px",
				width: "100%",
				boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
				animation: "fadeInScale 0.2s ease"
			},
			children: [
				/* @__PURE__ */ jsx("div", {
					style: {
						width: "48px",
						height: "48px",
						borderRadius: "12px",
						background: "#fee2e2",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: "16px",
						fontSize: "22px"
					},
					children: "🗑️"
				}),
				/* @__PURE__ */ jsx("h3", {
					style: {
						fontSize: "18px",
						fontWeight: 800,
						color: "#0f172a",
						marginBottom: "8px"
					},
					children: title
				}),
				/* @__PURE__ */ jsx("p", {
					style: {
						fontSize: "14px",
						color: "#64748b",
						marginBottom: "24px",
						lineHeight: 1.6
					},
					children: message
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						gap: "12px"
					},
					children: [/* @__PURE__ */ jsx("button", {
						onClick: onCancel,
						style: {
							flex: 1,
							padding: "11px",
							border: "1px solid #e2e8f0",
							borderRadius: "8px",
							background: "#f8fafc",
							color: "#475569",
							fontWeight: 600,
							fontSize: "14px",
							cursor: "pointer"
						},
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						onClick: onConfirm,
						style: {
							flex: 1,
							padding: "11px",
							border: "none",
							borderRadius: "8px",
							background: "#ef4444",
							color: "#fff",
							fontWeight: 700,
							fontSize: "14px",
							cursor: "pointer"
						},
						children: "Yes, Delete"
					})]
				})
			]
		}), /* @__PURE__ */ jsx("style", { children: `@keyframes fadeInScale { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }` })]
	});
}
var inputStyle = {
	width: "100%",
	padding: "10px 12px",
	border: "1px solid #e2e8f0",
	borderRadius: "8px",
	fontSize: "14px",
	color: "#0f172a",
	background: "#fff",
	boxSizing: "border-box"
};
var labelStyle = {
	display: "block",
	fontSize: "12px",
	fontWeight: 700,
	color: "#64748b",
	marginBottom: "6px",
	textTransform: "uppercase",
	letterSpacing: "0.5px"
};
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
		style: labelStyle,
		children: label
	}), children] });
}
function PagesIndex() {
	const BASE = typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "";
	const [pages, setPages] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tableError, setTableError] = useState(false);
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [type, setType] = useState("feed");
	const [categoryId, setCategoryId] = useState("");
	const [content, setContent] = useState("");
	const [schemaType, setSchemaType] = useState("Article");
	const [seoTitle, setSeoTitle] = useState("");
	const [seoDescription, setSeoDescription] = useState("");
	const [seoKeywords, setSeoKeywords] = useState("");
	const [ogTitle, setOgTitle] = useState("");
	const [ogDescription, setOgDescription] = useState("");
	const [ogImage, setOgImage] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [faqs, setFaqs] = useState([]);
	useEffect(() => {
		fetchPages();
		fetchCategories();
	}, []);
	const fetchPages = async () => {
		try {
			const res = await fetch(BASE + "/api/admin/pages");
			const data = await res.json();
			if (!res.ok || data?.error === "pages_table_missing") setTableError(true);
			else if (Array.isArray(data)) {
				setPages(data);
				setTableError(false);
			}
		} catch {
			setTableError(true);
		} finally {
			setLoading(false);
		}
	};
	const fetchCategories = async () => {
		try {
			const data = await (await fetch(BASE + "/api/admin/categories")).json();
			if (Array.isArray(data)) setCategories(data);
		} catch {}
	};
	const resetForm = () => {
		setEditingId(null);
		setTitle("");
		setSlug("");
		setType("feed");
		setCategoryId("");
		setContent("");
		setSchemaType("Article");
		setSeoTitle("");
		setSeoDescription("");
		setSeoKeywords("");
		setOgTitle("");
		setOgDescription("");
		setOgImage("");
		setFaqs([]);
		setIsFormVisible(false);
	};
	const handleEdit = (page) => {
		setEditingId(page.id);
		setTitle(page.title);
		setSlug(page.slug);
		setType(page.type || "feed");
		setCategoryId(page.category_id || "");
		setContent(page.content || "");
		setSchemaType(page.schema_type || "Article");
		setSeoTitle(page.seo_title || "");
		setSeoDescription(page.seo_description || "");
		setSeoKeywords(page.seo_keywords || "");
		setOgTitle(page.og_title || "");
		setOgDescription(page.og_description || "");
		setOgImage(page.og_image || "");
		setFaqs(Array.isArray(page.faqs) ? page.faqs : []);
		setIsFormVisible(true);
	};
	const handleSave = async (e) => {
		e.preventDefault();
		if (!title.trim() || !slug.trim()) return;
		setSaving(true);
		try {
			const res = await fetch(BASE + "/api/admin/pages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": document.querySelector("meta[name=\"csrf-token\"]")?.content || ""
				},
				body: JSON.stringify({
					id: editingId || void 0,
					title,
					slug: slug.toLowerCase().replace(/[^a-z0-9\-]+/g, "-").replace(/(^-|-$)+/g, ""),
					type,
					category_id: categoryId || null,
					content,
					schema_type: schemaType,
					seo_title: seoTitle,
					seo_description: seoDescription,
					seo_keywords: seoKeywords,
					og_title: ogTitle,
					og_description: ogDescription,
					og_image: ogImage,
					faqs: faqs.filter((f) => f.question?.trim() || f.answer?.trim())
				})
			});
			if (res.ok) {
				resetForm();
				fetchPages();
			} else {
				const err = await res.json();
				alert(err.message || "Save failed");
			}
		} catch {
			alert("Connection error");
		} finally {
			setSaving(false);
		}
	};
	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		setIsDeleting(true);
		try {
			if ((await fetch(`${BASE}/api/admin/pages?id=${deleteTarget.id}`, {
				method: "DELETE",
				headers: { "Accept": "application/json" }
			})).ok) {
				setDeleteTarget(null);
				fetchPages();
			} else alert("Delete failed");
		} catch {
			alert("Connection error");
		} finally {
			setIsDeleting(false);
		}
	};
	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setIsUploading(true);
		const fd = new FormData();
		fd.append("file", file);
		try {
			const data = await (await fetch(BASE + "/api/admin/upload-category", {
				method: "POST",
				body: fd
			})).json();
			if (data.success) setOgImage(data.url);
			else alert("Upload failed");
		} catch {
			alert("Upload error");
		}
		setIsUploading(false);
	};
	if (loading) return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			minHeight: "300px",
			gap: "12px",
			color: "#64748b"
		},
		children: [
			/* @__PURE__ */ jsx("div", { style: {
				width: "24px",
				height: "24px",
				border: "3px solid #e2e8f0",
				borderTopColor: "#2563eb",
				borderRadius: "50%",
				animation: "spin 0.8s linear infinite"
			} }),
			"Loading Pages...",
			/* @__PURE__ */ jsx("style", { children: `@keyframes spin{to{transform:rotate(360deg)}}` })
		]
	});
	if (tableError) return /* @__PURE__ */ jsxs("div", {
		style: {
			padding: "60px 24px",
			textAlign: "center"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				style: {
					fontSize: "52px",
					marginBottom: "16px"
				},
				children: "⚠️"
			}),
			/* @__PURE__ */ jsx("h2", {
				style: {
					color: "#0f172a",
					fontWeight: 800,
					marginBottom: "8px"
				},
				children: "Database Not Ready"
			}),
			/* @__PURE__ */ jsxs("p", {
				style: {
					color: "#64748b",
					marginBottom: "28px"
				},
				children: [
					"The ",
					/* @__PURE__ */ jsx("code", {
						style: {
							background: "#f1f5f9",
							padding: "2px 6px",
							borderRadius: "4px"
						},
						children: "pages"
					}),
					" table doesn't exist yet. Please run migrations."
				]
			})
		]
	});
	if (!isFormVisible) return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(Head, { title: "Dynamic Pages | Admin" }),
		deleteTarget && /* @__PURE__ */ jsx(ConfirmModal, {
			title: "Delete Page?",
			message: `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone and will remove the public page.`,
			onConfirm: handleDeleteConfirm,
			onCancel: () => setDeleteTarget(null)
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "flex-start",
				marginBottom: "28px",
				gap: "16px",
				flexWrap: "wrap"
			},
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				style: {
					fontSize: "24px",
					fontWeight: 800,
					color: "#0f172a",
					margin: "0 0 4px 0"
				},
				children: "Dynamic Pages"
			}), /* @__PURE__ */ jsxs("p", {
				style: {
					color: "#64748b",
					margin: 0,
					fontSize: "14px"
				},
				children: [
					"Create and manage public pages like ",
					/* @__PURE__ */ jsx("code", {
						style: {
							background: "#f1f5f9",
							padding: "2px 6px",
							borderRadius: "4px"
						},
						children: "/blog"
					}),
					" or ",
					/* @__PURE__ */ jsx("code", {
						style: {
							background: "#f1f5f9",
							padding: "2px 6px",
							borderRadius: "4px"
						},
						children: "/news"
					}),
					" with custom SEO & FAQs."
				]
			})] }), /* @__PURE__ */ jsx("button", {
				onClick: () => {
					resetForm();
					setIsFormVisible(true);
				},
				style: {
					display: "flex",
					alignItems: "center",
					gap: "8px",
					background: "#2563eb",
					color: "#fff",
					border: "none",
					padding: "10px 20px",
					borderRadius: "8px",
					fontWeight: 700,
					fontSize: "14px",
					cursor: "pointer",
					boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)",
					whiteSpace: "nowrap"
				},
				children: "+ Create New Page"
			})]
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
				background: "#fff",
				border: "1px solid #e2e8f0",
				borderRadius: "12px",
				overflow: "hidden",
				boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
			},
			children: /* @__PURE__ */ jsx("div", {
				style: { overflowX: "auto" },
				children: /* @__PURE__ */ jsxs("table", {
					style: {
						width: "100%",
						minWidth: "580px",
						borderCollapse: "collapse"
					},
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", {
						style: {
							background: "#f8fafc",
							borderBottom: "1px solid #e2e8f0"
						},
						children: [
							"Page Title",
							"URL Slug",
							"Type",
							"FAQs",
							"Actions"
						].map((h) => /* @__PURE__ */ jsx("th", {
							style: {
								padding: "14px 20px",
								fontSize: "11px",
								fontWeight: 700,
								color: "#64748b",
								textTransform: "uppercase",
								letterSpacing: "0.6px",
								textAlign: h === "Actions" ? "right" : "left"
							},
							children: h
						}, h))
					}) }), /* @__PURE__ */ jsx("tbody", { children: pages.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", {
						colSpan: 5,
						style: {
							padding: "48px",
							textAlign: "center",
							color: "#94a3b8"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								marginBottom: "12px",
								color: "#94a3b8"
							},
							children: /* @__PURE__ */ jsxs("svg", {
								width: "36",
								height: "36",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: [
									/* @__PURE__ */ jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
									/* @__PURE__ */ jsx("polyline", { points: "14 2 14 8 20 8" }),
									/* @__PURE__ */ jsx("line", {
										x1: "16",
										y1: "13",
										x2: "8",
										y2: "13"
									}),
									/* @__PURE__ */ jsx("line", {
										x1: "16",
										y1: "17",
										x2: "8",
										y2: "17"
									}),
									/* @__PURE__ */ jsx("polyline", { points: "10 9 9 9 8 9" })
								]
							})
						}), "No pages created yet. Click \"Create New Page\" to get started."]
					}) }) : pages.map((page) => /* @__PURE__ */ jsxs("tr", {
						style: {
							borderBottom: "1px solid #f1f5f9",
							transition: "background 0.15s"
						},
						onMouseEnter: (e) => e.currentTarget.style.background = "#f8fafc",
						onMouseLeave: (e) => e.currentTarget.style.background = "",
						children: [
							/* @__PURE__ */ jsxs("td", {
								style: { padding: "16px 20px" },
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontWeight: 700,
										color: "#0f172a",
										fontSize: "14px"
									},
									children: page.title
								}), page.seo_title && /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "12px",
										color: "#94a3b8",
										marginTop: "2px"
									},
									children: page.seo_title
								})]
							}),
							/* @__PURE__ */ jsx("td", {
								style: { padding: "16px 20px" },
								children: /* @__PURE__ */ jsxs("a", {
									href: `/${page.slug}`,
									target: "_blank",
									rel: "noreferrer",
									style: {
										display: "inline-flex",
										alignItems: "center",
										gap: "4px",
										background: "#eff6ff",
										color: "#2563eb",
										padding: "4px 10px",
										borderRadius: "6px",
										fontSize: "13px",
										fontWeight: 600,
										textDecoration: "none"
									},
									children: [
										"/",
										page.slug,
										" ↗"
									]
								})
							}),
							/* @__PURE__ */ jsx("td", {
								style: { padding: "16px 20px" },
								children: /* @__PURE__ */ jsx("span", {
									style: {
										display: "inline-block",
										padding: "4px 10px",
										borderRadius: "6px",
										fontSize: "12px",
										fontWeight: 700,
										background: page.type === "feed" ? "#ecfdf5" : "#f0f9ff",
										color: page.type === "feed" ? "#059669" : "#0284c7"
									},
									children: /* @__PURE__ */ jsx("span", {
										style: {
											display: "inline-flex",
											alignItems: "center",
											gap: "4px"
										},
										children: page.type === "feed" ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("svg", {
											width: "12",
											height: "12",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: [
												/* @__PURE__ */ jsx("path", { d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" }),
												/* @__PURE__ */ jsx("path", { d: "M18 14h-8" }),
												/* @__PURE__ */ jsx("path", { d: "M15 18h-5" }),
												/* @__PURE__ */ jsx("path", { d: "M10 6h8v4h-8V6Z" })
											]
										}), " Post Feed"] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("svg", {
											width: "12",
											height: "12",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: [
												/* @__PURE__ */ jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
												/* @__PURE__ */ jsx("polyline", { points: "14 2 14 8 20 8" }),
												/* @__PURE__ */ jsx("line", {
													x1: "16",
													y1: "13",
													x2: "8",
													y2: "13"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "16",
													y1: "17",
													x2: "8",
													y2: "17"
												}),
												/* @__PURE__ */ jsx("polyline", { points: "10 9 9 9 8 9" })
											]
										}), " Static"] })
									})
								})
							}),
							/* @__PURE__ */ jsx("td", {
								style: {
									padding: "16px 20px",
									fontSize: "13px",
									color: "#64748b"
								},
								children: Array.isArray(page.faqs) && page.faqs.length > 0 ? /* @__PURE__ */ jsxs("span", {
									style: {
										background: "#fef9c3",
										color: "#854d0e",
										padding: "3px 8px",
										borderRadius: "4px",
										fontSize: "12px",
										fontWeight: 600
									},
									children: [
										page.faqs.length,
										" FAQ",
										page.faqs.length > 1 ? "s" : ""
									]
								}) : /* @__PURE__ */ jsx("span", {
									style: { color: "#cbd5e1" },
									children: "—"
								})
							}),
							/* @__PURE__ */ jsx("td", {
								style: {
									padding: "16px 20px",
									textAlign: "right"
								},
								children: /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "8px",
										justifyContent: "flex-end"
									},
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => handleEdit(page),
										style: {
											padding: "6px 14px",
											background: "#eff6ff",
											color: "#2563eb",
											border: "1px solid #bfdbfe",
											borderRadius: "6px",
											fontSize: "13px",
											fontWeight: 700,
											cursor: "pointer"
										},
										children: "Edit"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => setDeleteTarget({
											id: page.id,
											title: page.title
										}),
										disabled: isDeleting,
										style: {
											padding: "6px 14px",
											background: "#fef2f2",
											color: "#dc2626",
											border: "1px solid #fecaca",
											borderRadius: "6px",
											fontSize: "13px",
											fontWeight: 700,
											cursor: "pointer"
										},
										children: "Delete"
									})]
								})
							})
						]
					}, page.id)) })]
				})
			})
		})
	] });
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(Head, { title: editingId ? "Edit Page | Admin" : "Create Page | Admin" }),
		/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: "12px",
				marginBottom: "24px"
			},
			children: [/* @__PURE__ */ jsx("button", {
				onClick: resetForm,
				style: {
					display: "flex",
					alignItems: "center",
					gap: "6px",
					background: "#f1f5f9",
					border: "1px solid #e2e8f0",
					color: "#475569",
					padding: "8px 14px",
					borderRadius: "8px",
					fontWeight: 600,
					fontSize: "13px",
					cursor: "pointer"
				},
				children: "← Back"
			}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", {
				style: {
					fontSize: "20px",
					fontWeight: 800,
					color: "#0f172a",
					margin: 0
				},
				children: editingId ? "Edit Page & SEO" : "Create New Page"
			}) })]
		}),
		/* @__PURE__ */ jsx("form", {
			onSubmit: handleSave,
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "1fr 340px",
					gap: "20px",
					alignItems: "start"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: "20px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								border: "1px solid #e2e8f0",
								borderRadius: "12px",
								padding: "24px",
								boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
							},
							children: [
								/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "14px",
										fontWeight: 700,
										color: "#0f172a",
										marginBottom: "16px",
										marginTop: 0
									},
									children: "Page Information"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "16px"
									},
									children: [/* @__PURE__ */ jsx(Field, {
										label: "Page Title *",
										children: /* @__PURE__ */ jsx("input", {
											style: inputStyle,
											type: "text",
											value: title,
											onChange: (e) => setTitle(e.target.value),
											required: true,
											placeholder: "e.g. News Feed"
										})
									}), /* @__PURE__ */ jsxs(Field, {
										label: "URL Slug *",
										children: [/* @__PURE__ */ jsx("input", {
											style: inputStyle,
											type: "text",
											value: slug,
											onChange: (e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]+/g, "-")),
											required: true,
											placeholder: "e.g. news"
										}), /* @__PURE__ */ jsxs("div", {
											style: {
												fontSize: "11px",
												color: "#94a3b8",
												marginTop: "4px"
											},
											children: ["Public URL: /", slug || "your-slug"]
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "16px",
										marginTop: "16px"
									},
									children: [/* @__PURE__ */ jsx(Field, {
										label: "Page Type",
										children: /* @__PURE__ */ jsxs("select", {
											style: inputStyle,
											value: type,
											onChange: (e) => setType(e.target.value),
											children: [/* @__PURE__ */ jsx("option", {
												value: "feed",
												children: "Post Feed (Shows articles)"
											}), /* @__PURE__ */ jsx("option", {
												value: "static",
												children: "Static Page (Custom content)"
											})]
										})
									}), type === "feed" && /* @__PURE__ */ jsx(Field, {
										label: "Schema Type",
										children: /* @__PURE__ */ jsxs("select", {
											style: inputStyle,
											value: schemaType,
											onChange: (e) => setSchemaType(e.target.value),
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "Article",
													children: "Article (Standard Blog)"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "NewsArticle",
													children: "NewsArticle (News/Updates)"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "BlogPosting",
													children: "BlogPosting (Personal Blog)"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "EducationalArticle",
													children: "EducationalArticle (Study Material)"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "Report",
													children: "Report (Results/Reports)"
												})
											]
										})
									})]
								}),
								type === "static" && /* @__PURE__ */ jsx("div", {
									style: { marginTop: "16px" },
									children: /* @__PURE__ */ jsx(Field, {
										label: "Page Content",
										children: /* @__PURE__ */ jsx("textarea", {
											style: {
												...inputStyle,
												resize: "vertical"
											},
											value: content,
											onChange: (e) => setContent(e.target.value),
											rows: 6,
											placeholder: "Write your page content here..."
										})
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								border: "1px solid #e2e8f0",
								borderRadius: "12px",
								padding: "24px",
								boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
							},
							children: [
								/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "14px",
										fontWeight: 700,
										color: "#0f172a",
										marginBottom: "4px",
										marginTop: 0
									},
									children: "SEO & Social Meta"
								}),
								/* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "13px",
										color: "#64748b",
										marginBottom: "20px"
									},
									children: "Optimise this page for Google and social sharing."
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "16px",
										marginBottom: "16px"
									},
									children: [/* @__PURE__ */ jsx(Field, {
										label: "Meta Title",
										children: /* @__PURE__ */ jsx("input", {
											style: inputStyle,
											type: "text",
											value: seoTitle,
											onChange: (e) => setSeoTitle(e.target.value),
											placeholder: "Title for Google Search"
										})
									}), /* @__PURE__ */ jsx(Field, {
										label: "OG Title (Facebook / X)",
										children: /* @__PURE__ */ jsx("input", {
											style: inputStyle,
											type: "text",
											value: ogTitle,
											onChange: (e) => setOgTitle(e.target.value),
											placeholder: "Title for Social Sharing"
										})
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "16px",
										marginBottom: "16px"
									},
									children: [/* @__PURE__ */ jsx(Field, {
										label: "Meta Description",
										children: /* @__PURE__ */ jsx("textarea", {
											style: {
												...inputStyle,
												resize: "vertical"
											},
											value: seoDescription,
											onChange: (e) => setSeoDescription(e.target.value),
											rows: 3,
											placeholder: "Description for Google Search"
										})
									}), /* @__PURE__ */ jsx(Field, {
										label: "OG Description",
										children: /* @__PURE__ */ jsx("textarea", {
											style: {
												...inputStyle,
												resize: "vertical"
											},
											value: ogDescription,
											onChange: (e) => setOgDescription(e.target.value),
											rows: 3,
											placeholder: "Description for Social Sharing"
										})
									})]
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Meta Keywords",
									children: /* @__PURE__ */ jsx("input", {
										style: inputStyle,
										type: "text",
										value: seoKeywords,
										onChange: (e) => setSeoKeywords(e.target.value),
										placeholder: "news, blog, updates, sikar"
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									style: { marginTop: "20px" },
									children: [
										/* @__PURE__ */ jsx("label", {
											style: labelStyle,
											children: "Open Graph Cover Image"
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: "10px",
												flexWrap: "wrap"
											},
											children: [/* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => setMediaPickerTarget("ogImage"),
												style: {
													display: "flex",
													alignItems: "center",
													gap: "6px",
													padding: "8px 16px",
													background: "#f8fafc",
													border: "1px solid #e2e8f0",
													borderRadius: "6px",
													fontWeight: 600,
													fontSize: "13px",
													color: "#475569",
													cursor: "pointer"
												},
												children: [/* @__PURE__ */ jsxs("svg", {
													width: "16",
													height: "16",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: "2",
													strokeLinecap: "round",
													strokeLinejoin: "round",
													children: [
														/* @__PURE__ */ jsx("rect", {
															x: "3",
															y: "3",
															width: "18",
															height: "18",
															rx: "2",
															ry: "2"
														}),
														/* @__PURE__ */ jsx("circle", {
															cx: "8.5",
															cy: "8.5",
															r: "1.5"
														}),
														/* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
													]
												}), "Media Library"]
											}), /* @__PURE__ */ jsxs("label", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "6px",
													padding: "8px 16px",
													background: "#2563eb",
													color: "#fff",
													border: "none",
													borderRadius: "6px",
													fontWeight: 600,
													fontSize: "13px",
													cursor: "pointer"
												},
												children: [isUploading ? "Uploading..." : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("svg", {
													width: "16",
													height: "16",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: "2",
													strokeLinecap: "round",
													strokeLinejoin: "round",
													children: [
														/* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
														/* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
														/* @__PURE__ */ jsx("line", {
															x1: "12",
															y1: "3",
															x2: "12",
															y2: "15"
														})
													]
												}), "Upload Image"] }), /* @__PURE__ */ jsx("input", {
													type: "file",
													accept: "image/*",
													onChange: handleFileUpload,
													style: { display: "none" }
												})]
											})]
										}),
										ogImage && /* @__PURE__ */ jsxs("div", {
											style: {
												position: "relative",
												display: "inline-block",
												marginTop: "12px"
											},
											children: [/* @__PURE__ */ jsx("img", {
												src: ogImage,
												alt: "OG",
												style: {
													height: "100px",
													borderRadius: "8px",
													objectFit: "cover",
													border: "2px solid #e2e8f0"
												}
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setOgImage(""),
												style: {
													position: "absolute",
													top: "-8px",
													right: "-8px",
													background: "#ef4444",
													color: "#fff",
													borderRadius: "50%",
													width: "22px",
													height: "22px",
													border: "none",
													cursor: "pointer",
													fontWeight: "bold",
													fontSize: "12px"
												},
												children: "×"
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								background: "#fff",
								border: "1px solid #e2e8f0",
								borderRadius: "12px",
								padding: "24px",
								boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										marginBottom: "4px"
									},
									children: [/* @__PURE__ */ jsx("h3", {
										style: {
											fontSize: "14px",
											fontWeight: 700,
											color: "#0f172a",
											margin: 0
										},
										children: "FAQ Section"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setFaqs([...faqs, {
											question: "",
											answer: ""
										}]),
										style: {
											background: "#eff6ff",
											color: "#2563eb",
											border: "1px solid #bfdbfe",
											padding: "7px 14px",
											borderRadius: "6px",
											fontWeight: 700,
											fontSize: "13px",
											cursor: "pointer"
										},
										children: "+ Add FAQ"
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "13px",
										color: "#64748b",
										marginBottom: "16px"
									},
									children: "FAQs appear on the public page and generate FAQPage rich results in Google."
								}),
								faqs.length === 0 ? /* @__PURE__ */ jsx("div", {
									style: {
										textAlign: "center",
										padding: "24px",
										color: "#94a3b8",
										border: "1px dashed #e2e8f0",
										borderRadius: "8px",
										fontSize: "13px"
									},
									children: "No FAQs yet — click \"+ Add FAQ\" to start."
								}) : faqs.map((faq, idx) => /* @__PURE__ */ jsxs("div", {
									style: {
										padding: "16px",
										border: "1px solid #e2e8f0",
										borderRadius: "8px",
										marginBottom: "12px",
										background: "#f8fafc"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												marginBottom: "10px"
											},
											children: [/* @__PURE__ */ jsxs("span", {
												style: {
													fontSize: "12px",
													fontWeight: 700,
													color: "#475569"
												},
												children: ["FAQ #", idx + 1]
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setFaqs(faqs.filter((_, i) => i !== idx)),
												style: {
													background: "#fee2e2",
													color: "#dc2626",
													border: "none",
													padding: "3px 10px",
													borderRadius: "4px",
													fontSize: "12px",
													fontWeight: 700,
													cursor: "pointer"
												},
												children: "Remove"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: { marginBottom: "8px" },
											children: [/* @__PURE__ */ jsx("label", {
												style: labelStyle,
												children: "Question"
											}), /* @__PURE__ */ jsx("input", {
												style: inputStyle,
												type: "text",
												value: faq.question,
												onChange: (e) => {
													const u = [...faqs];
													u[idx] = {
														...u[idx],
														question: e.target.value
													};
													setFaqs(u);
												},
												placeholder: "e.g. What is the best coaching in Sikar?"
											})]
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											style: labelStyle,
											children: "Answer"
										}), /* @__PURE__ */ jsx("textarea", {
											style: {
												...inputStyle,
												resize: "vertical"
											},
											rows: 3,
											value: faq.answer,
											onChange: (e) => {
												const u = [...faqs];
												u[idx] = {
													...u[idx],
													answer: e.target.value
												};
												setFaqs(u);
											},
											placeholder: "Write the answer here..."
										})] })
									]
								}, idx))
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						position: "sticky",
						top: "88px",
						display: "flex",
						flexDirection: "column",
						gap: "16px"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							border: "1px solid #e2e8f0",
							borderRadius: "12px",
							padding: "20px",
							boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
						},
						children: [
							/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "14px",
									fontWeight: 700,
									color: "#0f172a",
									marginBottom: "16px",
									marginTop: 0
								},
								children: "Publish"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: saving,
								style: {
									width: "100%",
									background: saving ? "#93c5fd" : "#2563eb",
									color: "#fff",
									border: "none",
									padding: "12px",
									borderRadius: "8px",
									fontWeight: 700,
									fontSize: "15px",
									cursor: saving ? "not-allowed" : "pointer",
									marginBottom: "10px",
									boxShadow: "0 4px 6px -1px rgba(37,99,235,0.2)"
								},
								children: saving ? "Saving..." : editingId ? "✓ Save Changes" : "🚀 Publish Page"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: resetForm,
								style: {
									width: "100%",
									background: "#f8fafc",
									color: "#475569",
									border: "1px solid #e2e8f0",
									padding: "11px",
									borderRadius: "8px",
									fontWeight: 600,
									fontSize: "14px",
									cursor: "pointer"
								},
								children: "Cancel"
							})
						]
					}), editingId && /* @__PURE__ */ jsxs("div", {
						style: {
							background: "#fff",
							border: "1px solid #e2e8f0",
							borderRadius: "12px",
							padding: "20px",
							boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
						},
						children: [/* @__PURE__ */ jsx("h3", {
							style: {
								fontSize: "14px",
								fontWeight: 700,
								color: "#0f172a",
								marginBottom: "8px",
								marginTop: 0
							},
							children: "Quick Info"
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								fontSize: "13px",
								color: "#64748b"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: "6px" },
									children: ["Slug: ", /* @__PURE__ */ jsxs("strong", {
										style: { color: "#0f172a" },
										children: ["/", slug]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: "6px" },
									children: ["Type: ", /* @__PURE__ */ jsx("strong", {
										style: { color: "#0f172a" },
										children: type === "feed" ? "Post Feed" : "Static"
									})]
								}),
								/* @__PURE__ */ jsxs("div", { children: ["FAQs: ", /* @__PURE__ */ jsx("strong", {
									style: { color: "#0f172a" },
									children: faqs.length
								})] })
							]
						})]
					})]
				})]
			})
		}),
		mediaPickerTarget && /* @__PURE__ */ jsx(MediaPicker, {
			onSelect: (url) => {
				setOgImage(url);
				setMediaPickerTarget(null);
			},
			onClose: () => setMediaPickerTarget(null)
		})
	] });
}
PagesIndex.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { PagesIndex as default };
