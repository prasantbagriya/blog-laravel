import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { t as Navbar } from "./GlobalNavbar-dTNI2462.js";
import { t as BlogFooter } from "./BlogFooter-L7SI1qpL.js";
import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { Head, Link, router } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Award, Backpack, Beaker, BookOpen, CheckCircle2, ChevronDown, ChevronRight, GraduationCap, MapPin, MessageSquare, PlayCircle, Scale, Search, Share2, ShieldCheck, Star, Target, TrendingUp } from "lucide-react";
//#region resources/js/Pages/Welcome.jsx
var Image$1 = ({ src, alt, fill, style, sizes, priority, fetchPriority, className, ...props }) => {
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
		className,
		...props
	});
};
var HomeHero = ({ activeSlides, basePath, categories, featuredBusinesses }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [suggestions, setSuggestions] = useState({
		categories: [],
		businesses: [],
		blogs: []
	});
	const [isLoading, setIsLoading] = useState(false);
	const validSlides = activeSlides && activeSlides.length > 0 ? activeSlides : [{ image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80" }];
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
		if (searchQuery.trim()) router.visit(`${basePath || ""}/search?q=${encodeURIComponent(searchQuery)}`);
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "relative w-full min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden bg-slate-900",
		children: [
			validSlides.map((slide, index) => {
				const imgUrl = typeof slide === "string" ? slide : slide.image_url || slide.image || slide.coverImage;
				return /* @__PURE__ */ jsx("div", {
					className: `absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlideIndex ? "opacity-100" : "opacity-0"}`,
					style: { backgroundImage: `url('${imgUrl}')` }
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
								children: "Find the Best Coaching in Sikar"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-base md:text-lg text-white/80 max-w-xl mb-8",
								children: "Compare coaching institutes, courses, fees, results and student reviews — all in one place."
							}),
							/* @__PURE__ */ jsx("div", {
								className: "relative max-w-xl mb-6",
								children: /* @__PURE__ */ jsxs("form", {
									onSubmit: handleSearch,
									children: [/* @__PURE__ */ jsx(AnimatedBorderCard, {
										containerClassName: "rounded-full",
										className: "rounded-full",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 bg-white px-2 py-2 group",
											children: [
												/* @__PURE__ */ jsx(Search, { className: "w-5 h-5 text-slate-400 ml-3 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" }),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													name: "q",
													className: "flex-1 border-0 outline-none focus:ring-0 text-slate-900 text-sm md:text-base py-2.5 bg-transparent placeholder-slate-400",
													placeholder: "Search coaching, courses, exams or institutes...",
													value: searchQuery,
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
													className: "bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full px-6 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none ring-0 focus:ring-0",
													children: "Search"
												})
											]
										})
									}), showSuggestions && searchQuery.trim().length > 0 && /* @__PURE__ */ jsx("div", {
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
														}), suggestions.categories.map((cat) => /* @__PURE__ */ jsxs(Link, {
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
														}), suggestions.businesses.map((biz) => /* @__PURE__ */ jsxs(Link, {
															href: `${basePath || ""}/reviews/${biz.category || "coaching-institutes"}/${biz.slug}`,
															className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
															children: [/* @__PURE__ */ jsx("div", {
																className: "w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200",
																children: /* @__PURE__ */ jsx("img", {
																	src: biz.logo || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
																	alt: biz.name,
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
													}), suggestions.blogs.map((blog) => /* @__PURE__ */ jsxs(Link, {
														href: `${basePath || ""}/blog/${blog.slug}`,
														className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
														children: [/* @__PURE__ */ jsx("div", {
															className: "bg-amber-50 p-2 rounded-lg text-amber-600",
															children: /* @__PURE__ */ jsx(BookOpen, { size: 16 })
														}), /* @__PURE__ */ jsx("span", {
															className: "font-medium text-slate-800 line-clamp-1",
															children: blog.title
														})]
													}, `blog-${blog.id}`))] }),
													suggestions.communities?.length > 0 && /* @__PURE__ */ jsxs("div", {
														className: "mb-2",
														children: [/* @__PURE__ */ jsx("div", {
															className: "px-4 py-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase",
															children: "Communities"
														}), suggestions.communities.map((community) => /* @__PURE__ */ jsxs(Link, {
															href: `${basePath || ""}/r/${community.name}`,
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
									})]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2 mb-8 text-sm",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-white/60 mr-1",
										children: "Popular Exams:"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: `${basePath}/search?q=JEE`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "JEE"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: `${basePath}/search?q=NEET`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "NEET"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: `${basePath}/search?q=NDA`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "NDA"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: `${basePath}/search?q=CLAT`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "CLAT"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: `${basePath}/search?q=CUET`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "CUET"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: `${basePath}/search?q=Foundation`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "Foundation"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-3",
								children: [/* @__PURE__ */ jsx(Link, {
									href: `${basePath}/reviews`,
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
										alt: "Slide",
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
var TrustMarquee = ({ categories }) => {
	const items = categories && categories.length > 0 ? categories : [
		{
			name: "Engineering",
			id: 1
		},
		{
			name: "Medical",
			id: 2
		},
		{
			name: "Foundation",
			id: 3
		},
		{
			name: "Commerce",
			id: 4
		},
		{
			name: "Arts",
			id: 5
		},
		{
			name: "Law",
			id: 6
		}
	];
	return /* @__PURE__ */ jsxs("section", {
		className: "py-6 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4",
			children: /* @__PURE__ */ jsx("p", {
				className: "text-xs font-bold text-slate-400 dark:text-zinc-500 tracking-wider",
				children: "Trusted Categories & Streams"
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]",
			children: /* @__PURE__ */ jsx("div", {
				className: "flex animate-marquee items-center justify-center space-x-8 md:space-x-16 whitespace-nowrap",
				children: [
					...items,
					...items,
					...items
				].map((item, idx) => /* @__PURE__ */ jsxs("div", {
					className: "text-slate-400 dark:text-zinc-500 font-bold text-xl md:text-2xl opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6" }),
						" ",
						item.name.toLowerCase() === "eduction" ? "Education" : item.name
					]
				}, `${item.id}-${idx}`))
			})
		})]
	});
};
var InstitutesSection = ({ featuredBusinesses, basePath }) => {
	const businesses = featuredBusinesses || [];
	if (businesses.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		id: "top-institutes",
		className: "pt-10 pb-0 md:pt-14 md:pb-0 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
					children: "Top Coaching Institutes in Sikar"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg",
					children: "Explore institutes based on courses, reviews, results and available information."
				})] }), /* @__PURE__ */ jsx(Link, {
					href: `${basePath}/reviews`,
					className: "hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm",
					children: "View All"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
				children: businesses.map((biz) => {
					const reviewUrl = `${basePath}/reviews/${biz.category || "coaching-institutes"}/${biz.slug}`;
					return /* @__PURE__ */ jsxs("article", {
						className: "bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300 flex flex-col group",
						children: [/* @__PURE__ */ jsx(Link, {
							href: reviewUrl,
							className: "relative aspect-[16/9] w-full block overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center p-4",
							children: /* @__PURE__ */ jsx(Image$1, {
								src: biz.logo || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
								alt: biz.name,
								fill: true,
								style: { objectFit: "contain" },
								className: "group-hover:scale-105 transition-transform duration-500"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 md:p-5 flex-grow flex flex-col border-t border-slate-100 dark:border-zinc-800",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
									children: /* @__PURE__ */ jsx(Link, {
										href: reviewUrl,
										className: "focus:outline-none",
										children: biz.name
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-zinc-400 mb-3",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-amber-500 font-semibold",
										children: [
											/* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-amber-500" }),
											" ",
											biz.rating || 4.5
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-blue-500" }),
											" Trust: ",
											biz.trustScore || 85,
											"/100"
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-1.5 mb-4",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/30",
											children: biz.categoryName || biz.category
										}),
										biz.isVerified && /* @__PURE__ */ jsxs("span", {
											className: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded border border-green-200 dark:border-green-800/30 flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3" }), " Verified"]
										}),
										biz.location && /* @__PURE__ */ jsxs("span", {
											className: "bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(MapPin, { size: 12 }), biz.location]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-1 text-sm text-slate-600 dark:text-zinc-400",
									children: /* @__PURE__ */ jsxs(Link, {
										href: reviewUrl,
										className: "block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm",
										children: [
											"Read Reviews (",
											biz.reviewCount || 0,
											")"
										]
									})
								})
							]
						})]
					}, biz.id);
				})
			})]
		})
	});
};
var CommunityFeedSection = ({ basePath, feedPosts, topCommunities }) => {
	const displayPosts = feedPosts || [];
	const displayCommunities = topCommunities || [];
	return /* @__PURE__ */ jsxs("section", {
		className: "pt-6 pb-10 md:pt-10 md:pb-14 bg-slate-50 dark:bg-zinc-950 relative border-b border-slate-200 dark:border-zinc-800",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none",
			style: {
				backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
				backgroundSize: "24px 24px"
			}
		}), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-4 border border-blue-200 dark:border-blue-800/30",
						children: [/* @__PURE__ */ jsx(MessageSquare, { size: 14 }), " Student Community"]
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight",
						children: "Recent Discussions"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-600 dark:text-zinc-400 mt-3 text-base md:text-lg max-w-2xl",
						children: "Join the conversation with thousands of students. Share study materials, ask doubts, and get exam strategies."
					})
				] }), /* @__PURE__ */ jsxs(Link, {
					href: `${basePath}/community`,
					className: "text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 group shrink-0 whitespace-nowrap hidden md:inline-flex",
					children: ["View All Feed ", /* @__PURE__ */ jsx(ChevronRight, {
						size: 18,
						className: "group-hover:translate-x-1 transition-transform"
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-8 space-y-5",
					children: [displayPosts.length > 0 ? displayPosts.map((post) => /* @__PURE__ */ jsxs("div", {
						onClick: () => router.visit(`/r/${post.community}/comments/${post.id}`),
						className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-5 md:p-6 flex gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer group",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "hidden sm:flex flex-col items-center gap-2 min-w-[44px]",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: (e) => {
									e.stopPropagation();
									router.post(route("vote"), {
										votable_type: "post",
										votable_id: post.id,
										value: post.has_voted ? 1 : 1
									}, { preserveScroll: true });
								},
								className: `p-1.5 rounded-full transition-colors border-none outline-none focus:outline-none ring-0 focus:ring-0 ${post.has_voted ? "text-white bg-amber-500 shadow-md shadow-amber-500/20" : "text-slate-400 dark:text-zinc-500 hover:text-white hover:bg-amber-500 hover:shadow-md hover:shadow-amber-500/20"}`,
								title: post.has_voted ? "Upvoted" : "Upvote",
								children: /* @__PURE__ */ jsx(TrendingUp, { size: 20 })
							}), /* @__PURE__ */ jsx("span", {
								className: `font-bold text-sm ${post.has_voted ? "text-amber-500" : "text-slate-800 dark:text-zinc-300"}`,
								children: post.score
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 mb-3 flex-wrap",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border border-blue-100 dark:border-blue-800/30",
											children: ["r/", post.community]
										}),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsxs("span", { children: ["Posted by ", /* @__PURE__ */ jsxs("span", {
											className: "font-bold text-slate-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
											children: ["u/", post.author?.username || post.author]
										})] }),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsx("span", { children: post.created_at ? new Date(post.created_at).toLocaleDateString() : post.time })
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-slate-900 dark:text-white text-lg md:text-xl mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2",
									children: post.title
								}),
								post.type === "TEXT" && post.content && /* @__PURE__ */ jsx("p", {
									className: "text-slate-600 dark:text-zinc-400 text-sm line-clamp-2 mb-3 leading-relaxed",
									children: post.content.replace(/<[^>]*>?/gm, "")
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 -ml-1.5 mt-2 flex-nowrap whitespace-nowrap overflow-x-auto pb-1",
									style: {
										scrollbarWidth: "none",
										msOverflowStyle: "none"
									},
									children: [
										/* @__PURE__ */ jsxs("button", {
											onClick: (e) => {
												e.stopPropagation();
												router.post(route("vote"), {
													votable_type: "post",
													votable_id: post.id,
													value: 1
												}, { preserveScroll: true });
											},
											className: `shrink-0 whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] border-0 outline-none focus:outline-none focus:ring-0 sm:hidden ${post.has_voted ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "bg-slate-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400"}`,
											children: [/* @__PURE__ */ jsx(TrendingUp, {
												size: 16,
												className: post.has_voted ? "text-amber-500" : ""
											}), /* @__PURE__ */ jsx("span", {
												className: post.has_voted ? "text-amber-500" : "",
												children: post.score
											})]
										}),
										/* @__PURE__ */ jsxs(Link, {
											href: `/r/${post.community}/comments/${post.id}`,
											onClick: (e) => e.stopPropagation(),
											className: "shrink-0 whitespace-nowrap flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-2 rounded-xl transition-colors font-bold text-[13px]",
											children: [
												/* @__PURE__ */ jsx(MessageSquare, {
													size: 16,
													className: "text-blue-500"
												}),
												post.comments_count || post.comments,
												" Comments"
											]
										}),
										/* @__PURE__ */ jsxs("button", {
											onClick: (e) => {
												e.stopPropagation();
												navigator.clipboard?.writeText(`${window.location.origin}/r/${post.community}/comments/${post.id}`);
											},
											className: "shrink-0 whitespace-nowrap flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] text-slate-600 dark:text-zinc-300 border-0 outline-none focus:outline-none focus:ring-0",
											children: [/* @__PURE__ */ jsx(Share2, {
												size: 16,
												strokeWidth: 2,
												className: "text-slate-500 dark:text-zinc-400"
											}), "Share"]
										})
									]
								})
							]
						})]
					}, post.id)) : /* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center",
						children: [
							/* @__PURE__ */ jsx(MessageSquare, {
								size: 48,
								className: "text-slate-300 dark:text-zinc-700 mb-4"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-xl font-bold text-slate-700 dark:text-zinc-300 mb-2",
								children: "No discussions yet"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-slate-500 dark:text-zinc-500 mb-6",
								children: "Be the first to start a conversation in our community."
							}),
							/* @__PURE__ */ jsx(Link, {
								href: "/submit",
								className: "px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md",
								children: "Create a Post"
							})
						]
					}), /* @__PURE__ */ jsxs(Link, {
						href: `${basePath}/community`,
						className: "md:hidden flex w-full justify-center items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-colors group mt-2",
						children: ["View All Feed ", /* @__PURE__ */ jsx(ChevronRight, {
							size: 18,
							className: "group-hover:translate-x-1 transition-transform"
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-4 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden relative",
						children: [/* @__PURE__ */ jsx("div", { className: "h-2 w-full bg-gradient-to-r from-blue-500 to-amber-500" }), /* @__PURE__ */ jsxs("div", {
							className: "p-6",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-bold text-xl text-slate-900 dark:text-white mb-5",
								children: "Top Communities"
							}), /* @__PURE__ */ jsx("div", {
								className: "divide-y divide-slate-100 dark:divide-zinc-800",
								children: displayCommunities.length > 0 ? displayCommunities.map((community, index) => /* @__PURE__ */ jsxs(Link, {
									href: `/r/${community.name}`,
									className: "p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "font-bold text-slate-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors w-4",
											children: index + 1
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ jsx("div", {
												className: "flex items-center justify-between mb-1",
												children: /* @__PURE__ */ jsxs("h4", {
													className: "font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
													children: ["r/", community.name]
												})
											}), /* @__PURE__ */ jsxs("div", {
												className: "text-xs font-bold text-slate-500 dark:text-zinc-500 flex items-center gap-2 mt-0.5",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md",
													children: [
														/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
														(() => {
															const count = community.members_count || community.members;
															if (!count) return "1k+";
															const num = Number(count);
															if (isNaN(num)) return count;
															if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k+";
															return num + "+";
														})(),
														" Members"
													]
												}), /* @__PURE__ */ jsxs("span", {
													className: "flex items-center gap-1 text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-500/20",
													children: [/* @__PURE__ */ jsx(TrendingUp, { size: 12 }), " Hot"]
												})]
											})]
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: (e) => {
												e.preventDefault();
												e.stopPropagation();
												router.post(route("community.join", community.id), {}, { preserveScroll: true });
											},
											className: `px-4 py-1.5 text-xs font-bold rounded-full transition-all border ${community.is_joined ? "border-transparent bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700" : "border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:border-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:hover:text-white shadow-sm"}`,
											children: community.is_joined ? "Joined" : "Join"
										})
									]
								}, community.id)) : /* @__PURE__ */ jsxs("div", {
									className: "p-8 text-center",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-bold text-slate-500 dark:text-zinc-500 mb-4",
										children: "No top communities yet"
									}), /* @__PURE__ */ jsx(Link, {
										href: "/communities/create",
										className: "text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors",
										children: "Create one"
									})]
								})
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-slate-900 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden border border-slate-700",
						children: [
							/* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" }),
							/* @__PURE__ */ jsx("h3", {
								className: "font-bold text-xl mb-2 relative z-10 text-white",
								children: "Have a Question?"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-slate-200 text-sm mb-5 relative z-10",
								children: "Get answers from toppers and expert faculty in Sikar."
							}),
							/* @__PURE__ */ jsx(Link, {
								href: `${basePath}/community/new`,
								className: "btn-amber px-6 py-2.5 w-full block relative z-10 shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform text-slate-900 font-bold rounded-full",
								children: "Ask Now"
							}),
							/* @__PURE__ */ jsx(Link, {
								href: `${basePath}/contact`,
								className: "mt-3 block relative z-10 text-sm font-bold text-slate-300 hover:text-white transition-colors underline underline-offset-2",
								children: "Contact Us →"
							})
						]
					})]
				})]
			})]
		})]
	});
};
var BlogSection = ({ morePosts, basePath, formatDate }) => {
	const posts = (morePosts || []).slice(0, 4);
	if (posts.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		className: "py-10 md:py-14 bg-slate-50 dark:bg-zinc-900",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-blue-500 text-sm font-bold tracking-wider mb-1",
						children: "Editor's Picks"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
						children: "Explore the Blog"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg",
						children: "Read the latest articles, guides, and updates."
					})
				] }), /* @__PURE__ */ jsx(Link, {
					href: `${basePath}/blog`,
					className: "hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm",
					children: "View All Blog"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
				children: posts.map((post) => /* @__PURE__ */ jsxs(AnimatedBorderCard, {
					containerClassName: "hover:-translate-y-1 transition-all duration-300 h-full flex flex-col",
					className: "flex-grow flex flex-col",
					alwaysShowBorder: true,
					children: [/* @__PURE__ */ jsxs(Link, {
						href: `${basePath}/blog/${post.slug}`,
						className: "relative aspect-[16/9] w-full block overflow-hidden shrink-0",
						children: [/* @__PURE__ */ jsx(Image$1, {
							src: post.coverImage || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
							alt: post.title,
							fill: true,
							style: { objectFit: "cover" },
							className: "group-hover:scale-105 transition-transform duration-500"
						}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-4 md:p-5 flex-grow flex flex-col bg-white dark:bg-zinc-900",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
								children: /* @__PURE__ */ jsx(Link, {
									href: `${basePath}/blog/${post.slug}`,
									className: "focus:outline-none",
									children: post.title
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-1.5 mb-4",
								children: /* @__PURE__ */ jsx("span", {
									className: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/30",
									children: post.category || "Article"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-1 text-sm text-slate-600 dark:text-zinc-400",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between items-center mb-3",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500 dark:text-zinc-400",
										children: "Posted:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-slate-800 dark:text-zinc-200",
										children: formatDate(post.date)
									})]
								}), /* @__PURE__ */ jsx(Link, {
									href: `${basePath}/blog/${post.slug}`,
									className: "block w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-center font-bold py-2 rounded-xl transition-colors text-sm",
									children: "Read Article"
								})]
							})
						]
					})]
				}, post.id))
			})]
		})
	});
};
var CategorySection = ({ categories, basePath }) => {
	if (!categories || categories.length === 0) return null;
	const getCategoryStyle = (name) => {
		const lowerName = name.toLowerCase();
		if (lowerName.includes("science") || lowerName.includes("neet") || lowerName.includes("medical") || lowerName.includes("doctor")) return {
			icon: Beaker,
			colorClass: "text-emerald-500",
			bgClass: "bg-emerald-50 dark:bg-emerald-500/10",
			hoverBgClass: "group-hover:bg-emerald-500",
			shadowClass: "hover:shadow-emerald-500/20",
			borderClass: "hover:border-emerald-400"
		};
		if (lowerName.includes("commerce") || lowerName.includes("ca") || lowerName.includes("bank")) return {
			icon: Target,
			colorClass: "text-amber-500",
			bgClass: "bg-amber-50 dark:bg-amber-500/10",
			hoverBgClass: "group-hover:bg-amber-500",
			shadowClass: "hover:shadow-amber-500/20",
			borderClass: "hover:border-amber-400"
		};
		if (lowerName.includes("arts") || lowerName.includes("law") || lowerName.includes("clat") || lowerName.includes("upsc") || lowerName.includes("ras") || lowerName.includes("ias")) return {
			icon: Scale,
			colorClass: "text-purple-500",
			bgClass: "bg-purple-50 dark:bg-purple-500/10",
			hoverBgClass: "group-hover:bg-purple-500",
			shadowClass: "hover:shadow-purple-500/20",
			borderClass: "hover:border-purple-400"
		};
		if (lowerName.includes("school") || lowerName.includes("board") || lowerName.includes("cbse") || lowerName.includes("rbse")) return {
			icon: Backpack,
			colorClass: "text-pink-500",
			bgClass: "bg-pink-50 dark:bg-pink-500/10",
			hoverBgClass: "group-hover:bg-pink-500",
			shadowClass: "hover:shadow-pink-500/20",
			borderClass: "hover:border-pink-400"
		};
		if (lowerName.includes("engineering") || lowerName.includes("jee") || lowerName.includes("tech")) return {
			icon: BookOpen,
			colorClass: "text-blue-500",
			bgClass: "bg-blue-50 dark:bg-blue-500/10",
			hoverBgClass: "group-hover:bg-blue-500",
			shadowClass: "hover:shadow-blue-500/20",
			borderClass: "hover:border-blue-400"
		};
		return {
			icon: GraduationCap,
			colorClass: "text-indigo-500",
			bgClass: "bg-indigo-50 dark:bg-indigo-500/10",
			hoverBgClass: "group-hover:bg-indigo-500",
			shadowClass: "hover:shadow-indigo-500/20",
			borderClass: "hover:border-indigo-400"
		};
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "pt-10 pb-6 md:pt-14 md:pb-10 bg-white dark:bg-zinc-950 overflow-hidden relative",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/5 rounded-full blur-3xl opacity-50 pointer-events-none -mr-48 -mt-48" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-10 md:mb-14",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
					children: "Explore by Stream"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg",
					children: "Find the right path for your career goals."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex animate-marquee-fast hover:[animation-play-state:paused] items-center justify-center space-x-4 md:space-x-6 whitespace-nowrap pt-4 pb-8 px-2",
					children: [
						...categories,
						...categories,
						...categories,
						...categories
					].map((cat, i) => {
						const style = getCategoryStyle(cat.name);
						const Icon = style.icon;
						return /* @__PURE__ */ jsxs(Link, {
							href: `${basePath}/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`,
							className: `bg-white dark:bg-zinc-900 w-44 h-44 rounded-[1.5rem] border border-slate-200 dark:border-zinc-800 transition-all duration-300 group flex flex-col items-center justify-center text-center shrink-0 hover:-translate-y-2 hover:shadow-xl ${style.shadowClass} ${style.borderClass}`,
							children: [/* @__PURE__ */ jsx("div", {
								className: `w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${style.bgClass} ${style.hoverBgClass}`,
								children: /* @__PURE__ */ jsx(Icon, { className: `w-7 h-7 transition-colors duration-300 group-hover:text-white ${style.colorClass}` })
							}), /* @__PURE__ */ jsx("h3", {
								className: "font-extrabold text-slate-800 dark:text-zinc-100 text-sm md:text-[15px] group-hover:text-slate-900 dark:group-hover:text-white transition-colors whitespace-normal break-words w-full px-4 leading-snug",
								children: cat.name.toLowerCase() === "eduction" ? "Education" : cat.name
							})]
						}, `${cat.id}-${i}`);
					})
				})
			})]
		})]
	});
};
var StoriesSection = ({ stories, basePath }) => {
	if (!stories || stories.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		className: "pt-20 pb-10 md:pt-24 md:pb-14 bg-slate-50 dark:bg-zinc-900 border-y border-slate-200 dark:border-zinc-800",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight",
					children: "Visual Web Stories"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg",
					children: "Bite-sized visual guides for modern students."
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x hide-scrollbar",
				children: stories.map((story) => /* @__PURE__ */ jsxs(Link, {
					href: `${basePath}/stories/${story.slug}`,
					className: "relative flex-none w-[220px] md:w-[260px] aspect-[9/16] rounded-xl overflow-hidden snap-start group transition-all duration-300",
					children: [
						/* @__PURE__ */ jsx(Image$1, {
							src: story.posterImage || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
							alt: story.title,
							fill: true,
							style: { objectFit: "cover" },
							className: "group-hover:scale-105 transition-transform duration-700"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" }),
						/* @__PURE__ */ jsx("div", {
							className: "absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white",
							children: /* @__PURE__ */ jsx(PlayCircle, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute bottom-0 left-0 right-0 p-5",
							children: /* @__PURE__ */ jsx("h3", {
								className: "text-white font-bold text-base md:text-lg leading-snug drop-shadow-md",
								children: story.title
							})
						})
					]
				}, story.id))
			})]
		})
	});
};
var SeoContent = ({ basePath }) => /* @__PURE__ */ jsx("section", {
	className: "py-10 md:py-14 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800",
	children: /* @__PURE__ */ jsx("div", {
		className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("span", {
					className: "text-blue-600 font-bold tracking-widest text-xs mb-3 block",
					children: "About Us"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight",
					children: "Coaching in Sikar: Your Complete Education Guide"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed space-y-4",
					children: [/* @__PURE__ */ jsxs("p", { children: [
						"Coaching in Sikar is an education platform helping students and parents find the best coaching in Sikar through top ",
						/* @__PURE__ */ jsx(Link, {
							href: `${basePath}/reviews/coaching-institutes`,
							className: "text-blue-600 dark:text-blue-400 font-semibold hover:underline",
							children: "coaching institutes"
						}),
						", coaching centre lists, fees, rankings, reviews, results, admissions, and other comparisons. We cover NEET coaching, JEE coaching, IAS / RAS / SSC-CGL Coaching, CLAT & CA Coaching, CUET, Olympiads, schools, colleges, and other competitive exam coaching educational information."
					] }), /* @__PURE__ */ jsxs("p", { children: [
						"Starting with Sikar, our platform covers more than just top coaching institutes in Sikar, Rajasthan. Yes, we also provide information on the best schools, colleges, education news, results, Olympiads, hospitals, and other useful local information. We aim to make finding top institutions, fees, admissions, results, reviews, and opportunities simple, while expanding our coverage beyond Sikar to more cities, regions, categories, and ",
						/* @__PURE__ */ jsx(Link, {
							href: `${basePath}/feed`,
							className: "text-blue-600 dark:text-blue-400 font-semibold hover:underline",
							children: "communities"
						}),
						"."
					] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 flex flex-wrap items-center gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400",
							children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-6 h-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-bold text-slate-800 dark:text-white",
							children: "Verified Data"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-sm text-slate-500 dark:text-zinc-400",
							children: "Trusted reviews"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600 dark:text-amber-400",
							children: /* @__PURE__ */ jsx(Award, { className: "w-6 h-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-bold text-slate-800 dark:text-white",
							children: "Top Institutes"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-sm text-slate-500 dark:text-zinc-400",
							children: "Ranked accurately"
						})] })]
					})]
				})
			] }), /* @__PURE__ */ jsxs("div", {
				className: "relative mt-8 lg:mt-0",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-blue-600/10 rounded-[2rem] transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6" }), /* @__PURE__ */ jsx("img", {
					src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
					alt: "Students studying",
					className: "relative z-10 rounded-[2rem] shadow-xl w-full object-cover aspect-[4/3] border-4 border-white dark:border-zinc-700"
				})]
			})]
		})
	})
});
var FAQSection = () => {
	const [openIndex, setOpenIndex] = useState(0);
	const faqs = [
		{
			question: "What is Coachings in Sikar?",
			answer: "Coachings in Sikar is a trusted source that helps students to find the best coaching in Sikar, top schools and colleges, Best JEE & NEET coaching, exam results, fees, admissions, and other education updates."
		},
		{
			question: "How can I find the best coaching in Sikar?",
			answer: /* @__PURE__ */ jsxs(Fragment, { children: [
				"Use some ",
				/* @__PURE__ */ jsx("a", {
					href: "https://coachingsinsikar.com/blog/top-5-parameters-to-choose-best-jee-coaching-in-sikar",
					className: "text-blue-600 dark:text-blue-400 hover:underline",
					children: "parameters"
				}),
				" or compare the top JEE/NEET/CLAT/NDA/CA/Olympiads coaching institutes in Sikar based on results, faculty, fees, reviews, facilities, and student support before choosing."
			] })
		},
		{
			question: "Which are the best coaching centers in Sikar?",
			answer: "The Sikar Coaching Center List helps students explore and compare coaching centers for JEE, NEET, and other competitive exams based on courses, fees, results, and facilities."
		},
		{
			question: "How to choose the best JEE coaching in Sikar?",
			answer: /* @__PURE__ */ jsxs(Fragment, { children: [
				"To choose the ",
				/* @__PURE__ */ jsx("a", {
					href: "https://coachingsinsikar.com/blog/which-coaching-is-best-for-jee-in-sikar",
					className: "text-blue-600 dark:text-blue-400 hover:underline",
					children: "best JEE coaching in Sikar"
				}),
				", compare JEE results, experienced faculty, study material, regular tests, doubt support, fees, and the overall learning environment."
			] })
		},
		{
			question: "Which are the best coaching in Sikar with fees?",
			answer: "You can compare best coaching in Sikar with fees by checking their courses, results, faculty, fee structure, facilities, and student support."
		}
	];
	return /* @__PURE__ */ jsxs("section", {
		className: "pt-16 pb-16 md:pt-24 md:pb-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "FAQPage",
					"mainEntity": [
						{
							"@type": "Question",
							"name": "What is Coachings in Sikar?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Coachings in Sikar is a trusted source that helps students to find the best coaching in Sikar, top schools and colleges, Best JEE & NEET coaching, exam results, fees, admissions, and other education updates."
							}
						},
						{
							"@type": "Question",
							"name": "How can I find the best coaching in Sikar?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Use some <a href=\"https://coachingsinsikar.com/blog/top-5-parameters-to-choose-best-jee-coaching-in-sikar\">parameters</a> or compare the top JEE/NEET/CLAT/NDA/CA/Olympiads coaching institutes in Sikar based on results, faculty, fees, reviews, facilities, and student support before choosing."
							}
						},
						{
							"@type": "Question",
							"name": "Which are the best coaching centers in Sikar?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "The Sikar Coaching Center List helps students explore and compare coaching centers for JEE, NEET, and other competitive exams based on courses, fees, results, and facilities."
							}
						},
						{
							"@type": "Question",
							"name": "How to choose the best JEE coaching in Sikar?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "To choose the <a href=\"https://coachingsinsikar.com/blog/which-coaching-is-best-for-jee-in-sikar\">best JEE coaching in Sikar</a>, compare JEE results, experienced faculty, study material, regular tests, doubt support, fees, and the overall learning environment."
							}
						},
						{
							"@type": "Question",
							"name": "Which are the best coaching in Sikar with fees?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "You can compare best coaching in Sikar with fees by checking their courses, results, faculty, fee structure, facilities, and student support."
							}
						},
						{
							"@type": "Question",
							"name": "Which are Top 5 NEET Coaching in Sikar?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "The <a href=\"https://coachingsinsikar.com/blog/best-neet-coachings-in-sikar\">top 5 NEET coaching in Sikar</a> include leading options known for NEET preparation, experienced faculty, regular tests, study material, and student support."
							}
						},
						{
							"@type": "Question",
							"name": "Why do students choose CA coaching in Sikar?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Students choose the <a href=\"https://coachingsinsikar.com/blog/best-ca-coaching-in-sikar\">best CA coaching in Sikar</a> for structured preparation, subject-wise classes, regular practice, doubt sessions, and guidance for different CA levels."
							}
						},
						{
							"@type": "Question",
							"name": "Which RBSE schools are considered among the best in Sikar?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "The <a href=\"https://coachingsinsikar.com/blog/best-rbse-school-in-sikar\">5 best RBSE schools in Sikar</a> can be explored through their academic record, facilities, courses, admission process, and student-focused learning environment."
							}
						},
						{
							"@type": "Question",
							"name": "What makes a CBSE school one of the best in Sikar?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "The <a href=\"https://coachingsinsikar.com/blog/best-cbse-schools-in-sikar\">best CBSE school in Sikar</a> combines strong academics with qualified teachers, modern facilities, extracurricular activities, and opportunities for students to develop beyond textbooks."
							}
						},
						{
							"@type": "Question",
							"name": "Where can students prepare for CLAT in Sikar?",
							"acceptedAnswer": {
								"@type": "Answer",
								"text": "Students can find <a href=\"https://coachingsinsikar.com/blog/best-clat-coaching-in-sikar\">best CLAT coaching in Sikar</a> offering preparation for legal aptitude, logical reasoning, English, current affairs, and CLAT mock tests."
							}
						}
					]
				})
			}) }),
			/* @__PURE__ */ jsxs("div", {
				className: "absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" }), /* @__PURE__ */ jsx("div", { className: "absolute top-48 -left-24 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 lg:sticky lg:top-32 space-y-8",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-6",
								children: [/* @__PURE__ */ jsx(MessageSquare, { className: "w-4 h-4" }), " Got Questions?"]
							}),
							/* @__PURE__ */ jsxs("h2", {
								className: "text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight",
								children: ["Frequently Asked ", /* @__PURE__ */ jsx("span", {
									className: "text-blue-600",
									children: "Questions"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed",
								children: "Everything you need to know about coaching institutes, education, and living in Sikar. Can't find the answer you're looking for?"
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 shadow-sm flex items-start gap-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0",
								children: /* @__PURE__ */ jsx(Search, { className: "w-6 h-6 text-amber-600 dark:text-amber-400" })
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-slate-900 dark:text-white mb-1",
									children: "Still have questions?"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-slate-500 dark:text-zinc-400 mb-4",
									children: "Chat with our educational counselors for personalized guidance."
								}),
								/* @__PURE__ */ jsx(Link, {
									href: "/contact",
									className: "btn-amber px-5 py-2 text-sm transition-transform hover:scale-105 inline-block",
									children: "Contact Support"
								})
							] })]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7 space-y-4",
						children: faqs.map((faq, index) => {
							const isOpen = openIndex === index;
							return /* @__PURE__ */ jsxs("div", {
								className: `group border rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? "bg-white dark:bg-zinc-800 shadow-xl shadow-blue-900/5 dark:shadow-none border-blue-200 dark:border-blue-700 ring-1 ring-blue-100 dark:ring-blue-700/30" : "bg-white/60 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-sm"}`,
								children: [/* @__PURE__ */ jsxs("button", {
									className: "w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none focus:ring-0 ring-0 border-none bg-transparent cursor-pointer",
									onClick: () => setOpenIndex(isOpen ? null : index),
									"aria-expanded": isOpen,
									children: [/* @__PURE__ */ jsx("span", {
										className: `font-bold text-lg pr-6 transition-colors duration-300 ${isOpen ? "text-blue-700 dark:text-blue-400" : "text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"}`,
										children: faq.question
									}), /* @__PURE__ */ jsx("div", {
										className: `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? "bg-blue-600 text-white rotate-180 shadow-md shadow-blue-600/20" : "bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500"}`,
										children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5" })
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: `px-6 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"}`,
									children: [/* @__PURE__ */ jsx("div", { className: "w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-zinc-600 to-transparent mb-5" }), /* @__PURE__ */ jsx("p", {
										className: "text-slate-600 dark:text-zinc-400 leading-relaxed text-base m-0",
										children: faq.answer
									})]
								})]
							}, index);
						})
					})]
				})
			})
		]
	});
};
function Welcome(props) {
	const { featuredPost, recentPosts, morePosts, publishedStories, sliders, categories, authors, meta, featuredBusinesses, feedPosts, topCommunities } = props;
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
			/* @__PURE__ */ jsx(SeoMeta, { meta }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", { children: [
				/* @__PURE__ */ jsx(HomeHero, {
					activeSlides: sliders || [],
					basePath,
					categories: categories || [],
					featuredBusinesses: featuredBusinesses || []
				}),
				/* @__PURE__ */ jsx(TrustMarquee, { categories: categories || [] }),
				/* @__PURE__ */ jsx(InstitutesSection, {
					featuredBusinesses: featuredBusinesses || [],
					basePath,
					formatDate
				}),
				/* @__PURE__ */ jsx(CommunityFeedSection, {
					basePath,
					feedPosts,
					topCommunities
				}),
				/* @__PURE__ */ jsx(SeoContent, { basePath }),
				/* @__PURE__ */ jsx(BlogSection, {
					morePosts: morePosts || [],
					basePath,
					formatDate
				}),
				/* @__PURE__ */ jsx(CategorySection, {
					categories: categories || [],
					basePath
				}),
				/* @__PURE__ */ jsx(StoriesSection, {
					stories: publishedStories || [],
					basePath
				}),
				/* @__PURE__ */ jsx(FAQSection, {})
			] }),
			/* @__PURE__ */ jsx(BlogFooter, {}),
			/* @__PURE__ */ jsx("style", {
				jsx: true,
				global: true,
				children: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes float-delayed {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 7s ease-in-out infinite;
                }
                
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333333%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee-fast {
                    animation: marquee 25s linear infinite;
                }
            `
			})
		]
	});
}
//#endregion
export { Welcome as default };
