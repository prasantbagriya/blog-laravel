import React from 'react';
import { Head, Link } from '@inertiajs/react';
import GlobalNavbar from '../../NextComponents/GlobalNavbar';
import BlogFooter from '../../NextComponents/BlogFooter';

const Image = ({ src, alt, fill, style, sizes, priority, fetchPriority, ...props }) => {
    const imgStyle = fill ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', ...style } : style;
    return <img src={src} alt={alt} style={imgStyle} sizes={sizes} {...props} />;
};

export default function CategoryIndex({ categories }) {
    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Head title="Categories | Blog" />
            <GlobalNavbar />
            <main className="container mx-auto px-4 py-8 max-w-6xl mt-16 flex-grow">
                <header className="mb-12 border-b pb-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Explore Categories</h1>
                    <p className="text-gray-600">Find insights by topic.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categories.map((category) => (
                        <Link key={category.id || category.slug} href={window.BASE_PATH + `/category/${category.slug}`} className="block text-center group">
                            <div className="relative w-full h-48 mx-auto mb-4 rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all">
                                <Image src={category.image || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&q=80'} alt={category.name} fill style={{ objectFit: 'cover' }} />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{category.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <BlogFooter />
        </div>
    );
}
