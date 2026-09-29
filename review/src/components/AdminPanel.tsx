import React from 'react';
import { Crown, Building2, MessageSquare, ShieldCheck, DollarSign, Cpu, Settings, Activity } from 'lucide-react';
import { Business, Review } from '../types';

interface AdminPanelProps {
  businesses: Business[];
  reviews: Review[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ businesses, reviews }) => {
  const verifiedBusinessesCount = businesses.filter((b) => b.isVerified).length;
  const verifiedReviewsCount = reviews.filter((r) => r.isVerifiedPurchase).length;

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#161615] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-[#E6EEFF] text-[#0052FF] flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-white">TrustPulse Super Admin Dashboard</h1>
              <p className="text-xs text-[#555555] dark:text-[#A0A09C]">Platform operational metrics, monetization plans, and Gemini AI system health.</p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-sm bg-[#E6EEFF] border border-[#0052FF]/20 text-[#0052FF] text-xs font-mono font-bold">
            Super Admin Portal Active
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">Total Businesses</span>
            <div className="text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white">{businesses.length} Listed</div>
            <div className="text-[11px] text-[#0052FF] font-semibold">{verifiedBusinessesCount} Claimed Gold/Silver</div>
          </div>

          <div className="p-5 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">Platform Reviews</span>
            <div className="text-2xl font-bold font-mono text-[#1A1A1A] dark:text-white">{reviews.length} Published</div>
            <div className="text-[11px] text-[#0052FF] font-semibold">{verifiedReviewsCount} Verified Invoices</div>
          </div>

          <div className="p-5 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">MRR Revenue</span>
            <div className="text-2xl font-bold font-mono text-[#0052FF]">$48,920 / mo</div>
            <div className="text-[11px] text-[#555555] dark:text-[#A0A09C] font-medium">320 Pro Business Subscribers</div>
          </div>

          <div className="p-5 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">Gemini AI Model</span>
            <div className="text-2xl font-bold font-mono text-[#0052FF]">gemini-3.6-flash</div>
            <div className="text-[11px] text-[#0052FF] font-semibold">99.98% API Uptime</div>
          </div>
        </div>

        {/* Monetization Plans Table */}
        <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-4">
          <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white">Active Monetization Tiers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-3">
              <span className="font-mono font-bold uppercase tracking-widest text-[#999999] text-[10px] block">Free Tier</span>
              <div className="text-xl font-bold font-mono text-[#1A1A1A] dark:text-white">$0 / month</div>
              <ul className="space-y-1.5 text-[#555555] dark:text-[#A0A09C]">
                <li>• Basic business profile</li>
                <li>• Public review listing</li>
                <li>• Manual business responses</li>
              </ul>
            </div>

            <div className="p-5 rounded-sm bg-[#E6EEFF] dark:bg-[#0052FF]/20 border border-[#0052FF]/30 space-y-3">
              <span className="font-mono font-bold uppercase tracking-widest text-[#0052FF] dark:text-[#80B0FF] text-[10px] block">Pro Business</span>
              <div className="text-xl font-bold font-mono text-[#0052FF] dark:text-[#80B0FF]">$49 / month</div>
              <ul className="space-y-1.5 text-[#1A1A1A] dark:text-[#F5F5F2]">
                <li>• Verified Gold Badge</li>
                <li>• Unlimited Gemini AI Auto-Replies</li>
                <li>• Embeddable Trust Score Badges</li>
                <li>• Competitor Benchmark Tool</li>
              </ul>
            </div>

            <div className="p-5 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-3">
              <span className="font-mono font-bold uppercase tracking-widest text-[#1A1A1A] dark:text-white text-[10px] block">Enterprise White-Label</span>
              <div className="text-xl font-bold font-mono text-[#1A1A1A] dark:text-white">$199 / month</div>
              <ul className="space-y-1.5 text-[#555555] dark:text-[#A0A09C]">
                <li>• Custom domain reputation hub</li>
                <li>• Full REST & Webhook API access</li>
                <li>• Dedicated Account Manager</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
