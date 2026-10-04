import React from 'react';
import { Link, Image } from './utils';
import { PlayCircle } from 'lucide-react';

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
                            <Image src={story.posterImage || '/uploads/read.webp'} alt={story.title} fill width="260" height="462" style={{objectFit: 'cover'}} className="group-hover:scale-105 transition-transform duration-700"/>
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

export default StoriesSection;
