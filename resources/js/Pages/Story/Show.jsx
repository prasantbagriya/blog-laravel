import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

// Polyfill for Next.js Image
const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} {...props} />;
};

export default function StoryShow({ story }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (currentSlide < story.pages.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    if (!story || !story.pages) return <div>Story not found</div>;

    const page = story.pages[currentSlide];

    return (
        <div className="bg-black w-full h-screen text-white flex flex-col items-center justify-center relative overflow-hidden">
            <Head title={`${story.title} | Web Story`} />
            
            <Link href={window.BASE_PATH + "/stories"} className="absolute top-6 right-6 z-50 bg-black/50 p-2 rounded-full text-white hover:bg-black/80">
                ✕ Close
            </Link>

            {/* Progress Bar */}
            <div className="absolute top-2 left-0 right-0 z-40 flex gap-1 px-2">
                {story.pages.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/30 rounded overflow-hidden">
                        <div 
                            className="h-full bg-white transition-all duration-300"
                            style={{ 
                                width: idx < currentSlide ? '100%' : idx === currentSlide ? '100%' : '0%' // simplified
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative w-full max-w-sm h-full max-h-[85vh] bg-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-end">
                {page.image && (
                    <Image src={page.image} alt={page.title || story.title} fill style={{ objectFit: 'cover' }} />
                )}
                
                <div className="relative z-10 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pt-32">
                    <h2 className="text-3xl font-bold mb-4">{page.title || story.title}</h2>
                    <p className="text-lg opacity-90">{page.content}</p>
                </div>

                {/* Click areas */}
                <div 
                    className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-w-resize"
                    onClick={prevSlide}
                />
                <div 
                    className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-e-resize"
                    onClick={nextSlide}
                />
            </div>
        </div>
    );
}
