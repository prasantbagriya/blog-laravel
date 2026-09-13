import React, { useRef, useEffect, useState } from 'react';

export default function AnimatedBorderCard({ children, className = '', containerClassName = '', ...props }) {
    const cardRef = useRef(null);
    const [isInCenter, setIsInCenter] = useState(false);

    useEffect(() => {
        if (!cardRef.current) return;

        // Mobile optimization: detect when card is in center 40% of viewport
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsInCenter(entry.isIntersecting);
                });
            },
            {
                root: null,
                rootMargin: '-30% 0px -30% 0px',
                threshold: 0
            }
        );

        observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={cardRef}
            className={`group relative overflow-hidden rounded-3xl transition-transform duration-300 ${containerClassName}`}
            {...props}
        >
            {/* The rotating gradient background layer */}
            <div 
                className={`absolute inset-[-50%] transition-opacity duration-500 ease-in-out pointer-events-none z-0 
                ${isInCenter ? 'opacity-100 sm:opacity-0' : 'opacity-0'} group-hover:opacity-100`}
                style={{
                    background: 'conic-gradient(from 0deg, transparent 0 340deg, #3b82f6 360deg)',
                    animation: 'spin 3s linear infinite'
                }}
            ></div>
            
            {/* Fading default static border */}
            <div className={`absolute inset-0 border border-slate-200/60 dark:border-zinc-700/50 rounded-3xl pointer-events-none transition-opacity duration-300 z-10 
                ${isInCenter ? 'opacity-0 sm:opacity-100' : 'opacity-100'} group-hover:opacity-0`}></div>

            {/* Inner content container */}
            <div className={`relative z-10 m-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] rounded-[calc(1.5rem-2px)] overflow-hidden bg-white dark:bg-zinc-900 ${className}`}>
                {children}
            </div>
            
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
