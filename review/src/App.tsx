/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { CategoryGrid } from './components/CategoryGrid';
import { BusinessCard } from './components/BusinessCard';
import { BusinessProfileView } from './components/BusinessProfileView';
import { SubmitReviewModal } from './components/SubmitReviewModal';
import { BusinessDashboard } from './components/BusinessDashboard';
import { ModeratorPanel } from './components/ModeratorPanel';
import { AdminPanel } from './components/AdminPanel';
import { AiSearchModal } from './components/AiSearchModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { Seo } from './components/Seo';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

import { UserRole, Business, Category, Review, ReviewCampaign } from './types';
import { INITIAL_CATEGORIES } from './data/mockData';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Application State
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor');
  const [activeView, setActiveView] = useState<'home' | 'directory' | 'profile' | 'dashboard' | 'moderation' | 'admin'>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState<string | null>(null);

  // Sync state with URL
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/business/')) {
      setActiveView('profile');
      setSelectedBusinessSlug(path.split('/')[2]);
    } else if (path.startsWith('/directory')) {
      setActiveView('directory');
      const parts = path.split('/');
      setSelectedCategorySlug(parts[2] || 'all');
    } else if (path === '/moderation') {
      setActiveView('moderation');
    } else if (path === '/admin') {
      setActiveView('admin');
    } else if (path === '/dashboard') {
      setActiveView('dashboard');
    } else {
      setActiveView('home');
    }
  }, [location.pathname]);

  // Modals
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [showApiDocsModal, setShowApiDocsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
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
      const res = await fetch('/api/businesses');
      const data = await res.json();
      setBusinesses(data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reviews for selected business
  const fetchReviewsForBusiness = async (slugOrId: string) => {
    try {
      const res = await fetch(`/api/businesses/${slugOrId}/reviews`);
      const data = await res.json();
      setCurrentReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Fetch moderation queue
  const fetchModerationQueue = async () => {
    try {
      const res = await fetch('/api/moderation/queue');
      const data = await res.json();
      setModerationQueue(data);
    } catch (err) {
      console.error('Error fetching moderation queue:', err);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    fetchModerationQueue();
  }, []);

  // When selectedBusinessSlug changes, fetch its detail & reviews
  useEffect(() => {
    if (selectedBusinessSlug) {
      fetchReviewsForBusiness(selectedBusinessSlug);
    }
  }, [selectedBusinessSlug]);

  // Handle selecting a business
  const handleSelectBusiness = (slug: string) => {
    navigate('/business/' + slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle selecting a category
  const handleSelectCategory = (slug: string) => {
    navigate('/directory/' + (slug === 'all' ? '' : slug));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${isDarkMode ? 'dark bg-zinc-950 text-white' : 'bg-white text-zinc-900'}`}>
      
      {/* Navigation Header */}
      <Navbar
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenWriteReview={() => handleOpenWriteReview()}
        onSelectCategory={handleSelectCategory}
        onNavigateHome={() => navigate('/')}
        categories={categories}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeView={activeView}
        onNavigateView={(v) => navigate('/' + v)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
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
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Highest Trust Rating
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                    Verified Top Rated Companies
                  </h2>
                </div>

                <button
                  onClick={() => navigate('/directory')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View All Directory ({businesses.length}) →
                </button>
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
            </section>
          </div>
        )}

        {/* VIEW 2: BUSINESS DIRECTORY */}
        {activeView === 'directory' && (
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Seo
              title={selectedCategorySlug === 'all'
                ? 'All Verified Businesses Directory | TrustPulse AI'
                : `${categories.find((c) => c.slug === selectedCategorySlug)?.name || 'Category'} Directory | TrustPulse AI`}
              description={`Browse ${directoryBusinesses.length} verified companies evaluated by real customer feedback.`}
              schema={{
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": directoryBusinesses.map((biz, index) => ({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "LocalBusiness",
                    "name": biz.name,
                    "image": biz.logo,
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": biz.city,
                      "addressCountry": biz.country
                    },
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": biz.rating,
                      "reviewCount": biz.reviewCount
                    }
                  }
                }))
              }}
            />
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
            onVoteHelpful={handleVoteHelpful}
            onFlagReview={handleFlagReview}
            onAddReply={handleAddReply}
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

        {/* VIEW 6: SUPER ADMIN PANEL */}
        {activeView === 'admin' && (
          <AdminPanel businesses={businesses} reviews={currentReviews} />
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

      {showApiDocsModal && (
        <ApiDocsModal onClose={() => setShowApiDocsModal(false)} />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Footer */}
      <Footer
        onOpenApiDocs={() => setShowApiDocsModal(true)}
        onSelectCategory={handleSelectCategory}
      />

    </div>
  );
}
