import { t as Navbar } from "./GlobalNavbar-RO4UzKYw.js";
import { t as BlogFooter } from "./BlogFooter-CC-GFETm.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Static/Terms.jsx
function Terms() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ jsxs(Head, { children: [
				/* @__PURE__ */ jsx("title", { children: "CoachingsinSikar Terms & Conditions" }),
				/* @__PURE__ */ jsx("meta", {
					name: "description",
					content: "Read the terms and conditions for using CoachingsinSikar. Learn about acceptable use, content rights, disclaimers, and other rules for this education guide."
				}),
				/* @__PURE__ */ jsx("meta", {
					name: "keywords",
					content: "CoachingsinSikar terms, website terms and conditions, terms of use, user responsibilities, website usage rules, content terms, disclaimer, user agreement, CoachingsinSikar terms and conditions, terms of use CoachingsinSikar, website terms Sikar"
				}),
				/* @__PURE__ */ jsx("meta", {
					property: "og:title",
					content: "CoachingsinSikar Terms & Conditions"
				}),
				/* @__PURE__ */ jsx("meta", {
					property: "og:description",
					content: "These terms explain how you can use CoachingsinSikar, what content rights we hold, and important disclaimers for students, parents, and other visitors."
				}),
				/* @__PURE__ */ jsx("meta", {
					name: "twitter:title",
					content: "Website Terms & Conditions | CoachingsinSikar"
				}),
				/* @__PURE__ */ jsx("meta", {
					name: "twitter:description",
					content: "Before using CoachingsinSikar, read our terms and conditions. They cover acceptable use, content ownership, disclaimers, and other key rules for this education guide."
				})
			] }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "w-full px-[25px] pb-8 flex-grow",
				style: { paddingTop: "100px" },
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold mb-8",
					children: "Terms of Service"
				}), /* @__PURE__ */ jsxs("div", {
					className: "prose max-w-none text-gray-700 space-y-6",
					children: [
						/* @__PURE__ */ jsxs("p", { children: ["Last updated: ", (/* @__PURE__ */ new Date()).toLocaleDateString()] }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "1. Agreement to Terms"
						}),
						/* @__PURE__ */ jsx("p", { children: "By accessing our website, you agree to be bound by these Terms of Service and to use the site in accordance with these Terms of Service, our Privacy Policy and any additional terms and conditions that may apply to specific sections of the site." }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "2. Intellectual Property Rights"
						}),
						/* @__PURE__ */ jsx("p", { children: "Unless otherwise stated, we or our licensors own the intellectual property rights in the website and material on the website. Subject to the license below, all these intellectual property rights are reserved." }),
						/* @__PURE__ */ jsx("p", { children: "You may view, download for caching purposes only, and print pages from the website for your own personal use, subject to the restrictions set out below and elsewhere in these terms and conditions." }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "3. Restrictions"
						}),
						/* @__PURE__ */ jsx("p", { children: "You must not:" }),
						/* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsx("li", { children: "Republish material from this website (including republication on another website);" }),
								/* @__PURE__ */ jsx("li", { children: "Sell, rent or sub-license material from the website;" }),
								/* @__PURE__ */ jsx("li", { children: "Reproduce, duplicate, copy or otherwise exploit material on our website for a commercial purpose;" })
							]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "4. Limitations of Liability"
						}),
						/* @__PURE__ */ jsx("p", { children: "We will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special or consequential loss; or for any business losses, loss of revenue, income, profits or anticipated savings." })
					]
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { Terms as default };
