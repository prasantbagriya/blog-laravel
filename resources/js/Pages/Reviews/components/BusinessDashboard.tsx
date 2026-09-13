import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Sparkles, 
  QrCode, 
  Mail, 
  Send, 
  Copy, 
  Code2, 
  Check, 
  Building2, 
  MessageSquare, 
  Award, 
  RefreshCw,
  Zap,
  Star
} from 'lucide-react';
import { Business, Review, ReviewCampaign, EmbedWidgetConfig } from '../types';

interface BusinessDashboardProps {
  business: Business;
  reviews: Review[];
  campaigns: ReviewCampaign[];
  allBusinesses: Business[];
  onAddReply: (reviewId: string, replyText: string) => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  business,
  reviews,
  campaigns,
  allBusinesses,
  onAddReply,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai_reply' | 'campaigns' | 'widgets' | 'benchmark'>('overview');

  // AI Auto-reply state
  const [selectedReviewIdForReply, setSelectedReviewIdForReply] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState('Professional & Empathetic');
  const [generatedAiReply, setGeneratedAiReply] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  // Widget config state
  const [widgetConfig, setWidgetConfig] = useState<EmbedWidgetConfig>({
    theme: 'light',
    style: 'badge_horizontal',
    showTrustScore: true,
    showStarRating: true,
    primaryColor: '#0052FF',
    badgeRadius: 'md',
  });
  const [copiedCode, setCopiedCode] = useState(false);

  // Unreplied reviews
  const unrepliedReviews = reviews.filter((r) => r.businessId === business.id && !r.businessReply);

