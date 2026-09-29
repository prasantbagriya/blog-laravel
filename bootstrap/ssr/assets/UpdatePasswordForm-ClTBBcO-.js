import { n as InputLabel, r as InputError, t as TextInput_default } from "./TextInput-DIipsXpe.js";
import "./PrimaryButton-C4V4SG2V.js";
import { useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { Transition } from "@headlessui/react";
//#region resources/js/Pages/Profile/Partials/UpdatePasswordForm.jsx
function UpdatePasswordForm({ className = "" }) {
	const passwordInput = useRef();
	const currentPasswordInput = useRef();
	const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
		current_password: "",
		password: "",
		password_confirmation: ""
	});
	const updatePassword = (e) => {
		e.preventDefault();
		put(route("password.update"), {
			preserveScroll: true,
			onSuccess: () => reset(),
			onError: (errors) => {
				if (errors.password) {
					reset("password", "password_confirmation");
					passwordInput.current.focus();
				}
				if (errors.current_password) {
					reset("current_password");
					currentPasswordInput.current.focus();
				}
			}
		});
	};
	return /* @__PURE__ */ jsxs("section", {
		className,
		children: [/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h2", {
			className: "text-lg font-bold text-[#1A1A1A] dark:text-white",
			children: "Update Password"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-sm text-[#555555] dark:text-[#A0A09C]",
			children: "Ensure your account is using a long, random password to stay secure."
		})] }), /* @__PURE__ */ jsxs("form", {
			onSubmit: updatePassword,
			className: "mt-6 space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(InputLabel, {
						htmlFor: "current_password",
						value: "Current Password",
						className: "text-[#1A1A1A] dark:text-white"
					}),
					/* @__PURE__ */ jsx(TextInput_default, {
						id: "current_password",
						ref: currentPasswordInput,
						value: data.current_password,
						onChange: (e) => setData("current_password", e.target.value),
						type: "password",
						className: "mt-1 block w-full bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-[#0052FF] focus:ring-[#0052FF]",
						autoComplete: "current-password"
					}),
					/* @__PURE__ */ jsx(InputError, {
						message: errors.current_password,
						className: "mt-2"
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(InputLabel, {
						htmlFor: "password",
						value: "New Password",
						className: "text-[#1A1A1A] dark:text-white"
					}),
					/* @__PURE__ */ jsx(TextInput_default, {
						id: "password",
						ref: passwordInput,
						value: data.password,
						onChange: (e) => setData("password", e.target.value),
						type: "password",
						className: "mt-1 block w-full bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-[#0052FF] focus:ring-[#0052FF]",
						autoComplete: "new-password"
					}),
					/* @__PURE__ */ jsx(InputError, {
						message: errors.password,
						className: "mt-2"
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(InputLabel, {
						htmlFor: "password_confirmation",
						value: "Confirm Password",
						className: "text-[#1A1A1A] dark:text-white"
					}),
					/* @__PURE__ */ jsx(TextInput_default, {
						id: "password_confirmation",
						value: data.password_confirmation,
						onChange: (e) => setData("password_confirmation", e.target.value),
						type: "password",
						className: "mt-1 block w-full bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-[#0052FF] focus:ring-[#0052FF]",
						autoComplete: "new-password"
					}),
					/* @__PURE__ */ jsx(InputError, {
						message: errors.password_confirmation,
						className: "mt-2"
					})
				] }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsx("button", {
						disabled: processing,
						className: "inline-flex items-center px-4 py-2 bg-[#0052FF] border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-[#0040CC] focus:bg-[#0040CC] active:bg-[#0033A0] focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50",
						children: "Save"
					}), /* @__PURE__ */ jsx(Transition, {
						show: recentlySuccessful,
						enter: "transition ease-in-out",
						enterFrom: "opacity-0",
						leave: "transition ease-in-out",
						leaveTo: "opacity-0",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-sm text-[#555555] dark:text-[#A0A09C]",
							children: "Saved."
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { UpdatePasswordForm as default };
