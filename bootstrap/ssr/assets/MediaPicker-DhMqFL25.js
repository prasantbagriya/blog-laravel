import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region resources/js/Pages/Admin/components/MediaPicker.tsx
var MediaPicker_exports = /* @__PURE__ */ __exportAll({ default: () => MediaPicker });
function MediaPicker({ onSelect, onClose }) {
	const [media, setMedia] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState("grid");
	useEffect(() => {
		fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/media").then((res) => res.json()).then((data) => {
			if (Array.isArray(data)) setMedia(data);
			setLoading(false);
		}).catch(() => setLoading(false));
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
	const filteredMedia = media.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
	return /* @__PURE__ */ jsx("div", {
		style: {
			position: "fixed",
			inset: 0,
			background: "rgba(15, 23, 42, 0.7)",
			backdropFilter: "blur(4px)",
			zIndex: 9999,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "1rem"
		},
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				background: "#fff",
				width: "100%",
				maxWidth: "900px",
				height: "80vh",
				borderRadius: "16px",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				animation: "fadeIn 0.2s ease",
				boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
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
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						style: {
							margin: 0,
							fontSize: "20px",
							fontWeight: 800,
							color: "#0f172a"
						},
						children: "Choose from Library"
					}), /* @__PURE__ */ jsx("p", {
						style: {
							margin: "4px 0 0 0",
							fontSize: "13px",
							color: "#64748b"
						},
						children: "Select an existing image to use."
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						style: {
							background: "none",
							border: "none",
							fontSize: "28px",
							cursor: "pointer",
							color: "#64748b",
							lineHeight: 1
						},
						children: "×"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						padding: "16px 24px",
						borderBottom: "1px solid #e2e8f0",
						display: "flex",
						gap: "1rem",
						justifyContent: "space-between"
					},
					children: [/* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Search images...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						style: {
							padding: "8px 16px",
							borderRadius: "8px",
							border: "1px solid #e2e8f0",
							outline: "none",
							width: "300px"
						}
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
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						flex: 1,
						overflowY: "auto",
						padding: "24px",
						background: "#f8fafc"
					},
					children: loading ? /* @__PURE__ */ jsx("div", {
						style: {
							textAlign: "center",
							color: "#64748b",
							padding: "2rem"
						},
						children: "Loading media..."
					}) : filteredMedia.length === 0 ? /* @__PURE__ */ jsx("div", {
						style: {
							textAlign: "center",
							color: "#64748b",
							padding: "3rem",
							background: "#fff",
							borderRadius: "12px"
						},
						children: "No media files found."
					}) : viewMode === "grid" ? /* @__PURE__ */ jsx("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
							gap: "1rem"
						},
						children: filteredMedia.map((item) => /* @__PURE__ */ jsxs("div", {
							onClick: () => onSelect(item.url),
							style: {
								background: "#fff",
								border: "1px solid #e2e8f0",
								borderRadius: "12px",
								overflow: "hidden",
								cursor: "pointer",
								position: "relative",
								transition: "transform 0.1s ease, border-color 0.1s ease"
							},
							onMouseEnter: (e) => {
								e.currentTarget.style.transform = "translateY(-4px)";
								e.currentTarget.style.borderColor = "#2563eb";
							},
							onMouseLeave: (e) => {
								e.currentTarget.style.transform = "translateY(0)";
								e.currentTarget.style.borderColor = "#e2e8f0";
							},
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
								}), /* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "11px",
										color: "#64748b",
										marginTop: "4px"
									},
									children: formatSize(item.sizeBytes)
								})]
							})]
						}, item.id))
					}) : /* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "8px"
						},
						children: filteredMedia.map((item) => /* @__PURE__ */ jsxs("div", {
							onClick: () => onSelect(item.url),
							style: {
								display: "flex",
								alignItems: "center",
								gap: "16px",
								background: "#fff",
								border: "1px solid #e2e8f0",
								borderRadius: "12px",
								padding: "12px",
								cursor: "pointer",
								transition: "transform 0.1s ease, border-color 0.1s ease"
							},
							onMouseEnter: (e) => {
								e.currentTarget.style.transform = "translateX(4px)";
								e.currentTarget.style.borderColor = "#2563eb";
							},
							onMouseLeave: (e) => {
								e.currentTarget.style.transform = "translateX(0)";
								e.currentTarget.style.borderColor = "#e2e8f0";
							},
							children: [
								/* @__PURE__ */ jsx("img", {
									loading: "lazy",
									decoding: "async",
									fetchPriority: "low",
									src: item.url,
									alt: item.name,
									style: {
										width: "50px",
										height: "50px",
										objectFit: "cover",
										borderRadius: "8px",
										background: "#f1f5f9"
									}
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										flex: 1,
										minWidth: 0
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontWeight: 700,
											color: "#0f172a",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis"
										},
										children: item.name
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "12px",
											color: "#64748b",
											marginTop: "4px"
										},
										children: new Date(item.createdAt).toLocaleDateString()
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "13px",
										color: "#475569",
										fontWeight: 600,
										paddingRight: "12px"
									},
									children: formatSize(item.sizeBytes)
								})
							]
						}, item.id))
					})
				})
			]
		})
	});
}
//#endregion
export { MediaPicker_exports as n, MediaPicker as t };
