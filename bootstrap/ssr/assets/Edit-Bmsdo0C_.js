import { jsx } from "react/jsx-runtime";
import React, { Suspense } from "react";
//#region resources/js/Pages/Admin/Stories/Edit.jsx
var StoryForm = React.lazy(() => import("./StoryForm-scdDp78S.js"));
var AdminLayout = React.lazy(() => import("./AdminLayout-BLiupKcK.js"));
function EditStoryPage({ story }) {
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx("div", {
			style: {
				padding: "40px",
				textAlign: "center"
			},
			children: "Loading Editor..."
		}),
		children: /* @__PURE__ */ jsx(StoryForm, { story })
	});
}
EditStoryPage.layout = (page) => /* @__PURE__ */ jsx(Suspense, {
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
export { EditStoryPage as default };
