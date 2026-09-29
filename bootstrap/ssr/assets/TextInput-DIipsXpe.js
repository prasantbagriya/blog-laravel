import { jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
//#region resources/js/Components/InputError.jsx
function InputError({ message, className = "", ...props }) {
	return message ? /* @__PURE__ */ jsx("p", {
		...props,
		className: "text-sm text-red-600 " + className,
		children: message
	}) : null;
}
//#endregion
//#region resources/js/Components/InputLabel.jsx
function InputLabel({ value, className = "", children, ...props }) {
	return /* @__PURE__ */ jsx("label", {
		...props,
		className: `block text-sm font-medium text-gray-700 ` + className,
		children: value ? value : children
	});
}
//#endregion
//#region resources/js/Components/TextInput.jsx
var TextInput_default = forwardRef(function TextInput({ type = "text", className = "", isFocused = false, ...props }, ref) {
	const localRef = useRef(null);
	useImperativeHandle(ref, () => ({ focus: () => localRef.current?.focus() }));
	useEffect(() => {
		if (isFocused) localRef.current?.focus();
	}, [isFocused]);
	return /* @__PURE__ */ jsx("input", {
		...props,
		type,
		className: "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " + className,
		ref: localRef
	});
});
//#endregion
export { InputLabel as n, InputError as r, TextInput_default as t };
