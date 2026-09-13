import { n as InputError, t as TextInput_default } from "./TextInput-GsuN0-GW.js";
import { t as InputLabel } from "./InputLabel-DfMUv3XY.js";
import { t as PrimaryButton } from "./PrimaryButton-C4V4SG2V.js";
import { t as GuestLayout } from "./GuestLayout-Babcn4bo.js";
import { Head, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Auth/ResetPassword.jsx
function ResetPassword({ token, email }) {
	const { data, setData, post, processing, errors, reset } = useForm({
		token,
		email,
		password: "",
		password_confirmation: ""
	});
	const submit = (e) => {
		e.preventDefault();
		post(route("password.store"), { onFinish: () => reset("password", "password_confirmation") });
	};
	return /* @__PURE__ */ jsxs(GuestLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Reset Password" }), /* @__PURE__ */ jsxs("form", {
		onSubmit: submit,
		children: [
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx(InputLabel, {
					htmlFor: "email",
					value: "Email"
				}),
				/* @__PURE__ */ jsx(TextInput_default, {
					id: "email",
					type: "email",
					name: "email",
					value: data.email,
					className: "mt-1 block w-full",
					autoComplete: "username",
					onChange: (e) => setData("email", e.target.value)
				}),
				/* @__PURE__ */ jsx(InputError, {
					message: errors.email,
					className: "mt-2"
				})
			] }),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ jsx(InputLabel, {
						htmlFor: "password",
						value: "Password"
					}),
					/* @__PURE__ */ jsx(TextInput_default, {
						id: "password",
						type: "password",
						name: "password",
						value: data.password,
						className: "mt-1 block w-full",
						autoComplete: "new-password",
						isFocused: true,
						onChange: (e) => setData("password", e.target.value)
					}),
					/* @__PURE__ */ jsx(InputError, {
						message: errors.password,
						className: "mt-2"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ jsx(InputLabel, {
						htmlFor: "password_confirmation",
						value: "Confirm Password"
					}),
					/* @__PURE__ */ jsx(TextInput_default, {
						type: "password",
						id: "password_confirmation",
						name: "password_confirmation",
						value: data.password_confirmation,
						className: "mt-1 block w-full",
						autoComplete: "new-password",
						onChange: (e) => setData("password_confirmation", e.target.value)
					}),
					/* @__PURE__ */ jsx(InputError, {
						message: errors.password_confirmation,
						className: "mt-2"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-4 flex items-center justify-end",
				children: /* @__PURE__ */ jsx(PrimaryButton, {
					className: "ms-4",
					disabled: processing,
					children: "Reset Password"
				})
			})
		]
	})] });
}
//#endregion
export { ResetPassword as default };
