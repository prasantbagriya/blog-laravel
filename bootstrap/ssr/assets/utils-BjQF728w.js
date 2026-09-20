import { jsx } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/HomeComponents/utils.jsx
var Link = ({ href, children, ...props }) => /* @__PURE__ */ jsx("a", {
	href,
	...props,
	children
});
var navigate = (url) => window.location.assign(url);
var postHomeAction = async (url, data = {}) => {
	const csrfToken = document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content");
	const response = await fetch(url, {
		method: "POST",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"X-Requested-With": "XMLHttpRequest",
			...csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}
		},
		body: JSON.stringify(data)
	});
	if (response.redirected) {
		navigate(response.url);
		return;
	}
	if (response.ok) window.location.reload();
};
var Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, className, ...props }) => {
	return /* @__PURE__ */ jsx("img", {
		src,
		alt,
		style: fill ? {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			width: "100%",
			height: "100%",
			...style
		} : style,
		sizes,
		fetchPriority: priority ? "high" : fetchPriority || "auto",
		loading: priority ? "eager" : "lazy",
		decoding: priority ? "sync" : "async",
		className,
		...props
	});
};
//#endregion
export { Image, Link, navigate, postHomeAction };
