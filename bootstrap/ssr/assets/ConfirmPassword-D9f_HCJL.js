import { n as InputLabel, r as InputError, t as TextInput_default } from "./TextInput-DIipsXpe.js";
import { t as PrimaryButton } from "./PrimaryButton-C4V4SG2V.js";
import { t as GuestLayout } from "./GuestLayout-Babcn4bo.js";
import { Head, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Auth/ConfirmPassword.jsx
function ConfirmPassword() {
	const { data, setData, post, processing, errors, reset } = useForm({ password: "" });
	const submit = (e) => {
		e.preventDefault();
		post(route("password.confirm"), { onFinish: () => reset("password") });
	};
	return /* @__PURE__ */ jsxs(GuestLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Confirm Password" }),
		/* @__PURE__ */ jsx("div", {
			className: "mb-4 text-sm text-gray-600",
			children: "This is a secure area of the application. Please confirm your password before continuing."
		}),
		/* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			children: [/* @__PURE__ */ jsxs("div", {
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
						isFocused: true,
						onChange: (e) => setData("password", e.target.value)
					}),
					/* @__PURE__ */ jsx(InputError, {
						message: errors.password,
						className: "mt-2"
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-4 flex items-center justify-end",
				children: /* @__PURE__ */ jsx(PrimaryButton, {
					className: "ms-4",
					disabled: processing,
					children: "Confirm"
				})
			})]
		})
	] });
}
//#endregion
export { ConfirmPassword as default };
