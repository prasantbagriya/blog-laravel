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
var appName = "Laravel";
createServer((page) => createInertiaApp({
	page,
	render: ReactDOMServer.renderToString,
	title: (title) => title ? `${title} | ${appName}` : appName,
	resolve: (name) => resolvePageComponent([`./Pages/${name}.jsx`, `./Pages/${name}.tsx`], /* #__PURE__ */ Object.assign({
		"./Pages/Admin/Authors/AuthorForm.tsx": () => import("./assets/AuthorForm-sx1aiIhS.js"),
		"./Pages/Admin/Authors/Edit.jsx": () => import("./assets/Edit-lddvOwLm.js"),
		"./Pages/Admin/Authors/Index.jsx": () => import("./assets/Index-Bck4uJdK.js"),
		"./Pages/Admin/Authors/New.jsx": () => import("./assets/New-BduVs6Gp.js"),
		"./Pages/Admin/Bing/Index.jsx": () => import("./assets/Index-DwoBhk6Y.js"),
		"./Pages/Admin/Businesses/Index.jsx": () => import("./assets/Index-BOBoJEWm.js"),
		"./Pages/Admin/Categories/Index.jsx": () => import("./assets/Index-CgW0tRUO.js"),
		"./Pages/Admin/Communities/Edit.jsx": () => import("./assets/Edit-5tnVRUEy.js"),
		"./Pages/Admin/Communities/Index.jsx": () => import("./assets/Index-CY1KT5us.js"),
		"./Pages/Admin/CommunityPosts/Index.jsx": () => import("./assets/Index-DVQqSlOI.js"),
		"./Pages/Admin/ContactMessages/Index.jsx": () => import("./assets/Index-CSMNOiC-.js"),
		"./Pages/Admin/DeleteButton.jsx": () => import("./assets/DeleteButton-4pbNZztV.js"),
		"./Pages/Admin/Facebook/Index.jsx": () => import("./assets/Index-t1nKi7wF.js"),
		"./Pages/Admin/Index.jsx": () => import("./assets/Index-BELMGwic.js"),
		"./Pages/Admin/Inquiries/Index.jsx": () => import("./assets/Index-Cw0_CdBv.js"),
		"./Pages/Admin/Instagram/Index.jsx": () => import("./assets/Index-Bi0M_fBM.js"),
		"./Pages/Admin/LinkedIn/Index.jsx": () => import("./assets/Index-DE9U3LGM.js"),
		"./Pages/Admin/Media/Index.jsx": () => import("./assets/Index-Cwr8Md-A.js"),
		"./Pages/Admin/Newsletters/Index.jsx": () => import("./assets/Index-xt5kndBF.js"),
		"./Pages/Admin/Pages/Index.jsx": () => import("./assets/Index-D_YMT31U.js"),
		"./Pages/Admin/Pinterest/Index.jsx": () => import("./assets/Index-DiiCrJf1.js"),
		"./Pages/Admin/PostForm.tsx": () => import("./assets/PostForm-BZeVHqta.js"),
		"./Pages/Admin/Posts/Edit.jsx": () => import("./assets/Edit-BW_lqDca.js"),
		"./Pages/Admin/Posts/New.jsx": () => import("./assets/New-Op40HIT5.js"),
		"./Pages/Admin/SearchConsole/Index.jsx": () => import("./assets/Index-CKbW5NDR.js"),
		"./Pages/Admin/SearchConsole/PageSpeedTab.jsx": () => import("./assets/PageSpeedTab-Dg-LRdER.js"),
		"./Pages/Admin/SeoAudit/Index.jsx": () => import("./assets/Index-Bi301c04.js"),
		"./Pages/Admin/Settings/Navigation.jsx": () => import("./assets/Navigation-DheVYx0y.js"),
		"./Pages/Admin/Settings/Slider.jsx": () => import("./assets/Slider-C-5BqiSK.js"),
		"./Pages/Admin/Stories/Edit.jsx": () => import("./assets/Edit-TibVO0xS.js"),
		"./Pages/Admin/Stories/Index.jsx": () => import("./assets/Index-1A43_ZvV2.js"),
		"./Pages/Admin/Stories/New.jsx": () => import("./assets/New-C-8Bh1Np.js"),
		"./Pages/Admin/Stories/StoryForm.tsx": () => import("./assets/StoryForm-B4lWVQQZ.js"),
		"./Pages/Admin/Users/Index.jsx": () => import("./assets/Index-C07C7il72.js"),
		"./Pages/Admin/X/Index.jsx": () => import("./assets/Index-Dolqq5Vp.js"),
		"./Pages/Admin/components/MediaPicker.tsx": () => import("./assets/MediaPicker-D2BGZn8r.js").then((n) => n.n),
		"./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-D9f_HCJL.js"),
		"./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-CquBDvO2.js"),
		"./Pages/Auth/Login.jsx": () => import("./assets/Login-BUOIU-3j.js"),
		"./Pages/Auth/Register.jsx": () => import("./assets/Register-C5y7aBbz.js"),
		"./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-CbUZ3g26.js"),
		"./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-BZ8zw0zU.js"),
		"./Pages/Author/Index.jsx": () => import("./assets/Index-CuXYF3FS.js"),
		"./Pages/Author/Show.jsx": () => import("./assets/Show-Cuvv0Ev5.js"),
		"./Pages/Blog/Index.jsx": () => import("./assets/Index-N_yGeGP82.js"),
		"./Pages/Blog/Show.jsx": () => import("./assets/Show-DsOvIWta.js"),
		"./Pages/Business/Create.jsx": () => import("./assets/Create-BBTdGaOw.js"),
		"./Pages/Business/Edit.jsx": () => import("./assets/Edit-BNTydgcp2.js"),
		"./Pages/Category/Index.jsx": () => import("./assets/Index-CZg0cYfy.js"),
		"./Pages/Category/Show.jsx": () => import("./assets/Show-nwkJwZ0l.js"),
		"./Pages/Community/Create.jsx": () => import("./assets/Create-rF7D37mj.js"),
		"./Pages/Community/Edit.jsx": () => import("./assets/Edit-CyDz9EUu.js"),
		"./Pages/Community/Feed.jsx": () => import("./assets/Feed-BZg8L3x5.js"),
		"./Pages/Community/ModQueue.jsx": () => import("./assets/ModQueue-Cix4fxCA.js"),
		"./Pages/Community/Show.jsx": () => import("./assets/Show-BldqcZf9.js"),
		"./Pages/Dashboard.jsx": () => import("./assets/Dashboard-D7DIQ4ei.js"),
		"./Pages/HomeComponents/BlogSection.jsx": () => import("./assets/BlogSection-DqH9mXsE.js"),
		"./Pages/HomeComponents/CategorySection.jsx": () => import("./assets/CategorySection-Cm4V2bak.js"),
		"./Pages/HomeComponents/CommunityFeedSection.jsx": () => import("./assets/CommunityFeedSection-E6zmeeFR.js"),
		"./Pages/HomeComponents/FAQSection.jsx": () => import("./assets/FAQSection-BPaYhfAc.js"),
		"./Pages/HomeComponents/HomeFooter.tsx": () => import("./assets/HomeFooter-DOvgt2w5.js"),
		"./Pages/HomeComponents/HomeNavbar.tsx": () => import("./assets/HomeNavbar-ITr-WDeQ.js"),
		"./Pages/HomeComponents/InstitutesSection.jsx": () => import("./assets/InstitutesSection-ByfCJohD.js"),
		"./Pages/HomeComponents/SeoContent.jsx": () => import("./assets/SeoContent-17wK_Vfn.js"),
		"./Pages/HomeComponents/StoriesSection.jsx": () => import("./assets/StoriesSection-B9Xh0Bgz.js"),
		"./Pages/HomeComponents/TrustMarquee.jsx": () => import("./assets/TrustMarquee-CfkZIMCI.js"),
		"./Pages/HomeComponents/utils.jsx": () => import("./assets/utils-BjQF728w.js"),
		"./Pages/Post/Create.jsx": () => import("./assets/Create-DogKfzZ3.js"),
		"./Pages/Post/Show.jsx": () => import("./assets/Show-R9zBeFGA.js"),
		"./Pages/Profile/Edit.jsx": () => import("./assets/Edit-BH-iccwN.js"),
		"./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-bgs-02f5.js"),
		"./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-ClTBBcO-.js"),
		"./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-JEJ2UmnY.js"),
		"./Pages/Reviews/Index.tsx": () => import("./assets/Index-D3hLXJxb.js"),
		"./Pages/Reviews/components/AiSearchModal.tsx": () => import("./assets/AiSearchModal-CIqeFegw.js"),
		"./Pages/Reviews/components/BusinessCard.tsx": () => import("./assets/BusinessCard-B-DlmsKs.js"),
		"./Pages/Reviews/components/BusinessProfileView.tsx": () => import("./assets/BusinessProfileView-CiH_xqXZ.js"),
		"./Pages/Reviews/components/CategoryGrid.tsx": () => import("./assets/CategoryGrid-i2ydTi_o.js"),
		"./Pages/Reviews/components/HeroSection.tsx": () => import("./assets/HeroSection-CX_INSVW.js"),
		"./Pages/Reviews/components/SubmitReviewModal.tsx": () => import("./assets/SubmitReviewModal-BbCZmBUU.js"),
		"./Pages/Search/Index.jsx": () => import("./assets/Index-BbPHiHq5.js"),
		"./Pages/Static/About.jsx": () => import("./assets/About-tB_q14xa.js"),
		"./Pages/Static/Contact.jsx": () => import("./assets/Contact-CfrfxoWY.js"),
		"./Pages/Static/CustomPage.jsx": () => import("./assets/CustomPage-DmFWtGJ4.js"),
		"./Pages/Static/EditorialPolicy.jsx": () => import("./assets/EditorialPolicy-CmTdUQ8b.js"),
		"./Pages/Static/FactCheckingPolicy.jsx": () => import("./assets/FactCheckingPolicy-C8fl2xwq.js"),
		"./Pages/Static/Privacy.jsx": () => import("./assets/Privacy-BG185Y3n.js"),
		"./Pages/Static/Terms.jsx": () => import("./assets/Terms-CtU-2PfP.js"),
		"./Pages/Story/Index.jsx": () => import("./assets/Index-BXrN9awE.js"),
		"./Pages/User/Show.jsx": () => import("./assets/Show-ClgN3Bsp.js"),
		"./Pages/Welcome.jsx": () => import("./assets/Welcome-Bibq3b0G.js")
	})),
	setup({ App, props }) {
		return /* @__PURE__ */ jsx(App, { ...props });
	}
}));
//#endregion
export {};
