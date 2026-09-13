import { t as Navbar } from "./GlobalNavbar-dTNI2462.js";
import { t as BlogFooter } from "./BlogFooter-L7SI1qpL.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { BookOpen, ChevronRight, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
//#region resources/js/Pages/Static/About.jsx
function About() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-slate-50 dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex flex-col transition-colors duration-300",
		children: [
			/* @__PURE__ */ jsxs(Head, { children: [/* @__PURE__ */ jsx("title", { children: "About Us | Coaching Sikar" }), /* @__PURE__ */ jsx("meta", {
				name: "description",
				content: "Learn about Coaching Sikar, the premier platform for finding the best coaching institutes and educational resources in Sikar."
			})] }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-grow pt-24 lg:pt-32 pb-16 lg:pb-24",
				children: [
					/* @__PURE__ */ jsx("section", {
						className: "px-4 sm:px-6 lg:px-8 mb-16 lg:mb-24",
						children: /* @__PURE__ */ jsx("div", {
							className: "max-w-7xl mx-auto",
							children: /* @__PURE__ */ jsxs("div", {
								className: "bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-zinc-800 relative",
								children: [
									/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" }),
									/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" }),
									/* @__PURE__ */ jsxs("div", {
										className: "grid lg:grid-cols-2 gap-12 items-center relative z-10 p-8 sm:p-12 lg:p-16",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsxs("div", {
												className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 border border-blue-100 dark:border-blue-800/30",
												children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }), " Our Story"]
											}),
											/* @__PURE__ */ jsxs("h1", {
												className: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white",
												children: [
													"Empowering ",
													/* @__PURE__ */ jsx("span", {
														className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-500",
														children: "Students"
													}),
													" to Make the Right Choice."
												]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-lg sm:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed mb-8",
												children: "Coaching Sikar was born out of a simple idea: every student deserves access to transparent, authentic, and comprehensive information about their educational options in Sikar, the emerging education hub of India."
											}),
											/* @__PURE__ */ jsx("div", {
												className: "flex flex-wrap items-center gap-4",
												children: /* @__PURE__ */ jsxs(Link, {
													href: "/reviews",
													className: "px-8 py-3.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 group",
													children: ["Explore Institutes ", /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 group-hover:translate-x-1 transition-transform" })]
												})
											})
										] }), /* @__PURE__ */ jsx("div", {
											className: "hidden lg:block",
											children: /* @__PURE__ */ jsx("img", {
												src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
												alt: "Students learning",
												className: "w-full h-full object-cover rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-white/20"
											})
										})]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-center max-w-3xl mx-auto mb-16",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6",
								children: "Our Mission & Values"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-lg text-slate-600 dark:text-zinc-400",
								children: "We are building a community-driven ecosystem where verified data meets genuine student experiences, ensuring you never have to guess when it comes to your future."
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-8",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
											children: /* @__PURE__ */ jsx(Target, { className: "w-7 h-7 text-blue-600 dark:text-blue-400" })
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
											children: "Clear Guidance"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-slate-600 dark:text-zinc-400 leading-relaxed",
											children: "Providing crystal-clear insights into coaching institutes, their fee structures, and success rates."
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
											children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-7 h-7 text-amber-600 dark:text-amber-400" })
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
											children: "Verified Reviews"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-slate-600 dark:text-zinc-400 leading-relaxed",
											children: "Every review and rating on our platform is cross-checked to ensure authenticity and trust."
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
											children: /* @__PURE__ */ jsx(Users, { className: "w-7 h-7 text-emerald-600 dark:text-emerald-400" })
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
											children: "Student Community"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-slate-600 dark:text-zinc-400 leading-relaxed",
											children: "A thriving space for students to ask doubts, share resources, and support each other."
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
											children: /* @__PURE__ */ jsx(BookOpen, { className: "w-7 h-7 text-purple-600 dark:text-purple-400" })
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
											children: "Comprehensive Data"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-slate-600 dark:text-zinc-400 leading-relaxed",
											children: "From syllabus deep-dives to cut-off analyses, we cover every aspect of exam preparation."
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx("section", {
						className: "px-4 sm:px-6 lg:px-8 mt-20 max-w-4xl mx-auto",
						children: /* @__PURE__ */ jsxs("div", {
							className: "bg-blue-600 rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl",
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" }),
								/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" }),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl sm:text-4xl font-extrabold text-white mb-6 relative z-10",
									children: "Ready to start your journey?"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10",
									children: "Join thousands of students who are already using Coaching Sikar to make informed decisions about their career."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row justify-center gap-4 relative z-10",
									children: [/* @__PURE__ */ jsx(Link, {
										href: "/register",
										className: "px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg",
										children: "Create Free Account"
									}), /* @__PURE__ */ jsx(Link, {
										href: "/feed",
										className: "px-8 py-4 bg-blue-700 text-white font-bold rounded-full hover:bg-blue-800 transition-colors border border-blue-500",
										children: "Join Community"
									})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { About as default };
