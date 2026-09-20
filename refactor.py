import re

def refactor():
    file_path = 'e:\\blog-laravel\\resources\\js\\Pages\\Welcome.jsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove definitions of Link, navigate, postHomeAction, Image
    content = re.sub(r'const Link = \(\{ href, children, \.\.\.props \}\) => <a href=\{href\} \{\.\.\.props\}>\{children\}</a>;\n', '', content)
    content = re.sub(r'const navigate = \(url\) => window\.location\.assign\(url\);\n', '', content)
    content = re.sub(r'const postHomeAction = async \(url, data = \{\}\) => \{.*?\};\n', '', content, flags=re.DOTALL)
    content = re.sub(r'// Simple polyfill for Next\.js Image\nconst Image = \(\{ src, alt, fill, style, sizes, priority, fetchPriority, className, \.\.\.props \}\) => \{.*?\};\n', '', content, flags=re.DOTALL)
    
    # 2. Remove TrustMarquee, InstitutesSection, CommunityFeedSection
    content = re.sub(r'const TrustMarquee = \(\{ categories \}\) => \{.*?\};\n\n\n', '', content, flags=re.DOTALL)
    content = re.sub(r'const InstitutesSection = \(\{ featuredBusinesses, basePath \}\) => \{.*?\};\n\n', '', content, flags=re.DOTALL)
    content = re.sub(r'const CommunityFeedSection = \(\{ basePath, feedPosts, topCommunities \}\) => \{.*?\};\n\n', '', content, flags=re.DOTALL)

    # 3. Add imports at the top
    import_statement = """import React, { useState, useEffect, Suspense } from 'react';
import { Link, navigate, postHomeAction, Image } from './HomeComponents/utils';
const TrustMarquee = React.lazy(() => import('./HomeComponents/TrustMarquee'));
const InstitutesSection = React.lazy(() => import('./HomeComponents/InstitutesSection'));
const CommunityFeedSection = React.lazy(() => import('./HomeComponents/CommunityFeedSection'));
"""
    content = content.replace("import React, { useState, useEffect, Suspense } from 'react';", import_statement)

    # 4. Wrap with Suspense in render
    old_render = """                <TrustMarquee categories={categories || []} />
                <InstitutesSection featuredBusinesses={featuredBusinesses || []} basePath={basePath} formatDate={formatDate} />
                <CommunityFeedSection basePath={basePath} feedPosts={feedPosts} topCommunities={topCommunities} />"""
    
    new_render = """                <Suspense fallback={<div className="h-20 bg-slate-50 dark:bg-zinc-900 animate-pulse"></div>}>
                    <TrustMarquee categories={categories || []} />
                </Suspense>
                <Suspense fallback={<div className="h-96 bg-white dark:bg-zinc-950 animate-pulse"></div>}>
                    <InstitutesSection featuredBusinesses={featuredBusinesses || []} basePath={basePath} formatDate={formatDate} />
                </Suspense>
                <Suspense fallback={<div className="h-96 bg-slate-50 dark:bg-zinc-950 animate-pulse"></div>}>
                    <CommunityFeedSection basePath={basePath} feedPosts={feedPosts} topCommunities={topCommunities} />
                </Suspense>"""
    
    content = content.replace(old_render, new_render)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Refactor complete")

if __name__ == '__main__':
    refactor()
