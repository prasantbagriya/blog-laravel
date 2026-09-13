import AuthorForm from "./AuthorForm-CVureTt-.js";
import { t as AdminLayout } from "./AdminLayout-CqhGBDWs.js";
import { jsx } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Admin/Authors/New.jsx
function NewAuthorPage() {
	return /* @__PURE__ */ jsx(AuthorForm, {});
}
NewAuthorPage.layout = (page) => /* @__PURE__ */ jsx(AdminLayout, { children: page });
//#endregion
export { NewAuthorPage as default };
