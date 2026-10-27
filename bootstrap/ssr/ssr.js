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
		"./Pages/Admin/Authors/AuthorForm.tsx": () => import("./assets/AuthorForm-sx1aiIhS.js"),
		"./Pages/Admin/Authors/Edit.jsx": () => import("./assets/Edit-BvhuIouD.js"),
		"./Pages/Admin/Authors/Index.jsx": () => import("./assets/Index-CDsvkjRD.js"),
		"./Pages/Admin/Authors/New.jsx": () => import("./assets/New-Bqmn2X10.js"),
		"./Pages/Admin/Bing/Index.jsx": () => import("./assets/Index-DkbCLeF7.js"),
		"./Pages/Admin/Businesses/Index.jsx": () => import("./assets/Index-ZWK0T8g6.js"),
		"./Pages/Admin/Categories/Index.jsx": () => import("./assets/Index-NSkQ5T8q.js"),
		"./Pages/Admin/Communities/Edit.jsx": () => import("./assets/Edit-bUEjL0rP.js"),
		"./Pages/Admin/Communities/Index.jsx": () => import("./assets/Index-CcyAe70G.js"),
		"./Pages/Admin/CommunityPosts/Index.jsx": () => import("./assets/Index-D_lPzga-.js"),
		"./Pages/Admin/ContactMessages/Index.jsx": () => import("./assets/Index-DeX8SJ3u.js"),
		"./Pages/Admin/DeleteButton.jsx": () => import("./assets/DeleteButton-4pbNZztV.js"),
		"./Pages/Admin/Facebook/Index.jsx": () => import("./assets/Index-BvgjyDdS.js"),
		"./Pages/Admin/Index.jsx": () => import("./assets/Index-Dez2fGbJ.js"),
		"./Pages/Admin/Inquiries/Index.jsx": () => import("./assets/Index-BT1hCnAN.js"),
		"./Pages/Admin/Instagram/Index.jsx": () => import("./assets/Index-CB1g4y7i.js"),
		"./Pages/Admin/LinkedIn/Index.jsx": () => import("./assets/Index-CS6zIMiu.js"),
		"./Pages/Admin/Media/Index.jsx": () => import("./assets/Index-CeSQEVAo.js"),
		"./Pages/Admin/Newsletters/Index.jsx": () => import("./assets/Index-B-EuLxZi.js"),
		"./Pages/Admin/Pages/Index.jsx": () => import("./assets/Index-C9H7pcTD.js"),
		"./Pages/Admin/Pinterest/Index.jsx": () => import("./assets/Index-CC2G5QXW.js"),
		"./Pages/Admin/PostForm.tsx": () => import("./assets/PostForm-CzJInsZ7.js"),
		"./Pages/Admin/Posts/Edit.jsx": () => import("./assets/Edit-BsFuESOa.js"),
		"./Pages/Admin/Posts/New.jsx": () => import("./assets/New-zWBinNxa.js"),
		"./Pages/Admin/SearchConsole/Index.jsx": () => import("./assets/Index--JK-gfsn.js"),
		"./Pages/Admin/SearchConsole/PageSpeedTab.jsx": () => import("./assets/PageSpeedTab-BRyjs2Fo.js"),
		"./Pages/Admin/SeoAudit/Index.jsx": () => import("./assets/Index-CQ3mOInS.js"),
		"./Pages/Admin/Settings/Navigation.jsx": () => import("./assets/Navigation-DTR_ESYl.js"),
		"./Pages/Admin/Settings/Slider.jsx": () => import("./assets/Slider-DirVzKEb.js"),
		"./Pages/Admin/Stories/Edit.jsx": () => import("./assets/Edit-D_0cWzbH.js"),
		"./Pages/Admin/Stories/Index.jsx": () => import("./assets/Index-BhsOSH_T2.js"),
		"./Pages/Admin/Stories/New.jsx": () => import("./assets/New-COXqnWdY.js"),
		"./Pages/Admin/Stories/StoryForm.tsx": () => import("./assets/StoryForm-B4lWVQQZ.js"),
		"./Pages/Admin/Users/Index.jsx": () => import("./assets/Index-zRTq6k0E2.js"),
		"./Pages/Admin/X/Index.jsx": () => import("./assets/Index-eNtSaUtG.js"),
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
