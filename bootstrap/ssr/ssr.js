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
		"./Pages/Admin/Authors/AuthorForm.tsx": () => import("./assets/AuthorForm-C7dJkqZW.js"),
		"./Pages/Admin/Authors/Edit.jsx": () => import("./assets/Edit-p0yLB_Vc.js"),
		"./Pages/Admin/Authors/Index.jsx": () => import("./assets/Index-C_HvbyqQ.js"),
		"./Pages/Admin/Authors/New.jsx": () => import("./assets/New-CxZDH7t2.js"),
		"./Pages/Admin/Businesses/Index.jsx": () => import("./assets/Index-DundC-Cf.js"),
		"./Pages/Admin/Categories/Index.jsx": () => import("./assets/Index-CX5GY11q.js"),
		"./Pages/Admin/Communities/Edit.jsx": () => import("./assets/Edit-BwLqrB0b.js"),
		"./Pages/Admin/Communities/Index.jsx": () => import("./assets/Index-CPJ48jqz.js"),
		"./Pages/Admin/CommunityPosts/Index.jsx": () => import("./assets/Index-CslA3wqA.js"),
		"./Pages/Admin/ContactMessages/Index.jsx": () => import("./assets/Index-BcYtwjaK.js"),
		"./Pages/Admin/DeleteButton.jsx": () => import("./assets/DeleteButton-4pbNZztV.js"),
		"./Pages/Admin/Index.jsx": () => import("./assets/Index-DMrYAgaY.js"),
		"./Pages/Admin/Media/Index.jsx": () => import("./assets/Index-CGLWd1z0.js"),
		"./Pages/Admin/Newsletters/Index.jsx": () => import("./assets/Index-hcZjkGxy.js"),
		"./Pages/Admin/Pages/Index.jsx": () => import("./assets/Index-CycPYtre.js"),
		"./Pages/Admin/PostForm.tsx": () => import("./assets/PostForm-B6wMztM5.js"),
		"./Pages/Admin/Posts/Edit.jsx": () => import("./assets/Edit-DfINsJGt.js"),
		"./Pages/Admin/Posts/New.jsx": () => import("./assets/New-DizlyCK3.js"),
		"./Pages/Admin/SeoAudit/Index.jsx": () => import("./assets/Index-HNRIdFiC.js"),
		"./Pages/Admin/Settings/Navigation.jsx": () => import("./assets/Navigation-Lk9v4H34.js"),
		"./Pages/Admin/Settings/Slider.jsx": () => import("./assets/Slider-DC1UDSSf.js"),
		"./Pages/Admin/Stories/Edit.jsx": () => import("./assets/Edit-1hkchJNM.js"),
		"./Pages/Admin/Stories/Index.jsx": () => import("./assets/Index-DgvibdzN.js"),
		"./Pages/Admin/Stories/New.jsx": () => import("./assets/New-BZLsIi8o.js"),
		"./Pages/Admin/Stories/StoryForm.tsx": () => import("./assets/StoryForm-uctXosoJ.js"),
		"./Pages/Admin/Users/Index.jsx": () => import("./assets/Index-SwjJAPoW.js"),
		"./Pages/Admin/components/MediaPicker.tsx": () => import("./assets/MediaPicker-BALC80SH.js").then((n) => n.n),
		"./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-D9f_HCJL.js"),
		"./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-Bcd8S4rx.js"),
		"./Pages/Auth/Login.jsx": () => import("./assets/Login-Csbo1FCO.js"),
		"./Pages/Auth/Register.jsx": () => import("./assets/Register-CAY24Z4T.js"),
		"./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-CbUZ3g26.js"),
		"./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-BZ8zw0zU.js"),
		"./Pages/Author/Index.jsx": () => import("./assets/Index-CrtpUTNo.js"),
		"./Pages/Author/Show.jsx": () => import("./assets/Show-DwP6ys56.js"),
		"./Pages/Blog/Index.jsx": () => import("./assets/Index-WqAqt81i.js"),
		"./Pages/Blog/Show.jsx": () => import("./assets/Show-Bms3Zhdo.js"),
		"./Pages/Business/Create.jsx": () => import("./assets/Create-DgbUgKtH.js"),
		"./Pages/Business/Edit.jsx": () => import("./assets/Edit-NGyyiQ-e.js"),
		"./Pages/Category/Index.jsx": () => import("./assets/Index-hlejYK1Z2.js"),
		"./Pages/Category/Show.jsx": () => import("./assets/Show-CPHl1IFZ.js"),
		"./Pages/Community/Create.jsx": () => import("./assets/Create-BhkQznvr.js"),
		"./Pages/Community/Edit.jsx": () => import("./assets/Edit-DJc4wBV3.js"),
		"./Pages/Community/Feed.jsx": () => import("./assets/Feed-BMYMamWn.js"),
		"./Pages/Community/ModQueue.jsx": () => import("./assets/ModQueue-D2p4rdJn.js"),
		"./Pages/Community/Show.jsx": () => import("./assets/Show-BQRf8K6R.js"),
		"./Pages/Dashboard.jsx": () => import("./assets/Dashboard-4Sx38fPp.js"),
		"./Pages/HomeComponents/BlogSection.jsx": () => import("./assets/BlogSection-yrQVerIc.js"),
		"./Pages/HomeComponents/CategorySection.jsx": () => import("./assets/CategorySection-Cm4V2bak.js"),
		"./Pages/HomeComponents/CommunityFeedSection.jsx": () => import("./assets/CommunityFeedSection-E6zmeeFR.js"),
		"./Pages/HomeComponents/FAQSection.jsx": () => import("./assets/FAQSection-D7KO4io4.js"),
		"./Pages/HomeComponents/HomeFooter.tsx": () => import("./assets/HomeFooter-BTwiScys.js"),
		"./Pages/HomeComponents/HomeNavbar.tsx": () => import("./assets/HomeNavbar-CkJsOpAT.js"),
		"./Pages/HomeComponents/InstitutesSection.jsx": () => import("./assets/InstitutesSection-WAg94c3S.js"),
		"./Pages/HomeComponents/SeoContent.jsx": () => import("./assets/SeoContent-BOXcL4GU.js"),
		"./Pages/HomeComponents/StoriesSection.jsx": () => import("./assets/StoriesSection-B9Xh0Bgz.js"),
		"./Pages/HomeComponents/TrustMarquee.jsx": () => import("./assets/TrustMarquee-CfkZIMCI.js"),
		"./Pages/HomeComponents/utils.jsx": () => import("./assets/utils-BjQF728w.js"),
		"./Pages/Post/Create.jsx": () => import("./assets/Create-HTYpoftS.js"),
		"./Pages/Post/Show.jsx": () => import("./assets/Show-BOG4T-dk.js"),
		"./Pages/Profile/Edit.jsx": () => import("./assets/Edit-U3pnENNB.js"),
		"./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-bgs-02f5.js"),
		"./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-ClTBBcO-.js"),
		"./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-C-Y2JImR.js"),
		"./Pages/Reviews/Index.tsx": () => import("./assets/Index-OtTqUnvi.js"),
		"./Pages/Reviews/components/AiSearchModal.tsx": () => import("./assets/AiSearchModal-CIqeFegw.js"),
		"./Pages/Reviews/components/BusinessCard.tsx": () => import("./assets/BusinessCard-Dm4NHUIC.js"),
		"./Pages/Reviews/components/BusinessProfileView.tsx": () => import("./assets/BusinessProfileView-6ap3LB1c.js"),
		"./Pages/Reviews/components/CategoryGrid.tsx": () => import("./assets/CategoryGrid-ag_AA1Xa.js"),
		"./Pages/Reviews/components/HeroSection.tsx": () => import("./assets/HeroSection-CvsJDUVA.js"),
		"./Pages/Reviews/components/SubmitReviewModal.tsx": () => import("./assets/SubmitReviewModal-BbCZmBUU.js"),
		"./Pages/Search/Index.jsx": () => import("./assets/Index-DisbWPFT.js"),
		"./Pages/Static/About.jsx": () => import("./assets/About-DGkVzTHc.js"),
		"./Pages/Static/Contact.jsx": () => import("./assets/Contact-Bu8ZdUAb.js"),
		"./Pages/Static/EditorialPolicy.jsx": () => import("./assets/EditorialPolicy-BsVHMrZg.js"),
		"./Pages/Static/FactCheckingPolicy.jsx": () => import("./assets/FactCheckingPolicy-07-Xm1UI.js"),
		"./Pages/Static/Privacy.jsx": () => import("./assets/Privacy-YRzpNV8x.js"),
		"./Pages/Static/Terms.jsx": () => import("./assets/Terms-C3QbxFVf.js"),
		"./Pages/Story/Index.jsx": () => import("./assets/Index-zC88a1-e.js"),
		"./Pages/User/Show.jsx": () => import("./assets/Show-Cg6bJ_ip.js"),
		"./Pages/Welcome.jsx": () => import("./assets/Welcome-C1qJCVxL.js")
	})),
	setup({ App, props }) {
		return /* @__PURE__ */ jsx(App, { ...props });
	}
}));
//#endregion
export {};
