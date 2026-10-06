import "./ShareModal-2YClwU5E.js";
import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { Link as Link$1, navigate } from "./utils-BjQF728w.js";
import CommunityFeedSection from "./CommunityFeedSection-E6zmeeFR.js";
import BlogFooter from "./HomeFooter-BTwiScys.js";
import Navbar from "./HomeNavbar-CkJsOpAT.js";
import InstitutesSection from "./InstitutesSection-WAg94c3S.js";
import TrustMarquee from "./TrustMarquee-CfkZIMCI.js";
import { jsx, jsxs } from "react/jsx-runtime";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { BookOpen, CheckCircle2, GraduationCap, MessageSquare, Search, Star } from "lucide-react";
//#region resources/js/Pages/Welcome.jsx
var BlogSection = lazy(() => import("./BlogSection-yrQVerIc.js"));
var CategorySection = lazy(() => import("./CategorySection-Cm4V2bak.js"));
var StoriesSection = lazy(() => import("./StoriesSection-B9Xh0Bgz.js"));
var FAQSection = lazy(() => import("./FAQSection-D7KO4io4.js"));
var SeoContent = lazy(() => import("./SeoContent-BOXcL4GU.js"));
var HomeHero = ({ activeSlides, basePath, categories, featuredBusinesses, fallbackImage }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [suggestions, setSuggestions] = useState({
		categories: [],
		businesses: [],
		blogs: []
	});
	const [isLoading, setIsLoading] = useState(false);
	const validSlides = activeSlides && activeSlides.length > 0 ? activeSlides : [{ image_url: fallbackImage || "/images/672/background.webp" }];
	useEffect(() => {
		if (validSlides.length > 1) {
			const interval = setInterval(() => {
				setCurrentSlideIndex((prev) => (prev + 1) % validSlides.length);
			}, 5e3);
			return () => clearInterval(interval);
		}
	}, [validSlides.length]);
	useEffect(() => {
		if (searchQuery.trim().length > 1) {
			setIsLoading(true);
			const delayDebounceFn = setTimeout(() => {
				fetch(`${basePath || ""}/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`).then((res) => res.json()).then((data) => {
					setSuggestions(data);
					setIsLoading(false);
				}).catch((err) => {
					console.error(err);
					setIsLoading(false);
				});
			}, 300);
			return () => clearTimeout(delayDebounceFn);
		} else {
			setSuggestions({
				categories: [],
				businesses: [],
				blogs: [],
				communities: []
			});
			setIsLoading(false);
		}
	}, [searchQuery, basePath]);
	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) navigate(`${basePath || ""}/search?q=${encodeURIComponent(searchQuery)}`);
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "relative w-full min-h-[500px] md:min-h-[600px] flex items-center bg-slate-900",
		children: [
			validSlides.map((slide, index) => {
				return /* @__PURE__ */ jsx("img", {
					src: typeof slide === "string" ? slide : slide.image_url || slide.image || slide.coverImage,
					alt: "",
					"aria-hidden": "true",
					fetchPriority: index === 0 ? "high" : "low",
					loading: index === 0 ? "eager" : "lazy",
					decoding: index === 0 ? "sync" : "async",
					className: `absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ${index === currentSlideIndex ? "opacity-100" : "opacity-0"}`
				}, index);
			}),
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 bg-slate-900/80" }),
			/* @__PURE__ */ jsx("div", {
				className: "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 md:pt-32 md:pb-14",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid lg:grid-cols-12 gap-8 lg:gap-10 items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 text-white",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-amber-400 text-xs font-bold tracking-[0.12em] mb-4",
								children: "Coaching and School Discovery Platform"
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold leading-[1.1] mb-6 tracking-tight",
								children: "Find the Best CoachinginSikar"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-base md:text-lg text-white/80 max-w-xl mb-8",
								children: "Compare coaching institutes, courses, fees, results and student reviews — all in one place."
							}),
							/* @__PURE__ */ jsx("div", {
								className: "relative max-w-xl mb-6",
								children: /* @__PURE__ */ jsxs("form", {
									onSubmit: handleSearch,
									role: "search",
									"aria-label": "Search coaching institutes",
									children: [
										/* @__PURE__ */ jsx("label", {
											htmlFor: "home-search",
											className: "sr-only",
											children: "Search coaching, courses, exams or institutes"
										}),
										/* @__PURE__ */ jsx(AnimatedBorderCard, {
											containerClassName: "rounded-full",
											className: "rounded-full",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2 bg-white px-2 py-2 group",
												children: [
													/* @__PURE__ */ jsx(Search, {
														className: "w-5 h-5 text-slate-400 ml-3 flex-shrink-0 group-focus-within:text-blue-500 transition-colors",
														"aria-hidden": "true"
													}),
													/* @__PURE__ */ jsx("input", {
														id: "home-search",
														type: "search",
														name: "q",
														className: "flex-1 border-0 outline-none focus:ring-0 text-slate-900 text-sm md:text-base py-2.5 bg-transparent placeholder-slate-400",
														placeholder: "Search coaching, courses, exams or institutes...",
														value: searchQuery,
														"aria-label": "Search coaching, courses, exams or institutes",
														onChange: (e) => {
															setSearchQuery(e.target.value);
															setShowSuggestions(true);
														},
														onFocus: () => setShowSuggestions(true),
														onBlur: () => setTimeout(() => setShowSuggestions(false), 200),
														autoComplete: "off"
													}),
													/* @__PURE__ */ jsx("button", {
														type: "submit",
														"aria-label": "Search",
														className: "bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full px-6 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none ring-0 focus:ring-0",
														children: "Search"
													})
												]
											})
										}),
										showSuggestions && searchQuery.trim().length > 0 && /* @__PURE__ */ jsx("div", {
											className: "absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-100 max-h-[400px] overflow-y-auto",
											children: isLoading ? /* @__PURE__ */ jsx("div", {
												className: "p-6 text-center",
												children: /* @__PURE__ */ jsx("div", { className: "inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" })
											}) : (() => {
												if (!(suggestions.businesses?.length > 0 || suggestions.categories?.length > 0 || suggestions.blogs?.length > 0 || suggestions.communities?.length > 0) && searchQuery.trim().length > 1) return /* @__PURE__ */ jsxs("div", {
													className: "p-4 text-center text-slate-500 text-sm",
													children: [
														"No results found for \"",
														searchQuery,
														"\""
													]
												});
												return /* @__PURE__ */ jsxs("div", {
													className: "py-2",
													children: [
														suggestions.categories?.length > 0 && /* @__PURE__ */ jsxs("div", {
															className: "mb-2",
															children: [/* @__PURE__ */ jsx("div", {
																className: "px-4 py-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase",
																children: "Categories"
															}), suggestions.categories.map((cat) => /* @__PURE__ */ jsxs(Link$1, {
																href: `${basePath || ""}/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`,
																className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
																children: [/* @__PURE__ */ jsx("div", {
																	className: "bg-blue-50 p-2 rounded-lg text-blue-600",
																	children: /* @__PURE__ */ jsx(GraduationCap, { size: 16 })
																}), /* @__PURE__ */ jsx("span", {
																	className: "font-medium text-slate-800",
																	children: cat.name
																})]
															}, `cat-${cat.id}`))]
														}),
														suggestions.businesses?.length > 0 && /* @__PURE__ */ jsxs("div", {
															className: "mb-2",
															children: [/* @__PURE__ */ jsx("div", {
																className: "px-4 py-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase",
																children: "Institutes"
															}), suggestions.businesses.map((biz) => /* @__PURE__ */ jsxs(Link$1, {
																href: `${basePath || ""}/business/${biz.category || "coaching-institutes"}/${biz.slug || biz.id}`,
																className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
																children: [/* @__PURE__ */ jsx("div", {
																	className: "w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200",
																	children: /* @__PURE__ */ jsx("img", {
																		src: biz.logo || "/uploads/read.webp",
																		alt: biz.name,
																		width: "40",
																		height: "40",
																		className: "w-full h-full object-cover"
																	})
																}), /* @__PURE__ */ jsxs("div", {
																	className: "flex flex-col",
																	children: [/* @__PURE__ */ jsx("span", {
																		className: "font-medium text-slate-800",
																		children: biz.name
																	}), /* @__PURE__ */ jsx("span", {
																		className: "text-xs text-slate-500",
																		children: biz.category || "Institute"
																	})]
																})]
															}, `biz-${biz.id}`))]
														}),
														suggestions.blogs?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
															className: "px-4 py-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase",
															children: "Blog Posts"
														}), suggestions.blogs.map((blog) => /* @__PURE__ */ jsxs(Link$1, {
															href: (basePath || "") + (blog.url_path || `/blog/${blog.slug}`),
															className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
															children: [/* @__PURE__ */ jsx("div", {
																className: "bg-amber-50 p-2 rounded-lg text-amber-600",
																children: /* @__PURE__ */ jsx(BookOpen, { size: 16 })
															}), /* @__PURE__ */ jsxs("div", {
																className: "flex flex-col flex-1 min-w-0",
																children: [/* @__PURE__ */ jsx("span", {
																	className: "font-medium text-slate-800 line-clamp-1",
																	children: blog.title
																}), blog.excerpt && /* @__PURE__ */ jsx("span", {
																	className: "text-xs text-slate-500 line-clamp-1 mt-0.5",
																	children: blog.excerpt
																})]
															})]
														}, `blog-${blog.id}`))] }),
														suggestions.communities?.length > 0 && /* @__PURE__ */ jsxs("div", {
															className: "mb-2",
															children: [/* @__PURE__ */ jsx("div", {
																className: "px-4 py-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase",
																children: "Communities"
															}), suggestions.communities.map((community) => /* @__PURE__ */ jsxs(Link$1, {
																href: `${basePath || ""}/community/${community.name}`,
																className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
																children: [/* @__PURE__ */ jsx("div", {
																	className: "bg-emerald-50 p-2 rounded-lg text-emerald-600",
																	children: /* @__PURE__ */ jsx(MessageSquare, { size: 16 })
																}), /* @__PURE__ */ jsxs("div", {
																	className: "flex flex-col",
																	children: [/* @__PURE__ */ jsxs("span", {
																		className: "font-medium text-slate-800",
																		children: ["r/", community.name]
																	}), /* @__PURE__ */ jsxs("span", {
																		className: "text-xs text-slate-500",
																		children: [community.members || 0, " members"]
																	})]
																})]
															}, `comm-${community.id}`))]
														})
													]
												});
											})()
										})
									]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2 mb-8 text-sm",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-white/60 mr-1",
										children: "Popular Exams:"
									}),
									/* @__PURE__ */ jsx(Link$1, {
										href: `${basePath}/search?q=JEE`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "JEE"
									}),
									/* @__PURE__ */ jsx(Link$1, {
										href: `${basePath}/search?q=NEET`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "NEET"
									}),
									/* @__PURE__ */ jsx(Link$1, {
										href: `${basePath}/search?q=NDA`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "NDA"
									}),
									/* @__PURE__ */ jsx(Link$1, {
										href: `${basePath}/search?q=CLAT`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "CLAT"
									}),
									/* @__PURE__ */ jsx(Link$1, {
										href: `${basePath}/search?q=CUET`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "CUET"
									}),
									/* @__PURE__ */ jsx(Link$1, {
										href: `${basePath}/search?q=Foundation`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "Foundation"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-3",
								children: [/* @__PURE__ */ jsx(Link$1, {
									href: `${basePath}/business`,
									className: "btn-amber px-6 py-3 transition-colors text-center inline-flex items-center justify-center",
									children: "Explore Institutes"
								}), /* @__PURE__ */ jsx("a", {
									href: "#top-institutes",
									className: "bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors text-center inline-flex items-center justify-center",
									children: "Compare Coaching"
								})]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-5 relative hidden md:block",
						children: /* @__PURE__ */ jsxs("div", {
							className: "relative w-full h-[500px] flex items-center justify-center",
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl" }),
								validSlides.map((slide, index) => {
									return /* @__PURE__ */ jsx("img", {
										src: typeof slide === "string" ? slide : slide.image_url || slide.image || slide.coverImage,
										alt: `Coaching institute in Sikar — slide ${index + 1}`,
										fetchPriority: index === 0 ? "high" : "low",
										loading: index === 0 ? "eager" : "lazy",
										decoding: index === 0 ? "sync" : "async",
										className: `absolute z-10 w-full max-w-sm rounded-2xl shadow-2xl border-4 border-white/10 object-cover aspect-[4/5] transition-all duration-1000 ${index === currentSlideIndex ? "opacity-100 scale-100 hover:-translate-y-2" : "opacity-0 scale-95 pointer-events-none"}`
									}, `side-${index}`);
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute top-10 -left-10 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-3 animate-float",
									children: [/* @__PURE__ */ jsx("div", {
										className: "bg-green-100 p-2 rounded-full text-green-600",
										children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold text-slate-800",
										children: "Verified"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs text-slate-500",
										children: "Institutes"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-20 -right-5 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-3 animate-float-delayed",
									children: [/* @__PURE__ */ jsx("div", {
										className: "bg-amber-100 p-2 rounded-full text-amber-600",
										children: /* @__PURE__ */ jsx(Star, { className: "w-6 h-6 fill-current" })
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold text-slate-800",
										children: "Top Rated"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs text-slate-500",
										children: "Reviews"
									})] })]
								})
							]
						})
					})]
				})
			})
		]
	});
};
var LazySection = ({ children, minHeight }) => {
	const [isVisible, setIsVisible] = React.useState(false);
	const ref = React.useRef(null);
	React.useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsVisible(true);
				observer.disconnect();
			}
		}, { rootMargin: "300px" });
		if (ref.current) observer.observe(ref.current);
		return () => {
			observer.disconnect();
		};
	}, []);
	return /* @__PURE__ */ jsx("div", {
		ref,
		style: { minHeight: isVisible ? "auto" : minHeight },
		children: isVisible ? children : null
	});
};
function Welcome(props) {
	const { morePosts, publishedStories, sliders, categories, meta, featuredBusinesses, feedPosts, topCommunities } = props;
	const basePath = typeof window !== "undefined" && window.BASE_PATH ? window.BASE_PATH : "";
	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white dark:bg-zinc-950 min-h-screen font-sans",
		children: [
			/* @__PURE__ */ jsx(Navbar, { global_nav: props.global_nav }),
			/* @__PURE__ */ jsxs("main", { children: [
				/* @__PURE__ */ jsx(HomeHero, {
					activeSlides: sliders || [],
					basePath,
					categories: categories || [],
					featuredBusinesses: featuredBusinesses || [],
					fallbackImage: meta?.preload_image
				}),
				/* @__PURE__ */ jsx(LazySection, {
					minHeight: "80px",
					children: /* @__PURE__ */ jsx(TrustMarquee, { categories: categories || [] })
				}),
				/* @__PURE__ */ jsx(LazySection, {
					minHeight: "384px",
					children: /* @__PURE__ */ jsx(InstitutesSection, {
						featuredBusinesses: featuredBusinesses || [],
						basePath,
						formatDate
					})
				}),
				/* @__PURE__ */ jsx(LazySection, {
					minHeight: "384px",
					children: /* @__PURE__ */ jsx(CommunityFeedSection, {
						basePath,
						feedPosts,
						topCommunities
					})
				}),
				/* @__PURE__ */ jsx(LazySection, {
					minHeight: "400px",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: /* @__PURE__ */ jsx("div", { style: { minHeight: "400px" } }),
						children: /* @__PURE__ */ jsx(SeoContent, { basePath })
					})
				}),
				/* @__PURE__ */ jsx(LazySection, {
					minHeight: "400px",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: /* @__PURE__ */ jsx("div", { style: { minHeight: "400px" } }),
						children: /* @__PURE__ */ jsx(BlogSection, {
							morePosts: morePosts || [],
							basePath,
							formatDate
						})
					})
				}),
				/* @__PURE__ */ jsx(LazySection, {
					minHeight: "400px",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: /* @__PURE__ */ jsx("div", { style: { minHeight: "400px" } }),
						children: /* @__PURE__ */ jsx(CategorySection, {
							categories: categories || [],
							basePath
						})
					})
				}),
				/* @__PURE__ */ jsx(LazySection, {
					minHeight: "300px",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: /* @__PURE__ */ jsx("div", { style: { minHeight: "300px" } }),
						children: /* @__PURE__ */ jsx(StoriesSection, {
							stories: publishedStories || [],
							basePath
						})
					})
				}),
				/* @__PURE__ */ jsx(LazySection, {
					minHeight: "300px",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: /* @__PURE__ */ jsx("div", { style: { minHeight: "300px" } }),
						children: /* @__PURE__ */ jsx(FAQSection, {})
					})
				})
			] }),
			/* @__PURE__ */ jsx(BlogFooter, { global_nav: props.global_nav })
		]
	});
}
//#endregion
export { Welcome as default };
