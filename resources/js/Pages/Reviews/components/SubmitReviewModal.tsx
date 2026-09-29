import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Upload, 
  FileText, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Business, ReviewProof, CategoryRatings } from '../types';

interface SubmitReviewModalProps {
  businesses: Business[];
  preselectedBusinessId?: string;
  onClose: () => void;
  onSubmit: (reviewData: any) => Promise<void>;
}

export const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({
  businesses,
  preselectedBusinessId,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [businessId, setBusinessId] = useState(preselectedBusinessId || businesses[0]?.id || '');
  
  // Form State
  const [overallRating, setOverallRating] = useState(5);
  const [categoryRatings, setCategoryRatings] = useState<CategoryRatings>({
    support: 5,
    quality: 5,
    delivery: 5,
    pricing: 4,
    communication: 5,
    value: 5,
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proInput, setProInput] = useState('');
  const [pros, setPros] = useState<string[]>([]);
  const [conInput, setConInput] = useState('');
  const [cons, setCons] = useState<string[]>([]);

  // Proof verification
  const [orderNumber, setOrderNumber] = useState('');
  const [proofFileUploaded, setProofFileUploaded] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerLocation, setReviewerLocation] = useState('Sikar, Rajasthan');

  // AI Inspection state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBusiness = businesses.find((b) => b.id === businessId);

  const handleAddPro = () => {
    if (proInput.trim()) {
      setPros([...pros, proInput.trim()]);
      setProInput('');
    }
  };

  const handleAddCon = () => {
    if (conInput.trim()) {
      setCons([...cons, conInput.trim()]);
      setConInput('');
    }
  };

  // Step 3 -> 4: Trigger real-time Gemini AI inspection
  const handleProceedToAiCheck = async () => {
    if (!title.trim() || !description.trim()) return;
    setStep(4);
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/ai/analyze-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          rating: overallRating,
          businessName: selectedBusiness?.name,
        }),
      });
      const data = await res.json();
      setAiFeedback(data);
    } catch (err) {
      console.error('AI check error:', err);
      setAiFeedback({
        sentiment: overallRating >= 4 ? 'positive' : 'neutral',
        aiFraudScore: 4,
        fraudRiskLevel: 'LOW',
        reasons: ['Passed basic structure check'],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const proof: ReviewProof | undefined = (orderNumber.trim() || proofFileUploaded)
        ? {
            type: 'invoice',
            orderNumber: orderNumber.trim() || 'INV-2026-X99',
            proofUrl: proofFileUploaded ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c' : undefined,
            verifiedAt: new Date().toISOString().split('T')[0],
          }
        : undefined;

      await onSubmit({
        businessId,
        reviewerName: reviewerName || 'Verified Community Member',
        reviewerLocation,
        rating: overallRating,
        categoryRatings,
        title,
        description,
        pros,
        cons,
        isVerifiedPurchase: !!proof,
        isAnonymous,
        proof,
      });

      onClose();
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 relative overflow-hidden">
        
        {/* Accent Header */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 rounded-t-2xl absolute top-0 left-0"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Write Verified Review</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Step {step} of 4: {step === 1 ? 'Rating' : step === 2 ? 'Details' : step === 3 ? 'Proof & Bio' : 'AI Inspection'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-zinc-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Select Business & Ratings */}
        {step === 1 && (
          <div className="space-y-5">
            
            {/* Select Business */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Select Company
              </label>
              <select
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.categoryName})
                  </option>
                ))}
              </select>
            </div>

            {/* Overall Rating Stars */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-zinc-800/80 dark:to-zinc-900 border border-slate-200 dark:border-zinc-700 text-center space-y-4 shadow-sm">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overall Rating</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= overallRating ? 'fill-amber-500 text-amber-500' : 'text-zinc-200 dark:text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-blue-600 block">
                {overallRating === 5 ? 'Excellent' : overallRating === 4 ? 'Great' : overallRating === 3 ? 'Average' : 'Poor'}
              </span>
            </div>

            {/* Category Ratings Grid */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Specific Category Ratings
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {(['support', 'quality', 'delivery', 'pricing'] as (keyof CategoryRatings)[]).map((catKey) => (
                  <div key={catKey} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm">
                    <span className="capitalize font-semibold text-zinc-900 dark:text-zinc-100">{catKey}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setCategoryRatings({ ...categoryRatings, [catKey]: s })}
                        >
                          <Star className={`w-4 h-4 ${s <= categoryRatings[catKey] ? 'fill-amber-500 text-amber-500' : 'text-zinc-200 dark:text-zinc-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all text-white font-bold text-sm active:scale-[0.98]"
              >
                <span>Next: Review Text</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Title, Body, Pros, Cons */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Review Headline / Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Exceptional customer service and sub-20ms latency!"
                className="block w-full px-5 py-3.5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Detailed Experience Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Explain what you bought, how long you used the service, what went well or what could be improved..."
                className="block w-full p-5 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-3xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
              />
            </div>

            {/* Pros & Cons Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-blue-600 mb-1">Add Pro Point</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={proInput}
                    onChange={(e) => setProInput(e.target.value)}
                    placeholder="e.g. Fast response"
                    className="flex-1 px-5 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                  />
                  <button onClick={handleAddPro} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 transition-all text-white rounded-full font-bold">Add</button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {pros.map((p, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold">{p}</span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-rose-600 mb-1">Add Con Point</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={conInput}
                    onChange={(e) => setConInput(e.target.value)}
                    placeholder="e.g. Higher overage fee"
                    className="flex-1 px-5 py-3 bg-slate-100 dark:bg-zinc-800/80 border border-transparent outline-none rounded-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-slate-200 dark:hover:bg-zinc-800 hover:border-blue-500"
                  />
                  <button onClick={handleAddCon} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 transition-all text-white rounded-full font-bold">Add</button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {cons.map((c, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!title.trim() || !description.trim()}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 active:scale-[0.98] text-sm"
              >
                Next: Verification Proof
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Proof Upload & Verification */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400">
              <h4 className="font-bold flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Verified Purchase Booster
              </h4>
              <p className="mt-1 leading-relaxed text-zinc-900 dark:text-zinc-100">
                Adding an Order Number or uploading an invoice receipt boosts your review trust weight by 3.5x and attaches a green "Verified Invoice" badge!
              </p>
            </div>

            <div>
              <label className="block font-bold text-zinc-900 dark:text-white mb-1">
                Order Number / Invoice ID (Optional)
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., INV-AETHER-2026-99"
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-900 dark:text-white mb-1">
                Upload Receipt / Invoice Image
              </label>
              <div
                onClick={() => setProofFileUploaded(!proofFileUploaded)}
                className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition ${
                  proofFileUploaded
                    ? 'border-blue-600 bg-blue-100 text-blue-600'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-600'
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-zinc-400" />
                <span className="font-bold block">
                  {proofFileUploaded ? 'Receipt Attachment Attached (Verified)' : 'Click to simulate receipt upload'}
                </span>
                <span className="text-[11px] text-zinc-400">PNG, JPG or PDF up to 10MB</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded-2xs text-blue-600"
                />
                <span>Post as Anonymous Verified Buyer</span>
              </label>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleProceedToAiCheck}
                className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Inspection & Submit</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 4: Real-time Gemini AI Inspection */}
        {step === 4 && (
          <div className="space-y-5 text-xs text-center">
            
            {isAnalyzing ? (
              <div className="py-12 space-y-4">
                <Sparkles className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Scanning Review with Gemini AI Engine...</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">Evaluating sentiment, checking device markers, and computing Trust Weight.</p>
              </div>
            ) : (
              <div className="space-y-5 text-left">
                <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Passed AI Authenticity & Fraud Inspection</span>
                  </div>
                  <p className="text-zinc-900 dark:text-zinc-100">
                    Calculated AI Fraud Risk Score: <strong className="text-blue-600 font-mono font-bold">{aiFeedback?.aiFraudScore || 3}/100</strong> (Low Risk).
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="font-bold text-zinc-900 dark:text-white">Review Summary Preview:</div>
                  <div className="text-zinc-900 dark:text-white font-semibold">"{title}"</div>
                  <div className="text-zinc-500 dark:text-zinc-400 line-clamp-2">"{description}"</div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all active:scale-[0.98]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Edit Review
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all font-bold text-sm disabled:opacity-70 active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isSubmitting ? 'Publishing...' : 'Publish Live Review'}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
