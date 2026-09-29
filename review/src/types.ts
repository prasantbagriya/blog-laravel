export type UserRole = 'visitor' | 'reviewer' | 'business_owner' | 'moderator' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export type CategorySlug = 
  | 'saas' 
  | 'ai-tools' 
  | 'ecommerce' 
  | 'hospitals' 
  | 'hosting' 
  | 'coaching' 
  | 'hotels' 
  | 'finance' 
  | 'crypto' 
  | 'education' 
  | 'real-estate';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  iconName: string;
  description: string;
  businessCount: number;
  subcategories: string[];
}

export interface CategoryRatings {
  support: number;
  quality: number;
  delivery: number;
  pricing: number;
  communication: number;
  value: number;
}

export interface ReviewProof {
  type: 'invoice' | 'receipt' | 'order_number' | 'whatsapp' | 'otp';
  proofUrl?: string;
  orderNumber?: string;
  verifiedAt: string;
}

export interface BusinessReply {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface Review {
  id: string;
  businessId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewerLocation: string;
  reviewerBadges: string[];
  reviewerTotalReviews: number;
  isVerifiedPurchase: boolean;
  isAnonymous: boolean;
  proof?: ReviewProof;
  rating: number; // 1 to 5
  categoryRatings: CategoryRatings;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  images?: string[];
  createdAt: string;
  helpfulCount: number;
  unhelpfulCount: number;
  userHelpfulState?: 'up' | 'down' | null;
  businessReply?: BusinessReply;
  aiFraudScore: number; // 0 to 100 (0 = authentic, 100 = high risk fake)
  aiFraudReason?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'published' | 'under_review' | 'flagged' | 'rejected';
  deviceFingerprint?: string;
  ipLocation?: string;
}

export interface ProductOrService {
  id: string;
  name: string;
  description: string;
  price?: string;
  imageUrl?: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  category: CategorySlug;
  categoryName: string;
  subcategory: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  openingHours: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    github?: string;
  };
  rating: number; // 1.0 - 5.0
  reviewCount: number;
  trustScore: number; // 0 - 100
  isVerified: boolean;
  claimedByOwner: boolean;
  verifiedBadgeType?: 'gold' | 'silver' | 'standard';
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categoryAverages: CategoryRatings;
  followersCount: number;
  aiSummary?: {
    positiveHighlights: string[];
    criticalPoints: string[];
    overallSentiment: string;
    healthScore: number; // 0 - 100
    lastUpdated: string;
  };
  products?: ProductOrService[];
  faqs?: { question: string; answer: string }[];
  tags: string[];
  monthlyVisitorsCount?: number;
}

export interface AiReviewAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  aiFraudScore: number; // 0 - 100
  fraudRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
  extractedPros: string[];
  extractedCons: string[];
  suggestedTags: string[];
  trustMultiplier: number;
}

export interface CompetitorComparison {
  targetBusinessName: string;
  competitorName: string;
  comparisonSummary: string;
  keyAdvantages: string[];
  areasOfImprovement: string[];
  trustScoreDiff: number;
  pricingComparison: string;
  supportComparison: string;
}

export interface ReviewCampaign {
  id: string;
  businessId: string;
  name: string;
  type: 'email' | 'whatsapp' | 'sms' | 'qr_code';
  status: 'active' | 'completed' | 'draft';
  totalSent: number;
  reviewsCollected: number;
  conversionRate: number;
  createdAt: string;
}

export interface EmbedWidgetConfig {
  theme: 'light' | 'dark' | 'glass';
  style: 'badge_horizontal' | 'badge_compact' | 'carousel' | 'review_card';
  showTrustScore: boolean;
  showStarRating: boolean;
  primaryColor: string;
  badgeRadius: 'sm' | 'md' | 'lg' | 'full';
}

export interface OcrReceiptResult {
  orderNumber: string;
  vendorName: string;
  date: string;
  totalAmount: string;
  confidenceScore: number;
  detectedItems: string[];
  isTampered: boolean;
  verifiedStatus: 'VERIFIED_GENUINE' | 'FLAGGED_MISMATCH' | 'MANUAL_REVIEW_NEEDED';
  ocrRawText?: string;
}

export interface AiExecutiveDigest {
  businessName: string;
  executiveSummary: string;
  customerLoyaltyIndex: number;
  churnRiskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  recommendedActionSteps: string[];
  generatedAt: string;
}

export interface ClaimVerificationState {
  isClaimed: boolean;
  ownerEmail?: string;
  companyRegNumber?: string;
  verificationMethod: 'dns_record' | 'corporate_email' | 'gst_tax_invoice';
  verifiedAt?: string;
}
