/**
 * PageHero — Reusable hero/header section for static pages
 * Usage:
 *   <PageHero
 *     badge="Browse Topics"          // pill badge text
 *     badgeIcon={Grid3X3}            // lucide icon component
 *     title="Explore Categories"     // main h1 (supports JSX for colored spans)
 *     description="Discover articles..." // subtitle
 *   />
 */

import React from 'react';

interface PageHeroProps {
  badge?: string;
  badgeIcon?: React.ElementType;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode; // extra content below description
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
  children,
  className = '',
}) => {
  const isCentered = className.includes('text-center');

  return (
    <section className={`relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#09090b] overflow-hidden ${className}`}>
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className={`max-w-7xl mx-auto relative z-10 ${isCentered ? 'flex flex-col items-center' : ''}`}>
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-widest uppercase mb-5">
            {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
            {badge}
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          {title}
        </h1>
        {description && (
          <p className={`text-slate-500 dark:text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed ${isCentered ? 'text-center mx-auto' : ''}`}>
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};


/**
 * SectionHeader — Reusable section header with badge + title + description
 * Usage:
 *   <SectionHeader
 *     badge="Verified Business Catalog"
 *     badgeIcon={ShieldCheck}
 *     title={<>Explore <span className="text-blue-500">Sectors</span></>}
 *     description="Browse verified companies..."
 *     action={<Link>View All</Link>}  // optional right-side action
 *   />
 */

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ElementType;
  badgeColor?: string; // tailwind classes for badge color, defaults to blue
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  center?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeIcon: BadgeIcon,
  badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  title,
  description,
  action,
  className = '',
  center = false,
}) => {
  return (
    <div className={`flex flex-col ${center ? 'items-center text-center' : 'sm:flex-row sm:items-end'} justify-between gap-4 mb-10 ${className}`}>
      <div className={center ? 'flex flex-col items-center' : ''}>
        {badge && (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border mb-3 ${badgeColor}`}>
            {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
            {badge}
          </div>
        )}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-slate-500 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-lg">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};


/**
 * AmberPillButton — Reusable amber CTA button
 * Usage:
 *   <AmberPillButton onClick={...}>Send Message</AmberPillButton>
 *   <AmberPillButton as={Link} href="/contact">Contact Us</AmberPillButton>
 */

interface AmberPillButtonProps {
  as?: React.ElementType;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export const AmberPillButton: React.FC<AmberPillButtonProps> = ({
  as: Tag = 'button',
  href,
  onClick,
  disabled,
  className = '',
  children,
  type = 'button',
}) => {
  return (
    <Tag
      href={href}
      onClick={onClick}
      disabled={disabled}
      type={Tag === 'button' ? type : undefined}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </Tag>
  );
};


/**
 * PillBadge — Small inline badge/tag
 * Usage:
 *   <PillBadge icon={Tag} color="amber">Category Name</PillBadge>
 */

interface PillBadgeProps {
  icon?: React.ElementType;
  color?: 'amber' | 'blue' | 'green' | 'rose' | 'violet' | 'slate';
  children: React.ReactNode;
  className?: string;
}

const colorMap: Record<string, string> = {
  amber:  'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  blue:   'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  green:  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  rose:   'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  slate:  'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border-slate-200 dark:border-zinc-700',
};

export const PillBadge: React.FC<PillBadgeProps> = ({
  icon: Icon,
  color = 'amber',
  children,
  className = '',
}) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${colorMap[color]} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};


/**
 * InfoCard — Contact/info card with icon, label, value and sub-text
 * Usage:
 *   <InfoCard icon={Mail} color="amber" label="Email Us" value="contact@..." sub="Reply within 24h" />
 */

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string; // e.g. "bg-amber-500/10 text-amber-600 dark:text-amber-400"
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value, sub, color = 'bg-amber-500/10 text-amber-600 dark:text-amber-400' }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 transition-all duration-200">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-extrabold text-slate-800 dark:text-white text-sm mb-1">{label}</h3>
      <p className="text-slate-900 dark:text-zinc-200 font-semibold text-sm mb-1">{value}</p>
      {sub && <p className="text-slate-400 dark:text-zinc-500 text-xs">{sub}</p>}
    </div>
  );
};
