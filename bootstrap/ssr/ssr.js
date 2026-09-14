import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
import { jsx } from "react/jsx-runtime";
//#region node_modules/laravel-vite-plugin/inertia-helpers/index.js
async function resolvePageComponent(path, pages) {
	for (const p of Array.isArray(path) ? path : [path]) {
		const page = pages[p];
		if (typeof page === "undefined") continue;
		return typeof page === "function" ? page() : page;
	}
	throw new Error(`Page not found: ${path}`);
}
//#endregion
//#region resources/js/ssr.jsx
var appName = "coachingsinsikar";
createServer((page) => createInertiaApp({
	page,
	render: ReactDOMServer.renderToString,
	title: (title) => title ? `${title} | ${appName}` : appName,
	resolve: (name) => resolvePageComponent([`./Pages/${name}.jsx`, `./Pages/${name}.tsx`], /* #__PURE__ */ Object.assign({
		"./Pages/Admin/Authors/AuthorForm.tsx": () => import("./assets/AuthorForm-CeJabaGp.js"),
		"./Pages/Admin/Authors/Edit.jsx": () => import("./assets/Edit-CvhBliO1.js"),
		"./Pages/Admin/Authors/Index.jsx": () => import("./assets/Index-Bx2dKiO4.js"),
		"./Pages/Admin/Authors/New.jsx": () => import("./assets/New-BqehnhVp.js"),
		"./Pages/Admin/Businesses/Index.jsx": () => import("./assets/Index-h4N_8OxF.js"),
		"./Pages/Admin/Categories/Index.jsx": () => import("./assets/Index-D8W-H0Ps.js"),
		"./Pages/Admin/CommunityPosts/Index.jsx": () => import("./assets/Index-BQpIA-PB.js"),
		"./Pages/Admin/DeleteButton.jsx": () => import("./assets/DeleteButton-4pbNZztV.js"),
		"./Pages/Admin/Index.jsx": () => import("./assets/Index-D2Bu1JNZ.js"),
		"./Pages/Admin/Media/Index.jsx": () => import("./assets/Index-D02_FO-G.js"),
		"./Pages/Admin/PostForm.tsx": () => import("./assets/PostForm-DGJ9BEX9.js"),
		"./Pages/Admin/Posts/Edit.jsx": () => import("./assets/Edit-2ng7_9UM.js"),
		"./Pages/Admin/Posts/New.jsx": () => import("./assets/New-CKetFhT-.js"),
		"./Pages/Admin/SeoAudit/Index.jsx": () => import("./assets/Index-DJGgxnqx.js"),
		"./Pages/Admin/Settings/Slider.jsx": () => import("./assets/Slider-Cjd8yQYs.js"),
		"./Pages/Admin/Stories/Edit.jsx": () => import("./assets/Edit-Bmsdo0C_.js"),
		"./Pages/Admin/Stories/Index.jsx": () => import("./assets/Index-DD05nlYU.js"),
		"./Pages/Admin/Stories/New.jsx": () => import("./assets/New-CN_4gEhD.js"),
		"./Pages/Admin/Stories/StoryForm.tsx": () => import("./assets/StoryForm-scdDp78S.js"),
		"./Pages/Admin/components/MediaPicker.tsx": () => import("./assets/MediaPicker-Dte0UALB.js").then((n) => n.n),
		"./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-D9f_HCJL.js"),
		"./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-Bcd8S4rx.js"),
		"./Pages/Auth/Login.jsx": () => import("./assets/Login-BocfjpnG.js"),
		"./Pages/Auth/Register.jsx": () => import("./assets/Register-D7qVidg7.js"),
		"./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-CbUZ3g26.js"),
		"./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-BZ8zw0zU.js"),
		"./Pages/Author/Index.jsx": () => import("./assets/Index-nwUzuPFL2.js"),
		"./Pages/Author/Show.jsx": () => import("./assets/Show-DyCbNvPN.js"),
		"./Pages/Blog/Index.jsx": () => import("./assets/Index-CUppq-zg2.js"),
		"./Pages/Blog/Show.jsx": () => import("./assets/Show-C1-K0k5x.js"),
		"./Pages/Category/Index.jsx": () => import("./assets/Index-Cx0xkxep.js"),
		"./Pages/Category/Show.jsx": () => import("./assets/Show-CXbwhSk8.js"),
		"./Pages/Community/Create.jsx": () => import("./assets/Create-C413DOCr.js"),
		"./Pages/Community/Edit.jsx": () => import("./assets/Edit-DJc4wBV3.js"),
		"./Pages/Community/Feed.jsx": () => import("./assets/Feed-BCHOTonp.js"),
		"./Pages/Community/ModQueue.jsx": () => import("./assets/ModQueue-D2p4rdJn.js"),
		"./Pages/Community/Show.jsx": () => import("./assets/Show-DpxxFElQ.js"),
		"./Pages/Dashboard.jsx": () => import("./assets/Dashboard-Dm9k1hBD.js"),
		"./Pages/Post/Create.jsx": () => import("./assets/Create-DWFIUsDY.js"),
		"./Pages/Post/Show.jsx": () => import("./assets/Show-BIqRVoBp.js"),
		"./Pages/Profile/Edit.jsx": () => import("./assets/Edit-Bc839C9Z.js"),
		"./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-bgs-02f5.js"),
		"./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-ClTBBcO-.js"),
		"./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-Dy8I--ud.js"),
		"./Pages/Reviews/Index.tsx": () => import("./assets/Index-BmkGOajv.js"),
		"./Pages/Reviews/components/AdminPanel.tsx": () => import("./assets/AdminPanel-CFYriZy2.js"),
		"./Pages/Reviews/components/AiSearchModal.tsx": () => import("./assets/AiSearchModal-CIqeFegw.js"),
		"./Pages/Reviews/components/ApiDocsModal.tsx": () => import("./assets/ApiDocsModal-Cnw480tN.js"),
		"./Pages/Reviews/components/BusinessCard.tsx": () => import("./assets/BusinessCard-BV0kVSA6.js"),
		"./Pages/Reviews/components/BusinessDashboard.tsx": () => import("./assets/BusinessDashboard-C1JazekU.js"),
		"./Pages/Reviews/components/BusinessProfileView.tsx": () => import("./assets/BusinessProfileView-CJol6CFI.js"),
		"./Pages/Reviews/components/CategoryGrid.tsx": () => import("./assets/CategoryGrid-ag_AA1Xa.js"),
		"./Pages/Reviews/components/CreateBusinessModal.tsx": () => import("./assets/CreateBusinessModal-DcLw8nnK.js"),
		"./Pages/Reviews/components/Footer.tsx": () => import("./assets/Footer-D7_QkJak.js"),
		"./Pages/Reviews/components/HeroSection.tsx": () => import("./assets/HeroSection-B-WL49tl.js"),
		"./Pages/Reviews/components/ModeratorPanel.tsx": () => import("./assets/ModeratorPanel-ChuM8IO4.js"),
		"./Pages/Reviews/components/Navbar.tsx": () => import("./assets/Navbar-BEWFQpzX.js"),
		"./Pages/Reviews/components/SubmitReviewModal.tsx": () => import("./assets/SubmitReviewModal-cV6ol9sx.js"),
		"./Pages/Search/Index.jsx": () => import("./assets/Index-Dc0bp0lp.js"),
		"./Pages/Static/About.jsx": () => import("./assets/About-Bsf-LBgt.js"),
		"./Pages/Static/Contact.jsx": () => import("./assets/Contact-Bo0XQXCb.js"),
		"./Pages/Static/EditorialPolicy.jsx": () => import("./assets/EditorialPolicy-h9bSqPIE.js"),
		"./Pages/Static/FactCheckingPolicy.jsx": () => import("./assets/FactCheckingPolicy-DLz1ENR2.js"),
		"./Pages/Static/Privacy.jsx": () => import("./assets/Privacy-wXf61n5A.js"),
		"./Pages/Static/Terms.jsx": () => import("./assets/Terms-B0VqLUt4.js"),
		"./Pages/Story/Index.jsx": () => import("./assets/Index-BqxrnsxW.js"),
		"./Pages/User/Show.jsx": () => import("./assets/Show-C8QHPmNm.js"),
		"./Pages/Welcome.jsx": () => import("./assets/Welcome-DVSSmvSw.js")
	})),
	setup({ App, props }) {
		return /* @__PURE__ */ jsx(App, { ...props });
	}
}));
//#endregion
export {};
