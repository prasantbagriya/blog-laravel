import { Link } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Award, BookOpen, Building2, Check, CheckCircle2, ChevronDown, ChevronRight, Clock, Compass, Edit3, ExternalLink, Globe, GraduationCap, HelpCircle, Languages, Link2, MapPin, MessageSquare, Phone, Plus, School, Search, Send, Share2, ShieldCheck, Sparkles, Star, ThumbsUp, TrendingUp, User, Users, X } from "lucide-react";
//#region resources/js/Pages/Reviews/components/BusinessProfileView.tsx
var ShareModal = ({ isOpen, onClose, url, title }) => {
	if (!isOpen) return null;
	const [copied, setCopied] = useState(false);
	const handleCopy = () => {
		navigator.clipboard?.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const shareLinks = [
		{
			name: "WhatsApp",
			icon: /* @__PURE__ */ jsx("svg", {
				viewBox: "0 0 24 24",
				className: "w-4 h-4 fill-current",
				children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" })
			}),
			url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + url)}`,
			color: "bg-[#25D366] text-white hover:bg-[#20bd5a]"
		},
		{
			name: "Facebook",
			icon: /* @__PURE__ */ jsx("svg", {
				viewBox: "0 0 24 24",
				className: "w-4 h-4 fill-current",
				children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" })
			}),
			url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
			color: "bg-[#1877F2] text-white hover:bg-[#166fe5]"
		},
		{
			name: "Twitter",
			icon: /* @__PURE__ */ jsx("svg", {
				viewBox: "0 0 24 24",
				className: "w-3.5 h-3.5 fill-current",
				children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
			}),
			url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
			color: "bg-[#1DA1F2] text-white hover:bg-[#1a91da]"
		},
		{
			name: "LinkedIn",
			icon: /* @__PURE__ */ jsx("svg", {
				viewBox: "0 0 24 24",
				className: "w-3.5 h-3.5 fill-current",
				children: /* @__PURE__ */ jsx("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" })
			}),
			url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
			color: "bg-[#0A66C2] text-white hover:bg-[#0958a7]"
		}
	];
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-center p-4 border-b border-slate-100 dark:border-zinc-800",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "font-semibold text-base text-slate-900 dark:text-white",
					children: "Share Institute Profile"
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-colors",
					children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-4",
				children: [/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-4 gap-3 mb-5",
					children: shareLinks.map((link) => /* @__PURE__ */ jsxs("a", {
						href: link.url,
						target: "_blank",
						rel: "noreferrer",
						className: "flex flex-col items-center gap-1.5 group",
						children: [/* @__PURE__ */ jsx("div", {
							className: `w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm ${link.color}`,
							children: link.icon
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-medium text-slate-600 dark:text-zinc-400",
							children: link.name
						})]
					}, link.name))
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative group",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none",
							children: /* @__PURE__ */ jsx(Link2, { className: "w-3.5 h-3.5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							readOnly: true,
							value: url,
							className: "block w-full pl-9 pr-20 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-amber-400 rounded-md text-xs font-normal text-slate-900 dark:text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all font-sans outline-none"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: handleCopy,
							className: `absolute inset-y-1 right-1 px-3 rounded-md font-medium text-xs transition-all active:scale-[0.98] ${copied ? "bg-emerald-500 text-white shadow-sm" : "bg-amber-500 hover:bg-amber-400 text-black shadow-sm"}`,
							children: copied ? "Copied" : "Copy"
						})
					]
				})]
			})]
		})
	});
};
var InquiryModal = ({ isOpen, onClose, business, initialCourse = "" }) => {
	if (!isOpen) return null;
	const [studentName, setStudentName] = useState("");
	const [phone, setPhone] = useState("");
	const [course, setCourse] = useState(initialCourse || "IIT-JEE Target Course");
	const [message, setMessage] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const cleanPhone = (business.phone || "919414000000").replace(/[^0-9]/g, "");
	const targetWhatsApp = cleanPhone.startsWith("91") ? cleanPhone : cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
	const handleSendWhatsApp = (e) => {
		e.preventDefault();
		try {
			const csrfToken = document.querySelector("meta[name=\"csrf-token\"]")?.getAttribute("content");
			fetch("/api/inquiries", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json",
					"X-CSRF-TOKEN": csrfToken || ""
				},
				body: JSON.stringify({
					student_name: studentName,
					phone,
					business_id: business.id,
					business_name: business.name,
					course,
					message,
					source: "profile_direct"
				})
			}).catch((err) => console.warn("Inquiry background save notice:", err));
		} catch (ignore) {}
		const queryText = `*Admission Inquiry for ${business.name}*\n\n👤 *Student Name:* ${studentName || "Interested Student"}\n📞 *Phone:* ${phone || "Not provided"}\n🎯 *Course of Interest:* ${course}\n` + (message ? `📝 *Message:* ${message}\n` : "") + `\n_Sent via Verified Directory_`;
		const waUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(queryText)}`;
		window.open(waUrl, "_blank");
		setSubmitted(true);
		setTimeout(() => {
			onClose();
			setSubmitted(false);
		}, 2e3);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider",
					children: "Direct Institute Inquiry"
				}), /* @__PURE__ */ jsxs("h3", {
					className: "font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white mt-1.5",
					children: ["Contact ", business.name]
				})] }), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors",
					"aria-label": "Close",
					children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
				})]
			}), submitted ? /* @__PURE__ */ jsxs("div", {
				className: "p-8 text-center space-y-3",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto",
						children: /* @__PURE__ */ jsx(Check, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ jsx("h4", {
						className: "text-base font-bold text-slate-900 dark:text-white",
						children: "Connecting to WhatsApp..."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 dark:text-zinc-400",
						children: "Opening WhatsApp chat with institute counseling desk."
					})
				]
			}) : /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSendWhatsApp,
				className: "p-6 space-y-4 font-sans",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
						className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
						children: ["Student / Parent Name ", /* @__PURE__ */ jsx("span", {
							className: "text-rose-500",
							children: "*"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative group",
						children: [/* @__PURE__ */ jsx("div", {
							className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
							children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							required: true,
							value: studentName,
							onChange: (e) => setStudentName(e.target.value),
							placeholder: "e.g. Rahul Sharma",
							className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
							children: ["Phone Number ", /* @__PURE__ */ jsx("span", {
								className: "text-rose-500",
								children: "*"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative group",
							children: [/* @__PURE__ */ jsx("div", {
								className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
								children: /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
							}), /* @__PURE__ */ jsx("input", {
								type: "tel",
								required: true,
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								placeholder: "e.g. 98290XXXXX",
								className: "block w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500"
							})]
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
							children: ["Target Course ", /* @__PURE__ */ jsx("span", {
								className: "text-rose-500",
								children: "*"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative group",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
									children: /* @__PURE__ */ jsx(GraduationCap, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
								}),
								/* @__PURE__ */ jsxs("select", {
									value: course,
									onChange: (e) => setCourse(e.target.value),
									className: "block w-full pl-12 pr-10 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500 cursor-pointer appearance-none",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "IIT-JEE (Main + Advanced)",
											children: "IIT-JEE (Main + Adv)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "NEET-UG Medical",
											children: "NEET-UG Medical"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Class 11-12th Foundation",
											children: "Class 11-12th Foundation"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Pre-Foundation (Class 8-10)",
											children: "Pre-Foundation (8th-10th)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Hostel & Mess Facility",
											children: "Hostel & Accommodation"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "Scholarship Test / Olympiad",
											children: "Scholarship Test Details"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "General Admission Inquiry",
											children: "General Admission Inquiry"
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors",
									children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
								})
							]
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
						className: "block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-1.5",
						children: ["Specific Query ", /* @__PURE__ */ jsx("span", {
							className: "text-slate-400 font-normal",
							children: "(Optional)"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative group",
						children: [/* @__PURE__ */ jsx("div", {
							className: "absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none",
							children: /* @__PURE__ */ jsx(MessageSquare, { className: "h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" })
						}), /* @__PURE__ */ jsx("textarea", {
							rows: 3,
							value: message,
							onChange: (e) => setMessage(e.target.value),
							placeholder: "Ask about batch timings, hostel fees, scholarship cutoffs, or syllabus...",
							className: "block w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500 resize-none"
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "pt-2 flex flex-col sm:flex-row items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 font-normal",
							children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-500 shrink-0" }), " Direct institute response"]
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all active:scale-95 cursor-pointer",
							children: [/* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }), " Send via WhatsApp"]
						})]
					})
				]
			})]
		})
	});
};
var getDefaultCourses = (business) => {
	const cat = (business.category || "").toLowerCase();
	const catName = (business.categoryName || "").toLowerCase();
	const name = (business.name || "").toLowerCase();
	const isSchool = cat.includes("education") || catName.includes("education") || name.includes("school") || name.includes("academy") || name.includes("vidyapeeth");
	const isHospital = cat.includes("hospital") || catName.includes("hospital") || name.includes("hospital") || name.includes("clinic") || name.includes("healthcare");
	const isHotel = cat.includes("hotel") || catName.includes("hotel") || name.includes("hotel") || name.includes("resort");
	const isTech = cat.includes("saas") || cat.includes("ai") || cat.includes("hosting") || catName.includes("cloud") || catName.includes("software");
	if (isSchool) return [
		{
			id: "c-1",
			name: "CBSE Senior Secondary (Science, Commerce & Arts)",
			description: "Complete curriculum aligned with CBSE New Delhi, smart multimedia classrooms, experienced subject faculty, and integrated foundations.",
			price: "Class 11th & 12th"
		},
		{
			id: "c-2",
			name: "Pre-Foundation & NTSE / Olympiad Program",
			description: "Conceptual mastery in Mathematics, Science, and Mental Ability for Classes 6th to 10th preparing for NTSE, IJSO, and competitive Olympiads.",
			price: "Class 6th to 10th"
		},
		{
			id: "c-3",
			name: "NDA & Career Integrated Foundation",
			description: "Dual excellence model combining school syllabus with physical fitness training, personality grooming, and competitive preparation.",
			price: "Secondary & Sr. Secondary"
		},
		{
			id: "c-4",
			name: "Residential Hostels & Sports Facilities",
			description: "Secure, modern residential campus for boys and girls with athletic tracks, sports coaching, and hygienic vegetarian mess.",
			price: "Day Boarding / Residential"
		}
	];
	if (isHospital) return [
		{
			id: "h-1",
			name: "24/7 Emergency & Trauma Care",
			description: "Immediate critical care response, life support ambulances, and ICU resuscitation team available round the clock.",
			price: "24/7 Available"
		},
		{
			id: "h-2",
			name: "Specialist OPD Consultations",
			description: "Expert medical consultations across Cardiology, Orthopedics, Pediatrics, Neurology, and General Medicine.",
			price: "Daily OPD"
		},
		{
			id: "h-3",
			name: "Digital Pathology & Advanced Diagnostics",
			description: "Automated clinical pathology, digital X-Ray, Ultrasound, CT Scan, and fast computerized reporting.",
			price: "Diagnostic Suite"
		},
		{
			id: "h-4",
			name: "Inpatient Care & Modular Operation Theaters",
			description: "Infection-controlled modular surgical suites with private rooms and comprehensive nursing care.",
			price: "IPD Facilities"
		}
	];
	if (isHotel) return [
		{
			id: "ht-1",
			name: "Deluxe & Executive Suite Accommodations",
			description: "Air-conditioned rooms featuring premium bedding, high-speed Wi-Fi, work desks, and 24-hour room service.",
			price: "Daily Rates"
		},
		{
			id: "ht-2",
			name: "Banquet & Conference Event Spaces",
			description: "Spacious banquet halls and boardrooms equipped with modern audiovisual systems for weddings and corporate meets.",
			price: "Event Packages"
		},
		{
			id: "ht-3",
			name: "Multi-Cuisine Fine Dining Restaurant",
			description: "Freshly prepared vegetarian and gourmet delicacies crafted by experienced chefs in an elegant ambiance.",
			price: "Dining & Catering"
		}
	];
	if (isTech) return [
		{
			id: "t-1",
			name: "Core Platform & Cloud Services",
			description: "Full feature suites, automated workflows, real-time analytics, and standard technical support.",
			price: "Monthly / Annual Plans"
		},
		{
			id: "t-2",
			name: "Enterprise Deployments & Dedicated Support",
			description: "Tailored enterprise architectures with 99.9% uptime SLA and dedicated account managers.",
			price: "Custom Enterprise"
		},
		{
			id: "t-3",
			name: "Developer API & Integration Suite",
			description: "High-throughput REST and GraphQL endpoints with comprehensive documentation and SDK libraries.",
			price: "API Access"
		}
	];
	return [
		{
			id: "c-1",
			name: "IIT-JEE 2-Year Target Course",
			description: "Comprehensive 2-year classroom preparation for JEE (Main & Advanced) with daily DPPs, Kota/Sikar experienced faculty, and weekly computer-based test series.",
			price: "Class 11th & 12th"
		},
		{
			id: "c-2",
			name: "NEET-UG Medical Target Course",
			description: "Rigorous medical entrance program focusing on NCERT mastery, high-yield biology modules, physics problem solving, and full-syllabus mock tests.",
			price: "Class 11th, 12th & Droppers"
		},
		{
			id: "c-3",
			name: "Pre-Foundation & NTSE / Olympiad",
			description: "Early competitive edge for classes 8th to 10th covering advanced Math, Science, Mental Ability, and State/National Olympiad syllabus.",
			price: "Class 8th to 10th"
		},
		{
			id: "c-4",
			name: "Integrated Schooling + Coaching Program",
			description: "Dual excellence model combining CBSE/RBSE school curriculum with competitive coaching, saving daily travel time and maximizing self-study.",
			price: "Day Boarding / Residential"
		}
	];
};
var getDefaultFaqs = (business) => {
	const addressText = business.address || (business.city ? `${business.city}, Rajasthan` : "our campus");
	return [
		{
			question: `What is the admission / inquiry procedure for ${business.name}?`,
			answer: `Inquiries and admissions are processed directly at the campus office or online. Students and visitors can visit the campus at ${addressText} or connect via official helpline to reserve seats or schedule visits.`
		},
		{
			question: `Does ${business.name} provide hostel and food facilities?`,
			answer: `Yes, dedicated, secure hostel facilities are available separately for boys and girls with hygienic mess dining, 24/7 CCTV surveillance, warden supervision, and quiet study areas.`
		},
		{
			question: `What scholarship options are available for meritorious students?`,
			answer: `Scholarships up to 90% in tuition fees are awarded based on qualifying marks, merit criteria, or performance in periodic scholarship entrance tests.`
		},
		{
			question: `How does the institute support students with doubt resolution?`,
			answer: `The institute provides daily one-on-one doubt counters staffed by subject-matter faculty members after regular lecture hours to ensure no conceptual backlog remains.`
		},
		{
			question: `What is the frequency of test series and performance reporting?`,
			answer: `Evaluations and test series are conducted periodically with detailed analytical reports shared with parents and students.`
		}
	];
};
var campusFacilities = [
	{
		icon: School,
		title: "Top Tier Kota & Sikar Faculty",
		desc: "Seasoned educators with over a decade of proven track record producing top AIRs in JEE and NEET.",
		color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
	},
	{
		icon: BookOpen,
		title: "Exhaustive Study Material & DPPs",
		desc: "Research-backed module theory, graded exercises, daily problem sheets, and previous 15 years solved papers.",
		color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
	},
	{
		icon: Award,
		title: "CBT Lab & All-India Test Series",
		desc: "State-of-the-art computer testing center providing real exam simulation, AIR ranking, and percentile benchmarking.",
		color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
	},
	{
		icon: Building2,
		title: "Separate Boys & Girls Hostels",
		desc: "Hygienic mess offering nutritious meals, air-cooled/AC rooms, 24/7 security, and dedicated evening study hours.",
		color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
	},
	{
		icon: Users,
		title: "Personalized 1-on-1 Doubt Desks",
		desc: "Subject teachers available throughout the day to resolve individual doubts, ensuring zero conceptual gaps.",
		color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20"
	},
	{
		icon: ShieldCheck,
		title: "Biometric Attendance & Parent App",
		desc: "Instant automated SMS & app notifications to parents for attendance, lecture progress, and test score cards.",
		color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
	}
];
var getSocialMeta = (network) => {
	const n = network.toLowerCase();
	if (n.includes("youtube")) return {
		label: "YouTube Channel",
		shortLabel: "YouTube",
		badgeBg: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-800/40 hover:bg-red-100",
		icon: /* @__PURE__ */ jsx("svg", {
			className: "w-3.5 h-3.5 fill-current shrink-0",
			viewBox: "0 0 24 24",
			children: /* @__PURE__ */ jsx("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" })
		})
	};
	if (n.includes("instagram")) return {
		label: "Instagram Page",
		shortLabel: "Instagram",
		badgeBg: "bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400 border-pink-200 dark:border-pink-800/40 hover:bg-pink-100",
		icon: /* @__PURE__ */ jsx("svg", {
			className: "w-3.5 h-3.5 fill-current shrink-0",
			viewBox: "0 0 24 24",
			children: /* @__PURE__ */ jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" })
		})
	};
	if (n.includes("telegram")) return {
		label: "Telegram Channel",
		shortLabel: "Telegram",
		badgeBg: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200 dark:border-sky-800/40 hover:bg-sky-100",
		icon: /* @__PURE__ */ jsx("svg", {
			className: "w-3.5 h-3.5 fill-current shrink-0",
			viewBox: "0 0 24 24",
			children: /* @__PURE__ */ jsx("path", { d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" })
		})
	};
	if (n.includes("facebook")) return {
		label: "Facebook Page",
		shortLabel: "Facebook",
		badgeBg: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/40 hover:bg-blue-100",
		icon: /* @__PURE__ */ jsx("svg", {
			className: "w-3.5 h-3.5 fill-current shrink-0",
			viewBox: "0 0 24 24",
			children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" })
		})
	};
	if (n.includes("linkedin")) return {
		label: "LinkedIn Profile",
		shortLabel: "LinkedIn",
		badgeBg: "bg-blue-50 text-sky-700 dark:bg-blue-950/40 dark:text-sky-400 border-sky-300 dark:border-sky-800/40 hover:bg-sky-100",
		icon: /* @__PURE__ */ jsx("svg", {
			className: "w-3.5 h-3.5 fill-current shrink-0",
			viewBox: "0 0 24 24",
			children: /* @__PURE__ */ jsx("path", { d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" })
		})
	};
	return {
		label: "X (Twitter)",
		shortLabel: "Twitter / X",
		badgeBg: "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 border-slate-300 dark:border-zinc-700 hover:bg-slate-200",
		icon: /* @__PURE__ */ jsx("svg", {
			className: "w-3.5 h-3.5 fill-current shrink-0",
			viewBox: "0 0 24 24",
			children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
		})
	};
};
var BusinessProfileView = ({ business, reviews, allBusinesses, onOpenWriteReview, onVoteHelpful, onAddReply }) => {
	const [activeTab, setActiveTab] = useState("overview");
	const [reviewFilterRating, setReviewFilterRating] = useState("all");
	const [verifiedOnly, setVerifiedOnly] = useState(false);
	const [reviewSearchQuery, setReviewSearchQuery] = useState("");
	const [showShareModal, setShowShareModal] = useState(false);
	const [showInquiryModal, setShowInquiryModal] = useState(false);
	const [selectedCourseForInquiry, setSelectedCourseForInquiry] = useState("");
	const [selectedCompetitorId, setSelectedCompetitorId] = useState("");
	const [competitorReport, setCompetitorReport] = useState(null);
	const [isLoadingCompetitorReport, setIsLoadingCompetitorReport] = useState(false);
	const [replyingReviewId, setReplyingReviewId] = useState(null);
	const [replyText, setReplyText] = useState("");
	const [translatedReviewIds, setTranslatedReviewIds] = useState({});
	const [openFaqIndex, setOpenFaqIndex] = useState(0);
	const filteredReviews = useMemo(() => {
		return reviews.filter((r) => {
			if (reviewFilterRating !== "all" && r.rating !== reviewFilterRating) return false;
			if (verifiedOnly && !r.isVerifiedPurchase) return false;
			if (reviewSearchQuery.trim()) {
				const q = reviewSearchQuery.toLowerCase();
				return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.reviewerName.toLowerCase().includes(q);
			}
			return true;
		});
	}, [
		reviews,
		reviewFilterRating,
		verifiedOnly,
		reviewSearchQuery
	]);
	const ratingDistribution = useMemo(() => {
		if (business.ratingDistribution && Object.keys(business.ratingDistribution).length > 0) return business.ratingDistribution;
		const dist = {
			5: 0,
			4: 0,
			3: 0,
			2: 0,
			1: 0
		};
		if (reviews.length > 0) {
			reviews.forEach((r) => {
				const star = Math.min(5, Math.max(1, Math.round(r.rating)));
				dist[star] = (dist[star] || 0) + 1;
			});
			return dist;
		}
		const count = business.reviewCount || 24;
		return {
			5: Math.round(count * .75),
			4: Math.round(count * .18),
			3: Math.round(count * .05),
			2: Math.round(count * .01),
			1: Math.round(count * .01)
		};
	}, [
		business.ratingDistribution,
		reviews,
		business.reviewCount
	]);
	const totalReviewsInDist = useMemo(() => {
		return Object.values(ratingDistribution).reduce((a, b) => a + Number(b), 0) || 1;
	}, [ratingDistribution]);
	const cleanPhone = useMemo(() => {
		const cleaned = (business.phone || "919414000000").replace(/[^0-9]/g, "");
		return cleaned.startsWith("91") ? cleaned : cleaned.length === 10 ? `91${cleaned}` : cleaned;
	}, [business.phone]);
	const directWhatsAppUrl = useMemo(() => {
		const msg = `Hello ${business.name}, I found your listing on the directory and would like to receive details regarding admissions, services, and fee structures.`;
		return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
	}, [business.name, cleanPhone]);
	const googleMapsUrl = useMemo(() => {
		const query = `${business.name} ${business.address || ""} ${business.city || "Sikar"} Rajasthan`;
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
	}, [
		business.name,
		business.address,
		business.city
	]);
	useMemo(() => {
		if (business.tags && business.tags.length > 0) return business.tags;
		return [
			business.categoryName || "Verified Institute",
			`${business.city || "Sikar"} Campus`,
			"Verified Listing",
			"Official Helpline",
			"Direct Admissions",
			"Hostel & Mess"
		];
	}, [
		business.tags,
		business.categoryName,
		business.city
	]);
	const categoryScores = useMemo(() => {
		if (business.categoryAverages && Object.keys(business.categoryAverages).length > 0) return business.categoryAverages;
		return {
			"Faculty Quality": 4.9,
			"Test Series & Results": 4.8,
			"Study Modules": 4.7,
			"Doubt Clearing": 4.7,
			"Campus & Hostel": 4.6
		};
	}, [business.categoryAverages]);
	const socialLinks = useMemo(() => {
		const raw = business.socialLinks || business.social_links || {};
		return Object.entries(raw).filter(([_, url]) => Boolean(url && typeof url === "string" && url.trim()));
	}, [business.socialLinks, business.social_links]);
	const coursesList = useMemo(() => {
		if (business.products && business.products.length > 0) return business.products;
		return getDefaultCourses(business);
	}, [business.products, business]);
	const faqsList = useMemo(() => {
		if (business.faqs && business.faqs.length > 0) return business.faqs;
		return getDefaultFaqs(business);
	}, [business.faqs, business]);
	const handleRunCompetitorComparison = async () => {
		if (!selectedCompetitorId) return;
		setIsLoadingCompetitorReport(true);
		try {
			const data = await (await fetch("/api/ai/competitor-compare", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					targetBusinessId: business.id,
					competitorBusinessId: selectedCompetitorId
				})
			})).json();
			setCompetitorReport(data);
		} catch (err) {
			console.error("Competitor report error:", err);
		} finally {
			setIsLoadingCompetitorReport(false);
		}
	};
	const handleTranslateReview = (reviewId) => {
		if (translatedReviewIds[reviewId]) {
			const newMap = { ...translatedReviewIds };
			delete newMap[reviewId];
			setTranslatedReviewIds(newMap);
		} else setTranslatedReviewIds({
			...translatedReviewIds,
			[reviewId]: "AI Translation (Hindi): \"इस संस्थान के साथ हमारा अनुभव बहुत शानदार रहा। फेकल्टी का सपोर्ट और डाउट सॉल्विंग क्लास बहुत ही व्यवस्थित है। हमारे बच्चे के रिजल्ट में काफी सुधार आया।\""
		});
	};
	const handlePostReply = (reviewId) => {
		if (replyText.trim()) {
			onAddReply(reviewId, replyText.trim());
			setReplyingReviewId(null);
			setReplyText("");
		}
	};
	const isOwner = Boolean(business.canEdit);
	const tabs = [
		{
			id: "overview",
			label: "Overview",
			icon: Building2
		},
		{
			id: "courses",
			label: "Courses & Fees",
			icon: GraduationCap,
			count: coursesList.length
		},
		{
			id: "reviews",
			label: "Reviews",
			icon: Star,
			count: business.reviewCount || reviews.length
		},
		{
			id: "ai_insights",
			label: "AI Insights",
			icon: Sparkles
		},
		{
			id: "competitors",
			label: "Compare",
			icon: TrendingUp
		},
		{
			id: "faqs",
			label: "FAQs",
			icon: HelpCircle,
			count: faqsList.length
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20 transition-colors font-sans selection:bg-amber-500/20 selection:text-amber-600",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("nav", {
						className: "flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 overflow-x-auto hide-scrollbar whitespace-nowrap",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/",
								className: "hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
								children: "Home"
							}),
							/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-slate-400 shrink-0" }),
							/* @__PURE__ */ jsx(Link, {
								href: "/business",
								className: "hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
								children: "Directory"
							}),
							/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-slate-400 shrink-0" }),
							/* @__PURE__ */ jsx(Link, {
								href: `/business/${business.category || "coaching-institutes"}`,
								className: "hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
								children: business.categoryName || "Coaching Institutes"
							}),
							/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-slate-400 shrink-0" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-slate-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-xs",
								children: business.name
							})
						]
					}), /* @__PURE__ */ jsxs(Link, {
						href: "/business",
						className: "hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }), " Back"]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative h-44 sm:h-52 md:h-60 w-full overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900",
							children: [
								business.coverImage ? /* @__PURE__ */ jsx("img", {
									src: business.coverImage,
									alt: `${business.name} Campus`,
									className: "w-full h-full object-cover opacity-65"
								}) : /* @__PURE__ */ jsx("div", { className: "w-full h-full opacity-30 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" }),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10",
									children: business.isVerified && /* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/90 text-white backdrop-blur-md shadow-sm text-xs font-medium",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5" }), " Verified Institute"]
									})
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "px-4 sm:px-6 lg:px-8 pb-6 pt-0 relative",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "relative shrink-0 z-10",
										children: [/* @__PURE__ */ jsx("img", {
											src: business.logo || "/uploads/logo.webp",
											alt: business.name,
											className: "w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-xl bg-white"
										}), /* @__PURE__ */ jsx("div", {
											className: "absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white shadow-sm",
											title: "Active Institute",
											children: /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 sm:w-3.5 sm:h-3.5" })
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 sm:gap-4 bg-slate-50 dark:bg-zinc-800/80 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 shrink-0 shadow-sm",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-none",
													children: Number(business.rating || 4.8).toFixed(1)
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
													className: "flex items-center text-amber-500",
													children: [
														1,
														2,
														3,
														4,
														5
													].map((s) => /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" }, s))
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-400",
													children: [business.reviewCount?.toLocaleString() || reviews.length || "24", " reviews"]
												})] })]
											}),
											/* @__PURE__ */ jsx("div", { className: "w-px h-7 bg-slate-200 dark:bg-zinc-700" }),
											/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-baseline gap-0.5",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 leading-none",
													children: business.trustScore || 94
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[10px] text-slate-400",
													children: "/100"
												})]
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-1",
												children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" }), " Trust Score"]
											})] })
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-2 mb-1.5",
										children: [/* @__PURE__ */ jsx("h1", {
											className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight",
											children: business.name
										}), business.isVerified && /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-800",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " Verified"]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-zinc-400",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/40",
												children: business.categoryName || "Coaching Institute"
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-rose-500 shrink-0" }), /* @__PURE__ */ jsx("span", { children: business.address || `${business.city || "Sikar"}, Rajasthan` })]
											}),
											business.website && /* @__PURE__ */ jsxs("a", {
												href: business.website,
												target: "_blank",
												rel: "noreferrer",
												className: "inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
												children: [
													/* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5 text-blue-500 shrink-0" }),
													" Website ",
													/* @__PURE__ */ jsx(ExternalLink, { className: "w-2.5 h-2.5" })
												]
											}),
											socialLinks.map(([network, url]) => {
												const meta = getSocialMeta(network);
												return /* @__PURE__ */ jsxs("a", {
													href: url,
													target: "_blank",
													rel: "noreferrer",
													className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium transition-all ${meta.badgeBg}`,
													title: `Official ${meta.label} of ${business.name}`,
													children: [
														meta.icon,
														/* @__PURE__ */ jsx("span", { children: meta.shortLabel }),
														/* @__PURE__ */ jsx(ExternalLink, { className: "w-2 h-2 opacity-70" })
													]
												}, network);
											})
										]
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-4xl line-clamp-2 mb-4 font-sans",
									children: business.description || `${business.name} is a leading ${business.categoryName || "organization"} in ${business.city || "Sikar"}, offering verified services and top-quality facilities.`
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto hide-scrollbar flex-nowrap w-full",
									style: { WebkitOverflowScrolling: "touch" },
									children: [
										/* @__PURE__ */ jsxs("a", {
											href: directWhatsAppUrl,
											target: "_blank",
											rel: "noreferrer",
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm transition-all active:scale-95 shrink-0 whitespace-nowrap",
											children: [/* @__PURE__ */ jsx("svg", {
												viewBox: "0 0 24 24",
												className: "w-3.5 h-3.5 fill-current shrink-0",
												children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" })
											}), /* @__PURE__ */ jsx("span", { children: "WhatsApp" })]
										}),
										business.phone && /* @__PURE__ */ jsxs("a", {
											href: `tel:${business.phone}`,
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200/40 dark:border-zinc-700 shadow-sm transition-all active:scale-95 shrink-0 whitespace-nowrap",
											children: [/* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Call Now" })]
										}),
										/* @__PURE__ */ jsxs("button", {
											onClick: () => {
												setSelectedCourseForInquiry("General Admission Inquiry");
												setShowInquiryModal(true);
											},
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all active:scale-95 shrink-0 whitespace-nowrap",
											children: [/* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Enquire Now" })]
										}),
										/* @__PURE__ */ jsxs("button", {
											onClick: () => onOpenWriteReview(business.id),
											className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs bg-amber-500 hover:bg-amber-400 text-black shadow-sm transition-all active:scale-95 shrink-0 whitespace-nowrap",
											children: [/* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-current shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Write Review" })]
										}),
										/* @__PURE__ */ jsxs("button", {
											onClick: () => setShowShareModal(true),
											className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors shrink-0 whitespace-nowrap",
											title: "Share this institute",
											children: [/* @__PURE__ */ jsx(Share2, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Share" })]
										}),
										isOwner && /* @__PURE__ */ jsxs(Link, {
											href: `/businesses/${business.slug || business.id}/edit`,
											className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium text-xs bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors shrink-0 whitespace-nowrap",
											children: [/* @__PURE__ */ jsx(Edit3, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Manage" })]
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "border-b border-slate-200 dark:border-zinc-800 mb-6",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-6 overflow-x-auto hide-scrollbar flex-nowrap",
							style: { WebkitOverflowScrolling: "touch" },
							children: tabs.map((tab) => {
								const isActive = activeTab === tab.id;
								const Icon = tab.icon;
								return /* @__PURE__ */ jsxs("button", {
									onClick: () => setActiveTab(tab.id),
									className: `flex items-center gap-1.5 py-3 border-b-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${isActive ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-semibold" : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"}`,
									children: [
										/* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5 shrink-0" }),
										/* @__PURE__ */ jsx("span", { children: tab.label }),
										typeof tab.count !== "undefined" && /* @__PURE__ */ jsx("span", {
											className: `text-[10px] px-1.5 py-0.2 rounded-full font-medium ${isActive ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400"}`,
											children: tab.count
										})
									]
								}, tab.id);
							})
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-8 space-y-6",
							children: [
								activeTab === "overview" && /* @__PURE__ */ jsxs("div", {
									className: "space-y-6 animate-in fade-in duration-300",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm",
											children: [
												/* @__PURE__ */ jsxs("h2", {
													className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2",
													children: [
														/* @__PURE__ */ jsx(Building2, { className: "w-4 h-4 text-blue-600 dark:text-blue-400" }),
														" About ",
														business.name
													]
												}),
												business.detailedDescription || business.detailed_description ? /* @__PURE__ */ jsx("div", {
													className: "prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-sans",
													dangerouslySetInnerHTML: { __html: business.detailedDescription || business.detailed_description || "" }
												}) : /* @__PURE__ */ jsxs("div", {
													className: "space-y-2 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-sans",
													children: [/* @__PURE__ */ jsx("p", { children: business.description }), /* @__PURE__ */ jsxs("p", { children: [business.name, " is one of the landmark education institutions in Sikar, Rajasthan. With a dedicated panel of subject mentors, rigorous test patterns, and holistic student mentoring, the institute prepares aspirants for competitive engineering and medical entrance examinations alongside solid board fundamentals."] })]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5",
													children: [
														/* @__PURE__ */ jsxs("div", {
															className: "p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-center",
															children: [/* @__PURE__ */ jsx("div", {
																className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white",
																children: "Offline"
															}), /* @__PURE__ */ jsx("div", {
																className: "text-[10px] text-slate-500 dark:text-zinc-400",
																children: "Classroom Mode"
															})]
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-center",
															children: [/* @__PURE__ */ jsx("div", {
																className: "text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400",
																children: "Eng / Hin"
															}), /* @__PURE__ */ jsx("div", {
																className: "text-[10px] text-slate-500 dark:text-zinc-400",
																children: "Medium"
															})]
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-center",
															children: [/* @__PURE__ */ jsx("div", {
																className: "text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400",
																children: "Available"
															}), /* @__PURE__ */ jsx("div", {
																className: "text-[10px] text-slate-500 dark:text-zinc-400",
																children: "Hostel Facility"
															})]
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-center",
															children: [/* @__PURE__ */ jsx("div", {
																className: "text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400",
																children: "Up to 90%"
															}), /* @__PURE__ */ jsx("div", {
																className: "text-[10px] text-slate-500 dark:text-zinc-400",
																children: "Scholarships"
															})]
														})
													]
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "mb-4",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider",
													children: "Infrastructure"
												}), /* @__PURE__ */ jsx("h2", {
													className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5",
													children: "Key Campus Facilities"
												})]
											}), /* @__PURE__ */ jsx("div", {
												className: "grid grid-cols-1 md:grid-cols-2 gap-3",
												children: campusFacilities.map((fac, idx) => {
													const Icon = fac.icon;
													return /* @__PURE__ */ jsxs("div", {
														className: "p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-700/70 flex items-start gap-3",
														children: [/* @__PURE__ */ jsx("div", {
															className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${fac.color}`,
															children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
														}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
															className: "font-semibold text-xs sm:text-sm text-slate-900 dark:text-white mb-0.5",
															children: fac.title
														}), /* @__PURE__ */ jsx("p", {
															className: "text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans",
															children: fac.desc
														})] })]
													}, idx);
												})
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800",
												children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
													className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
													children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-rose-500" }), " Campus Address & Directions"]
												}), /* @__PURE__ */ jsx("p", {
													className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
													children: "Visit the admissions counseling center"
												})] }), /* @__PURE__ */ jsxs("a", {
													href: googleMapsUrl,
													target: "_blank",
													rel: "noreferrer",
													className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors",
													children: [
														/* @__PURE__ */ jsx(Compass, { className: "w-3.5 h-3.5" }),
														" Open in Google Maps ",
														/* @__PURE__ */ jsx(ExternalLink, { className: "w-2.5 h-2.5" })
													]
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 flex items-start gap-3",
												children: [/* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-rose-500 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
													className: "text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-sans",
													children: [/* @__PURE__ */ jsx("strong", {
														className: "block text-slate-900 dark:text-white font-semibold",
														children: business.name
													}), business.address || `${business.city || "Sikar"}, Rajasthan, India`]
												})]
											})]
										})
									]
								}),
								activeTab === "courses" && /* @__PURE__ */ jsxs("div", {
									className: "space-y-4 animate-in fade-in duration-300",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm",
										children: [/* @__PURE__ */ jsx("h2", {
											className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white",
											children: "Courses & Fee Structure"
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-xs text-slate-500 dark:text-zinc-400 mt-0.5",
											children: [
												"Classroom programs, eligibility criteria, and syllabus modules offered by ",
												business.name,
												"."
											]
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "grid grid-cols-1 gap-3",
										children: coursesList.map((course, idx) => /* @__PURE__ */ jsx("div", {
											className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex flex-col sm:flex-row items-start justify-between gap-3",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "space-y-1 flex-1",
													children: [
														/* @__PURE__ */ jsxs("div", {
															className: "flex flex-wrap items-center gap-2",
															children: [/* @__PURE__ */ jsx("h3", {
																className: "font-semibold text-sm sm:text-base text-slate-900 dark:text-white",
																children: course.name
															}), course.price && /* @__PURE__ */ jsx("span", {
																className: "px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40",
																children: course.price
															})]
														}),
														/* @__PURE__ */ jsx("p", {
															className: "text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans",
															children: course.description
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "flex flex-wrap gap-1.5 pt-1.5",
															children: [
																/* @__PURE__ */ jsxs("span", {
																	className: "text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center gap-1 font-sans",
																	children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-emerald-500" }), " Daily DPPs"]
																}),
																/* @__PURE__ */ jsxs("span", {
																	className: "text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center gap-1 font-sans",
																	children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-emerald-500" }), " Test Series"]
																}),
																/* @__PURE__ */ jsxs("span", {
																	className: "text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center gap-1 font-sans",
																	children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-emerald-500" }), " Doubt Sessions"]
																})
															]
														})
													]
												}), /* @__PURE__ */ jsx("button", {
													onClick: () => {
														setSelectedCourseForInquiry(course.name);
														setShowInquiryModal(true);
													},
													className: "w-auto px-3.5 py-1.5 rounded-md font-medium text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all active:scale-95 shrink-0 whitespace-nowrap self-start sm:self-center",
													children: "Inquire Details"
												})]
											})
										}, course.id || idx))
									})]
								}),
								activeTab === "reviews" && /* @__PURE__ */ jsxs("div", {
									className: "space-y-4 animate-in fade-in duration-300",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 shadow-sm",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex flex-col md:flex-row items-center gap-6 justify-between",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "text-center md:text-left shrink-0",
													children: [
														/* @__PURE__ */ jsxs("div", {
															className: "text-4xl font-bold text-slate-900 dark:text-white mb-1",
															children: [Number(business.rating || 4.8).toFixed(1), /* @__PURE__ */ jsx("span", {
																className: "text-base text-slate-400 font-normal",
																children: " / 5.0"
															})]
														}),
														/* @__PURE__ */ jsx("div", {
															className: "flex items-center justify-center md:justify-start gap-1 text-amber-500 mb-1",
															children: [
																1,
																2,
																3,
																4,
																5
															].map((s) => /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-current" }, s))
														}),
														/* @__PURE__ */ jsxs("p", {
															className: "text-xs text-slate-500 dark:text-zinc-400",
															children: [
																"Based on ",
																business.reviewCount?.toLocaleString() || reviews.length || "24",
																" authentic student ratings"
															]
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium",
															children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " 96% students recommend this institute"]
														})
													]
												}), /* @__PURE__ */ jsx("div", {
													className: "flex-1 w-full space-y-1.5",
													children: [
														5,
														4,
														3,
														2,
														1
													].map((star) => {
														const count = ratingDistribution[star] || 0;
														const pct = Math.round(Number(count) / totalReviewsInDist * 100);
														const isFiltered = reviewFilterRating === star;
														return /* @__PURE__ */ jsxs("button", {
															onClick: () => setReviewFilterRating(isFiltered ? "all" : star),
															className: `w-full flex items-center gap-2.5 text-xs font-medium group text-left p-1 rounded-md transition-colors ${isFiltered ? "bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-400" : "hover:bg-slate-50 dark:hover:bg-zinc-800"}`,
															children: [
																/* @__PURE__ */ jsxs("span", {
																	className: "w-8 text-slate-600 dark:text-zinc-400 shrink-0 flex items-center gap-1",
																	children: [
																		star,
																		" ",
																		/* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-amber-500 text-amber-500" })
																	]
																}),
																/* @__PURE__ */ jsx("div", {
																	className: "flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden",
																	children: /* @__PURE__ */ jsx("div", {
																		className: "h-full bg-amber-500 rounded-full transition-all duration-500 group-hover:bg-amber-400",
																		style: { width: `${pct}%` }
																	})
																}),
																/* @__PURE__ */ jsxs("span", {
																	className: "w-8 text-right text-slate-400 dark:text-zinc-500 text-[11px] font-normal",
																	children: [pct, "%"]
																})
															]
														}, star);
													})
												})]
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex-1 relative",
												children: [/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" }), /* @__PURE__ */ jsx("input", {
													type: "text",
													value: reviewSearchQuery,
													onChange: (e) => setReviewSearchQuery(e.target.value),
													placeholder: "Search within reviews (faculty, hostel, doubt sessions)...",
													className: "w-full pl-10 pr-3.5 py-2 rounded-md bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-amber-400 dark:hover:border-amber-500 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all font-sans"
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5 flex-nowrap overflow-x-auto hide-scrollbar pb-1 sm:pb-0 shrink-0 w-full sm:w-auto",
												style: { WebkitOverflowScrolling: "touch" },
												children: [[
													"all",
													5,
													4,
													3,
													2,
													1
												].map((s) => /* @__PURE__ */ jsx("button", {
													onClick: () => setReviewFilterRating(s),
													className: `px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 shrink-0 whitespace-nowrap ${reviewFilterRating === s ? "bg-amber-500 text-black shadow-sm" : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50"}`,
													children: s === "all" ? "All" : /* @__PURE__ */ jsxs(Fragment, { children: [
														s,
														" ",
														/* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-current" })
													] })
												}, s)), /* @__PURE__ */ jsxs("label", {
													className: "flex items-center gap-1.5 text-xs font-medium cursor-pointer px-3 py-1 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 transition-colors shrink-0 whitespace-nowrap",
													children: [/* @__PURE__ */ jsx("input", {
														type: "checkbox",
														checked: verifiedOnly,
														onChange: (e) => setVerifiedOnly(e.target.checked),
														className: "w-3.5 h-3.5 rounded text-blue-600 border-slate-300 dark:border-zinc-600 focus:ring-0"
													}), "Verified"]
												})]
											})]
										}),
										filteredReviews.length === 0 ? /* @__PURE__ */ jsxs("div", {
											className: "py-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6",
											children: [
												/* @__PURE__ */ jsx(MessageSquare, { className: "w-10 h-10 text-slate-300 dark:text-zinc-700 mx-auto mb-3" }),
												/* @__PURE__ */ jsx("h3", {
													className: "text-base font-bold text-slate-900 dark:text-white mb-1",
													children: "No reviews match your filter"
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-slate-500 dark:text-zinc-400 text-xs mb-3 font-sans",
													children: "Be the first to share your experience with this institute."
												}),
												/* @__PURE__ */ jsx("button", {
													onClick: () => onOpenWriteReview(business.id),
													className: "px-4 py-1.5 rounded-md font-medium text-xs bg-amber-500 hover:bg-amber-400 text-black transition-colors shadow-sm",
													children: "Write a Review"
												})
											]
										}) : filteredReviews.map((rev) => /* @__PURE__ */ jsxs("div", {
											className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-start justify-between gap-3 mb-2.5",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-3",
														children: [/* @__PURE__ */ jsx("img", {
															src: rev.reviewerAvatar || "/images/default-avatar.webp",
															alt: rev.reviewerName,
															className: "w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-zinc-800 shadow-sm"
														}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
															className: "flex items-center gap-1.5 flex-wrap",
															children: [/* @__PURE__ */ jsx("h4", {
																className: "font-semibold text-xs sm:text-sm text-slate-900 dark:text-white",
																children: rev.reviewerName
															}), rev.isVerifiedPurchase && /* @__PURE__ */ jsxs("span", {
																className: "inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-semibold border border-blue-100 dark:border-blue-800/50",
																children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-2.5 h-2.5" }), " Verified Student"]
															})]
														}), /* @__PURE__ */ jsxs("div", {
															className: "text-[11px] text-slate-500 dark:text-zinc-400 font-normal flex items-center gap-1.5 font-sans",
															children: [
																/* @__PURE__ */ jsx("span", { children: rev.reviewerLocation || "Sikar, Rajasthan" }),
																/* @__PURE__ */ jsx("span", { className: "w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" }),
																/* @__PURE__ */ jsx("span", { children: Number.isNaN(new Date(rev.createdAt).getTime()) ? rev.createdAt : new Date(rev.createdAt).toLocaleDateString("en-US", {
																	year: "numeric",
																	month: "short",
																	day: "numeric"
																}) })
															]
														})] })]
													}), /* @__PURE__ */ jsx("div", {
														className: "flex items-center gap-0.5 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg shrink-0",
														children: [
															1,
															2,
															3,
															4,
															5
														].map((s) => /* @__PURE__ */ jsx(Star, { className: `w-3 h-3 ${s <= rev.rating ? "fill-amber-500 text-amber-500" : "text-slate-300 dark:text-zinc-700"}` }, s))
													})]
												}),
												/* @__PURE__ */ jsx("h3", {
													className: "font-semibold text-xs sm:text-sm text-slate-900 dark:text-white mb-1",
													children: rev.title
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-slate-600 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm mb-3 font-sans",
													children: rev.description
												}),
												translatedReviewIds[rev.id] && /* @__PURE__ */ jsx("div", {
													className: "p-3 mb-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 text-xs text-blue-800 dark:text-blue-300 italic font-sans",
													children: translatedReviewIds[rev.id]
												}),
												(rev.pros?.length > 0 || rev.cons?.length > 0) && /* @__PURE__ */ jsxs("div", {
													className: "grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3",
													children: [rev.pros?.length > 0 && /* @__PURE__ */ jsxs("div", {
														className: "p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30",
														children: [/* @__PURE__ */ jsxs("span", {
															className: "text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1",
															children: [/* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" }), " Pros"]
														}), /* @__PURE__ */ jsx("ul", {
															className: "space-y-0.5",
															children: rev.pros.map((p, i) => /* @__PURE__ */ jsxs("li", {
																className: "text-[11px] sm:text-xs text-emerald-950 dark:text-emerald-100 flex items-start gap-1 font-sans",
																children: [/* @__PURE__ */ jsx("span", {
																	className: "text-emerald-500 font-bold",
																	children: "•"
																}), /* @__PURE__ */ jsx("span", { children: p })]
															}, i))
														})]
													}), rev.cons?.length > 0 && /* @__PURE__ */ jsxs("div", {
														className: "p-2.5 rounded-lg bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30",
														children: [/* @__PURE__ */ jsxs("span", {
															className: "text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1",
															children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }), " Cons"]
														}), /* @__PURE__ */ jsx("ul", {
															className: "space-y-0.5",
															children: rev.cons.map((c, i) => /* @__PURE__ */ jsxs("li", {
																className: "text-[11px] sm:text-xs text-rose-950 dark:text-rose-100 flex items-start gap-1 font-sans",
																children: [/* @__PURE__ */ jsx("span", {
																	className: "text-rose-500 font-bold",
																	children: "•"
																}), /* @__PURE__ */ jsx("span", { children: c })]
															}, i))
														})]
													})]
												}),
												rev.businessReply && /* @__PURE__ */ jsxs("div", {
													className: "p-3 mb-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 font-sans",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-between mb-0.5",
														children: [/* @__PURE__ */ jsxs("span", {
															className: "text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1",
															children: [
																/* @__PURE__ */ jsx(Building2, { className: "w-3 h-3 text-blue-500" }),
																" Response from ",
																business.name
															]
														}), /* @__PURE__ */ jsx("span", {
															className: "text-[10px] text-slate-400",
															children: rev.businessReply.createdAt
														})]
													}), /* @__PURE__ */ jsx("p", {
														className: "text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans",
														children: rev.businessReply.content
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "pt-2 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ jsxs("button", {
															onClick: () => onVoteHelpful(rev.id, "up"),
															className: "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors active:scale-95",
															children: [
																/* @__PURE__ */ jsx(ThumbsUp, { className: "w-3 h-3" }),
																" Helpful (",
																rev.helpfulCount,
																")"
															]
														}), /* @__PURE__ */ jsxs("button", {
															onClick: () => handleTranslateReview(rev.id),
															className: "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors active:scale-95",
															children: [/* @__PURE__ */ jsx(Languages, { className: "w-3 h-3" }), " Translate"]
														})]
													}), isOwner && /* @__PURE__ */ jsx("button", {
														onClick: () => setReplyingReviewId(replyingReviewId === rev.id ? null : rev.id),
														className: "px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors",
														children: "Reply"
													})]
												}),
												isOwner && replyingReviewId === rev.id && /* @__PURE__ */ jsxs("div", {
													className: "mt-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 space-y-2",
													children: [/* @__PURE__ */ jsx("textarea", {
														value: replyText,
														onChange: (e) => setReplyText(e.target.value),
														placeholder: "Write an official response on behalf of institute management...",
														rows: 3,
														className: "w-full p-2.5 text-xs sm:text-sm rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-600 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all resize-none font-sans"
													}), /* @__PURE__ */ jsxs("div", {
														className: "flex justify-end gap-2",
														children: [/* @__PURE__ */ jsx("button", {
															onClick: () => setReplyingReviewId(null),
															className: "px-3 py-1 text-xs font-medium rounded-md bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 transition-colors",
															children: "Cancel"
														}), /* @__PURE__ */ jsx("button", {
															onClick: () => handlePostReply(rev.id),
															className: "px-3 py-1 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors",
															children: "Post Reply"
														})]
													})]
												})
											]
										}, rev.id))
									]
								}),
								activeTab === "ai_insights" && /* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4 shadow-sm animate-in fade-in duration-300",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" })
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
												className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white",
												children: "AI Feedback Synthesis"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-500 dark:text-zinc-400 font-normal",
												children: "Synthesized from real student & parent evaluations in Sikar"
											})] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "p-4 rounded-xl bg-violet-50/80 dark:bg-violet-900/10 border-l-4 border-violet-500",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 block mb-1",
												children: "Executive Sentiment Summary"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-xs sm:text-sm font-normal text-slate-700 dark:text-zinc-300 leading-relaxed font-sans",
												children: business.aiSummary?.overallSentiment || "Student sentiment strongly highlights teaching commitment, disciplined study routines, and competitive exam performance. Parents consistently commend the hostel security and frequent doubt clearing desks."
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30",
												children: [/* @__PURE__ */ jsxs("h3", {
													className: "text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2.5 flex items-center gap-1",
													children: [/* @__PURE__ */ jsx(ThumbsUp, { className: "w-3 h-3" }), " Core Strengths"]
												}), /* @__PURE__ */ jsx("ul", {
													className: "space-y-1.5",
													children: (business.aiSummary?.positiveHighlights || [
														"Top faculty from Kota & premier institutes",
														"Consistent selection ranks in JEE & NEET",
														"Daily one-on-one doubt clarification sessions",
														"Rigorous weekly minor and major test series"
													]).map((item, idx) => /* @__PURE__ */ jsxs("li", {
														className: "flex items-start gap-1.5 text-xs text-emerald-950 dark:text-emerald-100 font-sans",
														children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("span", { children: item })]
													}, idx))
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "p-3.5 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30",
												children: [/* @__PURE__ */ jsxs("h3", {
													className: "text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2.5 flex items-center gap-1",
													children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }), " Constructive Feedback"]
												}), /* @__PURE__ */ jsx("ul", {
													className: "space-y-1.5",
													children: (business.aiSummary?.criticalPoints || [
														"Hostel mess menu variety during summer peak",
														"Batch sizes in early foundation classes",
														"Parking space near campus gates during rush hours"
													]).map((item, idx) => /* @__PURE__ */ jsxs("li", {
														className: "flex items-start gap-1.5 text-xs text-rose-950 dark:text-rose-100 font-sans",
														children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("span", { children: item })]
													}, idx))
												})]
											})]
										})
									]
								}),
								activeTab === "competitors" && /* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 space-y-4 shadow-sm animate-in fade-in duration-300",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4" })
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
												className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white",
												children: "Institute Comparison"
											}), /* @__PURE__ */ jsxs("p", {
												className: "text-xs text-slate-500 dark:text-zinc-400 font-normal",
												children: [
													"Compare ",
													/* @__PURE__ */ jsx("strong", {
														className: "text-slate-700 dark:text-zinc-200 font-semibold",
														children: business.name
													}),
													" with other premier institutes in Sikar"
												]
											})] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-col sm:flex-row gap-2",
											children: [/* @__PURE__ */ jsxs("select", {
												value: selectedCompetitorId,
												onChange: (e) => setSelectedCompetitorId(e.target.value),
												className: "flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-md bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors cursor-pointer font-sans",
												children: [/* @__PURE__ */ jsx("option", {
													value: "",
													children: "-- Choose Institute to Compare --"
												}), allBusinesses.filter((b) => b.id !== business.id).map((b) => /* @__PURE__ */ jsxs("option", {
													value: b.id,
													children: [
														b.name,
														" (Trust Score: ",
														b.trustScore,
														"/100)"
													]
												}, b.id))]
											}), /* @__PURE__ */ jsx("button", {
												onClick: handleRunCompetitorComparison,
												disabled: !selectedCompetitorId || isLoadingCompetitorReport,
												className: "px-4 py-2 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-all active:scale-95 shadow-sm shrink-0",
												children: isLoadingCompetitorReport ? "Analyzing..." : "Compare"
											})]
										}),
										competitorReport && /* @__PURE__ */ jsxs("div", {
											className: "p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-blue-100 dark:border-blue-900/30 space-y-3",
											children: [
												/* @__PURE__ */ jsxs("h3", {
													className: "font-bold text-sm text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5",
													children: [
														/* @__PURE__ */ jsx("span", {
															className: "text-blue-600 dark:text-blue-400",
															children: competitorReport.targetBusinessName
														}),
														/* @__PURE__ */ jsx("span", {
															className: "text-slate-400 text-xs",
															children: "vs"
														}),
														/* @__PURE__ */ jsx("span", {
															className: "text-slate-700 dark:text-zinc-300",
															children: competitorReport.competitorName
														})
													]
												}),
												/* @__PURE__ */ jsx("p", {
													className: "text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans",
													children: competitorReport.comparisonSummary
												}),
												/* @__PURE__ */ jsxs("div", {
													className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30",
														children: [/* @__PURE__ */ jsxs("span", {
															className: "text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1",
															children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }), " Key Advantages"]
														}), /* @__PURE__ */ jsx("ul", {
															className: "space-y-0.5",
															children: competitorReport.keyAdvantages.map((a, i) => /* @__PURE__ */ jsxs("li", {
																className: "text-xs text-emerald-950 dark:text-emerald-100 flex gap-1 font-sans",
																children: [/* @__PURE__ */ jsx("span", {
																	className: "text-emerald-500",
																	children: "•"
																}), /* @__PURE__ */ jsx("span", { children: a })]
															}, i))
														})]
													}), /* @__PURE__ */ jsxs("div", {
														className: "p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30",
														children: [/* @__PURE__ */ jsxs("span", {
															className: "text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1",
															children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3 h-3" }), " Points to Consider"]
														}), /* @__PURE__ */ jsx("ul", {
															className: "space-y-0.5",
															children: competitorReport.areasOfImprovement.map((a, i) => /* @__PURE__ */ jsxs("li", {
																className: "text-xs text-amber-950 dark:text-amber-100 flex gap-1 font-sans",
																children: [/* @__PURE__ */ jsx("span", {
																	className: "text-amber-500",
																	children: "•"
																}), /* @__PURE__ */ jsx("span", { children: a })]
															}, i))
														})]
													})]
												})
											]
										})
									]
								}),
								activeTab === "faqs" && /* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-6 space-y-3 shadow-sm animate-in fade-in duration-300",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "mb-2",
										children: [/* @__PURE__ */ jsx("h2", {
											className: "text-base sm:text-lg font-bold text-slate-900 dark:text-white",
											children: "Frequently Asked Questions"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-500 dark:text-zinc-400",
											children: "Find quick answers about admission procedures, scholarships, hostel rules, and syllabus coverage."
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "space-y-2",
										children: faqsList.map((faq, index) => {
											const isOpen = openFaqIndex === index;
											return /* @__PURE__ */ jsxs("div", {
												className: `rounded-xl border transition-all overflow-hidden ${isOpen ? "bg-slate-50/80 dark:bg-zinc-800/60 border-blue-200 dark:border-blue-900/50" : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-300"}`,
												children: [/* @__PURE__ */ jsxs("button", {
													onClick: () => setOpenFaqIndex(isOpen ? null : index),
													className: "w-full p-3.5 flex items-center justify-between text-left gap-3 cursor-pointer focus:outline-none",
													children: [/* @__PURE__ */ jsx("span", {
														className: `font-semibold text-xs sm:text-sm ${isOpen ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`,
														children: faq.question
													}), /* @__PURE__ */ jsx("div", {
														className: `w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "bg-blue-600 text-white rotate-180" : "bg-slate-100 dark:bg-zinc-800 text-slate-400"}`,
														children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5" })
													})]
												}), isOpen && /* @__PURE__ */ jsx("div", {
													className: "px-3.5 pb-3.5 pt-1 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed border-t border-slate-100 dark:border-zinc-800 font-sans",
													children: faq.answer
												})]
											}, index);
										})
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-4 space-y-4 lg:sticky lg:top-14",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 space-y-3 shadow-sm",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider",
												children: "Admissions Open 2026–27"
											})]
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-sm sm:text-base font-bold text-slate-900 dark:text-white",
											children: "Admissions & Counseling"
										}),
										/* @__PURE__ */ jsxs("p", {
											className: "text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans",
											children: [
												"Get counselor guidance, batch timetables, and scholarship test dates directly from ",
												business.name,
												"."
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "space-y-2 pt-1 font-sans",
											children: [
												/* @__PURE__ */ jsxs("a", {
													href: directWhatsAppUrl,
													target: "_blank",
													rel: "noreferrer",
													className: "w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-medium text-xs bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm transition-all active:scale-95",
													children: [/* @__PURE__ */ jsx("svg", {
														viewBox: "0 0 24 24",
														className: "w-3.5 h-3.5 fill-current",
														children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" })
													}), /* @__PURE__ */ jsx("span", { children: "Chat on WhatsApp" })]
												}),
												business.phone && /* @__PURE__ */ jsxs("a", {
													href: `tel:${business.phone}`,
													className: "w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-medium text-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-sm transition-all active:scale-95",
													children: [/* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ jsxs("span", { children: [
														"Call Helpline (",
														business.phone,
														")"
													] })]
												}),
												/* @__PURE__ */ jsxs("button", {
													onClick: () => setShowInquiryModal(true),
													className: "w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-medium text-xs bg-amber-500 hover:bg-amber-400 text-black shadow-sm transition-all active:scale-95",
													children: [/* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Request Callback" })]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 space-y-3 shadow-sm",
									children: [/* @__PURE__ */ jsxs("h3", {
										className: "text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 text-amber-500 fill-amber-500" }), " Student Evaluations"]
									}), /* @__PURE__ */ jsx("div", {
										className: "space-y-2.5",
										children: Object.entries(categoryScores).map(([key, val]) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
											className: "flex justify-between text-xs font-medium text-slate-700 dark:text-zinc-300 capitalize mb-1",
											children: [/* @__PURE__ */ jsx("span", { children: key }), /* @__PURE__ */ jsxs("span", {
												className: "text-slate-900 dark:text-white font-semibold",
												children: [Number(val).toFixed(1), " / 5.0"]
											})]
										}), /* @__PURE__ */ jsx("div", {
											className: "w-full h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden",
											children: /* @__PURE__ */ jsx("div", {
												className: "h-full bg-amber-500 rounded-full transition-all",
												style: { width: `${Number(val) / 5 * 100}%` }
											})
										})] }, key))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 space-y-3 shadow-sm",
									children: [/* @__PURE__ */ jsxs("h3", {
										className: "text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-blue-500" }), " Office & Campus Timing"]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-2.5 text-xs font-sans",
										children: [
											business.phone && /* @__PURE__ */ jsxs("div", {
												className: "flex items-start gap-2.5",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0",
													children: /* @__PURE__ */ jsx(Phone, { className: "w-3 h-3" })
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
													className: "text-[10px] text-slate-400",
													children: "Phone Helpline"
												}), /* @__PURE__ */ jsx("a", {
													href: `tel:${business.phone}`,
													className: "font-medium text-slate-900 dark:text-white hover:underline",
													children: business.phone
												})] })]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-start gap-2.5",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0",
													children: /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" })
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
													className: "text-[10px] text-slate-400",
													children: "Address"
												}), /* @__PURE__ */ jsx("div", {
													className: "text-slate-700 dark:text-zinc-300 leading-relaxed",
													children: business.address || `${business.city || "Sikar"}, Rajasthan`
												})] })]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-start gap-2.5",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0",
													children: /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" })
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
													className: "text-[10px] text-slate-400",
													children: "Hours"
												}), /* @__PURE__ */ jsx("div", {
													className: "text-slate-700 dark:text-zinc-300",
													children: business.openingHours || business.opening_hours || "Mon - Sun: 8:00 AM - 8:00 PM"
												})] })]
											})
										]
									})]
								}),
								socialLinks.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 space-y-3 shadow-sm",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsxs("h3", {
												className: "text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-blue-500" }), " Official Handles"]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full",
												children: "Verified"
											})]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-slate-500 dark:text-zinc-400 font-sans leading-relaxed",
											children: "Official channels verified against institute public web records:"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "space-y-2 font-sans pt-0.5",
											children: socialLinks.map(([network, url]) => {
												const meta = getSocialMeta(network);
												return /* @__PURE__ */ jsxs("a", {
													href: url,
													target: "_blank",
													rel: "noreferrer",
													className: "flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-800/40 hover:bg-slate-100/80 dark:hover:bg-zinc-800 transition-colors group",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-2.5 min-w-0",
														children: [/* @__PURE__ */ jsx("span", {
															className: `p-1.5 rounded-md border ${meta.badgeBg}`,
															children: meta.icon
														}), /* @__PURE__ */ jsxs("div", {
															className: "min-w-0",
															children: [/* @__PURE__ */ jsx("div", {
																className: "text-xs font-semibold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
																children: meta.label
															}), /* @__PURE__ */ jsx("div", {
																className: "text-[10px] text-slate-400 truncate max-w-[170px]",
																children: url.replace(/^https?:\/\/(www\.)?/, "")
															})]
														})]
													}), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 ml-2" })]
												}, network);
											})
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-slate-100/70 dark:bg-zinc-900/50 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-4 space-y-2",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-500" }), " Trust Guarantee"]
									}), /* @__PURE__ */ jsxs("ul", {
										className: "space-y-1 text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-sans",
										children: [
											/* @__PURE__ */ jsxs("li", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-emerald-500 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Verified student evaluations" })]
											}),
											/* @__PURE__ */ jsxs("li", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-emerald-500 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "AI fraud & anti-spam detection" })]
											}),
											/* @__PURE__ */ jsxs("li", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-emerald-500 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Real fee & hostel insights" })]
											})
										]
									})]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800 p-2 px-3 flex items-center justify-between gap-2 shadow-xl flex-nowrap",
				children: [
					business.phone && /* @__PURE__ */ jsxs("a", {
						href: `tel:${business.phone}`,
						className: "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md font-medium text-xs bg-slate-900 text-white dark:bg-zinc-800 dark:text-zinc-100 shadow-sm shrink-0 whitespace-nowrap",
						children: [/* @__PURE__ */ jsx(Phone, { className: "w-3 h-3 text-emerald-400 shrink-0" }), " Call"]
					}),
					/* @__PURE__ */ jsxs("a", {
						href: directWhatsAppUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md font-medium text-xs bg-[#25D366] text-white shadow-sm shrink-0 whitespace-nowrap",
						children: [/* @__PURE__ */ jsx("svg", {
							viewBox: "0 0 24 24",
							className: "w-3 h-3 fill-current shrink-0",
							children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" })
						}), " WhatsApp"]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => onOpenWriteReview(business.id),
						className: "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md font-medium text-xs bg-amber-500 text-black shadow-sm shrink-0 whitespace-nowrap",
						children: [/* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-current shrink-0" }), " Review"]
					})
				]
			}),
			/* @__PURE__ */ jsx(ShareModal, {
				isOpen: showShareModal,
				onClose: () => setShowShareModal(false),
				url: typeof window !== "undefined" ? window.location.href : `/business/${business.category || "education"}/${business.slug || business.id}`,
				title: `${business.name} - Reviews, Ratings & Admissions`
			}),
			/* @__PURE__ */ jsx(InquiryModal, {
				isOpen: showInquiryModal,
				onClose: () => setShowInquiryModal(false),
				business,
				initialCourse: selectedCourseForInquiry
			})
		]
	});
};
//#endregion
export { BusinessProfileView };
