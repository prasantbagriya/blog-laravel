import React from 'react';
import { ShieldCheck, Sparkles, Globe, Heart, Lock, Award, Cpu } from 'lucide-react';

interface FooterProps {
  onOpenApiDocs: () => void;
  onSelectCategory: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApiDocs, onSelectCategory }) => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Top Guarantee Banner */}
        <div className="mb-12 p-6 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-l-4 border-l-blue-600 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-widest">100% Verified Purchases</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Reviews are linked to verified invoices and order receipts to eliminate fake feedback.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-widest">AI Fraud Detection</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Real-time Gemini AI engine scans device fingerprints and behavioral markers to block bot spam.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-widest">0-100 Trust Score Standard</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Transparent mathematical score combining verified reviews, freshness, and business response rates.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-zinc-200 dark:border-zinc-800">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-editorial-serif italic font-bold text-xl text-zinc-900 dark:text-white">TrustPulse AI</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              The next-generation AI reputation intelligence platform empowering millions of consumers to discover verified businesses and helping companies build authentic trust.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={onOpenApiDocs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-100 hover:text-blue-600 text-zinc-900 dark:text-zinc-100 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>API & Developer Docs</span>
              </button>
            </div>
          </div>

          {/* Business Categories */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-4">Top Directories</h5>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onSelectCategory('saas')} className="hover:text-blue-600 transition">SaaS & Cloud</button></li>
              <li><button onClick={() => onSelectCategory('ai-tools')} className="hover:text-blue-600 transition">AI Tools & Models</button></li>
              <li><button onClick={() => onSelectCategory('finance')} className="hover:text-blue-600 transition">Fintech & Banking</button></li>
              <li><button onClick={() => onSelectCategory('hospitals')} className="hover:text-blue-600 transition">Hospitals & Health</button></li>
              <li><button onClick={() => onSelectCategory('hosting')} className="hover:text-blue-600 transition">Web Hosting</button></li>
            </ul>
          </div>

          {/* Businesses Solutions */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-4">For Businesses</h5>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#dashboard" className="hover:text-blue-600 transition">Claim Business Page</a></li>
              <li><a href="#widgets" className="hover:text-blue-600 transition">Embeddable Widgets</a></li>
              <li><a href="#campaigns" className="hover:text-blue-600 transition">QR & Review Invites</a></li>
              <li><a href="#pricing" className="hover:text-blue-600 transition">Plans & Pricing</a></li>
              <li><a href="#auto-reply" className="hover:text-blue-600 transition">AI Auto-Reply Suite</a></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-4">Trust & Safety</h5>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#guidelines" className="hover:text-blue-600 transition">Review Guidelines</a></li>
              <li><a href="#moderation" className="hover:text-blue-600 transition">Fraud Detection Standard</a></li>
              <li><a href="#privacy" className="hover:text-blue-600 transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-blue-600 transition">Terms of Service</a></li>
              <li><a href="#transparency" className="hover:text-blue-600 transition">Transparency Index</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span>© 2026 TrustPulse AI Platform Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-600" /> Global (EN)
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-600" /> SSL Encrypted
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
