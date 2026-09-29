import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/js/admin.jsx', 'resources/js/home.jsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        // Preload static module dependencies so route and icon chunks can be fetched
        // in parallel instead of creating a request chain after the app bundle runs.
        modulePreload: true,
    }
});
