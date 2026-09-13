import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
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
		className: "min-h-screen bg-[#F5F5F2] dark:bg-[#161615] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors selection:bg-[#0052FF]/30",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Sign In | CoachingInSikar" }),
			/* @__PURE__ */ jsxs("div", {
				className: "sm:mx-auto sm:w-full sm:max-w-md",
				children: [
					/* @__PURE__ */ jsxs(Link, {
						href: "/",
						className: "flex justify-center items-center gap-2 mb-6 group",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 rounded-xl bg-[#0052FF] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform",
							children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-white" })
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xl font-bold text-[#1A1A1A] dark:text-white tracking-tight",
							children: "CoachingInSikar"
						})]
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-2 text-center text-3xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight",
						children: "Welcome back"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-center text-sm text-[#555555] dark:text-[#A0A09C]",
						children: "Sign in to your account to continue"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white dark:bg-[#20201F] py-8 px-4 shadow-xl shadow-black/5 dark:shadow-black/20 sm:rounded-2xl sm:px-10 border border-[#E5E5E1] dark:border-[#2A2A28]",
					children: [
						status && /* @__PURE__ */ jsx("div", {
							className: "mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm font-medium text-center",
							children: status
						}),
						/* @__PURE__ */ jsxs("form", {
							className: "space-y-6",
							onSubmit: submit,
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] mb-1.5",
										children: "Email address"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx("div", {
											className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
											children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-gray-400 dark:text-gray-500 stroke-[1.5]" })
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											value: data.email,
											onChange: (e) => setData("email", e.target.value),
											className: "block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#3A3A38] rounded-lg text-sm text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all",
											placeholder: "you@example.com",
											required: true,
											autoFocus: true
										})]
									}),
									errors.email && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-sm font-medium text-red-500",
										children: errors.email
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F2]",
											children: "Password"
										}), canResetPassword && /* @__PURE__ */ jsx(Link, {
											href: route("password.request"),
											className: "text-xs font-semibold text-[#0052FF] hover:text-[#0040D0] transition-colors",
											children: "Forgot password?"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx("div", {
											className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
											children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-gray-400 dark:text-gray-500 stroke-[1.5]" })
										}), /* @__PURE__ */ jsx("input", {
											type: "password",
											value: data.password,
											onChange: (e) => setData("password", e.target.value),
											className: "block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#3A3A38] rounded-lg text-sm text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all",
											placeholder: "••••••••",
											required: true
										})]
									}),
									errors.password && /* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-sm font-medium text-red-500",
										children: errors.password
									})
								] }),
								/* @__PURE__ */ jsx("div", {
									className: "flex items-center justify-between",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center",
										children: [/* @__PURE__ */ jsx("input", {
											id: "remember-me",
											type: "checkbox",
											checked: data.remember,
											onChange: (e) => setData("remember", e.target.checked),
											className: "h-4 w-4 rounded border-[#E5E5E1] dark:border-[#3A3A38] text-[#0052FF] focus:ring-[#0052FF] bg-white dark:bg-[#161615] transition-all cursor-pointer"
										}), /* @__PURE__ */ jsx("label", {
											htmlFor: "remember-me",
											className: "ml-2 block text-sm font-medium text-[#555555] dark:text-[#A0A09C] cursor-pointer",
											children: "Remember me"
										})]
									})
								}),
								/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("button", {
									type: "submit",
									disabled: processing,
									className: "group w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#1A1A1A] hover:bg-black dark:bg-white dark:text-[#1A1A1A] dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1A1A] disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]",
									children: [processing ? "Signing in..." : "Sign In", !processing && /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-0.5 transition-transform" })]
								}) })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 text-center text-sm text-[#555555] dark:text-[#A0A09C]",
							children: [
								"Don't have an account?",
								" ",
								/* @__PURE__ */ jsx(Link, {
									href: route("register"),
									className: "font-bold text-[#1A1A1A] dark:text-white hover:text-[#0052FF] dark:hover:text-[#80B0FF] transition-colors",
									children: "Sign up for free"
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Login as default };
