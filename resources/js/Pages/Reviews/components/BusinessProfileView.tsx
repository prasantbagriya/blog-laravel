import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
  Star, ShieldCheck, CheckCircle2, Globe, Phone, MapPin, Clock, 
  MessageSquare, ThumbsUp, Sparkles, FileText, Building2, 
  TrendingUp, AlertCircle, Languages, Plus, ArrowLeft, Edit3, Share2,
  X, Link2, Search
} from 'lucide-react';
import { Business, Review, CompetitorComparison } from '../types';
import AnimatedBorderCard from '@/Components/AnimatedBorderCard';

interface BusinessProfileViewProps {
  business: Business;
  reviews: Review[];
  allBusinesses: Business[];
  onOpenWriteReview: (businessId: string) => void;
  onVoteHelpful: (reviewId: string, direction: 'up' | 'down') => void;
  onAddReply: (reviewId: string, replyText: string) => void;
}

const ShareModal = ({ isOpen, onClose, url, title }: { isOpen: boolean, onClose: () => void, url: string, title: string }) => {
  if (!isOpen) return null;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    { 
      name: 'WhatsApp', 
      icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>, 
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, 
      color: 'bg-[#25D366] text-white hover:bg-[#20bd5a]' 
    },
    { 
      name: 'Facebook', 
      icon: <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, 
      color: 'bg-[#1877F2] text-white hover:bg-[#166fe5]' 
    },
    { 
      name: 'Twitter', 
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, 
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, 
      color: 'bg-[#1DA1F2] text-white hover:bg-[#1a91da]' 
    },
    { 
      name: 'LinkedIn', 
      icon: <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, 
      color: 'bg-[#0A66C2] text-white hover:bg-[#0958a7]' 
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Share this profile</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {shareLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${link.color}`}>
                  {link.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">{link.name}</span>
              </a>
            ))}
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Link2 className="h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input type="text" readOnly value={url} className="block w-full pl-12 pr-24 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-amber-500" />
            <button onClick={handleCopy} className={`absolute inset-y-1.5 right-1.5 px-5 rounded-full font-extrabold text-xs transition-all active:scale-[0.98] ${copied ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20'}`}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  business, reviews, allBusinesses,
  onOpenWriteReview, onVoteHelpful, onAddReply,
}) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'ai_insights' | 'competitors' | 'about'>('reviews');
  const [reviewFilterRating, setReviewFilterRating] = useState<number | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('');
  const [competitorReport, setCompetitorReport] = useState<CompetitorComparison | null>(null);
  const [isLoadingCompetitorReport, setIsLoadingCompetitorReport] = useState(false);
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [translatedReviewIds, setTranslatedReviewIds] = useState<Record<string, string>>({});

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilterRating !== 'all' && r.rating !== reviewFilterRating) return false;
    if (verifiedOnly && !r.isVerifiedPurchase) return false;
    if (reviewSearchQuery.trim()) {
      const q = reviewSearchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.reviewerName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRunCompetitorComparison = async () => {
    if (!selectedCompetitorId) return;
    setIsLoadingCompetitorReport(true);
    try {
      const res = await fetch('/api/ai/competitor-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetBusinessId: business.id, competitorBusinessId: selectedCompetitorId })
      });
      const data = await res.json();
      setCompetitorReport(data);
    } catch (err) { console.error('Competitor report error:', err); }
    finally { setIsLoadingCompetitorReport(false); }
  };

  const handleTranslateReview = (reviewId: string) => {
    if (translatedReviewIds[reviewId]) {
      const newMap = { ...translatedReviewIds };
      delete newMap[reviewId];
      setTranslatedReviewIds(newMap);
    } else {
      setTranslatedReviewIds({ ...translatedReviewIds, [reviewId]: 'AI Translation (Hindi): "इस संस्थान के साथ हमारा अनुभव बहुत अच्छा रहा। सेवा तुरंत मिली और परिणाम हमारी उम्मीदों से बेहतर रहे।"' });
    }
  };

  const handlePostReply = (reviewId: string) => {
    if (replyText.trim()) {
      onAddReply(reviewId, replyText.trim());
      setReplyingReviewId(null);
      setReplyText('');
    }
  };

  const tabs = [
    { id: 'reviews',    label: 'Reviews',     icon: MessageSquare, color: 'blue',   count: business.reviewCount },
    { id: 'ai_insights',label: 'AI Insights', icon: Sparkles,      color: 'violet' },
    { id: 'competitors',label: 'Benchmark',   icon: TrendingUp,    color: 'emerald' },
    { id: 'about',      label: 'About',       icon: Building2,     color: 'amber' },
  ];

  const tabColors: Record<string, string> = {
    blue:    'bg-blue-500 text-white shadow-md shadow-blue-500/25',
    violet:  'bg-violet-500 text-white shadow-md shadow-violet-500/25',
    emerald: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25',
    amber:   'bg-amber-500 text-white shadow-md shadow-amber-500/25',
  };
  const tabInactiveColors: Record<string, string> = {
    blue:    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20',
    violet:  'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20',
    amber:   'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20',
  };

  const isOwner = Boolean(business.canEdit);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20 transition-colors font-sans">

      {/* ── HERO COVER ── */}
      <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden bg-zinc-900">
        <img src={business.coverImage} alt={business.name}
          className="w-full h-full object-cover opacity-50 scale-105 transition-transform duration-700 hover:scale-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-zinc-950 via-slate-900/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10">

        {/* ── PROFILE HEADER ── */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800 p-5 sm:p-8 mb-6 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 relative z-10">

            {/* Logo */}
            <div className="relative shrink-0">
              <img src={business.logo} alt={business.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white dark:border-zinc-800 shadow-xl relative z-10 bg-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{business.name}</h1>
                  {business.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenWriteReview(business.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all active:scale-95"
                  >
                    <Star className="w-4 h-4" /> Write Review
                  </button>
                  {isOwner && (
                    <Link
                      href={`/businesses/${business.slug || business.id}/edit`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                    >
                      <Edit3 className="w-4 h-4" /> Manage
                    </Link>
                  )}
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 leading-relaxed mb-4 max-w-2xl">{business.description}</p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {business.website && (
                  <a href={business.website} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                    <Globe className="w-3.5 h-3.5" /> Website
                  </a>
                )}
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                  <MapPin className="w-3.5 h-3.5" /> {business.city}, {business.country}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                  <Building2 className="w-3.5 h-3.5" /> {business.categoryName}
                </span>
              </div>
            </div>

            {/* Score Box */}
            <div className="flex sm:flex-col items-center gap-6 sm:gap-3 px-5 py-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 shrink-0 min-w-[130px] justify-center">
              <div className="text-center">
                <div className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                  {business.rating}
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mt-0.5">{business.reviewCount?.toLocaleString()} Reviews</div>
              </div>
              <div className="w-px sm:w-full h-8 sm:h-px bg-slate-200 dark:bg-zinc-700" />
              <div className="text-center">
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {business.trustScore}<span className="text-sm text-blue-400/60 ml-0.5">/100</span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1 justify-center">
                  <ShieldCheck className="w-3 h-3 text-blue-500" /> Trust Score
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── TAB NAVIGATION ── */}
        <div className="flex flex-nowrap overflow-x-auto gap-2 mb-6 hide-scrollbar pb-1 w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                activeTab === tab.id ? tabColors[tab.color] : tabInactiveColors[tab.color]
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.label}
              {tab.count ? <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-white/20' : 'bg-current/10'}`}>{tab.count}</span> : null}
            </button>
          ))}
        </div>

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Main Column */}
          <div className="xl:col-span-2 space-y-6">

            {/* TAB 1: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-5">

                {/* Filters */}
                <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center w-full">
                  <div className="flex-1 w-full relative group">
                    <AnimatedBorderCard 
                        containerClassName="w-full !rounded-full z-10" 
                        className="!rounded-full bg-white dark:bg-zinc-900 flex items-center p-0.5"
                        gradientColor="#f59e0b"
                    >
                        <Search className="text-slate-400 ml-3.5 mr-1.5 w-4 h-4 shrink-0" />
                        <input type="text" value={reviewSearchQuery} onChange={(e) => setReviewSearchQuery(e.target.value)}
                          placeholder="Search in reviews..."
                          className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 text-sm px-1 py-2" />
                    </AnimatedBorderCard>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    {(['all', 5, 4, 3, 2, 1] as const).map((s) => (
                      <button key={s} onClick={() => setReviewFilterRating(s)}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                          reviewFilterRating === s
                          ? 'bg-amber-500 border border-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 hover:border-amber-200 dark:hover:border-amber-800'
                        }`}>
                        {s === 'all' ? 'All' : <><span>{s}</span><Star className="w-3 h-3" /></>}
                      </button>
                    ))}
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer px-3.5 py-2 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                      <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 dark:border-zinc-600 focus:ring-0" />
                      Verified
                    </label>
                  </div>
                </div>

                {/* Review Cards */}
                {filteredReviews.length === 0 ? (
                  <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
                    <MessageSquare className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">No reviews found</h4>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm">Try adjusting your filters.</p>
                  </div>
                ) : filteredReviews.map((rev) => (
                  <AnimatedBorderCard key={rev.id} className="p-5 sm:p-7">

                    {/* Reviewer Header */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex items-center gap-4">
                        <img src={rev.reviewerAvatar} alt={rev.reviewerName}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100 dark:border-zinc-800 shadow-sm" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h4 className="font-extrabold text-slate-900 dark:text-white">{rev.reviewerName}</h4>
                            {rev.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase border border-blue-100 dark:border-blue-800/50">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                              </span>
                            )}
                          </div>
                            <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                              <span>{rev.reviewerLocation || 'Sikar, Rajasthan'}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700" />
                              <span>{Number.isNaN(new Date(rev.createdAt).getTime()) ? rev.createdAt : new Date(rev.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg shrink-0">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-zinc-700'}`} />
                        ))}
                      </div>
                    </div>

                    {/* Review Body */}
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{rev.title}</h3>
                    <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm mb-4">{rev.description}</p>

                    {translatedReviewIds[rev.id] && (
                      <div className="p-4 mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 text-sm text-blue-800 dark:text-blue-300 italic">{translatedReviewIds[rev.id]}</div>
                    )}

                    {/* Pros & Cons */}
                    {(rev.pros?.length > 0 || rev.cons?.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {rev.pros?.length > 0 && (
                          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1"><Plus className="w-3 h-3" /> Pros</span>
                            <ul className="space-y-1.5">{rev.pros.map((p, i) => <li key={i} className="text-xs text-emerald-900 dark:text-emerald-100 flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">•</span>{p}</li>)}</ul>
                          </div>
                        )}
                        {rev.cons?.length > 0 && (
                          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Cons</span>
                            <ul className="space-y-1.5">{rev.cons.map((c, i) => <li key={i} className="text-xs text-rose-900 dark:text-rose-100 flex items-start gap-2"><span className="text-rose-500 font-bold mt-0.5">•</span>{c}</li>)}</ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Proof */}
                    {rev.proof && (
                      <div className="flex items-center justify-between p-3 mb-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs">
                        <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-zinc-300"><FileText className="w-3.5 h-3.5 text-blue-500" /> {rev.proof.orderNumber || 'Invoice #8891'}</span>
                        <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-black uppercase tracking-wider text-[10px]">Verified</span>
                      </div>
                    )}

                    {/* Business Reply */}
                    {rev.businessReply && (
                      <div className="p-4 mb-4 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {rev.businessReply.authorName}</span>
                          <span className="text-[10px] font-bold text-slate-400">{rev.businessReply.createdAt}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">{rev.businessReply.content}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onVoteHelpful(rev.id, 'up')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all active:scale-[0.98]">
                          <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({rev.helpfulCount})
                        </button>
                        <button onClick={() => handleTranslateReview(rev.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]">
                          <Languages className="w-3.5 h-3.5" /> Translate
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOwner && (
                          <button onClick={() => setReplyingReviewId(replyingReviewId === rev.id ? null : rev.id)}
                            className="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]">
                            Reply
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reply Drawer */}
                    {isOwner && replyingReviewId === rev.id && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 space-y-3">
                        <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write an official response..." rows={3}
                          className="w-full p-3 text-sm rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-600 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all resize-none" />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setReplyingReviewId(null)}
                            className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-zinc-600 transition-colors">Cancel</button>
                          <button onClick={() => handlePostReply(rev.id)}
                            className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">Post Reply</button>
                        </div>
                      </div>
                    )}

                  </AnimatedBorderCard>
                ))}
              </div>
            )}

            {/* TAB 2: AI INSIGHTS */}
            {activeTab === 'ai_insights' && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Synthesis Report</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Real-time analysis from all customer feedback</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-violet-50 dark:bg-violet-900/10 border-l-4 border-violet-500">
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400 block mb-2">Executive Summary</span>
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300 leading-relaxed">{business.aiSummary?.overallSentiment || 'Customer reviews reflect strong satisfaction with service reliability and team responsiveness. The overall sentiment indicates a highly positive experience across the majority of the user base.'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" /> Top Strengths</h4>
                    <ul className="space-y-2.5">{(business.aiSummary?.positiveHighlights || ['Fast response time', 'High reliability', 'Friendly staff']).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-emerald-900 dark:text-emerald-100 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}</ul>
                  </div>
                  <div className="p-5 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Areas To Improve</h4>
                    <ul className="space-y-2.5">{(business.aiSummary?.criticalPoints || ['Pricing tiers', 'Weekend support']).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-rose-900 dark:text-rose-100 font-medium">
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}</ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COMPETITOR */}
            {activeTab === 'competitors' && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Competitor Benchmark</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mt-0.5">Compare <strong className="text-slate-700 dark:text-zinc-300">{business.name}</strong> with industry rivals</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select value={selectedCompetitorId} onChange={(e) => setSelectedCompetitorId(e.target.value)}
                    className="flex-1 p-3 text-sm font-bold rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all cursor-pointer">
                    <option value="">-- Select Competitor --</option>
                    {allBusinesses.filter((b) => b.id !== business.id).map((b) => (
                      <option key={b.id} value={b.id}>{b.name} (Trust: {b.trustScore}/100)</option>
                    ))}
                  </select>
                  <button onClick={handleRunCompetitorComparison} disabled={!selectedCompetitorId || isLoadingCompetitorReport}
                    className="px-6 py-3 text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-emerald-500/25 shrink-0">
                    {isLoadingCompetitorReport ? 'Analyzing...' : 'Generate Benchmark'}
                  </button>
                </div>

                {competitorReport && (
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-blue-100 dark:border-blue-900/30 space-y-5">
                    <h4 className="font-black text-slate-900 dark:text-white flex flex-wrap items-center gap-3">
                      <span className="text-blue-600 dark:text-blue-400">{competitorReport.targetBusinessName}</span>
                      <span className="text-slate-400 dark:text-zinc-500 text-sm">vs</span>
                      <span className="text-slate-700 dark:text-zinc-300">{competitorReport.competitorName}</span>
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">{competitorReport.comparisonSummary}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Key Advantages</span>
                        <ul className="space-y-2">{competitorReport.keyAdvantages.map((a, i) => <li key={i} className="text-xs text-emerald-900 dark:text-emerald-100 flex gap-2 font-medium"><span className="text-emerald-500">•</span>{a}</li>)}</ul>
                      </div>
                      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Improvement Areas</span>
                        <ul className="space-y-2">{competitorReport.areasOfImprovement.map((a, i) => <li key={i} className="text-xs text-amber-900 dark:text-amber-100 flex gap-2 font-medium"><span className="text-amber-500">•</span>{a}</li>)}</ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ABOUT */}
            {activeTab === 'about' && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">About {business.name}</h3>
                {(business.detailedDescription || business.detailed_description) ? (
                  <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: business.detailedDescription || business.detailed_description }} />
                ) : (
                  <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{business.description}</p>
                )}
                {business.products && business.products.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-4 pb-3 border-b border-slate-100 dark:border-zinc-800">Products & Services</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {business.products.map((p) => (
                        <div key={p.id} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 hover:border-amber-200 dark:hover:border-amber-800/30 transition-colors">
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</span>
                            <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg whitespace-nowrap">{p.price}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


              </div>
            )}

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5 xl:sticky xl:top-24 h-max">

            {/* Rating Breakdown */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </div>
                Category Ratings
              </h3>
              <div className="space-y-3">
                {business.categoryAverages && Object.entries(business.categoryAverages).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-zinc-300 capitalize mb-1.5">
                      <span>{key}</span>
                      <span className="text-slate-900 dark:text-white">{Number(val).toFixed(1)}<span className="text-slate-400 font-medium"> /5</span></span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${((Number(val) || 0) / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                </div>
                Contact & Details
              </h3>
              {[
                { icon: Phone, label: 'Phone', value: business.phone, color: 'text-green-500' },
                { icon: MapPin, label: 'Address', value: business.address, color: 'text-rose-500' },
                { icon: Clock, label: 'Hours', value: business.openingHours || business.opening_hours, color: 'text-amber-500' },
              ].filter(item => item.value).map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 flex items-center justify-center shrink-0">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-bold mb-0.5">{label}</div>
                    <div className="text-xs font-medium text-slate-900 dark:text-white leading-relaxed">{value}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        url={typeof window !== 'undefined' ? window.location.href : `https://coachingsinsikar.com/business/${business.slug || business.id}`}
        title={business.name}
      />
    </div>
  );
};
