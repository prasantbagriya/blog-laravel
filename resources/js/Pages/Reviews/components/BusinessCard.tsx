import React from 'react';
import { Link } from '@inertiajs/react';
import { Star, ShieldCheck, CheckCircle, MessageSquare, MapPin } from 'lucide-react';
import { Business } from '../types';
import AnimatedBorderCard from '@/Components/AnimatedBorderCard';

interface BusinessCardProps {
  business: Business;
  onSelectBusiness: (slug: string) => void;
  onOpenWriteReview: (businessId: string) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  onSelectBusiness,
  onOpenWriteReview,
}) => {
  return (
    <AnimatedBorderCard 
        containerClassName="hover:-translate-y-1"
        className="flex flex-col h-full"
    >
      
      {/* Top Banner / Logo Area */}
      <div 
        className="relative aspect-[21/9] w-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center p-4 cursor-pointer overflow-hidden"
        onClick={() => onSelectBusiness(business.slug)}
      >
        <img
          src={business.logo}
          alt={business.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-md relative z-10 group-hover:scale-105 transition-transform duration-500"
        />
        {/* Cover image background effect */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{ backgroundImage: `url(${business.coverImage || business.logo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
        <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/60 mix-blend-multiply"></div>
        
        {/* Trust Score Badge Floating */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20 z-20">
            <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{business.trustScore}<span className="text-[10px] text-slate-500">/100</span></span>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        {/* Category & Location */}
        <div className="flex items-center justify-between gap-2 mb-2">
            <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/50">
                {business.categoryName}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{business.city}</span>
            </div>
        </div>

        {/* Name and Verification */}
        <div className="flex items-start gap-2 mb-3">
            <h3 
                className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                onClick={() => onSelectBusiness(business.slug)}
            >
                {business.name}
            </h3>
            {business.isVerified && (
                <span className="text-green-500 flex-shrink-0" title="Verified Top Rated">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </span>
            )}
        </div>

        {/* Rating Breakdown */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-100 dark:border-amber-800/30">
            <svg className="w-4 h-4 fill-amber-500 text-amber-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">{business.rating}</span>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">
            {business.reviewCount.toLocaleString()} verified reviews
          </span>
        </div>

        {/* AI Highlight Tag */}
        {business.aiSummary?.positiveHighlights?.[0] ? (
          <div className="mt-auto bg-slate-50 dark:bg-zinc-800/50 rounded-lg p-3 text-xs text-slate-600 dark:text-zinc-300 italic border border-slate-100 dark:border-zinc-800/50 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-lg"></div>
            <span className="line-clamp-2 pl-1">"{business.aiSummary.positiveHighlights[0]}"</span>
          </div>
        ) : (
          <div className="mt-auto">
             <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {business.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 flex gap-3">
          {/* View Profile */}
          <button
            onClick={() => onSelectBusiness(business.slug)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-zinc-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700/50 text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2 rounded-lg transition-colors text-[13px]"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </button>
          
          {/* Write Review */}
          <button
            onClick={() => onOpenWriteReview(business.id)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors text-[13px] shadow-sm hover:shadow"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Review</span>
          </button>
        </div>
      </div>
    </AnimatedBorderCard>
  );
};
