import { n as InputError, t as TextInput_default } from "./TextInput-GsuN0-GW.js";
import { t as InputLabel } from "./InputLabel-DfMUv3XY.js";
import "./PrimaryButton-C4V4SG2V.js";
import { Link, useForm, usePage } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Transition } from "@headlessui/react";
//#region resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx
function UpdateProfileInformation({ mustVerifyEmail, status, className = "" }) {
	const user = usePage().props.auth.user;
	const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
		name: user.name,
		email: user.email,
		flair: user.flair || ""
	});
	const submit = (e) => {
		e.preventDefault();
		patch(route("profile.update"));
	};
	return /* @__PURE__ */ jsxs("section", {
		className,
		children: [/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h2", {
			className: "text-lg font-bold text-[#1A1A1A] dark:text-white",
			children: "Profile Information"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-sm text-[#555555] dark:text-[#A0A09C]",
			children: "Update your account's profile information and email address."
		})] }), /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			className: "mt-6 space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(InputLabel, {
						htmlFor: "name",
						value: "Name",
						className: "text-[#1A1A1A] dark:text-white"
					}),
					/* @__PURE__ */ jsx(TextInput_default, {
						id: "name",
						className: "mt-1 block w-full bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-[#0052FF] focus:ring-[#0052FF]",
						value: data.name,
						onChange: (e) => setData("name", e.target.value),
						required: true,
						isFocused: true,
						autoComplete: "name"
					}),
					/* @__PURE__ */ jsx(InputError, {
						className: "mt-2",
						message: errors.name
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(InputLabel, {
						htmlFor: "email",
						value: "Email",
						className: "text-[#1A1A1A] dark:text-white"
					}),
					/* @__PURE__ */ jsx(TextInput_default, {
						id: "email",
						type: "email",
						className: "mt-1 block w-full bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-[#0052FF] focus:ring-[#0052FF]",
						value: data.email,
						onChange: (e) => setData("email", e.target.value),
						required: true,
						autoComplete: "username"
					}),
					/* @__PURE__ */ jsx(InputError, {
						className: "mt-2",
						message: errors.email
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(InputLabel, {
						htmlFor: "flair",
						value: "User Flair (Optional)",
						className: "text-[#1A1A1A] dark:text-white"
					}),
					/* @__PURE__ */ jsx(TextInput_default, {
						id: "flair",
						type: "text",
						className: "mt-1 block w-full bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-[#0052FF] focus:ring-[#0052FF]",
						value: data.flair,
						onChange: (e) => setData("flair", e.target.value),
						placeholder: "e.g. Laravel Expert, Designer, Moderator"
					}),
					/* @__PURE__ */ jsx(InputError, {
						className: "mt-2",
						message: errors.flair
					})
				] }),
				mustVerifyEmail && user.email_verified_at === null && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
					className: "mt-2 text-sm text-[#1A1A1A] dark:text-white",
					children: ["Your email address is unverified.", /* @__PURE__ */ jsx(Link, {
						href: route("verification.send"),
						method: "post",
						as: "button",
						className: "rounded-md text-sm text-[#0052FF] hover:text-[#0040CC] focus:outline-none",
						children: "Click here to re-send the verification email."
					})]
				}), status === "verification-link-sent" && /* @__PURE__ */ jsx("div", {
					className: "mt-2 text-sm font-medium text-green-600 dark:text-green-400",
					children: "A new verification link has been sent to your email address."
				})] }),
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
export { UpdateProfileInformation as default };
