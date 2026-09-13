import React, { useState } from 'react';
import { X, Code2, Sparkles, Copy, Check, Terminal } from 'lucide-react';

interface ApiDocsModalProps {
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'ai_sentiment' | 'trust_score'>('reviews');
  const [copied, setCopied] = useState(false);

  const getCodeSnippet = () => {
    if (activeTab === 'reviews') {
      return `// Fetch Verified Reviews for a Business
const response = await fetch('https://trustpulse.ai/api/businesses/aether-cloud/reviews', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const reviews = await response.json();
console.log(reviews);`;
    } else if (activeTab === 'ai_sentiment') {
      return `// Run Server-Side Gemini Review Analysis
const response = await fetch('https://trustpulse.ai/api/ai/analyze-review', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Migrated 12 microservices in under 4 hours',
    description: 'We switched our workload and latency dropped from 140ms to 18ms.',
    rating: 5,
    businessName: 'Aether Cloud Engine'
  })
});
const result = await response.json();
// Returns { sentiment, aiFraudScore, fraudRiskLevel, extractedPros, extractedCons }`;
    } else {
      return `// Verify Trust Score & Badges for an Order Number
const response = await fetch('https://trustpulse.ai/api/businesses/verify-invoice', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    businessSlug: 'aether-cloud',
    orderNumber: 'INV-AETHER-2026-8891'
  })
});
const verification = await response.json();`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-sm bg-blue-100 text-blue-600 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">TrustPulse REST & AI API Documentation</h2>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Integrate verified reviews, fraud scores, and badges into your platform</p>
            </div>
          </div>

          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-1 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-sm transition ${
              activeTab === 'reviews' ? 'bg-blue-600 text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            GET /api/reviews
          </button>

          <button
            onClick={() => setActiveTab('ai_sentiment')}
            className={`px-3.5 py-2 rounded-sm transition flex items-center gap-1.5 ${
              activeTab === 'ai_sentiment' ? 'bg-blue-600 text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            POST /api/ai/analyze-review
          </button>

          <button
            onClick={() => setActiveTab('trust_score')}
            className={`px-3.5 py-2 rounded-sm transition ${
              activeTab === 'trust_score' ? 'bg-blue-600 text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            POST /api/verify-invoice
          </button>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">cURL / JavaScript SDK Example</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-mono font-bold rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 text-zinc-900 dark:text-zinc-100 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-sm bg-zinc-900 text-blue-400 text-xs font-mono overflow-x-auto border border-zinc-800 leading-relaxed">
            {getCodeSnippet()}
          </pre>
        </div>

      </div>
    </div>
  );
};
