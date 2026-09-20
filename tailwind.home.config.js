import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

// The public landing page has its own stylesheet. Restricting Tailwind's scan
// to its actual components prevents admin, editor, and dashboard utilities from
// being shipped to first-time homepage visitors.
export default {
    darkMode: 'class',
    content: [
        './resources/views/home.blade.php',
        './resources/js/Pages/Welcome.jsx',
        './resources/js/Pages/HomeComponents/**/*.jsx',
        './resources/js/NextComponents/GlobalNavbar.tsx',
        './resources/js/NextComponents/BlogFooter.tsx',
        './resources/js/NextComponents/BrandIcons.tsx',
        './resources/js/Components/AnimatedBorderCard.jsx',
        './resources/js/Components/ShareModal.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [forms],
};
