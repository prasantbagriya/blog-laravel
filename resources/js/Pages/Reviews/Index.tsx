/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import './index.css';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { BusinessCard } from './components/BusinessCard';
import { BusinessProfileView } from './components/BusinessProfileView';
import { SubmitReviewModal } from './components/SubmitReviewModal';
import { CreateBusinessModal } from './components/CreateBusinessModal';
import { BusinessDashboard } from './components/BusinessDashboard';
import { ModeratorPanel } from './components/ModeratorPanel';
import { AiSearchModal } from './components/AiSearchModal';
import { ApiDocsModal } from './components/ApiDocsModal';

import { UserRole, Business, Category, Review, ReviewCampaign } from './types';
import { INITIAL_CATEGORIES } from './data/mockData';

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
                setShowSearchModal(true);
              }}
              onOpenAiAssistant={() => setShowSearchModal(true)}
              categories={categories}
              onSelectCategory={handleSelectCategory}
              trendingBusinesses={businesses}
              onSelectBusiness={handleSelectBusiness}
            />

            <CategoryGrid categories={categories} onSelectCategory={handleSelectCategory} />

            {/* Featured Verified Companies Showcase */}
            <section className="py-16 bg-slate-50 border-y border-slate-200 dark:bg-zinc-900 dark:border-zinc-800">
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
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white text-center font-medium py-2.5 rounded-md transition-colors text-sm shadow-md"
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
                
                <div className="mt-8 text-center md:hidden">
                  <Link
                      href="/reviews"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white text-center font-medium py-2.5 rounded-md transition-colors text-sm shadow-md"
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
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {selectedCategorySlug === 'all'
                    ? 'All Verified Businesses Directory'
                    : categories.find((c) => c.slug === selectedCategorySlug)?.name || 'Category Directory'}
                </h1>
                <p className="text-xs text-zinc-500 mt-1">
                  Showing {directoryBusinesses.length} verified companies evaluated by real customer feedback.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 text-xs">
                <button
                  onClick={() => setSelectedCategorySlug('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                    selectedCategorySlug === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  All ({businesses.length})
                </button>

                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategorySlug(c.slug)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                      selectedCategorySlug === c.slug
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

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

          <BlogFooter />
        </div>
      </div>
    </>
  );
}
