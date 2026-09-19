import TipTapEditor from "./TipTapEditor-CjIOycpb.js";
import { Head, Link } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ArrowLeft, Building, CheckCircle, Clock, FileText, Globe, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import axios from "axios";
//#region resources/js/Pages/Business/Create.jsx
function Create({ auth }) {
	const { user } = auth;
	const [formData, setFormData] = useState({
		name: "",
		slug: "",
		category_name: "",
		description: "",
		detailed_description: "",
		website: "",
		phone: "",
		email: "",
		address: "",
		opening_hours: "",
		claimed_by_owner: true,
		faqs: [],
		services: [],
		logo: null,
		cover_image: null
	});
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [errors, setErrors] = useState({});
	useEffect(() => {
		axios.get("/api/businesses").then((res) => {}).catch((err) => console.error(err));
		setCategories([
			"SaaS & Cloud Platforms",
			"AI Tools & Models",
			"E-commerce & Retail",
			"Hospitals & Healthcare",
			"Web Hosting & Servers",
			"Coaching & Institutes",
			"Hotels & Hospitality",
			"Fintech & Banking",
			"Education"
		]);
	}, []);
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value
		}));
	};
	const handleFaqChange = (index, field, value) => {
		const updatedFaqs = [...formData.faqs];
		updatedFaqs[index][field] = value;
		setFormData((prev) => ({
			...prev,
			faqs: updatedFaqs
		}));
	};
	const addFaq = () => {
		setFormData((prev) => ({
			...prev,
			faqs: [...prev.faqs, {
				question: "",
				answer: ""
			}]
		}));
	};
	const removeFaq = (index) => {
		const updatedFaqs = formData.faqs.filter((_, i) => i !== index);
		setFormData((prev) => ({
			...prev,
			faqs: updatedFaqs
		}));
	};
	const handleServiceChange = (index, field, value) => {
		const updatedServices = [...formData.services];
		updatedServices[index][field] = value;
		setFormData((prev) => ({
			...prev,
			services: updatedServices
		}));
	};
	const addService = () => {
		setFormData((prev) => ({
			...prev,
			services: [...prev.services, {
				id: "prod-" + Date.now(),
				name: "",
				description: "",
				price: ""
			}]
		}));
	};
	const removeService = (index) => {
		const updatedServices = formData.services.filter((_, i) => i !== index);
		setFormData((prev) => ({
			...prev,
			services: updatedServices
		}));
	};
	const handleFileChange = (e) => {
		const { name, files } = e.target;
		if (files && files.length > 0) setFormData((prev) => ({
			...prev,
			[name]: files[0]
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});
		try {
			const submitData = new FormData();
			Object.keys(formData).forEach((key) => {
				if (key === "faqs") {
					const cleanedFaqs = formData.faqs.filter((f) => f.question && f.question.trim() !== "");
					submitData.append(key, window.btoa(encodeURIComponent(JSON.stringify(cleanedFaqs))));
				} else if (key === "services") {
					const cleanedServices = formData.services.filter((s) => s.name && s.name.trim() !== "");
					submitData.append(key, window.btoa(encodeURIComponent(JSON.stringify(cleanedServices))));
				} else if (key === "detailed_description") {
					if (formData[key]) submitData.append(key, window.btoa(encodeURIComponent(formData[key])));
				} else if (key === "logo" || key === "cover_image") {
					if (formData[key]) submitData.append(key, formData[key]);
				} else submitData.append(key, formData[key]);
			});
			submitData.append("user_id", user.id);
			submitData.append("_encoded_payloads", "true");
			const response = await axios.post("/api/businesses", submitData, { headers: { "Content-Type": "multipart/form-data" } });
			if (response.status === 201 || response.status === 200) {
				setSuccess(true);
				setTimeout(() => {
					window.location.href = "/dashboard";
				}, 2e3);
			}
		} catch (error) {
			if (error.response && error.response.data.errors) setErrors(error.response.data.errors);
			else setErrors({ general: "Something went wrong. Please try again." });
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white font-sans py-12 px-4 sm:px-6 lg:px-8",
		children: [/* @__PURE__ */ jsx(Head, { title: "Add Business Listing | CoachingInSikar" }), /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-screen-2xl px-4 mx-auto",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ jsxs(Link, {
						href: "/dashboard",
						className: "inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-4",
						children: [/* @__PURE__ */ jsx(ArrowLeft, {
							size: 16,
							className: "mr-2"
						}), " Back to Dashboard"]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white",
						children: "Add Your Business Listing"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-slate-600 dark:text-zinc-400",
						children: "Provide details about your business to list it on our platform and reach more customers."
					})
				]
			}), success ? /* @__PURE__ */ jsxs("div", {
				className: "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-3xl p-8 text-center shadow-sm",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4",
						children: /* @__PURE__ */ jsx(CheckCircle, { size: 32 })
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-bold text-emerald-900 dark:text-emerald-300 mb-2",
						children: "Listing Created Successfully!"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-emerald-700 dark:text-emerald-400 mb-6",
						children: "Your business has been added and is now visible on the platform."
					}),
					/* @__PURE__ */ jsx(Link, {
						href: "/dashboard",
						className: "inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-colors",
						children: "Return to Dashboard"
					})
				]
			}) : /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "bg-white dark:bg-[#09090b] shadow-xl rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-hidden relative",
				children: [
					errors.general && /* @__PURE__ */ jsx("div", {
						className: "bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-4 m-6",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-sm text-rose-700 dark:text-rose-400",
							children: errors.general
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 sm:p-10 space-y-10 relative z-10",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center",
								children: [/* @__PURE__ */ jsx(Building, {
									size: 22,
									className: "mr-3 text-amber-500"
								}), " Basic Information"]
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-6",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "md:col-span-2",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
												children: "Business/Institute Name *"
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "relative group",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
													children: /* @__PURE__ */ jsx(Building, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													name: "name",
													value: formData.name,
													onChange: handleChange,
													required: true,
													placeholder: "e.g. Acme Corporation",
													className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
												})]
											}),
											errors.name && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-xs mt-1.5 font-semibold",
												children: errors.name[0]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "md:col-span-2",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
												children: "Business Username (Custom URL)"
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "relative group",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
													children: /* @__PURE__ */ jsx("span", {
														className: "text-slate-400 group-focus-within:text-amber-500 transition-colors font-medium",
														children: "@"
													})
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													name: "slug",
													value: formData.slug,
													onChange: handleChange,
													placeholder: "e.g. acme-corp",
													className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
												})]
											}),
											/* @__PURE__ */ jsxs("p", {
												className: "text-xs text-slate-500 dark:text-zinc-400 mt-1.5 ml-2",
												children: ["This will be your unique business URL: coachinginsikar.com/biz/", /* @__PURE__ */ jsx("strong", { children: formData.slug ? formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-") : "your-username" })]
											}),
											errors.slug && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-xs mt-1.5 font-semibold",
												children: errors.slug[0]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "md:col-span-2",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
												children: "Category *"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "relative group",
												children: /* @__PURE__ */ jsxs("select", {
													name: "category_name",
													value: formData.category_name,
													onChange: handleChange,
													required: true,
													className: "block w-full px-5 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500 appearance-none",
													children: [
														/* @__PURE__ */ jsx("option", {
															value: "",
															disabled: true,
															children: "Select a category"
														}),
														categories.map((cat) => /* @__PURE__ */ jsx("option", {
															value: cat,
															children: cat
														}, cat)),
														/* @__PURE__ */ jsx("option", {
															value: "Other",
															children: "Other"
														})
													]
												})
											}),
											errors.category_name && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-xs mt-1.5 font-semibold",
												children: errors.category_name[0]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "md:col-span-2",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
												children: "Description *"
											}),
											/* @__PURE__ */ jsx("textarea", {
												name: "description",
												value: formData.description,
												onChange: handleChange,
												required: true,
												rows: "4",
												placeholder: "Tell us about your business, services, or courses...",
												className: "block w-full px-5 py-4 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-3xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500 resize-y"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 dark:text-zinc-400 mt-1.5 ml-2",
												children: "A brief overview of your business (max 1000 characters)"
											}),
											errors.description && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-xs mt-1.5 font-semibold",
												children: errors.description[0]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "md:col-span-2",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
												children: "Detailed Description (About Us)"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "bg-slate-100 dark:bg-zinc-800/80 rounded-2xl overflow-hidden border border-transparent hover:border-amber-500 transition-all",
												children: /* @__PURE__ */ jsx(TipTapEditor, {
													value: formData.detailed_description,
													onChange: (content) => setFormData((prev) => ({
														...prev,
														detailed_description: content
													}))
												})
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 dark:text-zinc-400 mt-1.5 ml-2",
												children: "Provide detailed information about your company, history, and offerings. This supports rich text."
											}),
											errors.detailed_description && /* @__PURE__ */ jsx("p", {
												className: "text-rose-500 text-xs mt-1.5 font-semibold",
												children: errors.detailed_description[0]
											})
										]
									})
								]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center",
								children: [/* @__PURE__ */ jsx(MapPin, {
									size: 22,
									className: "mr-3 text-amber-500"
								}), " Contact & Location"]
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-6",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
											children: "Website *"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative group",
											children: [/* @__PURE__ */ jsx("div", {
												className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
												children: /* @__PURE__ */ jsx(Globe, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
											}), /* @__PURE__ */ jsx("input", {
												type: "url",
												name: "website",
												value: formData.website,
												onChange: handleChange,
												required: true,
												placeholder: "https://example.com",
												className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
											})]
										}),
										errors.website && /* @__PURE__ */ jsx("p", {
											className: "text-rose-500 text-xs mt-1.5 font-semibold",
											children: errors.website[0]
										})
									] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
										children: "Phone Number"
									}), /* @__PURE__ */ jsxs("div", {
										className: "relative group",
										children: [/* @__PURE__ */ jsx("div", {
											className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
											children: /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
										}), /* @__PURE__ */ jsx("input", {
											type: "tel",
											name: "phone",
											value: formData.phone,
											onChange: handleChange,
											placeholder: "+91 9876543210",
											className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
										})]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
										children: "Email Address"
									}), /* @__PURE__ */ jsxs("div", {
										className: "relative group",
										children: [/* @__PURE__ */ jsx("div", {
											className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
											children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											name: "email",
											value: formData.email,
											onChange: handleChange,
											placeholder: "contact@business.com",
											className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
										})]
									})] }),
									/* @__PURE__ */ jsxs("div", {
										className: "md:col-span-2",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
											children: "Full Address"
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative group",
											children: [/* @__PURE__ */ jsx("div", {
												className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
												children: /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												name: "address",
												value: formData.address,
												onChange: handleChange,
												placeholder: "123 Business Street, City, State, ZIP",
												className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "md:col-span-2",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
											children: "Opening Hours"
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative group",
											children: [/* @__PURE__ */ jsx("div", {
												className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
												children: /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												name: "opening_hours",
												value: formData.opening_hours,
												onChange: handleChange,
												placeholder: "e.g., Mon-Fri: 9 AM - 6 PM",
												className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
											})]
										})]
									})
								]
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-slate-100 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center",
										children: /* @__PURE__ */ jsxs("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "16",
											height: "16",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											className: "text-indigo-500",
											children: [
												/* @__PURE__ */ jsx("rect", {
													width: "18",
													height: "18",
													x: "3",
													y: "3",
													rx: "2",
													ry: "2"
												}),
												/* @__PURE__ */ jsx("circle", {
													cx: "9",
													cy: "9",
													r: "2"
												}),
												/* @__PURE__ */ jsx("path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" })
											]
										})
									}), "Media & Branding"]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-6",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
										children: "Business Logo (Optional)"
									}), /* @__PURE__ */ jsx("input", {
										type: "file",
										name: "logo",
										accept: "image/*",
										onChange: handleFileChange,
										className: "block w-full text-sm text-slate-500 dark:text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/20 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40 cursor-pointer border border-slate-200 dark:border-zinc-700 rounded-3xl p-2 bg-slate-50 dark:bg-zinc-800/50"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
										children: "Cover Image (Optional)"
									}), /* @__PURE__ */ jsx("input", {
										type: "file",
										name: "cover_image",
										accept: "image/*",
										onChange: handleFileChange,
										className: "block w-full text-sm text-slate-500 dark:text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/20 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40 cursor-pointer border border-slate-200 dark:border-zinc-700 rounded-3xl p-2 bg-slate-50 dark:bg-zinc-800/50"
									})] })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-slate-100 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-4",
									children: [/* @__PURE__ */ jsxs("h3", {
										className: "text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center",
											children: /* @__PURE__ */ jsxs("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "16",
												height: "16",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												className: "text-emerald-500",
												children: [
													/* @__PURE__ */ jsx("path", { d: "m7.5 4.27 9 5.15" }),
													/* @__PURE__ */ jsx("path", { d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" }),
													/* @__PURE__ */ jsx("path", { d: "m3.3 7 8.7 5 8.7-5" }),
													/* @__PURE__ */ jsx("path", { d: "M12 22V12" })
												]
											})
										}), "Services & Products"]
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: addService,
										className: "inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all active:scale-[0.98]",
										children: [/* @__PURE__ */ jsx("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											className: "w-4 h-4",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "3",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" })
										}), "Add Service"]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-4",
									children: [formData.services.map((service, index) => /* @__PURE__ */ jsxs("div", {
										className: "p-5 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 space-y-4 relative shadow-sm",
										children: [
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => removeService(index),
												className: "absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-700 text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-500 transition-all",
												title: "Remove service",
												children: /* @__PURE__ */ jsx("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													className: "h-3.5 w-3.5",
													viewBox: "0 0 20 20",
													fill: "currentColor",
													children: /* @__PURE__ */ jsx("path", {
														fillRule: "evenodd",
														d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
														clipRule: "evenodd"
													})
												})
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "grid grid-cols-1 md:grid-cols-2 gap-4 pr-8",
												children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
													className: "block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5",
													children: "Service Name"
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													value: service.name,
													onChange: (e) => handleServiceChange(index, "name", e.target.value),
													placeholder: "e.g. Graphic Design",
													className: "block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500"
												})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
													className: "block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5",
													children: "Price (Optional)"
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													value: service.price,
													onChange: (e) => handleServiceChange(index, "price", e.target.value),
													placeholder: "e.g. ₹500 / hr",
													className: "block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500"
												})] })]
											}),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5",
												children: "Description"
											}), /* @__PURE__ */ jsx("textarea", {
												value: service.description,
												onChange: (e) => handleServiceChange(index, "description", e.target.value),
												placeholder: "Brief description of the service...",
												rows: "2",
												className: "block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500 resize-none"
											})] })
										]
									}, index)), formData.services.length === 0 && /* @__PURE__ */ jsx("p", {
										className: "text-sm text-slate-500 dark:text-zinc-400 italic",
										children: "No services added yet. Click \"+ Add Service\" to showcase what you offer."
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-slate-100 dark:border-zinc-800",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-4",
									children: [/* @__PURE__ */ jsxs("h3", {
										className: "text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center",
											children: /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-blue-500" })
										}), "Frequently Asked Questions"]
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: addFaq,
										className: "inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all active:scale-[0.98]",
										children: [/* @__PURE__ */ jsx("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											className: "w-4 h-4",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "3",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12h14" })
										}), "Add FAQ"]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-4",
									children: [formData.faqs.map((faq, index) => /* @__PURE__ */ jsxs("div", {
										className: "p-5 rounded-2xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 space-y-4 relative shadow-sm",
										children: [
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => removeFaq(index),
												className: "absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-700 text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-500 transition-all",
												title: "Remove FAQ",
												children: /* @__PURE__ */ jsx("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													className: "h-3.5 w-3.5",
													viewBox: "0 0 20 20",
													fill: "currentColor",
													children: /* @__PURE__ */ jsx("path", {
														fillRule: "evenodd",
														d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
														clipRule: "evenodd"
													})
												})
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "pr-8",
												children: [/* @__PURE__ */ jsx("label", {
													className: "block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5",
													children: "Question"
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													value: faq.question,
													onChange: (e) => handleFaqChange(index, "question", e.target.value),
													placeholder: "e.g. Do you offer home delivery?",
													className: "block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500"
												})]
											}),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5",
												children: "Answer"
											}), /* @__PURE__ */ jsx("textarea", {
												value: faq.answer,
												onChange: (e) => handleFaqChange(index, "answer", e.target.value),
												placeholder: "e.g. Yes, we offer free home delivery on orders above ₹500.",
												rows: "2",
												className: "block w-full px-4 py-3 bg-slate-100 dark:bg-zinc-800 border border-transparent outline-none rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-700 hover:border-amber-500 resize-none"
											})] })
										]
									}, index)), formData.faqs.length === 0 && /* @__PURE__ */ jsx("p", {
										className: "text-sm text-slate-500 dark:text-zinc-400 italic",
										children: "No FAQs added yet. Click \"+ Add FAQ\" to provide helpful answers to your customers."
									})]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "pt-4 border-t border-slate-100 dark:border-zinc-800",
								children: /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-4 cursor-pointer group",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "relative flex items-center",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											name: "claimed_by_owner",
											checked: formData.claimed_by_owner,
											onChange: handleChange,
											className: "peer sr-only"
										}), /* @__PURE__ */ jsx("div", {
											className: "w-6 h-6 border-2 border-slate-300 dark:border-zinc-700 rounded-md bg-slate-100 dark:bg-zinc-800/80 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors flex items-center justify-center",
											children: /* @__PURE__ */ jsx("svg", {
												className: "w-4 h-4 text-black opacity-0 peer-checked:opacity-100 transition-opacity",
												fill: "none",
												viewBox: "0 0 24 24",
												stroke: "currentColor",
												strokeWidth: "3",
												children: /* @__PURE__ */ jsx("path", {
													strokeLinecap: "round",
													strokeLinejoin: "round",
													d: "M5 13l4 4L19 7"
												})
											})
										})]
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
										className: "text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors flex items-center",
										children: ["I am the owner or authorized representative ", /* @__PURE__ */ jsx(ShieldCheck, {
											size: 16,
											className: "ml-1.5 text-emerald-500"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium",
										children: "By checking this, you claim ownership of this business listing and agree to our terms of service."
									})] })]
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "px-8 py-6 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800 flex justify-end items-center",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => window.history.back(),
							className: "px-6 py-3.5 mr-3 rounded-full text-sm font-bold text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: loading,
							className: "group relative inline-flex items-center justify-center px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 overflow-hidden active:scale-[0.98]",
							children: [/* @__PURE__ */ jsx("span", {
								className: "relative z-10 flex items-center gap-2",
								children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("svg", {
									className: "animate-spin -ml-1 h-4 w-4 text-black",
									xmlns: "http://www.w3.org/2000/svg",
									fill: "none",
									viewBox: "0 0 24 24",
									children: [/* @__PURE__ */ jsx("circle", {
										className: "opacity-25",
										cx: "12",
										cy: "12",
										r: "10",
										stroke: "currentColor",
										strokeWidth: "4"
									}), /* @__PURE__ */ jsx("path", {
										className: "opacity-75",
										fill: "currentColor",
										d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									})]
								}), "Submitting..."] }) : "Create Listing"
							}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 dark:via-black/5 to-transparent z-0 pointer-events-none" })]
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { Create as default };
