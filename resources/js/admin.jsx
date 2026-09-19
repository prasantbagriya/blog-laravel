import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            [`./Pages/${name}.jsx`, `./Pages/${name}.tsx`],
            // Admin-only entry pages. Shared forms and layout components are
            // imported by those pages, never exposed as individual route chunks.
            import.meta.glob([
                './Pages/Admin/Index.jsx',
                './Pages/Admin/Authors/{Edit,Index,New}.jsx',
                './Pages/Admin/Businesses/Index.jsx',
                './Pages/Admin/Categories/Index.jsx',
                './Pages/Admin/Communities/{Edit,Index}.jsx',
                './Pages/Admin/CommunityPosts/Index.jsx',
                './Pages/Admin/ContactMessages/Index.jsx',
                './Pages/Admin/Media/Index.jsx',
                './Pages/Admin/Posts/{Edit,New}.jsx',
                './Pages/Admin/SeoAudit/Index.jsx',
                './Pages/Admin/Settings/Slider.jsx',
                './Pages/Admin/Stories/{Edit,Index,New}.jsx',
            ]),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
