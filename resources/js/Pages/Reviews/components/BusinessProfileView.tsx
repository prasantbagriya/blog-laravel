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
import { Business, Review, CompetitorComparison } from '../types';

interface BusinessProfileViewProps {
  business: Business;
  reviews: Review[];
  allBusinesses: Business[];
  onOpenWriteReview: (businessId: string) => void;
  onVoteHelpful: (reviewId: string, direction: 'up' | 'down') => void;
  onFlagReview: (reviewId: string) => void;
  onAddReply: (reviewId: string, replyText: string) => void;
  onOpenEditBusiness?: () => void;
  authUser?: any;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  business,
  reviews,
  allBusinesses,
  onOpenWriteReview,
  onVoteHelpful,
  onFlagReview,
  onAddReply,
  onOpenEditBusiness,
  authUser,
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
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20 transition-colors font-sans">
      
      {/* Cover Image Header */}
      <div className="h-56 sm:h-72 lg:h-96 w-full relative overflow-hidden bg-zinc-900">
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        
        {/* Premium Business Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-zinc-800 shadow-2xl mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 w-full lg:w-auto">
              <div className="relative group shrink-0">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg relative z-10 bg-white"
                  />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {business.name}
                  </h1>

                  {business.isVerified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold shadow-sm border border-blue-100 dark:border-blue-800">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>VERIFIED PROFILE</span>
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl mb-4">
                  {business.description}
                </p>

                <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-zinc-300 flex-wrap">
                  <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Website</span>
                  </a>
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>{business.city}, {business.country}</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span>{business.categoryName}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Trust Score & Star CTA */}
            <div className="flex flex-col items-center sm:items-end w-full lg:w-auto shrink-0 bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
              
              <div className="flex items-center gap-6 mb-5 w-full justify-between sm:justify-end">
                {/* Overall Star Rating */}
                <div className="text-right">
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-end gap-2 mb-1">
                        {business.rating}
                        <Star className="w-6 h-6 fill-amber-500 text-amber-500 -mt-1" />
                    </div>
                    <div className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
                        {business.reviewCount.toLocaleString()} reviews
                    </div>
                </div>

                <div className="h-12 w-px bg-slate-200 dark:bg-zinc-700"></div>

                {/* Trust Score Gauge Box */}
                <div className="text-center">
                    <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight flex items-baseline justify-center mb-1">
                        {business.trustScore} <span className="text-sm text-blue-400 dark:text-blue-500/70 ml-1 font-medium">/100</span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        Trust Score
                    </div>
                </div>
              </div>

