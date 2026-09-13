import { t as AdminLayout } from "./AdminLayout-CqhGBDWs.js";
import PostForm from "./PostForm-CJ504TFG.js";
import { jsx } from "react/jsx-runtime";
import { Suspense } from "react";
//#region resources/js/Pages/Admin/Posts/Edit.jsx
function EditPostPage({ post }) {
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx("div", {
			style: {
				padding: "40px",
				textAlign: "center"
			},
			children: "Loading Sovereign Editor..."
		}),
		children: /* @__PURE__ */ jsx(PostForm, { post })
	});
}
EditPostPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { EditPostPage as default };
