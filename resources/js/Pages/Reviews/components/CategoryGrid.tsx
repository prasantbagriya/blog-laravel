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
  ShieldCheck
} from 'lucide-react';
import { Category } from '../types';

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

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  return (
    <section className="py-12 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-l-3 border-blue-600 pl-3">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 mb-1">
              Verified Business Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial-serif italic font-bold text-zinc-900 dark:text-white">
              Explore Industry Sectors
            </h2>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.iconName);

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group p-5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="w-9 h-9 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                      {cat.businessCount.toLocaleString()} Listed
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition">
                    {cat.name === 'Eduction' ? 'Education' : cat.name}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 font-semibold">
                  <span>Browse Index</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
