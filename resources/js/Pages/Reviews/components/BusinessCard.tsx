import React from 'react';
import { Link } from '@inertiajs/react';
import { Star, ShieldCheck, CheckCircle, MessageSquare, MapPin } from 'lucide-react';
import { Business } from '../types';

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
    <article className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col group">
      
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
        {/* Blurred background effect */}
        <div 
          className="absolute inset-0 opacity-40 blur-xl scale-110"
          style={{ backgroundImage: `url(${business.logo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
        
        {/* Trust Score Badge Floating */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20 z-20">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
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
                <MapPin className="w-3 h-3" />
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
                    <CheckCircle className="w-4 h-4" />
                </span>
            )}
        </div>

        {/* Rating Breakdown */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-100 dark:border-amber-800/30">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
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
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-2">
          <button
            onClick={() => onSelectBusiness(business.slug)}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm"
          >
            View Profile
          </button>
          
          <button
            onClick={() => onOpenWriteReview(business.id)}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm"
          >
            Write Review
          </button>
        </div>
      </div>
    </article>
  );
};
