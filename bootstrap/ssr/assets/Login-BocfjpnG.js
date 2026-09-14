import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowRight, CheckCircle2, Lock, Mail, Sparkles } from "lucide-react";
//#region resources/js/Pages/Auth/Login.jsx
function Login({ status, canResetPassword }) {
	const { data, setData, post, processing, errors, reset } = useForm({
		email: "",
		password: "",
		remember: false
	});
	const submit = (e) => {
		e.preventDefault();
		post(route("login"), { onFinish: () => reset("password") });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen flex bg-white dark:bg-[#09090b] font-sans selection:bg-blue-500/30",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Sign In | CoachingInSikar" }),
			/* @__PURE__ */ jsx("div", {
				className: "w-full lg:w-1/2 flex flex-col px-6 sm:px-12 lg:px-24 xl:px-32 relative z-10 pt-8 pb-6 lg:py-0 lg:min-h-screen lg:justify-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-md w-full mx-auto",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-6 animate-fade-in-down",
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
									children: "Welcome back"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-slate-500 dark:text-zinc-400 text-sm sm:text-base",
									children: "Enter your credentials to access your account"
								})
							]
						}),
						status && /* @__PURE__ */ jsxs("div", {
							className: "mb-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }), status]
						}),
						/* @__PURE__ */ jsxs("form", {
							className: "space-y-5",
							onSubmit: submit,
							children: [
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
											required: true,
											autoFocus: true
										})]
									}),
									errors.email && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-xs font-semibold text-rose-500",
										children: errors.email
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-bold text-slate-700 dark:text-zinc-300",
											children: "Password"
										}), canResetPassword && /* @__PURE__ */ jsx(Link, {
											href: route("password.request"),
											className: "text-xs font-bold text-slate-500 hover:text-amber-600 dark:hover:text-amber-500 transition-colors",
											children: "Forgot password?"
										})]
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
								] }),
								/* @__PURE__ */ jsx("div", {
									className: "flex items-center",
									children: /* @__PURE__ */ jsxs("label", {
										className: "flex items-center gap-2 cursor-pointer group",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "relative flex items-center",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: data.remember,
												onChange: (e) => setData("remember", e.target.checked),
												className: "peer sr-only"
											}), /* @__PURE__ */ jsx("div", {
												className: "w-5 h-5 border-2 border-slate-300 dark:border-zinc-700 rounded bg-slate-100 dark:bg-zinc-800/80 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors flex items-center justify-center",
												children: /* @__PURE__ */ jsx("svg", {
													className: "w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity",
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: "3",
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M5 13l4 4L19 7"
													})
												})
											})]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-sm font-medium text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200 transition-colors",
											children: "Remember me"
										})]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2",
									children: /* @__PURE__ */ jsxs("button", {
										type: "submit",
										disabled: processing,
										className: "group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-full text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20 overflow-hidden",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "relative z-10 flex items-center gap-2",
											children: [processing ? "Signing in..." : "Sign In", !processing && /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })]
										}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-black/5 to-transparent z-0 pointer-events-none" })]
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-5 text-center text-sm font-medium text-slate-500 dark:text-zinc-400",
							children: [
								"Don't have an account?",
								" ",
								/* @__PURE__ */ jsx(Link, {
									href: route("register"),
									className: "font-bold text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors decoration-2 hover:underline underline-offset-4",
									children: "Sign up for free"
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
						style: { backgroundImage: `url('https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1740')` }
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-600/80 via-indigo-700/80 to-purple-800/90 mix-blend-multiply" }),
					/* @__PURE__ */ jsxs("div", {
						className: "relative z-10 w-full p-12 flex flex-col justify-between",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold shadow-xl",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-amber-300" }), /* @__PURE__ */ jsx("span", { children: "100k+ Active Students" })]
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-auto max-w-lg",
							children: /* @__PURE__ */ jsxs("div", {
								className: "bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex gap-1 mb-4",
										children: [
											1,
											2,
											3,
											4,
											5
										].map((i) => /* @__PURE__ */ jsx("svg", {
											className: "w-5 h-5 text-amber-400 fill-amber-400",
											viewBox: "0 0 20 20",
											children: /* @__PURE__ */ jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
										}, i))
									}),
									/* @__PURE__ */ jsx("blockquote", {
										className: "text-xl sm:text-2xl font-bold text-white leading-tight mb-6",
										children: "\"CoachingInSikar completely transformed my preparation journey. The verified reviews helped me find the perfect institute!\""
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ jsx("img", {
											src: "https://i.pravatar.cc/100?img=32",
											alt: "User",
											width: "48",
											height: "48",
											className: "w-12 h-12 rounded-full border-2 border-white/30"
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "font-bold text-white",
											children: "Priya Sharma"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-blue-200 text-sm font-medium",
											children: "NEET Aspirant"
										})] })]
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
export { Login as default };
