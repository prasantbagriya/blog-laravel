import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import { Target, BookOpen, ShieldCheck, Users, ChevronRight, Sparkles, Building, GraduationCap, MapPin, Search, Star, Newspaper, Trophy, IndianRupee, HeartPulse } from 'lucide-react';
import AnimatedBorderCard from '../../Components/AnimatedBorderCard';

export default function About() {
    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex flex-col transition-colors duration-300">
            <Head>
                <title>About Us | Coaching Sikar</title>
                <meta name="description" content="Learn about Coaching Sikar, the premier platform for finding the best coaching institutes and educational resources in Sikar." />
            </Head>
            
            <GlobalNavbar />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 z-0 opacity-40 bg-[url('/uploads/aboutus.webp')] bg-cover bg-center" role="img" aria-label="About Us Background"></div>
                    <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/60"></div>
                    
                    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 border border-blue-500/20 backdrop-blur-md">
                            <Sparkles className="w-4 h-4" /> About Us
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight text-white">
                            Discover the Best <span className="text-amber-400">Education</span> in Sikar
                        </h1>
                        <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                            Your most trusted companion for navigating the educational landscape of Sikar. From top coaching institutes to verified reviews and admissions.
                        </p>
                    </div>
                </section>

                {/* Introduction Content */}
                <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto">
                    <div className="space-y-6 text-slate-700 dark:text-zinc-300 text-lg leading-relaxed font-medium">
                        <p>Sikar becomes a familiar name for students preparing for competitive exams. More than 50 coaching institutes and coaching centres are currently serving students across the city, and around 80,000 students prepare for NEET and JEE in Sikar every year. Along with coaching, the district has 3,000+ schools, colleges, and other educational institutions serving students from Sikar and nearby areas.</p>
                        
                        <p>With so many options available, students and parents often have very specific questions. Which coaching is right for JEE or NEET? What are the fees? Which schools are worth considering? Where can students find information about admissions, results, courses, or facilities? Coachings in Sikar was created around these everyday questions.</p>
                        
                        <p>We bring information about top coaching in Sikar, schools, colleges, courses, fees, admissions, results, Olympiads, and education news together in one place. Instead of limiting the website to a list of institutes, we also publish detailed blogs on topics people search for before making an education-related decision.</p>
                        
                        <p>Our Coaching section covers different preparation options, including top JEE coaching in Sikar, best coaching in Sikar for NEET, best IAS coachings, top CA coaching, best CLAT coaching, best academy for NDA, defence, and other competitive examinations. The Schools section covers Best CBSE schools, Top RBSE schools, boarding resdetiaonal schools in sikar, school admissions, and other school-related information, while our college and education content helps readers explore higher-education options in Sikar.</p>
                        
                        <p>Another important part of the website is Reviews and Community feedback. A coaching institute or school can look very different on paper from the experience of an actual student or parent. Reviews give readers another perspective and help them understand what others have experienced. We aim to make this information useful while keeping the reader free to form their own opinion.</p>
                        
                        <p>We also keep an eye on what is happening in Sikar's education community. Exam results, student achievements, Olympiads, scholarships, important announcements, and education updates are covered through our News, Results and Olympiad sections. Our blogs go a step further by answering specific questions about coaching, schools, colleges and competitive-exam preparation.</p>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="bg-white dark:bg-zinc-900 py-20 border-y border-slate-200 dark:border-zinc-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">What You Can Find on Coachings in Sikar</h2>
                            <p className="text-lg text-slate-600 dark:text-zinc-400">
                                There is a lot more to finding the right education option than simply knowing the name of an institute or school. That is why we cover different parts of Sikar's education scene, from coaching and schools to fees, reviews, results , and local updates. Here are some of the main information we avail through this <a href="https://coachingsinsikar.com/" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">https://coachingsinsikar.com/</a> website.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            
                            {/* Feature 1 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                                    <Target className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Coaching Institutes in Sikar</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    There is no shortage of coaching options in Sikar. Students looking for JEE, NEET, UPSC, CA, CLAT, NDA, government exam, and other competitive courses can find information about different coaching institutes and centres through our coaching section. The idea is to make the initial search easier when there are many names to consider.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 2 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                                    <Sparkles className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">JEE & NEET Coaching in Sikar</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    A large part of Sikar's coaching community is built around JEE and NEET preparation. We cover JEE coaching in Sikar, NEET coaching in Sikar, IIT JEE preparation, NEET preparation, courses, fees, results and related topics, along with the questions students usually have before joining a coaching institute.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 3 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                                    <Building className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Schools in Sikar</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    Choosing a school involves a different set of questions. Our school content covers CBSE schools in Sikar, RBSE schools, residential schools, school admissions, fees and other school-related information. Parents can also find articles that look at different types of schools and what they offer.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 4 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                                    <GraduationCap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Colleges & Higher Education</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    After school, students have a whole new set of choices to make. We cover colleges in Sikar, degree colleges, medical colleges, engineering colleges, courses, admissions, and higher-education options so that students can explore opportunities available after Class 12.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 5 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6">
                                    <Trophy className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Olympiads and Foundation Preparation</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    Competitive preparation can begin much earlier than Class 11. Our Olympiad and foundation content covers Olympiad exams, foundation courses, early preparation, scholarship examinations and opportunities for school students who want to take part in academic competitions.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 6 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mb-6">
                                    <BookOpen className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Education Blogs</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    Not every search starts with the name of an institute. Sometimes it starts with a simple question: Which is the best coaching in Sikar? Which school should I choose? How much does coaching cost? Which colleges are available? Our blogs are built around these kinds of questions, covering coaching, schools, colleges, JEE, NEET, admissions, fees, results, and other education topics.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 7 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-6">
                                    <HeartPulse className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Medical Colleges and Hospitals</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    Medical education and healthcare are also an important part of the local education and institutional landscape. Our content covers medical colleges in Sikar, medical education, MBBS-related information, hospitals and healthcare institutions, along with useful details about courses, admissions, and institutions where relevant. This section helps students exploring medical education as well as people looking for information about healthcare facilities in Sikar.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 8 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                                    <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Reviews and Community</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    Sometimes the most useful information comes from someone who has actually studied at an institute or sent their child there. Our reviews and community section brings together experiences, opinions and discussions around coaching institutes, schools and other educational institutions in Sikar. These views give readers another perspective when exploring their options.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 9 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center mb-6">
                                    <IndianRupee className="w-7 h-7 text-fuchsia-600 dark:text-fuchsia-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Fees & Admissions</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    Fees are often one of the first things students and parents want to know. We publish information related to coaching fees, school fees, college fees, admission processes, eligibility and courses whenever those details are available. This helps readers get a better idea of the costs and requirements before making enquiries.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 10 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                                    <Star className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Results and Student Achievements</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    Sikar's coaching story is closely connected with its results. Our Results section covers JEE results, NEET results, coaching results, competitive-exam performance, toppers and student achievements. We also highlight notable accomplishments from students and educational institutions in the city.
                                </p>
                            </AnimatedBorderCard>

                            {/* Feature 11 */}
                            <AnimatedBorderCard containerClassName="h-full" className="h-full p-8 bg-slate-50 dark:bg-zinc-950 flex flex-col justify-start">
                                <div className="w-14 h-14 rounded-2xl bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mb-6">
                                    <Newspaper className="w-7 h-7 text-lime-600 dark:text-lime-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sikar Education News and Updates</h3>
                                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    Education keeps moving. Exam dates change, results are announced, admissions open, scholarships are introduced, and students continue to achieve new milestones. Our Sikar education news and updates section brings these developments together, including exam updates, results, announcements, achievements, Olympiads and other local education news.
                                </p>
                            </AnimatedBorderCard>
                            
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
                    <div className="bg-slate-900 rounded-3xl p-10 sm:p-14 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-amber-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold text-white mb-6">Motive of Coachings in Sikar</h2>
                            <div className="space-y-6 text-white/80 text-lg leading-relaxed font-medium">
                                <p>A student searching for the best coaching in Sikar may also want to know its fees, courses, results or what other students say. Someone looking for schools in Sikar may have completely different questions. Our aim is to bring these everyday searches, along with college admissions, reviews and education updates, into one useful place.</p>
                                <p>Sikar's education space keeps changing, and so should the information around it. We will keep adding JEE and NEET coaching, schools, colleges, medical colleges, Olympiads, results, admissions and Sikar education news, while updating older content when things change. In simple words, we try to keep Coachings in Sikar useful as new choices and opportunities emerge.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <BlogFooter />
        </div>
    );
}
