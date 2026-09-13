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
  Flag, 
  Sparkles, 
  FileText, 
  Building2, 
  TrendingUp,
  AlertCircle,
  Languages,
  Plus
} from 'lucide-react';
import { Business, Review, CompetitorComparison } from '../types';
import AnimatedBorderCard from '@/Components/AnimatedBorderCard';
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
      <div className="h-64 sm:h-80 lg:h-[400px] w-full relative overflow-hidden bg-zinc-900">
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-zinc-950 via-slate-900/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        
        {/* Premium Business Header Card */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-white/40 dark:border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] mb-12 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
            
            <div className="flex flex-col sm:flex-row items-start gap-8 w-full lg:w-auto">
              <div className="relative group shrink-0">
                  <div className="absolute inset-0 bg-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-4 border-white dark:border-zinc-800 shadow-xl relative z-10 bg-white"
                  />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {business.name}
                  </h1>

                  {business.isVerified && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[11px] uppercase tracking-widest font-black shadow-sm border border-blue-100 dark:border-blue-800">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      VERIFIED
                    </span>
                  )}
                </div>

                <p className="text-base sm:text-lg text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl mb-6 font-medium">
                  {business.description}
                </p>

                <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-zinc-300 flex-wrap">
                  <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-zinc-800/80 px-4 py-2 rounded-xl shadow-sm hover:shadow">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>Website</span>
                  </a>
                  <span className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800/80 px-4 py-2 rounded-xl shadow-sm">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>{business.city}, {business.country}</span>
                  </span>
                  <span className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800/80 px-4 py-2 rounded-xl shadow-sm">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span>{business.categoryName}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Trust Score & Star CTA */}
            <div className="group relative flex flex-col items-center sm:items-end w-full lg:w-auto shrink-0 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-8 rounded-3xl transition-all duration-500 overflow-hidden">
              
              {/* Border animation layers */}
              <div className="absolute inset-0 rounded-3xl border border-slate-200/60 dark:border-zinc-700/50 group-hover:border-transparent transition-colors duration-300"></div>
              
              {/* Animated drawing border effect (using scaled pseudo-elements in a clip-path style or simpler approach) */}
              <div className="absolute inset-0 rounded-3xl border-2 border-blue-500 opacity-0 group-hover:opacity-100 scale-[1.03] group-hover:scale-100 transition-all duration-500 pointer-events-none"></div>

              <div className="flex flex-col items-center sm:items-end w-full justify-center text-center sm:text-right relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6 w-full justify-center sm:justify-end">
                  {/* Overall Star Rating */}
                  <div className="text-center sm:text-right flex flex-col items-center sm:items-end">
                      <div className="text-4xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-end gap-2 mb-1">
                          {business.rating}
                          <Star className="w-7 h-7 fill-amber-500 text-amber-500 -mt-1 drop-shadow-md" />
                      </div>
                      <div className="text-sm text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                          {business.reviewCount.toLocaleString()} reviews
                      </div>
                  </div>

                  <div className="hidden sm:block h-14 w-px bg-slate-200 dark:bg-zinc-700"></div>
                  <div className="sm:hidden w-14 h-px bg-slate-200 dark:bg-zinc-700 my-2"></div>

                  {/* Trust Score Gauge Box */}
                  <div className="text-center">
                      <div className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight flex items-baseline justify-center mb-1">
                          {business.trustScore} <span className="text-base text-blue-400 dark:text-blue-500/70 ml-1 font-bold">/100</span>
                      </div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-blue-500" />
                          Trust Score
                      </div>
                  </div>
                </div>

                <div className="w-full space-y-3 mt-4">
                  <button
                      onClick={() => onOpenWriteReview(business.id)}
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3.5 rounded-full transition-all shadow-sm active:scale-95 border border-slate-900 dark:border-white"
                  >
                      Write a Review
                  </button>
                  {authUser && ((business.userId && business.userId == authUser.id) || (business.email && business.email === authUser.email) || authUser.role === 'super_admin') && (
                      <button
                      onClick={() => onOpenEditBusiness?.()}
                      className="block w-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white text-center font-bold py-3.5 rounded-full transition-all border border-slate-200 dark:border-zinc-700 active:scale-95 shadow-sm"
                      >
                      Manage Profile
                      </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Pill-Shaped Tab Navigation */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto p-1.5 bg-slate-200/50 dark:bg-zinc-900/50 rounded-2xl w-max max-w-full backdrop-blur-sm border border-slate-200 dark:border-zinc-800 scrollbar-hide">
          {[
            { id: 'reviews', label: 'Reviews', icon: MessageSquare, count: business.reviewCount },
            { id: 'ai_insights', label: 'AI Insights', icon: Sparkles },
            { id: 'competitors', label: 'Competitor Benchmark', icon: TrendingUp },
            { id: 'about', label: 'Company Info', icon: Building2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-6 text-sm font-bold rounded-xl transition-all shrink-0 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm border-transparent'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400 dark:text-zinc-500'}`} />
              <span>{tab.label} {tab.count ? <span className="opacity-60 ml-1">({tab.count})</span> : ''}</span>
            </button>
          ))}
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* Main Content Area (2 Cols) */}
          <div className="xl:col-span-2 space-y-10">

            {/* TAB 1: REVIEWS LIST */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                
                {/* Review Filters (Premium Glass Box) */}
                <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex-1 w-full relative">
                        <input
                            type="text"
                            value={reviewSearchQuery}
                            onChange={(e) => setReviewSearchQuery(e.target.value)}
                            placeholder="Search in reviews..."
                            className="w-full pl-12 pr-4 py-3.5 text-sm font-medium rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white transition-all outline-none shadow-sm"
                        />
                        <FileText className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    </div>

                    <div className="flex items-center gap-4 shrink-0 px-2">
                        {/* Rating Pills */}
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-slate-100 dark:border-zinc-700">
                            <button
                                onClick={() => setReviewFilterRating('all')}
                                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                                    reviewFilterRating === 'all' ? 'bg-white dark:bg-zinc-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                All
                            </button>
                            {[5, 4, 3, 2, 1].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setReviewFilterRating(s)}
                                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                                        reviewFilterRating === s ? 'bg-white dark:bg-zinc-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {s} <Star className={`w-3.5 h-3.5 ${reviewFilterRating === s ? 'fill-amber-500 text-amber-500' : 'text-slate-400 dark:text-zinc-500'}`} />
                                </button>
                            ))}
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300 font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 p-2 rounded-xl transition-colors">
                            <input
                                type="checkbox"
                                checked={verifiedOnly}
                                onChange={(e) => setVerifiedOnly(e.target.checked)}
                                className="w-5 h-5 rounded-md text-blue-600 focus:ring-blue-500/30 border-slate-300 dark:border-zinc-600 dark:bg-zinc-800 transition"
                            />
                            <span>Verified</span>
                        </label>
                    </div>

                </div>

                {/* Reviews List */}
                {filteredReviews.length === 0 ? (
                  <div className="p-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800/80 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-10 h-10 text-slate-400 dark:text-zinc-500" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No reviews found</h4>
                    <p className="text-base text-slate-500 font-medium">Try adjusting your filters to see more results.</p>
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <AnimatedBorderCard
                      key={rev.id}
                      className="p-8 sm:p-10 relative"
                    >
                      {/* Decorative gradient blob */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
                        <div className="flex items-center gap-5">
                          <img
                            src={rev.reviewerAvatar}
                            alt={rev.reviewerName}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-zinc-800 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{rev.reviewerName}</h4>
                              {rev.isVerifiedPurchase && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-800/50">
                                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                  <span>Verified Buyer</span>
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-medium text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                              <span>{rev.reviewerLocation}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
                              <span>{rev.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-800/30 shadow-sm">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-zinc-700'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Body */}
                      <div className="space-y-4 mb-8 relative z-10">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{rev.title}</h3>
                        <p className="text-base text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
                          {rev.description}
                        </p>

                        {/* Translated text if requested */}
                        {translatedReviewIds[rev.id] && (
                          <div className="p-5 mt-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 text-sm font-medium text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 italic relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                            {translatedReviewIds[rev.id]}
                          </div>
                        )}
                      </div>

                      {/* Pros & Cons pills */}
                      {(rev.pros.length > 0 || rev.cons.length > 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm mb-8 relative z-10">
                          {rev.pros.length > 0 && (
                            <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-100">
                              <span className="font-black uppercase tracking-widest flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-400 text-xs">
                                <Plus className="w-4 h-4" /> Pros
                              </span>
                              <ul className="space-y-2">
                                {rev.pros.map((p, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 font-medium">
                                      <span className="text-emerald-500 mt-0.5 font-bold">•</span> {p}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {rev.cons.length > 0 && (
                            <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 text-rose-900 dark:text-rose-100">
                              <span className="font-black uppercase tracking-widest flex items-center gap-2 mb-3 text-rose-700 dark:text-rose-400 text-xs">
                                <AlertCircle className="w-4 h-4" /> Cons
                              </span>
                              <ul className="space-y-2">
                                {rev.cons.map((c, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 font-medium">
                                      <span className="text-rose-500 mt-0.5 font-bold">•</span> {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Verified Proof Banner */}
                      {rev.proof && (
                        <div className="p-4 mb-8 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 flex flex-wrap items-center justify-between text-sm text-slate-700 dark:text-zinc-300 gap-4 relative z-10">
                          <div className="flex items-center gap-3 font-medium">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span>Proof Verified: <strong className="text-slate-900 dark:text-white">{rev.proof.orderNumber || 'Invoice #8891'}</strong></span>
                          </div>
                          <span className="text-[11px] uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-black">Verified</span>
                        </div>
                      )}

                      {/* Official Business Reply */}
                      {rev.businessReply && (
                        <div className="mb-8 p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-sm space-y-3 relative overflow-hidden z-10">
                          <div className="absolute -bottom-4 -right-4 p-4 opacity-5 pointer-events-none">
                              <Building2 className="w-32 h-32" />
                          </div>
                          <div className="flex items-center justify-between relative z-10 mb-2">
                            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-zinc-700 flex items-center justify-center">
                                <Building2 className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-300" />
                              </div>
                              Reply from {rev.businessReply.authorName}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{rev.businessReply.createdAt}</span>
                          </div>
                          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed relative z-10 font-medium">
                            {rev.businessReply.content}
                          </p>
                        </div>
                      )}

                      {/* Review Actions Footer */}
                      <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between text-sm text-slate-500 dark:text-zinc-400 relative z-10 gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onVoteHelpful(rev.id, 'up')}
                            className="flex items-center gap-2 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl transition-all font-bold text-slate-600 dark:text-zinc-300 border border-transparent hover:border-blue-100 dark:hover:border-blue-800/50"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful ({rev.helpfulCount})</span>
                          </button>

                          <button
                            onClick={() => handleTranslateReview(rev.id)}
                            className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl transition-all font-bold"
                          >
                            <Languages className="w-4 h-4" />
                            <span>Translate</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReplyingReviewId(replyingReviewId === rev.id ? null : rev.id)}
                            className="hover:bg-slate-50 dark:hover:bg-zinc-800 px-4 py-2 rounded-xl transition-all font-bold"
                          >
                            Reply
                          </button>

                          <button
                            onClick={() => onFlagReview(rev.id)}
                            className="hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 p-2.5 rounded-xl transition-all"
                            title="Report review"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Reply Drawer */}
                      {replyingReviewId === rev.id && (
                        <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 space-y-4 relative z-10">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write an official response on behalf of the business..."
                            rows={3}
                            className="w-full p-4 text-sm font-medium rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-600 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none shadow-sm"
                          />
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setReplyingReviewId(null)}
                              className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-xl transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handlePostReply(rev.id)}
                              className="px-6 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                            >
                              Post Reply
                            </button>
                          </div>
                        </div>
                      )}

                    </AnimatedBorderCard>
                  ))
                )}

              </div>
            )}

            {/* TAB 2: AI REVIEW INSIGHTS */}
            {activeTab === 'ai_insights' && (
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="flex items-center gap-5 border-b border-slate-100 dark:border-zinc-800 pb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI Synthesis Report</h3>
                    <p className="text-base text-slate-500 font-medium mt-1">Real-time analysis extracted from all customer feedback</p>
                  </div>
                </div>

                {/* Overall Sentiment Box */}
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/80 text-base text-slate-700 dark:text-zinc-300 leading-relaxed relative overflow-hidden z-10 shadow-sm">
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                  <span className="font-black text-blue-600 uppercase tracking-widest text-xs block mb-3">Executive Summary</span>
                  <p className="text-lg font-medium">{business.aiSummary?.overallSentiment || 'Customer reviews reflect strong satisfaction with service reliability and team responsiveness. The overall sentiment indicates a highly positive experience across majority of the user base.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {/* Positive Highlights */}
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-8 rounded-2xl border border-emerald-100 dark:border-emerald-800/20">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-6 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                        Top Strengths
                    </h4>
                    <ul className="space-y-4 text-base">
                        {(business.aiSummary?.positiveHighlights || ['Fast response time', 'High reliability', 'Friendly staff']).map((item, idx) => (
                        <li key={idx} className="text-emerald-900 dark:text-emerald-100 flex items-start gap-3 font-medium">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                            <span className="pt-0.5">{item}</span>
                        </li>
                        ))}
                    </ul>
                    </div>

                    {/* Critical Points */}
                    <div className="bg-rose-50/50 dark:bg-rose-900/10 p-8 rounded-2xl border border-rose-100 dark:border-rose-800/20">
                    <h4 className="text-xs font-black uppercase tracking-widest text-rose-700 dark:text-rose-400 mb-6 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        Areas To Improve
                    </h4>
                    <ul className="space-y-4 text-base">
                        {(business.aiSummary?.criticalPoints || ['Pricing tiers for high bandwidth', 'Weekend support availability']).map((item, idx) => (
                        <li key={idx} className="text-rose-900 dark:text-rose-100 flex items-start gap-3 font-medium">
                            <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                            <span className="pt-0.5">{item}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>

              </div>
            )}

            {/* TAB 3: COMPETITOR BENCHMARK */}
            {activeTab === 'competitors' && (
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-10">
                
                <div className="border-b border-slate-100 dark:border-zinc-800 pb-8">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      AI Competitor Benchmark Tool
                  </h3>
                  <p className="text-base font-medium text-slate-500 mt-3 ml-15">Compare <strong className="text-slate-700 dark:text-zinc-300">{business.name}</strong> side-by-side with industry rivals to uncover market gaps.</p>
                </div>

                {/* Select rival */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm">
                  <select
                    value={selectedCompetitorId}
                    onChange={(e) => setSelectedCompetitorId(e.target.value)}
                    className="flex-1 p-4 text-base font-bold rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer transition-all"
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
                    className="px-8 py-4 text-sm font-black uppercase tracking-wider rounded-xl bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 disabled:opacity-50 transition-all shrink-0 shadow-md active:scale-95"
                  >
                    {isLoadingCompetitorReport ? 'Analyzing...' : 'Generate Benchmark'}
                  </button>
                </div>

                {/* Benchmark Output */}
                {competitorReport && (
                  <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-900/50 space-y-8 shadow-lg shadow-blue-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 dark:opacity-10 pointer-events-none"></div>

                    <h4 className="font-black text-slate-900 dark:text-white text-2xl border-b border-slate-100 dark:border-zinc-800 pb-6 relative z-10 flex items-center flex-wrap gap-4">
                      <span className="text-blue-600 dark:text-blue-400">{competitorReport.targetBusinessName}</span> 
                      <span className="text-slate-300 dark:text-zinc-600 text-lg uppercase px-3 py-1 bg-slate-50 dark:bg-zinc-800 rounded-lg">vs</span> 
                      <span className="text-slate-700 dark:text-zinc-300">{competitorReport.competitorName}</span>
                    </h4>
                    
                    <p className="text-slate-600 dark:text-zinc-300 font-medium leading-relaxed text-lg relative z-10">
                      {competitorReport.comparisonSummary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 relative z-10">
                      <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                        <span className="font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest text-xs block mb-5 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Key Advantages
                        </span>
                        <ul className="space-y-3 text-emerald-900 dark:text-emerald-100 font-medium">
                          {competitorReport.keyAdvantages.map((a, i) => <li key={i} className="flex gap-3"><span className="text-emerald-500 font-bold">•</span>{a}</li>)}
                        </ul>
                      </div>

                      <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                        <span className="font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest text-xs block mb-5 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Improvement Areas
                        </span>
                        <ul className="space-y-3 text-amber-900 dark:text-amber-100 font-medium">
                          {competitorReport.areasOfImprovement.map((a, i) => <li key={i} className="flex gap-3"><span className="text-amber-500 font-bold">•</span>{a}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 4: COMPANY INFO & PRODUCTS */}
            {activeTab === 'about' && (
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-5">About {business.name}</h3>
                  <p className="text-base font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">{business.description}</p>
                </div>

                {business.products && business.products.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4">Products & Services</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {business.products.map((p) => (
                        <div key={p.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-700 space-y-3 hover:shadow-md hover:border-slate-300 dark:hover:border-zinc-600 transition-all">
                          <div className="font-extrabold text-slate-900 dark:text-white flex justify-between items-start gap-4">
                            <span className="text-lg leading-tight">{p.name}</span>
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold text-sm px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap">{p.price}</span>
                          </div>
                          <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm leading-relaxed pt-1">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Sidebar: Category Breakdown & Company Metadata */}
          <div className="space-y-8 xl:sticky xl:top-24 h-max">
            
            {/* Category Ratings Breakdown */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6 sm:space-y-8">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                Category Ratings
              </h3>

              <div className="space-y-5 text-sm font-bold">
                {business.categoryAverages && Object.entries(business.categoryAverages).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-slate-700 dark:text-zinc-300 capitalize mb-2">
                      <span>{key}</span>
                      <span className="text-slate-900 dark:text-white font-black">{Number(val).toFixed(1)} <span className="text-slate-400 font-medium text-[11px]">/ 5.0</span></span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden relative">
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-500 dark:bg-blue-400 rounded-full"
                        style={{ width: `${((Number(val) || 0) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Contact & Hours */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-6 sm:space-y-8">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-blue-500" />
                </div>
                Contact & Details
              </h3>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 shrink-0 border border-slate-100 dark:border-zinc-700">
                    <Phone className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                </div>
                <div className="pt-0.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mb-0.5">Phone</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{business.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 shrink-0 border border-slate-100 dark:border-zinc-700">
                    <MapPin className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                </div>
                <div className="pt-0.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mb-0.5">Address</div>
                    <div className="text-sm font-medium leading-relaxed text-slate-900 dark:text-white">{business.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 shrink-0 border border-slate-100 dark:border-zinc-700">
                    <Clock className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                </div>
                <div className="pt-0.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mb-0.5">Opening Hours</div>
                    <div className="text-sm font-medium leading-relaxed text-slate-900 dark:text-white">{business.openingHours}</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
