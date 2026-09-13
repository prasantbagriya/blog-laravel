import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Cpu, FileText, Lock, RefreshCw, Star } from 'lucide-react';
import { Review } from '../types';

interface ModeratorPanelProps {
  moderationQueue: Review[];
  onModeratorAction: (reviewId: string, action: 'approve' | 'reject', notes?: string) => void;
}

export const ModeratorPanel: React.FC<ModeratorPanelProps> = ({
  moderationQueue,
  onModeratorAction,
}) => {
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(moderationQueue[0]?.id || null);
  const [moderatorNotes, setModeratorNotes] = useState('');

  const activeReview = moderationQueue.find((r) => r.id === selectedReviewId) || moderationQueue[0];

  const handleAction = (action: 'approve' | 'reject') => {
    if (activeReview) {
      onModeratorAction(activeReview.id, action, moderatorNotes);
      setModeratorNotes('');
      const nextQueue = moderationQueue.filter((r) => r.id !== activeReview.id);
      setSelectedReviewId(nextQueue[0]?.id || null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#161615] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-white">AI Moderation & Fraud Inspection Queue</h1>
              <p className="text-xs text-[#555555] dark:text-[#A0A09C]">Real-time inspection queue for flagged reviews and suspicious AI risk markers.</p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold">
            {moderationQueue.length} Pending Inspection
          </div>
        </div>

        {moderationQueue.length === 0 ? (
          <div className="p-16 text-center bg-[#FDFCFB] dark:bg-[#161615] rounded-md border border-[#E5E5E1] dark:border-[#2A2A28]">
            <CheckCircle2 className="w-12 h-12 text-[#0052FF] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">Moderation Queue Clear!</h3>
            <p className="text-xs text-[#555555] dark:text-[#A0A09C] mt-1">No pending flagged reviews require human inspection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Queue List */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#999999] block px-1">Flagged Items ({moderationQueue.length})</span>
              {moderationQueue.map((rev) => (
                <div
                  key={rev.id}
                  onClick={() => setSelectedReviewId(rev.id)}
                  className={`p-4 rounded-sm border cursor-pointer transition ${
                    activeReview?.id === rev.id
                      ? 'bg-[#E6EEFF] dark:bg-[#0052FF]/20 border-[#0052FF] text-[#1A1A1A] dark:text-white'
                      : 'bg-[#FDFCFB] dark:bg-[#161615] border-[#E5E5E1] dark:border-[#2A2A28] hover:border-[#0052FF]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-[#1A1A1A] dark:text-white">{rev.reviewerName}</span>
                    <span className="px-2 py-0.5 rounded-2xs bg-rose-500/10 text-rose-600 font-mono text-[10px]">
                      Fraud Score: {rev.aiFraudScore}/100
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-[#F5F5F2] truncate">"{rev.title}"</h4>
                  <p className="text-[11px] text-[#555555] dark:text-[#A0A09C] line-clamp-1 mt-0.5">{rev.description}</p>
                </div>
              ))}
            </div>

            {/* Inspection Details View (2 Cols) */}
            {activeReview && (
              <div className="lg:col-span-2 p-6 rounded-md bg-[#FDFCFB] dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E1] dark:border-[#2A2A28]">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A1A] dark:text-white">
                    <Cpu className="w-4 h-4 text-[#0052FF]" />
                    <span>Review Inspection ID: {activeReview.id}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-2xs">
                    Fraud Risk Level: {activeReview.aiFraudScore > 65 ? 'HIGH' : 'MEDIUM'}
                  </span>
                </div>

                {/* Review details */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A1A] dark:text-white text-sm">"{activeReview.title}"</span>
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= activeReview.rating ? 'fill-amber-500 text-amber-500' : 'text-[#E5E5E1] dark:text-[#3A3A38]'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="p-3 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] text-[#1A1A1A] dark:text-white leading-relaxed border border-[#E5E5E1] dark:border-[#2A2A28]">
                    "{activeReview.description}"
                  </p>
                </div>

                {/* AI Risk Reasoning */}
                <div className="p-4 rounded-sm bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    AI Fraud Reason:
                  </span>
                  <p className="text-amber-900 dark:text-amber-200">{activeReview.aiFraudReason || 'Unusual ip burst pattern detected.'}</p>
                </div>

                {/* Technical Markers */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28]">
                    <span className="text-[#999999] block text-[10px] font-mono font-bold uppercase">Device Fingerprint</span>
                    <code className="text-[#1A1A1A] dark:text-white font-mono">{activeReview.deviceFingerprint || 'fp_mac_881'}</code>
                  </div>

                  <div className="p-3 rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28]">
                    <span className="text-[#999999] block text-[10px] font-mono font-bold uppercase">IP Location</span>
                    <span className="text-[#1A1A1A] dark:text-white font-medium">{activeReview.ipLocation || 'Verified ISP'}</span>
                  </div>
                </div>

                {/* Moderator Decision Notes */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-[#999999]">Moderator Audit Note</label>
                  <textarea
                    value={moderatorNotes}
                    onChange={(e) => setModeratorNotes(e.target.value)}
                    placeholder="Enter audit reasoning for approving or rejecting..."
                    rows={2}
                    className="w-full p-3 text-xs rounded-sm bg-[#F5F5F2] dark:bg-[#20201F] border border-[#E5E5E1] dark:border-[#2A2A28] text-[#1A1A1A] dark:text-white"
                  />

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleAction('reject')}
                      className="px-5 py-2.5 text-xs font-bold rounded-sm bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject & Purge Review</span>
                    </button>

                    <button
                      onClick={() => handleAction('approve')}
                      className="px-5 py-2.5 text-xs font-bold rounded-sm bg-[#0052FF] hover:bg-[#0040D0] text-white flex items-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Publish Live</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
