import GlobalNavbar from './HomeComponents/HomeNavbar';
import BlogFooter from './HomeComponents/HomeFooter';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, navigate, Image } from './HomeComponents/utils';

// Critical above-fold: load immediately
import AnimatedBorderCard from '../Components/AnimatedBorderCard';
import ShareModal from '../Components/ShareModal';
import { Search, ChevronRight, Star, ArrowRight, Library, MapPin, CheckCircle2, MessageSquare, ThumbsUp, TrendingUp, Share2, Bookmark } from 'lucide-react';

const TrustMarquee = lazy(() => import('./HomeComponents/TrustMarquee'));
const InstitutesSection = lazy(() => import('./HomeComponents/InstitutesSection'));
const CommunityFeedSection = lazy(() => import('./HomeComponents/CommunityFeedSection'));
const BlogSection = lazy(() => import('./HomeComponents/BlogSection'));
const CategorySection = lazy(() => import('./HomeComponents/CategorySection'));
const StoriesSection = lazy(() => import('./HomeComponents/StoriesSection'));
const FAQSection = lazy(() => import('./HomeComponents/FAQSection'));
const SeoContent = lazy(() => import('./HomeComponents/SeoContent'));

// The home page is served as a small standalone React application. These are
// intentionally regular links and fetch requests so it does not download the
// much larger Inertia application bundle just to render the public landing page.




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
        <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center bg-slate-900">
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
                            <form onSubmit={handleSearch} role="search" aria-label="Search coaching institutes">
                                <label htmlFor="home-search" className="sr-only">Search coaching, courses, exams or institutes</label>
                                <AnimatedBorderCard containerClassName="rounded-full" className="rounded-full">
                                    <div className="flex items-center gap-2 bg-white px-2 py-2 group">
                                        <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0 group-focus-within:text-blue-500 transition-colors" aria-hidden="true" />
                                        <input 
                                            id="home-search"
                                            type="search" 
                                            name="q" 
                                            className="flex-1 border-0 outline-none focus:ring-0 text-slate-900 text-sm md:text-base py-2.5 bg-transparent placeholder-slate-400" 
                                            placeholder="Search coaching, courses, exams or institutes..." 
                                            value={searchQuery} 
                                            aria-label="Search coaching, courses, exams or institutes"
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setShowSuggestions(true);
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            autoComplete="off"
                                        />
                                        <button type="submit" aria-label="Search" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full px-6 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none ring-0 focus:ring-0">
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
                                                                        href={`${basePath || ''}/business/${biz.category || 'coaching-institutes'}/${biz.slug || biz.id}`}
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
                                                                        href={(basePath || '') + (blog.url_path || `/blog/${blog.slug}`)}
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
                            <Link href={`${basePath}/business`} className="btn-amber px-6 py-3 transition-colors text-center inline-flex items-center justify-center">
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
                                        alt={`Coaching institute in Sikar — slide ${index + 1}`}
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

const LazySection = ({ children, minHeight }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '300px' } // Load when within 300px of viewport
        );
        
        if (ref.current) {
            observer.observe(ref.current);
        }
        
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={ref} style={{ minHeight: isVisible ? 'auto' : minHeight }}>
            {isVisible ? children : null}
        </div>
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
            <GlobalNavbar global_nav={props.global_nav} />
            
            <main>
                <HomeHero activeSlides={sliders || []} basePath={basePath} categories={categories || []} featuredBusinesses={featuredBusinesses || []} fallbackImage={meta?.preload_image} />
                <LazySection minHeight="80px">
                    <Suspense fallback={<div style={{minHeight:'80px', background:'#f8fafc'}}></div>}>
                        <TrustMarquee categories={categories || []} />
                    </Suspense>
                </LazySection>
                <LazySection minHeight="384px">
                    <Suspense fallback={<div style={{minHeight:'384px', background:'#ffffff'}}></div>}>
                        <InstitutesSection featuredBusinesses={featuredBusinesses || []} basePath={basePath} formatDate={formatDate} />
                    </Suspense>
                </LazySection>
                <LazySection minHeight="384px">
                    <Suspense fallback={<div style={{minHeight:'384px', background:'#f8fafc'}}></div>}>
                        <CommunityFeedSection basePath={basePath} feedPosts={feedPosts} topCommunities={topCommunities} />
                    </Suspense>
                </LazySection>
                <LazySection minHeight="400px">
                    <Suspense fallback={<div style={{minHeight:'400px'}}></div>}>
                        <SeoContent basePath={basePath} />
                    </Suspense>
                </LazySection>
                <LazySection minHeight="400px">
                    <Suspense fallback={<div style={{minHeight:'400px'}}></div>}>
                        <BlogSection morePosts={morePosts || []} basePath={basePath} formatDate={formatDate} />
                    </Suspense>
                </LazySection>
                <LazySection minHeight="400px">
                    <Suspense fallback={<div style={{minHeight:'400px'}}></div>}>
                        <CategorySection categories={categories || []} basePath={basePath} />
                    </Suspense>
                </LazySection>
                <LazySection minHeight="300px">
                    <Suspense fallback={<div style={{minHeight:'300px'}}></div>}>
                        <StoriesSection stories={publishedStories || []} basePath={basePath} />
                    </Suspense>
                </LazySection>
                <LazySection minHeight="300px">
                    <Suspense fallback={<div style={{minHeight:'300px'}}></div>}>
                        <FAQSection />
                    </Suspense>
                </LazySection>
            </main>

            <BlogFooter global_nav={props.global_nav} />
            

        </div>
    );
}

