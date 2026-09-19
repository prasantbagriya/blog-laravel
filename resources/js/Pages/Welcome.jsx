import GlobalNavbar from '../NextComponents/GlobalNavbar';
import BlogFooter from '../NextComponents/BlogFooter';
import React, { useState, useEffect, Suspense } from 'react';
import AnimatedBorderCard from '../Components/AnimatedBorderCard';
const ShareModal = React.lazy(() => import('../Components/ShareModal'));
import { Search, ChevronRight, GraduationCap, Award, Star, ArrowRight, ShieldCheck, PlayCircle, Library, MapPin, CheckCircle2, MessageSquare, ThumbsUp, TrendingUp, ChevronDown, BookOpen, TestTube, Target, Scale, Beaker, Backpack, Share2, Bookmark } from 'lucide-react';

// The home page is served as a small standalone React application. These are
// intentionally regular links and fetch requests so it does not download the
// much larger Inertia application bundle just to render the public landing page.
const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>;

const navigate = (url) => window.location.assign(url);

const postHomeAction = async (url, data = {}) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
        body: JSON.stringify(data),
    });

    // Laravel's auth middleware and successful actions both redirect. Sending
    // the browser to that target preserves the old Inertia behaviour.
    if (response.redirected) {
        navigate(response.url);
        return;
    }

    if (response.ok) {
        window.location.reload();
    }
};

// Simple polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, className, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} className={className} {...props} />;
};

