import TipTapEditor from "./TipTapEditor-DMg67czt.js";
import { Head, Link } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Building, CheckCircle, Clock, FileText, Globe, Loader2, Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
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
		city: "Sikar",
		opening_hours: "",
		claimed_by_owner: true,
		faqs: [],
		services: [],
		tags: [],
		social_links: {
			youtube: "",
			instagram: "",
			facebook: "",
			telegram: "",
			twitter: "",
			linkedin: ""
		},
		logo: null,
		logo_url: "",
		cover_image: null,
		cover_image_url: ""
	});
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [createdUrl, setCreatedUrl] = useState("/dashboard");
	const [errors, setErrors] = useState({});
	const [aiPromptName, setAiPromptName] = useState("");
	const [aiCity, setAiCity] = useState("Sikar");
	const [aiWebsite, setAiWebsite] = useState("");
	const [isAiResearching, setIsAiResearching] = useState(false);
	const [isScrapingWebsite, setIsScrapingWebsite] = useState(false);
	const [scrapeMessage, setScrapeMessage] = useState(null);
	const [aiStepMessage, setAiStepMessage] = useState("");
	const [aiSuccessMessage, setAiSuccessMessage] = useState(null);
	const [aiError, setAiError] = useState(null);
	const [verifiedSources, setVerifiedSources] = useState([]);
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
	const handleSocialChange = (network, value) => {
		setFormData((prev) => ({
			...prev,
			social_links: {
				...prev.social_links,
				[network]: value
			}
		}));
	};
	const handleScrapeWebsite = async (explicitUrl) => {
		const targetUrl = (typeof explicitUrl === "string" && explicitUrl ? explicitUrl : formData.website || aiWebsite || "").trim();
		if (!targetUrl) {
			setScrapeMessage("Pehle business ya institute ki official website URL enter karein.");
			return;
		}
		setIsScrapingWebsite(true);
		setScrapeMessage(null);
		try {
			const res = await axios.post("/api/ai/scrape-website", { url: targetUrl });
			if (res.data && res.data.success && res.data.data) {
				const d = res.data.data;
				const scrapedSocial = d.social_links || {};
				setFormData((prev) => ({
					...prev,
					website: d.website || targetUrl,
					phone: d.phone || "",
					email: d.email || "",
					address: d.address || "",
					logo_url: d.logo_url || prev.logo_url || "",
					cover_image_url: d.cover_image_url || prev.cover_image_url || "",
					social_links: {
						youtube: scrapedSocial.youtube || "",
						instagram: scrapedSocial.instagram || "",
						facebook: scrapedSocial.facebook || "",
						telegram: scrapedSocial.telegram || "",
						twitter: scrapedSocial.twitter || "",
						linkedin: scrapedSocial.linkedin || ""
					}
				}));
				if (d.website && !aiWebsite) setAiWebsite(d.website);
				const found = Object.keys(scrapedSocial).filter((k) => Boolean(scrapedSocial[k]));
				const mediaFound = [];
				if (d.logo_url) mediaFound.push("Logo");
				if (d.cover_image_url) mediaFound.push("Cover Image");
				setScrapeMessage(found.length > 0 || mediaFound.length > 0 ? `Official website scanned! Found ${found.length} handles (${found.join(", ")})${mediaFound.length > 0 ? ` aur ${mediaFound.join(" + ")} auto-detected` : ""}.` : `Website reachable! No public social media handles were detected on this page.`);
			}
		} catch (err) {
			console.error("Website scrape error:", err);
			const msg = err.response?.data?.message || "Could not fetch from website. Please ensure URL is valid.";
			setScrapeMessage(msg);
		} finally {
			setIsScrapingWebsite(false);
		}
	};
	const handleAiResearch = async (overrideName) => {
		const queryName = (typeof overrideName === "string" ? overrideName : aiPromptName || formData.name).trim();
		if (!queryName) {
			setAiError("Please enter an institute or business name to research.");
			return;
		}
		setIsAiResearching(true);
		setAiError(null);
		setAiSuccessMessage(null);
		setAiStepMessage(`Deep researching "${queryName}" across official portals & educational directories...`);
		const timer1 = setTimeout(() => {
			setAiStepMessage(`Verifying official website, contact helpline & campus address in ${aiCity}...`);
		}, 2200);
		const timer2 = setTimeout(() => {
			setAiStepMessage(`Compiling courses, realistic fees, official YouTube/social handles & FAQs...`);
		}, 5e3);
		const timer3 = setTimeout(() => {
			setAiStepMessage(`Structuring short overview and comprehensive rich HTML about sections...`);
		}, 8500);
		let targetWebsite = (aiWebsite || "").trim();
		if (!targetWebsite && formData.website) {
			const host = formData.website.toLowerCase();
			if (queryName.toLowerCase().split(/\s+/).filter((t) => t.length >= 3).some((t) => host.includes(t))) targetWebsite = formData.website.trim();
		}
		try {
			const response = await axios.post("/api/ai/research-business", {
				name: queryName,
				city: aiCity.trim() || "Sikar",
				category: formData.category_name || "Coaching & Institutes",
				website: targetWebsite
			});
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
			if (response.data && response.data.success && response.data.data) {
				const d = response.data.data;
				const finalName = queryName || d.name;
				if (d.website) setAiWebsite(d.website);
				else setAiWebsite("");
				setFormData((prev) => ({
					...prev,
					name: finalName,
					slug: d.slug || prev.slug,
					category_name: d.category_name || prev.category_name || "Coaching & Institutes",
					description: d.description || "",
					detailed_description: d.detailed_description || "",
					website: d.website || "",
					phone: d.phone || "",
					email: d.email || "",
					logo_url: d.logo_url || "",
					cover_image_url: d.cover_image_url || "",
					address: d.address || "",
					city: d.city || prev.city || "Sikar",
					opening_hours: d.opening_hours || "",
					services: Array.isArray(d.services) && d.services.length > 0 ? d.services : [],
					faqs: Array.isArray(d.faqs) && d.faqs.length > 0 ? d.faqs : [],
					tags: Array.isArray(d.tags) ? d.tags : [],
					social_links: {
						youtube: d.social_links?.youtube || "",
						instagram: d.social_links?.instagram || "",
						facebook: d.social_links?.facebook || "",
						telegram: d.social_links?.telegram || "",
						twitter: d.social_links?.twitter || "",
						linkedin: d.social_links?.linkedin || ""
					}
				}));
				if (Array.isArray(d.verified_sources) && d.verified_sources.length > 0) setVerifiedSources(d.verified_sources);
				setAiPromptName(finalName);
				setAiSuccessMessage(`Deep research complete for "${finalName}"! Short overview (40-70 words), long comprehensive guide, verified official handles, courses, and FAQs have all been auto-populated.`);
			} else setAiError("Could not complete AI research. Please fill manually or try again.");
		} catch (err) {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
			console.error("AI Research Error:", err);
			let errMsg = err.response?.data?.message;
			if (err.response?.status === 419) errMsg = "Session expired. Please refresh the page and try again.";
			else if (err.response?.status === 401) errMsg = "Please log in to use AI research.";
			else if (err.response?.status === 429) errMsg = "Too many requests. Please wait a minute and try again.";
			else if (!errMsg) errMsg = "AI research request timed out or network disconnected. Please check your connection and try again.";
			setAiError(errMsg);
		} finally {
			setIsAiResearching(false);
			setAiStepMessage("");
		}
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
				} else if (key === "tags") {
					if (formData[key] && Array.isArray(formData[key])) submitData.append(key, JSON.stringify(formData[key]));
				} else if (key === "social_links") {
					if (formData[key] && typeof formData[key] === "object") submitData.append(key, JSON.stringify(formData[key]));
				} else if (key === "logo" || key === "cover_image") {
					if (formData[key]) submitData.append(key, formData[key]);
				} else submitData.append(key, formData[key]);
			});
			submitData.append("user_id", user.id);
			submitData.append("_encoded_payloads", "true");
			const response = await axios.post("/api/businesses", submitData, { headers: { "Content-Type": "multipart/form-data" } });
			if (response.status === 201 || response.status === 200) {
				const createdData = response.data;
				const targetSlug = createdData?.slug || formData.slug;
				const targetCat = createdData?.category || formData.category || "coaching-institutes";
				const profilePath = targetSlug ? `/business/${targetCat}/${targetSlug}` : "/dashboard";
				setCreatedUrl(profilePath);
				setSuccess(true);
				setTimeout(() => {
					window.location.href = profilePath;
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
		children: [/* @__PURE__ */ jsx(Head, { title: "Add Business Listing | CoachingsInSikar" }), /* @__PURE__ */ jsxs("div", {
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
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-center gap-4",
						children: [/* @__PURE__ */ jsx(Link, {
							href: createdUrl,
							className: "inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-colors",
							children: "View Profile"
						}), /* @__PURE__ */ jsx(Link, {
							href: "/dashboard",
							className: "inline-block px-6 py-3 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-bold rounded-full transition-colors",
							children: "Return to Dashboard"
						})]
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
							/* @__PURE__ */ jsxs("div", {
								className: "bg-gradient-to-br from-amber-500/10 via-slate-50 to-amber-500/5 dark:from-amber-500/10 dark:via-zinc-900 dark:to-zinc-900 border-2 border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "p-2 rounded-md bg-amber-500 text-black shadow-md shadow-amber-500/20",
												children: /* @__PURE__ */ jsx(Sparkles, {
													size: 18,
													className: "animate-pulse"
												})
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
												className: "text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2",
												children: ["AI Deep Research & Auto-Fill All Form Inputs", /* @__PURE__ */ jsx("span", {
													className: "text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30",
													children: "Gemini AI"
												})]
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-600 dark:text-zinc-400 mt-0.5",
												children: "Kisi bhi institute ya business ka name enter karein. AI online deep research karke sabhi form inputs (courses, fees, address, FAQs, description) auto-fill karega."
											})] })]
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 md:grid-cols-12 gap-4",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "md:col-span-7",
												children: [/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
													children: "Institute / Business Name"
												}), /* @__PURE__ */ jsxs("div", {
													className: "relative group",
													children: [/* @__PURE__ */ jsx("div", {
														className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
														children: /* @__PURE__ */ jsx(Building, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														value: aiPromptName,
														onChange: (e) => {
															setAiPromptName(e.target.value);
															setFormData((prev) => ({
																...prev,
																name: e.target.value
															}));
														},
														onKeyDown: (e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																handleAiResearch();
															}
														},
														placeholder: "e.g. Matrix Academy Sikar, PCP Sikar, Allen Sikar...",
														className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "md:col-span-5",
												children: [/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
													children: "City / Region"
												}), /* @__PURE__ */ jsxs("div", {
													className: "relative group",
													children: [/* @__PURE__ */ jsx("div", {
														className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
														children: /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														value: aiCity,
														onChange: (e) => setAiCity(e.target.value),
														placeholder: "e.g. Sikar, Kota, Jaipur",
														className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "md:col-span-8",
												children: [/* @__PURE__ */ jsxs("label", {
													className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between",
													children: [/* @__PURE__ */ jsx("span", { children: "Official Website URL" }), /* @__PURE__ */ jsx("span", {
														className: "text-[11px] font-normal text-slate-500 dark:text-zinc-400",
														children: "(Optional – Live scrape of verified YouTube, Instagram, Facebook, Phone & Email)"
													})]
												}), /* @__PURE__ */ jsxs("div", {
													className: "relative group",
													children: [/* @__PURE__ */ jsx("div", {
														className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
														children: /* @__PURE__ */ jsx(Globe, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
													}), /* @__PURE__ */ jsx("input", {
														type: "url",
														value: aiWebsite,
														onChange: (e) => {
															setAiWebsite(e.target.value);
															setFormData((prev) => ({
																...prev,
																website: e.target.value
															}));
														},
														onKeyDown: (e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																handleAiResearch();
															}
														},
														placeholder: "e.g. https://www.matrixedu.in or https://gurukripa.ac.in",
														className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
													})]
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "md:col-span-4 flex items-end",
												children: /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => handleAiResearch(),
													disabled: isAiResearching || !aiPromptName.trim() && !formData.name.trim(),
													className: "w-full h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold text-sm rounded-full shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98]",
													children: isAiResearching ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, {
														size: 16,
														className: "animate-spin"
													}), /* @__PURE__ */ jsx("span", { children: "Researching & Scraping..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Sparkles, { size: 16 }), /* @__PURE__ */ jsx("span", { children: "Deep Research & Fill" })] })
												})
											})
										]
									}),
									isAiResearching && /* @__PURE__ */ jsxs("div", {
										className: "mt-4 pt-3.5 border-t border-amber-500/20",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2.5 text-xs font-semibold text-amber-700 dark:text-amber-400 animate-pulse",
											children: [/* @__PURE__ */ jsx(Loader2, {
												size: 15,
												className: "animate-spin shrink-0 text-amber-500"
											}), /* @__PURE__ */ jsx("span", { children: aiStepMessage })]
										}), /* @__PURE__ */ jsx("div", {
											className: "w-full bg-amber-200/50 dark:bg-amber-950/50 h-1.5 rounded-full overflow-hidden mt-2.5",
											children: /* @__PURE__ */ jsx("div", { className: "bg-amber-500 h-full w-3/4 rounded-full animate-pulse" })
										})]
									}),
									aiSuccessMessage && !isAiResearching && /* @__PURE__ */ jsxs("div", {
										className: "mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-md flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300",
										children: [/* @__PURE__ */ jsx(CheckCircle, {
											size: 16,
											className: "shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex-1",
											children: [
												/* @__PURE__ */ jsx("p", {
													className: "font-bold",
													children: aiSuccessMessage
												}),
												verifiedSources.length > 0 && /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-1.5 flex-wrap mt-1.5",
													children: [/* @__PURE__ */ jsx("span", {
														className: "font-semibold text-[11px] text-emerald-900 dark:text-emerald-200",
														children: "Verified From Official Sources:"
													}), verifiedSources.map((source, i) => /* @__PURE__ */ jsxs("span", {
														className: "inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700",
														children: ["✓ ", source]
													}, i))]
												}),
												/* @__PURE__ */ jsx("p", {
													className: "mt-1 opacity-90",
													children: "Short overview (crisp), long detailed guide (rich HTML), verified phone/website, and official social handles auto-fill ho chuke hain."
												})
											]
										})]
									}),
									aiError && !isAiResearching && /* @__PURE__ */ jsxs("div", {
										className: "mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-md flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300",
										children: [/* @__PURE__ */ jsx(AlertCircle, {
											size: 16,
											className: "shrink-0 mt-0.5 text-rose-600 dark:text-rose-400"
										}), /* @__PURE__ */ jsx("div", {
											className: "flex-1",
											children: /* @__PURE__ */ jsx("p", {
												className: "font-bold",
												children: aiError
											})
										})]
									})
								]
							}),
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
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between mb-1.5",
												children: [/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-bold text-slate-700 dark:text-zinc-300",
													children: "Business/Institute Name *"
												}), /* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => handleAiResearch(formData.name || aiPromptName),
													disabled: isAiResearching || !formData.name?.trim() && !aiPromptName?.trim(),
													className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-xs font-extrabold text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all disabled:opacity-50",
													children: [/* @__PURE__ */ jsx(Sparkles, {
														size: 13,
														className: "text-amber-500"
													}), /* @__PURE__ */ jsx("span", { children: isAiResearching ? "Researching..." : "✨ Deep Research & Auto-Fill Rest of Fields" })]
												})]
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
													onChange: (e) => {
														handleChange(e);
														setAiPromptName(e.target.value);
													},
													onKeyDown: (e) => {
														if (e.key === "Enter") {
															e.preventDefault();
															handleAiResearch(formData.name);
														}
													},
													required: true,
													placeholder: "e.g. Matrix Academy Sikar, PCP Sikar, Allen Sikar...",
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
												children: [
													"This will be your unique business URL: coachingsinsikar.com/business/",
													formData.category || "coaching-institutes",
													"/",
													/* @__PURE__ */ jsx("strong", { children: formData.slug ? formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-") : "your-username" })
												]
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
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between mb-1.5",
												children: [/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-bold text-slate-700 dark:text-zinc-300",
													children: "Short Description (Card Overview / Tagline) *"
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-xs text-slate-500 dark:text-zinc-400 font-mono",
													children: [formData.description ? formData.description.trim().split(/\s+/).filter(Boolean).length : 0, " words (Target: 40–70 words)"]
												})]
											}),
											/* @__PURE__ */ jsx("textarea", {
												name: "description",
												value: formData.description,
												onChange: handleChange,
												required: true,
												rows: "3",
												placeholder: "Short & crisp overview (40-70 words): Key competitive exams, results, and faculty specialization...",
												className: "block w-full px-5 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500 resize-y"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 dark:text-zinc-400 mt-1.5 ml-2",
												children: "Short summary: Ye listing cards aur search results me 2 lines me dikhega. Yahan short & concise data aata hai."
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
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between mb-1.5",
												children: [/* @__PURE__ */ jsx("label", {
													className: "block text-sm font-bold text-slate-700 dark:text-zinc-300",
													children: "Long Detailed Description (Comprehensive About Us / Full Guide)"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
													children: formData.detailed_description ? `${formData.detailed_description.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length} Words (Full Rich Guide)` : "Full Rich HTML"
												})]
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
												children: "Profile ke 'About Us' tab me ye pura deep guide aayega jisme Faculty, Hostels, Pedagogy, DPPs aur Test Series shamil hain."
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
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between mb-1.5",
											children: [/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300",
												children: "Website *"
											}), formData.website && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleScrapeWebsite(formData.website),
												disabled: isScrapingWebsite,
												className: "inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline disabled:opacity-50",
												children: isScrapingWebsite ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-3 h-3 animate-spin" }), " Fetching..."] }) : /* @__PURE__ */ jsx(Fragment, { children: "⚡ Fetch Social Handles" })
											})]
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
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
											className: "text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-8 h-8 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center",
												children: /* @__PURE__ */ jsx(Globe, { size: 18 })
											}), "Official Handles & Social Links (Verified)"]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
											children: "Institute ke verified official links (YouTube, Instagram, Facebook, Telegram, Twitter, LinkedIn)."
										})] }), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleScrapeWebsite(formData.website),
												disabled: isScrapingWebsite || !formData.website,
												className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all",
												title: formData.website ? "Website se official social handles fetch karein" : "Pehle Website URL daalein",
												children: isScrapingWebsite ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), " Scraping Website..."] }) : /* @__PURE__ */ jsx(Fragment, { children: "⚡ Auto-Fetch from Website" })
											}), verifiedSources.length > 0 && /* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800",
												children: "✓ Verified Handles"
											})]
										})]
									}),
									scrapeMessage && /* @__PURE__ */ jsxs("div", {
										className: "mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", { children: scrapeMessage }), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setScrapeMessage(""),
											className: "text-amber-600 hover:text-amber-800 font-bold ml-2",
											children: "✕"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-5",
										children: [
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-red-500 font-bold",
													children: "▶"
												}), " Official YouTube Channel"]
											}), /* @__PURE__ */ jsxs("div", {
												className: "relative group",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
													children: /* @__PURE__ */ jsx("span", {
														className: "text-red-500 font-extrabold text-sm",
														children: "▶"
													})
												}), /* @__PURE__ */ jsx("input", {
													type: "url",
													value: formData.social_links?.youtube || "",
													onChange: (e) => handleSocialChange("youtube", e.target.value),
													placeholder: "https://www.youtube.com/@InstituteHandle",
													className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
												})]
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-pink-500 font-bold",
													children: "📷"
												}), " Official Instagram Profile"]
											}), /* @__PURE__ */ jsxs("div", {
												className: "relative group",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
													children: /* @__PURE__ */ jsx("span", {
														className: "text-pink-500 font-extrabold text-sm",
														children: "📷"
													})
												}), /* @__PURE__ */ jsx("input", {
													type: "url",
													value: formData.social_links?.instagram || "",
													onChange: (e) => handleSocialChange("instagram", e.target.value),
													placeholder: "https://www.instagram.com/institute_handle",
													className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
												})]
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-blue-600 font-bold",
													children: "f"
												}), " Official Facebook Page"]
											}), /* @__PURE__ */ jsxs("div", {
												className: "relative group",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
													children: /* @__PURE__ */ jsx("span", {
														className: "text-blue-600 font-extrabold text-sm",
														children: "f"
													})
												}), /* @__PURE__ */ jsx("input", {
													type: "url",
													value: formData.social_links?.facebook || "",
													onChange: (e) => handleSocialChange("facebook", e.target.value),
													placeholder: "https://www.facebook.com/institute_handle",
													className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
												})]
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-sky-500 font-bold",
													children: "✈"
												}), " Official Telegram Channel"]
											}), /* @__PURE__ */ jsxs("div", {
												className: "relative group",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
													children: /* @__PURE__ */ jsx("span", {
														className: "text-sky-500 font-extrabold text-sm",
														children: "✈"
													})
												}), /* @__PURE__ */ jsx("input", {
													type: "url",
													value: formData.social_links?.telegram || "",
													onChange: (e) => handleSocialChange("telegram", e.target.value),
													placeholder: "https://t.me/institute_channel",
													className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
												})]
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-800 dark:text-zinc-200 font-bold",
													children: "𝕏"
												}), " Official X (Twitter) Profile"]
											}), /* @__PURE__ */ jsxs("div", {
												className: "relative group",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
													children: /* @__PURE__ */ jsx("span", {
														className: "text-slate-800 dark:text-zinc-200 font-extrabold text-sm",
														children: "𝕏"
													})
												}), /* @__PURE__ */ jsx("input", {
													type: "url",
													value: formData.social_links?.twitter || "",
													onChange: (e) => handleSocialChange("twitter", e.target.value),
													placeholder: "https://twitter.com/institute_handle",
													className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
												})]
											})] }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-blue-700 font-bold",
													children: "in"
												}), " Official LinkedIn Profile"]
											}), /* @__PURE__ */ jsxs("div", {
												className: "relative group",
												children: [/* @__PURE__ */ jsx("div", {
													className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
													children: /* @__PURE__ */ jsx("span", {
														className: "text-blue-700 font-extrabold text-sm",
														children: "in"
													})
												}), /* @__PURE__ */ jsx("input", {
													type: "url",
													value: formData.social_links?.linkedin || "",
													onChange: (e) => handleSocialChange("linkedin", e.target.value),
													placeholder: "https://www.linkedin.com/company/institute_handle",
													className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
												})]
											})] })
										]
									})
								]
							}),
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
									}), "Media & Branding (Logo & Background Cover)"]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-6",
									children: [/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between mb-1.5",
											children: [/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300",
												children: "Business Logo (Optional)"
											}), formData.logo_url && !formData.logo && /* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800",
												children: "⚡ Auto-fetched from website"
											})]
										}),
										(formData.logo || formData.logo_url) && /* @__PURE__ */ jsxs("div", {
											className: "mb-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center gap-3",
											children: [
												/* @__PURE__ */ jsx("img", {
													src: formData.logo ? URL.createObjectURL(formData.logo) : formData.logo_url,
													alt: "Logo preview",
													className: "w-14 h-14 rounded-xl object-contain bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 p-1 shadow-sm",
													onError: (e) => {
														e.currentTarget.style.display = "none";
													}
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex-1 min-w-0",
													children: [/* @__PURE__ */ jsx("p", {
														className: "text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate",
														children: formData.logo ? formData.logo.name : "Official Website Logo"
													}), /* @__PURE__ */ jsx("p", {
														className: "text-[11px] text-slate-500 dark:text-zinc-400",
														children: formData.logo ? "Custom file selected" : "Auto-detected & will be saved locally"
													})]
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setFormData((prev) => ({
														...prev,
														logo: null,
														logo_url: ""
													})),
													className: "text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors",
													title: "Remove logo",
													children: "Remove"
												})
											]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "file",
											name: "logo",
											accept: "image/*",
											onChange: handleFileChange,
											className: "block w-full text-sm text-slate-500 dark:text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/20 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40 cursor-pointer border border-slate-200 dark:border-zinc-700 rounded-3xl p-2 bg-slate-50 dark:bg-zinc-800/50"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-slate-400 mt-1 ml-2",
											children: "PNG, JPG, WebP ya SVG. Auto-fetched logo ko replace karne ke liye file upload karein."
										})
									] }), /* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between mb-1.5",
											children: [/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-bold text-slate-700 dark:text-zinc-300",
												children: "Cover / Background Banner (Optional)"
											}), formData.cover_image_url && !formData.cover_image && /* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800",
												children: "⚡ Auto-fetched from website"
											})]
										}),
										(formData.cover_image || formData.cover_image_url) && /* @__PURE__ */ jsxs("div", {
											className: "mb-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center gap-3",
											children: [
												/* @__PURE__ */ jsx("img", {
													src: formData.cover_image ? URL.createObjectURL(formData.cover_image) : formData.cover_image_url,
													alt: "Cover preview",
													className: "w-24 h-14 rounded-xl object-cover bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 shadow-sm",
													onError: (e) => {
														e.currentTarget.style.display = "none";
													}
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "flex-1 min-w-0",
													children: [/* @__PURE__ */ jsx("p", {
														className: "text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate",
														children: formData.cover_image ? formData.cover_image.name : "Official Website Banner"
													}), /* @__PURE__ */ jsx("p", {
														className: "text-[11px] text-slate-500 dark:text-zinc-400",
														children: formData.cover_image ? "Custom file selected" : "Auto-detected & will be saved locally"
													})]
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setFormData((prev) => ({
														...prev,
														cover_image: null,
														cover_image_url: ""
													})),
													className: "text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors",
													title: "Remove cover",
													children: "Remove"
												})
											]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "file",
											name: "cover_image",
											accept: "image/*",
											onChange: handleFileChange,
											className: "block w-full text-sm text-slate-500 dark:text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900/20 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/40 cursor-pointer border border-slate-200 dark:border-zinc-700 rounded-3xl p-2 bg-slate-50 dark:bg-zinc-800/50"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-slate-400 mt-1 ml-2",
											children: "Recommended: 1200x630 banner. Auto-fetched cover ko replace karne ke liye file upload karein."
										})
									] })]
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
										className: "inline-flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all active:scale-[0.98]",
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
										className: "inline-flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all active:scale-[0.98]",
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
							className: "px-6 py-3.5 mr-3 rounded-md text-sm font-bold text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: loading,
							className: "group relative inline-flex items-center justify-center px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-md transition-all focus:outline-none focus:ring-4 focus:ring-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 overflow-hidden active:scale-[0.98]",
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
