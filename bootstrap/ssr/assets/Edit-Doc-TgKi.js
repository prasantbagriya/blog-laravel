import { t as AdminLayout } from "./AdminLayout-CqhGBDWs.js";
import StoryForm from "./StoryForm-DAJL6eDR.js";
import { jsx } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Admin/Stories/Edit.jsx
function EditStoryPage({ story }) {
	return /* @__PURE__ */ jsx(StoryForm, { story });
}
EditStoryPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { EditStoryPage as default };
