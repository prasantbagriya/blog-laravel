import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx',
                'resources/js/admin.jsx',
                // home.jsx JS entry — CSS is deliberately excluded from here so that
                // @vite('resources/js/home.jsx') only injects a non-blocking <script>.
                'resources/js/home.jsx',
                // Home-page CSS loaded as separate entries so the Blade template can
                // apply the media="print" trick for non-blocking delivery.
                'resources/css/home.pcss',
            ],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        // Preload static module dependencies so route and icon chunks can be fetched
        // in parallel instead of creating a request chain after the app bundle runs.
        modulePreload: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/lucide-react')) {
                        return 'lucide-icons';
                    }
                }
            }
        }
    }
});

