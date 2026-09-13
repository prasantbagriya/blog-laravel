import { n as InputError, t as TextInput_default } from "./TextInput-GsuN0-GW.js";
import { t as InputLabel } from "./InputLabel-DfMUv3XY.js";
import { useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
//#region resources/js/Components/Modal.jsx
function Modal({ children, show = false, maxWidth = "2xl", closeable = true, onClose = () => {} }) {
	const close = () => {
		if (closeable) onClose();
	};
	const maxWidthClass = {
		sm: "sm:max-w-sm",
		md: "sm:max-w-md",
		lg: "sm:max-w-lg",
		xl: "sm:max-w-xl",
		"2xl": "sm:max-w-2xl"
	}[maxWidth];
	return /* @__PURE__ */ jsx(Transition, {
		show,
		leave: "duration-200",
		children: /* @__PURE__ */ jsxs(Dialog, {
			as: "div",
			id: "modal",
			className: "fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0",
			onClose: close,
			children: [/* @__PURE__ */ jsx(TransitionChild, {
				enter: "ease-out duration-300",
				enterFrom: "opacity-0",
				enterTo: "opacity-100",
				leave: "ease-in duration-200",
				leaveFrom: "opacity-100",
				leaveTo: "opacity-0",
				children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gray-500/75" })
			}), /* @__PURE__ */ jsx(TransitionChild, {
				enter: "ease-out duration-300",
				enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
				enterTo: "opacity-100 translate-y-0 sm:scale-100",
				leave: "ease-in duration-200",
				leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
				leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
				children: /* @__PURE__ */ jsx(DialogPanel, {
					className: `mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full ${maxWidthClass}`,
					children
				})
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/Profile/Partials/DeleteUserForm.jsx
function DeleteUserForm({ className = "" }) {
	const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
	const passwordInput = useRef();
	const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: "" });
	const confirmUserDeletion = () => {
		setConfirmingUserDeletion(true);
	};
	const deleteUser = (e) => {
		e.preventDefault();
		destroy(route("profile.destroy"), {
			preserveScroll: true,
			onSuccess: () => closeModal(),
			onError: () => passwordInput.current.focus(),
			onFinish: () => reset()
		});
	};
	const closeModal = () => {
		setConfirmingUserDeletion(false);
		clearErrors();
		reset();
	};
	return /* @__PURE__ */ jsxs("section", {
		className: `space-y-6 ${className}`,
		children: [
			/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-lg font-bold text-[#1A1A1A] dark:text-white",
				children: "Delete Account"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-[#555555] dark:text-[#A0A09C]",
				children: "Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain."
			})] }),
			/* @__PURE__ */ jsx("button", {
				onClick: confirmUserDeletion,
				className: "inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150",
				children: "Delete Account"
			}),
			/* @__PURE__ */ jsx(Modal, {
				show: confirmingUserDeletion,
				onClose: closeModal,
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: deleteUser,
					className: "p-6 bg-white dark:bg-[#161615]",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-bold text-[#1A1A1A] dark:text-white",
							children: "Are you sure you want to delete your account?"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-[#555555] dark:text-[#A0A09C]",
							children: "Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6",
							children: [
								/* @__PURE__ */ jsx(InputLabel, {
									htmlFor: "password",
									value: "Password",
									className: "sr-only"
								}),
								/* @__PURE__ */ jsx(TextInput_default, {
									id: "password",
									type: "password",
									name: "password",
									ref: passwordInput,
									value: data.password,
									onChange: (e) => setData("password", e.target.value),
									className: "mt-1 block w-3/4 bg-white dark:bg-black border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:border-red-500 focus:ring-red-500",
									isFocused: true,
									placeholder: "Password"
								}),
								/* @__PURE__ */ jsx(InputError, {
									message: errors.password,
									className: "mt-2"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex justify-end",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: closeModal,
								className: "inline-flex items-center px-4 py-2 bg-white dark:bg-[#2A2A28] border border-[#E5E5E1] dark:border-gray-600 rounded-lg font-semibold text-xs text-[#1A1A1A] dark:text-white uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0052FF] focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								disabled: processing,
								className: "ms-3 inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50",
								children: "Delete Account"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { DeleteUserForm as default };
