/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, MessageSquare, HelpCircle, Grid3X3 } from 'lucide-react';
import './index.css';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import { PageHero } from '../../NextComponents/UI';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { BusinessCard } from './components/BusinessCard';
import { BusinessProfileView } from './components/BusinessProfileView';
import { BusinessDashboard } from './components/BusinessDashboard';
import { ModeratorPanel } from './components/ModeratorPanel';

const SubmitReviewModal = React.lazy(() => import('./components/SubmitReviewModal').then(module => ({ default: module.SubmitReviewModal })));
const CreateBusinessModal = React.lazy(() => import('./components/CreateBusinessModal').then(module => ({ default: module.CreateBusinessModal })));
const AiSearchModal = React.lazy(() => import('./components/AiSearchModal').then(module => ({ default: module.AiSearchModal })));
const ApiDocsModal = React.lazy(() => import('./components/ApiDocsModal').then(module => ({ default: module.ApiDocsModal })));

import { UserRole, Business, Category, Review, ReviewCampaign } from './types';
import { INITIAL_CATEGORIES } from './data/mockData';


const ReviewsFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How are businesses verified on this platform?",
      answer: "Every business listed goes through our editorial verification process. We cross-check business registration details, customer invoices, and use AI fraud detection to assign a Trust Score from 0–100. Only genuine businesses with real customer interactions make it to our catalog."
    },
    {
      question: "Can I trust the reviews on this platform?",
      answer: "Yes. Our reviews are submitted by verified users who have actually interacted with the business. We use AI-powered review analysis to detect fake or biased reviews and remove them before they're published."
    },
    {
      question: "How do I write a review for a business?",
      answer: "Simply search for the business, visit its profile page, and click 'Write a Review'. You'll need to be logged in. Rate the business across multiple dimensions and share your experience in detail — the more specific, the more helpful."
    },
    {
      question: "How can a business owner manage their listing?",
      answer: "Business owners can claim their listing by creating an account and verifying ownership. Once verified, you can update your business information, respond to reviews, add photos, and access your Business Dashboard for analytics."
    },
    {
      question: "What does the Trust Score mean?",
      answer: "The Trust Score (0–100) is our proprietary rating that combines verified review scores, AI fraud analysis, editorial assessments, and customer invoice data. A score above 80 indicates a highly trustworthy and well-performing business."
    },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800/60 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-amber-100 dark:bg-amber-900/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Left Column: Sticky Title & CTA */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-6">
                <MessageSquare className="w-4 h-4" /> Got Questions?
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                Frequently Asked <span className="text-blue-500">Questions</span>
              </h2>
              <p className="text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed">
                Everything you need to know about our verified business directory, reviews, and Trust Scores.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Still have questions?</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">Contact our team and we'll help you find the right answers.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`group border rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? 'bg-white dark:bg-zinc-900 shadow-xl shadow-blue-900/5 border-blue-200 dark:border-blue-500/30 ring-1 ring-blue-100 dark:ring-blue-500/20' : 'bg-white/60 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-white dark:hover:bg-zinc-900 backdrop-blur-sm'}`}
                >
                  <button
                    className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none focus:ring-0 ring-0 border-none bg-transparent cursor-pointer"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className={`font-bold text-base sm:text-lg pr-4 transition-colors duration-300 ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-180 shadow-md shadow-blue-600/20' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-500'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 pb-6">
                        <div className="w-full h-px bg-slate-200 dark:bg-zinc-700 mb-5"></div>
                        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-base m-0">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App({ auth, initialView = 'home', initialCategorySlug = 'all', businessData = null }: { auth?: any, initialView?: string, initialCategorySlug?: string, businessData?: Business | null }) {
  const authUser = auth?.user;
  // Application State
  const [currentRole, setCurrentRole] = useState<UserRole>(authUser?.role || 'visitor');
  const [activeView, setActiveView] = useState<'home' | 'directory' | 'profile' | 'dashboard' | 'moderation' | 'admin'>(initialView as any);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategorySlug);
  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState<string | null>(businessData ? businessData.slug : null);
  const [viewedBusiness, setViewedBusiness] = useState<Business | null>(businessData);

  // Modals
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [showCreateBusinessModal, setShowCreateBusinessModal] = useState(false);
  const [showEditBusinessModal, setShowEditBusinessModal] = useState(false);
  const [showApiDocsModal, setShowApiDocsModal] = useState(false);
  const [preselectedBusinessId, setPreselectedBusinessId] = useState<string | undefined>(undefined);

  // Theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Data State
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentReviews, setCurrentReviews] = useState<Review[]>([]);
  const [moderationQueue, setModerationQueue] = useState<Review[]>([]);
  const [campaigns, setCampaigns] = useState<ReviewCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Toggle Dark Mode
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Fetch initial businesses from server API
  const fetchBusinesses = async () => {
    try {
      const res = await fetch('/api/businesses', {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBusinesses(data);
      } else {
        console.error('Expected array, got:', data);
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reviews for selected business
  const fetchReviewsForBusiness = async (slugOrId: string) => {
    try {
      const res = await fetch(`/api/businesses/${slugOrId}/reviews`, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCurrentReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Fetch moderation queue
  const fetchModerationQueue = async () => {
    try {
      const res = await fetch('/api/moderation/queue', {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setModerationQueue(data);
      }
    } catch (err) {
      console.error('Error fetching moderation queue:', err);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    fetchModerationQueue();
  }, []);

  // Sync state when Inertia props change (e.g. back/forward navigation)
  useEffect(() => {
    setActiveView(initialView as any);
    setSelectedCategorySlug(initialCategorySlug);
    setSelectedBusinessSlug(businessData ? businessData.slug : null);
    setViewedBusiness(businessData);
  }, [initialView, initialCategorySlug, businessData]);

  // When selectedBusinessSlug changes, fetch its detail & reviews
  useEffect(() => {
    if (selectedBusinessSlug) {
      fetchReviewsForBusiness(selectedBusinessSlug);
    }
  }, [selectedBusinessSlug]);

  // Handle selecting a business
  const handleSelectBusiness = (slug: string) => {
    const business = businesses.find((b) => b.slug === slug || b.id === slug);
    const catSlug = business?.category || 'coaching-institutes';
    router.visit(`/reviews/${catSlug}/${slug}`);
  };

  // Handle selecting a category
  const handleSelectCategory = (slug: string) => {
    if (slug === 'all') {
      router.visit('/reviews');
    } else {
      router.visit(`/reviews/${slug}`);
    }
  };

  // Handle Write Review modal trigger
  const handleOpenWriteReview = (businessId?: string) => {
    setPreselectedBusinessId(businessId);
    setShowWriteReviewModal(true);
  };

  // Handle Review Submission
  const handleSubmitReview = async (reviewData: any) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();

      if (data.review) {
        // Refresh businesses & reviews list
        await fetchBusinesses();
        if (selectedBusinessSlug) {
          await fetchReviewsForBusiness(selectedBusinessSlug);
        } else {
          setCurrentReviews((prev) => [data.review, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  // Handle Helpful Upvote / Downvote
  const handleVoteHelpful = async (reviewId: string, direction: 'up' | 'down') => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });
      const updated = await res.json();

      setCurrentReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: updated.helpfulCount, unhelpfulCount: updated.unhelpfulCount } : r))
      );
    } catch (err) {
      console.error('Error voting on review:', err);
    }
  };

  // Handle Flagging Review
  const handleFlagReview = async (reviewId: string) => {
    try {
      await fetch(`/api/reviews/${reviewId}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Flagged for Community Guidelines Inspection' }),
      });
      alert('Review submitted to AI moderation queue!');
      fetchModerationQueue();
    } catch (err) {
      console.error('Error flagging review:', err);
    }
  };

  // Handle Business Reply
  const handleAddReply = async (reviewId: string, replyText: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: 'Official Business Representative',
          authorRole: 'Manager',
          content: replyText,
        }),
      });
      const updated = await res.json();

      setCurrentReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, businessReply: updated.businessReply } : r))
      );
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  // Handle Moderator Action
  const handleModeratorAction = async (reviewId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      await fetch('/api/moderation/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action, notes }),
      });
      fetchModerationQueue();
      fetchBusinesses();
    } catch (err) {
      console.error('Error processing moderation action:', err);
    }
  };

  // Filtered businesses for Directory view
  const directoryBusinesses = businesses.filter((b) => {
    if (selectedCategorySlug !== 'all' && b.category !== selectedCategorySlug) {
      return false;
    }
    return true;
  });

  const selectedBusinessObject = businesses.find(
    (b) => b.slug === selectedBusinessSlug || b.id === selectedBusinessSlug
  ) || businesses[0];

  return (
    <>
      <Head>
        {activeView === 'profile' && viewedBusiness ? (
          <>
            <title>{`${viewedBusiness.name} Reviews & Trust Score | TrustPulse`}</title>
            <meta name="description" content={`Read ${viewedBusiness.reviewCount} verified reviews for ${viewedBusiness.name}. Trust score: ${viewedBusiness.trustScore}/100. ${viewedBusiness.description}`} />
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": viewedBusiness.name,
                "image": viewedBusiness.logo,
                "description": viewedBusiness.description,
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": viewedBusiness.rating,
                  "reviewCount": viewedBusiness.reviewCount,
                  "bestRating": 5,
                  "worstRating": 1
                }
              })}
            </script>
          </>
        ) : (
          <>
            <title>TrustPulse | Verified AI Software & SaaS Reviews</title>
            <meta name="description" content="Discover verified reviews for SaaS, AI tools, and online businesses. Real customer feedback powered by AI fraud detection." />
          </>
        )}
      </Head>
      
      <div className={`trustpulse-app min-h-screen flex flex-col font-sans transition-colors ${isDarkMode ? 'dark bg-zinc-950 text-white' : 'bg-white text-zinc-900'}`}>
        <div className="flex-1 overflow-auto">
          {/* Main Header / Navigation */}
          <GlobalNavbar />

          <main className="min-h-screen">
        
        {/* VIEW 1: HOME */}
        {activeView === 'home' && (
          <div>
            <HeroSection
              onSearchSubmit={(q) => {
                window.location.href = `/search?q=${encodeURIComponent(q)}&tab=businesses`;
              }}
              onOpenAiAssistant={() => setShowSearchModal(true)}
              categories={categories}
              onSelectCategory={handleSelectCategory}
              trendingBusinesses={businesses}
              onSelectBusiness={handleSelectBusiness}
            />

            <CategoryGrid categories={categories} onSelectCategory={handleSelectCategory} />

            {/* Featured Verified Companies Showcase */}
            <section className="pt-16 pb-0 bg-slate-50 border-y border-slate-200 dark:bg-zinc-900 dark:border-zinc-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <div className="text-amber-500 text-sm font-bold uppercase tracking-wider mb-1">
                      Highest Trust Rating
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Verified Top Rated Companies
                    </h2>
                    <p className="text-slate-500 mt-2 text-base md:text-lg">Discover the most trusted institutions based on verified student reviews.</p>
                  </div>

                    <Link
                      href="/reviews"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      View All Directory ({businesses.length}) →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.slice(0, 6).map((biz) => (
                    <BusinessCard
                      key={biz.id}
                      business={biz}
                      onSelectBusiness={handleSelectBusiness}
                      onOpenWriteReview={handleOpenWriteReview}
                    />
                  ))}
                </div>
                
                <div className="mt-8 pb-8 text-center md:hidden">
                  <Link
                      href="/reviews"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      View All Directory ({businesses.length}) →
                    </Link>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: BUSINESS DIRECTORY */}
        {activeView === 'directory' && (
          <div className="w-full flex flex-col min-h-screen">
            {/* Custom Themed Directory Header */}
            <section className="relative w-full pt-32 pb-16 bg-slate-900 overflow-hidden">
              <div 
                  className="absolute inset-0 z-0 opacity-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url('/uploads/background.webp')`, filter: 'blur(8px)' }}
              ></div>
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/80 via-slate-900/95 to-slate-950"></div>
              
              <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase border border-blue-500/30 mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                    <Grid3X3 className="w-4 h-4" />
                    Verified Directory
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                    {selectedCategorySlug === 'all'
                      ? 'Global Business Directory'
                      : categories.find((c) => c.slug === selectedCategorySlug)?.name || 'Category Directory'}
                  </h1>
                  
                  <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Explore <span className="font-bold text-white">{directoryBusinesses.length}</span> highly-rated companies, meticulously evaluated by real customers and AI fraud detection.
                  </p>

                  {/* Enhanced Category Filter Chips */}
                  <div className="w-full flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => setSelectedCategorySlug('all')}
                      className={`px-5 py-2.5 rounded-full font-bold transition-all duration-300 text-sm shadow-sm ${
                        selectedCategorySlug === 'all'
                          ? 'bg-blue-600 text-white shadow-blue-600/30 scale-105 border-none outline-none focus:outline-none ring-0 focus:ring-0'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50 backdrop-blur-sm'
                      }`}
                    >
                      All Categories
                    </button>

                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategorySlug(c.slug)}
                        className={`px-5 py-2.5 rounded-full font-bold transition-all duration-300 text-sm shadow-sm ${
                          selectedCategorySlug === c.slug
                            ? 'bg-blue-600 text-white shadow-blue-600/30 scale-105 border-none outline-none focus:outline-none ring-0 focus:ring-0'
                            : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50 backdrop-blur-sm'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Grid Container */}
            <div className="flex-grow py-16 bg-slate-50 dark:bg-zinc-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {directoryBusinesses.map((biz) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  onSelectBusiness={handleSelectBusiness}
                  onOpenWriteReview={handleOpenWriteReview}
                />
              ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: BUSINESS PROFILE */}
        {activeView === 'profile' && selectedBusinessObject && (
          <BusinessProfileView
            business={selectedBusinessObject}
            reviews={currentReviews}
            allBusinesses={businesses}
            onOpenWriteReview={handleOpenWriteReview}
            onOpenEditBusiness={() => setShowEditBusinessModal(true)}
            onVoteHelpful={handleVoteHelpful}
            onFlagReview={handleFlagReview}
            onAddReply={handleAddReply}
            authUser={authUser}
          />
        )}

        {/* VIEW 4: BUSINESS OWNER DASHBOARD */}
        {activeView === 'dashboard' && selectedBusinessObject && (
          <BusinessDashboard
            business={selectedBusinessObject}
            reviews={currentReviews}
            campaigns={campaigns}
            allBusinesses={businesses}
            onAddReply={handleAddReply}
          />
        )}

        {/* VIEW 5: MODERATOR QUEUE */}
        {activeView === 'moderation' && (
          <ModeratorPanel
            moderationQueue={moderationQueue}
            onModeratorAction={handleModeratorAction}
          />
        )}

      </main>

      {/* Modals */}
      <Suspense fallback={null}>
        {showSearchModal && (
          <AiSearchModal
            onClose={() => setShowSearchModal(false)}
            onSelectBusiness={handleSelectBusiness}
          />
        )}

        {showWriteReviewModal && (
          <SubmitReviewModal
            businesses={businesses}
            preselectedBusinessId={preselectedBusinessId}
            onClose={() => setShowWriteReviewModal(false)}
            onSubmit={handleSubmitReview}
          />
        )}

        {showCreateBusinessModal && (
          <CreateBusinessModal
            categories={categories}
            onClose={() => setShowCreateBusinessModal(false)}
            onSubmitSuccess={(newBusiness) => {
              setBusinesses([newBusiness, ...businesses]);
              setShowCreateBusinessModal(false);
              router.visit(`/reviews/${newBusiness.category}/${newBusiness.slug}`);
            }}
          />
        )}

        {showEditBusinessModal && selectedBusinessObject && (
          <CreateBusinessModal
            categories={categories}
            onClose={() => setShowEditBusinessModal(false)}
            onSubmitSuccess={(updatedBusiness) => {
              setShowEditBusinessModal(false);
              const index = businesses.findIndex(b => b.id === updatedBusiness.id);
              if (index !== -1) {
                const newBusinesses = [...businesses];
                newBusinesses[index] = updatedBusiness;
                setBusinesses(newBusinesses);
                if (viewedBusiness?.id === updatedBusiness.id) {
                  setViewedBusiness(updatedBusiness);
                }
              }
            }}
            initialData={selectedBusinessObject}
            isEdit={true}
          />
        )}

        {showApiDocsModal && (
          <ApiDocsModal onClose={() => setShowApiDocsModal(false)} />
        )}
      </Suspense>

          <ReviewsFAQ />
          <BlogFooter />
        </div>
      </div>
    </>
  );
}