  // Handle AI Auto-Reply Generation
  const handleGenerateAiReply = async () => {
    const rev = reviews.find((r) => r.id === selectedReviewIdForReply);
    if (!rev) return;

    setIsGeneratingReply(true);
    try {
      const res = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewTitle: rev.title,
          reviewDescription: rev.description,
          rating: rev.rating,
          tone: selectedTone,
          businessName: business.name,
        }),
      });
      const data = await res.json();
      setGeneratedAiReply(data.reply || '');
    } catch (err) {
      console.error('Error generating AI reply:', err);
    } finally {
      setIsGeneratingReply(false);
    }
  };

  const handlePostGeneratedReply = () => {
    if (selectedReviewIdForReply && generatedAiReply.trim()) {
      onAddReply(selectedReviewIdForReply, generatedAiReply.trim());
      setGeneratedAiReply('');
      setSelectedReviewIdForReply('');
    }
  };

  const getEmbedCode = () => {
    return `<iframe src="https://trustpulse.ai/embed/widget?business=${business.slug}&style=${widgetConfig.style}&theme=${widgetConfig.theme}" width="360" height="120" frameborder="0" scrolling="no"></iframe>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <img
              src={business.logo}
              alt={business.name}
              className="w-14 h-14 rounded-xs object-cover border border-zinc-200 dark:border-zinc-800"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{business.name} Suite</h1>
                <span className="px-2 py-0.5 rounded-2xs bg-blue-100 text-blue-600 text-xs font-mono font-bold border border-blue-600/20">
                  Pro Owner Hub
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Manage reviews, automate responses, collect feedback, and embed badges.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 text-center">
              <div className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">{business.trustScore}/100</div>
              <div className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">Trust Score</div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Executive Analytics', icon: BarChart3 },
            { id: 'ai_reply', label: 'AI Auto-Reply Studio', icon: Sparkles, badge: unrepliedReviews.length },
            { id: 'campaigns', label: 'QR & Review Requests', icon: QrCode },
            { id: 'widgets', label: 'Embeddable Badges', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold rounded-sm transition shrink-0 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-2xs bg-rose-600 text-white text-[10px]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: EXECUTIVE ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Total Reviews</span>
                <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">{business.reviewCount}</div>
                <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
                </div>
              </div>

              <div className="p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Trust Score Index</span>
                <div className="text-2xl font-bold font-mono text-blue-600">{business.trustScore}/100</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Top 5% in {business.categoryName}</div>
              </div>

              <div className="p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Response Rate</span>
                <div className="text-2xl font-bold font-mono text-blue-600">96.2%</div>
                <div className="text-[11px] text-blue-600 font-semibold">Avg reply under 1.2 hours</div>
              </div>

              <div className="p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Profile Visitors</span>
                <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">18,420</div>
                <div className="text-[11px] text-blue-600 font-semibold">+12% traffic conversion</div>
              </div>
            </div>

            {/* AI Sentiment Analysis Overview */}
            <div className="p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">AI Sentiment Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 text-blue-600 dark:text-blue-400">
                  <span className="font-bold font-mono block text-sm">88% Positive</span>
                  <p className="mt-1 text-zinc-900 dark:text-zinc-100">Praised for latency speed, customer support response, and pricing clarity.</p>
                </div>

                <div className="p-4 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                  <span className="font-bold font-mono block text-sm">9% Neutral</span>
                  <p className="mt-1 text-zinc-900 dark:text-zinc-100">Suggestions regarding deeper C++ SDK documentation examples.</p>
                </div>

                <div className="p-4 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                  <span className="font-bold font-mono block text-sm">3% Critical</span>
                  <p className="mt-1 text-zinc-900 dark:text-zinc-100">Minor concerns regarding bandwidth overage fee caps.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: AI AUTO-REPLY STUDIO */}
        {activeTab === 'ai_reply' && (
          <div className="p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-blue-100 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Gemini AI Auto-Reply Generator</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Draft customized, empathetic executive replies in 1 click.</p>
              </div>
            </div>

            {unrepliedReviews.length === 0 ? (
              <div className="p-8 text-center bg-zinc-100 dark:bg-zinc-800 rounded-sm border border-zinc-200 dark:border-zinc-800">
                <Check className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">All Reviews Replied!</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">You have answered 100% of customer reviews. Excellent work!</p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Select Review */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">Select Unreplied Review</label>
                  <select
                    value={selectedReviewIdForReply}
                    onChange={(e) => setSelectedReviewIdForReply(e.target.value)}
                    className="w-full p-3 text-xs rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-black dark:border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                  >
                    <option value="">-- Select Review --</option>
                    {unrepliedReviews.map((r) => (
                      <option key={r.id} value={r.id}>
                        [{r.rating} Stars] {r.reviewerName}: "{r.title}"
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone Selector */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">Desired Tone</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {['Professional & Empathetic', 'Direct Resolution', 'Enthusiastic Thank You', 'Executive Officer'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTone(t)}
                        className={`p-2.5 rounded-sm font-semibold border transition ${
                          selectedTone === t
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateAiReply}
                  disabled={!selectedReviewIdForReply || isGeneratingReply}
                  className="px-5 py-2.5 text-xs font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingReply ? 'Generating AI Reply...' : 'Generate Official Reply'}</span>
                </button>

                {/* Output Textarea */}
                {generatedAiReply && (
                  <div className="p-4 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 space-y-3">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">AI Draft Preview:</span>
                    <textarea
                      value={generatedAiReply}
                      onChange={(e) => setGeneratedAiReply(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 text-xs rounded-sm bg-zinc-50 dark:bg-zinc-900 border border-black dark:border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handlePostGeneratedReply}
                        className="px-4 py-2 text-xs font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Publish Official Response
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* TAB 3: REVIEW REQUESTS CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Counter & Receipt QR Code Generator</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Print or embed this QR code on receipts, invoices, or front desks to collect verified reviews instantly.</p>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                <div className="p-4 bg-zinc-50 rounded-sm border border-zinc-200 flex flex-col items-center">
                  <QrCode className="w-28 h-28 text-zinc-900" />
                  <span className="text-[10px] font-mono font-bold text-zinc-500 mt-2">Scan to Review {business.name}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Direct Review Link:</h4>
                  <code className="p-2 rounded-xs bg-zinc-200 dark:bg-zinc-800 text-blue-600 font-mono block">
                    https://trustpulse.ai/r/{business.slug}
                  </code>
                  <p className="text-zinc-500 dark:text-zinc-400">Customers scanning this QR code are automatically directed to your verified review submission form.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: EMBEDDABLE WIDGETS */}
        {activeTab === 'widgets' && (
          <div className="p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6">
            
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Embeddable Trust Badge Studio</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Showcase your live Trust Score and verified customer ratings on your website.</p>
            </div>

            {/* Widget Preview Box */}
            <div className="p-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              
              {/* Horizontal Badge Style */}
              <div className="p-4 rounded-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4 max-w-sm">
                <div className="w-10 h-10 rounded-xs bg-blue-100 text-blue-600 flex items-center justify-center font-bold font-mono text-sm">
                  {business.trustScore}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-zinc-900 dark:text-white">
                    <span>Verified on TrustPulse</span>
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{business.rating} / 5.0 ({business.reviewCount} reviews)</div>
                </div>
              </div>

            </div>

            {/* Code snippet copy */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Embed Code (HTML / Iframe)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={getEmbedCode()}
                  className="flex-1 p-2.5 text-xs font-mono rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-black dark:border-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                />
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 text-xs font-bold rounded-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
