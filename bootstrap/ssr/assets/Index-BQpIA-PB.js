import AdminLayout from "./AdminLayout-BLiupKcK.js";
import DeleteButton from "./DeleteButton-4pbNZztV.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region resources/js/Pages/Admin/CommunityPosts/Index.jsx
function CommunityPostsPage() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetchPosts();
	}, []);
	const fetchPosts = async () => {
		try {
			const data = await (await fetch((typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/api/admin/community-posts")).json();
			if (Array.isArray(data)) setPosts(data);
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
		children: "Loading Community Posts..."
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx(Head, { title: "Community Posts | Admin" }),
		/* @__PURE__ */ jsx("h1", {
			style: {
				fontSize: "28px",
				fontWeight: 800,
				color: "#0f172a",
				marginBottom: "8px"
			},
			children: "Community Posts"
		}),
		/* @__PURE__ */ jsx("p", {
			style: {
				color: "#64748b",
				marginBottom: "32px"
			},
			children: "Manage all posts submitted to communities. These posts are separate from the main blog."
		}),
		/* @__PURE__ */ jsx("div", {
			style: {
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
								children: "Post"
							}),
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase"
								},
								children: "Community"
							}),
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase"
								},
								children: "Author"
							}),
							/* @__PURE__ */ jsx("th", {
								style: {
									padding: "16px 24px",
									fontSize: "12px",
									fontWeight: 600,
									color: "#64748b",
									textTransform: "uppercase"
								},
								children: "Date"
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
					}) }), /* @__PURE__ */ jsxs("tbody", { children: [posts.map((post) => {
						const isReported = post.reports_count > 0;
						return /* @__PURE__ */ jsxs("tr", {
							style: {
								borderBottom: "1px solid #e2e8f0",
								backgroundColor: isReported ? "#fee2e2" : "transparent"
							},
							children: [
								/* @__PURE__ */ jsxs("td", {
									style: { padding: "16px 24px" },
									children: [/* @__PURE__ */ jsxs("div", {
										style: {
											fontWeight: 600,
											color: isReported ? "#b91c1c" : "#0f172a",
											fontSize: "15px",
											display: "flex",
											alignItems: "center",
											gap: "8px"
										},
										children: [post.title, isReported && /* @__PURE__ */ jsxs("span", {
											style: {
												fontSize: "10px",
												background: "#ef4444",
												color: "white",
												padding: "2px 6px",
												borderRadius: "4px",
												fontWeight: "bold"
											},
											children: [post.reports_count, " Reports"]
										})]
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "13px",
											color: isReported ? "#991b1b" : "#64748b",
											marginTop: "4px",
											maxWidth: "300px",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis"
										},
										children: post.content ? post.content.replace(/<[^>]*>?/gm, "") : "No content"
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									style: {
										padding: "16px 24px",
										fontSize: "14px",
										color: "#475569"
									},
									children: /* @__PURE__ */ jsx("span", {
										style: {
											background: "#f1f5f9",
											padding: "4px 8px",
											borderRadius: "4px",
											fontWeight: 600
										},
										children: post.community ? post.community.name : post.community_id
									})
								}),
								/* @__PURE__ */ jsx("td", {
									style: {
										padding: "16px 24px",
										fontSize: "14px",
										color: "#475569"
									},
									children: post.author ? post.author.name || post.author.username : "Unknown"
								}),
								/* @__PURE__ */ jsx("td", {
									style: {
										padding: "16px 24px",
										fontSize: "14px",
										color: "#475569"
									},
									children: new Date(post.created_at || post.date).toLocaleDateString()
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
											endpoint: "/api/admin/posts",
											id: post.id,
											onSuccess: fetchPosts,
											label: "Delete"
										})
									})
								})
							]
						}, post.id);
					}), posts.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 5,
						style: {
							padding: "32px",
							textAlign: "center",
							color: "#64748b"
						},
						children: "No community posts found."
					}) })] })]
				})
			})
		})
	] });
}
CommunityPostsPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { CommunityPostsPage as default };
