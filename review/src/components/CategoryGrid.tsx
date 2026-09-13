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
    <section className="py-12 bg-[#F5F5F2] dark:bg-[#0F0F0E] border-b border-[#E5E5E1] dark:border-[#2A2A28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-l-3 border-[#0052FF] pl-3">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#0052FF] mb-1">
              Verified Business Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial-serif italic font-bold text-[#1A1A1A] dark:text-white">
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
                className="group p-5 rounded-md bg-white dark:bg-[#161615] border border-[#E5E5E1] dark:border-[#2A2A28] hover:border-[#0052FF] shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="w-9 h-9 rounded-md bg-[#E6EEFF] text-[#0052FF] dark:bg-[#0052FF]/20 dark:text-[#80B0FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F5F5F2] dark:bg-[#2A2A28] text-[#555555] dark:text-[#A0A09C] group-hover:bg-[#E6EEFF] group-hover:text-[#0052FF] transition">
                      {cat.businessCount.toLocaleString()} Listed
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white group-hover:text-[#0052FF] transition">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-[#555555] dark:text-[#A0A09C] mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E5E1] dark:border-[#2A2A28] flex items-center justify-between text-xs text-[#555555] dark:text-[#A0A09C] group-hover:text-[#0052FF] font-semibold">
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
