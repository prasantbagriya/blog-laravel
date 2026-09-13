import { t as AdminLayout } from "./AdminLayout-CqhGBDWs.js";
import PostForm from "./PostForm-BYiyISbT.js";
import { jsx } from "react/jsx-runtime";
import { Suspense } from "react";
//#region resources/js/Pages/Admin/Posts/New.jsx
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
NewPostPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { NewPostPage as default };
