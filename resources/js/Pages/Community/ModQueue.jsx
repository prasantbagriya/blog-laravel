import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Shield, Check, Trash2, ArrowLeft } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function ModQueue({ auth, community, reports }) {
    
    const handleApprove = (reportId) => {
        router.post(route('reports.approve', reportId), {}, { preserveScroll: true });
    };

    const handleRemove = (reportId) => {
        router.post(route('reports.remove', reportId), {}, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-[#DAE0E6] text-[#1C1C1C] font-sans pb-20 pt-14">
            <Head title={`Mod Queue - r/${community.name}`} />
            
            <header className="fixed top-0 z-50 w-full bg-white border-b border-[#EDEFF1]">
                <div className="w-full px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link href="/feed" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4F46E5] flex items-center justify-center">
                            <span className="text-white font-black text-lg">N</span>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight hidden sm:block">
                            coachinginsikar
                        </span>
                    </Link>
                </div>
            </header>

            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href={`/community/${community.name}`} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-[#F6F7F8] transition-colors">
                        <ArrowLeft size={20} className="text-[#878A8C]" />
                    </Link>
                    <div>
                        <h1 className="text-[22px] font-bold text-[#1C1C1C] flex items-center gap-2">
                            <Shield size={24} className="text-[#0079D3]" /> 
                            Mod Queue
                        </h1>
                        <p className="text-[14px] text-[#787C7E]">r/{community.name}</p>
                    </div>
                </div>

                <div className="bg-white rounded-md border border-[#EDEFF1] overflow-hidden">
                    {reports.length === 0 ? (
                        <div className="p-10 text-center flex flex-col items-center justify-center text-[#878A8C]">
                            <Shield size={48} className="mb-4 opacity-50" />
                            <h2 className="text-[18px] font-bold text-[#1C1C1C] mb-2">The queue is clean!</h2>
                            <p className="text-[14px]">No pending reports to review.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#EDEFF1]">
                            {reports.map((report) => (
                                <div key={report.id} className="p-4 hover:bg-[#F8F9FA] transition-colors">
                                    <div className="flex items-center gap-2 text-[12px] text-[#787C7E] mb-2">
                                        <span className="font-bold text-[#FF4500]">Reported for: {report.reason}</span>
                                        <span>•</span>
                                        <span>By u/{report.user.username}</span>
                                        <span>•</span>
                                        <span>{dayjs(report.created_at).fromNow()}</span>
                                    </div>
                                    
                                    <div className="bg-[#F6F7F8] border border-[#EDEFF1] p-3 rounded-md mb-3">
                                        {report.reportable_type.includes('Post') ? (
                                            <>
                                                <div className="flex items-center gap-2 text-[12px] text-[#787C7E] mb-1">
                                                    <span className="font-bold">Post</span> by u/{report.reportable?.author?.username || 'deleted'}
                                                </div>
                                                <h3 className="font-medium text-[16px] mb-1">{report.reportable?.title}</h3>
                                                {report.reportable?.content && (
                                                    <div className="text-[14px] text-[#1C1C1C] line-clamp-3" dangerouslySetInnerHTML={{ __html: report.reportable.content }} />
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2 text-[12px] text-[#787C7E] mb-1">
                                                    <span className="font-bold">Comment</span> by u/{report.reportable?.author?.username || 'deleted'}
                                                </div>
                                                <div className="text-[14px] text-[#1C1C1C]">{report.reportable?.content}</div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleApprove(report.id)}
                                            className="flex items-center gap-1.5 px-4 py-1.5 font-bold text-[14px] bg-[#E2E7E9] hover:bg-[#D4DADB] text-[#1C1C1C] rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0"
                                        >
                                            <Check size={16} /> Approve (Ignore Report)
                                        </button>
                                        <button 
                                            onClick={() => handleRemove(report.id)}
                                            className="flex items-center gap-1.5 px-4 py-1.5 font-bold text-[14px] bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors border-0 outline-none focus:outline-none focus:ring-0"
                                        >
                                            <Trash2 size={16} /> Remove Content
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
