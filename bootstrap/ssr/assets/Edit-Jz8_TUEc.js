import AdminLayout from "./AdminLayout-bqQMnFMH.js";
import AuthorForm from "./AuthorForm-CYtN7yNA.js";
import { jsx } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Admin/Authors/Edit.jsx
function EditAuthorPage({ author }) {
	return /* @__PURE__ */ jsx(AuthorForm, { author });
}
EditAuthorPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { EditAuthorPage as default };
