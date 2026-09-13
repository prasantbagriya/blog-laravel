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
