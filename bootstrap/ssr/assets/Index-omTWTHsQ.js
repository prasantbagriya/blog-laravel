import { t as Navbar } from "./Navbar-Dej3-zgW.js";
import { Head, Link, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowBigDown, ArrowBigUp, Compass, MessageSquare, User } from "lucide-react";
//#region resources/js/Pages/Search/Index.jsx
function SearchIndex({ auth, posts, communities, users, query }) {
	const [activeTab, setActiveTab] = useState("posts");
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F2F4F5] text-[#1C1C1C] font-sans pb-20",
		children: [
			/* @__PURE__ */ jsx(Head, { title: `Search Results for "${query}" - coachingsinsikar` }),
			/* @__PURE__ */ jsx(Navbar, {
				auth,
				searchQuery: query
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-[1000px] mx-auto mt-6 px-4",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-6",
						children: /* @__PURE__ */ jsxs("h1", {
							className: "text-2xl font-bold",
							children: [
								"Search results for \"",
								query,
								"\""
							]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-4 mb-6 border-b border-[#EDEFF1]",
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: () => setActiveTab("posts"),
								className: `px-4 py-3 font-bold text-[14px] ${activeTab === "posts" ? "border-b-2 border-[#1C1C1C] text-[#1C1C1C]" : "text-[#878A8C] hover:text-[#1C1C1C]"}`,
								children: "Posts"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => setActiveTab("communities"),
								className: `px-4 py-3 font-bold text-[14px] ${activeTab === "communities" ? "border-b-2 border-[#1C1C1C] text-[#1C1C1C]" : "text-[#878A8C] hover:text-[#1C1C1C]"}`,
								children: "Communities"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => setActiveTab("users"),
								className: `px-4 py-3 font-bold text-[14px] ${activeTab === "users" ? "border-b-2 border-[#1C1C1C] text-[#1C1C1C]" : "text-[#878A8C] hover:text-[#1C1C1C]"}`,
								children: "People"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex gap-6",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex-1 space-y-4",
							children: [
								activeTab === "posts" && /* @__PURE__ */ jsx("div", { children: posts.length === 0 ? /* @__PURE__ */ jsxs("div", {
									className: "bg-white p-8 rounded-lg text-center border border-[#EDEFF1]",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[16px] font-medium",
										children: "No posts found"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-[14px] text-[#878A8C] mt-2",
										children: "Try checking your spelling or using less specific keywords."
									})]
								}) : posts.map((post) => /* @__PURE__ */ jsxs("div", {
									className: "bg-white border border-[#EDEFF1] hover:border-[#878A8C] rounded-md flex cursor-pointer transition-colors mb-3",
									onClick: () => router.visit(`/r/${post.community.name}/comments/${post.id}`),
									children: [/* @__PURE__ */ jsxs("div", {
										className: "w-10 bg-[#F8F9FA] rounded-l-md flex flex-col items-center py-2 gap-1 flex-shrink-0",
										children: [
											/* @__PURE__ */ jsx(ArrowBigUp, {
												size: 24,
												className: "text-[#878A8C]"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-[12px] font-bold text-[#1C1C1C]",
												children: post.score
											}),
											/* @__PURE__ */ jsx(ArrowBigDown, {
												size: 24,
												className: "text-[#878A8C]"
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "p-2 flex-1",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1 text-[12px] mb-2",
												children: [
													/* @__PURE__ */ jsxs(Link, {
														href: `/r/${post.community.name}`,
														className: "font-bold hover:underline",
														onClick: (e) => e.stopPropagation(),
														children: ["r/", post.community.name]
													}),
													/* @__PURE__ */ jsx("span", {
														className: "text-[#878A8C]",
														children: "•"
													}),
													/* @__PURE__ */ jsx("span", {
														className: "text-[#878A8C]",
														children: "Posted by"
													}),
													/* @__PURE__ */ jsxs(Link, {
														href: `/u/${post.author.username}`,
														className: "text-[#878A8C] hover:underline",
														onClick: (e) => e.stopPropagation(),
														children: ["u/", post.author.username]
													})
												]
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-[16px] font-medium text-[#1C1C1C] mb-2",
												children: post.title
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1 text-[#878A8C] text-[12px] font-bold",
												children: [/* @__PURE__ */ jsx(MessageSquare, { size: 16 }), /* @__PURE__ */ jsx("span", { children: "Comments" })]
											})
										]
									})]
								}, post.id)) }),
								activeTab === "communities" && /* @__PURE__ */ jsx("div", {
									className: "bg-white rounded-lg border border-[#EDEFF1] overflow-hidden",
									children: communities.length === 0 ? /* @__PURE__ */ jsx("div", {
										className: "p-8 text-center",
										children: /* @__PURE__ */ jsx("p", {
											className: "text-[16px] font-medium",
											children: "No communities found"
										})
									}) : communities.map((community) => /* @__PURE__ */ jsxs(Link, {
										href: `/r/${community.name}`,
										className: "flex items-center gap-4 p-4 border-b border-[#EDEFF1] hover:bg-[#F6F7F8] transition-colors last:border-0",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0",
											children: community.icon_image ? /* @__PURE__ */ jsx("img", {
												loading: "lazy",
												decoding: "async",
												fetchPriority: "low",
												src: community.icon_image,
												className: "w-full h-full object-cover"
											}) : /* @__PURE__ */ jsx(Compass, {
												size: 24,
												className: "text-[#0079D3]"
											})
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
											className: "font-bold text-[16px]",
											children: ["r/", community.name]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[12px] text-[#878A8C] mt-1",
											children: community.description
										})] })]
									}, community.id))
								}),
								activeTab === "users" && /* @__PURE__ */ jsx("div", {
									className: "bg-white rounded-lg border border-[#EDEFF1] overflow-hidden",
									children: users.length === 0 ? /* @__PURE__ */ jsx("div", {
										className: "p-8 text-center",
										children: /* @__PURE__ */ jsx("p", {
											className: "text-[16px] font-medium",
											children: "No users found"
										})
									}) : users.map((user) => /* @__PURE__ */ jsxs(Link, {
										href: `/u/${user.username}`,
										className: "flex items-center gap-4 p-4 border-b border-[#EDEFF1] hover:bg-[#F6F7F8] transition-colors last:border-0",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0",
											children: user.profile_picture ? /* @__PURE__ */ jsx("img", {
												loading: "lazy",
												decoding: "async",
												fetchPriority: "low",
												src: user.profile_picture,
												className: "w-full h-full object-cover"
											}) : /* @__PURE__ */ jsx(User, {
												size: 24,
												className: "text-[#878A8C]"
											})
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
											className: "font-bold text-[16px]",
											children: ["u/", user.username]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[12px] text-[#878A8C] mt-1",
											children: user.name
										})] })]
									}, user.id))
								})
							]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { SearchIndex as default };
