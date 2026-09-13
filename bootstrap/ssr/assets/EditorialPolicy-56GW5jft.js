import { n as Navbar, t as BlogFooter } from "./BlogFooter-BCSF014D.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Static/EditorialPolicy.jsx
function EditorialPolicy() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Editorial Policy | Blog" }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "w-full px-[25px] pb-8 flex-grow",
				style: { paddingTop: "100px" },
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold mb-8",
					children: "Editorial Policy"
				}), /* @__PURE__ */ jsxs("div", {
					className: "prose max-w-none text-gray-700 space-y-6",
					children: [
						/* @__PURE__ */ jsx("p", { children: "Our editorial mission is to provide accurate, comprehensive, and unbiased information about technology, marketing, and business strategies." }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "Core Principles"
						}),
						/* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-6 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Accuracy:" }), " We strive to ensure that all information we publish is accurate and up-to-date. All articles undergo review by our editorial team."] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Independence:" }), " Our editorial content is not influenced by our advertisers. We maintain a strict separation between advertising and editorial content."] }),
								/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", { children: "Transparency:" }), " We are clear about any potential conflicts of interest. Sponsored content is always clearly labeled."] })
							]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "Content Updates"
						}),
						/* @__PURE__ */ jsx("p", { children: "The digital landscape changes rapidly. We regularly review and update our existing content to ensure it remains accurate and relevant. When significant updates are made, we note the date of the update at the top or bottom of the article." }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold mt-8 mb-4",
							children: "AI Usage Policy"
						}),
						/* @__PURE__ */ jsx("p", { children: "While we may use AI tools for research, outlining, or grammar checking, all final content is written, reviewed, and verified by human experts. We do not publish raw, unedited AI-generated articles." })
					]
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { EditorialPolicy as default };
