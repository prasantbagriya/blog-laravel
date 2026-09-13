import { t as Navbar } from "./GlobalNavbar-dTNI2462.js";
import { t as BlogFooter } from "./BlogFooter-L7SI1qpL.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Static/FactCheckingPolicy.jsx
function FactCheckingPolicy() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Fact-Checking Policy | Blog" }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "w-full px-[25px] pb-8 flex-grow",
				style: { paddingTop: "100px" },
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold mb-8",
					children: "Fact-Checking Policy"
				}), /* @__PURE__ */ jsxs("div", {
					className: "prose max-w-none text-gray-700 space-y-6",
					children: [
						/* @__PURE__ */ jsx("p", { children: "We take the accuracy of our content very seriously. Our readers rely on us for correct information, and we are committed to maintaining the highest standards of journalistic integrity." }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "Our Process"
						}),
						/* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Primary Sources:" }), " We rely on primary sources whenever possible, including official documentation, direct interviews, academic papers, and verified data sets."] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Verification:" }), " Claims of fact are cross-referenced against multiple reliable sources before publication."] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Expert Review:" }), " Highly technical or specialized content is reviewed by subject matter experts prior to publication."] })
							]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "Corrections Policy"
						}),
						/* @__PURE__ */ jsx("p", { children: "Despite our best efforts, errors occasionally occur. When they do, we are committed to correcting them promptly and transparently." }),
						/* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsx("li", { children: "If you spot an error, please report it to us via our Contact page." }),
								/* @__PURE__ */ jsx("li", { children: "Substantive corrections will be noted at the bottom of the article, detailing what was changed and when." }),
								/* @__PURE__ */ jsx("li", { children: "Minor typographical errors or formatting issues are corrected without a formal correction notice." })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { FactCheckingPolicy as default };
