import { Head, Link, router } from '@inertiajs/react';
import GlobalNavbar from '../NextComponents/GlobalNavbar';
import BlogFooter from '../NextComponents/BlogFooter';
import React, { useState, useEffect } from 'react';
import SeoMeta from '../NextComponents/SeoMeta';
import { Search, ChevronRight, GraduationCap, Award, Star, ArrowRight, ShieldCheck, PlayCircle, Library, MapPin, CheckCircle2, MessageSquare, ThumbsUp, TrendingUp, ChevronDown, BookOpen, TestTube, Target, Scale, Beaker, Backpack } from 'lucide-react';

// Simple polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, className, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    const finalFetchPriority = priority ? 'high' : (fetchPriority || 'auto');
    const loadingAttr = priority ? 'eager' : 'lazy';
    
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} fetchPriority={finalFetchPriority} loading={loadingAttr} decoding={priority ? 'sync' : 'async'} className={className} {...props} />;
};

const HomeHero = ({ activeSlides, basePath, categories, featuredBusinesses }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [suggestions, setSuggestions] = useState({ categories: [], businesses: [], blogs: [] });
    const [isLoading, setIsLoading] = useState(false);
    
    // Default fallback if no slides
    const validSlides = (activeSlides && activeSlides.length > 0) ? activeSlides : [
        { image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80' }
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
            window.location.href = `${basePath || ''}/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden bg-slate-900">
            {/* Background Image Slider */}
            {validSlides.map((slide, index) => {
                const imgUrl = typeof slide === 'string' ? slide : (slide.image_url || slide.image || slide.coverImage);
                return (
                    <div 
                        key={index}
                        className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlideIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url('${imgUrl}')` }}
                    ></div>
                );
            })}
            
            <div className="absolute inset-0 z-0 bg-slate-900/80"></div>
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 md:pt-32 md:pb-14">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div className="lg:col-span-7 text-white">
                        <p className="text-amber-400 text-xs font-bold tracking-[0.12em] mb-4">Coaching and School Discovery Platform</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-extrabold leading-[1.1] mb-6 tracking-tight">
                            Find the Best Coaching in Sikar
                        </h1>
                        <p className="text-base md:text-lg text-white/80 max-w-xl mb-8">
                            Compare coaching institutes, courses, fees, results and student reviews — all in one place.
                        </p>

                        <div className="relative max-w-xl mb-6">
                            <form onSubmit={handleSearch}>
                                <div className="relative flex items-center gap-2 rounded-full bg-white p-2 shadow-lg z-20">
                                    <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
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
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2.5 transition-colors shrink-0 border-none outline-none focus:outline-none ring-0 focus:ring-0">
                                        Search
                                    </button>
                                </div>
                                
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
                                                                        href={`${basePath || ''}/reviews/${biz.category || 'coaching-institutes'}/${biz.slug}`}
                                                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                                                    >
                                                                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200">
                                                                            <img src={biz.logo || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={biz.name} className="w-full h-full object-cover" />
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
                                                                        <span className="font-medium text-slate-800 line-clamp-1">{blog.title}</span>
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
                                                                        href={`${basePath || ''}/r/${community.name}`}
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
        <section className="py-6 bg-white border-b border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                <p className="text-xs font-bold text-slate-400 tracking-wider">Trusted Categories & Streams</p>
            </div>
            <div className="relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex animate-marquee items-center justify-center space-x-8 md:space-x-16 whitespace-nowrap">
                    {[...items, ...items, ...items].map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="text-slate-400 font-bold text-xl md:text-2xl opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2">
                            <GraduationCap className="w-6 h-6" /> {item.name.toLowerCase() === 'eduction' ? 'Education' : item.name}
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
        <section id="top-institutes" className="pt-10 pb-0 md:pt-14 md:pb-0 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Top Coaching Institutes in Sikar</h2>
                        <p className="text-slate-500 mt-2 text-base md:text-lg">Explore institutes based on courses, reviews, results and available information.</p>
                    </div>
                    <Link href={`${basePath}/reviews`} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm">
                        View All
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {businesses.map((biz) => {
                        const categorySlug = biz.category || 'coaching-institutes';
                        const reviewUrl = `${basePath}/reviews/${categorySlug}/${biz.slug}`;
                        
                        return (
                        <article key={biz.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                            <Link href={reviewUrl} className="relative aspect-[16/9] w-full block overflow-hidden bg-slate-100 flex items-center justify-center p-4">
                                <Image src={biz.logo || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={biz.name} fill style={{objectFit: 'contain'}} className="group-hover:scale-105 transition-transform duration-500" />
                            </Link>
                            
                            <div className="p-4 md:p-5 flex-grow flex flex-col border-t border-slate-100">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                                    <Link href={reviewUrl} className="focus:outline-none">{biz.name}</Link>
                                </h3>
                                
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3">
                                    <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {biz.rating || 4.5}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Trust: {biz.trustScore || 85}/100
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100">{biz.categoryName || biz.category}</span>
                                    {biz.isVerified && <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded border border-green-200 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Verified</span>}
                                    {biz.location && <span className="bg-slate-50 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1"><MapPin size={12}/>{biz.location}</span>}
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 space-y-1 text-sm text-slate-600">
                                    <Link href={reviewUrl} className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm">
                                        Read Reviews ({biz.reviewCount || 0})
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

    return (
        <section className="pt-6 pb-10 md:pt-10 md:pb-14 bg-slate-50 dark:bg-zinc-950 relative border-b border-slate-200 dark:border-zinc-800">
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
                    <Link href={`${basePath}/community`} className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 group shrink-0 whitespace-nowrap hidden md:inline-flex">
                        View All Feed <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Main Feed Column */}
                    <div className="lg:col-span-8 space-y-5">
                        {displayPosts.length > 0 ? displayPosts.map((post) => (
                            <div key={post.id} onClick={() => router.visit(`/r/${post.community}/comments/${post.id}`)} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-5 md:p-6 flex gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                                {/* Upvote Sidebar */}
                                <div className="hidden sm:flex flex-col items-center gap-2 min-w-[44px]">
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            router.post(route('vote'), { votable_type: 'post', votable_id: post.id, value: post.has_voted ? 1 : 1 }, { preserveScroll: true }); 
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
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg md:text-xl mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    
                                    {post.type === 'TEXT' && post.content && (
                                        <p className="text-slate-600 dark:text-zinc-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                                            {post.content.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center gap-4 text-slate-500 dark:text-zinc-500 text-sm font-bold">
                                        <div className="flex sm:hidden items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                                            <TrendingUp size={16} className={post.has_voted ? 'text-amber-500' : ''} /> <span className={post.has_voted ? 'text-amber-500' : ''}>{post.score}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-100 dark:bg-zinc-800 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-full sm:rounded-none">
                                            <MessageSquare size={16} /> {post.comments_count || post.comments} Comments
                                        </div>
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
                        <Link href={`${basePath}/community`} className="md:hidden flex w-full justify-center items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-colors group mt-2">
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
                                        <div key={community.id} onClick={() => router.visit(`/r/${community.name}`)} className="p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                                            <div className="font-bold text-slate-300 dark:text-zinc-700 group-hover:text-blue-500 transition-colors w-4">{index + 1}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">r/{community.name}</h4>
                                                </div>
                                                <div className="text-xs font-bold text-slate-500 dark:text-zinc-500 flex items-center gap-3">
                                                    <span>{community.members_count || community.members} Members</span>
                                                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500"><TrendingUp size={12} /> Hot</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); router.post(route('community.join', community.id), {}, { preserveScroll: true }); }}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all border ${community.is_joined ? 'border-transparent bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700' : 'border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:border-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:hover:text-white shadow-sm'}`}
                                            >
                                                {community.is_joined ? 'Joined' : 'Join'}
                                            </button>
                                        </div>
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
                            <Link href={`${basePath}/community/new`} className="btn-amber px-6 py-2.5 w-full block relative z-10 shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform text-slate-900 font-bold rounded-full">
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
        <section className="py-10 md:py-14 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 md:mb-10">
                    <div>
                        <p className="text-blue-500 text-sm font-bold tracking-wider mb-1">Editor's Picks</p>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Explore the Blog</h2>
                        <p className="text-slate-500 mt-2 text-base md:text-lg">Read the latest articles, guides, and updates.</p>
                    </div>
                    <Link href={`${basePath}/blog`} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-md transition-colors text-sm">
                        View All Blog
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <article key={post.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                            <Link href={`${basePath}/blog/${post.slug}`} className="relative aspect-[16/9] w-full block overflow-hidden">
                                <Image src={post.coverImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={post.title} fill style={{objectFit: 'cover'}} className="group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            
                            <div className="p-4 md:p-5 flex-grow flex flex-col">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                                    <Link href={`${basePath}/blog/${post.slug}`} className="focus:outline-none">{post.title}</Link>
                                </h3>
                                
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded border border-blue-100">{post.category || 'Article'}</span>
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 space-y-1 text-sm text-slate-600">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-slate-500">Posted:</span>
                                        <span className="font-semibold text-slate-800">{formatDate(post.date)}</span>
                                    </div>
                                    <Link href={`${basePath}/blog/${post.slug}`} className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded-md transition-colors text-sm">
                                        Read Article
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CategorySection = ({ categories, basePath }) => {
    if (!categories || categories.length === 0) return null;
    return (
        <section className="pt-10 pb-2 md:pt-14 md:pb-4 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore by Stream</h2>
                    <p className="text-slate-500 dark:text-zinc-400 mt-2 text-base md:text-lg">Find the right path for your career goals.</p>
                </div>
                
                {/* Infinite Scrolling Marquee for Categories */}
                <div className="relative flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                    <div className="flex animate-marquee-fast items-center justify-center space-x-4 md:space-x-6 whitespace-nowrap pt-2 pb-6">
                        {[...categories, ...categories, ...categories, ...categories].map((cat, i) => (
                            <Link key={`${cat.id}-${i}`} href={`${basePath}/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`} 
                                className="bg-slate-50 w-40 h-40 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group flex flex-col items-center justify-center text-center shrink-0">
                                <div className="w-12 h-12 bg-white group-hover:bg-blue-600 rounded-full flex items-center justify-center text-blue-600 group-hover:text-white mb-3 transition-colors">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors whitespace-normal break-words w-full px-2 leading-tight">{cat.name.toLowerCase() === 'eduction' ? 'Education' : cat.name}</h3>
                            </Link>
                        ))}
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
                            <Image src={story.posterImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={story.title} fill style={{objectFit: 'cover'}} className="group-hover:scale-105 transition-transform duration-700"/>
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

const SeoContent = () => (
    <section className="py-10 md:py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                    <span className="text-blue-600 font-bold tracking-widest text-xs mb-3 block">About Us</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Coaching in Sikar: Your Complete Education Guide</h2>
                    <div className="text-slate-600 text-base md:text-lg leading-relaxed space-y-4">
                        <p>Our mission is simple — to make educational information easier to find, understand, and compare. We research and publish useful guides covering coaching institutes, academic programs, exam preparation, results, facilities, courses, and student experiences.</p>
                        <p>Sikar has rapidly emerged as a major educational hub in Rajasthan, attracting thousands of students every year who dream of securing top ranks in national-level competitive exams like NEET and IIT-JEE.</p>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-3 rounded-full text-green-600">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800">Verified Data</div>
                                <div className="text-sm text-slate-500">Trusted reviews</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800">Top Institutes</div>
                                <div className="text-sm text-slate-500">Ranked accurately</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mt-8 lg:mt-0">
                    <div className="absolute inset-0 bg-blue-600/10 rounded-[2rem] transform translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" 
                        alt="Students studying" 
                        className="relative z-10 rounded-[2rem] shadow-xl w-full object-cover aspect-[4/3] border-4 border-white"
                    />
                </div>
            </div>
        </div>
    </section>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "How do I choose the best coaching institute in Sikar?",
            answer: "Choosing the right coaching depends on your goals, budget, and learning style. We recommend checking verified reviews, past year results, faculty profiles, and visiting the campus for a demo class before making a decision."
        },
        {
            question: "Are the reviews on Coaching Sikar verified?",
            answer: "Yes, we have a strict verification process. We ensure that reviews are submitted by genuine students or parents who have actual experience with the respective coaching institutes."
        },
        {
            question: "Which are the top courses offered by institutes in Sikar?",
            answer: "Sikar is widely known for JEE (Main & Advanced) and NEET preparation. Additionally, many institutes offer excellent foundation courses for classes 8th to 10th, NDA, and other competitive exams."
        },
        {
            question: "Is hostel facility available for students outside Sikar?",
            answer: "Absolutely. Sikar is a major education hub and has hundreds of secure, well-equipped hostels for both boys and girls, many of which are directly affiliated with top coaching institutes."
        },
        {
            question: "Can I get scholarships for coaching in Sikar?",
            answer: "Yes, almost all major institutes conduct their own scholarship cum admission tests (like ASAT, TALLENTEX, etc.) offering up to 90% scholarships based on your performance."
        }
    ];

    return (
        <section className="pt-16 pb-16 md:pt-24 md:pb-20 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 relative overflow-hidden">
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
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider mb-6">
                                <MessageSquare className="w-4 h-4" /> Got Questions?
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                                Frequently Asked <span className="text-blue-600">Questions</span>
                            </h2>
                            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                                Everything you need to know about coaching institutes, education, and living in Sikar. Can't find the answer you're looking for?
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Search className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-1">Still have questions?</h3>
                                <p className="text-sm text-slate-500 mb-4">Chat with our educational counselors for personalized guidance.</p>
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
                                    className={`group border rounded-2xl overflow-hidden transition-all duration-500 ${isOpen ? 'bg-white shadow-xl shadow-blue-900/5 border-blue-200 ring-1 ring-blue-100' : 'bg-white/60 border-slate-200 hover:border-blue-300 hover:bg-white backdrop-blur-sm'}`}
                                >
                                    <button 
                                        className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none focus:ring-0 ring-0 border-none bg-transparent cursor-pointer"
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className={`font-bold text-lg pr-6 transition-colors duration-300 ${isOpen ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-600'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-180 shadow-md shadow-blue-600/20' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </button>
                                    <div 
                                        className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
                                    >
                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5"></div>
                                        <p className="text-slate-600 leading-relaxed text-base m-0">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function Welcome(props) {
    const { featuredPost, recentPosts, morePosts, publishedStories, sliders, categories, authors, meta, featuredBusinesses, feedPosts, topCommunities } = props;
    const basePath = typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '';

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <SeoMeta meta={meta} />
            <GlobalNavbar />
            
            <main>
                <HomeHero activeSlides={sliders || []} basePath={basePath} categories={categories || []} featuredBusinesses={featuredBusinesses || []} />
                <TrustMarquee categories={categories || []} />
                <InstitutesSection featuredBusinesses={featuredBusinesses || []} basePath={basePath} formatDate={formatDate} />
                <CommunityFeedSection basePath={basePath} feedPosts={feedPosts} topCommunities={topCommunities} />
                <SeoContent />
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
