import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import React, { useState } from 'react';
import SeoMeta from '../../NextComponents/SeoMeta';
import { ChevronDown, MessageSquare, Search } from 'lucide-react';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} {...props} />;
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "What kind of topics are covered in the CoachingsinSikar blog?",
            answer: "The blog section covers topics like best CoachinginSikar, top schools in Sikar, college admissions, Olympiads, exam results, education news, and career guidance for students and parents."
        },
        {
            question: "How can students use Blog section to prepare for JEE and NEET?",
            answer: "Students can read blog posts on Top JEE CoachinginSikar, Best NEET CoachinginSikar, preparation tips, how to choose, test strategies, and study plans designed for competitive exam aspirants."
        },
        {
            question: "Does blog section help in choosing the right CoachinginSikar?",
            answer: "Yes, the CoachingsinSikar blog shares comparison articles, ranking lists, and detailed guides on the best coaching institutes in Sikar for JEE, NEET, CA, CLAT, NDA, and other courses."
        },
        {
            question: "Can I find best school information on the Blog Category?",
            answer: "Yes, the CoachingsinSikar blog school articles cover the best CBSE, RBSE, and ICSE Schools, admissions, fees, facilities, academics, and results."
        },
        {
            question: "Can students compare coaching institutes through blog articles?",
            answer: "Yes, Best/Top Coaching Schools are compared on the basis of courses, faculty, fees, facilities, study material, results, tests, and doubt support."
        }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="pt-16 pb-16 md:pt-24 md:pb-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 relative overflow-hidden">
            <Head>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Head>
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-48 -left-24 w-72 h-72 bg-amber-100 dark:bg-amber-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
                    
                    {/* Left Column: Sticky Title & CTA */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-6">
                                <MessageSquare className="w-4 h-4" /> FAQs For Blogs
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                                Frequently Asked <span className="text-blue-600">Questions</span>
                            </h2>
                            <p className="text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed">
                                Find answers to common questions about our education blog, guides, and coaching comparisons.
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Search className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Still have questions?</h3>
                                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">Chat with our educational counselors for personalized guidance.</p>
                                <Link href="/contact" className="btn-amber px-5 py-2 text-sm transition-transform hover:scale-105 inline-block bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Accordion */}
                    <div className="lg:col-span-7 space-y-4">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div 
                                    key={index} 
                                    className={`group border rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? 'bg-white dark:bg-zinc-800 shadow-xl shadow-blue-900/5 dark:shadow-none border-blue-200 dark:border-blue-700 ring-1 ring-blue-100 dark:ring-blue-700/30' : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-sm'}`}
                                >
                                    <button 
                                        className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none focus:ring-0 ring-0 border-none bg-transparent cursor-pointer"
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className={`font-bold text-lg pr-6 transition-colors duration-300 ${isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-180 shadow-md shadow-blue-600/20' : 'bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500'}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </button>
                                    <div 
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="px-6 pb-6">
                                            <div className="w-full h-px bg-slate-200 dark:bg-zinc-700 mb-5"></div>
                                            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-base m-0">
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

export default function Index({ posts, meta }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
            <SeoMeta meta={meta} />
            
            <GlobalNavbar />
            
            <main className="w-full px-[25px] pb-8" style={{ paddingTop: '100px' }}>
                <h1 className="text-4xl font-bold mb-12 text-slate-900 dark:text-white max-w-7xl mx-auto">All Articles & Insights</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
                    {posts.map((post) => (
                        <article key={post.id} className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden hover:shadow-xl dark:hover:shadow-black/40 transition-shadow flex flex-col">
                            <Link href={window.BASE_PATH + `/blog/${post.slug}`} className="relative h-48 block">
                                <Image src={post.coverImage || '/uploads/read.webp'} alt={post.title} fill style={{ objectFit: 'cover' }} />
                            </Link>
                            <div className="p-6 flex flex-col flex-grow">
                                <span className="text-sm text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-2">{post.category}</span>
                                <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                                    <Link href={window.BASE_PATH + `/blog/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="text-slate-600 dark:text-zinc-400 mb-4 flex-grow">{post.excerpt}</p>
                                <div className="flex justify-between items-center text-sm text-slate-500 dark:text-zinc-500 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                    <span>{formatDate(post.date)}</span>
                                    <Link href={window.BASE_PATH + '/author/' + (post.author ? post.author.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')} className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 hover:underline">
                                        {post.author}
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <FAQSection />

            <BlogFooter />
        </div>
    );
}
