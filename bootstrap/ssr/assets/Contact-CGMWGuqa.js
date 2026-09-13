import { n as Navbar, t as BlogFooter } from "./BlogFooter-CC6FshYA.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Mail, MapPin, Phone } from "lucide-react";
//#region resources/js/Pages/Static/Contact.jsx
function Contact() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Contact Us | Blog" }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "w-full px-[25px] pb-8 flex-grow",
				style: { paddingTop: "100px" },
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold mb-8",
					children: "Contact Us"
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid md:grid-cols-2 gap-12",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-lg text-gray-700 mb-8",
						children: "Have a question, suggestion, or just want to say hi? We'd love to hear from you. Reach out to our team using the contact details below."
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Mail, { className: "w-6 h-6" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold",
									children: "Email Us"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-gray-600",
									children: "contact@ourblog.com"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center",
									children: /* @__PURE__ */ jsx(Phone, { className: "w-6 h-6" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold",
									children: "Call Us"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-gray-600",
									children: "+1 (555) 123-4567"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center",
									children: /* @__PURE__ */ jsx(MapPin, { className: "w-6 h-6" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-bold",
									children: "Location"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-gray-600",
									children: "123 Tech Avenue, Innovation City"
								})] })]
							})
						]
					})] }), /* @__PURE__ */ jsx("div", {
						className: "bg-gray-50 p-8 rounded-2xl",
						children: /* @__PURE__ */ jsxs("form", {
							className: "space-y-4",
							onSubmit: (e) => {
								e.preventDefault();
								alert("Message sent!");
							},
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium mb-1",
									children: "Your Name"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									className: "w-full px-4 py-2 border rounded-lg",
									placeholder: "John Doe",
									required: true
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium mb-1",
									children: "Email Address"
								}), /* @__PURE__ */ jsx("input", {
									type: "email",
									className: "w-full px-4 py-2 border rounded-lg",
									placeholder: "john@example.com",
									required: true
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium mb-1",
									children: "Message"
								}), /* @__PURE__ */ jsx("textarea", {
									className: "w-full px-4 py-2 border rounded-lg h-32",
									placeholder: "How can we help you?",
									required: true
								})] }),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition",
									children: "Send Message"
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { Contact as default };
