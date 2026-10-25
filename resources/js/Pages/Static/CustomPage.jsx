import React from 'react';
import { Head } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function CustomPage({ page, meta = {}, faqs = [] }) {
    const [openFaq, setOpenFaq] = React.useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen flex flex-col text-slate-900 dark:text-white font-sans transition-colors duration-300">
            <Head>
                <title>{meta.title || page.title}</title>
                {meta.description && <meta name="description" content={meta.description} />}
                {meta.keywords && <meta name="keywords" content={meta.keywords} />}
                {meta.og_title && <meta property="og:title" content={meta.og_title} />}
                {meta.og_description && <meta property="og:description" content={meta.og_description} />}
                {meta.og_image && <meta property="og:image" content={meta.og_image} />}
                {meta.url && <link rel="canonical" href={meta.url} />}
            </Head>

            <GlobalNavbar />

            <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 flex-grow">
                {/* Header */}
                <header className="mb-10 text-center md:text-left border-b border-slate-200 dark:border-zinc-800 pb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                        {meta.h1 || page.title}
                    </h1>
                    {meta.description && (
                        <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-3xl">
                            {meta.description}
                        </p>
                    )}
                </header>

                {/* Main Content Body */}
                {page.content ? (
                    <article
                        className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-2xl prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                ) : null}

                {/* FAQs Section */}
                {faqs && faqs.length > 0 && (
                    <section className="mt-16 pt-10 border-t border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3 mb-6">
                            <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Frequently Asked Questions
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-900/50"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        {openFaq === index ? (
                                            <ChevronUp className="w-5 h-5 flex-shrink-0 text-slate-500" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 flex-shrink-0 text-slate-500" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <div className="px-4 pb-4 pt-1 text-slate-600 dark:text-zinc-400 text-sm leading-relaxed border-t border-slate-200 dark:border-zinc-800/80">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <BlogFooter />
        </div>
    );
}
