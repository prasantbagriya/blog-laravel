import { n as Navbar, t as BlogFooter } from "./BlogFooter-BCSF014D.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region resources/js/Pages/Static/About.jsx
function About() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "About Us | Blog" }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "w-full px-[25px] pb-8 flex-grow",
				style: { paddingTop: "100px" },
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold mb-8",
					children: "About Us"
				}), /* @__PURE__ */ jsxs("div", {
					className: "prose max-w-none text-lg text-gray-700 space-y-6",
					children: [
						/* @__PURE__ */ jsx("p", { children: "Welcome to our platform, your number one source for all things digital marketing, tech insights, and automation strategies. We're dedicated to providing you the very best content, with an emphasis on actionable advice, industry trends, and technical excellence." }),
						/* @__PURE__ */ jsx("p", { children: "Founded by a team of passionate developers and marketers, we understand the challenges businesses face in the rapidly evolving digital landscape. Our mission is to bridge the gap between complex technology and practical business application." }),
						/* @__PURE__ */ jsx("p", { children: "Whether you're looking to scale your business with WhatsApp automation, master SEO, or stay ahead of the curve in web development, you'll find expert-verified strategies right here." }),
						/* @__PURE__ */ jsx("p", { children: "We hope you enjoy our insights as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us." })
					]
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { About as default };
