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
		"./Pages/Admin/Authors/Edit.jsx": () => import("./assets/Edit-DIaND-dB.js"),
		"./Pages/Admin/Authors/Index.jsx": () => import("./assets/Index-BOWFS9NS.js"),
		"./Pages/Admin/Authors/New.jsx": () => import("./assets/New-PkXrXiqF.js"),
		"./Pages/Admin/Businesses/Index.jsx": () => import("./assets/Index-CLV0T5jH.js"),
		"./Pages/Admin/Categories/Index.jsx": () => import("./assets/Index-Dv_8IxKM.js"),
		"./Pages/Admin/Communities/Edit.jsx": () => import("./assets/Edit-B9N9vlL_.js"),
		"./Pages/Admin/Communities/Index.jsx": () => import("./assets/Index-DBNrWbJg.js"),
		"./Pages/Admin/CommunityPosts/Index.jsx": () => import("./assets/Index-CZvyvTDt.js"),
		"./Pages/Admin/ContactMessages/Index.jsx": () => import("./assets/Index-CjA5ZjUT.js"),
		"./Pages/Admin/DeleteButton.jsx": () => import("./assets/DeleteButton-4pbNZztV.js"),
		"./Pages/Admin/Index.jsx": () => import("./assets/Index-CWJYE2fZ.js"),
		"./Pages/Admin/Media/Index.jsx": () => import("./assets/Index-B5FYT5Xv.js"),
		"./Pages/Admin/PostForm.tsx": () => import("./assets/PostForm-DjPjSUNv.js"),
		"./Pages/Admin/Posts/Edit.jsx": () => import("./assets/Edit-VTvLa5no.js"),
		"./Pages/Admin/Posts/New.jsx": () => import("./assets/New-CcqMEfGg.js"),
		"./Pages/Admin/SeoAudit/Index.jsx": () => import("./assets/Index-C5-2xXZJ.js"),
		"./Pages/Admin/Settings/Slider.jsx": () => import("./assets/Slider-DhmPnigH.js"),
		"./Pages/Admin/Stories/Edit.jsx": () => import("./assets/Edit-C0j6_K4S.js"),
		"./Pages/Admin/Stories/Index.jsx": () => import("./assets/Index-B6u0BRs5.js"),
		"./Pages/Admin/Stories/New.jsx": () => import("./assets/New-DEiYL7MG.js"),
		"./Pages/Admin/Stories/StoryForm.tsx": () => import("./assets/StoryForm-scdDp78S.js"),
		"./Pages/Admin/components/MediaPicker.tsx": () => import("./assets/MediaPicker-Dte0UALB.js").then((n) => n.n),
		"./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-D9f_HCJL.js"),
		"./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-Bcd8S4rx.js"),
		"./Pages/Auth/Login.jsx": () => import("./assets/Login-BocfjpnG.js"),
		"./Pages/Auth/Register.jsx": () => import("./assets/Register-D7qVidg7.js"),
		"./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-CbUZ3g26.js"),
		"./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-BZ8zw0zU.js"),
		"./Pages/Author/Index.jsx": () => import("./assets/Index-8IcjoYkZ2.js"),
		"./Pages/Author/Show.jsx": () => import("./assets/Show-DAn30m4K.js"),
		"./Pages/Blog/Index.jsx": () => import("./assets/Index-C5gMOcpQ2.js"),
		"./Pages/Blog/Show.jsx": () => import("./assets/Show-HUutukyY.js"),
		"./Pages/Business/Create.jsx": () => import("./assets/Create-Dwljo7_E.js"),
		"./Pages/Business/Edit.jsx": () => import("./assets/Edit-9dLeq2QF2.js"),
		"./Pages/Category/Index.jsx": () => import("./assets/Index-BdSkuhje.js"),
		"./Pages/Category/Show.jsx": () => import("./assets/Show-DM9yqWAI.js"),
		"./Pages/Community/Create.jsx": () => import("./assets/Create-C2m6OfXS.js"),
		"./Pages/Community/Edit.jsx": () => import("./assets/Edit-DJc4wBV3.js"),
		"./Pages/Community/Feed.jsx": () => import("./assets/Feed-DYJmSbeJ.js"),
		"./Pages/Community/ModQueue.jsx": () => import("./assets/ModQueue-D2p4rdJn.js"),
		"./Pages/Community/Show.jsx": () => import("./assets/Show-D06_kRSn.js"),
		"./Pages/Dashboard.jsx": () => import("./assets/Dashboard-Dyo_sTOF.js"),
		"./Pages/Post/Create.jsx": () => import("./assets/Create-YLDEVjqn.js"),
		"./Pages/Post/Show.jsx": () => import("./assets/Show-DceNy5-X.js"),
		"./Pages/Profile/Edit.jsx": () => import("./assets/Edit-Bc839C9Z.js"),
		"./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-bgs-02f5.js"),
		"./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-ClTBBcO-.js"),
		"./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-Dy8I--ud.js"),
		"./Pages/Reviews/Index.tsx": () => import("./assets/Index-Bx8HPgh1.js"),
		"./Pages/Reviews/components/AiSearchModal.tsx": () => import("./assets/AiSearchModal-CIqeFegw.js"),
		"./Pages/Reviews/components/BusinessCard.tsx": () => import("./assets/BusinessCard-BV0kVSA6.js"),
		"./Pages/Reviews/components/BusinessProfileView.tsx": () => import("./assets/BusinessProfileView-Cjhu01Yw.js"),
		"./Pages/Reviews/components/CategoryGrid.tsx": () => import("./assets/CategoryGrid-ag_AA1Xa.js"),
		"./Pages/Reviews/components/HeroSection.tsx": () => import("./assets/HeroSection-B-WL49tl.js"),
		"./Pages/Reviews/components/SubmitReviewModal.tsx": () => import("./assets/SubmitReviewModal-BbCZmBUU.js"),
		"./Pages/Search/Index.jsx": () => import("./assets/Index-PrkdRR3L.js"),
		"./Pages/Static/About.jsx": () => import("./assets/About-DTg5gwwB.js"),
		"./Pages/Static/Contact.jsx": () => import("./assets/Contact-91Sq0yP0.js"),
		"./Pages/Static/EditorialPolicy.jsx": () => import("./assets/EditorialPolicy-Dou0C_Zk.js"),
		"./Pages/Static/FactCheckingPolicy.jsx": () => import("./assets/FactCheckingPolicy-CPukv4SM.js"),
		"./Pages/Static/Privacy.jsx": () => import("./assets/Privacy-DqFF_MeY.js"),
		"./Pages/Static/Terms.jsx": () => import("./assets/Terms-BJ21SGGz.js"),
		"./Pages/Story/Index.jsx": () => import("./assets/Index-CSMd_vW0.js"),
		"./Pages/User/Show.jsx": () => import("./assets/Show-DE9zTaJ9.js"),
		"./Pages/Welcome.jsx": () => import("./assets/Welcome-CRyKZuE9.js")
	})),
	setup({ App, props }) {
		return /* @__PURE__ */ jsx(App, { ...props });
	}
}));
//#endregion
export {};