              <div className="w-full space-y-2">
                <button
                    onClick={() => onOpenWriteReview(business.id)}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm"
                >
                    Write a Review
                </button>
                {authUser && ((business.userId && business.userId == authUser.id) || (business.email && business.email === authUser.email) || authUser.role === 'super_admin') && (
                    <button
                    onClick={() => onOpenEditBusiness?.()}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm"
                    >
                    Manage Business Profile
                    </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Tab Navigation (Underline Style) */}
        <div className="flex items-center gap-6 mb-10 overflow-x-auto border-b border-slate-200 dark:border-zinc-800 scrollbar-hide">
          {[
            { id: 'reviews', label: 'Reviews', icon: MessageSquare, count: business.reviewCount },
            { id: 'ai_insights', label: 'AI Insights', icon: Sparkles },
            { id: 'competitors', label: 'Competitor Benchmark', icon: TrendingUp },
            { id: 'about', label: 'Company Info', icon: Building2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-sm font-semibold transition-all shrink-0 flex items-center gap-2 border-b-2 -mb-[1px] ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 dark:text-zinc-300 hover:text-blue-600 hover:border-slate-300 dark:hover:border-zinc-600'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? '' : 'text-slate-400 dark:text-zinc-500'}`} />
              <span>{tab.label} {tab.count ? `(${tab.count})` : ''}</span>
            </button>
          ))}
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">

            {/* TAB 1: REVIEWS LIST */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                
                {/* Review Filters (Premium Glass Box) */}
                <div className="p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex-1 w-full relative">
                        <input
                            type="text"
                            value={reviewSearchQuery}
                            onChange={(e) => setReviewSearchQuery(e.target.value)}
                            placeholder="Search in reviews..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-zinc-900 border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white transition-all outline-none"
                        />
                        <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {/* Rating Dropdown equivalent / Pills */}
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
                            <button
                                onClick={() => setReviewFilterRating('all')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                    reviewFilterRating === 'all' ? 'bg-white dark:bg-zinc-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'
                                }`}
                            >
                                All
                            </button>
                            {[5, 4, 3, 2, 1].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setReviewFilterRating(s)}
                                    className={`px-2 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                                        reviewFilterRating === s ? 'bg-white dark:bg-zinc-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700'
                                    }`}
                                >
                                    {s} <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                </button>
                            ))}
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300 font-medium cursor-pointer ml-2">
                            <input
                                type="checkbox"
                                checked={verifiedOnly}
                                onChange={(e) => setVerifiedOnly(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-600 border-slate-300 dark:border-zinc-700 dark:bg-zinc-800 transition"
                            />
                            <span>Verified</span>
                        </label>
                    </div>

                </div>

                {/* Reviews List */}
                {filteredReviews.length === 0 ? (
                  <div className="p-16 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <MessageSquare className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">No reviews found</h4>
                    <p className="text-sm text-slate-500 mt-2">Try adjusting your filters to see more results.</p>
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <article
                      key={rev.id}
                      className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={rev.reviewerAvatar}
                            alt={rev.reviewerName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-zinc-800"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.reviewerName}</h4>
                              {rev.isVerifiedPurchase && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold border border-blue-100 dark:border-blue-800/50">
                                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                  <span>Verified Invoice</span>
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                              <span>{rev.reviewerLocation}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
                              <span>{rev.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-800/30">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-zinc-700'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Body */}
                      <div className="space-y-3 mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{rev.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                          {rev.description}
                        </p>

                        {/* Translated text if requested */}
                        {translatedReviewIds[rev.id] && (
                          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 italic">
                            {translatedReviewIds[rev.id]}
                          </div>
                        )}
                      </div>

                      {/* Pros & Cons pills */}
                      {(rev.pros.length > 0 || rev.cons.length > 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                          {rev.pros.length > 0 && (
                            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-100">
                              <span className="font-bold flex items-center gap-1.5 mb-2 text-emerald-700 dark:text-emerald-400">
                                <Plus className="w-4 h-4" /> Pros
                              </span>
                              <ul className="space-y-1">
                                {rev.pros.map((p, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                      <span className="text-emerald-500 mt-0.5">•</span> {p}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {rev.cons.length > 0 && (
                            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-rose-900 dark:text-rose-100">
                              <span className="font-bold flex items-center gap-1.5 mb-2 text-rose-700 dark:text-rose-400">
                                <AlertCircle className="w-4 h-4" /> Cons
                              </span>
                              <ul className="space-y-1">
                                {rev.cons.map((c, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                      <span className="text-rose-500 mt-0.5">•</span> {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Verified Proof Banner */}
                      {rev.proof && (
                        <div className="p-3.5 mb-6 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-between text-sm text-slate-600 dark:text-zinc-300">
                          <div className="flex items-center gap-2 font-medium">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span>Proof Verified: <strong>{rev.proof.orderNumber || 'Invoice #8891'}</strong></span>
                          </div>
                          <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-md font-bold">Verified</span>
                        </div>
                      )}

                      {/* Official Business Reply */}
                      {rev.businessReply && (
                        <div className="mb-6 p-5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border-l-4 border-slate-300 dark:border-zinc-600 text-sm space-y-2 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                              <Building2 className="w-16 h-16" />
                          </div>
                          <div className="flex items-center justify-between relative z-10">
                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-slate-500" />
                              Reply from {rev.businessReply.authorName}
                            </span>
                            <span className="text-xs font-medium text-slate-400">{rev.businessReply.createdAt}</span>
                          </div>
                          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed relative z-10">
                            {rev.businessReply.content}
                          </p>
                        </div>
                      )}

                      {/* Review Actions Footer */}
                      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-sm text-slate-500 dark:text-zinc-400">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => onVoteHelpful(rev.id, 'up')}
                            className="flex items-center gap-1.5 hover:text-blue-600 transition font-medium text-slate-600 dark:text-zinc-300"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful ({rev.helpfulCount})</span>
                          </button>

                          <button
                            onClick={() => handleTranslateReview(rev.id)}
                            className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-zinc-300 transition font-medium px-3 py-1.5"
                          >
                            <Languages className="w-4 h-4" />
                            <span>Translate</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReplyingReviewId(replyingReviewId === rev.id ? null : rev.id)}
                            className="hover:text-slate-700 dark:hover:text-zinc-300 transition font-medium px-3 py-1.5"
                          >
                            Reply
                          </button>

                          <button
                            onClick={() => onFlagReview(rev.id)}
                            className="hover:text-rose-600 dark:hover:text-rose-400 transition"
                            title="Report review"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Reply Drawer */}
                      {replyingReviewId === rev.id && (
                        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 space-y-3">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write an official response on behalf of the business..."
                            rows={3}
                            className="w-full p-3 text-sm rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow resize-none"
                          />
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setReplyingReviewId(null)}
                              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handlePostReply(rev.id)}
                              className="px-4 py-2 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                            >
                              Post Reply
                            </button>
                          </div>
                        </div>
                      )}

                    </article>
                  ))
                )}

              </div>
            )}

            {/* TAB 2: AI REVIEW INSIGHTS */}
            {activeTab === 'ai_insights' && (
              <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-8">
                
                <div className="flex items-center gap-4 border-b border-slate-100 dark:border-zinc-800 pb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Synthesis Report</h3>
                    <p className="text-sm text-slate-500 font-medium">Real-time analysis extracted from all customer feedback</p>
                  </div>
                </div>

                {/* Overall Sentiment Box */}
                <div className="p-6 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                  <span className="font-bold text-blue-600 text-base block mb-2">Executive Summary:</span>
                  <p className="text-base">{business.aiSummary?.overallSentiment || 'Customer reviews reflect strong satisfaction with service reliability and team responsiveness.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Positive Highlights */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800/20">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" /> Top Strengths
                    </h4>
                    <ul className="space-y-3 text-sm">
                        {(business.aiSummary?.positiveHighlights || ['Fast response time', 'High reliability']).map((item, idx) => (
                        <li key={idx} className="text-emerald-900 dark:text-emerald-100 flex items-start gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span className="font-medium pt-0.5">{item}</span>
                        </li>
                        ))}
                    </ul>
                    </div>

                    {/* Critical Points */}
                    <div className="bg-rose-50/50 dark:bg-rose-900/10 p-6 rounded-xl border border-rose-100 dark:border-rose-800/20">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Areas To Improve
                    </h4>
                    <ul className="space-y-3 text-sm">
                        {(business.aiSummary?.criticalPoints || ['Pricing tiers for high bandwidth']).map((item, idx) => (
                        <li key={idx} className="text-rose-900 dark:text-rose-100 flex items-start gap-2.5">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                            <span className="font-medium pt-0.5">{item}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>

              </div>
            )}

            {/* TAB 3: COMPETITOR BENCHMARK */}
            {activeTab === 'competitors' && (
              <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-8">
                
                <div className="border-b border-slate-100 dark:border-zinc-800 pb-6">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-blue-500" />
                      AI Competitor Benchmark Tool
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Compare {business.name} side-by-side with industry rivals</p>
                </div>

                {/* Select rival */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <select
                    value={selectedCompetitorId}
                    onChange={(e) => setSelectedCompetitorId(e.target.value)}
                    className="flex-1 p-3 text-sm font-medium rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="">-- Select Competitor to Analyze --</option>
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
                    className="px-6 py-3 text-sm font-bold rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 disabled:opacity-50 transition-colors shrink-0 shadow-sm"
                  >
                    {isLoadingCompetitorReport ? 'Analyzing...' : 'Generate Benchmark'}
                  </button>
                </div>

                {/* Benchmark Output */}
                {competitorReport && (
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 space-y-6 text-sm">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-zinc-700 pb-4">
                      {competitorReport.targetBusinessName} <span className="text-slate-400 mx-2 text-sm font-normal">vs</span> {competitorReport.competitorName}
                    </h4>
                    <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-base">
                      {competitorReport.comparisonSummary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 text-base block mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Key Advantages
                        </span>
                        <ul className="space-y-2 text-emerald-900 dark:text-emerald-100">
                          {competitorReport.keyAdvantages.map((a, i) => <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{a}</li>)}
                        </ul>
                      </div>

                      <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                        <span className="font-bold text-amber-700 dark:text-amber-400 text-base block mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Improvement Areas
                        </span>
                        <ul className="space-y-2 text-amber-900 dark:text-amber-100">
                          {competitorReport.areasOfImprovement.map((a, i) => <li key={i} className="flex gap-2"><span className="text-amber-500">•</span>{a}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 4: COMPANY INFO & PRODUCTS */}
            {activeTab === 'about' && (
              <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-8">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4">About {business.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{business.description}</p>
                </div>

                {business.products && business.products.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-zinc-800 pb-3">Products & Services</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {business.products.map((p) => (
                        <div key={p.id} className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-800 space-y-2 hover:shadow-md transition-shadow">
                          <div className="font-extrabold text-slate-900 dark:text-white flex justify-between items-start gap-4">
                            <span className="text-base">{p.name}</span>
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-mono text-xs px-2 py-1 rounded-md">{p.price}</span>
                          </div>
                          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed pt-1">{p.description}</p>
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
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Category Ratings
              </h3>

              <div className="space-y-4 text-sm font-medium">
                {business.categoryAverages && Object.entries(business.categoryAverages).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-slate-700 dark:text-zinc-300 capitalize mb-2">
                      <span>{key}</span>
                      <span className="text-slate-900 dark:text-white font-bold">{Number(val).toFixed(1)} <span className="text-slate-400 font-normal">/ 5.0</span></span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden relative">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${((Number(val) || 0) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Contact & Hours */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/80 mb-2">
                Contact & Details
              </h3>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="pt-1.5">
                    <div className="text-xs text-white/60 font-medium mb-0.5">Phone</div>
                    <div className="text-sm font-medium">{business.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="pt-1.5">
                    <div className="text-xs text-white/60 font-medium mb-0.5">Address</div>
                    <div className="text-sm font-medium leading-relaxed">{business.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="pt-1.5">
                    <div className="text-xs text-white/60 font-medium mb-0.5">Opening Hours</div>
                    <div className="text-sm font-medium leading-relaxed">{business.openingHours}</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
