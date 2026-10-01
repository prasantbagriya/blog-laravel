// CSS is loaded as separate Vite entries (see vite.config.js) so that
// @vite('resources/js/home.jsx') does NOT inject a blocking <link> tag.
// The Blade template handles CSS loading non-blockingly via media="print".

import { createRoot } from 'react-dom/client';
import Welcome from './Pages/Welcome';

const mount = document.getElementById('home-app');
const source = document.getElementById('home-props');

if (mount && source) {
    createRoot(mount).render(<Welcome {...JSON.parse(source.textContent || '{}')} />);
}
