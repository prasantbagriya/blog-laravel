import React, { useState } from 'react';
import { Link } from './utils';
import { Search, ChevronDown, MessageSquare } from 'lucide-react';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "What is CoachingsinSikar?",
            answer: "CoachingsinSikar is a trusted source that helps students to find the best CoachinginSikar, top schools and colleges, Best JEE & NEET coaching, exam results, fees, admissions, and other education updates."
        },
        {
            question: "How can I find the best CoachinginSikar?",
            answer: <>Use some <a href="https://coachingsinsikar.com/blog/top-5-parameters-to-choose-best-jee-coaching-in-sikar" className="text-blue-600 dark:text-blue-400 hover:underline">parameters</a> or compare the top JEE/NEET/CLAT/NDA/CA/Olympiads coaching institutes in Sikar based on results, faculty, fees, reviews, facilities, and student support before choosing.</>
        },
        {
            question: "Which are the best coaching centers in Sikar?",
            answer: "The Sikar Coaching Center List helps students explore and compare coaching centers for JEE, NEET, and other competitive exams based on courses, fees, results, and facilities."
        },
        {
            question: "How to choose the best JEE CoachinginSikar?",
            answer: <>To choose the <a href="https://coachingsinsikar.com/blog/which-coaching-is-best-for-jee-in-sikar" className="text-blue-600 dark:text-blue-400 hover:underline">best JEE CoachinginSikar</a>, compare JEE results, experienced faculty, study material, regular tests, doubt support, fees, and the overall learning environment.</>
        },
        {
            question: "Which are the best CoachinginSikar with fees?",
            answer: "You can compare best CoachinginSikar with fees by checking their courses, results, faculty, fee structure, facilities, and student support."
        }
    ];
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is CoachingsinSikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "CoachingsinSikar is a trusted source that helps students to find the best CoachinginSikar, top schools and colleges, Best JEE & NEET coaching, exam results, fees, admissions, and other education updates."
                }
            },
            {
                "@type": "Question",
                "name": "How can I find the best CoachinginSikar?",
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
                "name": "How to choose the best JEE CoachinginSikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To choose the <a href=\"https://coachingsinsikar.com/blog/which-coaching-is-best-for-jee-in-sikar\">best JEE CoachinginSikar</a>, compare JEE results, experienced faculty, study material, regular tests, doubt support, fees, and the overall learning environment."
                }
            },
            {
                "@type": "Question",
                "name": "Which are the best CoachinginSikar with fees?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can compare best CoachinginSikar with fees by checking their courses, results, faculty, fee structure, facilities, and student support."
                }
            },
            {
                "@type": "Question",
                "name": "Which are Top 5 NEET CoachinginSikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The <a href=\"https://coachingsinsikar.com/blog/best-neet-coachings-in-sikar\">top 5 NEET CoachinginSikar</a> include leading options known for NEET preparation, experienced faculty, regular tests, study material, and student support."
                }
            },
            {
                "@type": "Question",
                "name": "Why do students choose CA CoachinginSikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Students choose the <a href=\"https://coachingsinsikar.com/blog/best-ca-coaching-in-sikar\">best CA CoachinginSikar</a> for structured preparation, subject-wise classes, regular practice, doubt sessions, and guidance for different CA levels."
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
                    "text": "Students can find <a href=\"https://coachingsinsikar.com/blog/best-clat-coaching-in-sikar\">best CLAT CoachinginSikar</a> offering preparation for legal aptitude, logical reasoning, English, current affairs, and CLAT mock tests."
                }
            }
        ]
    };

    return (
        <section className="pt-16 pb-16 md:pt-24 md:pb-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 relative overflow-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-48 -left-24 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
                    
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-6">
                                <MessageSquare className="w-4 h-4" /> Got Questions?
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                                Frequently Asked <span className="text-blue-600">Questions</span>
                            </h2>
                            <p className="text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed">
                                Everything you need to know about coaching institutes, education, and living in Sikar. Can't find the answer you're looking for?
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Search className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Still have questions?</h3>
                                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">Chat with our educational counselors for personalized guidance.</p>
                                <Link href="/contact" className="btn-amber px-5 py-2 text-sm transition-transform hover:scale-105 inline-block">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-2.5">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div 
                                    key={index} 
                                    className={`group border rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? 'bg-white dark:bg-zinc-800 shadow-xl shadow-blue-900/5 dark:shadow-none border-blue-200 dark:border-blue-700 ring-1 ring-blue-100 dark:ring-blue-700/30' : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-sm'}`}
                                >
                                    <button 
                                        className="w-full px-4 py-3 md:px-4 md:py-3.5 flex items-center justify-between text-left focus:outline-none focus:ring-0 ring-0 border-none bg-transparent cursor-pointer"
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className={`font-medium text-[15px] sm:text-[16px] pr-6 transition-colors duration-300 ${isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-180 shadow-md shadow-blue-600/20' : 'bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500'}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </button>
                                    <div 
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="px-4 pb-3 md:px-4 md:pb-4">
                                            <div className="w-full h-px bg-slate-200 dark:bg-zinc-700 mb-2"></div>
                                            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-[14px] sm:text-[15px] m-0">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
