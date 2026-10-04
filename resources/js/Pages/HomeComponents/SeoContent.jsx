import React from 'react';
import { Link } from './utils';
import { ShieldCheck, Award } from 'lucide-react';

const SeoContent = ({ basePath }) => (
    <section className="py-10 md:py-14 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                    <span className="text-blue-600 font-bold tracking-widest text-xs mb-3 block">About Us</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">CoachinginSikar: Your Complete Education Guide</h2>
                    <div className="text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed space-y-4">
                        <p>CoachinginSikar is an education platform helping students and parents find the best CoachinginSikar through top <Link href={`${basePath}/business/coaching-institutes`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">coaching institutes</Link>, coaching centre lists, fees, rankings, reviews, results, admissions, and other comparisons. We cover NEET coaching, JEE coaching, IAS / RAS / SSC-CGL Coaching, CLAT & CA Coaching, CUET, Olympiads, schools, colleges, and other competitive exam coaching educational information.</p>
                        <p>Starting with Sikar, our platform covers more than just top coaching institutes in Sikar, Rajasthan. Yes, we also provide information on the best schools, colleges, education news, results, Olympiads, hospitals, and other useful local information. We aim to make finding top institutions, fees, admissions, results, reviews, and opportunities simple, while expanding our coverage beyond Sikar to more cities, regions, categories, and <Link href={`${basePath}/feed`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">communities</Link>.</p>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 dark:text-white">Verified Data</div>
                                <div className="text-sm text-slate-500 dark:text-zinc-400">Trusted reviews</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600 dark:text-amber-400">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 dark:text-white">Top Institutes</div>
                                <div className="text-sm text-slate-500 dark:text-zinc-400">Ranked accurately</div>
                            </div>
                        </div>
                        <Link href={`${basePath}/about`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all ml-auto sm:ml-0">
                            More About Us
                        </Link>
                    </div>
                </div>
                <div className="relative mt-8 lg:mt-0">
                    <div className="absolute inset-0 bg-blue-600/10 rounded-[2rem] transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6"></div>
                    <div className="relative z-10 rounded-[2rem] shadow-xl w-full aspect-[4/3] border-4 border-white dark:border-zinc-700 overflow-hidden">
                        <img 
                            src="/uploads/aboutus.webp" 
                            alt="Students studying" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none mix-blend-overlay"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default SeoContent;
