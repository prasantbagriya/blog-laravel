import { jsx } from "react/jsx-runtime";
import React, { Suspense } from "react";
//#region resources/js/Pages/Admin/Posts/New.jsx
var PostForm = React.lazy(() => import("./PostForm-DGJ9BEX9.js"));
var AdminLayout = React.lazy(() => import("./AdminLayout-BLiupKcK.js"));
function NewPostPage() {
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx("div", {
			style: {
				padding: "40px",
				textAlign: "center"
			},
			children: "Loading Sovereign Editor..."
		}),
		children: /* @__PURE__ */ jsx(PostForm, {})
	});
}
NewPostPage.layout = (page) => /* @__PURE__ */ jsx(Suspense, {
	fallback: /* @__PURE__ */ jsx("div", {
		style: {
			minHeight: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		children: "Loading Admin Workspace..."
	}),
	children: /* @__PURE__ */ jsx(AdminLayout, { children: page })
});
//#endregion
export { NewPostPage as default };
