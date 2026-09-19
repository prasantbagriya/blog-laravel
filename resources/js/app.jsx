import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'coachingsinsikar';

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            [`./Pages/${name}.jsx`, `./Pages/${name}.tsx`],
            // Register only server-renderable public pages.  A broad Pages/** glob
            // also registers internal React components, data files, and type files
            // as routes, needlessly keeping them in the public module map.
            import.meta.glob([
                './Pages/Dashboard.jsx',
                './Pages/Auth/*.jsx',
                './Pages/Author/{Index,Show}.jsx',
                './Pages/Blog/{Index,Show}.jsx',
                './Pages/Business/{Create,Edit}.jsx',
                './Pages/Category/{Index,Show}.jsx',
                './Pages/Community/{Create,Edit,Feed,ModQueue,Show}.jsx',
                './Pages/Post/{Create,Show}.jsx',
                './Pages/Profile/Edit.jsx',
                './Pages/Reviews/Index.tsx',
                './Pages/Search/Index.jsx',
                './Pages/Static/*.jsx',
                './Pages/Story/Index.jsx',
                './Pages/User/Show.jsx',
            ]),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
