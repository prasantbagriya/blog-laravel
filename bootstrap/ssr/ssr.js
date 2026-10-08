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
		"./Pages/Admin/PostForm.tsx": () => import("./assets/PostForm-Benoiwj8.js"),
		"./Pages/Admin/Posts/Edit.jsx": () => import("./assets/Edit-BweNtOjV.js"),
		"./Pages/Admin/Posts/New.jsx": () => import("./assets/New-Eth1DgNo.js"),
		"./Pages/Admin/SeoAudit/Index.jsx": () => import("./assets/Index-HNRIdFiC.js"),
		"./Pages/Admin/Settings/Navigation.jsx": () => import("./assets/Navigation-BjYl6ArK.js"),
		"./Pages/Admin/Settings/Slider.jsx": () => import("./assets/Slider-a1DU2ZDA.js"),
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
		"./Pages/Author/Index.jsx": () => import("./assets/Index-DkVOBXDE.js"),
		"./Pages/Author/Show.jsx": () => import("./assets/Show-BZSfrtB5.js"),
		"./Pages/Blog/Index.jsx": () => import("./assets/Index-DdrcQGFD.js"),
		"./Pages/Blog/Show.jsx": () => import("./assets/Show-D7tKCA5J.js"),
		"./Pages/Business/Create.jsx": () => import("./assets/Create-jQNz9APS.js"),
		"./Pages/Business/Edit.jsx": () => import("./assets/Edit-0MtCB9NG.js"),
		"./Pages/Category/Index.jsx": () => import("./assets/Index-BIXPyj9C2.js"),
		"./Pages/Category/Show.jsx": () => import("./assets/Show-G9BNFl4d.js"),
		"./Pages/Community/Create.jsx": () => import("./assets/Create-CyAeuISc.js"),
		"./Pages/Community/Edit.jsx": () => import("./assets/Edit-GuB4AovF.js"),
		"./Pages/Community/Feed.jsx": () => import("./assets/Feed-B3jOoMJq.js"),
		"./Pages/Community/ModQueue.jsx": () => import("./assets/ModQueue-jObNK3kN.js"),
		"./Pages/Community/Show.jsx": () => import("./assets/Show-OndC6Hc-.js"),
		"./Pages/Dashboard.jsx": () => import("./assets/Dashboard-4Sx38fPp.js"),
		"./Pages/HomeComponents/BlogSection.jsx": () => import("./assets/BlogSection-yrQVerIc.js"),
		"./Pages/HomeComponents/CategorySection.jsx": () => import("./assets/CategorySection-Cm4V2bak.js"),
		"./Pages/HomeComponents/CommunityFeedSection.jsx": () => import("./assets/CommunityFeedSection-E6zmeeFR.js"),
		"./Pages/HomeComponents/FAQSection.jsx": () => import("./assets/FAQSection-Db2hHx3m.js"),
		"./Pages/HomeComponents/HomeFooter.tsx": () => import("./assets/HomeFooter-BTwiScys.js"),
		"./Pages/HomeComponents/HomeNavbar.tsx": () => import("./assets/HomeNavbar-DtsRBga5.js"),
		"./Pages/HomeComponents/InstitutesSection.jsx": () => import("./assets/InstitutesSection-WAg94c3S.js"),
		"./Pages/HomeComponents/SeoContent.jsx": () => import("./assets/SeoContent-BOXcL4GU.js"),
		"./Pages/HomeComponents/StoriesSection.jsx": () => import("./assets/StoriesSection-B9Xh0Bgz.js"),
		"./Pages/HomeComponents/TrustMarquee.jsx": () => import("./assets/TrustMarquee-CfkZIMCI.js"),
		"./Pages/HomeComponents/utils.jsx": () => import("./assets/utils-BjQF728w.js"),
		"./Pages/Post/Create.jsx": () => import("./assets/Create-DjRjMfEN.js"),
		"./Pages/Post/Show.jsx": () => import("./assets/Show-CbBiQidI.js"),
		"./Pages/Profile/Edit.jsx": () => import("./assets/Edit-U3pnENNB.js"),
		"./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-bgs-02f5.js"),
		"./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-ClTBBcO-.js"),
		"./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-C-Y2JImR.js"),
		"./Pages/Reviews/Index.tsx": () => import("./assets/Index-B1aZ6qX6.js"),
		"./Pages/Reviews/components/AiSearchModal.tsx": () => import("./assets/AiSearchModal-CIqeFegw.js"),
		"./Pages/Reviews/components/BusinessCard.tsx": () => import("./assets/BusinessCard-Dm4NHUIC.js"),
		"./Pages/Reviews/components/BusinessProfileView.tsx": () => import("./assets/BusinessProfileView-6ap3LB1c.js"),
		"./Pages/Reviews/components/CategoryGrid.tsx": () => import("./assets/CategoryGrid-BJVc1I0F.js"),
		"./Pages/Reviews/components/HeroSection.tsx": () => import("./assets/HeroSection-8VIjHqQJ.js"),
		"./Pages/Reviews/components/SubmitReviewModal.tsx": () => import("./assets/SubmitReviewModal-BbCZmBUU.js"),
		"./Pages/Search/Index.jsx": () => import("./assets/Index-CNkp7OxL.js"),
		"./Pages/Static/About.jsx": () => import("./assets/About-eNUQJZdu.js"),
		"./Pages/Static/Contact.jsx": () => import("./assets/Contact-D4GjmzVs.js"),
		"./Pages/Static/EditorialPolicy.jsx": () => import("./assets/EditorialPolicy-9nFeNoTL.js"),
		"./Pages/Static/FactCheckingPolicy.jsx": () => import("./assets/FactCheckingPolicy-D4KDBiaB.js"),
		"./Pages/Static/Privacy.jsx": () => import("./assets/Privacy-D2ff42ow.js"),
		"./Pages/Static/Terms.jsx": () => import("./assets/Terms-BO6PDsLd.js"),
		"./Pages/Story/Index.jsx": () => import("./assets/Index-B7BDoOCv.js"),
		"./Pages/User/Show.jsx": () => import("./assets/Show-D5fNtN9w.js"),
		"./Pages/Welcome.jsx": () => import("./assets/Welcome-CHEOwQTZ.js")
	})),
	setup({ App, props }) {
		return /* @__PURE__ */ jsx(App, { ...props });
	}
}));
//#endregion
export {};
