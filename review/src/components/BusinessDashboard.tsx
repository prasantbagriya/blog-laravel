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
  Star,
  ShieldCheck,
  Target,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { Business, Review, ReviewCampaign, EmbedWidgetConfig, AiExecutiveDigest } from '../types';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'executive_swot' | 'ai_reply' | 'campaigns' | 'widgets'>('overview');

  // AI Auto-reply state
  const [selectedReviewIdForReply, setSelectedReviewIdForReply] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState('Professional & Empathetic');
  const [generatedAiReply, setGeneratedAiReply] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);

  // Executive SWOT Digest state
  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);
  const [executiveDigest, setExecutiveDigest] = useState<AiExecutiveDigest | null>(null);

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

  // Recharts Chart Data
  const monthlyTrendData = [
    { month: 'Apr', positive: 28, neutral: 4, critical: 1, trustScore: 84 },
    { month: 'May', positive: 35, neutral: 5, critical: 2, trustScore: 86 },
    { month: 'Jun', positive: 42, neutral: 3, critical: 1, trustScore: 89 },
    { month: 'Jul', positive: 50, neutral: 6, critical: 2, trustScore: 91 },
    { month: 'Aug', positive: 68, neutral: 4, critical: 1, trustScore: business.trustScore },
  ];

  const categoryRadarData = [
    { subject: 'Support', score: business.categoryAverages?.support || 4.8, fullMark: 5 },
    { subject: 'Quality', score: business.categoryAverages?.quality || 4.9, fullMark: 5 },
    { subject: 'Delivery', score: business.categoryAverages?.delivery || 4.7, fullMark: 5 },
    { subject: 'Pricing', score: business.categoryAverages?.pricing || 4.4, fullMark: 5 },
    { subject: 'Communication', score: business.categoryAverages?.communication || 4.9, fullMark: 5 },
    { subject: 'Value', score: business.categoryAverages?.value || 4.6, fullMark: 5 },
  ];

  const ratingDistData = [
    { star: '5 Stars', count: business.ratingDistribution[5] || 45 },
    { star: '4 Stars', count: business.ratingDistribution[4] || 12 },
    { star: '3 Stars', count: business.ratingDistribution[3] || 3 },
    { star: '2 Stars', count: business.ratingDistribution[2] || 1 },
    { star: '1 Star', count: business.ratingDistribution[1] || 0 },
  ];

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

  // Handle Executive SWOT Generation
  const handleGenerateExecutiveDigest = async () => {
    setIsGeneratingDigest(true);
    try {
      const res = await fetch('/api/ai/executive-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id }),
      });
      const data = await res.json();
      setExecutiveDigest(data);
    } catch (err) {
      console.error('Error generating executive digest:', err);
    } finally {
      setIsGeneratingDigest(false);
    }
  };

  const getEmbedCode = () => {
    return `<div id="trustpulse-widget" data-business="${business.slug}" data-style="${widgetConfig.style}" data-theme="${widgetConfig.theme}" data-primary="${widgetConfig.primaryColor}"></div>\n<script src="https://trustpulse.ai/widget.js" async></script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#161615] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28]">
          <div className="flex items-center gap-4">
            <img
              src={business.logo}
              alt={business.name}
              className="w-14 h-14 rounded-xs object-cover border border-[#E5E5E1] dark:border-[#2A2A28]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-white">{business.name} Suite</h1>
                <span className="px-2 py-0.5 rounded-2xs bg-[#E6EEFF] text-[#0052FF] text-xs font-mono font-bold border border-[#0052FF]/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pro Verified Hub
                </span>
              </div>
              <p className="text-xs text-[#555555] dark:text-[#A0A09C] mt-0.5">Manage reviews, visual analytics, AI executive SWOT, auto-replies, and live trust badges.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-sm bg-[#E6EEFF] dark:bg-[#0052FF]/20 border border-[#0052FF]/30 text-center">
              <div className="text-xl font-mono font-bold text-[#0052FF] dark:text-[#80B0FF]">{business.trustScore}/100</div>
              <div className="text-[10px] font-mono font-bold text-[#555555] dark:text-[#A0A09C]">Trust Score</div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E5E1] dark:border-[#2A2A28] pb-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Visual Analytics', icon: BarChart3 },
            { id: 'executive_swot', label: 'AI Executive SWOT & Strategy', icon: Target },
            { id: 'ai_reply', label: 'AI Auto-Reply Studio', icon: Sparkles, badge: unrepliedReviews.length },
            { id: 'campaigns', label: 'QR & Review Requests', icon: QrCode },
            { id: 'widgets', label: 'Live Embed Badges', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-bold rounded-sm transition shrink-0 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#0052FF] text-white shadow-2xs'
                    : 'text-[#555555] dark:text-[#A0A09C] hover:bg-[#F5F5F2] dark:hover:bg-[#20201F]'
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

        {/* TAB 1: VISUAL ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">Total Reviews</span>
                <div className="text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white">{business.reviewCount}</div>
                <div className="text-[11px] text-[#0052FF] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
                </div>
              </div>

              <div className="p-5 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">Trust Score Index</span>
                <div className="text-2xl font-bold font-mono text-[#0052FF]">{business.trustScore}/100</div>
                <div className="text-[11px] text-[#555555] dark:text-[#A0A09C] font-medium">Top 5% in {business.categoryName}</div>
              </div>

              <div className="p-5 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">Response Rate</span>
                <div className="text-2xl font-bold font-mono text-[#0052FF]">96.2%</div>
                <div className="text-[11px] text-[#0052FF] font-semibold">Avg reply under 1.2 hours</div>
              </div>

              <div className="p-5 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">Profile Visitors</span>
                <div className="text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white">18,420</div>
                <div className="text-[11px] text-[#0052FF] font-semibold">+12% traffic conversion</div>
              </div>
            </div>

            {/* Interactive Charts: Sentiment Trend + Category Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Review Growth & Sentiment Area */}
              <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">Monthly Sentiment Trajectory</h3>
                    <p className="text-xs text-[#555555] dark:text-[#A0A09C]">Verified review volume categorized by sentiment.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0052FF] bg-[#E6EEFF] px-2 py-0.5 rounded-2xs">
                    5-Month History
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0052FF" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#0052FF" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '4px', border: 'none', color: '#fff', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="positive" stroke="#0052FF" fillOpacity={1} fill="url(#colorPositive)" name="Positive" />
                      <Area type="monotone" dataKey="neutral" stroke="#F59E0B" fillOpacity={1} fill="url(#colorNeutral)" name="Neutral" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Category Dimensions Radar */}
              <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">6-Dimension Quality Radar</h3>
                    <p className="text-xs text-[#555555] dark:text-[#A0A09C]">Customer ratings across key business pillars.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0052FF] bg-[#E6EEFF] px-2 py-0.5 rounded-2xs">
                    4.7 / 5.0 Avg
                  </span>
                </div>

                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={categoryRadarData}>
                      <PolarGrid stroke="#E5E5E1" />
                      <PolarAngleAxis dataKey="subject" stroke="#666666" fontSize={11} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#999999" fontSize={10} />
                      <Radar name={business.name} dataKey="score" stroke="#0052FF" fill="#0052FF" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Rating Distribution Bar Chart */}
            <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-4">
              <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">Rating Distribution</h3>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis type="number" stroke="#888888" fontSize={11} />
                    <YAxis dataKey="star" type="category" stroke="#888888" fontSize={11} tickLine={false} width={70} />
                    <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '4px', border: 'none', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="count" fill="#0052FF" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: AI EXECUTIVE SWOT & STRATEGY */}
        {activeTab === 'executive_swot' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#E6EEFF] text-[#0052FF] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">Gemini AI Executive SWOT & Monthly Digest</h3>
                  <p className="text-xs text-[#555555] dark:text-[#A0A09C]">Synthesizes customer sentiment into strategic strengths, vulnerabilities, and priority next steps.</p>
                </div>
              </div>

              <button
                onClick={handleGenerateExecutiveDigest}
                disabled={isGeneratingDigest}
                className="px-5 py-2.5 text-xs font-bold rounded-sm bg-[#0052FF] text-white hover:bg-[#0040D0] transition flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingDigest ? 'Synthesizing with Gemini AI...' : executiveDigest ? 'Regenerate SWOT Matrix' : 'Generate SWOT Analysis'}</span>
              </button>
            </div>

            {executiveDigest ? (
              <div className="space-y-6">
                
                {/* Executive Summary Banner */}
                <div className="p-5 rounded-md bg-[#E6EEFF] dark:bg-[#0052FF]/20 border border-[#0052FF]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs uppercase tracking-widest text-[#0052FF] dark:text-[#80B0FF] flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      Executive Synthesis
                    </span>
                    <span className="text-[10px] font-mono text-[#555555] dark:text-[#A0A09C]">
                      Generated: {executiveDigest.generatedAt}
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A1A] dark:text-[#F5F5F2] font-medium leading-relaxed">
                    {executiveDigest.executiveSummary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-xs bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#555555] dark:text-[#A0A09C]">Customer Loyalty Index</span>
                      <span className="font-mono font-bold text-sm text-[#0052FF]">{executiveDigest.customerLoyaltyIndex}/100</span>
                    </div>
                    <div className="p-3 rounded-xs bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#555555] dark:text-[#A0A09C]">Churn Risk Assessment</span>
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-2xs ${
                        executiveDigest.churnRiskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {executiveDigest.churnRiskLevel} RISK
                      </span>
                    </div>
                  </div>
                </div>

                {/* SWOT 4-Quadrant Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Strengths */}
                  <div className="p-5 rounded-md bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      Strengths (S)
                    </div>
                    <ul className="space-y-2 text-xs text-[#1A1A1A] dark:text-white">
                      {executiveDigest.swot.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-5 rounded-md bg-amber-500/5 border border-amber-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest font-mono">
                      <AlertTriangle className="w-4 h-4" />
                      Weaknesses (W)
                    </div>
                    <ul className="space-y-2 text-xs text-[#1A1A1A] dark:text-white">
                      {executiveDigest.swot.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="p-5 rounded-md bg-[#0052FF]/5 border border-[#0052FF]/20 space-y-3">
                    <div className="flex items-center gap-2 text-[#0052FF] dark:text-[#80B0FF] font-bold text-xs uppercase tracking-widest font-mono">
                      <TrendingUp className="w-4 h-4" />
                      Opportunities (O)
                    </div>
                    <ul className="space-y-2 text-xs text-[#1A1A1A] dark:text-white">
                      {executiveDigest.swot.opportunities.map((o, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#0052FF] font-bold">•</span>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="p-5 rounded-md bg-rose-500/5 border border-rose-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest font-mono">
                      <Flame className="w-4 h-4" />
                      Threats (T)
                    </div>
                    <ul className="space-y-2 text-xs text-[#1A1A1A] dark:text-white">
                      {executiveDigest.swot.threats.map((t, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Priority Action Steps */}
                <div className="p-5 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-3">
                  <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-[#1A1A1A] dark:text-white">
                    🎯 Recommended Strategic Action Steps
                  </h4>
                  <div className="space-y-2 text-xs">
                    {executiveDigest.recommendedActionSteps.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-xs bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#0052FF] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[#1A1A1A] dark:text-[#F5F5F2] font-medium pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center bg-[#F5F5F2] dark:bg-[#20201F] rounded-md border border-[#E5E5E1] dark:border-[#2A2A28] space-y-3">
                <Target className="w-10 h-10 text-[#0052FF] mx-auto" />
                <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">No SWOT Digest Generated Yet</h4>
                <p className="text-xs text-[#555555] dark:text-[#A0A09C] max-w-md mx-auto">Click the button above to let Gemini AI perform an executive SWOT breakdown of all customer reviews and metrics.</p>
                <button
                  onClick={handleGenerateExecutiveDigest}
                  className="px-5 py-2.5 text-xs font-bold rounded-sm bg-[#0052FF] text-white hover:bg-[#0040D0] transition inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Strategic SWOT</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: AI AUTO-REPLY STUDIO */}
        {activeTab === 'ai_reply' && (
          <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#E6EEFF] text-[#0052FF] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">Gemini AI Auto-Reply Generator</h3>
                <p className="text-xs text-[#555555] dark:text-[#A0A09C]">Draft customized, empathetic executive replies in 1 click.</p>
              </div>
            </div>

            {unrepliedReviews.length === 0 ? (
              <div className="p-8 text-center bg-[#F5F5F2] dark:bg-[#20201F] rounded-sm border border-[#E5E5E1] dark:border-[#2A2A28]">
                <Check className="w-8 h-8 text-[#0052FF] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">All Reviews Replied!</h4>
                <p className="text-xs text-[#555555] dark:text-[#A0A09C] mt-1">You have answered 100% of customer reviews. Excellent work!</p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Select Review */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#999999] mb-2">Select Unreplied Review</label>
                  <select
                    value={selectedReviewIdForReply}
                    onChange={(e) => setSelectedReviewIdForReply(e.target.value)}
                    className="w-full p-3 text-xs rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white"
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
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#999999] mb-2">Desired Tone</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {['Professional & Empathetic', 'Direct Resolution', 'Enthusiastic Thank You', 'Executive Officer'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTone(t)}
                        className={`p-2.5 rounded-sm font-semibold border transition ${
                          selectedTone === t
                            ? 'bg-[#0052FF] text-white border-[#0052FF]'
                            : 'bg-[#F5F5F2] dark:bg-[#20201F] border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white'
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
                  className="px-5 py-2.5 text-xs font-bold rounded-sm bg-[#0052FF] text-white hover:bg-[#0040D0] disabled:opacity-50 transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingReply ? 'Generating AI Reply...' : 'Generate Official Reply'}</span>
                </button>

                {/* Output Textarea */}
                {generatedAiReply && (
                  <div className="p-4 rounded-sm bg-[#E6EEFF] dark:bg-[#0052FF]/20 border border-[#0052FF]/30 space-y-3">
                    <span className="text-xs font-bold text-[#0052FF] dark:text-[#80B0FF] block">AI Draft Preview:</span>
                    <textarea
                      value={generatedAiReply}
                      onChange={(e) => setGeneratedAiReply(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 text-xs rounded-sm bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handlePostGeneratedReply}
                        className="px-4 py-2 text-xs font-bold rounded-sm bg-[#0052FF] text-white hover:bg-[#0040D0]"
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

        {/* TAB 4: REVIEW REQUESTS CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-4">
              <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">Counter & Receipt QR Code Generator</h3>
              <p className="text-xs text-[#555555] dark:text-[#A0A09C]">Print or embed this QR code on receipts, invoices, or front desks to collect verified reviews instantly.</p>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28]">
                <div className="p-4 bg-[#FDFCFB] rounded-sm border border-[#E5E5E1] flex flex-col items-center">
                  <QrCode className="w-28 h-28 text-[#1A1A1A]" />
                  <span className="text-[10px] font-mono font-bold text-[#555555] mt-2">Scan to Review {business.name}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-[#1A1A1A] dark:text-white text-sm">Direct Review Link:</h4>
                  <code className="p-2 rounded-xs bg-[#E5E5E1] dark:bg-[#2A2A28] text-[#0052FF] font-mono block">
                    https://trustpulse.ai/r/{business.slug}
                  </code>
                  <p className="text-[#555555] dark:text-[#A0A09C]">Customers scanning this QR code are automatically directed to your verified review submission form.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: LIVE EMBEDDABLE BADGES & SANDBOX */}
        {activeTab === 'widgets' && (
          <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-6">
            
            <div>
              <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">Live Embeddable Trust Badge Studio</h3>
              <p className="text-xs text-[#555555] dark:text-[#A0A09C]">Customize theme, layout, and copy the embed code directly into your React, Next.js, or HTML site.</p>
            </div>

            {/* Widget Customizer Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-mono font-bold uppercase tracking-widest text-[#999999] mb-1.5">Style</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'badge_horizontal', label: 'Horizontal' },
                    { id: 'badge_compact', label: 'Compact' },
                    { id: 'review_card', label: 'Card' },
                    { id: 'carousel', label: 'Mini Stamp' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setWidgetConfig({ ...widgetConfig, style: s.id as any })}
                      className={`p-2 rounded-xs font-semibold border transition ${
                        widgetConfig.style === s.id ? 'bg-[#0052FF] text-white border-[#0052FF]' : 'bg-[#F5F5F2] dark:bg-[#20201F] border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold uppercase tracking-widest text-[#999999] mb-1.5">Theme</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['light', 'dark', 'glass'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setWidgetConfig({ ...widgetConfig, theme: t as any })}
                      className={`p-2 rounded-xs font-semibold uppercase font-mono border transition ${
                        widgetConfig.theme === t ? 'bg-[#0052FF] text-white border-[#0052FF]' : 'bg-[#F5F5F2] dark:bg-[#20201F] border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold uppercase tracking-widest text-[#999999] mb-1.5">Accent Color</label>
                <div className="flex gap-2">
                  {['#0052FF', '#10B981', '#6366F1', '#EC4899', '#1A1A1A'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setWidgetConfig({ ...widgetConfig, primaryColor: c })}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        widgetConfig.primaryColor === c ? 'border-black dark:border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Widget Sandbox Live Preview */}
            <div className={`p-8 rounded-sm border flex items-center justify-center transition ${
              widgetConfig.theme === 'dark' ? 'bg-[#111111] border-[#333333]' : widgetConfig.theme === 'glass' ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-white/20' : 'bg-[#F5F5F2] border-[#E5E5E1]'
            }`}>
              
              {/* Dynamic Live Badge */}
              <div className={`p-4 rounded-sm border shadow-sm flex items-center gap-4 max-w-sm transition ${
                widgetConfig.theme === 'dark' ? 'bg-[#1A1A1A] text-white border-[#333333]' : 'bg-white text-[#1A1A1A] border-[#E5E5E1]'
              }`}>
                <div 
                  className="w-11 h-11 rounded-xs text-white flex items-center justify-center font-bold font-mono text-sm shrink-0"
                  style={{ backgroundColor: widgetConfig.primaryColor }}
                >
                  {business.trustScore}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <span>Verified on TrustPulse</span>
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  </div>
                  <div className="text-[11px] font-mono text-[#666666] dark:text-[#A0A09C]">
                    {business.rating} / 5.0 ({business.reviewCount} verified reviews)
                  </div>
                </div>
              </div>

            </div>

            {/* Code snippet copy */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">Embed Code (HTML / Script Tag)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={getEmbedCode()}
                  className="flex-1 p-2.5 text-xs font-mono rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white"
                />
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 text-xs font-bold rounded-sm bg-[#0052FF] text-white hover:bg-[#0040D0] flex items-center gap-1.5"
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
