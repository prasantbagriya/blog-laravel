import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import SeoMeta from '../../NextComponents/SeoMeta';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';
import AnimatedBorderCard from '../../Components/AnimatedBorderCard';
import { Grid3X3, ArrowRight, BookOpen, Building, Sparkles } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../Reviews/data/mockData';

// Premium high-quality images for institute categories
const categoryImages = {
    'saas': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    'ai-tools': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    'ecommerce': 'https://images.unsplash.com/photo-1556742049-0a67dd385750?w=800&auto=format&fit=crop&q=80',
    'hospitals': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    'hosting': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    'coaching': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    'hotels': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    'finance': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
};

const defaultImages = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
];

const getCategoryImageByWord = (name) => {
    if (!name) return defaultImages[0];
    const n = name.toLowerCase();
    if (n.includes('ai') || n.includes('tech') || n.includes('software')) return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80';
    if (n.includes('ecommerce') || n.includes('shop') || n.includes('store')) return 'https://images.unsplash.com/photo-1556742049-0a67dd385750?w=800&auto=format&fit=crop&q=80';
    if (n.includes('health') || n.includes('hospital') || n.includes('medical')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
    if (n.includes('host') || n.includes('server') || n.includes('cloud')) return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80';
    if (n.includes('coach') || n.includes('educat') || n.includes('school') || n.includes('learn')) return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80';
    if (n.includes('hotel') || n.includes('travel') || n.includes('tour')) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';
    if (n.includes('financ') || n.includes('money') || n.includes('bank')) return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80';
    if (n.includes('design') || n.includes('art') || n.includes('creat')) return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80';
    if (n.includes('food') || n.includes('restaurant') || n.includes('cafe')) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';
    if (n.includes('music') || n.includes('audio')) return 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80';
    
    let hash = 0;
    for(let i = 0; i < n.length; i++) {
        hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    const fallbacks = [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1531297122539-5692b6982f08?w=800&auto=format&fit=crop&q=80',
    ];
    return fallbacks[Math.abs(hash) % fallbacks.length];
};

export default function CategoryIndex({ categories, meta }) {
    const [activeTab, setActiveTab] = useState('blog');

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen text-slate-900 dark:text-white font-sans selection:bg-amber-500/30 relative flex flex-col transition-colors duration-300">
            <SeoMeta meta={meta} />
            <GlobalNavbar />

            {/* Custom Clean Hero */}
            <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 z-10 text-center">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                        <Grid3X3 className="w-4 h-4 text-amber-500" />
                        Directory & Topics
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
                        Explore <span className="text-amber-500">Categories</span>
                    </h1>
                    
                    <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Discover insightful articles, verified coaching institutes, and expert guidance organized perfectly by topic.
                    </p>
                </div>
            </section>

            {/* Content Area */}
            <main className="flex-grow pb-24 px-4 sm:px-6 lg:px-8 z-10 relative">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Clean Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => setActiveTab('blog')}
                                className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-sm ${activeTab === 'blog' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'}`}
                            >
                                <BookOpen size={18} /> Blog Categories
                            </button>
                            <button 
                                onClick={() => setActiveTab('reviews')}
                                className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-sm ${activeTab === 'reviews' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'}`}
                            >
                                <Building size={18} /> Institute Categories
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                        {activeTab === 'blog' && categories.map((category, index) => (
                            <AnimatedBorderCard
                                key={category.id || category.slug}
                                containerClassName="h-full flex flex-col"
                                className="flex flex-col h-full w-full"
                            >
                                <Link
                                    href={(typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + `/category/${category.slug}`}
                                    className="flex flex-col h-full w-full"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 w-full overflow-hidden shrink-0">
                                        <img
                                            src={category.image || getCategoryImageByWord(category.name)}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
    
                                    {/* Info */}
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border border-amber-200 dark:border-amber-800/50 shrink-0">
                                                    <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                    {category.name}
                                                </h3>
                                            </div>
                                            {category.description && (
                                                <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-3 leading-relaxed font-medium mb-4">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-semibold text-slate-500 dark:text-zinc-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors pt-4 border-t border-slate-100 dark:border-zinc-800">
                                            <span>Browse Articles</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </AnimatedBorderCard>
                        ))}


                        {activeTab === 'reviews' && INITIAL_CATEGORIES.map((category, index) => {
                            const imageSrc = categoryImages[category.slug] || getCategoryImageByWord(category.name);
                            return (
                                <AnimatedBorderCard
                                    key={category.id || category.slug}
                                    containerClassName="h-full flex flex-col"
                                    className="flex flex-col h-full w-full"
                                >
                                    <Link
                                        href={(typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + `/reviews/${category.slug}`}
                                        className="flex flex-col h-full w-full"
                                    >
                                        {/* Cover Image */}
                                        <div className="relative h-48 w-full overflow-hidden shrink-0">
                                            <img 
                                                src={imageSrc} 
                                                alt={category.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
    
                                        {/* Info */}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800/50 group-hover:scale-110 transition-transform shrink-0">
                                                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                                    {category.name}
                                                </h3>
                                                {category.description && (
                                                    <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-3 leading-relaxed font-medium mb-4">
                                                        {category.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between text-sm font-bold text-slate-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pt-4 border-t border-slate-100 dark:border-zinc-800">
                                                <span>Explore Institutes</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedBorderCard>
                            );
                        })}
                    </div>
                </div>
            </main>

            <div className="z-10 relative">
                <BlogFooter />
            </div>
        </div>
    );
}
