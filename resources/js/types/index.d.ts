interface Post {
  id?: string;
  title?: string;
  slug?: string;
  metaDescription?: string;
  excerpt?: string;
  coverImage?: string;
  authorImage?: string;
  author?: string;
  category?: string;
  tags?: string[];
  seoTitle?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  keywords?: string;
  faqs?: { question: string; answer: string }[];
  howToSteps?: { name: string; text: string }[];
  localBusiness?: { name: string; telephone: string; ratingValue: string; reviewCount: string; priceRange: string; streetAddress: string; addressLocality: string; addressRegion: string; postalCode: string; addressCountry: string; };
  seoRating?: { ratingValue: string; reviewCount: string; };
  keyTakeaways?: string[];
  targetRegion?: string;
  targetLanguage?: string;
  contentScope?: 'global' | 'india' | 'regional';
  authorJobTitle?: string;
  authorBio?: string;
  authorSocials?: { twitter: string; linkedin: string; website: string };
  researchMethodology?: string;
  sources?: { title: string; url: string; type: 'primary' | 'secondary' }[];
  authorExperienceYears?: number;
  authorAwards?: string[];
  authorAlumniOf?: { name: string; sameAs: string }[];
  authorKnowsAbout?: { name: string; sameAs: string }[];
  semanticMentions?: { name: string; sameAs: string }[];
  isNoIndex?: boolean;
  isSponsored?: boolean;
  isPillarPage?: boolean;
  isAiAssisted?: boolean;
  reviewCycleDays?: number;
  nextReviewDate?: string;
  corrections?: { date: string; note: string }[];
  factCheckedBy?: string;
  factCheckerRole?: string;
  content?: string;
  date?: string;
  published?: boolean;
  searchIntent?: string;
  seoScore?: number;
  focusKeyword?: string;
  lsiKeywords?: string[];
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  coverImageAlt?: string;
}

interface WebStory {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  seoTitle?: string;
  category?: string;
  tags?: string[];
  posterImage?: string;
  squarePoster?: string;
  landscapePoster?: string;
  date?: string;
  lastModified?: string;
  author?: string;
  authorBio?: string;
  authorImage?: string;
  authorSocials?: { twitter?: string; linkedin?: string; website?: string };
  publisherLogo?: string;
  slides?: { id: string; image: string; text: string }[];
  published?: boolean;
  isSponsored?: boolean;
  isNoIndex?: boolean;
}

interface Window {
  BASE_PATH?: string;
}

