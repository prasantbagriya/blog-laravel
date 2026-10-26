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
		"./Pages/Admin/Authors/AuthorForm.tsx": () => import("./assets/AuthorForm-CWqYK12L.js"),
		"./Pages/Admin/Authors/Edit.jsx": () => import("./assets/Edit-UzlkGwmF.js"),
		"./Pages/Admin/Authors/Index.jsx": () => import("./assets/Index-B4D08Gih.js"),
		"./Pages/Admin/Authors/New.jsx": () => import("./assets/New-B3nN3REr.js"),
		"./Pages/Admin/Bing/Index.jsx": () => import("./assets/Index-DBG4jeP4.js"),
		"./Pages/Admin/Businesses/Index.jsx": () => import("./assets/Index-adZa-_sU.js"),
		"./Pages/Admin/Categories/Index.jsx": () => import("./assets/Index-B3MTX8Yj.js"),
		"./Pages/Admin/Communities/Edit.jsx": () => import("./assets/Edit-BSmM50mR.js"),
		"./Pages/Admin/Communities/Index.jsx": () => import("./assets/Index-DRvPItmZ.js"),
		"./Pages/Admin/CommunityPosts/Index.jsx": () => import("./assets/Index-h-mvMtoK.js"),
		"./Pages/Admin/ContactMessages/Index.jsx": () => import("./assets/Index-FxTyIdt8.js"),
		"./Pages/Admin/DeleteButton.jsx": () => import("./assets/DeleteButton-4pbNZztV.js"),
		"./Pages/Admin/Facebook/Index.jsx": () => import("./assets/Index-C6vEotHX.js"),
		"./Pages/Admin/Index.jsx": () => import("./assets/Index-VswuQtUW.js"),
		"./Pages/Admin/Instagram/Index.jsx": () => import("./assets/Index-B8dMmT0v.js"),
		"./Pages/Admin/LinkedIn/Index.jsx": () => import("./assets/Index-CAdRCH7Y.js"),
		"./Pages/Admin/Media/Index.jsx": () => import("./assets/Index-BYlE9Mpe.js"),
		"./Pages/Admin/Newsletters/Index.jsx": () => import("./assets/Index-CtaXtz__.js"),
		"./Pages/Admin/Pages/Index.jsx": () => import("./assets/Index-Dz-Zlqal.js"),
		"./Pages/Admin/Pinterest/Index.jsx": () => import("./assets/Index-DGCLEAFO.js"),
		"./Pages/Admin/PostForm.tsx": () => import("./assets/PostForm-BiA4_U1O.js"),
		"./Pages/Admin/Posts/Edit.jsx": () => import("./assets/Edit-CPha4wIR.js"),
		"./Pages/Admin/Posts/New.jsx": () => import("./assets/New-BQgJdS_q.js"),
		"./Pages/Admin/SearchConsole/Index.jsx": () => import("./assets/Index-BfOlVpPB.js"),
		"./Pages/Admin/SearchConsole/PageSpeedTab.jsx": () => import("./assets/PageSpeedTab-DGxY82Wg.js"),
		"./Pages/Admin/SeoAudit/Index.jsx": () => import("./assets/Index-BYEJggPJ.js"),
		"./Pages/Admin/Settings/Navigation.jsx": () => import("./assets/Navigation-Dn9i65aF.js"),
		"./Pages/Admin/Settings/Slider.jsx": () => import("./assets/Slider-D93S1k2C.js"),
		"./Pages/Admin/Stories/Edit.jsx": () => import("./assets/Edit-CF6i-vfv.js"),
		"./Pages/Admin/Stories/Index.jsx": () => import("./assets/Index-BwqSxns2.js"),
		"./Pages/Admin/Stories/New.jsx": () => import("./assets/New-BiR1v8Pq.js"),
		"./Pages/Admin/Stories/StoryForm.tsx": () => import("./assets/StoryForm-lTNo9Xkv.js"),
		"./Pages/Admin/Users/Index.jsx": () => import("./assets/Index-AUMafwed2.js"),
		"./Pages/Admin/X/Index.jsx": () => import("./assets/Index-Cn_la6rd2.js"),
		"./Pages/Admin/components/MediaPicker.tsx": () => import("./assets/MediaPicker-zN4UKBzt.js").then((n) => n.n),
		"./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-D9f_HCJL.js"),
		"./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-CquBDvO2.js"),
		"./Pages/Auth/Login.jsx": () => import("./assets/Login-BUOIU-3j.js"),
		"./Pages/Auth/Register.jsx": () => import("./assets/Register-C5y7aBbz.js"),
		"./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-CbUZ3g26.js"),
		"./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-BZ8zw0zU.js"),
		"./Pages/Author/Index.jsx": () => import("./assets/Index-bdhUKZqJ.js"),
		"./Pages/Author/Show.jsx": () => import("./assets/Show-B7mAwxtr.js"),
		"./Pages/Blog/Index.jsx": () => import("./assets/Index-CAR_g9f22.js"),
		"./Pages/Blog/Show.jsx": () => import("./assets/Show-C6mZl0Pt.js"),
		"./Pages/Business/Create.jsx": () => import("./assets/Create-BBTdGaOw.js"),
		"./Pages/Business/Edit.jsx": () => import("./assets/Edit-BNTydgcp2.js"),
		"./Pages/Category/Index.jsx": () => import("./assets/Index-CkR7s_6k.js"),
		"./Pages/Category/Show.jsx": () => import("./assets/Show-BTVYPRGH.js"),
		"./Pages/Community/Create.jsx": () => import("./assets/Create-rF7D37mj.js"),
		"./Pages/Community/Edit.jsx": () => import("./assets/Edit-CyDz9EUu.js"),
		"./Pages/Community/Feed.jsx": () => import("./assets/Feed-BZg8L3x5.js"),
		"./Pages/Community/ModQueue.jsx": () => import("./assets/ModQueue-Cix4fxCA.js"),
		"./Pages/Community/Show.jsx": () => import("./assets/Show-BldqcZf9.js"),
		"./Pages/Dashboard.jsx": () => import("./assets/Dashboard-DDxfX6SZ.js"),
		"./Pages/HomeComponents/BlogSection.jsx": () => import("./assets/BlogSection-yrQVerIc.js"),
		"./Pages/HomeComponents/CategorySection.jsx": () => import("./assets/CategorySection-Cm4V2bak.js"),
		"./Pages/HomeComponents/CommunityFeedSection.jsx": () => import("./assets/CommunityFeedSection-E6zmeeFR.js"),
		"./Pages/HomeComponents/FAQSection.jsx": () => import("./assets/FAQSection-BPaYhfAc.js"),
		"./Pages/HomeComponents/HomeFooter.tsx": () => import("./assets/HomeFooter-BsCTHonk.js"),
		"./Pages/HomeComponents/HomeNavbar.tsx": () => import("./assets/HomeNavbar-ITr-WDeQ.js"),
		"./Pages/HomeComponents/InstitutesSection.jsx": () => import("./assets/InstitutesSection-WAg94c3S.js"),
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
		"./Pages/Reviews/Index.tsx": () => import("./assets/Index-BjWo-ArD.js"),
		"./Pages/Reviews/components/AiSearchModal.tsx": () => import("./assets/AiSearchModal-CIqeFegw.js"),
		"./Pages/Reviews/components/BusinessCard.tsx": () => import("./assets/BusinessCard-B-DlmsKs.js"),
		"./Pages/Reviews/components/BusinessProfileView.tsx": () => import("./assets/BusinessProfileView-ByCRX6Bo.js"),
		"./Pages/Reviews/components/CategoryGrid.tsx": () => import("./assets/CategoryGrid-i2ydTi_o.js"),
		"./Pages/Reviews/components/HeroSection.tsx": () => import("./assets/HeroSection-CX_INSVW.js"),
		"./Pages/Reviews/components/SubmitReviewModal.tsx": () => import("./assets/SubmitReviewModal-BbCZmBUU.js"),
		"./Pages/Search/Index.jsx": () => import("./assets/Index-DqKjy2Zg.js"),
		"./Pages/Static/About.jsx": () => import("./assets/About-ClsLKxrE.js"),
		"./Pages/Static/Contact.jsx": () => import("./assets/Contact-qJ9HEt1k.js"),
		"./Pages/Static/CustomPage.jsx": () => import("./assets/CustomPage-uGCWhGUX.js"),
		"./Pages/Static/EditorialPolicy.jsx": () => import("./assets/EditorialPolicy-OZ4naZTK.js"),
		"./Pages/Static/FactCheckingPolicy.jsx": () => import("./assets/FactCheckingPolicy-evlukuMH.js"),
		"./Pages/Static/Privacy.jsx": () => import("./assets/Privacy-DxtcvUDQ.js"),
		"./Pages/Static/Terms.jsx": () => import("./assets/Terms-Cua4fd1t.js"),
		"./Pages/Story/Index.jsx": () => import("./assets/Index-CIV1Sh4x.js"),
		"./Pages/User/Show.jsx": () => import("./assets/Show-CPRX0C4J.js"),
		"./Pages/Welcome.jsx": () => import("./assets/Welcome-FCvrfSGy.js")
	})),
	setup({ App, props }) {
		return /* @__PURE__ */ jsx(App, { ...props });
	}
}));
//#endregion
export {};
