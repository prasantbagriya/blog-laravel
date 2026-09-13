import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Share2, 
  Sparkles, 
  FileText, 
  Building2, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Languages,
  Check,
  Plus
} from 'lucide-react';
import { Seo } from './Seo';
import { Business, Review, CompetitorComparison } from '../types';

interface BusinessProfileViewProps {
  business: Business;
  reviews: Review[];
  allBusinesses: Business[];
  onOpenWriteReview: (businessId: string) => void;
  onVoteHelpful: (reviewId: string, direction: 'up' | 'down') => void;
  onFlagReview: (reviewId: string) => void;
  onAddReply: (reviewId: string, replyText: string) => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  business,
  reviews,
  allBusinesses,
  onOpenWriteReview,
  onVoteHelpful,
  onFlagReview,
  onAddReply,
}) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'ai_insights' | 'competitors' | 'about'>('reviews');
  const [reviewFilterRating, setReviewFilterRating] = useState<number | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  
  // Competitor comparison state
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('');
  const [competitorReport, setCompetitorReport] = useState<CompetitorComparison | null>(null);
  const [isLoadingCompetitorReport, setIsLoadingCompetitorReport] = useState(false);

  // Reply state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // AI Translation simulation state
  const [translatedReviewIds, setTranslatedReviewIds] = useState<Record<string, string>>({});

  // Filtered reviews list
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilterRating !== 'all' && r.rating !== reviewFilterRating) return false;
    if (verifiedOnly && !r.isVerifiedPurchase) return false;
    if (reviewSearchQuery.trim()) {
      const q = reviewSearchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.reviewerName.toLowerCase().includes(q);
    }
    return true;
  });

  // Handle Competitor Comparison API call
  const handleRunCompetitorComparison = async () => {
    if (!selectedCompetitorId) return;
    setIsLoadingCompetitorReport(true);
    try {
      const res = await fetch('/api/ai/competitor-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetBusinessId: business.id,
          competitorBusinessId: selectedCompetitorId
        })
      });
      const data = await res.json();
      setCompetitorReport(data);
    } catch (err) {
      console.error('Competitor report error:', err);
    } finally {
      setIsLoadingCompetitorReport(false);
    }
  };

  const handleTranslateReview = (reviewId: string) => {
    if (translatedReviewIds[reviewId]) {
      const newMap = { ...translatedReviewIds };
      delete newMap[reviewId];
      setTranslatedReviewIds(newMap);
    } else {
      setTranslatedReviewIds({
        ...translatedReviewIds,
        [reviewId]: 'AI Translation (Spanish): "Excelente experiencia con esta empresa. La atención al cliente fue inmediata y los resultados superaron nuestras expectativas."'
      });
    }
  };

  const handlePostReply = (reviewId: string) => {
    if (replyText.trim()) {
      onAddReply(reviewId, replyText.trim());
      setReplyingReviewId(null);
      setReplyText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0F0F0E] pb-20 transition-colors">
      <Seo
        title={`${business.name} Reviews and Ratings | TrustPulse AI`}
        description={business.description}
        schema={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": business.name,
          "image": business.logo,
          "description": business.description,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": business.city,
            "addressCountry": business.country
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": business.rating,
            "reviewCount": business.reviewCount
          }
        }}
      />
      {/* Cover Image Header */}
      <div className="h-48 sm:h-64 lg:h-80 w-full relative overflow-hidden bg-[#1A1A1A]">
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0E] via-[#0F0F0E]/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        
        {/* Business Header Card */}
        <div className="p-6 sm:p-8 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] border-l-4 border-l-[#0052FF] shadow-md mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4 sm:gap-6">
              <img
                src={business.logo}
                alt={business.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-sm object-cover border border-[#E5E5E1] dark:border-[#2A2A28] shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
                    {business.name}
                  </h1>

                  {business.isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF] text-xs font-mono font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#0052FF]" />
                      <span>CLAIMED & VERIFIED</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#555555] dark:text-[#A0A09C] mt-1 max-w-xl">
                  {business.description}
                </p>

                <div className="mt-3 flex items-center gap-4 text-xs font-mono text-[#555555] dark:text-[#A0A09C] flex-wrap">
                  <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#0052FF] transition">
                    <Globe className="w-3.5 h-3.5 text-[#0052FF]" />
                    <span>Website</span>
                  </a>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0052FF]" />
                    <span>{business.city}, {business.country}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#0052FF]" />
                    <span>{business.categoryName}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Trust Score & Star CTA */}
            <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-[#E5E5E1] dark:border-[#2A2A28]">
              
              {/* Trust Score Gauge Box */}
              <div className="p-4 rounded-sm bg-[#E6EEFF] dark:bg-[#0052FF]/20 border border-[#0052FF]/30 text-center shrink-0">
                <div className="text-3xl font-mono font-bold text-[#0052FF] dark:text-[#80B0FF] tracking-tight">
                  {business.trustScore} <span className="text-xs font-semibold opacity-70">/100</span>
                </div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0052FF] dark:text-[#80B0FF] mt-0.5">
                  Trust Score Index
                </div>
              </div>

              {/* Overall Star Rating */}
              <div className="space-y-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#1A1A1A] dark:text-white">{business.rating}</span>
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= Math.round(business.rating) ? 'fill-amber-500 text-amber-500' : 'text-[#E5E5E1] dark:text-[#3A3A38]'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-[#555555] dark:text-[#A0A09C]">
                  Based on <strong>{business.reviewCount.toLocaleString()}</strong> reviews
                </div>

                <button
                  onClick={() => onOpenWriteReview(business.id)}
                  className="w-full px-4 py-2 text-xs font-bold rounded-sm bg-[#0052FF] hover:bg-[#0040D0] text-white shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  id="profile-write-review-btn"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Write Review</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E5E5E1] dark:border-[#2A2A28] mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-sm transition shrink-0 flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-[#0052FF] text-white shadow-xs'
                : 'text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reviews ({business.reviewCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_insights')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-sm transition shrink-0 flex items-center gap-2 ${
              activeTab === 'ai_insights'
                ? 'bg-[#0052FF] text-white shadow-xs'
                : 'text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Review Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('competitors')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-sm transition shrink-0 flex items-center gap-2 ${
              activeTab === 'competitors'
                ? 'bg-[#0052FF] text-white shadow-xs'
                : 'text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Competitor Benchmark</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-sm transition shrink-0 flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-[#0052FF] text-white shadow-xs'
                : 'text-[#1A1A1A] dark:text-[#F5F5F2] hover:bg-[#F5F5F2] dark:hover:bg-[#161615]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Info & Products</span>
          </button>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* TAB 1: REVIEWS LIST */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                
                {/* Review Filters */}
                <div className="p-4 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    
                    <input
                      type="text"
                      value={reviewSearchQuery}
                      onChange={(e) => setReviewSearchQuery(e.target.value)}
                      placeholder="Search within reviews..."
                      className="px-3 py-2 text-xs rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0052FF] flex-1"
                    />

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-[#555555] dark:text-[#A0A09C] font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={verifiedOnly}
                          onChange={(e) => setVerifiedOnly(e.target.checked)}
                          className="rounded-2xs text-[#0052FF] focus:ring-[#0052FF]"
                        />
                        <span>Verified Invoices Only</span>
                      </label>
                    </div>

                  </div>

                  {/* Rating Selector Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#E5E5E1] dark:border-[#2A2A28] text-xs">
                    <span className="text-[#999999] dark:text-[#777773] font-mono mr-1">Filter Star:</span>
                    <button
                      onClick={() => setReviewFilterRating('all')}
                      className={`px-2.5 py-1 rounded-sm font-semibold transition ${
                        reviewFilterRating === 'all'
                          ? 'bg-[#0052FF] text-white'
                          : 'bg-[#F5F5F2] dark:bg-[#2A2A28] text-[#1A1A1A] dark:text-[#F5F5F2]'
                      }`}
                    >
                      All ({reviews.length})
                    </button>
                    {[5, 4, 3, 2, 1].map((s) => (
                      <button
                        key={s}
                        onClick={() => setReviewFilterRating(s)}
                        className={`px-2.5 py-1 rounded-sm font-semibold transition flex items-center gap-1 ${
                          reviewFilterRating === s
                            ? 'bg-[#0052FF] text-white'
                            : 'bg-[#F5F5F2] dark:bg-[#2A2A28] text-[#1A1A1A] dark:text-[#F5F5F2]'
                        }`}
                      >
                        <span>{s}</span>
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                {filteredReviews.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-[#161615] rounded-md border border-[#E5E5E1] dark:border-[#2A2A28]">
                    <MessageSquare className="w-8 h-8 text-[#999999] mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">No reviews match your filters</h4>
                    <p className="text-xs text-[#555555] mt-1">Try clearing the search or star filter to see all reviews.</p>
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-6 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-4 shadow-2xs"
                    >
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.reviewerAvatar}
                            alt={rev.reviewerName}
                            className="w-10 h-10 rounded-full object-cover border border-[#E5E5E1] dark:border-[#2A2A28]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white">{rev.reviewerName}</h4>
                              {rev.isVerifiedPurchase && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF] text-[10px] font-mono font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-[#0052FF]" />
                                  <span>Verified Invoice</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#555555] dark:text-[#A0A09C] flex items-center gap-2 mt-0.5 font-mono">
                              <span>{rev.reviewerLocation}</span>
                              <span>•</span>
                              <span>{rev.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-[#E5E5E1] dark:text-[#3A3A38]'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Body */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">{rev.title}</h3>
                        <p className="text-xs text-[#555555] dark:text-[#A0A09C] leading-relaxed whitespace-pre-line">
                          {rev.description}
                        </p>

                        {/* Translated text if requested */}
                        {translatedReviewIds[rev.id] && (
                          <div className="p-3 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] text-xs text-[#0052FF] dark:text-[#80B0FF] border-l-2 border-[#0052FF] italic">
                            {translatedReviewIds[rev.id]}
                          </div>
                        )}
                      </div>

                      {/* Pros & Cons pills */}
                      {(rev.pros.length > 0 || rev.cons.length > 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {rev.pros.length > 0 && (
                            <div className="p-2.5 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border-l-2 border-[#0052FF] text-[#1A1A1A] dark:text-[#F5F5F2]">
                              <span className="font-bold block mb-1 text-[#0052FF]">Pros:</span>
                              <ul className="list-disc list-inside space-y-0.5">
                                {rev.pros.map((p, idx) => (
                                  <li key={idx}>{p}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {rev.cons.length > 0 && (
                            <div className="p-2.5 rounded-sm bg-rose-500/10 border-l-2 border-rose-500 text-rose-900 dark:text-rose-300">
                              <span className="font-bold block mb-1 text-rose-600">Cons:</span>
                              <ul className="list-disc list-inside space-y-0.5">
                                {rev.cons.map((c, idx) => (
                                  <li key={idx}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Verified Proof Banner */}
                      {rev.proof && (
                        <div className="p-3 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] flex items-center justify-between text-xs text-[#555555] dark:text-[#A0A09C]">
                          <div className="flex items-center gap-2 font-mono">
                            <FileText className="w-4 h-4 text-[#0052FF]" />
                            <span>Proof Verified: <strong>{rev.proof.orderNumber || 'Invoice #8891'}</strong></span>
                          </div>
                          <span className="text-[10px] font-mono bg-[#E6EEFF] text-[#0052FF] px-2 py-0.5 rounded-xs font-bold">Passed Verification</span>
                        </div>
                      )}

                      {/* Official Business Reply */}
                      {rev.businessReply && (
                        <div className="mt-3 p-4 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border-l-2 border-[#0052FF] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-[#0052FF]" />
                              {rev.businessReply.authorName}
                            </span>
                            <span className="text-[10px] font-mono text-[#999999]">{rev.businessReply.createdAt}</span>
                          </div>
                          <p className="text-[#555555] dark:text-[#A0A09C] leading-relaxed pt-1">
                            {rev.businessReply.content}
                          </p>
                        </div>
                      )}

                      {/* Review Actions Footer */}
                      <div className="pt-3 border-t border-[#E5E5E1] dark:border-[#2A2A28] flex items-center justify-between text-xs text-[#555555]">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onVoteHelpful(rev.id, 'up')}
                            className="flex items-center gap-1 hover:text-[#0052FF] transition"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-[#0052FF]" />
                            <span>Helpful ({rev.helpfulCount})</span>
                          </button>

                          <button
                            onClick={() => handleTranslateReview(rev.id)}
                            className="flex items-center gap-1 hover:text-[#0052FF] transition"
                          >
                            <Languages className="w-3.5 h-3.5 text-[#0052FF]" />
                            <span>Translate</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setReplyingReviewId(replyingReviewId === rev.id ? null : rev.id)}
                            className="hover:text-[#0052FF] transition font-semibold"
                          >
                            Business Reply
                          </button>

                          <button
                            onClick={() => onFlagReview(rev.id)}
                            className="hover:text-rose-600 transition"
                            title="Report review to moderators"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Reply Drawer */}
                      {replyingReviewId === rev.id && (
                        <div className="mt-3 p-3 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write official business reply..."
                            rows={2}
                            className="w-full p-2 text-xs rounded-sm bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setReplyingReviewId(null)}
                              className="px-3 py-1 text-xs text-[#555555] hover:text-[#1A1A1A]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handlePostReply(rev.id)}
                              className="px-3 py-1 text-xs font-bold bg-[#0052FF] text-white rounded-sm hover:bg-[#0040D0]"
                            >
                              Post Reply
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  ))
                )}

              </div>
            )}

            {/* TAB 2: AI REVIEW INSIGHTS */}
            {activeTab === 'ai_insights' && (
              <div className="p-6 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-6">
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-sm bg-[#E6EEFF] text-[#0052FF] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">Gemini AI Synthesis Report</h3>
                    <p className="text-xs text-[#555555]">Real-time analysis extracted from all customer feedback</p>
                  </div>
                </div>

                {/* Overall Sentiment Box */}
                <div className="p-4 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border-l-2 border-[#0052FF] text-xs text-[#1A1A1A] dark:text-[#F5F5F2] leading-relaxed">
                  <span className="font-bold text-[#0052FF] block mb-1">Executive Summary:</span>
                  {business.aiSummary?.overallSentiment || 'Customer reviews reflect strong satisfaction with service reliability and team responsiveness.'}
                </div>

                {/* Positive Highlights */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#0052FF] mb-2">
                    Top Verified Strengths
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {(business.aiSummary?.positiveHighlights || ['Fast response time', 'High reliability']).map((item, idx) => (
                      <li key={idx} className="p-2.5 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border-l-2 border-[#0052FF] text-[#1A1A1A] dark:text-[#F5F5F2] flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#0052FF] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Points */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 mb-2">
                    Areas For Improvement
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {(business.aiSummary?.criticalPoints || ['Pricing tiers for high bandwidth']).map((item, idx) => (
                      <li key={idx} className="p-2.5 rounded-sm bg-amber-500/10 text-amber-900 dark:text-amber-300 border-l-2 border-amber-500 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

            {/* TAB 3: COMPETITOR BENCHMARK */}
            {activeTab === 'competitors' && (
              <div className="p-6 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-6">
                
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">AI Competitor Benchmark Tool</h3>
                  <p className="text-xs text-[#555555]">Compare {business.name} side-by-side with industry rivals</p>
                </div>

                {/* Select rival */}
                <div className="flex items-center gap-3">
                  <select
                    value={selectedCompetitorId}
                    onChange={(e) => setSelectedCompetitorId(e.target.value)}
                    className="flex-1 p-2.5 text-xs rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white"
                  >
                    <option value="">-- Select Competitor Business --</option>
                    {allBusinesses
                      .filter((b) => b.id !== business.id)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} (Trust Score: {b.trustScore}/100)
                        </option>
                      ))}
                  </select>

                  <button
                    onClick={handleRunCompetitorComparison}
                    disabled={!selectedCompetitorId || isLoadingCompetitorReport}
                    className="px-4 py-2.5 text-xs font-bold rounded-sm bg-[#0052FF] hover:bg-[#0040D0] text-white disabled:opacity-50 transition shrink-0"
                  >
                    {isLoadingCompetitorReport ? 'Analyzing...' : 'Generate Benchmark'}
                  </button>
                </div>

                {/* Benchmark Output */}
                {competitorReport && (
                  <div className="p-5 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-4 text-xs">
                    <h4 className="font-bold text-[#1A1A1A] dark:text-white text-sm">
                      {competitorReport.targetBusinessName} vs {competitorReport.competitorName}
                    </h4>
                    <p className="text-[#555555] dark:text-[#A0A09C] leading-relaxed">
                      {competitorReport.comparisonSummary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 rounded-sm bg-[#E6EEFF] dark:bg-[#0052FF]/20 border border-[#0052FF]/30">
                        <span className="font-bold text-[#0052FF] block mb-1">Key Advantages:</span>
                        <ul className="list-disc list-inside space-y-1 text-[#1A1A1A] dark:text-[#F5F5F2]">
                          {competitorReport.keyAdvantages.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>

                      <div className="p-3 rounded-sm bg-amber-500/10 border border-amber-500/30">
                        <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">Improvement Areas:</span>
                        <ul className="list-disc list-inside space-y-1 text-amber-900 dark:text-amber-200">
                          {competitorReport.areasOfImprovement.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 4: COMPANY INFO & PRODUCTS */}
            {activeTab === 'about' && (
              <div className="p-6 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white mb-2">About {business.name}</h3>
                  <p className="text-xs text-[#555555] dark:text-[#A0A09C] leading-relaxed">{business.description}</p>
                </div>

                {business.products && business.products.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999] mb-3">Products & Services</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {business.products.map((p) => (
                        <div key={p.id} className="p-3.5 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] text-xs space-y-1">
                          <div className="font-bold text-[#1A1A1A] dark:text-white flex justify-between">
                            <span>{p.name}</span>
                            <span className="text-[#0052FF] font-mono">{p.price}</span>
                          </div>
                          <p className="text-[#555555] dark:text-[#A0A09C] text-[11px]">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Sidebar: Category Breakdown & Company Metadata */}
          <div className="space-y-6">
            
            {/* Category Ratings Breakdown */}
            <div className="p-6 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white">
                Category Ratings Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                {business.categoryAverages && Object.entries(business.categoryAverages).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between font-semibold text-[#1A1A1A] dark:text-[#F5F5F2] capitalize mb-1">
                      <span>{key}</span>
                      <span className="text-[#0052FF] font-mono">{Number(val)} / 5.0</span>
                    </div>
                    <div className="w-full h-2 rounded-2xs bg-[#F5F5F2] dark:bg-[#20201F] overflow-hidden">
                      <div
                        className="h-full bg-[#0052FF] rounded-2xs"
                        style={{ width: `${((Number(val) || 0) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Contact & Hours */}
            <div className="p-6 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-3.5 text-xs">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white mb-2">
                Verification & Contact
              </h3>

              <div className="flex items-center gap-2 text-[#555555] dark:text-[#A0A09C]">
                <Phone className="w-4 h-4 text-[#0052FF] shrink-0" />
                <span>{business.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-[#555555] dark:text-[#A0A09C]">
                <MapPin className="w-4 h-4 text-[#0052FF] shrink-0" />
                <span>{business.address}</span>
              </div>

              <div className="flex items-center gap-2 text-[#555555] dark:text-[#A0A09C]">
                <Clock className="w-4 h-4 text-[#0052FF] shrink-0" />
                <span>{business.openingHours}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
