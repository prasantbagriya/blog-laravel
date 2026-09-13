import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
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
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
    }
  };

  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden bg-slate-900">
      {/* Background Image & Tint */}
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')` }}></div>
      <div className="absolute inset-0 z-0 bg-slate-900/85"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="text-center w-full">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold tracking-wide border border-blue-500/30">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="uppercase tracking-widest">Editorial Reputation Intelligence Platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold leading-[1.05] text-white tracking-tight mt-4">
            Read Reviews. <br className="hidden sm:block" />
            <span className="text-blue-400">Trust What You Buy.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
            Discover 10M+ verified companies evaluated by real customer invoices, AI fraud detection, and 0–100 Trust Scores.
          </p>

          <form onSubmit={handleSearch} className="pt-6 pb-2 max-w-3xl mx-auto relative">
             <div className="relative flex items-center gap-2 rounded-full bg-white p-2 shadow-lg w-full z-20">
               <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
               <input
                 type="text"
                 value={query}
                 onChange={(e) => {
                   setQuery(e.target.value);
                   setShowSuggestions(true);
                 }}
                 onFocus={() => setShowSuggestions(true)}
                 onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                 placeholder="Search company, category, or ask AI... e.g. 'Aether Cloud'"
                 className="flex-1 border-0 outline-none focus:ring-0 text-slate-900 text-sm md:text-base py-2.5 bg-transparent placeholder-slate-400 px-2"
               />
               
               <button
                  type="button"
                  onClick={onOpenAiAssistant}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-500/20 transition shrink-0 border border-pink-400 dark:border-pink-500/60 hover:border-pink-500 outline-none ring-0 shadow-sm shadow-pink-200 dark:shadow-pink-500/10"
                >
                  <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                  <span>Ask AI</span>
                </button>

               <button
                 type="submit"
                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-8 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none ring-0 focus:ring-0"
               >
                 Search
               </button>
             </div>

             {/* Search Suggestions Dropdown */}
             {showSuggestions && query.trim().length > 0 && (
                <div className="absolute top-[calc(100%-0.5rem)] left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-100 max-h-[300px] overflow-y-auto text-left">
                    {(() => {
                        const filteredBiz = (trendingBusinesses || []).filter(b => b.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4);
                        const filteredCat = (categories || []).filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 2);
                        
                        if (filteredBiz.length === 0 && filteredCat.length === 0) {
                            return <div className="p-4 text-center text-slate-500 text-sm">No results found for "{query}"</div>;
                        }
                        
                        const basePath = typeof window !== 'undefined' && (window as any).BASE_PATH ? (window as any).BASE_PATH : '';
                        
                        return (
                            <div className="py-2">
                                {filteredCat.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</div>
                                        {filteredCat.map(cat => (
                                            <Link 
                                                key={`cat-${cat.id}`} 
                                                href={`${basePath}/reviews/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><TrendingUp size={16} /></div>
                                                <span className="font-medium text-slate-800">{cat.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                
                                {filteredBiz.length > 0 && (
                                    <div>
                                        <div className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Institutes</div>
                                        {filteredBiz.map(biz => (
                                            <Link 
                                                key={`biz-${biz.id}`} 
                                                href={`${basePath}/reviews/${biz.category || 'coaching-institutes'}/${biz.slug}`}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200">
                                                    <img src={biz.logo || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={biz.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-800">{biz.name}</span>
                                                    <span className="text-xs text-slate-500">{biz.categoryName || biz.category}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
             )}
          </form>

          {/* Quick Categories */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase text-white/50 mr-1 tracking-wider">Trending:</span>
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-xs font-semibold border-none outline-none focus:outline-none ring-0"
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Main Action Buttons */}
          <div className="pt-8 flex flex-wrap justify-center gap-3">
              <Link href={`${typeof window !== 'undefined' && (window as any).BASE_PATH ? (window as any).BASE_PATH : ''}/reviews`} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-3 rounded-md transition-colors text-center inline-flex items-center justify-center">
                  Explore Institutes
              </Link>
              <Link href={`${typeof window !== 'undefined' && (window as any).BASE_PATH ? (window as any).BASE_PATH : ''}/blog`} className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors text-center inline-flex items-center justify-center">
                  Browse Articles
              </Link>
          </div>
        </div>

        {/* Live Key Stats Counter */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center transform transition-transform hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
              <span>100M+</span>
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-white/60 mt-2">Verified Reviews</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center transform transition-transform hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
              <span>10M+</span>
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-white/60 mt-2">Listed Businesses</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center transform transition-transform hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
              <span>99.8%</span>
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-white/60 mt-2">AI Fraud Precision</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center transform transition-transform hover:-translate-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
              <span>0 - 100</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-white/60 mt-2">Trust Score Engine</div>
          </div>
        </div>

        {/* Trending Top Businesses Ticker */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/90">
              Trending High Trust Companies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingBusinesses.slice(0, 3).map((biz) => (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz.slug)}
                className="group p-4 rounded-xl bg-white/10 border border-white/10 hover:border-blue-500/50 hover:bg-white/15 backdrop-blur-sm transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xl"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={biz.logo}
                    alt={biz.name}
                    className="w-12 h-12 rounded-lg object-cover bg-white p-0.5 shrink-0"
                  />
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-300 transition">
                      {biz.name}
                    </h4>
                    <p className="text-[11px] text-white/60 truncate mt-0.5 uppercase tracking-wide">
                      {biz.categoryName}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-bold">
                    <span>{biz.trustScore}</span>
                    <span className="text-[10px] opacity-70">/100</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 justify-end mt-1.5 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{biz.rating}</span>
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
