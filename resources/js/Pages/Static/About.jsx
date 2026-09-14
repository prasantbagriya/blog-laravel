import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import { Target, BookOpen, ShieldCheck, Users, ChevronRight, Sparkles } from 'lucide-react';

export default function About() {
    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex flex-col transition-colors duration-300">
            <Head>
                <title>About Us | Coaching Sikar</title>
                <meta name="description" content="Learn about Coaching Sikar, the premier platform for finding the best coaching institutes and educational resources in Sikar." />
            </Head>
            
            <GlobalNavbar />
            
            <main className="flex-grow pt-24 lg:pt-32 pb-16 lg:pb-24">
                {/* Hero Section */}
                <section className="px-4 sm:px-6 lg:px-8 mb-16 lg:mb-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-zinc-800 relative">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10 p-8 sm:p-12 lg:p-16">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-6 border border-blue-100 dark:border-blue-800/30">
                                        <Sparkles className="w-4 h-4" /> Our Story
                                    </div>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
                                        Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-amber-500">Students</span> to Make the Right Choice.
                                    </h1>
                                    <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed mb-8">
                                        Coaching Sikar was born out of a simple idea: every student deserves access to transparent, authentic, and comprehensive information about their educational options in Sikar, the emerging education hub of India.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <Link href="/reviews" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 group">
                                            Explore Institutes <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <img 
                                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80" 
                                        alt="Students learning" 
                                        className="w-full h-full object-cover rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-white/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Mission & Values */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Our Mission & Values</h2>
                        <p className="text-lg text-slate-600 dark:text-zinc-400">
                            We are building a community-driven ecosystem where verified data meets genuine student experiences, ensuring you never have to guess when it comes to your future.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Value 1 */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Target className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Clear Guidance</h3>
                            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Providing crystal-clear insights into coaching institutes, their fee structures, and success rates.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Verified Reviews</h3>
                            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Every review and rating on our platform is cross-checked to ensure authenticity and trust.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Student Community</h3>
                            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                                A thriving space for students to ask doubts, share resources, and support each other.
                            </p>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Comprehensive Data</h3>
                            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                                From syllabus deep-dives to cut-off analyses, we cover every aspect of exam preparation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Detailed About Content */}
                <section className="px-4 sm:px-6 lg:px-8 mt-24 mb-16 max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-slate-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 dark:bg-amber-900/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
                        
                        <div className="relative z-10 space-y-8 text-slate-700 dark:text-zinc-300 text-lg leading-relaxed">
                            <p>Sikar becomes a familiar name for students preparing for competitive exams. More than 50 coaching institutes and coaching centres are currently serving students across the city, and around 80,000 students prepare for NEET and JEE in Sikar every year. Along with coaching, the district has 3,000+ schools, colleges, and other educational institutions serving students from Sikar and nearby areas.</p>
                            
                            <p>With so many options available, students and parents often have very specific questions. Which coaching is right for JEE or NEET? What are the fees? Which schools are worth considering? Where can students find information about admissions, results, courses, or facilities? Coachings in Sikar was created around these everyday questions.</p>
                            
                            <p>We bring information about top coaching in Sikar, schools, colleges, courses, fees, admissions, results, Olympiads, and education news together in one place. Instead of limiting the website to a list of institutes, we also publish detailed blogs on topics people search for before making an education-related decision.</p>
                            
                            <p>Our Coaching section covers different preparation options, including top JEE coaching in Sikar, best coaching in Sikar for NEET, best IAS coachings, top CA coaching, best CLAT coaching, best academy for NDA, defence, and other competitive examinations. The Schools section covers Best CBSE schools, Top RBSE schools, boarding resdetiaonal schools in sikar, school admissions, and other school-related information, while our college and education content helps readers explore higher-education options in Sikar.</p>
                            
                            <p>Another important part of the website is Reviews and Community feedback. A coaching institute or school can look very different on paper from the experience of an actual student or parent. Reviews give readers another perspective and help them understand what others have experienced. We aim to make this information useful while keeping the reader free to form their own opinion.</p>
                            
                            <p>We also keep an eye on what is happening in Sikar's education community. Exam results, student achievements, Olympiads, scholarships, important announcements, and education updates are covered through our News, Results and Olympiad sections. Our blogs go a step further by answering specific questions about coaching, schools, colleges and competitive-exam preparation.</p>
                            
                            <div className="pt-8 pb-4 border-b border-slate-100 dark:border-zinc-800">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What You Can Find on Coachings in Sikar</h2>
                                <p>There is a lot more to finding the right education option than simply knowing the name of an institute or school. That is why we cover different parts of Sikar's education scene, from coaching and schools to fees, reviews, results , and local updates. Here are some of the main information we avail through this <a href="https://coachingsinsikar.com/" className="text-blue-600 dark:text-blue-400 hover:underline">https://coachingsinsikar.com/</a> website.</p>
                            </div>

                            <div className="space-y-10 mt-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Coaching Institutes in Sikar</h3>
                                    <p>There is no shortage of coaching options in Sikar. Students looking for JEE, NEET, UPSC, CA, CLAT, NDA, government exam, and other competitive courses can find information about different coaching institutes and centres through our coaching section. The idea is to make the initial search easier when there are many names to consider.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">JEE & NEET Coaching in Sikar</h3>
                                    <p>A large part of Sikar's coaching community is built around JEE and NEET preparation. We cover JEE coaching in Sikar, NEET coaching in Sikar, IIT JEE preparation, NEET preparation, courses, fees, results and related topics, along with the questions students usually have before joining a coaching institute.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Schools in Sikar</h3>
                                    <p>Choosing a school involves a different set of questions. Our school content covers CBSE schools in Sikar, RBSE schools, residential schools, school admissions, fees and other school-related information. Parents can also find articles that look at different types of schools and what they offer.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Colleges & Higher Education</h3>
                                    <p>After school, students have a whole new set of choices to make. We cover colleges in Sikar, degree colleges, medical colleges, engineering colleges, courses, admissions, and higher-education options so that students can explore opportunities available after Class 12.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Olympiads and Foundation Preparation</h3>
                                    <p>Competitive preparation can begin much earlier than Class 11. Our Olympiad and foundation content covers Olympiad exams, foundation courses, early preparation, scholarship examinations and opportunities for school students who want to take part in academic competitions.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Education Blogs</h3>
                                    <p>Not every search starts with the name of an institute. Sometimes it starts with a simple question: Which is the best coaching in Sikar? Which school should I choose? How much does coaching cost? Which colleges are available? Our blogs are built around these kinds of questions, covering coaching, schools, colleges, JEE, NEET, admissions, fees, results, and other education topics.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Medical Colleges and Hospitals</h3>
                                    <p>Medical education and healthcare are also an important part of the local education and institutional landscape. Our content covers medical colleges in Sikar, medical education, MBBS-related information, hospitals and healthcare institutions, along with useful details about courses, admissions, and institutions where relevant. This section helps students exploring medical education as well as people looking for information about healthcare facilities in Sikar.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Reviews and Community</h3>
                                    <p>Sometimes the most useful information comes from someone who has actually studied at an institute or sent their child there. Our reviews and community section brings together experiences, opinions and discussions around coaching institutes, schools and other educational institutions in Sikar. These views give readers another perspective when exploring their options.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Fees & Admissions</h3>
                                    <p>Fees are often one of the first things students and parents want to know. We publish information related to coaching fees, school fees, college fees, admission processes, eligibility and courses whenever those details are available. This helps readers get a better idea of the costs and requirements before making enquiries.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Results and Student Achievements</h3>
                                    <p>Sikar's coaching story is closely connected with its results. Our Results section covers JEE results, NEET results, coaching results, competitive-exam performance, toppers and student achievements. We also highlight notable accomplishments from students and educational institutions in the city.</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sikar Education News and Updates</h3>
                                    <p>Education keeps moving. Exam dates change, results are announced, admissions open, scholarships are introduced, and students continue to achieve new milestones. Our Sikar education news and updates section brings these developments together, including exam updates, results, announcements, achievements, Olympiads and other local education news.</p>
                                </div>
                            </div>
                            
                            <div className="pt-8 mt-8 border-t border-slate-100 dark:border-zinc-800">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Motive of Coachings in Sikar</h2>
                                <p className="mb-6">A student searching for the best coaching in Sikar may also want to know its fees, courses, results or what other students say. Someone looking for schools in Sikar may have completely different questions. Our aim is to bring these everyday searches, along with college admissions, reviews and education updates, into one useful place.</p>
                                <p>Sikar's education space keeps changing, and so should the information around it. We will keep adding JEE and NEET coaching, schools, colleges, medical colleges, Olympiads, results, admissions and Sikar education news, while updating older content when things change. In simple words, we try to keep Coachings in Sikar useful as new choices and opportunities emerge.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="px-4 sm:px-6 lg:px-8 mt-20 max-w-4xl mx-auto">
                    <div className="bg-blue-600 rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                        
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 relative z-10">Ready to start your journey?</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                            Join thousands of students who are already using Coaching Sikar to make informed decisions about their career.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                            <Link href="/register" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg">
                                Create Free Account
                            </Link>
                            <Link href="/feed" className="px-8 py-4 bg-blue-700 text-white font-bold rounded-full hover:bg-blue-800 transition-colors border border-blue-500">
                                Join Community
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            
            <BlogFooter />
        </div>
    );
}
