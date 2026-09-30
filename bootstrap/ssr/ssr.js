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
		"./Pages/Admin/Authors/AuthorForm.tsx": () => import("./assets/AuthorForm-dc2SxbtN.js"),
		"./Pages/Admin/Authors/Edit.jsx": () => import("./assets/Edit-k4tR6wbw.js"),
		"./Pages/Admin/Authors/Index.jsx": () => import("./assets/Index-C9lERd75.js"),
		"./Pages/Admin/Authors/New.jsx": () => import("./assets/New-BgXCqik5.js"),
		"./Pages/Admin/Businesses/Index.jsx": () => import("./assets/Index-CisvLRnU.js"),
		"./Pages/Admin/Categories/Index.jsx": () => import("./assets/Index-u3Q7D7Pd.js"),
		"./Pages/Admin/Communities/Edit.jsx": () => import("./assets/Edit-BAx_ejRk.js"),
		"./Pages/Admin/Communities/Index.jsx": () => import("./assets/Index-VvNrMiOS.js"),
		"./Pages/Admin/CommunityPosts/Index.jsx": () => import("./assets/Index-DNHUnPtX.js"),
		"./Pages/Admin/ContactMessages/Index.jsx": () => import("./assets/Index-BuRoPVna.js"),
		"./Pages/Admin/DeleteButton.jsx": () => import("./assets/DeleteButton-4pbNZztV.js"),
		"./Pages/Admin/Index.jsx": () => import("./assets/Index-DSSL6alE.js"),
		"./Pages/Admin/Media/Index.jsx": () => import("./assets/Index-L6Ig5wxa.js"),
		"./Pages/Admin/Newsletters/Index.jsx": () => import("./assets/Index-TTeHiz2h.js"),
		"./Pages/Admin/Pages/Index.jsx": () => import("./assets/Index-MDieniib.js"),
		"./Pages/Admin/PostForm.tsx": () => import("./assets/PostForm-mX02lvAB.js"),
		"./Pages/Admin/Posts/Edit.jsx": () => import("./assets/Edit-DH2ftEeT.js"),
		"./Pages/Admin/Posts/New.jsx": () => import("./assets/New-VUM71vCY.js"),
		"./Pages/Admin/SeoAudit/Index.jsx": () => import("./assets/Index-BlJoi2Op.js"),
		"./Pages/Admin/Settings/Slider.jsx": () => import("./assets/Slider-B0n_49y_.js"),
		"./Pages/Admin/Stories/Edit.jsx": () => import("./assets/Edit-CFCitjR9.js"),
		"./Pages/Admin/Stories/Index.jsx": () => import("./assets/Index-IramfNFt.js"),
		"./Pages/Admin/Stories/New.jsx": () => import("./assets/New-DWxyPkRk.js"),
		"./Pages/Admin/Stories/StoryForm.tsx": () => import("./assets/StoryForm-DkG7mZeZ.js"),
		"./Pages/Admin/components/MediaPicker.tsx": () => import("./assets/MediaPicker-DRyBj2N5.js").then((n) => n.n),
		"./Pages/Auth/ConfirmPassword.jsx": () => import("./assets/ConfirmPassword-D9f_HCJL.js"),
		"./Pages/Auth/ForgotPassword.jsx": () => import("./assets/ForgotPassword-Bcd8S4rx.js"),
		"./Pages/Auth/Login.jsx": () => import("./assets/Login-Csbo1FCO.js"),
		"./Pages/Auth/Register.jsx": () => import("./assets/Register-CAY24Z4T.js"),
		"./Pages/Auth/ResetPassword.jsx": () => import("./assets/ResetPassword-CbUZ3g26.js"),
		"./Pages/Auth/VerifyEmail.jsx": () => import("./assets/VerifyEmail-BZ8zw0zU.js"),
		"./Pages/Author/Index.jsx": () => import("./assets/Index-DkMFpdGQ2.js"),
		"./Pages/Author/Show.jsx": () => import("./assets/Show-sFgg7box.js"),
		"./Pages/Blog/Index.jsx": () => import("./assets/Index-CRKwyKtg2.js"),
		"./Pages/Blog/Show.jsx": () => import("./assets/Show-DA5BaJ97.js"),
		"./Pages/Business/Create.jsx": () => import("./assets/Create-DQtZNGC7.js"),
		"./Pages/Business/Edit.jsx": () => import("./assets/Edit-BNVAChGz2.js"),
		"./Pages/Category/Index.jsx": () => import("./assets/Index-D4XuewMB.js"),
		"./Pages/Category/Show.jsx": () => import("./assets/Show-DcRgYAad.js"),
		"./Pages/Community/Create.jsx": () => import("./assets/Create-S70BsRTU.js"),
		"./Pages/Community/Edit.jsx": () => import("./assets/Edit-DJc4wBV3.js"),
		"./Pages/Community/Feed.jsx": () => import("./assets/Feed-D5d9n3mG.js"),
		"./Pages/Community/ModQueue.jsx": () => import("./assets/ModQueue-D2p4rdJn.js"),
		"./Pages/Community/Show.jsx": () => import("./assets/Show-oZPkkyrw.js"),
		"./Pages/Dashboard.jsx": () => import("./assets/Dashboard-DJvt1wA-.js"),
		"./Pages/HomeComponents/CommunityFeedSection.jsx": () => import("./assets/CommunityFeedSection-E6zmeeFR.js"),
		"./Pages/HomeComponents/InstitutesSection.jsx": () => import("./assets/InstitutesSection-WAg94c3S.js"),
		"./Pages/HomeComponents/TrustMarquee.jsx": () => import("./assets/TrustMarquee-CZBLeB9b.js"),
		"./Pages/HomeComponents/utils.jsx": () => import("./assets/utils-BjQF728w.js"),
		"./Pages/Post/Create.jsx": () => import("./assets/Create-CyhEvG8q.js"),
		"./Pages/Post/Show.jsx": () => import("./assets/Show-GvNOiXT5.js"),
		"./Pages/Profile/Edit.jsx": () => import("./assets/Edit-Bc839C9Z.js"),
		"./Pages/Profile/Partials/DeleteUserForm.jsx": () => import("./assets/DeleteUserForm-bgs-02f5.js"),
		"./Pages/Profile/Partials/UpdatePasswordForm.jsx": () => import("./assets/UpdatePasswordForm-ClTBBcO-.js"),
		"./Pages/Profile/Partials/UpdateProfileInformationForm.jsx": () => import("./assets/UpdateProfileInformationForm-Dy8I--ud.js"),
		"./Pages/Reviews/Index.tsx": () => import("./assets/Index-B4Z5JMHH.js"),
		"./Pages/Reviews/components/AiSearchModal.tsx": () => import("./assets/AiSearchModal-CIqeFegw.js"),
		"./Pages/Reviews/components/BusinessCard.tsx": () => import("./assets/BusinessCard-Dm4NHUIC.js"),
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
		"./Pages/Welcome.jsx": () => import("./assets/Welcome-Wg1I07SP.js")
	})),
	setup({ App, props }) {
		return /* @__PURE__ */ jsx(App, { ...props });
	}
}));
//#endregion
export {};
