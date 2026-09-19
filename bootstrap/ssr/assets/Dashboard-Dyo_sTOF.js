import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Building, CheckCircle, ChevronRight, Home, LogOut, MapPin, Menu, MessageSquare, Save, ShieldCheck, Star, User, Users, X } from "lucide-react";
//#region resources/js/Pages/Dashboard.jsx
function Dashboard({ auth, userBusinesses = [], userCommunities = [] }) {
	const { user } = auth;
	const [sidebarOpen, setSidebarOpen] = useState(false);
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
	const businessUrl = (business) => `/reviews/${business.category || (business.category_name ? business.category_name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") : "uncategorized")}/${business.slug}`;
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans transition-colors",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Dashboard | CoachingInSikar" }),
			/* @__PURE__ */ jsxs("header", {
				className: "md:hidden sticky top-0 z-40 h-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 shadow-sm",
				children: [/* @__PURE__ */ jsxs(Link, {
					href: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center overflow-hidden",
						children: /* @__PURE__ */ jsx("img", {
							src: "/uploads/logo.webp",
							alt: "Logo",
							className: "w-full h-full object-cover dark:invert-0 invert"
						})
					}), /* @__PURE__ */ jsx("span", {
						className: "font-bold text-lg text-slate-900 dark:text-white tracking-tight",
						children: "Dashboard"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 py-1 px-2 rounded-full",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 overflow-hidden flex items-center justify-center",
							children: user.profile_picture ? /* @__PURE__ */ jsx("img", {
								src: user.profile_picture,
								className: "w-full h-full object-cover",
								alt: "Profile"
							}) : /* @__PURE__ */ jsx("span", {
								className: "text-blue-600 dark:text-blue-400 font-bold text-xs",
								children: user.name ? user.name.charAt(0) : "U"
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xs font-bold text-slate-700 dark:text-zinc-200 max-w-[80px] truncate",
							children: user.name
						})]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setSidebarOpen(true),
						className: "w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300",
						children: /* @__PURE__ */ jsx(Menu, { size: 20 })
					})]
				})]
			}),
			sidebarOpen && /* @__PURE__ */ jsxs("div", {
				className: "md:hidden fixed inset-0 z-50 flex",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
					onClick: () => setSidebarOpen(false)
				}), /* @__PURE__ */ jsxs("aside", {
					className: "relative w-72 max-w-[85vw] bg-white dark:bg-zinc-900 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-zinc-800",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/",
								className: "flex items-center gap-2",
								onClick: () => setSidebarOpen(false),
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-7 h-7 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center overflow-hidden",
									children: /* @__PURE__ */ jsx("img", {
										src: "/uploads/logo.webp",
										alt: "Logo",
										className: "w-full h-full object-cover dark:invert-0 invert"
									})
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-base text-slate-900 dark:text-white",
									children: "Coaching Sikar"
								})]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setSidebarOpen(false),
								className: "w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-500",
								children: /* @__PURE__ */ jsx(X, { size: 16 })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex-1 overflow-y-auto p-4 space-y-1",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2",
									children: "Account"
								}),
								/* @__PURE__ */ jsxs("a", {
									href: "#profile",
									onClick: () => setSidebarOpen(false),
									className: "flex items-center justify-between gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl font-bold border border-blue-100 dark:border-blue-500/20",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx(User, {
											size: 17,
											strokeWidth: 2.5
										}), " Profile Settings"]
									}), /* @__PURE__ */ jsx(ChevronRight, { size: 14 })]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: "#listings",
									onClick: () => setSidebarOpen(false),
									className: "flex items-center justify-between gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl font-medium",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx(Building, { size: 17 }), " My Listings"]
									}), /* @__PURE__ */ jsx(ChevronRight, {
										size: 14,
										className: "text-slate-300 dark:text-zinc-600"
									})]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: "#communities",
									onClick: () => setSidebarOpen(false),
									className: "flex items-center justify-between gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl font-medium",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx(Users, { size: 17 }), " Communities"]
									}), /* @__PURE__ */ jsx(ChevronRight, {
										size: 14,
										className: "text-slate-300 dark:text-zinc-600"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-4 mt-4 border-t border-slate-200 dark:border-zinc-800",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2",
										children: "Navigation"
									}), /* @__PURE__ */ jsxs(Link, {
										href: "/",
										onClick: () => setSidebarOpen(false),
										className: "flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl font-medium",
										children: [/* @__PURE__ */ jsx(Home, { size: 17 }), " Back to Home"]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "p-4 border-t border-slate-200 dark:border-zinc-800",
							children: /* @__PURE__ */ jsxs(Link, {
								href: route("logout"),
								method: "post",
								as: "button",
								className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 border border-rose-100 dark:border-rose-500/20 transition-all",
								children: [/* @__PURE__ */ jsx(LogOut, { size: 17 }), " Sign Out"]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-h-screen",
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "hidden md:flex w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 shrink-0 min-h-screen flex-col shadow-sm sticky top-0 z-20",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "h-20 flex items-center px-8 border-b border-slate-200 dark:border-zinc-800",
							children: /* @__PURE__ */ jsxs(Link, {
								href: "/",
								className: "flex items-center space-x-2 group shrink-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden",
									children: /* @__PURE__ */ jsx("img", {
										src: "/uploads/logo.webp",
										alt: "Logo",
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
									href: "#profile",
									className: "flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl font-bold transition-all border border-blue-100 dark:border-blue-500/20 shadow-sm",
									children: [/* @__PURE__ */ jsx(User, {
										size: 18,
										strokeWidth: 2.5
									}), " Profile Settings"]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: "#listings",
									className: "flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all",
									children: [/* @__PURE__ */ jsx(Building, { size: 18 }), " My Listings"]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: "#communities",
									className: "flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-white rounded-xl font-medium transition-all",
									children: [/* @__PURE__ */ jsx(Users, { size: 18 }), " Communities"]
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
							className: "p-4 border-t border-slate-200 dark:border-zinc-800",
							children: /* @__PURE__ */ jsxs(Link, {
								href: route("logout"),
								method: "post",
								as: "button",
								className: "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-100 dark:border-rose-500/20 transition-all active:scale-[0.98]",
								children: [/* @__PURE__ */ jsx(LogOut, { size: 18 }), " Sign Out"]
							})
						})
					]
				}), /* @__PURE__ */ jsxs("main", {
					className: "flex-1 flex flex-col min-w-0",
					children: [/* @__PURE__ */ jsxs("header", {
						className: "hidden md:flex h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 items-center justify-between px-8 shrink-0 sticky top-0 z-10",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight",
							children: "Dashboard"
						}), /* @__PURE__ */ jsxs("div", {
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
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex-1 p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 w-full",
						children: [
							/* @__PURE__ */ jsxs("section", {
								id: "profile",
								className: "bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden scroll-mt-20",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center gap-3 sm:gap-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ jsx(User, { size: 22 })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
										className: "font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white",
										children: "Personal Information"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm font-medium text-slate-500 dark:text-zinc-400 mt-0.5",
										children: "Update your account details and public profile."
									})] })]
								}), /* @__PURE__ */ jsxs("form", {
									onSubmit: submit,
									className: "p-5 sm:p-8 space-y-5 sm:space-y-6",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
											children: [/* @__PURE__ */ jsxs("div", { children: [
												/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2",
													children: "Display Name"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													value: data.name,
													onChange: (e) => setData("name", e.target.value),
													className: "block w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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
													className: "block w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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
												className: "block w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-200 dark:bg-zinc-800 border border-transparent rounded-full text-sm font-medium text-slate-500 dark:text-zinc-500 cursor-not-allowed",
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
												className: "block w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-100 dark:bg-zinc-800/80 border border-transparent rounded-3xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-y",
												placeholder: "Tell us a bit about yourself..."
											}),
											errors.bio && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-xs font-semibold mt-1.5",
												children: errors.bio
											})
										] }),
										/* @__PURE__ */ jsxs("div", {
											className: "pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-zinc-800",
											children: [recentlySuccessful ? /* @__PURE__ */ jsxs("span", {
												className: "text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20",
												children: [/* @__PURE__ */ jsx(CheckCircle, { size: 16 }), " Saved Successfully"]
											}) : /* @__PURE__ */ jsx("span", {}), /* @__PURE__ */ jsxs("button", {
												type: "submit",
												disabled: processing,
												className: "w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded-full font-extrabold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-amber-500/20",
												children: [
													/* @__PURE__ */ jsx(Save, { size: 18 }),
													" ",
													processing ? "Saving..." : "Save Profile"
												]
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								id: "listings",
								className: "bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden scroll-mt-20",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 sm:gap-3 min-w-0",
										children: [
											/* @__PURE__ */ jsx(Building, {
												size: 18,
												className: "text-amber-500 shrink-0"
											}),
											/* @__PURE__ */ jsx("h2", {
												className: "font-extrabold text-base sm:text-lg text-slate-900 dark:text-white truncate",
												children: "Your Listings"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/50 shrink-0",
												children: userBusinesses?.length || 0
											})
										]
									}), /* @__PURE__ */ jsxs(Link, {
										href: route("businesses.create"),
										className: "shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-full transition-all shadow-sm whitespace-nowrap active:scale-95",
										children: [/* @__PURE__ */ jsx("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											className: "w-3 h-3",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "3",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" })
										}), "Add New"]
									})]
								}), userBusinesses && userBusinesses.length > 0 ? /* @__PURE__ */ jsx("ul", {
									className: "divide-y divide-slate-100 dark:divide-zinc-800/50",
									children: userBusinesses.map((business) => /* @__PURE__ */ jsxs("li", {
										className: "p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-3 sm:gap-4",
											children: [business.logo ? /* @__PURE__ */ jsx("img", {
												src: business.logo,
												alt: business.name,
												className: "w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-slate-200 dark:border-zinc-700 object-cover shrink-0 shadow-sm"
											}) : /* @__PURE__ */ jsx("div", {
												className: "w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-extrabold text-lg flex items-center justify-center shrink-0",
												children: business.name.charAt(0)
											}), /* @__PURE__ */ jsxs("div", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ jsx("p", {
														className: "text-sm font-bold text-slate-900 dark:text-white truncate",
														children: business.name
													}),
													/* @__PURE__ */ jsxs("p", {
														className: "text-xs font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5",
														children: [/* @__PURE__ */ jsx(MapPin, {
															size: 10,
															className: "shrink-0"
														}), /* @__PURE__ */ jsx("span", {
															className: "truncate",
															children: business.category_name || business.category
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "mt-1.5 flex items-center gap-2 flex-wrap",
														children: [business.is_verified == 1 ? /* @__PURE__ */ jsxs("span", {
															className: "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
															children: [/* @__PURE__ */ jsx(ShieldCheck, {
																size: 9,
																className: "mr-0.5"
															}), " Verified"]
														}) : /* @__PURE__ */ jsx("span", {
															className: "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
															children: "Pending"
														}), /* @__PURE__ */ jsxs("span", {
															className: "text-[10px] font-bold text-slate-500 dark:text-zinc-500 flex items-center gap-0.5",
															children: [
																/* @__PURE__ */ jsx(Star, {
																	size: 9,
																	className: "text-amber-400"
																}),
																" ",
																business.review_count ?? 0,
																" reviews"
															]
														})]
													})
												]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "mt-3 grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ jsxs("a", {
												href: businessUrl(business),
												className: "flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-95",
												children: [/* @__PURE__ */ jsx(MessageSquare, { size: 12 }), " View Reviews"]
											}), /* @__PURE__ */ jsx(Link, {
												href: `/businesses/${business.slug || business.id}/edit`,
												className: "flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 transition-all active:scale-95 shadow-sm shadow-amber-500/20",
												children: "Manage"
											})]
										})]
									}, business.id))
								}) : /* @__PURE__ */ jsxs("div", {
									className: "p-8 sm:p-10 flex flex-col items-center justify-center text-center",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4",
											children: /* @__PURE__ */ jsx(Building, { className: "w-7 h-7 sm:w-8 sm:h-8 text-slate-400 dark:text-zinc-500" })
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-slate-900 dark:text-white font-bold text-base sm:text-lg mb-1",
											children: "No businesses yet"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm font-medium text-slate-500 dark:text-zinc-400 mb-5",
											children: "You haven't listed any institutes."
										}),
										/* @__PURE__ */ jsx(Link, {
											href: route("businesses.create"),
											className: "px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-extrabold rounded-full transition-all shadow-md active:scale-95",
											children: "Add Business Listing"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								id: "communities",
								className: "bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden scroll-mt-20",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between gap-2 flex-nowrap",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 sm:gap-3 min-w-0",
										children: [
											/* @__PURE__ */ jsx(Users, {
												size: 18,
												className: "text-blue-500 shrink-0 hidden sm:block"
											}),
											/* @__PURE__ */ jsx("h2", {
												className: "font-extrabold text-sm sm:text-lg text-slate-900 dark:text-white truncate whitespace-nowrap",
												children: "Your Communities"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/50 shrink-0",
												children: userCommunities?.length || 0
											})
										]
									}), /* @__PURE__ */ jsxs(Link, {
										href: route("community.create"),
										className: "shrink-0 inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-400 text-white text-[11px] sm:text-xs font-extrabold rounded-full transition-all shadow-sm whitespace-nowrap active:scale-95",
										children: [/* @__PURE__ */ jsx("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											className: "w-3 h-3",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "3",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" })
										}), "Create New"]
									})]
								}), userCommunities && userCommunities.length > 0 ? /* @__PURE__ */ jsx("ul", {
									className: "divide-y divide-slate-100 dark:divide-zinc-800/50",
									children: userCommunities.map((community) => /* @__PURE__ */ jsxs("li", {
										className: "p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-3 sm:gap-4",
											children: [community.icon ? /* @__PURE__ */ jsx("img", {
												src: community.icon,
												alt: community.name,
												className: "w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-slate-200 dark:border-zinc-700 object-cover shrink-0 shadow-sm"
											}) : /* @__PURE__ */ jsx("div", {
												className: "w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-extrabold text-base flex items-center justify-center shrink-0 uppercase",
												children: community.name.substring(0, 2)
											}), /* @__PURE__ */ jsxs("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ jsxs("p", {
													className: "text-sm font-bold text-slate-900 dark:text-white truncate",
													children: ["r/", community.name]
												}), /* @__PURE__ */ jsx("p", {
													className: "text-xs font-medium text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-2",
													children: community.description || "Community for discussing " + community.name
												})]
											})]
										}), /* @__PURE__ */ jsx("div", {
											className: "mt-3",
											children: /* @__PURE__ */ jsx(Link, {
												href: route("community.show", community.name),
												className: "w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-blue-500 hover:bg-blue-400 transition-all active:scale-95 shadow-sm",
												children: "View Community"
											})
										})]
									}, community.id))
								}) : /* @__PURE__ */ jsxs("div", {
									className: "p-8 sm:p-10 flex flex-col items-center justify-center text-center",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4",
											children: /* @__PURE__ */ jsx(Users, { className: "w-7 h-7 sm:w-8 sm:h-8 text-slate-400 dark:text-zinc-500" })
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-slate-900 dark:text-white font-bold text-base sm:text-lg mb-1",
											children: "No communities yet"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm font-medium text-slate-500 dark:text-zinc-400 mb-5",
											children: "You haven't created any communities."
										}),
										/* @__PURE__ */ jsx(Link, {
											href: route("community.create"),
											className: "px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-extrabold rounded-full transition-all shadow-md active:scale-95",
											children: "Create Community"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsx("section", {
								className: "md:hidden pb-24",
								children: /* @__PURE__ */ jsx("div", {
									className: "bg-white dark:bg-zinc-900 rounded-2xl border border-rose-100 dark:border-rose-500/20 shadow-sm overflow-hidden",
									children: /* @__PURE__ */ jsxs("div", {
										className: "p-5",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 mb-3",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ jsx(LogOut, {
													size: 20,
													className: "text-rose-500"
												})
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "font-bold text-sm text-slate-900 dark:text-white",
												children: "Sign Out"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 dark:text-zinc-400",
												children: "You will be logged out of your account."
											})] })]
										}), /* @__PURE__ */ jsxs(Link, {
											href: route("logout"),
											method: "post",
											as: "button",
											className: "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full text-sm font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 transition-all active:scale-[0.98]",
											children: [/* @__PURE__ */ jsx(LogOut, { size: 16 }), " Sign Out of Account"]
										})]
									})
								})
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-around px-2 py-2",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: "#profile",
							className: "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
							children: [/* @__PURE__ */ jsx(User, {
								size: 20,
								strokeWidth: 2.5
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-extrabold",
								children: "Profile"
							})]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: "#listings",
							className: "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-slate-500 dark:text-zinc-400",
							children: [/* @__PURE__ */ jsx(Building, { size: 20 }), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold",
								children: "Listings"
							})]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: "#communities",
							className: "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-slate-500 dark:text-zinc-400",
							children: [/* @__PURE__ */ jsx(Users, { size: 20 }), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold",
								children: "Communities"
							})]
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-slate-500 dark:text-zinc-400",
							children: [/* @__PURE__ */ jsx(Home, { size: 20 }), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold",
								children: "Home"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Dashboard as default };
