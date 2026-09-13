import { Business, Category, Review, ReviewCampaign } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'SaaS & Cloud Platforms',
    slug: 'saas',
    iconName: 'Cloud',
    description: 'Software-as-a-service, productivity tools, enterprise CRM, and cloud infrastructures.',
    businessCount: 1420,
    subcategories: ['CRM', 'Project Management', 'Analytics', 'DevOps', 'Security']
  },
  {
    id: 'cat-2',
    name: 'AI Tools & Models',
    slug: 'ai-tools',
    iconName: 'Sparkles',
    description: 'Generative AI, code assistants, LLM wrappers, speech synthesis, and image generators.',
    businessCount: 980,
    subcategories: ['Text Generation', 'Image AI', 'Voice Synthetic', 'Code Assistants', 'AI Agents']
  },
  {
    id: 'cat-3',
    name: 'E-commerce & Retail',
    slug: 'ecommerce',
    iconName: 'ShoppingBag',
    description: 'Online stores, direct-to-consumer brands, fashion hubs, and marketplace merchants.',
    businessCount: 3410,
    subcategories: ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Subscription Boxes']
  },
  {
    id: 'cat-4',
    name: 'Hospitals & Healthcare',
    slug: 'hospitals',
    iconName: 'Hospital',
    description: 'Medical centers, telehealth platforms, dental clinics, and specialized surgery hubs.',
    businessCount: 840,
    subcategories: ['Telehealth', 'Dental Clinics', 'Diagnostics', 'Speciality Care', 'Wellness']
  },
  {
    id: 'cat-5',
    name: 'Web Hosting & Servers',
    slug: 'hosting',
    iconName: 'Server',
    description: 'VPS providers, managed WordPress hosting, domain registrars, and CDN services.',
    businessCount: 530,
    subcategories: ['Cloud VPS', 'Managed WordPress', 'Dedicated Servers', 'Domain Registrars']
  },
  {
    id: 'cat-6',
    name: 'Coaching & Institutes',
    slug: 'coaching',
    iconName: 'GraduationCap',
    description: 'EdTech platforms, coding bootcamps, executive coaching, and competitive exam hubs.',
    businessCount: 1150,
    subcategories: ['Coding Bootcamps', 'Test Prep', 'Executive Coaching', 'Skill Academies']
  },
  {
    id: 'cat-7',
    name: 'Hotels & Hospitality',
    slug: 'hotels',
    iconName: 'Building',
    description: 'Boutique hotels, luxury resorts, vacation rentals, and business travel stays.',
    businessCount: 2190,
    subcategories: ['Luxury Resorts', 'Boutique Hotels', 'Serviced Apartments', 'Budget Stays']
  },
  {
    id: 'cat-8',
    name: 'Fintech & Banking',
    slug: 'finance',
    iconName: 'CreditCard',
    description: 'Digital banks, payment gateways, personal finance apps, and investment platforms.',
    businessCount: 1670,
    subcategories: ['Payment Gateways', 'Neobanks', 'Investment Apps', 'Lending Services']
  }
];

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz-1',
    name: 'Aether Cloud Engine',
    slug: 'aether-cloud',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    category: 'saas',
    categoryName: 'SaaS & Cloud Platforms',
    subcategory: 'DevOps & Hosting',
    description: 'Next-generation distributed serverless infrastructure with built-in instant global edge deployments and zero-cold-start runtime architecture.',
    website: 'https://aethercloud.example.io',
    phone: '+1 (800) 555-0199',
    email: 'support@aethercloud.example.io',
    address: '450 Silicon Avenue, San Francisco, CA',
    city: 'San Francisco',
    country: 'United States',
    openingHours: '24/7 Global Support',
    socialLinks: {
      twitter: 'https://twitter.com/aethercloud',
      github: 'https://github.com/aethercloud',
      linkedin: 'https://linkedin.com/company/aethercloud'
    },
    rating: 4.8,
    reviewCount: 428,
    trustScore: 96,
    isVerified: true,
    claimedByOwner: true,
    verifiedBadgeType: 'gold',
    ratingDistribution: {
      5: 360,
      4: 52,
      3: 12,
      2: 3,
      1: 1
    },
    categoryAverages: {
      support: 4.9,
      quality: 4.8,
      delivery: 4.9,
      pricing: 4.5,
      communication: 4.8,
      value: 4.7
    },
    followersCount: 12400,
    aiSummary: {
      positiveHighlights: [
        'Industry-leading 99.999% uptime benchmark with sub-10ms response latency.',
        'Extremely responsive engineering support team with average ticket resolution under 12 minutes.',
        'Seamless CLI migration tooling from AWS and GCP.'
      ],
      criticalPoints: [
        'Bandwidth overage pricing can be steep for high-volume video streaming users.',
        'Documentation for legacy C++ SDK bindings could use more code examples.'
      ],
      overallSentiment: 'Overwhelmingly positive community sentiment focused on reliability, lightning speed, and elite developer experience.',
      healthScore: 95,
      lastUpdated: '2026-08-10'
    },
    products: [
      { id: 'p1', name: 'Serverless Edge Functions', description: 'Deploy V8 isolates in 32 regions worldwide.', price: '$0.15/1M requests' },
      { id: 'p2', name: 'Global Key-Value Store', description: 'Ultra low-latency replicated storage.', price: '$0.50/GB' }
    ],
    faqs: [
      { question: 'Does Aether Cloud offer SLA guarantees?', answer: 'Yes, enterprise plans come with a 99.99% uptime guarantee backed by financial credits.' },
      { question: 'Is there a free tier for developers?', answer: 'We offer $25 free monthly credits forever for solo developers and open source projects.' }
    ],
    tags: ['Serverless', 'Edge Computing', 'Developer Tools', 'High Availability'],
    monthlyVisitorsCount: 185000
  },
  {
    id: 'biz-2',
    name: 'NeuralCraft AI Studio',
    slug: 'neuralcraft-ai',
    logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    category: 'ai-tools',
    categoryName: 'AI Tools & Models',
    subcategory: 'AI Agents & Code',
    description: 'Autonomous AI design and engineering workspace for generating production-ready full-stack web applications and brand assets in seconds.',
    website: 'https://neuralcraft.example.ai',
    phone: '+1 (888) 901-2244',
    email: 'contact@neuralcraft.example.ai',
    address: '101 AI Way, Austin, TX',
    city: 'Austin',
    country: 'United States',
    openingHours: 'Mon - Fri: 8:00 AM - 8:00 PM CST',
    socialLinks: {
      twitter: 'https://twitter.com/neuralcraft_ai',
      github: 'https://github.com/neuralcraft',
      linkedin: 'https://linkedin.com/company/neuralcraft'
    },
    rating: 4.7,
    reviewCount: 312,
    trustScore: 92,
    isVerified: true,
    claimedByOwner: true,
    verifiedBadgeType: 'gold',
    ratingDistribution: {
      5: 250,
      4: 45,
      3: 11,
      2: 4,
      1: 2
    },
    categoryAverages: {
      support: 4.7,
      quality: 4.8,
      delivery: 4.9,
      pricing: 4.4,
      communication: 4.6,
      value: 4.7
    },
    followersCount: 8900,
    aiSummary: {
      positiveHighlights: [
        'Revolutionary speed in generating multi-file TypeScript code structure.',
        'High compliance with modern design systems and custom Tailwind themes.',
        'Accurate real-time code error fixing and self-healing build system.'
      ],
      criticalPoints: [
        'Occasional context limits when handling projects over 50,000 lines of code.',
        'Requires clear initial prompt parameters for best results.'
      ],
      overallSentiment: 'Strongly recommended by developers and product founders for rapid prototyping and production code execution.',
      healthScore: 92,
      lastUpdated: '2026-08-11'
    },
    products: [
      { id: 'nc1', name: 'NeuralCraft Pro Agent', description: 'Unlimited code generations & server-side AI integrations.', price: '$29/month' },
      { id: 'nc2', name: 'Team Workspace', description: 'Multi-seat collaborative editing with custom LLM finetuning.', price: '$79/seat/month' }
    ],
    faqs: [
      { question: 'Do I own the generated source code?', answer: '100% yes. All code generated is royalty-free and open for commercial deployment.' }
    ],
    tags: ['AI Agent', 'Code Generation', 'React', 'TypeScript'],
    monthlyVisitorsCount: 220000
  },
  {
    id: 'biz-3',
    name: 'NovaPay Global',
    slug: 'novapay-global',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67dd385750?w=1200&auto=format&fit=crop&q=80',
    category: 'finance',
    categoryName: 'Fintech & Banking',
    subcategory: 'Payment Gateways',
    description: 'Borderless cross-border merchant checkout infrastructure, instant multi-currency settlement, and AI chargeback protection.',
    website: 'https://novapay.example.com',
    phone: '+44 20 7946 0912',
    email: 'help@novapay.example.com',
    address: '1 Fore Street, London, EC2Y 9DT',
    city: 'London',
    country: 'United Kingdom',
    openingHours: '24/7 Support',
    socialLinks: {
      twitter: 'https://twitter.com/novapay_global',
      linkedin: 'https://linkedin.com/company/novapay'
    },
    rating: 4.6,
    reviewCount: 689,
    trustScore: 90,
    isVerified: true,
    claimedByOwner: true,
    verifiedBadgeType: 'silver',
    ratingDistribution: {
      5: 510,
      4: 120,
      3: 38,
      2: 14,
      1: 7
    },
    categoryAverages: {
      support: 4.6,
      quality: 4.7,
      delivery: 4.8,
      pricing: 4.3,
      communication: 4.5,
      value: 4.6
    },
    followersCount: 15300,
    aiSummary: {
      positiveHighlights: [
        'Instant payout approval within 15 minutes for verified international businesses.',
        'Zero setup fee with transparent 1.4% transaction fee pricing.',
        'Integrated multi-currency wallets supporting 45+ fiat and stablecoins.'
      ],
      criticalPoints: [
        'KYC compliance verification can take up to 48 hours during peak signup weeks.',
        'Some regional debit cards in Latin America require secondary 3DS verification.'
      ],
      overallSentiment: 'Highly trusted payment platform praised for low transaction friction and responsive merchant portal.',
      healthScore: 89,
      lastUpdated: '2026-08-09'
    },
    products: [
      { id: 'np1', name: 'Global Hosted Checkout', description: 'One-click checkout conversion booster.', price: '1.4% per txn' }
    ],
    faqs: [
      { question: 'What countries are supported?', answer: 'We process payments across 140+ countries with local card acquirers.' }
    ],
    tags: ['Fintech', 'Payment Gateway', 'Cross-Border', 'Merchant Account'],
    monthlyVisitorsCount: 450000
  },
  {
    id: 'biz-4',
    name: 'ApexMed Care Institute',
    slug: 'apexmed-care',
    logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&auto=format&fit=crop&q=80',
    category: 'hospitals',
    categoryName: 'Hospitals & Healthcare',
    subcategory: 'Speciality Care',
    description: 'Premier multi-specialty medical hub equipped with robotic surgery suites, AI diagnostic imaging, and world-class cardiology care.',
    website: 'https://apexmedcare.example.org',
    phone: '+1 (800) 789-3200',
    email: 'appointments@apexmedcare.example.org',
    address: '700 Health Sciences Blvd, Boston, MA',
    city: 'Boston',
    country: 'United States',
    openingHours: 'Emergency 24/7 | Clinics 8am - 8pm',
    socialLinks: {
      facebook: 'https://facebook.com/apexmedcare',
      linkedin: 'https://linkedin.com/company/apexmed'
    },
    rating: 4.9,
    reviewCount: 512,
    trustScore: 98,
    isVerified: true,
    claimedByOwner: true,
    verifiedBadgeType: 'gold',
    ratingDistribution: {
      5: 470,
      4: 32,
      3: 7,
      2: 2,
      1: 1
    },
    categoryAverages: {
      support: 4.9,
      quality: 5.0,
      delivery: 4.8,
      pricing: 4.2,
      communication: 4.9,
      value: 4.8
    },
    followersCount: 21000,
    aiSummary: {
      positiveHighlights: [
        'Compassionate medical staff and top-tier surgeons renowned for robotic procedure precision.',
        'Ultra-clean private recovery suites with digital patient monitoring tablets.',
        'Minimal wait times for specialist consultations.'
      ],
      criticalPoints: [
        'Out-of-network insurance billing requires advance coordination.',
        'On-site parking structure gets busy during afternoon visiting hours.'
      ],
      overallSentiment: 'Flawless patient satisfaction ratings highlighting medical excellence, cleanliness, and human care.',
      healthScore: 98,
      lastUpdated: '2026-08-11'
    },
    products: [],
    faqs: [
      { question: 'Do you accept international insurance policies?', answer: 'Yes, our international patient desk coordinates directly with major global health insurers.' }
    ],
    tags: ['Hospital', 'Robotic Surgery', 'Cardiology', 'Telehealth'],
    monthlyVisitorsCount: 95000
  },
  {
    id: 'biz-5',
    name: 'Velocity Host Pro',
    slug: 'velocity-host',
    logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    category: 'hosting',
    categoryName: 'Web Hosting & Servers',
    subcategory: 'Cloud VPS',
    description: 'High-performance NVMe SSD cloud servers powered by AMD EPYC processors with built-in DDoS mitigation and 10Gbps unmetered connections.',
    website: 'https://velocityhost.example.net',
    phone: '+1 (800) 402-9911',
    email: 'support@velocityhost.example.net',
    address: '12 Data Center Drive, Ashburn, VA',
    city: 'Ashburn',
    country: 'United States',
    openingHours: '24/7 Datacenter Ops',
    socialLinks: {
      twitter: 'https://twitter.com/velocityhost'
    },
    rating: 4.5,
    reviewCount: 380,
    trustScore: 88,
    isVerified: true,
    claimedByOwner: true,
    verifiedBadgeType: 'standard',
    ratingDistribution: {
      5: 270,
      4: 70,
      3: 25,
      2: 10,
      1: 5
    },
    categoryAverages: {
      support: 4.6,
      quality: 4.7,
      delivery: 4.8,
      pricing: 4.7,
      communication: 4.3,
      value: 4.7
    },
    followersCount: 6200,
    tags: ['VPS Hosting', 'NVMe Storage', 'DDoS Protection', 'Linux Servers'],
    monthlyVisitorsCount: 110000
  },
  {
    id: 'biz-6',
    name: 'ByteAcademy Tech Institute',
    slug: 'byteacademy-tech',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    category: 'coaching',
    categoryName: 'Coaching & Institutes',
    subcategory: 'Coding Bootcamps',
    description: 'Immersive 12-week Full-Stack Software Engineering and AI Application Development Bootcamp with 94% job placement guarantee within 180 days.',
    website: 'https://byteacademy.example.edu',
    phone: '+1 (888) 321-CODE',
    email: 'admissions@byteacademy.example.edu',
    address: '22 Campus Way, Seattle, WA',
    city: 'Seattle',
    country: 'United States',
    openingHours: 'Mon - Sat: 9:00 AM - 9:00 PM PST',
    socialLinks: {
      linkedin: 'https://linkedin.com/school/byteacademy',
      twitter: 'https://twitter.com/byteacademy'
    },
    rating: 4.8,
    reviewCount: 295,
    trustScore: 94,
    isVerified: true,
    claimedByOwner: true,
    verifiedBadgeType: 'gold',
    ratingDistribution: {
      5: 245,
      4: 40,
      3: 7,
      2: 2,
      1: 1
    },
    categoryAverages: {
      support: 4.9,
      quality: 4.9,
      delivery: 4.8,
      pricing: 4.4,
      communication: 4.8,
      value: 4.8
    },
    followersCount: 14200,
    tags: ['Bootcamp', 'Full Stack', 'AI Engineering', 'Career Coaching'],
    monthlyVisitorsCount: 130000
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    businessId: 'biz-1',
    reviewerName: 'Marcus Vance',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    reviewerLocation: 'San Francisco, USA',
    reviewerBadges: ['Top Tech Reviewer', 'Verified Buyer', 'Power Author'],
    reviewerTotalReviews: 48,
    isVerifiedPurchase: true,
    isAnonymous: false,
    proof: {
      type: 'invoice',
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      orderNumber: 'INV-AETHER-2026-8891',
      verifiedAt: '2026-08-05'
    },
    rating: 5,
    categoryRatings: {
      support: 5,
      quality: 5,
      delivery: 5,
      pricing: 4,
      communication: 5,
      value: 5
    },
    title: 'Migrated 12 microservices in under 4 hours. Absolute game changer.',
    description: 'We switched our production workload from traditional cloud VMs to Aether Cloud Edge Functions. The speed latency dropped from 140ms to 18ms globally. What impressed me most was the instant live support in Discord — an engineer actually looked at our deployment manifest and optimized our bundle size in real-time.',
    pros: [
      'Sub-20ms latency across US and Europe',
      'Extremely friendly and technical engineering support',
      'Seamless CLI integration with Vite and Next.js'
    ],
    cons: [
      'Dashboard analytics could have deeper per-route filtering'
    ],
    createdAt: '2026-08-06',
    helpfulCount: 34,
    unhelpfulCount: 1,
    businessReply: {
      id: 'rep-1',
      authorName: 'Elena Rostova (Head of Customer Success)',
      authorRole: 'Official Business Representative',
      content: 'Thank you Marcus! We are thrilled to hear your migration went so smoothly and that your global latency saw such a massive reduction. Per-route analytics filtering is actually launching in our v4.2 dashboard release next week!',
      createdAt: '2026-08-07',
      isAiGenerated: false
    },
    aiFraudScore: 2,
    sentiment: 'positive',
    status: 'published',
    deviceFingerprint: 'fp_macbook_chrome_8819',
    ipLocation: 'United States (AS15169)'
  },
  {
    id: 'rev-2',
    businessId: 'biz-1',
    reviewerName: 'Sophia Lin',
    reviewerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    reviewerLocation: 'Toronto, Canada',
    reviewerBadges: ['Verified Buyer'],
    reviewerTotalReviews: 12,
    isVerifiedPurchase: true,
    isAnonymous: false,
    proof: {
      type: 'order_number',
      orderNumber: 'ORD-AETH-9021',
      verifiedAt: '2026-08-08'
    },
    rating: 4,
    categoryRatings: {
      support: 5,
      quality: 4,
      delivery: 5,
      pricing: 4,
      communication: 4,
      value: 4
    },
    title: 'Solid infrastructure, transparent pricing, great documentation.',
    description: 'Great developer portal and easy API key management. My only minor wish is better support for Python isolated environments, but Node/TypeScript and Rust workloads run flawlessly.',
    pros: ['Zero downtime during high traffic spike', 'Simple API key permissions'],
    cons: ['Python isolations need faster cold start times'],
    createdAt: '2026-08-09',
    helpfulCount: 18,
    unhelpfulCount: 0,
    aiFraudScore: 4,
    sentiment: 'positive',
    status: 'published'
  },
  {
    id: 'rev-3',
    businessId: 'biz-2',
    reviewerName: 'Devon Wright',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    reviewerLocation: 'Austin, TX',
    reviewerBadges: ['Startup Founder', 'Verified Buyer'],
    reviewerTotalReviews: 29,
    isVerifiedPurchase: true,
    isAnonymous: false,
    rating: 5,
    categoryRatings: {
      support: 5,
      quality: 5,
      delivery: 5,
      pricing: 5,
      communication: 4,
      value: 5
    },
    title: 'Built our MVP landing page & full database integration in 20 minutes.',
    description: 'NeuralCraft AI generated clean React components with Tailwind utility classes that matched our Figma design guidelines almost 1-to-1. The server-side Gemini route code generated was production clean with proper type annotations.',
    pros: ['Generates clean modular TypeScript code', 'Tailwind CSS classes are idiomatic', 'High fidelity visual execution'],
    cons: ['Make sure to specify exact layout details in prompt'],
    createdAt: '2026-08-10',
    helpfulCount: 42,
    unhelpfulCount: 2,
    businessReply: {
      id: 'rep-2',
      authorName: 'NeuralCraft Founder Team',
      authorRole: 'Business Representative',
      content: 'Thanks Devon! Glad we saved you weeks of initial scaffolding time. Keep shipping!',
      createdAt: '2026-08-11',
      isAiGenerated: true
    },
    aiFraudScore: 3,
    sentiment: 'positive',
    status: 'published'
  }
];

export const INITIAL_CAMPAIGNS: ReviewCampaign[] = [
  {
    id: 'camp-1',
    businessId: 'biz-1',
    name: 'Post-Onboarding Email Pulse',
    type: 'email',
    status: 'active',
    totalSent: 1250,
    reviewsCollected: 184,
    conversionRate: 14.7,
    createdAt: '2026-07-15'
  },
  {
    id: 'camp-2',
    businessId: 'biz-1',
    name: 'In-App QR Code Counter Display',
    type: 'qr_code',
    status: 'active',
    totalSent: 850,
    reviewsCollected: 142,
    conversionRate: 16.7,
    createdAt: '2026-08-01'
  }
];
