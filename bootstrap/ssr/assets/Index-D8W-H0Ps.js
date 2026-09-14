import AdminLayout from "./AdminLayout-BLiupKcK.js";
import DeleteButton from "./DeleteButton-4pbNZztV.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Pages/Admin/Categories/Index.jsx
function CategoriesPage() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");
	useEffect(() => {
		fetchCategories();
	}, []);
	const fetchCategories = async () => {
		try {
			const data = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/categories")).json();
			if (Array.isArray(data)) setCategories(data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};
	const resetForm = () => {
		setEditingId(null);
		setName("");
		setSlug("");
		setDescription("");
	};
	const handleEdit = (category) => {
		setEditingId(category.id);
		setName(category.name);
		setSlug(category.slug);
		setDescription(category.description || "");
	};
	const handleSave = async (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		try {
			if ((await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: editingId || void 0,
					name,
					slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
					description
				})
			})).ok) {
				resetForm();
				fetchCategories();
			}
		} catch (e) {
			console.error(e);
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			padding: "40px",
			color: "#64748b"
		},
		children: "Loading Categories..."
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(Head, { title: "Categories | Admin" }),
		/* @__PURE__ */ jsx("h1", {
			style: {
				fontSize: "28px",
				fontWeight: 800,
				color: "#0f172a",
				marginBottom: "8px"
			},
			children: "Category Management"
		}),
		/* @__PURE__ */ jsx("p", {
			style: {
				color: "#64748b",
				marginBottom: "32px"
			},
			children: "Create and manage categories for your blog posts."
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				display: "flex",
				flexDirection: isMobile ? "column-reverse" : "row",
				gap: "32px",
				alignItems: "start"
			},
			children: [/* @__PURE__ */ jsx("div", {
				style: {
					flex: 1,
					width: "100%",
					background: "#fff",
					border: "1px solid #e2e8f0",
					borderRadius: "12px",
					overflow: "hidden",
					boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
				},
				children: /* @__PURE__ */ jsx("div", {
					style: {
						overflowX: "auto",
						width: "100%"
					},
					children: /* @__PURE__ */ jsxs("table", {
						style: {
							width: "100%",
							minWidth: "400px",
							borderCollapse: "collapse",
							textAlign: "left"
						},
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							style: {
								background: "#f8fafc",
								borderBottom: "1px solid #e2e8f0"
							},
							children: [
								/* @__PURE__ */ jsx("th", {
									style: {
										padding: "16px 24px",
										fontSize: "12px",
										fontWeight: 600,
										color: "#64748b",
										textTransform: "uppercase"
									},
									children: "Name"
								}),
								/* @__PURE__ */ jsx("th", {
									style: {
										padding: "16px 24px",
										fontSize: "12px",
										fontWeight: 600,
										color: "#64748b",
										textTransform: "uppercase"
									},
									children: "Slug"
								}),
								/* @__PURE__ */ jsx("th", {
									style: {
										padding: "16px 24px",
										fontSize: "12px",
										fontWeight: 600,
										color: "#64748b",
										textTransform: "uppercase",
										textAlign: "right"
									},
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ jsxs("tbody", { children: [categories.map((cat) => /* @__PURE__ */ jsxs("tr", {
							style: { borderBottom: "1px solid #e2e8f0" },
							children: [
								/* @__PURE__ */ jsxs("td", {
									style: { padding: "16px 24px" },
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontWeight: 600,
											color: "#0f172a",
											fontSize: "15px"
										},
										children: cat.name
									}), cat.description && /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "13px",
											color: "#64748b",
											marginTop: "4px"
										},
										children: cat.description
									})]
								}),
								/* @__PURE__ */ jsxs("td", {
									style: {
										padding: "16px 24px",
										fontSize: "14px",
										color: "#475569"
									},
									children: ["/", cat.slug]
								}),
								/* @__PURE__ */ jsx("td", {
									style: {
										padding: "16px 24px",
										textAlign: "right"
									},
									children: /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "12px",
											justifyContent: "flex-end",
											alignItems: "center"
										},
										children: [/* @__PURE__ */ jsx("button", {
											onClick: () => handleEdit(cat),
											style: {
												background: "none",
												border: "none",
												color: "#2563eb",
												fontWeight: 600,
												cursor: "pointer",
												fontSize: "14px",
												whiteSpace: "nowrap"
											},
											children: "Edit"
										}), /* @__PURE__ */ jsx(DeleteButton, {
											endpoint: "/api/admin/categories",
											id: cat.id,
											onSuccess: fetchCategories,
											label: "Delete"
										})]
									})
								})
							]
						}, cat.id)), categories.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 3,
							style: {
								padding: "32px",
								textAlign: "center",
								color: "#64748b"
							},
							children: "No categories found. Create one to get started."
						}) })] })]
					})
				})
			}), /* @__PURE__ */ jsxs("div", {
				style: {
					width: isMobile ? "100%" : "350px",
					background: "#fff",
					border: "1px solid #e2e8f0",
					borderRadius: "12px",
					padding: "24px",
					position: isMobile ? "static" : "sticky",
					top: "100px"
				},
				children: [/* @__PURE__ */ jsx("h2", {
					style: {
						fontSize: "18px",
						fontWeight: 700,
						marginBottom: "20px"
					},
					children: editingId ? "Edit Category" : "Add New Category"
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSave,
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
								fontWeight: 600,
								color: "#475569",
								marginBottom: "6px"
							},
							children: "Category Name *"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: name,
							onChange: (e) => setName(e.target.value),
							required: true,
							style: {
								width: "100%",
								padding: "10px 12px",
								border: "1px solid #cbd5e1",
								borderRadius: "6px",
								fontSize: "14px"
							},
							placeholder: "e.g. Technology"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							style: {
								display: "block",
								fontSize: "13px",
								fontWeight: 600,
								color: "#475569",
								marginBottom: "6px"
							},
							children: "Slug (Optional)"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: slug,
							onChange: (e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
							style: {
								width: "100%",
								padding: "10px 12px",
								border: "1px solid #cbd5e1",
								borderRadius: "6px",
								fontSize: "14px"
							},
							placeholder: "e.g. technology"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							style: {
								display: "block",
								fontSize: "13px",
								fontWeight: 600,
								color: "#475569",
								marginBottom: "6px"
							},
							children: "Description"
						}), /* @__PURE__ */ jsx("textarea", {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 3,
							style: {
								width: "100%",
								padding: "10px 12px",
								border: "1px solid #cbd5e1",
								borderRadius: "6px",
								fontSize: "14px",
								resize: "vertical"
							},
							placeholder: "A short description..."
						})] }),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "10px",
								marginTop: "8px"
							},
							children: [/* @__PURE__ */ jsxs("button", {
								type: "submit",
								style: {
									flex: 1,
									background: "#2563eb",
									color: "#fff",
									border: "none",
									padding: "10px",
									borderRadius: "6px",
									fontWeight: 600,
									cursor: "pointer",
									whiteSpace: "nowrap"
								},
								children: [editingId ? "Update" : "Add", " Category"]
							}), editingId && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: resetForm,
								style: {
									background: "#f1f5f9",
									color: "#475569",
									border: "1px solid #cbd5e1",
									padding: "10px 16px",
									borderRadius: "6px",
									fontWeight: 600,
									cursor: "pointer",
									whiteSpace: "nowrap"
								},
								children: "Cancel"
							})]
						})
					]
				})]
			})]
		})
	] });
}
CategoriesPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { CategoriesPage as default };
