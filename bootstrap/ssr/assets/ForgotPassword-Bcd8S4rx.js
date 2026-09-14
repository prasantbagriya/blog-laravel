import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
//#region resources/js/Pages/Auth/ForgotPassword.jsx
function ForgotPassword({ status }) {
	const { data, setData, post, processing, errors } = useForm({ email: "" });
	const submit = (e) => {
		e.preventDefault();
		post(route("password.email"));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen flex items-center justify-center bg-white dark:bg-[#09090b] font-sans px-6 py-12",
		children: [/* @__PURE__ */ jsx(Head, { title: "Forgot Password | CoachingInSikar" }), /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					href: "/",
					className: "inline-flex items-center gap-3 mb-8 group decoration-transparent",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden border border-slate-100 dark:border-zinc-800",
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
				/* @__PURE__ */ jsxs("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2",
						children: "Forgot password?"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-slate-500 dark:text-zinc-400 text-sm leading-relaxed",
						children: "No problem. Enter your email address and we'll send you a password reset link."
					})]
				}),
				status && /* @__PURE__ */ jsxs("div", {
					className: "mb-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }), status]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "space-y-5",
					children: [/* @__PURE__ */ jsxs("div", { children: [
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
								id: "email",
								type: "email",
								name: "email",
								value: data.email,
								onChange: (e) => setData("email", e.target.value),
								className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border-0 outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800",
								placeholder: "you@example.com",
								required: true,
								autoFocus: true
							})]
						}),
						errors.email && /* @__PURE__ */ jsx("p", {
							className: "mt-1.5 text-xs font-semibold text-rose-500",
							children: errors.email
						})
					] }), /* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: processing,
						className: "group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-full text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-amber-500/20",
						children: [processing ? "Sending..." : "Send Reset Link", !processing && /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-1 transition-transform" })]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 text-center",
					children: /* @__PURE__ */ jsxs(Link, {
						href: route("login"),
						className: "inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Sign In"]
					})
				})
			]
		})]
	});
}
//#endregion
export { ForgotPassword as default };
