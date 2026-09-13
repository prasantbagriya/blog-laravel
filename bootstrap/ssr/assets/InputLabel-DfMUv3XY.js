import { jsx } from "react/jsx-runtime";
//#region resources/js/Components/InputLabel.jsx
function InputLabel({ value, className = "", children, ...props }) {
	return /* @__PURE__ */ jsx("label", {
		...props,
		className: `block text-sm font-medium text-gray-700 ` + className,
		children: value ? value : children
	});
}
//#endregion
export { InputLabel as t };
