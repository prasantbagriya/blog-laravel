import React from 'react';
import { 
  Cloud, 
  Sparkles, 
  ShoppingBag, 
  Hospital, 
  Server, 
  GraduationCap, 
  Building, 
  CreditCard,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Category } from '../types';
import { SectionHeader } from '../../../NextComponents/UI';
import AnimatedBorderCard from '@/Components/AnimatedBorderCard';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Cloud': return Cloud;
    case 'Sparkles': return Sparkles;
    case 'ShoppingBag': return ShoppingBag;
    case 'Hospital': return Hospital;
    case 'Server': return Server;
    case 'GraduationCap': return GraduationCap;
    case 'Building': return Building;
    case 'CreditCard': return CreditCard;
    default: return ShieldCheck;
  }
};

const categoryColors: Record<string, { bg: string; icon: string; border: string; badge: string }> = {
  Cloud:        { bg: 'bg-sky-500/10',    icon: 'text-sky-500',    border: 'group-hover:border-sky-500/60',    badge: 'group-hover:bg-sky-500/10 group-hover:text-sky-500' },
  Sparkles:     { bg: 'bg-violet-500/10', icon: 'text-violet-500', border: 'group-hover:border-violet-500/60', badge: 'group-hover:bg-violet-500/10 group-hover:text-violet-500' },
  ShoppingBag:  { bg: 'bg-amber-500/10',  icon: 'text-amber-500',  border: 'group-hover:border-amber-500/60',  badge: 'group-hover:bg-amber-500/10 group-hover:text-amber-500' },
  Hospital:     { bg: 'bg-rose-500/10',   icon: 'text-rose-500',   border: 'group-hover:border-rose-500/60',   badge: 'group-hover:bg-rose-500/10 group-hover:text-rose-500' },
  Server:       { bg: 'bg-emerald-500/10',icon: 'text-emerald-500',border: 'group-hover:border-emerald-500/60',badge: 'group-hover:bg-emerald-500/10 group-hover:text-emerald-500' },
  GraduationCap:{ bg: 'bg-indigo-500/10', icon: 'text-indigo-500', border: 'group-hover:border-indigo-500/60', badge: 'group-hover:bg-indigo-500/10 group-hover:text-indigo-500' },
  Building:     { bg: 'bg-orange-500/10', icon: 'text-orange-500', border: 'group-hover:border-orange-500/60', badge: 'group-hover:bg-orange-500/10 group-hover:text-orange-500' },
  CreditCard:   { bg: 'bg-teal-500/10',   icon: 'text-teal-500',   border: 'group-hover:border-teal-500/60',   badge: 'group-hover:bg-teal-500/10 group-hover:text-teal-500' },
};

const defaultColor = { bg: 'bg-blue-500/10', icon: 'text-blue-500', border: 'group-hover:border-blue-500/60', badge: 'group-hover:bg-blue-500/10 group-hover:text-blue-500' };

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          badge="Verified Business Catalog"
          badgeIcon={ShieldCheck}
          title={<>Explore Industry Sectors</>}
          description="Browse verified companies by sector — each backed by real invoices and AI fraud detection."
        />

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.iconName);
            const colors = categoryColors[cat.iconName] || defaultColor;

            return (
              <AnimatedBorderCard
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                containerClassName="hover:-translate-y-0.5 cursor-pointer"
                className={`p-5 flex flex-col justify-between h-full ${colors.border}`}
              >
                {/* Subtle bg glow on hover */}
                <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.icon} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 ${colors.badge} transition-colors duration-200 shrink-0`}>
                      {cat.businessCount.toLocaleString()} Listed
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className={`relative z-10 mt-5 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-slate-400 dark:text-zinc-500 ${colors.icon} opacity-60 group-hover:opacity-100 transition-all duration-200`}>
                  <span>Browse Index</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </AnimatedBorderCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
