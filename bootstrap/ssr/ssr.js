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
		"./Pages/Admin/Businesses/Index.jsx": () => import("./assets/Index-3DgWjq3H.js"),
		"./Pages/Admin/Categories/Index.jsx": () => import("./assets/Index-Dv_8IxKM.js"),
		"./Pages/Admin/Communities/Edit.jsx": () => import("./assets/Edit-B9N9vlL_.js"),
		"./Pages/Admin/Communities/Index.jsx": () => import("./assets/Index-DBNrWbJg.js"),
		"./Pages/Admin/CommunityPosts/Index.jsx": () => import("./assets/Index-CZvyvTDt.js"),
		"./Pages/Admin/ContactMessages/Index.jsx": () => import("./assets/Index-BuHssaUc.js"),
		"./Pages/Admin/DeleteButton.jsx": () => import("./assets/DeleteButton-4pbNZztV.js"),
		"./Pages/Admin/Index.jsx": () => import("./assets/Index-CWJYE2fZ.js"),
		"./Pages/Admin/Media/Index.jsx": () => import("./assets/Index-B5FYT5Xv.js"),
		"./Pages/Admin/Newsletters/Index.jsx": () => import("./assets/Index-DB-PLdQo.js"),
		"./Pages/Admin/Pages/Index.jsx": () => import("./assets/Index-DgFBEFgi.js"),
		"./Pages/Admin/PostForm.tsx": () => import("./assets/PostForm-BbnRgpy-.js"),
		"./Pages/Admin/Posts/Edit.jsx": () => import("./assets/Edit-DWAa1qMS.js"),
		"./Pages/Admin/Posts/New.jsx": () => import("./assets/New-DXZMSnPO.js"),
		"./Pages/Admin/SeoAudit/Index.jsx": () => import("./assets/Index-C5-2xXZJ.js"),
		"./Pages/Admin/Settings/Slider.jsx": () => import("./assets/Slider-DhmPnigH.js"),
		"./Pages/Admin/Stories/Edit.jsx": () => import("./assets/Edit-C0j6_K4S.js"),
		"./Pages/Admin/Stories/Index.jsx": () => import("./assets/Index-B6u0BRs5.js"),
		"./Pages/Admin/Stories/New.jsx": () => import("./assets/New-DEiYL7MG.js"),
		"./Pages/Admin/Stories/StoryForm.tsx": () => import("./assets/StoryForm-scdDp78S.js"),
		"./Pages/Admin/components/MediaPicker.tsx": () => import("./assets/MediaPicker-Dte0UALB.js").then((n) => n.n),
		"./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-D9f_HCJL.js"),
		"./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-Bcd8S4rx.js"),
		"./Pages/Auth/Login.jsx": () => import("./assets/Login-Csbo1FCO.js"),
		"./Pages/Auth/Register.jsx": () => import("./assets/Register-CAY24Z4T.js"),
		"./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-CbUZ3g26.js"),
		"./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-BZ8zw0zU.js"),
		"./Pages/Author/Index.jsx": () => import("./assets/Index-DkMFpdGQ2.js"),
		"./Pages/Author/Show.jsx": () => import("./assets/Show-sFgg7box.js"),
		"./Pages/Blog/Index.jsx": () => import("./assets/Index-CRKwyKtg2.js"),
		"./Pages/Blog/Show.jsx": () => import("./assets/Show-B0eHc2oC.js"),
		"./Pages/Business/Create.jsx": () => import("./assets/Create-B25a-HfN.js"),
		"./Pages/Business/Edit.jsx": () => import("./assets/Edit-BcCGMlkA2.js"),
		"./Pages/Category/Index.jsx": () => import("./assets/Index-D4XuewMB.js"),
		"./Pages/Category/Show.jsx": () => import("./assets/Show-s3CvY_zT.js"),
		"./Pages/Community/Create.jsx": () => import("./assets/Create-S70BsRTU.js"),
		"./Pages/Community/Edit.jsx": () => import("./assets/Edit-DJc4wBV3.js"),
		"./Pages/Community/Feed.jsx": () => import("./assets/Feed-D5d9n3mG.js"),
		"./Pages/Community/ModQueue.jsx": () => import("./assets/ModQueue-D2p4rdJn.js"),
		"./Pages/Community/Show.jsx": () => import("./assets/Show-oZPkkyrw.js"),
		"./Pages/Dashboard.jsx": () => import("./assets/Dashboard-DJvt1wA-.js"),
		"./Pages/HomeComponents/CommunityFeedSection.jsx": () => import("./assets/CommunityFeedSection-E6zmeeFR.js"),
		"./Pages/HomeComponents/InstitutesSection.jsx": () => import("./assets/InstitutesSection-CWquEvsQ.js"),
		"./Pages/HomeComponents/TrustMarquee.jsx": () => import("./assets/TrustMarquee-CZBLeB9b.js"),
		"./Pages/HomeComponents/utils.jsx": () => import("./assets/utils-BjQF728w.js"),
		"./Pages/Post/Create.jsx": () => import("./assets/Create-BlgWAovO.js"),
		"./Pages/Post/Show.jsx": () => import("./assets/Show-GvNOiXT5.js"),
		"./Pages/Profile/Edit.jsx": () => import("./assets/Edit-Bc839C9Z.js"),
		"./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-bgs-02f5.js"),
		"./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-ClTBBcO-.js"),
		"./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-Dy8I--ud.js"),
		"./Pages/Reviews/Index.tsx": () => import("./assets/Index-nzjEMFWj.js"),
		"./Pages/Reviews/components/AiSearchModal.tsx": () => import("./assets/AiSearchModal-CIqeFegw.js"),
		"./Pages/Reviews/components/BusinessCard.tsx": () => import("./assets/BusinessCard-Cqsi5Zb2.js"),
		"./Pages/Reviews/components/BusinessProfileView.tsx": () => import("./assets/BusinessProfileView-6ap3LB1c.js"),
		"./Pages/Reviews/components/CategoryGrid.tsx": () => import("./assets/CategoryGrid-ag_AA1Xa.js"),
		"./Pages/Reviews/components/HeroSection.tsx": () => import("./assets/HeroSection-CvsJDUVA.js"),
		"./Pages/Reviews/components/SubmitReviewModal.tsx": () => import("./assets/SubmitReviewModal-BbCZmBUU.js"),
		"./Pages/Search/Index.jsx": () => import("./assets/Index-CzpMY0FP.js"),
		"./Pages/Static/About.jsx": () => import("./assets/About-D_RYJqQD.js"),
		"./Pages/Static/Contact.jsx": () => import("./assets/Contact-D47DVzSz.js"),
		"./Pages/Static/EditorialPolicy.jsx": () => import("./assets/EditorialPolicy-BwRsipt-.js"),
		"./Pages/Static/FactCheckingPolicy.jsx": () => import("./assets/FactCheckingPolicy-C1z9a0oO.js"),
		"./Pages/Static/Privacy.jsx": () => import("./assets/Privacy-Ba3aVjYM.js"),
		"./Pages/Static/Terms.jsx": () => import("./assets/Terms-CuJ6P5eT.js"),
		"./Pages/Story/Index.jsx": () => import("./assets/Index-D0q64wAh.js"),
		"./Pages/User/Show.jsx": () => import("./assets/Show-DE9zTaJ9.js"),
		"./Pages/Welcome.jsx": () => import("./assets/Welcome-CzS5VkCd.js")
	})),
	setup({ App, props }) {
		return /* @__PURE__ */ jsx(App, { ...props });
	}
}));
//#endregion
export {};
