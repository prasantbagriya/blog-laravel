import React from 'react';
import { Star, ShieldCheck, CheckCircle, ExternalLink, MessageSquare, Award } from 'lucide-react';
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
    <article className="group p-5 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] hover:border-[#0052FF] shadow-xs transition-all flex flex-col justify-between">
      
      <div>
        {/* Card Header: Logo, Name, Badges */}
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <img
              src={business.logo}
              alt={business.name}
              className="w-11 h-11 rounded-sm object-cover border border-[#E5E5E1] dark:border-[#2A2A28] shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 
                  onClick={() => onSelectBusiness(business.slug)}
                  className="font-bold text-sm sm:text-base text-[#1A1A1A] dark:text-white hover:text-[#0052FF] cursor-pointer transition"
                >
                  {business.name}
                </h3>

                {business.isVerified && (
                  <span 
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF] text-[10px] font-mono font-bold"
                    title="Verified Business Page"
                  >
                    <CheckCircle className="w-3 h-3 text-[#0052FF]" />
                    <span>VERIFIED</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-[#555555] dark:text-[#A0A09C] mt-0.5 flex items-center gap-2 font-mono">
                <span>{business.categoryName}</span>
                <span>•</span>
                <span>{business.city}, {business.country}</span>
              </div>
            </div>
          </div>

          {/* Trust Score Dial */}
          <div className="text-right shrink-0">
            <div className="inline-flex flex-col items-end">
              <div className="px-2.5 py-1 rounded-sm bg-[#0052FF] text-white text-xs font-mono font-bold shadow-2xs">
                {business.trustScore} <span className="text-[10px] font-normal opacity-80">/100</span>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-[#999999] dark:text-[#777773] mt-1">Trust Score</span>
            </div>
          </div>
        </header>

        {/* Rating Breakdown */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(business.rating) ? 'fill-amber-500 text-amber-500' : 'text-[#E5E5E1] dark:text-[#3A3A38]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">{business.rating}</span>
          <span className="text-xs text-[#555555] dark:text-[#A0A09C]">({business.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Description Snippet */}
        <p className="mt-3 text-xs text-[#555555] dark:text-[#A0A09C] line-clamp-2 leading-relaxed">
          {business.description}
        </p>

        {/* AI Highlight Tag if available */}
        {business.aiSummary?.positiveHighlights?.[0] && (
          <div className="mt-3 p-2.5 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border-l-2 border-[#0052FF] text-[11px] text-[#1A1A1A] dark:text-[#F5F5F2] flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF] shrink-0 mt-0.5" />
            <span className="line-clamp-1">{business.aiSummary.positiveHighlights[0]}</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <footer className="mt-5 pt-3.5 border-t border-[#E5E5E1] dark:border-[#2A2A28] flex items-center justify-between gap-2">
        <button
          onClick={() => onSelectBusiness(business.slug)}
          className="text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] hover:text-[#0052FF] flex items-center gap-1 transition"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        <button
          onClick={() => onOpenWriteReview(business.id)}
          className="px-3 py-1.5 rounded-sm bg-[#F5F5F2] dark:bg-[#2A2A28] hover:bg-[#E6EEFF] hover:text-[#0052FF] text-xs font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] transition flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#0052FF]" />
          <span>Write Review</span>
        </button>
      </footer>

    </article>
  );
};
