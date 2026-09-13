import { t as SeoMeta } from "./SeoMeta-B39nRLIK.js";
import { n as Navbar, t as BlogFooter } from "./BlogFooter-BCSF014D.js";
import { Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Award, CheckCircle2, ChevronDown, GraduationCap, MessageSquare, PlayCircle, Search, ShieldCheck, Star, ThumbsUp, TrendingUp } from "lucide-react";
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
	const validSlides = activeSlides && activeSlides.length > 0 ? activeSlides : [{ image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80" }];
	useEffect(() => {
		if (validSlides.length > 1) {
			const interval = setInterval(() => {
				setCurrentSlideIndex((prev) => (prev + 1) % validSlides.length);
			}, 5e3);
			return () => clearInterval(interval);
		}
	}, [validSlides.length]);
	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) window.location.href = `${basePath}/search?q=${encodeURIComponent(searchQuery)}`;
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
				className: "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid lg:grid-cols-12 gap-8 lg:gap-10 items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 text-white",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-amber-400 text-xs font-bold uppercase tracking-[0.12em] mb-4",
								children: "Coaching and School Discovery Platform"
							}),
							/* @__PURE__ */ jsxs("h1", {
								className: "text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold leading-[1.1] mb-6 tracking-tight",
								children: [
									"Find the Right Coaching.",
									/* @__PURE__ */ jsx("br", { className: "hidden sm:block" }),
									"Build the Right Future."
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-base md:text-lg text-white/80 max-w-xl mb-8",
								children: "Explore coaching institutes, courses, fees, rankings, and admission opportunities — all in one place."
							}),
							/* @__PURE__ */ jsx("div", {
								className: "relative max-w-xl mb-6",
								children: /* @__PURE__ */ jsxs("form", {
									onSubmit: handleSearch,
									children: [/* @__PURE__ */ jsxs("div", {
										className: "relative flex items-center gap-2 rounded-full bg-white p-2 shadow-lg z-20",
										children: [
											/* @__PURE__ */ jsx(Search, { className: "w-5 h-5 text-slate-400 ml-3 flex-shrink-0" }),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												name: "q",
												className: "flex-1 border-0 outline-none focus:ring-0 text-slate-900 text-sm md:text-base py-2.5 bg-transparent placeholder-slate-400",
												placeholder: "Search coaching, schools, courses, exams...",
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
												className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none ring-0 focus:ring-0",
												children: "Search"
											})
										]
									}), showSuggestions && searchQuery.trim().length > 0 && /* @__PURE__ */ jsx("div", {
										className: "absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-100 max-h-[300px] overflow-y-auto",
										children: (() => {
											const filteredBiz = (featuredBusinesses || []).filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4);
											const filteredCat = (categories || []).filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2);
											if (filteredBiz.length === 0 && filteredCat.length === 0) return /* @__PURE__ */ jsxs("div", {
												className: "p-4 text-center text-slate-500 text-sm",
												children: [
													"No results found for \"",
													searchQuery,
													"\""
												]
											});
											return /* @__PURE__ */ jsxs("div", {
												className: "py-2",
												children: [filteredCat.length > 0 && /* @__PURE__ */ jsxs("div", {
													className: "mb-2",
													children: [/* @__PURE__ */ jsx("div", {
														className: "px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider",
														children: "Categories"
													}), filteredCat.map((cat) => /* @__PURE__ */ jsxs(Link, {
														href: `${basePath}/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`,
														className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
														children: [/* @__PURE__ */ jsx("div", {
															className: "bg-blue-50 p-2 rounded-lg text-blue-600",
															children: /* @__PURE__ */ jsx(GraduationCap, { size: 16 })
														}), /* @__PURE__ */ jsx("span", {
															className: "font-medium text-slate-800",
															children: cat.name
														})]
													}, `cat-${cat.id}`))]
												}), filteredBiz.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
													className: "px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider",
													children: "Institutes"
												}), filteredBiz.map((biz) => /* @__PURE__ */ jsxs(Link, {
													href: `${basePath}/reviews/${biz.category || "coaching-institutes"}/${biz.slug}`,
													className: "flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors",
													children: [/* @__PURE__ */ jsx("div", {
														className: "w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200",
														children: /* @__PURE__ */ jsx(Image$1, {
															src: biz.logo || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
															alt: biz.name,
															fill: true,
															style: { objectFit: "contain" }
														})
													}), /* @__PURE__ */ jsxs("div", {
														className: "flex flex-col",
														children: [/* @__PURE__ */ jsx("span", {
															className: "font-medium text-slate-800",
															children: biz.name
														}), /* @__PURE__ */ jsx("span", {
															className: "text-xs text-slate-500",
															children: biz.categoryName || biz.category
														})]
													})]
												}, `biz-${biz.id}`))] })]
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
										children: "Popular:"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: `${basePath}/search?q=NEET`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "NEET"
									}),
									/* @__PURE__ */ jsx(Link, {
										href: `${basePath}/search?q=JEE`,
										className: "px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold",
										children: "JEE"
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
									className: "bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-3 rounded-md transition-colors text-center inline-flex items-center justify-center",
									children: "Explore Institutes"
								}), /* @__PURE__ */ jsx(Link, {
									href: `${basePath}/blog`,
									className: "bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors text-center inline-flex items-center justify-center",
									children: "Browse Articles"
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
		className: "py-6 bg-white border-b border-slate-100 overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4",
			children: /* @__PURE__ */ jsx("p", {
				className: "text-xs font-bold text-slate-400 uppercase tracking-wider",
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
					className: "text-slate-400 font-bold text-xl md:text-2xl opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6" }),
						" ",
						item.name
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
		className: "py-10 md:py-14 bg-slate-50 border-b border-slate-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-amber-500 text-sm font-bold uppercase tracking-wider mb-1",
						children: "Popular Reviews"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight",
						children: "Explore India's Popular Institutes"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 mt-2 text-base md:text-lg",
						children: "Discover institutions students are searching for right now."
					})
				] }), /* @__PURE__ */ jsx(Link, {
					href: `${basePath}/reviews`,
					className: "hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm",
					children: "View All"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
				children: businesses.map((biz) => {
					const reviewUrl = `${basePath}/reviews/${biz.category || "coaching-institutes"}/${biz.slug}`;
					return /* @__PURE__ */ jsxs("article", {
						className: "bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col group",
						children: [/* @__PURE__ */ jsx(Link, {
							href: reviewUrl,
							className: "relative aspect-[16/9] w-full block overflow-hidden bg-slate-100 flex items-center justify-center p-4",
							children: /* @__PURE__ */ jsx(Image$1, {
								src: biz.logo || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
								alt: biz.name,
								fill: true,
								style: { objectFit: "contain" },
								className: "group-hover:scale-105 transition-transform duration-500"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 md:p-5 flex-grow flex flex-col border-t border-slate-100",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-base md:text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors",
									children: /* @__PURE__ */ jsx(Link, {
										href: reviewUrl,
										className: "focus:outline-none",
										children: biz.name
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3",
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
									children: [/* @__PURE__ */ jsx("span", {
										className: "bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100",
										children: biz.categoryName || biz.category
									}), biz.isVerified && /* @__PURE__ */ jsx("span", {
										className: "bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded border border-green-200",
										children: "Verified"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-auto pt-4 border-t border-slate-100 space-y-1 text-sm text-slate-600",
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
var CommunityFeedSection = ({ basePath }) => {
	return /* @__PURE__ */ jsx("section", {
		className: "py-10 md:py-14 bg-white border-b border-slate-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-blue-500 text-sm font-bold uppercase tracking-wider mb-1",
						children: "Student Community"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight",
						children: "Recent Discussions"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 mt-2 text-base md:text-lg",
						children: "Join the conversation with thousands of students."
					})
				] }), /* @__PURE__ */ jsx(Link, {
					href: `${basePath}/community`,
					className: "hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm",
					children: "View Feed"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-2 space-y-4",
					children: [[
						{
							id: 1,
							community: "JEEPreparation",
							title: "What is the best strategy for JEE Advanced Physics?",
							author: "student2025",
							time: "2 hours ago",
							score: 125,
							comments: 42,
							type: "TEXT",
							content: "I have covered HC Verma and Irodov, but still struggling with multiple correct questions in mock tests. Any advice from seniors?"
						},
						{
							id: 2,
							community: "NEETAspirants",
							title: "My review of Allen Kota phase 3 batch",
							author: "future_doc",
							time: "5 hours ago",
							score: 340,
							comments: 89,
							type: "TEXT",
							content: "The faculty is great but the pace is extremely fast. If your basics from 11th are weak, you might struggle. Here is my detailed review..."
						},
						{
							id: 3,
							community: "StudyMaterials",
							title: "Best organic chemistry notes PDF [Free Download]",
							author: "chem_wizard",
							time: "1 day ago",
							score: 512,
							comments: 156,
							type: "LINK",
							content: ""
						}
					].map((post) => /* @__PURE__ */ jsxs("div", {
						className: "bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 md:p-5 flex gap-4 transition-all hover:shadow-md cursor-pointer",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "hidden sm:flex flex-col items-center gap-1 min-w-[40px]",
							children: [/* @__PURE__ */ jsx("button", {
								className: "p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border-none outline-none focus:outline-none ring-0 focus:ring-0",
								children: /* @__PURE__ */ jsx(TrendingUp, { size: 20 })
							}), /* @__PURE__ */ jsx("span", {
								className: "font-bold text-sm text-slate-700",
								children: post.score
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-xs text-slate-500 mb-2",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "font-bold text-slate-900",
											children: ["r/", post.community]
										}),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsxs("span", { children: ["Posted by u/", post.author] }),
										/* @__PURE__ */ jsx("span", { children: "•" }),
										/* @__PURE__ */ jsx("span", { children: post.time })
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-lg font-bold text-slate-900 mb-2 leading-tight",
									children: post.title
								}),
								post.type === "TEXT" && /* @__PURE__ */ jsx("p", {
									className: "text-sm text-slate-600 line-clamp-2 mb-3",
									children: post.content
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-4 text-xs font-semibold text-slate-500 mt-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 hover:bg-slate-100 px-2 py-1.5 rounded-md transition-colors text-slate-600",
										children: [
											/* @__PURE__ */ jsx(MessageSquare, { size: 16 }),
											" ",
											post.comments,
											" Comments"
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 hover:bg-slate-100 px-2 py-1.5 rounded-md transition-colors text-slate-600",
										children: [/* @__PURE__ */ jsx(ThumbsUp, { size: 16 }), " Share"]
									})]
								})
							]
						})]
					}, post.id)), /* @__PURE__ */ jsx(Link, {
						href: `${basePath}/community`,
						className: "block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm",
						children: "Explore More Discussions"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-slate-50 border border-slate-200 rounded-xl p-5",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-bold text-lg text-slate-900 mb-4",
							children: "Top Communities"
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-4",
							children: [
								"JEEPreparation",
								"NEETAspirants",
								"UPSC_Civil_Services",
								"CATPrep"
							].map((community, i) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold",
										children: community.charAt(0)
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "font-bold text-sm text-slate-900",
										children: ["r/", community]
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-xs text-slate-500",
										children: [100 - i * 15, "k members"]
									})] })]
								}), /* @__PURE__ */ jsx("button", {
									className: "text-blue-600 hover:bg-blue-50 px-3 py-1 text-sm font-semibold rounded-full transition-colors",
									children: "Join"
								})]
							}, community))
						})]
					})
				})]
			})]
		})
	});
};
var BlogSection = ({ morePosts, basePath, formatDate }) => {
	const posts = (morePosts || []).slice(0, 4);
	if (posts.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		className: "py-10 md:py-14 bg-slate-50",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-blue-500 text-sm font-bold uppercase tracking-wider mb-1",
						children: "Editor's Picks"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight",
						children: "Explore the Blog"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 mt-2 text-base md:text-lg",
						children: "Read the latest articles, guides, and updates."
					})
				] }), /* @__PURE__ */ jsx(Link, {
					href: `${basePath}/blog`,
					className: "hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm",
					children: "View All Blog"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
				children: posts.map((post) => /* @__PURE__ */ jsxs("article", {
					className: "bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col group",
					children: [/* @__PURE__ */ jsxs(Link, {
						href: `${basePath}/blog/${post.slug}`,
						className: "relative aspect-[16/9] w-full block overflow-hidden",
						children: [/* @__PURE__ */ jsx(Image$1, {
							src: post.coverImage || "https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80",
							alt: post.title,
							fill: true,
							style: { objectFit: "cover" },
							className: "group-hover:scale-105 transition-transform duration-500"
						}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-4 md:p-5 flex-grow flex flex-col",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "text-base md:text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors",
								children: /* @__PURE__ */ jsx(Link, {
									href: `${basePath}/blog/${post.slug}`,
									className: "focus:outline-none",
									children: post.title
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-1.5 mb-4",
								children: /* @__PURE__ */ jsx("span", {
									className: "bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100",
									children: post.category || "Article"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-auto pt-4 border-t border-slate-100 space-y-1 text-sm text-slate-600",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between items-center mb-3",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-slate-500",
										children: "Posted:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-slate-800",
										children: formatDate(post.date)
									})]
								}), /* @__PURE__ */ jsx(Link, {
									href: `${basePath}/blog/${post.slug}`,
									className: "block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm",
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
	return /* @__PURE__ */ jsx("section", {
		className: "py-10 md:py-14 bg-white overflow-hidden",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-10 md:mb-14",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight",
					children: "Explore by Stream"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 mt-2 text-base md:text-lg",
					children: "Find the right path for your career goals."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex animate-marquee-fast items-center justify-center space-x-4 md:space-x-6 whitespace-nowrap pt-2 pb-6",
					children: [
						...categories,
						...categories,
						...categories,
						...categories
					].map((cat, i) => /* @__PURE__ */ jsxs(Link, {
						href: `${basePath}/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}`,
						className: "bg-slate-50 w-40 h-40 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all duration-300 group flex flex-col items-center justify-center text-center shrink-0",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 bg-white group-hover:bg-blue-600 rounded-full flex items-center justify-center text-blue-600 group-hover:text-white mb-3 transition-colors shadow-sm",
							children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-6 h-6" })
						}), /* @__PURE__ */ jsx("h3", {
							className: "font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors whitespace-normal break-words w-full px-2 leading-tight",
							children: cat.name
						})]
					}, `${cat.id}-${i}`))
				})
			})]
		})
	});
};
var StoriesSection = ({ stories, basePath }) => {
	if (!stories || stories.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		className: "py-10 md:py-14 bg-slate-50 border-y border-slate-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex justify-between items-end mb-8 md:mb-10",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight",
					children: "Visual Web Stories"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 mt-2 text-base md:text-lg",
					children: "Bite-sized visual guides for modern students."
				})] })
			}), /* @__PURE__ */ jsx("div", {
				className: "flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x hide-scrollbar",
				children: stories.map((story) => /* @__PURE__ */ jsxs(Link, {
					href: `${basePath}/stories/${story.slug}`,
					className: "relative flex-none w-[220px] md:w-[260px] aspect-[9/16] rounded-xl overflow-hidden snap-start group shadow-sm hover:shadow-xl transition-all duration-300",
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
var SeoContent = () => /* @__PURE__ */ jsx("section", {
	className: "py-10 md:py-14 bg-slate-50 border-t border-slate-200",
	children: /* @__PURE__ */ jsx("div", {
		className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("span", {
					className: "text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block",
					children: "About Us"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight",
					children: "Coaching in Sikar: Your Complete Education Guide"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-slate-600 text-base md:text-lg leading-relaxed space-y-4",
					children: [/* @__PURE__ */ jsx("p", { children: "Our mission is simple — to make educational information easier to find, understand, and compare. We research and publish useful guides covering coaching institutes, academic programs, exam preparation, results, facilities, courses, and student experiences." }), /* @__PURE__ */ jsx("p", { children: "Sikar has rapidly emerged as a major educational hub in Rajasthan, attracting thousands of students every year who dream of securing top ranks in national-level competitive exams like NEET and IIT-JEE." })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 flex flex-wrap items-center gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "bg-green-100 p-3 rounded-full text-green-600",
							children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-6 h-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-bold text-slate-800",
							children: "Verified Data"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-sm text-slate-500",
							children: "Trusted reviews"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "bg-amber-100 p-3 rounded-full text-amber-600",
							children: /* @__PURE__ */ jsx(Award, { className: "w-6 h-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-bold text-slate-800",
							children: "Top Institutes"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-sm text-slate-500",
							children: "Ranked accurately"
						})] })]
					})]
				})
			] }), /* @__PURE__ */ jsxs("div", {
				className: "relative mt-8 lg:mt-0",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-blue-600/10 rounded-[2rem] transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6" }), /* @__PURE__ */ jsx("img", {
					src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
					alt: "Students studying",
					className: "relative z-10 rounded-[2rem] shadow-xl w-full object-cover aspect-[4/3] border-4 border-white"
				})]
			})]
		})
	})
});
var FAQSection = () => {
	const [openIndex, setOpenIndex] = useState(null);
	return /* @__PURE__ */ jsx("section", {
		className: "py-14 md:py-20 bg-white border-t border-slate-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-10 md:mb-14",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-blue-600 font-bold tracking-widest uppercase text-xs mb-3",
						children: "Got Questions?"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight",
						children: "Frequently Asked Questions"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 text-base md:text-lg",
						children: "Everything you need to know about coaching institutes and education in Sikar."
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: [
					{
						question: "How do I choose the best coaching institute in Sikar?",
						answer: "Choosing the right coaching depends on your goals, budget, and learning style. We recommend checking verified reviews, past year results, faculty profiles, and visiting the campus for a demo class before making a decision."
					},
					{
						question: "Are the reviews on Coaching Sikar verified?",
						answer: "Yes, we have a strict verification process. We ensure that reviews are submitted by genuine students or parents who have actual experience with the respective coaching institutes."
					},
					{
						question: "Which are the top courses offered by institutes in Sikar?",
						answer: "Sikar is widely known for JEE (Main & Advanced) and NEET preparation. Additionally, many institutes offer excellent foundation courses for classes 8th to 10th, NDA, and other competitive exams."
					},
					{
						question: "Is hostel facility available for students outside Sikar?",
						answer: "Absolutely. Sikar is a major education hub and has hundreds of secure, well-equipped hostels for both boys and girls, many of which are directly affiliated with top coaching institutes."
					},
					{
						question: "Can I get scholarships for coaching in Sikar?",
						answer: "Yes, almost all major institutes conduct their own scholarship cum admission tests (like ASAT, TALLENTEX, etc.) offering up to 90% scholarships based on your performance."
					}
				].map((faq, index) => {
					const isOpen = openIndex === index;
					return /* @__PURE__ */ jsxs("div", {
						className: `border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-blue-50/50 shadow-md border-blue-200" : "bg-white hover:border-blue-300"}`,
						children: [/* @__PURE__ */ jsxs("button", {
							className: "w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-0 ring-0 border-none bg-transparent cursor-pointer",
							onClick: () => setOpenIndex(isOpen ? null : index),
							"aria-expanded": isOpen,
							children: [/* @__PURE__ */ jsx("span", {
								className: `font-bold text-base md:text-lg pr-4 ${isOpen ? "text-blue-700" : "text-slate-800"}`,
								children: faq.question
							}), /* @__PURE__ */ jsx("div", {
								className: `flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? "bg-blue-100 text-blue-600 rotate-180" : "bg-slate-100 text-slate-500"}`,
								children: /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5" })
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: `px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"}`,
							children: /* @__PURE__ */ jsx("p", {
								className: "text-slate-600 leading-relaxed text-sm md:text-base m-0",
								children: faq.answer
							})
						})]
					}, index);
				})
			})]
		})
	});
};
function Welcome(props) {
	const { featuredPost, recentPosts, morePosts, publishedStories, sliders, categories, authors, meta, featuredBusinesses } = props;
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
		className: "bg-white min-h-screen font-sans",
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
				/* @__PURE__ */ jsx(CommunityFeedSection, { basePath }),
				/* @__PURE__ */ jsx(SeoContent, {}),
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
