import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowRight, Lock, Mail, Sparkles, User } from "lucide-react";
//#region resources/js/Pages/Auth/Register.jsx
function Register() {
	const { data, setData, post, processing, errors, reset } = useForm({
		name: "",
		email: "",
		password: "",
		password_confirmation: ""
	});
	const submit = (e) => {
		e.preventDefault();
		post(route("register"), { onFinish: () => reset("password", "password_confirmation") });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen flex bg-white dark:bg-[#09090b] font-sans selection:bg-blue-500/30",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Sign Up | CoachingInSikar" }),
			/* @__PURE__ */ jsx("div", {
				className: "w-full lg:w-1/2 flex flex-col px-6 sm:px-12 lg:px-24 xl:px-32 relative z-10 pt-8 pb-6 lg:py-0 lg:min-h-screen lg:justify-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-md w-full mx-auto",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-5 animate-fade-in-down",
							children: [
								/* @__PURE__ */ jsxs(Link, {
									href: "/",
									className: "inline-flex items-center gap-3 mb-4 group decoration-transparent",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden",
										children: /* @__PURE__ */ jsx("img", {
											src: "/uploads/logo.webp",
											alt: "Coaching Sikar Logo",
											width: "40",
											height: "40",
											className: "w-full h-full object-cover"
										})
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xl font-extrabold text-slate-900 dark:text-white tracking-tighter",
										children: "Coaching Sikar"
									})]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2",
									children: "Create an account"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-slate-500 dark:text-zinc-400 text-sm sm:text-base",
									children: "Join our community of reviewers and students"
								})
							]
						}),
						/* @__PURE__ */ jsxs("form", {
							className: "space-y-4",
							onSubmit: submit,
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
										children: "Full Name"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative group",
										children: [/* @__PURE__ */ jsx("div", {
											className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
											children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: data.name,
											onChange: (e) => setData("name", e.target.value),
											className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500",
											placeholder: "John Doe",
											required: true,
											autoFocus: true
										})]
									}),
									errors.name && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-xs font-semibold text-rose-500",
										children: errors.name
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
										children: "Email Address"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative group",
										children: [/* @__PURE__ */ jsx("div", {
											className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
											children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											value: data.email,
											onChange: (e) => setData("email", e.target.value),
											className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500",
											placeholder: "you@example.com",
											required: true
										})]
									}),
									errors.email && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-xs font-semibold text-rose-500",
										children: errors.email
									})
								] }),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
											children: "Password"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative group",
											children: [/* @__PURE__ */ jsx("div", {
												className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
												children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
											}), /* @__PURE__ */ jsx("input", {
												type: "password",
												value: data.password,
												onChange: (e) => setData("password", e.target.value),
												className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500",
												placeholder: "••••••••",
												required: true
											})]
										}),
										errors.password && /* @__PURE__ */ jsx("p", {
											className: "mt-1.5 text-xs font-semibold text-rose-500",
											children: errors.password
										})
									] }), /* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
											children: "Confirm"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative group",
											children: [/* @__PURE__ */ jsx("div", {
												className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
												children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
											}), /* @__PURE__ */ jsx("input", {
												type: "password",
												value: data.password_confirmation,
												onChange: (e) => setData("password_confirmation", e.target.value),
												className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500",
												placeholder: "••••••••",
												required: true
											})]
										}),
										errors.password_confirmation && /* @__PURE__ */ jsx("p", {
											className: "mt-1.5 text-xs font-semibold text-rose-500",
											children: errors.password_confirmation
										})
									] })]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-4",
									children: /* @__PURE__ */ jsxs("button", {
										type: "submit",
										disabled: processing,
										className: "group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-full text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20 overflow-hidden",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "relative z-10 flex items-center gap-2",
											children: [processing ? "Creating account..." : "Create Account", !processing && /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })]
										}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-black/5 to-transparent z-0 pointer-events-none" })]
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-5 text-center text-sm font-medium text-slate-500 dark:text-zinc-400 pb-4 lg:pb-0",
							children: [
								"Already have an account?",
								" ",
								/* @__PURE__ */ jsx(Link, {
									href: route("login"),
									className: "font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors decoration-2 hover:underline underline-offset-4",
									children: "Sign in here"
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity",
						style: { backgroundImage: `url('/uploads/aboutus.webp')` },
						role: "img",
						"aria-label": "About Us Background"
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-700/80 to-purple-800/90 mix-blend-multiply" }),
					/* @__PURE__ */ jsxs("div", {
						className: "relative z-10 w-full p-12 flex flex-col justify-between",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold shadow-xl",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-amber-300" }), /* @__PURE__ */ jsx("span", { children: "Join the top 1%" })]
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-auto max-w-lg",
							children: /* @__PURE__ */ jsxs("div", {
								className: "bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl",
								children: [
									/* @__PURE__ */ jsx("h3", {
										className: "text-2xl font-extrabold text-white mb-3",
										children: "Discover the Best Institutes"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-blue-100 text-lg leading-relaxed mb-6 font-medium",
										children: "\"Our verified reviews and AI-driven insights ensure you make the right choice for your career.\""
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-[-10px]",
										children: [
											/* @__PURE__ */ jsx("img", {
												src: "https://i.pravatar.cc/100?img=1",
												width: "40",
												height: "40",
												className: "w-10 h-10 rounded-full border-2 border-white/40 -ml-0 relative z-30",
												alt: "avatar"
											}),
											/* @__PURE__ */ jsx("img", {
												src: "https://i.pravatar.cc/100?img=2",
												width: "40",
												height: "40",
												className: "w-10 h-10 rounded-full border-2 border-white/40 -ml-3 relative z-20",
												alt: "avatar"
											}),
											/* @__PURE__ */ jsx("img", {
												src: "https://i.pravatar.cc/100?img=3",
												width: "40",
												height: "40",
												className: "w-10 h-10 rounded-full border-2 border-white/40 -ml-3 relative z-10",
												alt: "avatar"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "w-10 h-10 rounded-full border-2 border-white/40 -ml-3 relative z-0 bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white",
												children: "+5k"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "ml-4 text-sm font-bold text-white",
												children: "Trusted by thousands"
											})
										]
									})
								]
							})
						})]
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 -right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" }),
					/* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 -left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" })
				]
			}),
			/* @__PURE__ */ jsx("style", { children: `
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            ` })
		]
	});
}
//#endregion
export { Register as default };
