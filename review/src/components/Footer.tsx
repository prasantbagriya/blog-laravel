import React from 'react';
import { ShieldCheck, Sparkles, Globe, Heart, Lock, Award, Cpu } from 'lucide-react';

interface FooterProps {
  onOpenApiDocs: () => void;
  onSelectCategory: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApiDocs, onSelectCategory }) => {
  return (
    <footer className="border-t border-[#E5E5E1] dark:border-[#2A2A28] bg-[#FDFCFB] dark:bg-[#0F0F0E] text-[#555555] dark:text-[#A0A09C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Top Guarantee Banner */}
        <div className="mb-12 p-6 rounded-md bg-[#F5F5F2] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] border-l-4 border-l-[#0052FF] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-md bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-white uppercase tracking-widest">100% Verified Purchases</h4>
              <p className="text-xs text-[#555555] dark:text-[#A0A09C] mt-1">
                Reviews are linked to verified invoices and order receipts to eliminate fake feedback.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-md bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF] flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-white uppercase tracking-widest">AI Fraud Detection</h4>
              <p className="text-xs text-[#555555] dark:text-[#A0A09C] mt-1">
                Real-time Gemini AI engine scans device fingerprints and behavioral markers to block bot spam.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-md bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-white uppercase tracking-widest">0-100 Trust Score Standard</h4>
              <p className="text-xs text-[#555555] dark:text-[#A0A09C] mt-1">
                Transparent mathematical score combining verified reviews, freshness, and business response rates.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#E5E5E1] dark:border-[#2A2A28]">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#0052FF] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-editorial-serif italic font-bold text-xl text-[#1A1A1A] dark:text-white">TrustPulse AI</span>
            </div>
            <p className="text-xs text-[#555555] dark:text-[#A0A09C] leading-relaxed max-w-sm">
              The next-generation AI reputation intelligence platform empowering millions of consumers to discover verified businesses and helping companies build authentic trust.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={onOpenApiDocs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#F5F5F2] dark:bg-[#2A2A28] hover:bg-[#E6EEFF] hover:text-[#0052FF] text-[#1A1A1A] dark:text-[#F5F5F2] transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0052FF]" />
                <span>API & Developer Docs</span>
              </button>
            </div>
          </div>

          {/* Business Categories */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white mb-4">Top Directories</h5>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onSelectCategory('saas')} className="hover:text-[#0052FF] transition">SaaS & Cloud</button></li>
              <li><button onClick={() => onSelectCategory('ai-tools')} className="hover:text-[#0052FF] transition">AI Tools & Models</button></li>
              <li><button onClick={() => onSelectCategory('finance')} className="hover:text-[#0052FF] transition">Fintech & Banking</button></li>
              <li><button onClick={() => onSelectCategory('hospitals')} className="hover:text-[#0052FF] transition">Hospitals & Health</button></li>
              <li><button onClick={() => onSelectCategory('hosting')} className="hover:text-[#0052FF] transition">Web Hosting</button></li>
            </ul>
          </div>

          {/* Businesses Solutions */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white mb-4">For Businesses</h5>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#dashboard" className="hover:text-[#0052FF] transition">Claim Business Page</a></li>
              <li><a href="#widgets" className="hover:text-[#0052FF] transition">Embeddable Widgets</a></li>
              <li><a href="#campaigns" className="hover:text-[#0052FF] transition">QR & Review Invites</a></li>
              <li><a href="#pricing" className="hover:text-[#0052FF] transition">Plans & Pricing</a></li>
              <li><a href="#auto-reply" className="hover:text-[#0052FF] transition">AI Auto-Reply Suite</a></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white mb-4">Trust & Safety</h5>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#guidelines" className="hover:text-[#0052FF] transition">Review Guidelines</a></li>
              <li><a href="#moderation" className="hover:text-[#0052FF] transition">Fraud Detection Standard</a></li>
              <li><a href="#privacy" className="hover:text-[#0052FF] transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-[#0052FF] transition">Terms of Service</a></li>
              <li><a href="#transparency" className="hover:text-[#0052FF] transition">Transparency Index</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#999999] font-mono">
          <div className="flex items-center gap-2">
            <span>© 2026 TrustPulse AI Platform Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#0052FF]" /> Global (EN)
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#0052FF]" /> SSL Encrypted
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
