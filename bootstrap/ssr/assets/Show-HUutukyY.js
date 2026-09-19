import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { t as Navbar } from "./GlobalNavbar-RO4UzKYw.js";
import { t as BlogFooter } from "./BlogFooter-CC-GFETm.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
//#region resources/js/Pages/Blog/Show.jsx
var Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
	return /* @__PURE__ */ jsx("img", {
		src,
		alt,
		style: fill ? {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			width: "100%",
			height: "100%",
			...style
		} : style,
		sizes,
		fetchPriority: priority ? "high" : fetchPriority || "auto",
		loading: priority ? "eager" : "lazy",
		decoding: priority ? "sync" : "async",
		...props
	});
};
function Show({ post, recentPosts, meta }) {
	const contentRef = useRef(null);
	const [toc, setToc] = useState([]);
	useEffect(() => {
		if (!contentRef.current) return;
		contentRef.current.querySelectorAll("img").forEach((img) => {
			if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
		});
		const headings = contentRef.current.querySelectorAll("h2");
		const tocItems = [];
		headings.forEach((heading, index) => {
			const id = `toc-heading-${index}`;
			heading.id = id;
			tocItems.push({
				id,
				text: heading.innerText
			});
		});
		setToc(tocItems);
	}, [post]);
	if (!post) return /* @__PURE__ */ jsx("div", { children: "Post not found" });
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	};
	const finalCanonicalUrl = post.canonicalUrl || `https://coachingsinsikar.com/blog/${post.slug}`;
	const displayAuthor = post.author?.toLowerCase() === "prasant" ? "Prashant" : post.author;
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white transition-colors duration-300",
		children: [
			/* @__PURE__ */ jsx(SeoMeta, { meta }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto w-full px-[15px] pb-8",
				style: { paddingTop: "100px" },
				children: [/* @__PURE__ */ jsx("main", {
					className: "w-full lg:w-[70%]",
					children: /* @__PURE__ */ jsxs("article", { children: [
						/* @__PURE__ */ jsxs("header", {
							className: "mb-8",
							children: [
								post.category && /* @__PURE__ */ jsx(Link, {
									href: `${window.BASE_PATH}/category/${post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
									className: "text-blue-600 font-bold uppercase tracking-widest text-sm mb-3 block hover:underline",
									children: post.category
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white",
									children: post.title
								}),
								post.isSponsored && /* @__PURE__ */ jsx("div", {
									className: "inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-full mb-6",
									children: "Sponsored Content"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-4 text-gray-600 mb-8",
									children: [post.authorImage && /* @__PURE__ */ jsx("img", {
										loading: "lazy",
										decoding: "async",
										fetchPriority: "low",
										src: post.authorImage.startsWith("http") || post.authorImage.startsWith("/") ? post.authorImage : "/" + post.authorImage,
										alt: displayAuthor,
										width: "48",
										height: "48",
										className: "w-12 h-12 rounded-full object-cover"
									}), /* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx(Link, {
											href: window.BASE_PATH + "/author/" + (displayAuthor ? displayAuthor.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""),
											className: "font-semibold text-lg text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline",
											children: displayAuthor
										}),
										post.authorJobTitle && /* @__PURE__ */ jsx("p", {
											className: "text-sm font-medium text-slate-500 dark:text-zinc-400",
											children: post.authorJobTitle
										}),
										post.authorAwards && post.authorAwards.length > 0 && /* @__PURE__ */ jsxs("p", {
											className: "text-xs font-semibold text-amber-600 dark:text-amber-500 mt-0.5 flex items-center gap-1",
											children: [
												/* @__PURE__ */ jsxs("svg", {
													xmlns: "http://www.w3.org/2000/svg",
													width: "12",
													height: "12",
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: "2",
													strokeLinecap: "round",
													strokeLinejoin: "round",
													children: [/* @__PURE__ */ jsx("circle", {
														cx: "12",
														cy: "8",
														r: "6"
													}), /* @__PURE__ */ jsx("path", { d: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" })]
												}),
												post.authorAwards[0],
												" ",
												post.authorAwards.length > 1 ? `+${post.authorAwards.length - 1}` : ""
											]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-600 dark:text-zinc-500 mt-1",
											children: formatDate(post.date)
										})
									] })]
								}),
								post.factCheckedBy && /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-lg text-emerald-800 dark:text-emerald-400 text-sm",
									children: [/* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										className: "lucide lucide-check-circle-2 text-emerald-600 dark:text-emerald-500",
										children: [/* @__PURE__ */ jsx("circle", {
											cx: "12",
											cy: "12",
											r: "10"
										}), /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })]
									}), /* @__PURE__ */ jsxs("span", { children: [
										"Fact-checked by ",
										/* @__PURE__ */ jsx("strong", { children: post.factCheckedBy }),
										" ",
										post.factCheckerRole ? `(${post.factCheckerRole})` : ""
									] })]
								}),
								post.coverImage && /* @__PURE__ */ jsx("div", {
									className: "relative w-full max-w-[800px] mx-auto rounded-xl overflow-hidden mb-8 shadow-lg",
									style: { aspectRatio: "1080/630" },
									children: /* @__PURE__ */ jsx(Image, {
										src: post.coverImage,
										alt: post.title,
										fill: true,
										style: { objectFit: "cover" },
										priority: true
									})
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-3 mb-8 border-y border-slate-100 dark:border-zinc-800 py-4",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-700 dark:text-zinc-300 mr-2",
									children: "Share this article:"
								}),
								/* @__PURE__ */ jsxs("a", {
									href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(finalCanonicalUrl)}&text=${encodeURIComponent(meta?.title || post.title)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-slate-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-full text-sm font-medium transition-colors",
									children: [/* @__PURE__ */ jsx("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: /* @__PURE__ */ jsx("path", { d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" })
									}), "Twitter"]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(finalCanonicalUrl)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full text-sm font-medium transition-colors",
									children: [/* @__PURE__ */ jsx("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
									}), "Facebook"]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(finalCanonicalUrl)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-400 rounded-full text-sm font-medium transition-colors",
									children: [/* @__PURE__ */ jsxs("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: [
											/* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }),
											/* @__PURE__ */ jsx("rect", {
												width: "4",
												height: "12",
												x: "2",
												y: "9"
											}),
											/* @__PURE__ */ jsx("circle", {
												cx: "4",
												cy: "4",
												r: "2"
											})
										]
									}), "LinkedIn"]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: `https://api.whatsapp.com/send?text=${encodeURIComponent((meta?.title || post.title) + " " + finalCanonicalUrl)}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-zinc-900 hover:bg-green-50 dark:hover:bg-green-900/30 text-slate-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 rounded-full text-sm font-medium transition-colors",
									children: [/* @__PURE__ */ jsx("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "16",
										height: "16",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round",
										strokeLinejoin: "round",
										children: /* @__PURE__ */ jsx("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" })
									}), "WhatsApp"]
								})
							]
						}),
						toc.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 mb-8 max-w-md",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-xl font-bold mb-4 text-slate-800 dark:text-white",
								children: "Table of Contents"
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-2 text-blue-600",
								children: toc.map((item) => /* @__PURE__ */ jsx("li", {
									className: "font-medium text-sm",
									children: /* @__PURE__ */ jsx("a", {
										href: `#${item.id}`,
										className: "hover:underline",
										children: item.text
									})
								}, item.id))
							})]
						}),
						post.keyTakeaways && post.keyTakeaways.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10 shadow-sm",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-xl font-bold mb-4 text-amber-900 flex items-center gap-2",
								children: [/* @__PURE__ */ jsxs("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "20",
									height: "20",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									children: [/* @__PURE__ */ jsx("path", { d: "M12 2v20" }), /* @__PURE__ */ jsx("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })]
								}), "Key Takeaways"]
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-3",
								children: post.keyTakeaways.map((takeaway, index) => /* @__PURE__ */ jsxs("li", {
									className: "flex gap-3 text-amber-800",
									children: [/* @__PURE__ */ jsx("div", { className: "mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" }), /* @__PURE__ */ jsx("span", { children: takeaway })]
								}, index))
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							ref: contentRef,
							className: "prose prose-lg dark:prose-invert max-w-none prose-blue dark:[&_p]:!text-zinc-300 dark:[&_span]:!text-zinc-300 dark:[&_li]:!text-zinc-300 dark:[&_h1]:!text-zinc-100 dark:[&_h2]:!text-zinc-100 dark:[&_h3]:!text-zinc-100 dark:[&_h4]:!text-zinc-100 dark:[&_strong]:!text-zinc-200 dark:[&_a]:!text-blue-400",
							dangerouslySetInnerHTML: { __html: post.content }
						}),
						post.sources && post.sources.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "mt-12 pt-8 border-t border-slate-200 dark:border-zinc-800",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-lg font-bold text-slate-800 dark:text-white mb-4",
								children: "Sources & References"
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-2 text-sm text-slate-600 dark:text-zinc-400",
								children: post.sources.map((source, idx) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsxs("span", {
									className: "mr-2 text-slate-500 dark:text-zinc-500",
									children: [
										"[",
										idx + 1,
										"]"
									]
								}), source.url ? /* @__PURE__ */ jsx("a", {
									href: source.url,
									target: "_blank",
									rel: "nofollow noreferrer",
									className: "hover:text-blue-600 dark:hover:text-blue-400 hover:underline",
									children: source.title || source.url
								}) : /* @__PURE__ */ jsx("span", { children: source.title })] }, idx))
							})]
						}),
						post.corrections && post.corrections.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-md font-bold text-slate-700 mb-3",
								children: "Corrections & Updates"
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-3 text-sm text-slate-600",
								children: post.corrections.map((corr, idx) => /* @__PURE__ */ jsxs("li", {
									className: "flex flex-col sm:flex-row gap-2",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "font-semibold text-slate-800 shrink-0",
										children: [formatDate(corr.date), ":"]
									}), /* @__PURE__ */ jsx("span", { children: corr.note })]
								}, idx))
							})]
						}),
						post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "mt-8 flex flex-wrap gap-2",
							children: post.tags.map((tag, idx) => /* @__PURE__ */ jsxs(Link, {
								href: `${window.BASE_PATH}/category/${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
								className: "px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-colors",
								children: ["#", tag]
							}, idx))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row gap-6 items-start",
								children: [post.authorImage && /* @__PURE__ */ jsx("img", {
									loading: "lazy",
									decoding: "async",
									fetchPriority: "low",
									src: post.authorImage.startsWith("http") || post.authorImage.startsWith("/") ? post.authorImage : "/" + post.authorImage,
									alt: displayAuthor,
									width: "96",
									height: "96",
									className: "w-24 h-24 rounded-full object-cover shrink-0 ring-4 ring-slate-50"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ jsx("h3", {
											className: "text-xl font-bold text-slate-800 dark:text-white mb-1",
											children: displayAuthor
										}),
										post.authorJobTitle && /* @__PURE__ */ jsx("p", {
											className: "text-blue-600 font-medium text-sm mb-3",
											children: post.authorJobTitle
										}),
										post.authorBio && /* @__PURE__ */ jsx("p", {
											className: "text-slate-600 dark:text-zinc-400 leading-relaxed text-sm mb-4",
											children: post.authorBio
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50",
											children: [
												post.authorExperienceYears > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													className: "block text-xs font-bold text-slate-600 dark:text-zinc-500 uppercase tracking-wider mb-1",
													children: "Experience"
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-sm font-semibold text-slate-700 dark:text-zinc-300",
													children: [post.authorExperienceYears, "+ Years"]
												})] }),
												post.authorAwards && post.authorAwards.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													className: "block text-xs font-bold text-slate-600 dark:text-zinc-500 uppercase tracking-wider mb-1",
													children: "Awards"
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-500",
													children: [
														/* @__PURE__ */ jsxs("svg", {
															xmlns: "http://www.w3.org/2000/svg",
															width: "14",
															height: "14",
															viewBox: "0 0 24 24",
															fill: "none",
															stroke: "currentColor",
															strokeWidth: "2",
															strokeLinecap: "round",
															strokeLinejoin: "round",
															children: [/* @__PURE__ */ jsx("circle", {
																cx: "12",
																cy: "8",
																r: "6"
															}), /* @__PURE__ */ jsx("path", { d: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" })]
														}),
														post.authorAwards[0],
														" ",
														post.authorAwards.length > 1 ? `+${post.authorAwards.length - 1}` : ""
													]
												})] }),
												post.authorAlumniOf && post.authorAlumniOf.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
													className: "block text-xs font-bold text-slate-600 dark:text-zinc-500 uppercase tracking-wider mb-1",
													children: "Alumni"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-sm font-semibold text-slate-700 dark:text-zinc-300",
													children: post.authorAlumniOf[0].name
												})] })
											]
										}),
										post.authorSocials && (post.authorSocials.twitter || post.authorSocials.linkedin || post.authorSocials.website) && /* @__PURE__ */ jsxs("div", {
											className: "flex gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50",
											children: [
												post.authorSocials.twitter && /* @__PURE__ */ jsx("a", {
													href: post.authorSocials.twitter,
													target: "_blank",
													rel: "nofollow noreferrer",
													className: "p-2 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-full transition-colors",
													children: /* @__PURE__ */ jsx("svg", {
														xmlns: "http://www.w3.org/2000/svg",
														width: "16",
														height: "16",
														viewBox: "0 0 24 24",
														fill: "none",
														stroke: "currentColor",
														strokeWidth: "2",
														strokeLinecap: "round",
														strokeLinejoin: "round",
														children: /* @__PURE__ */ jsx("path", { d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" })
													})
												}),
												post.authorSocials.linkedin && /* @__PURE__ */ jsx("a", {
													href: post.authorSocials.linkedin,
													target: "_blank",
													rel: "nofollow noreferrer",
													className: "p-2 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-full transition-colors",
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
														children: [
															/* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }),
															/* @__PURE__ */ jsx("rect", {
																width: "4",
																height: "12",
																x: "2",
																y: "9"
															}),
															/* @__PURE__ */ jsx("circle", {
																cx: "4",
																cy: "4",
																r: "2"
															})
														]
													})
												}),
												post.authorSocials.website && /* @__PURE__ */ jsx("a", {
													href: post.authorSocials.website,
													target: "_blank",
													rel: "nofollow noreferrer",
													className: "p-2 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-500 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-full transition-colors",
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
														children: [
															/* @__PURE__ */ jsx("circle", {
																cx: "12",
																cy: "12",
																r: "10"
															}),
															/* @__PURE__ */ jsx("line", {
																x1: "2",
																x2: "22",
																y1: "12",
																y2: "12"
															}),
															/* @__PURE__ */ jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
														]
													})
												})
											]
										})
									]
								})]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm text-center",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-bold text-slate-800 dark:text-white mb-3",
									children: "Join the Conversation!"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-slate-600 dark:text-zinc-400 mb-6 text-lg",
									children: "What are your thoughts on this topic? Discuss this article and more with our active community on coachingsinsikar."
								}),
								/* @__PURE__ */ jsx(Link, {
									href: "/feed",
									className: "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-md",
									children: "Go to Community"
								})
							]
						})
					] })
				}), /* @__PURE__ */ jsx("aside", {
					className: "w-full lg:w-[30%]",
					children: /* @__PURE__ */ jsxs("div", {
						style: {
							position: "sticky",
							top: "120px",
							maxHeight: "calc(100vh - 140px)",
							overflowY: "auto",
							scrollbarWidth: "none",
							msOverflowStyle: "none"
						},
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xl font-bold mb-6 pb-2 border-b-2 border-blue-600 inline-block text-slate-900 dark:text-white",
							children: "Recent Articles"
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-col gap-4",
							children: recentPosts && recentPosts.map((rp) => /* @__PURE__ */ jsxs(Link, {
								href: `${window.BASE_PATH}/blog/${rp.slug}`,
								className: "flex gap-4 group bg-white dark:bg-zinc-900 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all",
								children: [/* @__PURE__ */ jsx("div", {
									className: "relative w-24 h-20 shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-slate-50",
									children: /* @__PURE__ */ jsx(Image, {
										src: rp.coverImage || "/uploads/read.webp",
										alt: rp.title,
										fill: true,
										style: { objectFit: "cover" },
										className: "transition-transform duration-300 group-hover:scale-105"
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col justify-center",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider",
										children: rp.category
									}), /* @__PURE__ */ jsx("h4", {
										className: "font-bold text-sm leading-tight text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 mt-1 line-clamp-3",
										children: rp.title
									})]
								})]
							}, rp.id))
						})]
					})
				})]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { Show as default };
