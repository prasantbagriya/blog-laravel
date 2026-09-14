import { t as Navbar } from "./GlobalNavbar-BeiSnBQi.js";
import { t as BlogFooter } from "./BlogFooter-iDkZqha6.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Static/Privacy.jsx
function Privacy() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Privacy Policy | Blog" }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "w-full px-[25px] pb-8 flex-grow",
				style: { paddingTop: "100px" },
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold mb-8",
					children: "Privacy Policy"
				}), /* @__PURE__ */ jsxs("div", {
					className: "prose max-w-none text-gray-700 space-y-6",
					children: [
						/* @__PURE__ */ jsxs("p", { children: ["Last updated: ", (/* @__PURE__ */ new Date()).toLocaleDateString()] }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "1. Introduction"
						}),
						/* @__PURE__ */ jsx("p", { children: "Welcome to our Privacy Policy. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website." }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "2. The Data We Collect"
						}),
						/* @__PURE__ */ jsx("p", { children: "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:" }),
						/* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Identity Data:" }), " includes first name, last name, username or similar identifier."] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Contact Data:" }), " includes email address and telephone numbers."] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Technical Data:" }), " includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location."] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Usage Data:" }), " includes information about how you use our website, products and services."] })
							]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "3. How We Use Your Data"
						}),
						/* @__PURE__ */ jsx("p", { children: "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:" }),
						/* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsx("li", { children: "Where we need to perform the contract we are about to enter into or have entered into with you." }),
								/* @__PURE__ */ jsx("li", { children: "Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests." }),
								/* @__PURE__ */ jsx("li", { children: "Where we need to comply with a legal obligation." })
							]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "4. Cookies"
						}),
						/* @__PURE__ */ jsx("p", { children: "You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly." })
					]
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { Privacy as default };