const HomeHero = ({ activeSlides, basePath, categories, featuredBusinesses, fallbackImage }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [suggestions, setSuggestions] = useState({ categories: [], businesses: [], blogs: [] });
    const [isLoading, setIsLoading] = useState(false);
    
    // Default fallback if no slides
    const validSlides = (activeSlides && activeSlides.length > 0) ? activeSlides : [
        { image_url: fallbackImage || '/images/672/background.webp' }
    ];

    useEffect(() => {
        if (validSlides.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlideIndex((prev) => (prev + 1) % validSlides.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [validSlides.length]);

    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            setIsLoading(true);
            const delayDebounceFn = setTimeout(() => {
                fetch(`${basePath || ''}/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`)
                    .then(res => res.json())
                    .then(data => {
                        setSuggestions(data);
                        setIsLoading(false);
                    })
                    .catch(err => {
                        console.error(err);
                        setIsLoading(false);
                    });
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setSuggestions({ categories: [], businesses: [], blogs: [], communities: [] });
            setIsLoading(false);
        }
    }, [searchQuery, basePath]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`${basePath || ''}/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden bg-slate-900">
            {/* Background Image Slider */}
            {validSlides.map((slide, index) => {
                const imgUrl = typeof slide === 'string' ? slide : (slide.image_url || slide.image || slide.coverImage);
                return (
                    <img
                        key={index}
                        src={imgUrl}
                        alt=""
                        aria-hidden="true"
                        fetchPriority={index === 0 ? 'high' : 'low'}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        decoding={index === 0 ? 'sync' : 'async'}
                        className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-1000 ${index === currentSlideIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                );
            })}
            
            <div className="absolute inset-0 z-0 bg-slate-900/80"></div>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 md:pt-32 md:pb-14">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div className="lg:col-span-7 text-white">
                        <p className="text-amber-400 text-xs font-bold tracking-[0.12em] mb-4">Coaching and School Discovery Platform</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold leading-[1.1] mb-6 tracking-tight">
                            Find the Best CoachinginSikar
                        </h1>
                        <p className="text-base md:text-lg text-white/80 max-w-xl mb-8">
                            Compare coaching institutes, courses, fees, results and student reviews — all in one place.
                        </p>

                        <div className="relative max-w-xl mb-6">
                            <form onSubmit={handleSearch}>
                                <AnimatedBorderCard containerClassName="rounded-full" className="rounded-full">
                                    <div className="flex items-center gap-2 bg-white px-2 py-2 group">
                                        <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" />
                                        <input 
                                            type="text" 
                                            name="q" 
                                            className="flex-1 border-0 outline-none focus:ring-0 text-slate-900 text-sm md:text-base py-2.5 bg-transparent placeholder-slate-400" 
                                            placeholder="Search coaching, courses, exams or institutes..." 
                                            value={searchQuery} 
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            autoComplete="off"
                                        />
                                        <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full px-6 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none ring-0 focus:ring-0">
                                            Search
                                        </button>
                                    </div>
                                </AnimatedBorderCard>
                                
                                {/* Search Suggestions Dropdown */}
                                {showSuggestions && searchQuery.trim().length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-100 max-h-[400px] overflow-y-auto">
                                        {isLoading ? (
                                            <div className="p-6 text-center">
                                                <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            (() => {
                                                const hasResults = suggestions.businesses?.length > 0 || suggestions.categories?.length > 0 || suggestions.blogs?.length > 0 || suggestions.communities?.length > 0;
                                                
                                                if (!hasResults && searchQuery.trim().length > 1) {
                                                    return <div className="p-4 text-center text-slate-500 text-sm">No results found for "{searchQuery}"</div>;
                                                }
                                                
                                                return (
                                                    <div className="py-2">
                                                        {suggestions.categories?.length > 0 && (
                                                            <div className="mb-2">
                                                                <div className="px-4 py-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase">Categories</div>
                                                                {suggestions.categories.map(cat => (
                                                                    <Link 
                                                                        key={`cat-${cat.id}`} 
                                                                        href={`${basePath || ''}/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                                                    >
                                                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><GraduationCap size={16} /></div>
                                                                        <span className="font-medium text-slate-800">{cat.name}</span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                        
                                                        {suggestions.businesses?.length > 0 && (
                                                            <div className="mb-2">
                                                                <div className="px-4 py-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase">Institutes</div>
                                                                {suggestions.businesses.map(biz => (
                                                                    <Link 
                                                                        key={`biz-${biz.id}`} 
                                                                        href={`${basePath || ''}/reviews/${biz.category || 'coaching-institutes'}/${biz.slug || biz.id}`}
                                                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                                                    >
                                                                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200">
                                                                            <img src={biz.logo || '/uploads/read.webp'} alt={biz.name} width="40" height="40" className="w-full h-full object-cover" />
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium text-slate-800">{biz.name}</span>
                                                                            <span className="text-xs text-slate-500">{biz.category || 'Institute'}</span>
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {suggestions.blogs?.length > 0 && (
                                                            <div>
                                                                <div className="px-4 py-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase">Blog Posts</div>
                                                                {suggestions.blogs.map(blog => (
                                                                    <Link 
                                                                        key={`blog-${blog.id}`} 
                                                                        href={`${basePath || ''}/blog/${blog.slug}`}
                                                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                                                    >
                                                                        <div className="bg-amber-50 p-2 rounded-lg text-amber-600"><BookOpen size={16} /></div>
                                                                        <div className="flex flex-col flex-1 min-w-0">
                                                                            <span className="font-medium text-slate-800 line-clamp-1">{blog.title}</span>
                                                                            {blog.excerpt && <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{blog.excerpt}</span>}
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {suggestions.communities?.length > 0 && (
                                                            <div className="mb-2">
                                                                <div className="px-4 py-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase">Communities</div>
                                                                {suggestions.communities.map(community => (
                                                                    <Link 
                                                                        key={`comm-${community.id}`} 
                                                                        href={`${basePath || ''}/community/${community.name}`}
                                                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                                                    >
                                                                        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><MessageSquare size={16} /></div>
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium text-slate-800">r/{community.name}</span>
                                                                            <span className="text-xs text-slate-500">{community.members || 0} members</span>
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-8 text-sm">
                            <span className="text-white/60 mr-1">Popular Exams:</span>
                            <Link href={`${basePath}/search?q=JEE`} className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold">JEE</Link>
                            <Link href={`${basePath}/search?q=NEET`} className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold">NEET</Link>
                            <Link href={`${basePath}/search?q=NDA`} className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold">NDA</Link>
                            <Link href={`${basePath}/search?q=CLAT`} className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold">CLAT</Link>
                            <Link href={`${basePath}/search?q=CUET`} className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold">CUET</Link>
                            <Link href={`${basePath}/search?q=Foundation`} className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors font-semibold">Foundation</Link>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link href={`${basePath}/reviews`} className="btn-amber px-6 py-3 transition-colors text-center inline-flex items-center justify-center">
                                Explore Institutes
                            </Link>
                            <a href="#top-institutes" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors text-center inline-flex items-center justify-center">
                                Compare Coaching
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative hidden md:block">
                        <div className="relative w-full h-[500px] flex items-center justify-center">
                            {/* Floating elements mimicking reference hero-side-image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
                            
                            {validSlides.map((slide, index) => {
                                const imgUrl = typeof slide === 'string' ? slide : (slide.image_url || slide.image || slide.coverImage);
                                return (
                                    <img 
                                        key={`side-${index}`}
                                        src={imgUrl} 
                                        alt="Slide" 
                                        fetchPriority={index === 0 ? 'high' : 'low'}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding={index === 0 ? 'sync' : 'async'}
                                        className={`absolute z-10 w-full max-w-sm rounded-2xl shadow-2xl border-4 border-white/10 object-cover aspect-[4/5] transition-all duration-1000 ${index === currentSlideIndex ? 'opacity-100 scale-100 hover:-translate-y-2' : 'opacity-0 scale-95 pointer-events-none'}`}
                                    />
                                );
                            })}
                            
                            <div className="absolute top-10 -left-10 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-3 animate-float">
                                <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 className="w-6 h-6" /></div>
                                <div><div className="font-bold text-slate-800">Verified</div><div className="text-xs text-slate-500">Institutes</div></div>
                            </div>
                            <div className="absolute bottom-20 -right-5 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-3 animate-float-delayed">
                                <div className="bg-amber-100 p-2 rounded-full text-amber-600"><Star className="w-6 h-6 fill-current" /></div>
                                <div><div className="font-bold text-slate-800">Top Rated</div><div className="text-xs text-slate-500">Reviews</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const TrustMarquee = ({ categories }) => {
    // Generate some placeholder trust logos based on categories or a static list
    const items = categories && categories.length > 0 ? categories : [
        {name: "Engineering", id: 1}, {name: "Medical", id: 2}, {name: "Foundation", id: 3}, 
        {name: "Commerce", id: 4}, {name: "Arts", id: 5}, {name: "Law", id: 6}
    ];

    return (
        <section className="py-6 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <p className="text-xs font-bold text-slate-600 dark:text-zinc-400 tracking-wider">Trusted Categories &amp; Streams</p>
            </div>
            <div className="relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex animate-marquee items-center justify-center space-x-8 md:space-x-16 whitespace-nowrap">
                    {[...items, ...items, ...items].map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="text-slate-400 dark:text-zinc-500 font-bold text-xl md:text-2xl opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2">
                            <GraduationCap className="w-6 h-6" /> {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const InstitutesSection = ({ featuredBusinesses, basePath }) => {
    const businesses = featuredBusinesses || [];
    if(businesses.length === 0) return null;
    
    return (
        <section id="top-institutes" className="pt-10 pb-0 md:pt-14 md:pb-0 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Top Coaching Institutes in Sikar</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg">Explore institutes based on courses, reviews, results and available information.</p>
                    </div>
                    <Link href={`${basePath}/reviews`} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm">
                        View All
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {businesses.map((biz) => {
                        const categorySlug = biz.category || 'coaching-institutes';
                        const reviewUrl = `${basePath}/reviews/${categorySlug}/${biz.slug || biz.id}`;
                        
                        return (
                        <article key={biz.id} className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                            <Link href={reviewUrl} className="relative aspect-[16/9] w-full block overflow-hidden bg-slate-100 dark:bg-zinc-800 flex items-center justify-center p-4">
                                <Image src={biz.logo || '/uploads/read.webp'} alt={biz.name} fill width="672" height="378" style={{objectFit: 'contain'}} className="group-hover:scale-105 transition-transform duration-500" />
                            </Link>
                            
                            <div className="p-4 md:p-5 flex-grow flex flex-col border-t border-slate-100 dark:border-zinc-800">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <Link href={reviewUrl} className="focus:outline-none">{biz.name}</Link>
                                </h3>
                                
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-zinc-400 mb-3">
                                    <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                                        <Star className="w-3.5 h-3.5 fill-amber-700 dark:fill-amber-400" /> {biz.rating || 4.5}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Trust: {biz.trust_score || biz.trustScore || 85}/100
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/30">{biz.category_name || biz.categoryName || biz.category}</span>
                                    {biz.isVerified && <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded border border-green-200 dark:border-green-800/30 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>}
                                    {biz.location && <span className="bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 flex items-center gap-1"><MapPin size={12}/>{biz.location}</span>}
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-1 text-sm text-slate-600 dark:text-zinc-400">
                                    <Link href={reviewUrl} className="block w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 text-center font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98] text-sm">
                                        Read Reviews ({biz.review_count || biz.reviewCount || 0})
                                    </Link>
                                </div>
                            </div>
                        </article>
                    )})}
                </div>
            </div>
        </section>
    );
};

const CommunityFeedSection = ({ basePath, feedPosts, topCommunities }) => {
    const displayPosts = feedPosts || [];
    const displayCommunities = topCommunities || [];
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareData, setShareData] = useState({ url: '', title: '' });

    return (
        <section className="pt-6 pb-10 md:pt-10 md:pb-14 bg-slate-50 dark:bg-zinc-950 relative border-b border-slate-200 dark:border-zinc-800">
            <Suspense fallback={null}>
                {shareModalOpen && (
                    <ShareModal 
                        isOpen={shareModalOpen} 
                        onClose={() => setShareModalOpen(false)} 
                        url={shareData.url} 
                        title={shareData.title} 
                    />
                )}
            </Suspense>
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-4 border border-blue-200 dark:border-blue-800/30">
                            <MessageSquare size={14} /> Student Community
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Recent Discussions</h2>
                        <p className="text-slate-600 dark:text-zinc-400 mt-3 text-base md:text-lg max-w-2xl">Join the conversation with thousands of students. Share study materials, ask doubts, and get exam strategies.</p>
                    </div>
                    <Link href="/feed" className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 group shrink-0 whitespace-nowrap hidden md:inline-flex">
                        View All Feed <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Main Feed Column */}
                    <div className="lg:col-span-8 space-y-5">
                        {displayPosts.length > 0 ? displayPosts.map((post) => (
                            <div key={post.id} onClick={() => navigate(`${basePath}/r/${post.community}/comments/${post.id}`)} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-5 md:p-6 flex gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                                {/* Upvote Sidebar */}
                                <div className="hidden sm:flex flex-col items-center gap-2 min-w-[44px]">
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            postHomeAction(`${basePath}/vote`, { votable_type: 'post', votable_id: post.id, value: 1 });
                                        }}
                                        className={`p-1.5 rounded-full transition-colors border-none outline-none focus:outline-none ring-0 focus:ring-0 ${post.has_voted ? 'text-white bg-amber-500 shadow-md shadow-amber-500/20' : 'text-slate-400 dark:text-zinc-500 hover:text-white hover:bg-amber-500 hover:shadow-md hover:shadow-amber-500/20'}`}
                                        title={post.has_voted ? 'Upvoted' : 'Upvote'}
                                    >
                                        <TrendingUp size={20} />
                                    </button>
                                    <span className={`font-bold text-sm ${post.has_voted ? 'text-amber-500' : 'text-slate-800 dark:text-zinc-300'}`}>{post.score}</span>
                                </div>
                                
                                {/* Post Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 mb-3 flex-wrap">
                                        <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border border-blue-100 dark:border-blue-800/30">
                                            r/{post.community}
                                        </span>
                                        <span>•</span>
                                        <span>Posted by <span className="font-bold text-slate-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">u/{post.author?.username || post.author}</span></span>
                                        <span>•</span>
                                        <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : post.time}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 break-words">
                                        {post.title}
                                    </h3>
                                    
                                    {post.type === 'TEXT' && post.content && (
                                        <p className="text-slate-600 dark:text-zinc-400 text-sm line-clamp-2 mb-3 leading-relaxed">
                                            {post.content.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    )}
                                    
                                    {/* Action Buttons — same style as PostCard */}
                                    <div className="flex gap-2 -ml-1.5 mt-2 flex-nowrap whitespace-nowrap overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {/* Mobile upvote pill */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); postHomeAction(`${basePath}/vote`, { votable_type: 'post', votable_id: post.id, value: 1 }); }}
                                            className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] border-0 outline-none focus:outline-none focus:ring-0 sm:hidden ${post.has_voted ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-zinc-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400'}`}
                                        >
                                            <TrendingUp size={16} className={post.has_voted ? 'text-amber-500' : ''} />
                                            <span className={post.has_voted ? 'text-amber-500' : ''}>{post.score}</span>
                                        </button>
                                        {/* Comments */}
                                        <Link
                                            href={`/r/${post.community}/comments/${post.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="shrink-0 whitespace-nowrap flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-2 rounded-xl transition-colors font-bold text-[13px]"
                                        >
                                            <MessageSquare size={16} className="text-blue-500" />
                                            {post.comments_count || post.comments} Comments
                                        </Link>
                                        {/* Share */}
                                        <button
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setShareData({
                                                    url: `${window.location.origin}/r/${post.community}/comments/${post.id}`,
                                                    title: post.title
                                                });
                                                setShareModalOpen(true);
                                            }}
                                            className="shrink-0 whitespace-nowrap flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-2 rounded-xl transition-colors font-bold text-[13px] text-slate-600 dark:text-zinc-300 border-0 outline-none focus:outline-none focus:ring-0"
                                        >
                                            <Share2 size={16} strokeWidth={2} className="text-slate-500 dark:text-zinc-400" />
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
                                <MessageSquare size={48} className="text-slate-300 dark:text-zinc-700 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700 dark:text-zinc-300 mb-2">No discussions yet</h3>
                                <p className="text-slate-500 dark:text-zinc-500 mb-6">Be the first to start a conversation in our community.</p>
                                <Link href="/submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-md">
                                    Create a Post
                                </Link>
                            </div>
                        )}
                        <Link href="/feed" className="md:hidden flex w-full justify-center items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-colors group mt-2">
                            View All Feed <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden relative">
                            {/* Accent Header */}
                            <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-amber-500"></div>
                            
                            <div className="p-6">
                                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-5">Top Communities</h3>
                                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {displayCommunities.length > 0 ? displayCommunities.map((community, index) => (
                                        <Link key={community.id} href={`/community/${community.name}`} className="p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                                            <div className="font-bold text-slate-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors w-4">{index + 1}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{community.display_name || `r/${community.name}`}</h4>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1 mb-1">
                                                    {community.description || `Welcome to the ${community.display_name || community.name} community. Join the discussion!`}
                                                </p>
                                                <div className="text-xs font-bold text-slate-500 dark:text-zinc-500 flex items-center gap-2 mt-0.5">
                                                    <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 dark:bg-zinc-800/80 dark:text-zinc-300 px-2 py-0.5 rounded-md">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        {(() => {
                                                            let count = community.members_count || community.members;
                                                            let numCount = parseInt(count);
                                                            if (!count || isNaN(numCount) || numCount < 10 || String(count).includes('+')) {
                                                                const fakeCounts = [450, 1200, 890, 520, 2100, 340, 670, 410, 950, 1500, 800, 300, 250, 750, 1100];
                                                                count = fakeCounts[(community.id || index) % fakeCounts.length];
                                                            }
                                                            const num = Number(count);
                                                            if (isNaN(num)) return count + ' members';
                                                            if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k members';
                                                            return num + ' members';
                                                        })()}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-500/20"><TrendingUp size={12} /> Hot</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); postHomeAction(`${basePath}/community/${community.id}/join`); }}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all border ${community.is_joined ? 'border-transparent bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700' : 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:border-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:hover:text-white shadow-sm'}`}
                                            >
                                                {community.is_joined ? 'Joined' : 'Join'}
                                            </button>
                                        </Link>
                                    )) : (
                                        <div className="p-8 text-center">
                                            <p className="text-sm font-bold text-slate-500 dark:text-zinc-500 mb-4">No top communities yet</p>
                                            <Link href="/communities/create" className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">Create one</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden border border-slate-700">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <h3 className="font-bold text-xl mb-2 relative z-10 text-white">Have a Question?</h3>
                            <p className="text-slate-200 text-sm mb-5 relative z-10">Get answers from toppers and expert faculty in Sikar.</p>
                            <Link href={`${basePath}/contact`} className="btn-amber px-6 py-2.5 w-full block relative z-10 shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform text-slate-900 font-bold rounded-full">
                                Ask Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const BlogSection = ({ morePosts, basePath, formatDate }) => {
    const posts = (morePosts || []).slice(0, 4);
    if(posts.length === 0) return null;
    
    return (
        <section className="py-10 md:py-14 bg-slate-50 dark:bg-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <div>
                        <p className="text-blue-700 dark:text-blue-400 text-sm font-bold tracking-wider mb-1">Editor's Picks</p>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore the Blog</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg">Read the latest articles, guides, and updates.</p>
                    </div>
                    <Link href={`${basePath}/blog`} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm">
                        View All Blog
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((post, index) => {
                        const borderColors = ['#3b82f6', '#e11d48', '#10b981', '#f59e0b'];
                        return (
                        <AnimatedBorderCard 
                            key={post.id}
                            containerClassName="hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                            className="flex-grow flex flex-col"
                            gradientColor={borderColors[index % borderColors.length]}
                        >
                            <Link href={`${basePath}/blog/${post.slug}`} className="relative aspect-[16/9] w-full block overflow-hidden shrink-0">
                                <Image src={post.coverImage || '/uploads/read.webp'} alt={post.title} fill width="672" height="378" style={{objectFit: 'cover'}} className="group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            
                            <div className="p-4 md:p-5 flex-grow flex flex-col bg-white dark:bg-zinc-900">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <Link href={`${basePath}/blog/${post.slug}`} className="focus:outline-none">{post.title}</Link>
                                </h3>
                                
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/30">{post.category || 'Article'}</span>
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-1 text-sm text-slate-600 dark:text-zinc-400">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-slate-500 dark:text-zinc-400">Posted:</span>
                                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{formatDate(post.date)}</span>
                                    </div>
                                    <Link href={`${basePath}/blog/${post.slug}`} className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold py-2.5 rounded-full transition-all text-sm w-full text-center flex justify-center items-center active:scale-[0.98]">
                                        Read Article
                                    </Link>
                                </div>
                            </div>
                        </AnimatedBorderCard>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const CategorySection = ({ categories, basePath }) => {
    if (!categories || categories.length === 0) return null;

    const getCategoryStyle = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('science') || lowerName.includes('neet') || lowerName.includes('medical') || lowerName.includes('doctor')) {
            return { icon: Beaker, colorClass: 'text-emerald-500', bgClass: 'bg-emerald-50 dark:bg-emerald-500/10', hoverBgClass: 'group-hover:bg-emerald-500', shadowClass: 'hover:shadow-emerald-500/20', borderClass: 'hover:border-emerald-400', cardHoverBg: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10' };
        }
        if (lowerName.includes('commerce') || lowerName.includes('ca') || lowerName.includes('bank')) {
            return { icon: Target, colorClass: 'text-amber-500', bgClass: 'bg-amber-50 dark:bg-amber-500/10', hoverBgClass: 'group-hover:bg-amber-500', shadowClass: 'hover:shadow-amber-500/20', borderClass: 'hover:border-amber-400', cardHoverBg: 'hover:bg-amber-50/50 dark:hover:bg-amber-900/10' };
        }
        if (lowerName.includes('arts') || lowerName.includes('law') || lowerName.includes('clat') || lowerName.includes('upsc') || lowerName.includes('ras') || lowerName.includes('ias')) {
            return { icon: Scale, colorClass: 'text-purple-500', bgClass: 'bg-purple-50 dark:bg-purple-500/10', hoverBgClass: 'group-hover:bg-purple-500', shadowClass: 'hover:shadow-purple-500/20', borderClass: 'hover:border-purple-400', cardHoverBg: 'hover:bg-purple-50/50 dark:hover:bg-purple-900/10' };
        }
        if (lowerName.includes('school') || lowerName.includes('board') || lowerName.includes('cbse') || lowerName.includes('rbse')) {
            return { icon: Backpack, colorClass: 'text-pink-500', bgClass: 'bg-pink-50 dark:bg-pink-500/10', hoverBgClass: 'group-hover:bg-pink-500', shadowClass: 'hover:shadow-pink-500/20', borderClass: 'hover:border-pink-400', cardHoverBg: 'hover:bg-pink-50/50 dark:hover:bg-pink-900/10' };
        }
        if (lowerName.includes('engineering') || lowerName.includes('jee') || lowerName.includes('tech')) {
            return { icon: BookOpen, colorClass: 'text-blue-500', bgClass: 'bg-blue-50 dark:bg-blue-500/10', hoverBgClass: 'group-hover:bg-blue-500', shadowClass: 'hover:shadow-blue-500/20', borderClass: 'hover:border-blue-400', cardHoverBg: 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10' };
        }
        return { icon: GraduationCap, colorClass: 'text-indigo-500', bgClass: 'bg-indigo-50 dark:bg-indigo-500/10', hoverBgClass: 'group-hover:bg-indigo-500', shadowClass: 'hover:shadow-indigo-500/20', borderClass: 'hover:border-indigo-400', cardHoverBg: 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10' };
    };

    return (
        <section className="pt-10 pb-6 md:pt-14 md:pb-10 bg-white dark:bg-zinc-950 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/5 rounded-full blur-3xl opacity-50 pointer-events-none -mr-48 -mt-48"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore by Stream</h2>
                    <p className="text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg">Find the right path for your career goals.</p>
                </div>
                
                {/* Infinite Scrolling Marquee for Categories */}
                <div className="relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <div className="flex animate-marquee-fast hover:[animation-play-state:paused] items-center justify-center space-x-4 md:space-x-6 whitespace-nowrap pt-4 pb-8 px-2">
                        {[...categories, ...categories, ...categories, ...categories].map((cat, i) => {
                            const style = getCategoryStyle(cat.name);
                            const Icon = style.icon;
                            return (
                                <Link key={`${cat.id}-${i}`} href={`${basePath}/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`} 
                                    className={`bg-white dark:bg-zinc-900 w-64 h-56 rounded-[1.5rem] border border-slate-200 dark:border-zinc-800 transition-all duration-300 group flex flex-col items-center justify-center text-center shrink-0 hover:-translate-y-2 ${style.borderClass} ${style.cardHoverBg} p-6`}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${style.bgClass} ${style.hoverBgClass}`}>
                                        <Icon className={`w-7 h-7 transition-colors duration-300 group-hover:text-white ${style.colorClass}`} />
                                    </div>
                                    <h3 className="font-extrabold text-slate-800 dark:text-zinc-100 text-sm md:text-[15px] group-hover:text-slate-900 dark:group-hover:text-white transition-colors whitespace-normal break-words w-full leading-snug mb-2">{cat.name}</h3>
                                    {cat.description && (
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-3 leading-relaxed whitespace-normal transition-colors group-hover:text-slate-700 dark:group-hover:text-zinc-300">
                                            {cat.description}
                                        </p>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

const StoriesSection = ({ stories, basePath }) => {
    if(!stories || stories.length === 0) return null;
    return (
        <section className="pt-20 pb-10 md:pt-24 md:pb-14 bg-slate-50 dark:bg-zinc-900 border-y border-slate-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Visual Web Stories</h2>
                        <p className="text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg">Bite-sized visual guides for modern students.</p>
                    </div>
                </div>
                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x hide-scrollbar">
                    {stories.map(story => (
                        <Link key={story.id} href={`${basePath}/stories/${story.slug}`} className="relative flex-none w-[220px] md:w-[260px] aspect-[9/16] rounded-xl overflow-hidden snap-start group transition-all duration-300">
                            <Image src={story.posterImage || '/uploads/read.webp'} alt={story.title} fill width="260" height="462" style={{objectFit: 'cover'}} className="group-hover:scale-105 transition-transform duration-700"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white">
                                <PlayCircle className="w-5 h-5" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <h3 className="text-white font-bold text-base md:text-lg leading-snug drop-shadow-md">{story.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

const SeoContent = ({ basePath }) => (
    <section className="py-10 md:py-14 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                    <span className="text-blue-600 font-bold tracking-widest text-xs mb-3 block">About Us</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">CoachinginSikar: Your Complete Education Guide</h2>
                    <div className="text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed space-y-4">
                        <p>CoachinginSikar is an education platform helping students and parents find the best CoachinginSikar through top <Link href={`${basePath}/reviews/coaching-institutes`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">coaching institutes</Link>, coaching centre lists, fees, rankings, reviews, results, admissions, and other comparisons. We cover NEET coaching, JEE coaching, IAS / RAS / SSC-CGL Coaching, CLAT &amp; CA Coaching, CUET, Olympiads, schools, colleges, and other competitive exam coaching educational information.</p>
                        <p>Starting with Sikar, our platform covers more than just top coaching institutes in Sikar, Rajasthan. Yes, we also provide information on the best schools, colleges, education news, results, Olympiads, hospitals, and other useful local information. We aim to make finding top institutions, fees, admissions, results, reviews, and opportunities simple, while expanding our coverage beyond Sikar to more cities, regions, categories, and <Link href={`${basePath}/feed`} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">communities</Link>.</p>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 dark:text-white">Verified Data</div>
                                <div className="text-sm text-slate-500 dark:text-zinc-400">Trusted reviews</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600 dark:text-amber-400">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 dark:text-white">Top Institutes</div>
                                <div className="text-sm text-slate-500 dark:text-zinc-400">Ranked accurately</div>
                            </div>
                        </div>
                        <Link href={`${basePath}/about`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all ml-auto sm:ml-0">
                            More About Us
                        </Link>
                    </div>
                </div>
                <div className="relative mt-8 lg:mt-0">
                    <div className="absolute inset-0 bg-blue-600/10 rounded-[2rem] transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6"></div>
                    <div className="relative z-10 rounded-[2rem] shadow-xl w-full aspect-[4/3] border-4 border-white dark:border-zinc-700 overflow-hidden">
                        <img 
                            src="/uploads/aboutus.webp" 
                            alt="Students studying" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none mix-blend-overlay"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "What is CoachingsinSikar?",
            answer: "CoachingsinSikar is a trusted source that helps students to find the best CoachinginSikar, top schools and colleges, Best JEE & NEET coaching, exam results, fees, admissions, and other education updates."
        },
        {
            question: "How can I find the best CoachinginSikar?",
            answer: <>Use some <a href="https://coachingsinsikar.com/blog/top-5-parameters-to-choose-best-jee-coaching-in-sikar" className="text-blue-600 dark:text-blue-400 hover:underline">parameters</a> or compare the top JEE/NEET/CLAT/NDA/CA/Olympiads coaching institutes in Sikar based on results, faculty, fees, reviews, facilities, and student support before choosing.</>
        },
        {
            question: "Which are the best coaching centers in Sikar?",
            answer: "The Sikar Coaching Center List helps students explore and compare coaching centers for JEE, NEET, and other competitive exams based on courses, fees, results, and facilities."
        },
        {
            question: "How to choose the best JEE CoachinginSikar?",
            answer: <>To choose the <a href="https://coachingsinsikar.com/blog/which-coaching-is-best-for-jee-in-sikar" className="text-blue-600 dark:text-blue-400 hover:underline">best JEE CoachinginSikar</a>, compare JEE results, experienced faculty, study material, regular tests, doubt support, fees, and the overall learning environment.</>
        },
        {
            question: "Which are the best CoachinginSikar with fees?",
            answer: "You can compare best CoachinginSikar with fees by checking their courses, results, faculty, fee structure, facilities, and student support."
        }
    ];
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is CoachingsinSikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "CoachingsinSikar is a trusted source that helps students to find the best CoachinginSikar, top schools and colleges, Best JEE & NEET coaching, exam results, fees, admissions, and other education updates."
                }
            },
            {
                "@type": "Question",
                "name": "How can I find the best CoachinginSikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use some <a href=\"https://coachingsinsikar.com/blog/top-5-parameters-to-choose-best-jee-coaching-in-sikar\">parameters</a> or compare the top JEE/NEET/CLAT/NDA/CA/Olympiads coaching institutes in Sikar based on results, faculty, fees, reviews, facilities, and student support before choosing."
                }
            },
            {
                "@type": "Question",
                "name": "Which are the best coaching centers in Sikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Sikar Coaching Center List helps students explore and compare coaching centers for JEE, NEET, and other competitive exams based on courses, fees, results, and facilities."
                }
            },
            {
                "@type": "Question",
                "name": "How to choose the best JEE CoachinginSikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To choose the <a href=\"https://coachingsinsikar.com/blog/which-coaching-is-best-for-jee-in-sikar\">best JEE CoachinginSikar</a>, compare JEE results, experienced faculty, study material, regular tests, doubt support, fees, and the overall learning environment."
                }
            },
            {
                "@type": "Question",
                "name": "Which are the best CoachinginSikar with fees?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can compare best CoachinginSikar with fees by checking their courses, results, faculty, fee structure, facilities, and student support."
                }
            },
            {
                "@type": "Question",
                "name": "Which are Top 5 NEET CoachinginSikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The <a href=\"https://coachingsinsikar.com/blog/best-neet-coachings-in-sikar\">top 5 NEET CoachinginSikar</a> include leading options known for NEET preparation, experienced faculty, regular tests, study material, and student support."
                }
            },
            {
                "@type": "Question",
                "name": "Why do students choose CA CoachinginSikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Students choose the <a href=\"https://coachingsinsikar.com/blog/best-ca-coaching-in-sikar\">best CA CoachinginSikar</a> for structured preparation, subject-wise classes, regular practice, doubt sessions, and guidance for different CA levels."
                }
            },
            {
                "@type": "Question",
                "name": "Which RBSE schools are considered among the best in Sikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The <a href=\"https://coachingsinsikar.com/blog/best-rbse-school-in-sikar\">5 best RBSE schools in Sikar</a> can be explored through their academic record, facilities, courses, admission process, and student-focused learning environment."
                }
            },
            {
                "@type": "Question",
                "name": "What makes a CBSE school one of the best in Sikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The <a href=\"https://coachingsinsikar.com/blog/best-cbse-schools-in-sikar\">best CBSE school in Sikar</a> combines strong academics with qualified teachers, modern facilities, extracurricular activities, and opportunities for students to develop beyond textbooks."
                }
            },
            {
                "@type": "Question",
                "name": "Where can students prepare for CLAT in Sikar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Students can find <a href=\"https://coachingsinsikar.com/blog/best-clat-coaching-in-sikar\">best CLAT CoachinginSikar</a> offering preparation for legal aptitude, logical reasoning, English, current affairs, and CLAT mock tests."
                }
            }
        ]
    };

    return (
        <section className="pt-16 pb-16 md:pt-24 md:pb-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 relative overflow-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-48 -left-24 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
                    
                    {/* Left Column: Sticky Title & CTA */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wider mb-6">
                                <MessageSquare className="w-4 h-4" /> Got Questions?
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                                Frequently Asked <span className="text-blue-600">Questions</span>
                            </h2>
                            <p className="text-slate-600 dark:text-zinc-400 text-base md:text-lg leading-relaxed">
                                Everything you need to know about coaching institutes, education, and living in Sikar. Can't find the answer you're looking for?
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-slate-200 dark:border-zinc-700 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Search className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Still have questions?</h3>
                                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">Chat with our educational counselors for personalized guidance.</p>
                                <Link href="/contact" className="btn-amber px-5 py-2 text-sm transition-transform hover:scale-105 inline-block">
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
                                    className={`group border rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? 'bg-white dark:bg-zinc-800 shadow-xl shadow-blue-900/5 dark:shadow-none border-blue-200 dark:border-blue-700 ring-1 ring-blue-100 dark:ring-blue-700/30' : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-zinc-800 backdrop-blur-sm'}`}
                                >
                                    <button 
                                        className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none focus:ring-0 ring-0 border-none bg-transparent cursor-pointer"
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className={`font-bold text-lg pr-6 transition-colors duration-300 ${isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-180 shadow-md shadow-blue-600/20' : 'bg-slate-100 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500'}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </button>
                                    <div 
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
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

export default function Welcome(props) {
    const { morePosts, publishedStories, sliders, categories, meta, featuredBusinesses, feedPosts, topCommunities } = props;
    const basePath = typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '';

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen font-sans">
            <GlobalNavbar />
            
            <main>
                <HomeHero activeSlides={sliders || []} basePath={basePath} categories={categories || []} featuredBusinesses={featuredBusinesses || []} fallbackImage={meta?.preload_image} />
                <TrustMarquee categories={categories || []} />
                <InstitutesSection featuredBusinesses={featuredBusinesses || []} basePath={basePath} formatDate={formatDate} />
                <CommunityFeedSection basePath={basePath} feedPosts={feedPosts} topCommunities={topCommunities} />
                <SeoContent basePath={basePath} />
                <BlogSection morePosts={morePosts || []} basePath={basePath} formatDate={formatDate} />
                <CategorySection categories={categories || []} basePath={basePath} />
                <StoriesSection stories={publishedStories || []} basePath={basePath} />
                <FAQSection />
            </main>

            <BlogFooter />
            
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes float-delayed {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 7s ease-in-out infinite;
                }
                
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333333%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .animate-marquee-fast {
                    animation: marquee 25s linear infinite;
                }
            `}</style>
        </div>
    );
}
