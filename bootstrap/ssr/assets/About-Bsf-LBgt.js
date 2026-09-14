import { t as Navbar } from "./GlobalNavbar-BeiSnBQi.js";
import { t as BlogFooter } from "./BlogFooter-iDkZqha6.js";
import { t as AnimatedBorderCard } from "./AnimatedBorderCard-B7gc4jxI.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { BookOpen, Building, GraduationCap, HeartPulse, IndianRupee, Newspaper, Sparkles, Star, Target, Trophy, Users } from "lucide-react";
//#region resources/js/Pages/Static/About.jsx
function About() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-slate-50 dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex flex-col transition-colors duration-300",
		children: [
			/* @__PURE__ */ jsxs(Head, { children: [/* @__PURE__ */ jsx("title", { children: "About Us | Coaching Sikar" }), /* @__PURE__ */ jsx("meta", {
				name: "description",
				content: "Learn about Coaching Sikar, the premier platform for finding the best coaching institutes and educational resources in Sikar."
			})] }),
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-grow",
				children: [
					/* @__PURE__ */ jsxs("section", {
						className: "relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden bg-slate-900",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 z-0 opacity-40 bg-[url('/uploads/aboutus.webp')] bg-cover bg-center",
								role: "img",
								"aria-label": "About Us Background"
							}),
							/* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/60" }),
							/* @__PURE__ */ jsxs("div", {
								className: "relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 border border-blue-500/20 backdrop-blur-md",
										children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }), " About Us"]
									}),
									/* @__PURE__ */ jsxs("h1", {
										className: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight text-white",
										children: [
											"Discover the Best ",
											/* @__PURE__ */ jsx("span", {
												className: "text-amber-400",
												children: "Education"
											}),
											" in Sikar"
										]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto",
										children: "Your most trusted companion for navigating the educational landscape of Sikar. From top coaching institutes to verified reviews and admissions."
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("section", {
						className: "px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto",
						children: /* @__PURE__ */ jsxs("div", {
							className: "space-y-6 text-slate-700 dark:text-zinc-300 text-lg leading-relaxed font-medium",
							children: [
								/* @__PURE__ */ jsx("p", { children: "Sikar becomes a familiar name for students preparing for competitive exams. More than 50 coaching institutes and coaching centres are currently serving students across the city, and around 80,000 students prepare for NEET and JEE in Sikar every year. Along with coaching, the district has 3,000+ schools, colleges, and other educational institutions serving students from Sikar and nearby areas." }),
								/* @__PURE__ */ jsx("p", { children: "With so many options available, students and parents often have very specific questions. Which coaching is right for JEE or NEET? What are the fees? Which schools are worth considering? Where can students find information about admissions, results, courses, or facilities? Coachings in Sikar was created around these everyday questions." }),
								/* @__PURE__ */ jsx("p", { children: "We bring information about top coaching in Sikar, schools, colleges, courses, fees, admissions, results, Olympiads, and education news together in one place. Instead of limiting the website to a list of institutes, we also publish detailed blogs on topics people search for before making an education-related decision." }),
								/* @__PURE__ */ jsx("p", { children: "Our Coaching section covers different preparation options, including top JEE coaching in Sikar, best coaching in Sikar for NEET, best IAS coachings, top CA coaching, best CLAT coaching, best academy for NDA, defence, and other competitive examinations. The Schools section covers Best CBSE schools, Top RBSE schools, boarding resdetiaonal schools in sikar, school admissions, and other school-related information, while our college and education content helps readers explore higher-education options in Sikar." }),
								/* @__PURE__ */ jsx("p", { children: "Another important part of the website is Reviews and Community feedback. A coaching institute or school can look very different on paper from the experience of an actual student or parent. Reviews give readers another perspective and help them understand what others have experienced. We aim to make this information useful while keeping the reader free to form their own opinion." }),
								/* @__PURE__ */ jsx("p", { children: "We also keep an eye on what is happening in Sikar's education community. Exam results, student achievements, Olympiads, scholarships, important announcements, and education updates are covered through our News, Results and Olympiad sections. Our blogs go a step further by answering specific questions about coaching, schools, colleges and competitive-exam preparation." })
							]
						})
					}),
					/* @__PURE__ */ jsx("section", {
						className: "bg-white dark:bg-zinc-900 py-20 border-y border-slate-200 dark:border-zinc-800",
						children: /* @__PURE__ */ jsxs("div", {
							className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "text-center max-w-3xl mx-auto mb-16",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6",
									children: "What You Can Find on Coachings in Sikar"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-lg text-slate-600 dark:text-zinc-400",
									children: [
										"There is a lot more to finding the right education option than simply knowing the name of an institute or school. That is why we cover different parts of Sikar's education scene, from coaching and schools to fees, reviews, results , and local updates. Here are some of the main information we avail through this ",
										/* @__PURE__ */ jsx("a", {
											href: "https://coachingsinsikar.com/",
											className: "text-blue-600 dark:text-blue-400 font-semibold hover:underline",
											children: "https://coachingsinsikar.com/"
										}),
										" website."
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8",
								children: [
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(Target, { className: "w-7 h-7 text-blue-600 dark:text-blue-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Coaching Institutes in Sikar"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "There is no shortage of coaching options in Sikar. Students looking for JEE, NEET, UPSC, CA, CLAT, NDA, government exam, and other competitive courses can find information about different coaching institutes and centres through our coaching section. The idea is to make the initial search easier when there are many names to consider."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(Sparkles, { className: "w-7 h-7 text-amber-600 dark:text-amber-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "JEE & NEET Coaching in Sikar"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "A large part of Sikar's coaching community is built around JEE and NEET preparation. We cover JEE coaching in Sikar, NEET coaching in Sikar, IIT JEE preparation, NEET preparation, courses, fees, results and related topics, along with the questions students usually have before joining a coaching institute."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(Building, { className: "w-7 h-7 text-emerald-600 dark:text-emerald-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Schools in Sikar"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "Choosing a school involves a different set of questions. Our school content covers CBSE schools in Sikar, RBSE schools, residential schools, school admissions, fees and other school-related information. Parents can also find articles that look at different types of schools and what they offer."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(GraduationCap, { className: "w-7 h-7 text-purple-600 dark:text-purple-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Colleges & Higher Education"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "After school, students have a whole new set of choices to make. We cover colleges in Sikar, degree colleges, medical colleges, engineering colleges, courses, admissions, and higher-education options so that students can explore opportunities available after Class 12."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(Trophy, { className: "w-7 h-7 text-rose-600 dark:text-rose-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Olympiads and Foundation Preparation"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "Competitive preparation can begin much earlier than Class 11. Our Olympiad and foundation content covers Olympiad exams, foundation courses, early preparation, scholarship examinations and opportunities for school students who want to take part in academic competitions."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(BookOpen, { className: "w-7 h-7 text-sky-600 dark:text-sky-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Education Blogs"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "Not every search starts with the name of an institute. Sometimes it starts with a simple question: Which is the best coaching in Sikar? Which school should I choose? How much does coaching cost? Which colleges are available? Our blogs are built around these kinds of questions, covering coaching, schools, colleges, JEE, NEET, admissions, fees, results, and other education topics."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(HeartPulse, { className: "w-7 h-7 text-teal-600 dark:text-teal-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Medical Colleges and Hospitals"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "Medical education and healthcare are also an important part of the local education and institutional landscape. Our content covers medical colleges in Sikar, medical education, MBBS-related information, hospitals and healthcare institutions, along with useful details about courses, admissions, and institutions where relevant. This section helps students exploring medical education as well as people looking for information about healthcare facilities in Sikar."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(Users, { className: "w-7 h-7 text-indigo-600 dark:text-indigo-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Reviews and Community"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "Sometimes the most useful information comes from someone who has actually studied at an institute or sent their child there. Our reviews and community section brings together experiences, opinions and discussions around coaching institutes, schools and other educational institutions in Sikar. These views give readers another perspective when exploring their options."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(IndianRupee, { className: "w-7 h-7 text-fuchsia-600 dark:text-fuchsia-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Fees & Admissions"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "Fees are often one of the first things students and parents want to know. We publish information related to coaching fees, school fees, college fees, admission processes, eligibility and courses whenever those details are available. This helps readers get a better idea of the costs and requirements before making enquiries."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(Star, { className: "w-7 h-7 text-orange-600 dark:text-orange-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Results and Student Achievements"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "Sikar's coaching story is closely connected with its results. Our Results section covers JEE results, NEET results, coaching results, competitive-exam performance, toppers and student achievements. We also highlight notable accomplishments from students and educational institutions in the city."
											})
										]
									}),
									/* @__PURE__ */ jsxs(AnimatedBorderCard, {
										containerClassName: "h-full",
										className: "h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-14 h-14 rounded-2xl bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mb-6",
												children: /* @__PURE__ */ jsx(Newspaper, { className: "w-7 h-7 text-lime-600 dark:text-lime-400" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl font-bold text-slate-900 dark:text-white mb-3",
												children: "Sikar Education News and Updates"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-slate-600 dark:text-zinc-400 leading-relaxed font-medium",
												children: "Education keeps moving. Exam dates change, results are announced, admissions open, scholarships are introduced, and students continue to achieve new milestones. Our Sikar education news and updates section brings these developments together, including exam updates, results, announcements, achievements, Olympiads and other local education news."
											})
										]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ jsx("section", {
						className: "px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto",
						children: /* @__PURE__ */ jsxs("div", {
							className: "bg-slate-900 rounded-3xl p-10 sm:p-14 relative overflow-hidden shadow-2xl",
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none" }),
								/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-amber-500 opacity-20 rounded-full blur-3xl pointer-events-none" }),
								/* @__PURE__ */ jsxs("div", {
									className: "relative z-10",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "text-3xl font-extrabold text-white mb-6",
										children: "Motive of Coachings in Sikar"
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-6 text-white/80 text-lg leading-relaxed font-medium",
										children: [/* @__PURE__ */ jsx("p", { children: "A student searching for the best coaching in Sikar may also want to know its fees, courses, results or what other students say. Someone looking for schools in Sikar may have completely different questions. Our aim is to bring these everyday searches, along with college admissions, reviews and education updates, into one useful place." }), /* @__PURE__ */ jsx("p", { children: "Sikar's education space keeps changing, and so should the information around it. We will keep adding JEE and NEET coaching, schools, colleges, medical colleges, Olympiads, results, admissions and Sikar education news, while updating older content when things change. In simple words, we try to keep Coachings in Sikar useful as new choices and opportunities emerge." })]
									})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(BlogFooter, {})
		]
	});
}
//#endregion
export { About as default };
