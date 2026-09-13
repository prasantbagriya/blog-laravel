import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowRight, Lock, Mail, ShieldCheck, User } from "lucide-react";
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
		className: "min-h-screen bg-[#F5F5F2] dark:bg-[#161615] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors selection:bg-[#0052FF]/30",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Sign Up | CoachingInSikar" }),
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
						children: "Create an account"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-center text-sm text-[#555555] dark:text-[#A0A09C]",
						children: "Join our community of reviewers and students"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white dark:bg-[#20201F] py-8 px-4 shadow-xl shadow-black/5 dark:shadow-black/20 sm:rounded-2xl sm:px-10 border border-[#E5E5E1] dark:border-[#2A2A28]",
					children: [/* @__PURE__ */ jsxs("form", {
						className: "space-y-5",
						onSubmit: submit,
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] mb-1.5",
									children: "Full Name"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("div", {
										className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
										children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-gray-400 dark:text-gray-500 stroke-[1.5]" })
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.name,
										onChange: (e) => setData("name", e.target.value),
										className: "block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#3A3A38] rounded-lg text-sm text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all",
										placeholder: "John Doe",
										required: true,
										autoFocus: true
									})]
								}),
								errors.name && /* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-sm font-medium text-red-500",
									children: errors.name
								})
							] }),
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
										required: true
									})]
								}),
								errors.email && /* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-sm font-medium text-red-500",
									children: errors.email
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] mb-1.5",
									children: "Password"
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
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] mb-1.5",
									children: "Confirm Password"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("div", {
										className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
										children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-gray-400 dark:text-gray-500 stroke-[1.5]" })
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										value: data.password_confirmation,
										onChange: (e) => setData("password_confirmation", e.target.value),
										className: "block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#3A3A38] rounded-lg text-sm text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:border-[#0052FF] transition-all",
										placeholder: "••••••••",
										required: true
									})]
								}),
								errors.password_confirmation && /* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-sm font-medium text-red-500",
									children: errors.password_confirmation
								})
							] }),
							/* @__PURE__ */ jsx("div", {
								className: "pt-2",
								children: /* @__PURE__ */ jsxs("button", {
									type: "submit",
									disabled: processing,
									className: "group w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#0052FF] hover:bg-[#0040D0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]",
									children: [processing ? "Creating account..." : "Create Account", !processing && /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover:translate-x-0.5 transition-transform" })]
								})
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-8 text-center text-sm text-[#555555] dark:text-[#A0A09C]",
						children: [
							"Already have an account?",
							" ",
							/* @__PURE__ */ jsx(Link, {
								href: route("login"),
								className: "font-bold text-[#1A1A1A] dark:text-white hover:text-[#0052FF] dark:hover:text-[#80B0FF] transition-colors",
								children: "Sign in here"
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { Register as default };
