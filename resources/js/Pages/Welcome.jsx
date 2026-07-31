import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../NextComponents/GlobalNavbar';
import BlogFooter from '../NextComponents/BlogFooter';
import React from 'react';

// Simple polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} {...props} />;
};

const sliderImages = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80'
];

export default function Welcome({ featuredPost, recentPosts, publishedStories, sliders }) {
    recentPosts = recentPosts || [];
    publishedStories = publishedStories || [];
    
    return (
        <div className="bg-white min-h-screen">
            <Head title="Blog | Leading Authority on Modern Web & SEO 2026">
                <meta name="description" content="Expert insights, visual web stories, and high-performance strategies to dominate Google search and AI overviews in 2026." />
            </Head>
            
            <GlobalNavbar />
            
            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="hero-skeleton animate-fade-in" style={{ 
                    textAlign: 'center', 
                    padding: '3rem 0 1.5rem 0', 
                    background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
                    marginBottom: '1.5rem',
                    marginTop: '6rem',
                    overflow: 'hidden'
                }}>
                    {/* Text removed as requested */}

                    {/* Auto-scrolling image slider */}
                    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '1rem 0' }}>
                        <div style={{ 
                            display: 'flex', 
                            width: 'max-content',
                            animation: 'scroll-marquee 60s linear infinite' 
                        }}>
                            {/* Render multiple times for seamless scrolling */}
                            {[...(sliders?.length > 0 ? sliders : sliderImages), ...(sliders?.length > 0 ? sliders : sliderImages), ...(sliders?.length > 0 ? sliders : sliderImages), ...(sliders?.length > 0 ? sliders : sliderImages)].map((slide, index) => {
                                const imgSrc = typeof slide === 'string' ? slide : slide.image_url;
                                const title = typeof slide === 'object' ? slide.title : null;
                                const subtitle = typeof slide === 'object' ? slide.subtitle : null;
                                const link = typeof slide === 'object' ? slide.link : null;
                                
                                const slideContent = (
                                    <>
                                        <Image 
                                            src={imgSrc} 
                                            alt={title || `Slide ${index}`} 
                                            fill 
                                            style={{ objectFit: 'cover' }}
                                        />
                                        {(title || subtitle) && (
                                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '2rem 1.5rem 1.5rem', color: '#fff', textAlign: 'left' }}>
                                                {title && <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 800 }}>{title}</h3>}
                                                {subtitle && <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>{subtitle}</p>}
                                            </div>
                                        )}
                                    </>
                                );
                                
                                const wrapperStyle = { 
                                    width: '600px', 
                                    height: '400px', 
                                    margin: '0 16px',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                    flexShrink: 0,
                                    transform: 'scale(0.98)',
                                    transition: 'transform 0.3s ease',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    display: 'block'
                                };

                                return (
                                    <div key={index} style={wrapperStyle}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                                    >
                                        {link ? (
                                            <a href={link} style={{ display: 'block', width: '100%', height: '100%' }}>
                                                {slideContent}
                                            </a>
                                        ) : slideContent}
                                    </div>
                                );
                            })}
                        </div>
                        <style>{`
                            @keyframes scroll-marquee {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            
                            /* Pause animation on hover for better UX */
                            div[style*="scroll-marquee"]:hover {
                                animation-play-state: paused !important;
                            }
                        `}</style>
                    </div>

                </section>

                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Featured Insight */}
                    {featuredPost && (
                        <section className="lcp-section" style={{ marginBottom: '5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Featured Insight</h2>
                                <Link href={window.BASE_PATH + "/blog"} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9375rem', padding: '0.5rem 0' }}>View All Posts →</Link>
                            </div>
                            <article className="glass-panel card-hover rounded-xl" style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', 
                                overflow: 'hidden', 
                                minHeight: '480px',
                                border: '1px solid var(--border)',
                                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.05)'
                            }}>
                                <Link href={window.BASE_PATH + `/blog/${featuredPost.slug}`} style={{ position: 'relative', minHeight: '320px', display: 'block' }}>
                                    <Image 
                                        src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} 
                                        alt={featuredPost.title} 
                                        fill 
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Link>
                                <div style={{ padding: 'clamp(1.25rem, 5vw, 3.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#ffffff' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                        <span style={{ background: 'var(--primary, blue)', color: 'white', fontSize: '0.7rem', fontWeight: 900, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>FEATURED</span>
                                        <span style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{featuredPost.category}</span>
                                    </div>
                                    <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: 'clamp(1rem, 2vw, 1.5rem)', lineHeight: 1.15, fontWeight: 900, letterSpacing: '-0.03em' }}>
                                        <Link href={window.BASE_PATH + `/blog/${featuredPost.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{featuredPost.title}</Link>
                                    </h3>
                                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'clamp(0.95rem, 2vw, 1.125rem)', marginBottom: 'clamp(1.25rem, 3vw, 2.5rem)', lineHeight: 1.6 }}>{featuredPost.excerpt}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', position: 'relative', border: '2px solid var(--primary)' }}>
                                        <Image src={featuredPost.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'} alt={featuredPost.author} fill style={{ objectFit: 'cover' }} />
                                        </div>
                                        <div>
                                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{featuredPost.author}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>{featuredPost.date}</div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </section>
                    )}

                    {/* Visual Web Stories Hub */}
                    {publishedStories.length > 0 && (
                        <section style={{ marginBottom: '5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                                <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Visual Web Stories</h2>
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>Bite-sized visual guides for modern SEO.</p>
                                </div>
                                <Link href={window.BASE_PATH + "/stories"} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9375rem', padding: '0.5rem 0' }}>Explore Stories →</Link>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                                {publishedStories.map((story) => (
                                <Link key={story.id} href={window.BASE_PATH + `/stories/${story.slug}`} style={{ display: 'block', aspectRatio: '3/4', position: 'relative', borderRadius: 'var(--radius, 12px)', overflow: 'hidden', boxShadow: 'var(--shadow)' }} className="card-hover">
                                    <Image src={story.posterImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={story.title} fill style={{ objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                    <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{story.title}</h3>
                                    </div>
                                </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Recent Analysis Grid */}
                    {recentPosts.length > 0 && (
                        <section style={{ marginBottom: '5rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Latest Technical Audits</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '2rem' }}>
                                {recentPosts.map((post) => (
                                <article key={post.id} className="glass-panel card-hover rounded-xl" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #eee' }}>
                                    <Link href={window.BASE_PATH + `/blog/${post.slug}`} style={{ position: 'relative', width: '100%', height: '220px', display: 'block' }}>
                                    <Image src={post.coverImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt={post.title} fill style={{ objectFit: 'cover' }} />
                                    </Link>
                                    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'var(--primary, blue)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>{post.category || 'Insight'}</span>
                                    <h3 style={{ fontSize: '1.375rem', marginBottom: '1rem', lineHeight: 1.3, fontWeight: 700 }}>
                                        <Link href={window.BASE_PATH + `/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{post.title}</Link>
                                    </h3>
                                    <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem', marginBottom: '1.5rem', flex: 1, lineHeight: 1.5 }}>{post.excerpt}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', paddingTop: '1rem', borderTop: '1px solid var(--border, #eee)' }}>
                                        <span style={{ fontWeight: 700 }}>{post.date}</span>
                                        <Link href={window.BASE_PATH + `/blog/${post.slug}`} style={{ color: 'var(--primary, blue)', fontWeight: 800, padding: '0.5rem 0' }}>Read Insight →</Link>
                                    </div>
                                    </div>
                                </article>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <BlogFooter />
        </div>
    );
}
