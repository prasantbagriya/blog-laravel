import AdminLayout from "./AdminLayout-BLiupKcK.js";
import AuthorForm from "./AuthorForm-CeJabaGp.js";
import { jsx } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Admin/Authors/Edit.jsx
function EditAuthorPage({ author }) {
	return /* @__PURE__ */ jsx(AuthorForm, { author });
}
EditAuthorPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { EditAuthorPage as default };
