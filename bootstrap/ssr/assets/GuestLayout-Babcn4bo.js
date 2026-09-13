import { t as ApplicationLogo } from "./ApplicationLogo-BLhD_Ngm.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Layouts/GuestLayout.jsx
function GuestLayout({ children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0",
		children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, {
			href: (typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "") + "/",
			children: /* @__PURE__ */ jsx(ApplicationLogo, { className: "h-20 w-20 fill-current text-gray-500" })
		}) }), /* @__PURE__ */ jsx("div", {
			className: "mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg",
			children
		})]
	});
}
//#endregion
export { GuestLayout as t };
