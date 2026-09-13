import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || 'coachingsinsikar';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => title ? `${title} | ${appName}` : appName,
        resolve: (name) =>
            resolvePageComponent(
                [`./Pages/${name}.jsx`, `./Pages/${name}.tsx`],
                import.meta.glob('./Pages/**/*.{jsx,tsx}')
            ),
        setup({ App, props }) {
            return <App {...props} />;
        },
    })
);
