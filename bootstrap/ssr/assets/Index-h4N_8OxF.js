import AdminLayout from "./AdminLayout-BLiupKcK.js";
import DeleteButton from "./DeleteButton-4pbNZztV.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Pages/Admin/Businesses/Index.jsx
function BusinessesPage() {
	const [businesses, setBusinesses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	useEffect(() => {
		fetchBusinesses();
	}, []);
	const fetchBusinesses = async () => {
		try {
			const data = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/businesses")).json();
			if (Array.isArray(data)) setBusinesses(data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			padding: "40px",
			color: "#64748b"
		},
		children: "Loading Businesses..."
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(Head, { title: "Businesses | Admin" }),
		/* @__PURE__ */ jsx("h1", {
			style: {
				fontSize: "28px",
				fontWeight: 800,
				color: "#0f172a",
				marginBottom: "8px"
			},
			children: "Business Listings"
		}),
		/* @__PURE__ */ jsx("p", {
			style: {
				color: "#64748b",
				marginBottom: "32px"
			},
			children: "Manage user-submitted business profiles across the platform."
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
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
						minWidth: "800px",
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
								children: "Business"
							}),
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase"
								},
								children: "Category"
							}),
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase"
								},
								children: "Stats"
							}),
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase"
								},
								children: "Date Added"
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
					}) }), /* @__PURE__ */ jsxs("tbody", { children: [businesses.map((business) => /* @__PURE__ */ jsxs("tr", {
						style: { borderBottom: "1px solid #e2e8f0" },
						children: [
							/* @__PURE__ */ jsx("td", {
								style: { padding: "16px 24px" },
								children: /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "12px"
									},
									children: [/* @__PURE__ */ jsx("img", {
										src: business.logo,
										alt: business.name,
										style: {
											width: "40px",
											height: "40px",
											borderRadius: "8px",
											objectFit: "cover",
											border: "1px solid #e2e8f0"
										}
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontWeight: 600,
											color: "#0f172a",
											fontSize: "15px"
										},
										children: business.name
									}), /* @__PURE__ */ jsx("a", {
										href: `/reviews/${business.category_name}/${business.slug}`,
										target: "_blank",
										rel: "noreferrer",
										style: {
											fontSize: "13px",
											color: "#2563eb",
											textDecoration: "none"
										},
										children: "View Live ↗"
									})] })]
								})
							}),
							/* @__PURE__ */ jsx("td", {
								style: {
									padding: "16px 24px",
									fontSize: "14px",
									color: "#475569"
								},
								children: /* @__PURE__ */ jsx("span", {
									style: {
										display: "inline-block",
										padding: "4px 8px",
										background: "#f1f5f9",
										borderRadius: "4px",
										fontSize: "12px",
										fontWeight: 500
									},
									children: business.category_name
								})
							}),
							/* @__PURE__ */ jsxs("td", {
								style: {
									padding: "16px 24px",
									fontSize: "14px",
									color: "#475569"
								},
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									style: { fontWeight: 600 },
									children: business.trust_score
								}), " Trust Score"] }), /* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: "12px",
										marginTop: "2px"
									},
									children: [business.review_count, " Reviews"]
								})]
							}),
							/* @__PURE__ */ jsx("td", {
								style: {
									padding: "16px 24px",
									fontSize: "14px",
									color: "#475569"
								},
								children: new Date(business.created_at).toLocaleDateString()
							}),
							/* @__PURE__ */ jsx("td", {
								style: {
									padding: "16px 24px",
									textAlign: "right"
								},
								children: /* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										gap: "12px",
										justifyContent: "flex-end",
										alignItems: "center"
									},
									children: /* @__PURE__ */ jsx(DeleteButton, {
										endpoint: "/api/admin/businesses",
										id: business.id,
										onSuccess: fetchBusinesses,
										label: "Delete"
									})
								})
							})
						]
					}, business.id)), businesses.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", {
						colSpan: 5,
						style: {
							padding: "48px",
							textAlign: "center",
							color: "#64748b"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "16px",
								fontWeight: 500
							},
							children: "No businesses listed yet."
						}), /* @__PURE__ */ jsx("p", {
							style: { marginTop: "8px" },
							children: "User submitted businesses will appear here."
						})]
					}) })] })]
				})
			})
		})
	] });
}
BusinessesPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { BusinessesPage as default };
