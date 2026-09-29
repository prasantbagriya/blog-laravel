import React, { useState } from 'react';
import { Search, Sparkles, ShieldCheck, ArrowRight, Star, TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import { Category, Business } from '../types';

interface HeroSectionProps {
  onSearchSubmit: (query: string) => void;
  onOpenAiAssistant: () => void;
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  trendingBusinesses: Business[];
  onSelectBusiness: (slug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchSubmit,
  onOpenAiAssistant,
  categories,
  onSelectCategory,
  trendingBusinesses,
  onSelectBusiness,
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] dark:bg-[#0F0F0E] pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#E5E5E1] dark:border-[#2A2A28]">
      
      {/* Decorative Subtle Line Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a08_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Top Editorial Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF] text-xs font-mono font-bold tracking-wide border-l-4 border-[#0052FF]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF]" />
            <span className="uppercase tracking-widest text-[11px]">Editorial Reputation Intelligence Platform</span>
          </div>

          {/* Main Title - Serif Italic Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1A1A] dark:text-white leading-[1.1]">
            Read Reviews.{' '}
            <span className="font-editorial-serif italic font-normal text-[#0052FF] underline decoration-1 underline-offset-8">
              Trust What You Buy.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#555555] dark:text-[#A0A09C] leading-relaxed max-w-2xl mx-auto font-normal">
            Discover 10M+ verified companies evaluated by real customer invoices, AI fraud detection, and 0–100 Trust Scores.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex items-center p-2 rounded-md bg-[#F5F5F2] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] shadow-sm focus-within:border-[#0052FF] transition-all">
              <Search className="w-5 h-5 text-[#0052FF] ml-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search company, category, or ask AI... e.g. 'Aether Cloud'"
                className="w-full px-3 py-2 text-sm text-[#1A1A1A] dark:text-[#F5F5F2] bg-transparent focus:outline-none placeholder:text-[#999999]"
              />
              <div className="flex items-center gap-2 pr-1">
                <button
                  type="button"
                  onClick={onOpenAiAssistant}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md bg-white dark:bg-[#2A2A28] text-[#0052FF] border border-[#E5E5E1] dark:border-[#3A3A38] hover:bg-[#E6EEFF] transition shrink-0"
                  title="Ask AI Search Assistant"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0052FF]" />
                  <span>AI Ask</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold rounded-md bg-[#0052FF] hover:bg-[#0040D0] text-white shadow-xs active:scale-95 transition-all shrink-0"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Quick Categories Quick-Chips */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-[#999999] dark:text-[#777773] mr-1">Trending:</span>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="px-3 py-1 rounded-sm bg-white dark:bg-[#161615] hover:border-[#0052FF] border border-[#E5E5E1] dark:border-[#2A2A28] text-xs font-medium text-[#1A1A1A] dark:text-[#F5F5F2] transition"
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>

        {/* Live Key Stats Counter */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-md bg-[#F5F5F2] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white flex items-center justify-center gap-1">
              <span>100M+</span>
              <CheckCircle2 className="w-4 h-4 text-[#0052FF]" />
            </div>
            <div className="text-[11px] font-mono uppercase text-[#555555] dark:text-[#A0A09C] mt-0.5">Verified Reviews</div>
          </div>

          <div className="p-4 rounded-md bg-[#F5F5F2] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white flex items-center justify-center gap-1">
              <span>10M+</span>
              <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
            </div>
            <div className="text-[11px] font-mono uppercase text-[#555555] dark:text-[#A0A09C] mt-0.5">Listed Businesses</div>
          </div>

          <div className="p-4 rounded-md bg-[#F5F5F2] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white flex items-center justify-center gap-1">
              <span>99.8%</span>
              <Zap className="w-4 h-4 text-[#0052FF]" />
            </div>
            <div className="text-[11px] font-mono uppercase text-[#555555] dark:text-[#A0A09C] mt-0.5">AI Fraud Precision</div>
          </div>

          <div className="p-4 rounded-md bg-[#F5F5F2] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white flex items-center justify-center gap-1">
              <span>0 - 100</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-[11px] font-mono uppercase text-[#555555] dark:text-[#A0A09C] mt-0.5">Trust Score Engine</div>
          </div>
        </div>

        {/* Trending Top Businesses Ticker */}
        <div className="mt-12 pt-8 border-t border-[#E5E5E1] dark:border-[#2A2A28]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 border-l-3 border-[#0052FF] pl-2">
              <TrendingUp className="w-4 h-4 text-[#0052FF]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-[#F5F5F2]">
                Trending High Trust Companies
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingBusinesses.slice(0, 3).map((biz) => (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz.slug)}
                className="group p-4 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] hover:border-[#0052FF] transition cursor-pointer flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={biz.logo}
                    alt={biz.name}
                    className="w-10 h-10 rounded-sm object-cover border border-[#E5E5E1] dark:border-[#2A2A28] shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white truncate group-hover:text-[#0052FF] transition">
                      {biz.name}
                    </h4>
                    <p className="text-[11px] text-[#555555] dark:text-[#A0A09C] truncate mt-0.5 font-mono">
                      {biz.categoryName}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF] text-xs font-mono font-bold">
                    <span>{biz.trustScore}</span>
                    <span className="text-[10px] opacity-70">/100</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 justify-end mt-1">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span className="font-bold text-[#1A1A1A] dark:text-[#F5F5F2]">{biz.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
