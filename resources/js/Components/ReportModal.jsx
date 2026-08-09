import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, reportableId, reportableType }) {
    const [reason, setReason] = useState('');
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

        setIsSubmitting(true);
        router.post('/reports', {
            reportable_id: reportableId,
            reportable_type: reportableType,
            reason: reason,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-md w-full max-w-md mx-4 shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-[#EDEFF1]">
                    <h2 className="text-[16px] font-bold text-[#1C1C1C]">Submit a Report</h2>
                    <button onClick={onClose} className="text-[#878A8C] hover:text-[#1C1C1C] transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4">
                    <p className="text-[14px] text-[#1C1C1C] mb-4">Why are you reporting this?</p>
                    <div className="space-y-2 mb-6">
                        {reasons.map((r, i) => (
                            <label key={i} className="flex items-center gap-2 cursor-pointer hover:bg-[#F6F7F8] p-2 rounded-md transition-colors">
                                <input 
                                    type="radio" 
                                    name="reason" 
                                    value={r} 
                                    checked={reason === r}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="text-[#0079D3] focus:ring-[#0079D3]"
                                />
                                <span className="text-[14px] font-medium text-[#1C1C1C]">{r}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 font-bold text-[14px] bg-[#F6F7F8] hover:bg-[#E2E7E9] text-[#1C1C1C] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!reason || isSubmitting}
                            className="px-4 py-2 font-bold text-[14px] bg-[#0079D3] hover:bg-[#005EAC] text-white rounded-full transition-colors disabled:opacity-50 border-0 outline-none focus:outline-none focus:ring-0"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
