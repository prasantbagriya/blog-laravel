import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Building, CheckCircle, Home, Link as Link$1, LogOut, MapPin, Save, ShieldCheck, User } from "lucide-react";
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
		className: "min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans flex flex-col md:flex-row transition-colors selection:bg-blue-500/30",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Dashboard | CoachingInSikar" }),
			/* @__PURE__ */ jsxs("aside", {
				className: "w-full md:w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shrink-0 md:min-h-screen flex flex-col shadow-sm relative z-20",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "h-20 flex items-center px-8 border-b border-slate-200 dark:border-zinc-800",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "flex items-center space-x-2 group shrink-0 decoration-transparent",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden",
								children: /* @__PURE__ */ jsx("img", {
									src: "/uploads/logo.webp",
									alt: "Coaching Sikar Logo",
									className: "w-full h-full object-cover dark:invert-0 invert"
								})
							}), /* @__PURE__ */ jsx("span", {
								className: "font-bold text-xl text-slate-900 dark:text-white tracking-tighter",
								children: "Coaching Sikar"
							})]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-6 flex-1 space-y-2",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 px-2",
								children: "Manage Account"
							}),
							/* @__PURE__ */ jsxs("a", {
								href: "#",
								className: "flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-blue-500/20 shadow-sm",
								children: [/* @__PURE__ */ jsx(User, {
									size: 18,
									strokeWidth: 2.5
								}), " Profile Settings"]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: "#",
								className: "flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all",
								children: [/* @__PURE__ */ jsx(Building, { size: 18 }), " My Listings"]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: "#",
								className: "flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all",
								children: [/* @__PURE__ */ jsx(Link$1, { size: 18 }), " Social Links"]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-6 mt-6 border-t border-slate-200 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 px-2",
									children: "Navigation"
								}), /* @__PURE__ */ jsxs(Link, {
									href: "/",
									className: "flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all",
									children: [/* @__PURE__ */ jsx(Home, { size: 18 }), " Back to Home"]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "p-6 border-t border-slate-200 dark:border-zinc-800 hidden md:block",
						children: /* @__PURE__ */ jsxs(Link, {
							href: route("logout"),
							method: "post",
							as: "button",
							className: "flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl font-bold transition-all w-full text-left",
							children: [/* @__PURE__ */ jsx(LogOut, { size: 18 }), " Sign Out"]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 flex flex-col min-w-0",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight",
						children: "Dashboard"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 bg-slate-50 dark:bg-zinc-800 py-1.5 px-1.5 pr-4 rounded-full border border-slate-200 dark:border-zinc-700 shadow-sm",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-white dark:border-zinc-700 overflow-hidden flex items-center justify-center shadow-sm",
								children: user.profile_picture ? /* @__PURE__ */ jsx("img", {
									src: user.profile_picture,
									className: "w-full h-full object-cover",
									alt: "Profile"
								}) : /* @__PURE__ */ jsx("span", {
									className: "text-blue-600 dark:text-blue-400 font-bold",
									children: user.name ? user.name.charAt(0) : "U"
								})
							}), /* @__PURE__ */ jsx("span", {
								className: "text-sm font-bold text-slate-700 dark:text-zinc-200",
								children: user.name
							})]
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "p-6 md:p-10 max-w-7xl overflow-y-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 xl:grid-cols-3 gap-8",
						children: [/* @__PURE__ */ jsx("div", {
							className: "xl:col-span-2 space-y-8",
							children: /* @__PURE__ */ jsxs("div", {
								className: "bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "px-8 py-6 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center gap-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center",
										children: /* @__PURE__ */ jsx(User, { size: 24 })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
										className: "font-extrabold text-xl text-slate-900 dark:text-white",
										children: "Personal Information"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm font-medium text-slate-500 dark:text-zinc-400 mt-0.5",
										children: "Update your account details and public profile."
									})] })]
								}), /* @__PURE__ */ jsxs("form", {
									onSubmit: submit,
									className: "p-8 space-y-6",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-1 md:grid-cols-2 gap-6",
											children: [/* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2",
													children: "Display Name"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													value: data.name,
													onChange: (e) => setData("name", e.target.value),
													className: "block w-full px-5 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800"
												}),
												errors.name && /* @__PURE__ */ jsx("p", {
													className: "text-rose-500 text-xs font-semibold mt-1.5",
													children: errors.name
												})
											] }), /* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2",
													children: "Username"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													value: data.username,
													onChange: (e) => setData("username", e.target.value),
													className: "block w-full px-5 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800"
												}),
												errors.username && /* @__PURE__ */ jsx("p", {
													className: "text-rose-500 text-xs font-semibold mt-1.5",
													children: errors.username
												})
											] })]
										}),
										/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2",
												children: "Email Address"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "email",
												value: data.email,
												onChange: (e) => setData("email", e.target.value),
												className: "block w-full px-5 py-3.5 bg-slate-200 dark:bg-zinc-800 border border-transparent rounded-full text-sm font-medium text-slate-500 dark:text-zinc-500 cursor-not-allowed",
												disabled: true
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-400 font-medium mt-1.5",
												children: "Email cannot be changed directly."
											})
										] }),
										/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2",
												children: "Bio"
											}),
											/* @__PURE__ */ jsx("textarea", {
												value: data.bio,
												onChange: (e) => setData("bio", e.target.value),
												rows: "4",
												className: "block w-full px-5 py-4 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-3xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 resize-y",
												placeholder: "Tell us a bit about yourself..."
											}),
											errors.bio && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-xs font-semibold mt-1.5",
												children: errors.bio
											})
										] }),
										/* @__PURE__ */ jsxs("div", {
											className: "pt-6 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800",
											children: [recentlySuccessful ? /* @__PURE__ */ jsxs("span", {
												className: "text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20",
												children: [/* @__PURE__ */ jsx(CheckCircle, { size: 16 }), " Saved Successfully"]
											}) : /* @__PURE__ */ jsx("span", {}), /* @__PURE__ */ jsxs("button", {
												type: "submit",
												disabled: processing,
												className: "flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded-full font-extrabold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-amber-500/20",
												children: [
													/* @__PURE__ */ jsx(Save, { size: 18 }),
													" ",
													processing ? "Saving..." : "Save Profile"
												]
											})]
										})
									]
								})]
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "xl:col-span-1 space-y-8",
							children: /* @__PURE__ */ jsxs("div", {
								className: "bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "px-6 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex justify-between items-center",
									children: [/* @__PURE__ */ jsxs("h2", {
										className: "font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Building, {
											size: 18,
											className: "text-amber-500"
										}), "Your Listings"]
									}), /* @__PURE__ */ jsx("span", {
										className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800/50 shadow-sm",
										children: userBusinesses?.length || 0
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "p-0",
									children: userBusinesses && userBusinesses.length > 0 ? /* @__PURE__ */ jsx("ul", {
										className: "divide-y divide-slate-100 dark:divide-zinc-800/50",
										children: userBusinesses.map((business) => /* @__PURE__ */ jsx("li", {
											className: "p-6 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex flex-col gap-4",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-start gap-4",
													children: [business.logo ? /* @__PURE__ */ jsx("img", {
														src: business.logo,
														alt: business.name,
														className: "w-12 h-12 rounded-xl border border-slate-200 dark:border-zinc-700 object-cover shrink-0 shadow-sm"
													}) : /* @__PURE__ */ jsx("div", {
														className: "w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm",
														children: business.name.charAt(0)
													}), /* @__PURE__ */ jsxs("div", {
														className: "min-w-0 flex-1",
														children: [
															/* @__PURE__ */ jsx("p", {
																className: "text-base font-bold text-slate-900 dark:text-white truncate",
																children: business.name
															}),
															/* @__PURE__ */ jsxs("p", {
																className: "text-xs font-medium text-slate-500 dark:text-zinc-400 truncate flex items-center gap-1 mt-1",
																children: [
																	/* @__PURE__ */ jsx(MapPin, { size: 12 }),
																	" ",
																	business.category_name || business.category
																]
															}),
															/* @__PURE__ */ jsx("div", {
																className: "mt-2.5 flex items-center gap-2",
																children: business.is_verified == 1 ? /* @__PURE__ */ jsxs("span", {
																	className: "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
																	children: [/* @__PURE__ */ jsx(ShieldCheck, {
																		size: 12,
																		className: "mr-1"
																	}), " Verified"]
																}) : /* @__PURE__ */ jsx("span", {
																	className: "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
																	children: "Pending"
																})
															})
														]
													})]
												}), /* @__PURE__ */ jsx("div", {
													className: "pt-2",
													children: /* @__PURE__ */ jsx("a", {
														href: `/reviews/${business.category || (business.category_name ? business.category_name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") : "uncategorized")}/${business.slug}`,
														className: "w-full flex justify-center items-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 transition-all active:scale-[0.98] shadow-sm",
														children: "Edit & Manage"
													})
												})]
											})
										}, business.id))
									}) : /* @__PURE__ */ jsxs("div", {
										className: "p-10 flex flex-col items-center justify-center text-center",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4",
												children: /* @__PURE__ */ jsx(Building, { className: "w-8 h-8 text-slate-400 dark:text-zinc-500" })
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-900 dark:text-white font-bold text-lg mb-1",
												children: "No businesses yet"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-sm font-medium text-slate-500 dark:text-zinc-400",
												children: "You haven't listed any institutes."
											})
										]
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
