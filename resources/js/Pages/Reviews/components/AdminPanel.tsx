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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-blue-100 text-blue-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">TrustPulse Super Admin Dashboard</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Platform operational metrics, monetization plans, and Gemini AI system health.</p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-sm bg-blue-100 border border-blue-600/20 text-blue-600 text-xs font-mono font-bold">
            Super Admin Portal Active
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Total Businesses</span>
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">{businesses.length} Listed</div>
            <div className="text-[11px] text-blue-600 font-semibold">{verifiedBusinessesCount} Claimed Gold/Silver</div>
          </div>

          <div className="p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Platform Reviews</span>
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">{reviews.length} Published</div>
            <div className="text-[11px] text-blue-600 font-semibold">{verifiedReviewsCount} Verified Invoices</div>
          </div>

          <div className="p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">MRR Revenue</span>
            <div className="text-2xl font-bold font-mono text-blue-600">$48,920 / mo</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">320 Pro Business Subscribers</div>
          </div>

          <div className="p-5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Gemini AI Model</span>
            <div className="text-2xl font-bold font-mono text-blue-600">gemini-3.6-flash</div>
            <div className="text-[11px] text-blue-600 font-semibold">99.98% API Uptime</div>
          </div>
        </div>

        {/* Monetization Plans Table */}
        <div className="p-6 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Active Monetization Tiers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="font-mono font-bold uppercase tracking-widest text-zinc-400 text-[10px] block">Free Tier</span>
              <div className="text-xl font-bold font-mono text-zinc-900 dark:text-white">$0 / month</div>
              <ul className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
                <li>• Basic business profile</li>
                <li>• Public review listing</li>
                <li>• Manual business responses</li>
              </ul>
            </div>

            <div className="p-5 rounded-sm bg-blue-100 dark:bg-blue-600/20 border border-blue-600/30 space-y-3">
              <span className="font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 text-[10px] block">Pro Business</span>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">$49 / month</div>
              <ul className="space-y-1.5 text-zinc-900 dark:text-zinc-100">
                <li>• Verified Gold Badge</li>
                <li>• Unlimited Gemini AI Auto-Replies</li>
                <li>• Embeddable Trust Score Badges</li>
                <li>• Competitor Benchmark Tool</li>
              </ul>
            </div>

            <div className="p-5 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="font-mono font-bold uppercase tracking-widest text-zinc-900 dark:text-white text-[10px] block">Enterprise White-Label</span>
              <div className="text-xl font-bold font-mono text-zinc-900 dark:text-white">$199 / month</div>
              <ul className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
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
