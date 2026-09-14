import { t as Navbar } from "./GlobalNavbar-BeiSnBQi.js";
import { t as BlogFooter } from "./BlogFooter-iDkZqha6.js";
import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { n as InfoCard, r as PageHero, t as AmberPillButton } from "./UI-DM4uTVWI.js";
import { Head, Link } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
//#region resources/js/Pages/Static/Contact.jsx
function Contact() {
	const [submitted, setSubmitted] = useState(false);
	const [form, setForm] = useState({
		name: "",
		email: "",
		subject: "",
		message: ""
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white dark:bg-[#09090b] min-h-screen flex flex-col font-sans",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Contact Us | Coaching Sikar" }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx(PageHero, {
				badge: "Get In Touch",
				badgeIcon: MessageSquare,
				title: /* @__PURE__ */ jsxs(Fragment, { children: ["We'd love to ", /* @__PURE__ */ jsx("span", {
					className: "text-amber-500",
					children: "hear from you"
				})] }),
				description: "Have a question about coaching institutes, want to list your institute, or just want to say hello? Reach out — we'll get back to you quickly.",
				className: "text-center"
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-zinc-950 border-y border-slate-200 dark:border-zinc-800/60",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
					children: [
						{
							icon: Mail,
							label: "Email Us",
							value: "contact@coachingsikar.com",
							sub: "We reply within 24 hours",
							color: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
						},
						{
							icon: Phone,
							label: "Call Us",
							value: "+91 98765 43210",
							sub: "Mon – Sat, 9am – 6pm IST",
							color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
						},
						{
							icon: MapPin,
							label: "Location",
							value: "Sikar, Rajasthan, India",
							sub: "Education Hub of India",
							color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
						},
						{
							icon: Clock,
							label: "Working Hours",
							value: "9:00 AM – 6:00 PM",
							sub: "Monday to Saturday",
							color: "bg-violet-500/10 text-violet-600 dark:text-violet-400"
						}
					].map((item) => /* @__PURE__ */ jsx(AnimatedBorderCard, {
						containerClassName: "h-full",
						children: /* @__PURE__ */ jsx(InfoCard, {
							icon: item.icon,
							label: item.label,
							value: item.value,
							sub: item.sub,
							color: item.color
						})
					}, item.label))
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#09090b] flex-grow",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-8",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
								className: "text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4",
								children: ["Let's start a ", /* @__PURE__ */ jsx("span", {
									className: "text-amber-500",
									children: "conversation"
								})]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-slate-500 dark:text-zinc-400 text-base leading-relaxed",
								children: "Whether you're a student looking for the right coaching, an institute wanting to list your services, or a partner — our team is here to help."
							})] }),
							/* @__PURE__ */ jsx("div", {
								className: "space-y-3",
								children: [
									"General inquiries about the platform",
									"Business listing & verification requests",
									"Report a review or incorrect listing",
									"Press & media inquiries",
									"Partnership & collaboration opportunities"
								].map((reason) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 text-sm text-slate-600 dark:text-zinc-400",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-amber-500 shrink-0" }), reason]
								}, reason))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-slate-900 dark:bg-zinc-900 rounded-2xl p-6 border border-slate-800 dark:border-zinc-800",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "text-white font-bold mb-1",
										children: "Browse our FAQ first"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-slate-400 text-sm mb-4",
										children: "You might find a quick answer to your question there."
									}),
									/* @__PURE__ */ jsxs(AmberPillButton, {
										as: Link,
										href: "/#faq",
										children: ["View FAQ ", /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
									})
								]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "bg-slate-50 dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800 shadow-sm",
						children: submitted ? /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center justify-center py-12 text-center gap-4",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center",
									children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-8 h-8 text-emerald-600 dark:text-emerald-400" })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-extrabold text-slate-900 dark:text-white",
									children: "Message Sent!"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-slate-500 dark:text-zinc-400 text-sm max-w-xs",
									children: "Thank you for reaching out. Our team will get back to you within 24 hours."
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => {
										setSubmitted(false);
										setForm({
											name: "",
											email: "",
											subject: "",
											message: ""
										});
									},
									className: "mt-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline",
									children: "Send another message"
								})
							]
						}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xl font-extrabold text-slate-900 dark:text-white mb-6",
							children: "Send us a message"
						}), /* @__PURE__ */ jsxs("form", {
							className: "space-y-4",
							onSubmit: handleSubmit,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
										children: "Your Name"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: form.name,
										onChange: (e) => setForm({
											...form,
											name: e.target.value
										}),
										className: "w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-transparent hover:border-amber-400 dark:hover:border-amber-500 outline-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all",
										placeholder: "Rahul Sharma",
										required: true
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
										children: "Email Address"
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										value: form.email,
										onChange: (e) => setForm({
											...form,
											email: e.target.value
										}),
										className: "w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-transparent hover:border-amber-400 dark:hover:border-amber-500 outline-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all",
										placeholder: "rahul@example.com",
										required: true
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
									children: "Subject"
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: form.subject,
									onChange: (e) => setForm({
										...form,
										subject: e.target.value
									}),
									className: "w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-transparent hover:border-amber-400 dark:hover:border-amber-500 outline-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all",
									placeholder: "What's this about?",
									required: true
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
									children: "Message"
								}), /* @__PURE__ */ jsx("textarea", {
									value: form.message,
									onChange: (e) => setForm({
										...form,
										message: e.target.value
									}),
									className: "w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-transparent hover:border-amber-400 dark:hover:border-amber-500 outline-none rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all h-32 resize-none",
									placeholder: "Tell us how we can help you...",
									required: true
								})] }),
								/* @__PURE__ */ jsxs(AmberPillButton, {
									type: "submit",
									className: "w-full mt-4",
									children: [/* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }), "Send Message"]
								})
							]
						})] })
					})]
				})
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { Contact as default };
