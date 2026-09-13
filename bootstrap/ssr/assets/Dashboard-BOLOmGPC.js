import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Building, CheckCircle, Link as Link$1, LogOut, MapPin, Save, ShieldCheck, User } from "lucide-react";
//#region resources/js/Pages/Dashboard.jsx
function Dashboard({ auth, userBusinesses = [] }) {
	const { user } = auth;
	const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
		name: user.name || "",
		username: user.username || "",
		bio: user.bio || "",
		email: user.email || ""
	});
	const submit = (e) => {
		e.preventDefault();
		patch(route("profile.update"));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F3F4F6] text-gray-900 font-sans flex flex-col md:flex-row",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
			/* @__PURE__ */ jsxs("aside", {
				className: "w-full md:w-64 bg-white border-r border-gray-200 shrink-0 md:min-h-screen",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "h-16 flex items-center px-6 border-b border-gray-200",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/feed",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold",
								children: "C"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-bold text-lg text-gray-900",
								children: "CoachingInSikar"
							})]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-4 space-y-1",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3",
								children: "Menu"
							}),
							/* @__PURE__ */ jsxs("a", {
								href: "#",
								className: "flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium",
								children: [/* @__PURE__ */ jsx(User, { size: 18 }), " Profile Settings"]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: "#",
								className: "flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium transition-colors",
								children: [/* @__PURE__ */ jsx(Building, { size: 18 }), " My Listings"]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: "#",
								className: "flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium transition-colors",
								children: [/* @__PURE__ */ jsx(Link$1, { size: 18 }), " Social Links"]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "p-4 mt-auto border-t border-gray-200 hidden md:block",
						children: /* @__PURE__ */ jsxs(Link, {
							href: route("logout"),
							method: "post",
							as: "button",
							className: "flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md font-medium transition-colors w-full text-left",
							children: [/* @__PURE__ */ jsx(LogOut, { size: 18 }), " Sign Out"]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 flex flex-col min-w-0",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "font-semibold text-xl text-gray-800",
						children: "Dashboard"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm font-medium text-gray-700",
								children: user.name
							}), /* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center",
								children: user.profile_picture ? /* @__PURE__ */ jsx("img", {
									src: user.profile_picture,
									className: "w-full h-full object-cover",
									alt: "Profile"
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-gray-500 font-bold",
									children: user.name ? user.name.charAt(0) : "U"
								})
							})]
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "p-6 md:p-8 max-w-5xl overflow-y-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 xl:grid-cols-3 gap-8",
						children: [/* @__PURE__ */ jsx("div", {
							className: "xl:col-span-2 space-y-8",
							children: /* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "px-6 py-5 border-b border-gray-200 bg-gray-50/50",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "font-semibold text-lg text-gray-900",
										children: "Personal Information"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm text-gray-500",
										children: "Update your account details and public profile."
									})]
								}), /* @__PURE__ */ jsxs("form", {
									onSubmit: submit,
									className: "p-6 space-y-5",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-1 md:grid-cols-2 gap-5",
											children: [/* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-medium text-gray-700 mb-1",
													children: "Display Name"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													value: data.name,
													onChange: (e) => setData("name", e.target.value),
													className: "w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
												}),
												errors.name && /* @__PURE__ */ jsx("p", {
													className: "text-red-500 text-xs mt-1",
													children: errors.name
												})
											] }), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-medium text-gray-700 mb-1",
													children: "Username"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													value: data.username,
													onChange: (e) => setData("username", e.target.value),
													className: "w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
												}),
												errors.username && /* @__PURE__ */ jsx("p", {
													className: "text-red-500 text-xs mt-1",
													children: errors.username
												})
											] })]
										}),
										/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-medium text-gray-700 mb-1",
												children: "Email Address"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "email",
												value: data.email,
												onChange: (e) => setData("email", e.target.value),
												className: "w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 cursor-not-allowed",
												disabled: true
											}),
											errors.email && /* @__PURE__ */ jsx("p", {
												className: "text-red-500 text-xs mt-1",
												children: errors.email
											})
										] }),
										/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-medium text-gray-700 mb-1",
												children: "Bio"
											}),
											/* @__PURE__ */ jsx("textarea", {
												value: data.bio,
												onChange: (e) => setData("bio", e.target.value),
												rows: "4",
												className: "w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white resize-y"
											}),
											errors.bio && /* @__PURE__ */ jsx("p", {
												className: "text-red-500 text-xs mt-1",
												children: errors.bio
											})
										] }),
										/* @__PURE__ */ jsxs("div", {
											className: "pt-4 flex items-center justify-between border-t border-gray-100",
											children: [recentlySuccessful ? /* @__PURE__ */ jsxs("span", {
												className: "text-sm text-green-600 flex items-center gap-1",
												children: [/* @__PURE__ */ jsx(CheckCircle, { size: 16 }), " Saved"]
											}) : /* @__PURE__ */ jsx("span", {}), /* @__PURE__ */ jsxs("button", {
												type: "submit",
												disabled: processing,
												className: "inline-flex justify-center items-center py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50",
												children: [/* @__PURE__ */ jsx(Save, {
													size: 16,
													className: "mr-2"
												}), " Save Changes"]
											})]
										})
									]
								})]
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "xl:col-span-1 space-y-8",
							children: /* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "font-semibold text-lg text-gray-900",
										children: "Your Listings"
									}), /* @__PURE__ */ jsx("span", {
										className: "bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full",
										children: userBusinesses?.length || 0
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "p-0",
									children: userBusinesses && userBusinesses.length > 0 ? /* @__PURE__ */ jsx("ul", {
										className: "divide-y divide-gray-200",
										children: userBusinesses.map((business) => /* @__PURE__ */ jsx("li", {
											className: "p-5 hover:bg-gray-50 transition-colors",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-start gap-3",
												children: [business.logo ? /* @__PURE__ */ jsx("img", {
													src: business.logo,
													alt: business.name,
													className: "w-10 h-10 rounded border border-gray-200 object-cover shrink-0"
												}) : /* @__PURE__ */ jsx("div", {
													className: "w-10 h-10 rounded bg-blue-50 border border-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0",
													children: business.name.charAt(0)
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0 flex-1",
													children: [
														/* @__PURE__ */ jsx("p", {
															className: "text-sm font-semibold text-gray-900 truncate",
															children: business.name
														}),
														/* @__PURE__ */ jsxs("p", {
															className: "text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5",
															children: [
																/* @__PURE__ */ jsx(MapPin, { size: 12 }),
																" ",
																business.category_name || business.category
															]
														}),
														/* @__PURE__ */ jsx("div", {
															className: "mt-2 flex items-center gap-2",
															children: business.is_verified == 1 ? /* @__PURE__ */ jsxs("span", {
																className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800",
																children: [/* @__PURE__ */ jsx(ShieldCheck, {
																	size: 10,
																	className: "mr-1"
																}), " Verified"]
															}) : /* @__PURE__ */ jsx("span", {
																className: "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800",
																children: "Pending"
															})
														}),
														/* @__PURE__ */ jsx("div", {
															className: "mt-4",
															children: /* @__PURE__ */ jsx("a", {
																href: `/reviews/${business.category || (business.category_name ? business.category_name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") : "uncategorized")}/${business.slug}`,
																className: "w-full inline-flex justify-center items-center px-4 py-2 border-2 border-gray-800 shadow-sm text-xs font-bold uppercase tracking-wider rounded-full text-gray-800 bg-transparent hover:bg-gray-800 hover:text-white transition-all focus:outline-none focus:ring-4 focus:ring-gray-200",
																children: "Edit & Manage"
															})
														})
													]
												})]
											})
										}, business.id))
									}) : /* @__PURE__ */ jsx("div", {
										className: "p-8 text-center text-gray-500 text-sm",
										children: "No businesses listed yet."
									})
								})]
							})
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as default };
