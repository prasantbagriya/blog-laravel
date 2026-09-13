import React, { useState } from 'react';
import { X, Search, Sparkles, Star, ExternalLink, ArrowRight } from 'lucide-react';
import { Business } from '../types';

interface AiSearchModalProps {
  onClose: () => void;
  onSelectBusiness: (slug: string) => void;
}

export const AiSearchModal: React.FC<AiSearchModalProps> = ({ onClose, onSelectBusiness }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ matches: Business[]; aiRecommendation: string } | null>(null);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch('/api/ai/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Semantic search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] rounded-md shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E1] dark:border-[#2A2A28]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-sm bg-[#E6EEFF] text-[#0052FF] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1A1A1A] dark:text-white">Gemini Semantic AI Search</h2>
              <p className="text-xs font-mono text-[#555555] dark:text-[#A0A09C]">Ask in natural language to find verified businesses</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-[#999999] hover:text-[#1A1A1A] dark:hover:text-white rounded-sm hover:bg-[#F5F5F2] dark:hover:bg-[#20201F] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'Find me the best AI tool for coding with top support'..."
              className="w-full p-3.5 pl-10 text-xs font-medium rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
            />
            <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-4" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#555555] dark:text-[#A0A09C]">
            <span className="font-mono">Try: "Fast cloud VPS with high uptime" or "Best hospitals in Boston"</span>
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="px-4 py-2 font-bold rounded-sm bg-[#0052FF] text-white hover:bg-[#0040D0] disabled:opacity-50 transition"
            >
              {isSearching ? 'Analyzing...' : 'Ask AI'}
            </button>
          </div>
        </form>

        {/* Search Results Output */}
        {results && (
          <div className="space-y-4 pt-2 border-t border-[#E5E5E1] dark:border-[#2A2A28]">
            <div className="p-4 rounded-sm bg-[#E6EEFF] dark:bg-[#0052FF]/20 border border-[#0052FF]/30 text-xs text-[#0052FF] dark:text-[#80B0FF]">
              <span className="font-bold font-mono block mb-1">AI Recommendation Insight:</span>
              <p className="leading-relaxed text-[#1A1A1A] dark:text-[#F5F5F2]">{results.aiRecommendation}</p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-[#999999] uppercase tracking-widest block">Matching Verified Businesses</span>
              {results.matches.map((biz) => (
                <div
                  key={biz.id}
                  onClick={() => {
                    onSelectBusiness(biz.slug);
                    onClose();
                  }}
                  className="p-4 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] hover:bg-[#E6EEFF]/50 dark:hover:bg-[#0052FF]/10 border border-[#E5E5E1] dark:border-[#2A2A28] cursor-pointer transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={biz.logo} alt={biz.name} className="w-10 h-10 rounded-xs object-cover border border-[#E5E5E1] dark:border-[#2A2A28]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white">{biz.name}</h4>
                      <p className="text-[11px] text-[#555555] dark:text-[#A0A09C]">{biz.categoryName} • {biz.city}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold font-mono text-[#0052FF]">{biz.trustScore}/100</div>
                    <div className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5 justify-end">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {biz.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
