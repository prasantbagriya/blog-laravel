import AdminLayout from "./AdminLayout-xqBz233I.js";
import { Head, Link, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region resources/js/Pages/Admin/Communities/Edit.jsx
function Edit({ community }) {
	const [formData, setFormData] = useState({
		id: community.id,
		name: community.name || "",
		display_name: community.display_name || "",
		description: community.description || "",
		is_nsfw: community.is_nsfw ? true : false,
		is_private: community.is_private ? true : false
	});
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState(null);
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage(null);
		try {
			const res = await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/communities", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData)
			});
			const data = await res.json();
			if (res.ok && data.success) setMessage({
				type: "success",
				text: "Community updated successfully!"
			});
			else setMessage({
				type: "error",
				text: data.message || "Failed to update community"
			});
		} catch (err) {
			console.error(err);
			setMessage({
				type: "error",
				text: "An error occurred while saving."
			});
		} finally {
			setSaving(false);
		}
	};
	const labelStyle = {
		display: "block",
		fontSize: "13px",
		fontWeight: 600,
		color: "#475569",
		marginBottom: "6px"
	};
	const inputStyle = {
		width: "100%",
		padding: "10px 14px",
		borderRadius: "8px",
		border: "1px solid #cbd5e1",
		fontSize: "14px",
		color: "#0f172a",
		outline: "none",
		transition: "border-color 0.2s"
	};
	const toggleRowStyle = {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "16px 0",
		borderBottom: "1px solid #f1f5f9"
	};
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [/* @__PURE__ */ jsx(Head, { title: `Edit Community - ${community.name}` }), /* @__PURE__ */ jsxs("div", {
		style: {
			maxWidth: "800px",
			margin: "0 auto",
			width: "100%"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: "16px",
					marginBottom: "24px"
				},
				children: [/* @__PURE__ */ jsx(Link, {
					href: (typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/admin/communities",
					style: {
						color: "#64748b",
						textDecoration: "none",
						fontSize: "20px"
					},
					children: "←"
				}), /* @__PURE__ */ jsx("h1", {
					style: {
						fontSize: "24px",
						fontWeight: 800,
						color: "#0f172a",
						margin: 0,
						letterSpacing: "-0.5px"
					},
					children: "Edit Community"
				})]
			}),
			message && /* @__PURE__ */ jsx("div", {
				style: {
					padding: "12px 16px",
					borderRadius: "8px",
					marginBottom: "24px",
					background: message.type === "success" ? "#dcfce7" : "#fee2e2",
					color: message.type === "success" ? "#166534" : "#991b1b",
					fontSize: "14px",
					fontWeight: 500
				},
				children: message.text
			}),
			/* @__PURE__ */ jsx("form", {
				onSubmit: handleSubmit,
				style: {
					background: "#fff",
					borderRadius: "12px",
					boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
					padding: "32px",
					border: "1px solid #e2e8f0"
				},
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "1fr",
						gap: "24px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px"
							},
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									style: labelStyle,
									children: ["URL Slug (Name) ", /* @__PURE__ */ jsx("span", {
										style: { color: "#ef4444" },
										children: "*"
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									name: "name",
									value: formData.name,
									onChange: handleChange,
									required: true,
									style: {
										...inputStyle,
										background: "#f8fafc",
										color: "#64748b"
									},
									disabled: true
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: "11px",
										color: "#94a3b8",
										marginTop: "4px"
									},
									children: ["Used in URL: /r/", formData.name]
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: labelStyle,
								children: "Display Name"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								name: "display_name",
								value: formData.display_name,
								onChange: handleChange,
								style: inputStyle,
								placeholder: "e.g. The Cool Community"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							style: labelStyle,
							children: "Description"
						}), /* @__PURE__ */ jsx("textarea", {
							name: "description",
							value: formData.description,
							onChange: handleChange,
							rows: "4",
							style: {
								...inputStyle,
								resize: "vertical"
							},
							placeholder: "Tell users what this community is about..."
						})] }),
						/* @__PURE__ */ jsxs("div", {
							style: { marginTop: "8px" },
							children: [/* @__PURE__ */ jsxs("div", {
								style: toggleRowStyle,
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontWeight: 600,
										color: "#334155",
										fontSize: "14px"
									},
									children: "Private Community"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "13px",
										color: "#64748b",
										marginTop: "2px"
									},
									children: "Only approved members can view and post."
								})] }), /* @__PURE__ */ jsxs("label", {
									style: {
										position: "relative",
										display: "inline-block",
										width: "44px",
										height: "24px"
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										name: "is_private",
										checked: formData.is_private,
										onChange: handleChange,
										style: {
											opacity: 0,
											width: 0,
											height: 0
										}
									}), /* @__PURE__ */ jsx("span", {
										style: {
											position: "absolute",
											cursor: "pointer",
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											backgroundColor: formData.is_private ? "#2563eb" : "#cbd5e1",
											transition: ".4s",
											borderRadius: "34px"
										},
										children: /* @__PURE__ */ jsx("span", { style: {
											position: "absolute",
											content: "\"\"",
											height: "18px",
											width: "18px",
											left: formData.is_private ? "22px" : "3px",
											bottom: "3px",
											backgroundColor: "white",
											transition: ".4s",
											borderRadius: "50%"
										} })
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								style: toggleRowStyle,
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontWeight: 600,
										color: "#334155",
										fontSize: "14px"
									},
									children: "NSFW Content"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "13px",
										color: "#64748b",
										marginTop: "2px"
									},
									children: "Community contains 18+ content."
								})] }), /* @__PURE__ */ jsxs("label", {
									style: {
										position: "relative",
										display: "inline-block",
										width: "44px",
										height: "24px"
									},
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										name: "is_nsfw",
										checked: formData.is_nsfw,
										onChange: handleChange,
										style: {
											opacity: 0,
											width: 0,
											height: 0
										}
									}), /* @__PURE__ */ jsx("span", {
										style: {
											position: "absolute",
											cursor: "pointer",
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											backgroundColor: formData.is_nsfw ? "#ef4444" : "#cbd5e1",
											transition: ".4s",
											borderRadius: "34px"
										},
										children: /* @__PURE__ */ jsx("span", { style: {
											position: "absolute",
											content: "\"\"",
											height: "18px",
											width: "18px",
											left: formData.is_nsfw ? "22px" : "3px",
											bottom: "3px",
											backgroundColor: "white",
											transition: ".4s",
											borderRadius: "50%"
										} })
									})]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								justifyContent: "flex-end",
								gap: "12px",
								marginTop: "24px"
							},
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => router.visit((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/admin/communities"),
								style: {
									padding: "10px 20px",
									background: "#fff",
									color: "#475569",
									border: "1px solid #cbd5e1",
									borderRadius: "8px",
									fontSize: "14px",
									fontWeight: 600,
									cursor: "pointer"
								},
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: saving,
								style: {
									padding: "10px 24px",
									background: "#2563eb",
									color: "#fff",
									border: "none",
									borderRadius: "8px",
									fontSize: "14px",
									fontWeight: 600,
									cursor: saving ? "not-allowed" : "pointer",
									opacity: saving ? .7 : 1,
									boxShadow: "0 2px 4px rgba(37,99,235,0.2)"
								},
								children: saving ? "Saving..." : "Save Changes"
							})]
						})
					]
				})
			})
		]
	})] });
}
//#endregion
export { Edit as default };
