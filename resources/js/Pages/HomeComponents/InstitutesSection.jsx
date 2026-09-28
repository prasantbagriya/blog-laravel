import React from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import { Link, Image } from './utils';

const InstitutesSection = ({ featuredBusinesses, basePath }) => {
    const businesses = featuredBusinesses || [];
    if(businesses.length === 0) return null;
    
    return (
        <section id="top-institutes" className="pt-10 pb-0 md:pt-14 md:pb-0 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Top Coaching Institutes in Sikar</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg">Explore institutes based on courses, reviews, results and available information.</p>
                    </div>
                    <Link href={`${basePath}/business`} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm">
                        View All
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {businesses.map((biz) => {
                        const categorySlug = biz.category || 'coaching-institutes';
                        const reviewUrl = `${basePath}/business/${categorySlug}/${biz.slug || biz.id}`;
                        
                        return (
                        <article key={biz.id} className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                            <Link href={reviewUrl} className="relative aspect-[21/9] w-full block overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center p-4">
                                <img
                                    src={biz.logo || '/uploads/read.webp'}
                                    alt={biz.name}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-md relative z-10 group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Cover image background effect */}
                                <div 
                                    className="absolute inset-0 opacity-80"
                                    style={{ backgroundImage: `url(${biz.cover_image || biz.coverImage || biz.logo || '/uploads/read.webp'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                ></div>
                                <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 mix-blend-multiply"></div>
                                
                                {/* Trust Score Badge Floating */}
                                <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20 z-20">
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{biz.trust_score || biz.trustScore || 85}<span className="text-[10px] text-slate-500">/100</span></span>
                                </div>
                            </Link>
                            
                            <div className="p-4 md:p-5 flex-grow flex flex-col border-t border-slate-100 dark:border-zinc-800">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <Link href={reviewUrl} className="focus:outline-none">{biz.name}</Link>
                                </h3>
                                
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-zinc-400 mb-3">
                                    <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                                        <Star className="w-3.5 h-3.5 fill-amber-700 dark:fill-amber-400" /> {biz.rating || 4.5}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Trust: {biz.trust_score || biz.trustScore || 85}/100
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/30">{biz.category_name || biz.categoryName || biz.category}</span>
                                    {biz.isVerified && <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded border border-green-200 dark:border-green-800/30 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>}
                                    {biz.city && <span className="bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 flex items-center gap-1"><MapPin size={12}/>{biz.city}</span>}
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex gap-2">
                                    <Link 
                                        href={reviewUrl} 
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 text-white dark:text-slate-900 border-2 border-slate-900 dark:border-white text-center font-bold py-2 rounded-md transition-all text-sm active:scale-[0.98] shadow-sm"
                                    >
                                        View Profile
                                    </Link>
                                    <Link 
                                        href={`${reviewUrl}#reviews`} 
                                        aria-label={`Read Reviews for ${biz.name} (${biz.review_count || biz.reviewCount || 0})`}
                                        className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-center font-bold py-2 rounded-md transition-all text-sm active:scale-[0.98]"
                                    >
                                        Read Reviews ({biz.review_count || biz.reviewCount || 0})
                                    </Link>
                                </div>
                            </div>
                        </article>
                    )})}
                </div>
            </div>
        </section>
    );
};

export default InstitutesSection;

