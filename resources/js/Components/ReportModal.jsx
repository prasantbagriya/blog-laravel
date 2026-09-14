import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { X, Flag } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, reportableId, reportableType }) {
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const reasons = [
        "Spam",
        "Harassment or bullying",
        "Hate speech",
        "Sexually explicit content",
        "Misinformation",
        "Rules Violation",
        "Other"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reason) return;
        if (reason === 'Other' && !customReason.trim()) return;

        setIsSubmitting(true);
        const finalReason = reason === 'Other' ? `Other: ${customReason}` : reason;

        router.post('/reports', {
            reportable_id: reportableId,
            reportable_type: reportableType,
            reason: finalReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                alert('Report submitted successfully.');
                onClose();
            },
            onError: () => {
                setIsSubmitting(false);
                alert('An error occurred or you already reported this.');
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                            <Flag size={20} />
                        </div>
                        <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Submit a Report</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-[15px] font-bold text-slate-700 dark:text-zinc-300 mb-4">Why are you reporting this?</p>
                    <div className="space-y-2 mb-6">
                        {reasons.map((r, i) => (
                            <label key={i} className={`flex items-center gap-3 cursor-pointer p-3 rounded-2xl transition-all border ${reason === r ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800'}`}>
                                <input 
                                    type="radio" 
                                    name="reason" 
                                    value={r} 
                                    checked={reason === r}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-5 h-5 text-rose-600 bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-600 focus:ring-rose-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900 cursor-pointer"
                                />
                                <span className={`text-[15px] font-semibold ${reason === r ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-zinc-300'}`}>{r}</span>
                            </label>
                        ))}
                    </div>
                    
                    {reason === 'Other' && (
                        <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
                            <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2">Please provide more details</label>
                            <textarea
                                value={customReason}
                                onChange={e => setCustomReason(e.target.value)}
                                placeholder="Tell us what's wrong..."
                                className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 rounded-2xl py-3 px-4 text-[14px] text-slate-900 dark:text-white outline-none transition-all min-h-[100px] hover:border-rose-400"
                            ></textarea>
                        </div>
                    )}
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-6 py-2.5 font-bold text-[14px] bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!reason || (reason === 'Other' && !customReason.trim()) || isSubmitting}
                            className="px-6 py-2.5 font-bold text-[14px] bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 border-0 outline-none focus:outline-none focus:ring-0 shadow-md shadow-rose-600/20"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
